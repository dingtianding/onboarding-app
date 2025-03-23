'use client';

import { useEffect, useState } from 'react';

export default function BackendWakeUp() {
  const [status, setStatus] = useState<'idle' | 'waking' | 'awake' | 'error'>('idle');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    const wakeUpBackend = async () => {
      if (typeof window === 'undefined') return;
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      if (!apiUrl) return;
      
      try {
        setStatus('waking');
        setStartTime(Date.now());
        
        const timer = setInterval(() => {
          if (startTime) {
            setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
          }
        }, 1000);
        
        const response = await fetch(`${apiUrl}/ping`, { 
          method: 'GET',
          headers: { 'Wake-Up': 'true' }
        });
        
        clearInterval(timer);
        
        if (response.ok) {
          setStatus('awake');
        } else {
          setStatus('error');
        }
      } catch (error) {
        setStatus('error');
      }
    };
    
    wakeUpBackend();
  }, []);
  
  if (status === 'waking' && elapsedTime > 3) {
    return (
      <div className="fixed bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg max-w-xs z-40 text-sm border border-blue-100">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
          <p>
            Waking up server... {elapsedTime}s
            {elapsedTime > 10 && " (This may take up to a minute)"}
          </p>
        </div>
      </div>
    );
  }
  
  return null;
} 