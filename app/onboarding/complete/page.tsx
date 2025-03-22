'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CompletePage() {
  const router = useRouter();
  
  useEffect(() => {
    // Check if user is authenticated
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/');
    }
  }, [router]);
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md text-center">
        <svg 
          className="mx-auto h-12 w-12 text-green-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
        
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Onboarding Complete!</h2>
        <p className="mt-2 text-gray-600">Thank you for completing your profile.</p>
        
        <div className="mt-6 space-x-4">
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to Home
          </Link>
          
          <Link 
            href="/data"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Data Table
          </Link>
        </div>
      </div>
    </main>
  );
} 