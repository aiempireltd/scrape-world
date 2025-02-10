import React from 'react';
import { useApiUsage } from '../../services/apiUsage';

export function RequestCounter() {
  const { usage } = useApiUsage();

  return (
    <div className="mt-4 text-right space-y-1">
      <div className="text-sm text-gray-500">
        Google API Requests: {usage.google}/2500
      </div>
      {usage.outscrapper > 0 && (
        <div className="text-sm text-gray-500">
          Outscrapper API Requests: {usage.outscrapper}/1000
        </div>
      )}
    </div>
  );
}