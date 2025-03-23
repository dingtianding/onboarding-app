import React from 'react';

interface BirthdateFormProps {
  birthdate: string;
  setBirthdate: (value: string) => void;
}

export default function BirthdateForm({ birthdate, setBirthdate }: BirthdateFormProps) {
  return (
    <div>
      <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">Birthdate</label>
      <input 
        type="date" 
        id="birthdate" 
        value={birthdate}
        onChange={(e) => setBirthdate(e.target.value)}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
} 