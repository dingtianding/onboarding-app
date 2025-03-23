import React from 'react';

type AddressFormProps = {
  street: string;
  city: string;
  state: string;
  zip: string;
  setStreet: (value: string) => void;
  setCity: (value: string) => void;
  setState: (value: string) => void;
  setZip: (value: string) => void;
  errors?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
};

export default function AddressForm({
  street,
  city,
  state,
  zip,
  setStreet,
  setCity,
  setState,
  setZip,
  errors = {}
}: AddressFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Your Address</h3>
      
      <div>
        <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street Address</label>
        <input
          type="text"
          id="street"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          className={`mt-1 block w-full px-3 py-2 border ${
            errors.street ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
        />
        {errors.street && (
          <p className="mt-1 text-sm text-red-600 error-message">{errors.street}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
        <input
          type="text"
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={`mt-1 block w-full px-3 py-2 border ${
            errors.city ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
        />
        {errors.city && (
          <p className="mt-1 text-sm text-red-600 error-message">{errors.city}</p>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
          <input
            type="text"
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.state ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          />
          {errors.state && (
            <p className="mt-1 text-sm text-red-600 error-message">{errors.state}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="zip" className="block text-sm font-medium text-gray-700">ZIP Code</label>
          <input
            type="text"
            id="zip"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.zip ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          />
          {errors.zip && (
            <p className="mt-1 text-sm text-red-600 error-message">{errors.zip}</p>
          )}
        </div>
      </div>
    </div>
  );
} 