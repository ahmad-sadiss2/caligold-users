"use client"

import React, { useState } from 'react';
import PlacesAutocomplete from './PlacesAutocomplete';

interface Place {
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  class: string;
}

const PlacesAutocompleteTest = () => {
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [selectedPickup, setSelectedPickup] = useState<Place | null>(null);
  const [selectedDropoff, setSelectedDropoff] = useState<Place | null>(null);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Free Address Autocomplete Test</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pickup Address
          </label>
          <PlacesAutocomplete
            value={pickupAddress}
            onChange={setPickupAddress}
            placeholder="Enter pickup address"
            className="bg-white"
            isDarkTheme={false}
            onPlaceSelect={(place) => setSelectedPickup(place)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dropoff Address
          </label>
          <PlacesAutocomplete
            value={dropoffAddress}
            onChange={setDropoffAddress}
            placeholder="Enter dropoff address"
            className="bg-white"
            isDarkTheme={false}
            onPlaceSelect={(place) => setSelectedDropoff(place)}
          />
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2">Selected Addresses:</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <div>
              <strong>Pickup:</strong> {pickupAddress || 'None selected'}
              {selectedPickup && (
                <div className="text-xs text-gray-500 mt-1">
                  📍 {selectedPickup.lat}, {selectedPickup.lon} • {selectedPickup.type}
                </div>
              )}
            </div>
            <div>
              <strong>Dropoff:</strong> {dropoffAddress || 'None selected'}
              {selectedDropoff && (
                <div className="text-xs text-gray-500 mt-1">
                  📍 {selectedDropoff.lat}, {selectedDropoff.lon} • {selectedDropoff.type}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <h3 className="font-medium text-green-800 mb-2">✅ Free Features:</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• No API key required</li>
            <li>• No usage limits</li>
            <li>• US address autocomplete</li>
            <li>• Keyboard navigation (↑↓ arrows, Enter, Escape)</li>
            <li>• Address validation and coordinates</li>
            <li>• Works with addresses, businesses, landmarks</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Instructions:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Start typing (minimum 3 characters)</li>
            <li>• Use arrow keys to navigate suggestions</li>
            <li>• Press Enter to select highlighted suggestion</li>
            <li>• Press Escape to close suggestions</li>
            <li>• Click on any suggestion to select it</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlacesAutocompleteTest; 