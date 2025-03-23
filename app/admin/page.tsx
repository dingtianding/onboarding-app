'use client';

import { useState, useEffect } from 'react';
import { getOnboardingConfig, updateOnboardingConfig, getAllUsers } from '../../lib/api';
import Link from 'next/link';

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  
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
        
        // Fetch users
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (err: any) {
        console.error('Error fetching admin data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

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

  if (loading && users.length === 0) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="w-full max-w-6xl h-full overflow-auto py-8">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Onboarding Configuration</h2>
          <p className="text-gray-600 mb-4">
            Configure which components appear on which steps of the onboarding process.
          </p>
          
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
            
            <button 
              onClick={handleSaveConfig}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
            >
              {loading ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </div>
        
        {/* User Data Panel */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">User Data</h2>
          <p className="text-gray-600 mb-4">
            View all users and their onboarding progress.
          </p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Step
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.onboardingComplete ? 'Complete' : `Step ${user.onboardingStep}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.onboardingComplete ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Complete
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            In Progress
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 