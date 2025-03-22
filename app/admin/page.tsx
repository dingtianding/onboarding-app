'use client';

import { useEffect, useState } from 'react';
import { getOnboardingConfig, updateOnboardingConfig } from '../../lib/api';

export default function AdminPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [aboutMePage, setAboutMePage] = useState(2);
  const [addressPage, setAddressPage] = useState(2);
  const [birthdatePage, setBirthdatePage] = useState(3);
  
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const configData = await getOnboardingConfig();
        setConfig(configData);
        
        // Set form values
        setAboutMePage(configData.aboutMePage);
        setAddressPage(configData.addressPage);
        setBirthdatePage(configData.birthdatePage);
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchConfig();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    // Validate that at least one component is on each page
    const page2Components = [
      aboutMePage === 2, 
      addressPage === 2, 
      birthdatePage === 2
    ].filter(Boolean).length;
    
    const page3Components = [
      aboutMePage === 3, 
      addressPage === 3, 
      birthdatePage === 3
    ].filter(Boolean).length;
    
    if (page2Components === 0 || page3Components === 0) {
      setError('Each page must have at least one component');
      setLoading(false);
      return;
    }
    
    try {
      await updateOnboardingConfig({
        aboutMePage,
        addressPage,
        birthdatePage
      });
      
      setSuccess('Configuration updated successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !config) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">Onboarding Flow Configuration</h1>
      
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Configure Components</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">About Me Component</h3>
            <div className="mt-2 space-x-4">
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  name="aboutMePage" 
                  value="2" 
                  checked={aboutMePage === 2}
                  onChange={() => setAboutMePage(2)}
                  className="form-radio"
                />
                <span className="ml-2">Page 2</span>
              </label>
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  name="aboutMePage" 
                  value="3" 
                  checked={aboutMePage === 3}
                  onChange={() => setAboutMePage(3)}
                  className="form-radio"
                />
                <span className="ml-2">Page 3</span>
              </label>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium">Address Component</h3>
            <div className="mt-2 space-x-4">
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  name="addressPage" 
                  value="2" 
                  checked={addressPage === 2}
                  onChange={() => setAddressPage(2)}
                  className="form-radio"
                />
                <span className="ml-2">Page 2</span>
              </label>
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  name="addressPage" 
                  value="3" 
                  checked={addressPage === 3}
                  onChange={() => setAddressPage(3)}
                  className="form-radio"
                />
                <span className="ml-2">Page 3</span>
              </label>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium">Birthdate Component</h3>
            <div className="mt-2 space-x-4">
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  name="birthdatePage" 
                  value="2" 
                  checked={birthdatePage === 2}
                  onChange={() => setBirthdatePage(2)}
                  className="form-radio"
                />
                <span className="ml-2">Page 2</span>
              </label>
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  name="birthdatePage" 
                  value="3" 
                  checked={birthdatePage === 3}
                  onChange={() => setBirthdatePage(3)}
                  className="form-radio"
                />
                <span className="ml-2">Page 3</span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button 
              type="submit" 
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
            >
              {loading ? 'Saving...' : 'Save Configuration'}
            </button>
            
            <a 
              href="/data"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View Data Table
            </a>
          </div>
        </form>
      </div>
    </main>
  );
} 