import BackendWakeUp from '../components/util/BackendWakeUp';
import Navigation from '../components/layout/Navigation';
import '@/styles/globals.css';

export const metadata = {
  title: 'Onboarding Application',
  description: 'Complete your profile to get started',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Mulish:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="h-screen overflow-hidden bg-gray-50 font-[Mulish] flex flex-col">
        <aside className="bg-emerald-50 text-center py-2 px-4 text-sm font-medium">
          <div>Welcome to the Onboarding Portal</div>
        </aside>

        <Navigation />
        
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex items-center justify-center px-4">
            {children}
          </div>
        </main>
        
        <footer className="bg-emerald-50 py-6">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <div className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Onboarding App. All rights reserved.
            </div>
          </div>
        </footer>
        
        <BackendWakeUp />
      </body>
    </html>
  )
}
