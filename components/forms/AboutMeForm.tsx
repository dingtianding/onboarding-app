import React from 'react';

interface AboutMeFormProps {
  aboutMe: string;
  setAboutMe: (value: string) => void;
}

export default function AboutMeForm({ aboutMe, setAboutMe }: AboutMeFormProps) {
  return (
    <div>
      <label htmlFor="aboutMe" className="block text-sm font-medium text-gray-700">About Me</label>
      <textarea 
        id="aboutMe" 
        value={aboutMe}
        onChange={(e) => setAboutMe(e.target.value)}
        rows={4}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      ></textarea>
    </div>
  );
} 