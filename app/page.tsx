'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, registerUser, getUserById } from '../lib/api';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [existingSession, setExistingSession] = useState<{userId: string, step: number} | null>(null);

  // Check if user is already logged in but don't redirect
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const userId = localStorage.getItem('userId');
        
        if (userId) {
          console.log('Found existing user ID in localStorage:', userId);
          
          try {
            // Get user data to determine current onboarding step
            const userData = await getUserById(userId);
            console.log('Retrieved user data:', userData);
            
            if (userData && !userData.onboardingComplete && userData.onboardingStep > 1) {
              // Store the existing session info but don't redirect
              setExistingSession({
                userId,
                step: userData.onboardingStep
              });
            }
          } catch (err) {
            console.error('Error fetching user data:', err);
            // If we can't get user data, clear localStorage
            localStorage.removeItem('userId');
          }
        }
      } catch (err) {
        console.error('Error checking session:', err);
      } finally {
        setInitialLoading(false);
      }
    };
    
    checkExistingSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // First, try to register a new user
      console.log('Registering new user with email:', email);
      try {
        const newUser = await registerUser({ email, password });
        console.log('User registered successfully:', newUser);
        
        if (newUser && newUser.user && newUser.user._id) {
          localStorage.setItem('userId', newUser.user._id);
          router.push('/onboarding/1'); // New users always start at step 1
        } else {
          console.error('User registered but no ID returned:', newUser);
          setError('Account created but unable to proceed. Please try logging in again.');
        }
      } catch (registerErr: any) {
        console.log('User registration error:', registerErr);
        
        // If registration fails, try to log in
        console.log('Attempting to login with email:', email);
        try {
          const userData = await loginUser({ email, password });
          console.log('Login successful:', userData);
          
          if (userData && userData.user && userData.user._id) {
            localStorage.setItem('userId', userData.user._id);
            
            // Redirect based on onboarding status
            if (userData.user.onboardingComplete) {
              console.log('Onboarding complete, redirecting to complete page');
              router.push('/onboarding/complete');
            } else {
              // Get the current onboarding step or default to 1
              const currentStep = userData.user.onboardingStep || 1;
              console.log(`Onboarding incomplete, redirecting to step ${currentStep}`);
              router.push(`/onboarding/${currentStep}`);
            }
          } else {
            console.error('Login successful but no user ID returned:', userData);
            setError('Login successful but unable to proceed. Please try again.');
          }
        } catch (loginErr: any) {
          console.error('Login error:', loginErr);
          
          // Check for specific login errors
          if (loginErr.response?.status === 401) {
            setError('Incorrect password. Please try again.');
          } else {
            setError('Login failed. Please check your credentials and try again.');
          }
        }
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueExistingSession = () => {
    if (existingSession) {
      router.push(`/onboarding/${existingSession.step}`);
    }
  };

  const handleStartNewSession = () => {
    // Clear the existing session
    localStorage.removeItem('userId');
    setExistingSession(null);
  };

  // Progress indicator component
  const ProgressIndicator = () => (
    <div className="mb-6">
      <div className="flex items-center">
        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 border-2 border-indigo-600 rounded-full">
          <span className="font-medium text-indigo-600">1</span>
        </div>
        <div className="ml-4 w-full bg-gray-200 h-1">
          <div className="bg-gray-200 h-1"></div>
        </div>
        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 border-2 border-gray-300 rounded-full">
          <span className="font-medium text-gray-500">2</span>
        </div>
        <div className="ml-4 w-full bg-gray-200 h-1">
          <div className="bg-gray-200 h-1"></div>
        </div>
        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 border-2 border-gray-300 rounded-full">
          <span className="font-medium text-gray-500">3</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto">
      {existingSession ? (
        <div className="bg-white rounded-lg shadow-md mb-4 p-6">
          <h2 className="text-xl font-semibold mb-4">You have an incomplete onboarding process</h2>
          <p className="mb-4">Would you like to continue where you left off or start a new session?</p>
          <div className="flex space-x-4">
            <button 
              onClick={handleContinueExistingSession}
              className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Continue
            </button>
            <button 
              onClick={handleStartNewSession}
              className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Start New
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Step 1: Create Your Account</h2>
          
          {/* Add the progress indicator */}
          <ProgressIndicator />
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
            >
              {loading ? 'Processing...' : 'Continue'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
} 