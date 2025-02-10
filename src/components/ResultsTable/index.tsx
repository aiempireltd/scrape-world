import React from 'react';
import { Download } from 'lucide-react';
import { Business } from '../../types/business';
import { TableHeader } from './TableHeader';
import { TableColumns } from './TableColumns';
import { BusinessRow } from './BusinessRow';
import { EmptyState } from './EmptyState';

interface ResultsTableProps {
  businesses: Business[];
  onExport: () => void;
}

export default function ResultsTable({ businesses, onExport }: ResultsTableProps) {
  const hasData = businesses.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <TableHeader onExport={onExport} hasData={hasData} />
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <TableColumns />
          <tbody className="bg-white divide-y divide-gray-200">
            {hasData ? (
              businesses.map((business) => (
                <BusinessRow 
                  key={business.placeId} 
                  business={business} 
                />
              ))
            ) : (
              <EmptyState />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}