'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserById, updateUser, getOnboardingConfig } from '../../../lib/api';
import AboutMeForm from '../../../components/forms/AboutMeForm';
import AddressForm from '../../../components/forms/AddressForm';
import BirthdateForm from '../../../components/forms/BirthdateForm';
import { motion } from 'framer-motion'; // You'll need to install framer-motion

type PageProps = {
  params: {
    step: string;
  };
};

type FormField = 'aboutMe' | 'address' | 'birthdate' | 'email' | 'password';
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
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    aboutMe: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: ''
    },
    birthdate: ''
  });
  
  const updateFormField = (field: FormField, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
    // Clear validation error when field is updated
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const updated = {...prev};
        delete updated[field];
        return updated;
      });
    }
  };

  const updateAddressField = (field: AddressField, value: string) => {
    setFormData(prev => ({
      ...prev, 
      address: {...prev.address, [field]: value}
    }));
    // Clear validation error when address field is updated
    if (validationErrors[`address.${field}`]) {
      setValidationErrors(prev => {
        const updated = {...prev};
        delete updated[`address.${field}`];
        return updated;
      });
    }
  };
  
  const setDefaultCredentials = () => {
    updateFormField('email', 'user@example.com');
    updateFormField('password', 'Password123!');
  };
  
  const setDefaultAboutMe = () => {
    updateFormField('aboutMe', 'I am a software engineer with 5 years of experience in web development.');
  };
  
  const setDefaultAddress = () => {
    updateAddressField('street', '123 Main Street');
    updateAddressField('city', 'San Francisco');
    updateAddressField('state', 'CA');
    updateAddressField('zip', '94105');
  };
  
  const setDefaultBirthdate = () => {
    updateFormField('birthdate', '1990-01-15');
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
        
        try {
          const userData = await getUserById(userId);
          setUser(userData);
          
          // Prefill form with existing data if available
          if (userData.email) updateFormField('email', userData.email);
          if (userData.aboutMe) updateFormField('aboutMe', userData.aboutMe);
          if (userData.address) {
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
      }
    };
    
    fetchData();
  }, [router, step]);
  
  // Determine which components to show on this page
  const showCredentials = step === 1;
  const showAboutMe = config?.aboutMePage === step;
  const showAddress = config?.addressPage === step;
  const showBirthdate = config?.birthdatePage === step;
  
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (showAboutMe && !formData.aboutMe.trim()) {
      errors.aboutMe = 'Please tell us about yourself';
    }
    
    if (showAddress) {
      if (!formData.address.street.trim()) {
        errors['address.street'] = 'Street address is required';
      }
      if (!formData.address.city.trim()) {
        errors['address.city'] = 'City is required';
      }
      if (!formData.address.state.trim()) {
        errors['address.state'] = 'State is required';
      }
      if (!formData.address.zip.trim()) {
        errors['address.zip'] = 'ZIP code is required';
      } else if (!/^\d{5}(-\d{4})?$/.test(formData.address.zip)) {
        errors['address.zip'] = 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)';
      }
    }
    
    if (showBirthdate && !formData.birthdate) {
      errors.birthdate = 'Please enter your birthdate';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate form before submission
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = document.querySelector('.error-message');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setSubmitting(true);
    
    try {
      if (!user || !user._id) {
        throw new Error('User data not available');
      }
      
      const updateData: any = {
        onboardingStep: step === 2 ? 3 : 4,
        onboardingComplete: step === 3
      };
      
      if (showCredentials) {
        updateData.email = formData.email;
        // Don't send password in clear text to update endpoint
        // This would be handled by a proper auth flow
      }
      
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
      
      // Set loading to true to show transition animation
      setLoading(true);
      
      // Short delay for animation
      setTimeout(() => {
        // Redirect to next step or completion
        router.push(step === 3 ? '/onboarding/complete' : `/onboarding/${step + 1}`);
      }, 500);
      
    } catch (err: any) {
      console.error('Submit error:', err);
      setError('Failed to save data. Please try again.');
      setSubmitting(false);
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Complete Your Profile</h1>
      
      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      ) : (
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex items-center">
              <motion.div 
                className={`flex-shrink-0 flex items-center justify-center w-8 h-8 border-2 ${step >= 1 ? 'border-indigo-600' : 'border-gray-300'} rounded-full`}
                initial={{ scale: 0.9 }}
                animate={{ scale: step === 1 ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <span className={`font-medium ${step >= 1 ? 'text-indigo-600' : 'text-gray-500'}`}>1</span>
              </motion.div>
              <div className="ml-4 w-full bg-gray-200 h-1">
                <motion.div 
                  className="bg-indigo-600 h-1"
                  initial={{ width: "0%" }}
                  animate={{ width: step > 1 ? "100%" : "0%" }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                ></motion.div>
              </div>
              <motion.div 
                className={`flex-shrink-0 flex items-center justify-center w-8 h-8 border-2 ${step >= 2 ? 'border-indigo-600' : 'border-gray-300'} rounded-full`}
                initial={{ scale: 0.9 }}
                animate={{ scale: step === 2 ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <span className={`font-medium ${step >= 2 ? 'text-indigo-600' : 'text-gray-500'}`}>2</span>
              </motion.div>
              <div className="ml-4 w-full bg-gray-200 h-1">
                <motion.div 
                  className="bg-indigo-600 h-1"
                  initial={{ width: "0%" }}
                  animate={{ width: step > 2 ? "100%" : "0%" }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                ></motion.div>
              </div>
              <motion.div 
                className={`flex-shrink-0 flex items-center justify-center w-8 h-8 border-2 ${step >= 3 ? 'border-indigo-600' : 'border-gray-300'} rounded-full`}
                initial={{ scale: 0.9 }}
                animate={{ scale: step === 3 ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <span className={`font-medium ${step >= 3 ? 'text-indigo-600' : 'text-gray-500'}`}>3</span>
              </motion.div>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">
            Step {step}: {step === 1 ? 'Create Account' : (step === 2 ? 'Personal Information' : 'Additional Details')}
          </h2>
          
          {error && (
            <motion.div 
              className="mb-4 p-3 bg-red-100 text-red-700 rounded"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {showCredentials && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => updateFormField('email', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      id="password"
                      value={formData.password}
                      onChange={(e) => updateFormField('password', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={setDefaultCredentials}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Use default credentials
                </button>
              </motion.div>
            )}
            
            {showAboutMe && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <AboutMeForm aboutMe={formData.aboutMe} setAboutMe={(value) => updateFormField('aboutMe', value)} />
                {validationErrors.aboutMe && (
                  <p className="mt-1 text-sm text-red-600 error-message">{validationErrors.aboutMe}</p>
                )}
                <button 
                  type="button"
                  onClick={setDefaultAboutMe}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Use default text
                </button>
              </motion.div>
            )}
            
            {showAddress && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <AddressForm 
                  street={formData.address.street}
                  city={formData.address.city}
                  state={formData.address.state}
                  zip={formData.address.zip}
                  setStreet={(value) => updateAddressField('street', value)}
                  setCity={(value) => updateAddressField('city', value)}
                  setState={(value) => updateAddressField('state', value)}
                  setZip={(value) => updateAddressField('zip', value)}
                  errors={{
                    street: validationErrors['address.street'],
                    city: validationErrors['address.city'],
                    state: validationErrors['address.state'],
                    zip: validationErrors['address.zip']
                  }}
                />
                <button 
                  type="button"
                  onClick={setDefaultAddress}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Use default address
                </button>
              </motion.div>
            )}
            
            {showBirthdate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <BirthdateForm birthdate={formData.birthdate} setBirthdate={(value) => updateFormField('birthdate', value)} />
                {validationErrors.birthdate && (
                  <p className="mt-1 text-sm text-red-600 error-message">{validationErrors.birthdate}</p>
                )}
                <button 
                  type="button"
                  onClick={setDefaultBirthdate}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Use default date
                </button>
              </motion.div>
            )}
            
            <motion.button 
              type="submit" 
              disabled={submitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {submitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                step === 3 ? 'Complete' : 'Continue'
              )}
            </motion.button>
          </form>
        </motion.div>
      )}
    </div>
  );
} 