'use client';

import { useEffect, useState } from 'react';
import { getAllUsers } from '../../lib/api';

export default function DataPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [clearingDb, setClearingDb] = useState(false);
  const [clearSuccess, setClearSuccess] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await getAllUsers();
        setUsers(userData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleClearDatabase = async () => {
    if (window.confirm('Are you sure you want to clear the entire database? This action cannot be undone.')) {
      setClearingDb(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const url = `${apiUrl}/users/clear-all`;
        console.log('Calling clear database endpoint:', url);
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('Clear database response status:', response.status);
        
        if (!response.ok) {
          // If the endpoint doesn't exist on the deployed version, show a more helpful message
          if (response.status === 404) {
            throw new Error('The clear database endpoint exists locally but not on the deployed server. Please deploy your backend changes.');
          }
          
          const errorText = await response.text();
          console.error('Clear database error response:', errorText);
          throw new Error(errorText || `Server responded with status ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Clear database success:', result);
        
        setClearSuccess(true);
        setUsers([]);
        setTimeout(() => setClearSuccess(false), 3000);
      } catch (err: any) {
        console.error('Error clearing database:', err);
        setError(`Failed to clear database: ${err.message}`);
      } finally {
        setClearingDb(false);
      }
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center p-8">
        <div className="p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl h-full overflow-auto py-8">
      <h1 className="text-3xl font-bold mb-8">User Data</h1>
      
      <div className="w-full max-w-6xl overflow-x-auto">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">All Users ({users.length})</h2>
          
          <button 
            onClick={handleClearDatabase}
            disabled={clearingDb}
            className="px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {clearingDb ? 'Clearing...' : 'Clear Database'}
          </button>
        </div>
        
        {clearSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            Database cleared successfully!
          </div>
        )}
        
        {users.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded">
            No users have signed up yet.
          </div>
        ) : (
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">About Me</th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birthdate</th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {user.aboutMe || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.address?.street ? (
                      <div>
                        <div>{user.address.street}</div>
                        <div>{user.address.city}, {user.address.state} {user.address.zip}</div>
                      </div>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.birthdate ? new Date(user.birthdate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user.onboardingComplete ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Complete
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Step {user.onboardingStep}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 