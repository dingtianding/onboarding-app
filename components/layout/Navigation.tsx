'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-emerald-600 font-semibold text-xl">
          Onboarding App
        </Link>
        
        {/* Navigation buttons */}
        <nav className="flex space-x-4">
          <Link 
            href="/admin" 
            className={`px-4 py-2 rounded-md transition-colors ${
              pathname === '/admin' 
                ? 'bg-emerald-50 text-emerald-600 font-medium' 
                : 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            Admin
          </Link>
          <Link 
            href="/data" 
            className={`px-4 py-2 rounded-md transition-colors ${
              pathname === '/data' 
                ? 'bg-emerald-50 text-emerald-600 font-medium' 
                : 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            Data
          </Link>
        </nav>
      </div>
    </header>
  );
} 