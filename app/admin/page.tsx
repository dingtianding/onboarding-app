'use client';

import { useState, useEffect } from 'react';
import { getOnboardingConfig, updateOnboardingConfig } from '../../lib/api';
import Link from 'next/link';

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [configWarning, setConfigWarning] = useState('');
  
  // Config state
  const [aboutMePage, setAboutMePage] = useState(2);
  const [addressPage, setAddressPage] = useState(2);
  const [birthdatePage, setBirthdatePage] = useState(3);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch configuration
        const config = await getOnboardingConfig();
        if (config) {
          setAboutMePage(config.aboutMePage || 2);
          setAddressPage(config.addressPage || 2);
          setBirthdatePage(config.birthdatePage || 3);
        }
      } catch (err: any) {
        console.error('Error fetching admin data:', err);
        setError('Failed to load configuration data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Check if the current configuration would result in empty steps
  useEffect(() => {
    // Create a map to count components per step
    const componentsPerStep = new Map<number, number>();
    componentsPerStep.set(2, 0);
    componentsPerStep.set(3, 0);
    
    // Count components for each step
    if (aboutMePage === 2) componentsPerStep.set(2, (componentsPerStep.get(2) || 0) + 1);
    if (aboutMePage === 3) componentsPerStep.set(3, (componentsPerStep.get(3) || 0) + 1);
    
    if (addressPage === 2) componentsPerStep.set(2, (componentsPerStep.get(2) || 0) + 1);
    if (addressPage === 3) componentsPerStep.set(3, (componentsPerStep.get(3) || 0) + 1);
    
    if (birthdatePage === 2) componentsPerStep.set(2, (componentsPerStep.get(2) || 0) + 1);
    if (birthdatePage === 3) componentsPerStep.set(3, (componentsPerStep.get(3) || 0) + 1);
    
    // Check for empty steps
    const emptySteps = [];
    if (componentsPerStep.get(2) === 0) emptySteps.push(2);
    if (componentsPerStep.get(3) === 0) emptySteps.push(3);
    
    if (emptySteps.length > 0) {
      setConfigWarning(`Warning: Step${emptySteps.length > 1 ? 's' : ''} ${emptySteps.join(' and ')} ${emptySteps.length > 1 ? 'have' : 'has'} no components assigned. Each step should have at least one component.`);
    } else {
      setConfigWarning('');
    }
  }, [aboutMePage, addressPage, birthdatePage]);

  const handleSaveConfig = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const config = {
        aboutMePage,
        addressPage,
        birthdatePage
      };
      
      await updateOnboardingConfig(config);
      setSuccess('Configuration saved successfully');
    } catch (err: any) {
      console.error('Error saving config:', err);
      setError('Failed to save configuration');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link href="/" className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          Back to Home
        </Link>
      </div>
      
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Configuration Panel - Left Side */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Onboarding Configuration</h2>
          <p className="text-gray-600 mb-4">
            Configure which components appear on which steps of the onboarding process.
          </p>
          
          {configWarning && (
            <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded border-l-4 border-yellow-500">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">{configWarning}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                About Me Section
              </label>
              <select 
                value={aboutMePage}
                onChange={(e) => setAboutMePage(parseInt(e.target.value))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value={2}>Step 2</option>
                <option value={3}>Step 3</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Section
              </label>
              <select 
                value={addressPage}
                onChange={(e) => setAddressPage(parseInt(e.target.value))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value={2}>Step 2</option>
                <option value={3}>Step 3</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birthdate Section
              </label>
              <select 
                value={birthdatePage}
                onChange={(e) => setBirthdatePage(parseInt(e.target.value))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value={2}>Step 2</option>
                <option value={3}>Step 3</option>
              </select>
            </div>
            
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
              <p className="font-medium text-blue-800">Important:</p>
              <p className="mt-1">Each step must have at least one component assigned to it. Empty steps will cause errors in the onboarding flow.</p>
            </div>
            
            <button 
              onClick={handleSaveConfig}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
            >
              {loading ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </div>
        
        {/* Component Preview - Right Side */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Component Preview</h2>
          <p className="text-gray-600 mb-4">
            This is a preview of how the components will be distributed across the onboarding steps.
          </p>
          
          <div className="mt-6 space-y-6">
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-700 font-semibold rounded-full mr-2">
                  2
                </div>
                <h3 className="font-medium text-lg">Step 2 Components</h3>
              </div>
              
              <ul className="space-y-2 pl-10">
                {aboutMePage === 2 && (
                  <li className="flex items-center text-sm">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    About Me Form
                  </li>
                )}
                {addressPage === 2 && (
                  <li className="flex items-center text-sm">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Address Form
                  </li>
                )}
                {birthdatePage === 2 && (
                  <li className="flex items-center text-sm">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Birthdate Form
                  </li>
                )}
                {aboutMePage !== 2 && addressPage !== 2 && birthdatePage !== 2 && (
                  <li className="flex items-center text-sm text-red-500">
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    No components assigned to this step
                  </li>
                )}
              </ul>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-700 font-semibold rounded-full mr-2">
                  3
                </div>
                <h3 className="font-medium text-lg">Step 3 Components</h3>
              </div>
              
              <ul className="space-y-2 pl-10">
                {aboutMePage === 3 && (
                  <li className="flex items-center text-sm">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    About Me Form
                  </li>
                )}
                {addressPage === 3 && (
                  <li className="flex items-center text-sm">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Address Form
                  </li>
                )}
                {birthdatePage === 3 && (
                  <li className="flex items-center text-sm">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Birthdate Form
                  </li>
                )}
                {aboutMePage !== 3 && addressPage !== 3 && birthdatePage !== 3 && (
                  <li className="flex items-center text-sm text-red-500">
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    No components assigned to this step
                  </li>
                )}
              </ul>
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
              <h4 className="font-medium text-sm text-gray-700 mb-2">How to use this preview:</h4>
              <ul className="text-xs text-gray-600 space-y-1 list-disc pl-5">
                <li>Each step must have at least one component assigned</li>
                <li>Change the dropdown selections to move components between steps</li>
                <li>The preview updates in real-time as you make changes</li>
                <li>Click "Save Configuration" to apply your changes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 