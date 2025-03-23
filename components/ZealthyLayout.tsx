'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

type ZealthyLayoutProps = {
  children: ReactNode;
};

export default function ZealthyLayout({ children }: ZealthyLayoutProps) {
  const pathname = usePathname();
  
  return (
    <div className="min-h-screen bg-zealthy-secondary">
      {/* Header */}
      <header className="bg-white shadow-zealthy">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <span className="text-zealthy-primary font-display font-bold text-2xl">GetZealthy</span>
            <span className="text-zealthy-dark font-display ml-2">Onboarding</span>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <NavLink href="/" label="Home" pathname={pathname} />
            <NavLink href="/dashboard" label="Dashboard" pathname={pathname} />
            <NavLink href="/settings" label="Settings" pathname={pathname} />
          </nav>
          
          {/* Mobile menu button */}
          <button className="md:hidden text-zealthy-dark">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-zealthy-dark text-zealthy-light py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-zealthy-primary font-display font-bold text-xl">GetZealthy</span>
              <p className="mt-2 text-sm">Empowering healthier lives through technology</p>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-zealthy-light hover:text-zealthy-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-zealthy-light hover:text-zealthy-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-zealthy-light hover:text-zealthy-primary transition-colors">
                Contact Us
              </a>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-zealthy-gray">
            &copy; {new Date().getFullYear()} GetZealthy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

// Navigation link component
function NavLink({ href, label, pathname }: { href: string; label: string; pathname: string }) {
  const isActive = pathname === href;
  
  return (
    <Link 
      href={href} 
      className={`font-medium transition-colors ${
        isActive 
          ? 'text-zealthy-primary border-b-2 border-zealthy-primary' 
          : 'text-zealthy-dark hover:text-zealthy-primary'
      }`}
    >
      {label}
    </Link>
  );
} 