import React from 'react';

interface AddressFormProps {
  street: string;
  city: string;
  state: string;
  zip: string;
  setStreet: (value: string) => void;
  setCity: (value: string) => void;
  setState: (value: string) => void;
  setZip: (value: string) => void;
}

export default function AddressForm({ 
  street, 
  city, 
  state, 
  zip, 
  setStreet, 
  setCity, 
  setState, 
  setZip 
}: AddressFormProps) {
  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street Address</label>
        <input 
          type="text" 
          id="street" 
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
        <input 
          type="text" 
          id="city" 
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
          <input 
            type="text" 
            id="state" 
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="zip" className="block text-sm font-medium text-gray-700">ZIP Code</label>
          <input 
            type="text" 
            id="zip" 
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
    </div>
  );
} 