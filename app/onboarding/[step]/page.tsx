'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserById, updateUser, getOnboardingConfig } from '../../../lib/api';
import AboutMeForm from '../../../components/forms/AboutMeForm';
import AddressForm from '../../../components/forms/AddressForm';
import BirthdateForm from '../../../components/forms/BirthdateForm';

type PageProps = {
  params: {
    step: string;
  };
};

type FormField = 'aboutMe' | 'address' | 'birthdate';
type AddressField = 'street' | 'city' | 'state' | 'zip';

export default function OnboardingStep({ params }: PageProps) {
  const router = useRouter();

  const step = parseInt(params.step);
  
  const [user, setUser] = useState<any>(null);
  const [config, setConfig] = useState<any>({
    aboutMePage: 2,
    addressPage: 2,
    birthdatePage: 3
  }); // Default config
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    aboutMe: 'I am a software engineer with 5 years of experience in web development.',
    address: {
      street: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105'
    },
    birthdate: '1990-01-15'
  });
  
  const updateFormField = (field: FormField, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const updateAddressField = (field: AddressField, value: string) => {
    setFormData(prev => ({
      ...prev, 
      address: {...prev.address, [field]: value}
    }));
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user ID from localStorage
        const userId = localStorage.getItem('userId');
        if (!userId) {
          router.push('/');
          return;
        }
        
        // Fetch user data
        try {
          const userData = await getUserById(userId);
          setUser(userData);
          
          // Prefill form with existing data if available
          if (userData.aboutMe) updateFormField('aboutMe', userData.aboutMe);
          if (userData.address) {
            // Fix: Check if address exists before accessing properties
            userData.address.street && updateAddressField('street', userData.address.street);
            userData.address.city && updateAddressField('city', userData.address.city);
            userData.address.state && updateAddressField('state', userData.address.state);
            userData.address.zip && updateAddressField('zip', userData.address.zip);
          }
          if (userData.birthdate) {
            updateFormField('birthdate', new Date(userData.birthdate).toISOString().split('T')[0]);
          }
          
          // Check if user should be on this step
          if (userData.onboardingStep !== step && userData.onboardingStep < 4) {
            router.push(`/onboarding/${userData.onboardingStep}`);
            return;
          }
        } catch (userError) {
          console.error('Error fetching user:', userError);
          // Continue with default values
        }
        
        // Fetch config data
        try {
          const configData = await getOnboardingConfig();
          if (configData) {
            setConfig(configData);
          }
        } catch (configError) {
          console.error('Error fetching config:', configError);
          // Continue with default config
        }
      } catch (err: any) {
        console.error('General error:', err);
        setError('Failed to load data. Please try again.');
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
      if (!user || !user._id) {
        throw new Error('User data not available');
      }
      
      const updateData: any = {
        onboardingStep: step === 2 ? 3 : 4,
        onboardingComplete: step === 3
      };
      
      if (showAboutMe) {
        updateData.aboutMe = formData.aboutMe;
      }
      
      if (showAddress) {
        updateData.address = {
          street: formData.address.street,
          city: formData.address.city,
          state: formData.address.state,
          zip: formData.address.zip
        };
      }
      
      if (showBirthdate && formData.birthdate) {
        updateData.birthdate = new Date(formData.birthdate);
      }
      
      await updateUser(user._id, updateData);
      
      // Redirect to next step or completion
      router.push(step === 2 ? '/onboarding/3' : '/onboarding/complete');
    } catch (err: any) {
      console.error('Submit error:', err);
      setError('Failed to save data. Please try again.');
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
            <AboutMeForm aboutMe={formData.aboutMe} setAboutMe={(value) => updateFormField('aboutMe', value)} />
          )}
          
          {showAddress && (
            <AddressForm 
              street={formData.address.street}
              city={formData.address.city}
              state={formData.address.state}
              zip={formData.address.zip}
              setStreet={(value) => updateAddressField('street', value)}
              setCity={(value) => updateAddressField('city', value)}
              setState={(value) => updateAddressField('state', value)}
              setZip={(value) => updateAddressField('zip', value)}
            />
          )}
          
          {showBirthdate && (
            <BirthdateForm birthdate={formData.birthdate} setBirthdate={(value) => updateFormField('birthdate', value)} />
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