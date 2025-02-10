import React from 'react';
import { MapPin } from 'lucide-react';

export function Header() {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <MapPin className="h-12 w-12 text-blue-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Business Data Collector
      </h1>
      <p className="text-gray-600">
        Search and collect business information using Google Maps API
      </p>
    </div>
  );
}