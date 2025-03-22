'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserById, updateUser, getOnboardingConfig } from '../../../lib/api';

export default function OnboardingStep({ params }: { params: { step: string } }) {
  const router = useRouter();
  const step = parseInt(params.step);
  
  const [user, setUser] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form state
  const [aboutMe, setAboutMe] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [birthdate, setBirthdate] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user ID from localStorage
        const userId = localStorage.getItem('userId');
        if (!userId) {
          router.push('/');
          return;
        }
        
        // Fetch user and config data
        const [userData, configData] = await Promise.all([
          getUserById(userId),
          getOnboardingConfig()
        ]);
        
        setUser(userData);
        setConfig(configData);
        
        // Prefill form with existing data
        if (userData.aboutMe) setAboutMe(userData.aboutMe);
        if (userData.address) {
          setStreet(userData.address.street || '');
          setCity(userData.address.city || '');
          setState(userData.address.state || '');
          setZip(userData.address.zip || '');
        }
        if (userData.birthdate) {
          setBirthdate(new Date(userData.birthdate).toISOString().split('T')[0]);
        }
        
        // Check if user should be on this step
        if (userData.onboardingStep !== step) {
          router.push(`/onboarding/${userData.onboardingStep}`);
          return;
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [router, step]);
  
  // Determine which components to show on this page
  const showAboutMe = config?.aboutMePage === step;
  const showAddress = config?.addressPage === step;
  const showBirthdate = config?.birthdatePage === step;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const updateData: any = {
        onboardingStep: step === 2 ? 3 : 4,
        onboardingComplete: step === 3
      };
      
      if (showAboutMe) {
        updateData.aboutMe = aboutMe;
      }
      
      if (showAddress) {
        updateData.address = {
          street,
          city,
          state,
          zip
        };
      }
      
      if (showBirthdate && birthdate) {
        updateData.birthdate = new Date(birthdate);
      }
      
      await updateUser(user._id, updateData);
      
      // Redirect to next step or completion
      router.push(step === 2 ? '/onboarding/3' : '/onboarding/complete');
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-8">Complete Your Profile</h1>
      
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 border-2 border-indigo-600 rounded-full">
              <span className="text-indigo-600 font-medium">1</span>
            </div>
            <div className="ml-4 w-full bg-gray-200 h-1">
              <div className="bg-indigo-600 h-1 w-full"></div>
            </div>
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 border-2 border-indigo-600 rounded-full">
              <span className={`font-medium ${step === 2 ? 'text-indigo-600' : 'text-gray-500'}`}>2</span>
            </div>
            <div className="ml-4 w-full bg-gray-200 h-1">
              <div className={`h-1 ${step > 2 ? 'bg-indigo-600 w-full' : 'w-0'}`}></div>
            </div>
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 border-2 border-gray-300 rounded-full">
              <span className={`font-medium ${step === 3 ? 'text-indigo-600' : 'text-gray-500'}`}>3</span>
            </div>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold mb-4">Step {step}: {step === 2 ? 'Personal Information' : 'Additional Details'}</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {showAboutMe && (
            <div>
              <label htmlFor="aboutMe" className="block text-sm font-medium text-gray-700">About Me</label>
              <textarea 
                id="aboutMe" 
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
            </div>
          )}
          
          {showAddress && (
            <div className="space-y-3">
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street Address</label>
                <input 
                  type="text" 
                  id="street" 
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <input 
                  type="text" 
                  id="city" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                  <input 
                    type="text" 
                    id="state" 
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="zip" className="block text-sm font-medium text-gray-700">ZIP Code</label>
                  <input 
                    type="text" 
                    id="zip" 
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}
          
          {showBirthdate && (
            <div>
              <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">Birthdate</label>
              <input 
                type="date" 
                id="birthdate" 
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
          >
            {loading ? 'Processing...' : (step === 3 ? 'Complete' : 'Continue')}
          </button>
        </form>
      </div>
    </main>
  );
} 