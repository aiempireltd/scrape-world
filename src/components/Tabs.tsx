import React from 'react';
import { Search, Upload } from 'lucide-react';

interface TabsProps {
  activeTab: 'search' | 'import';
  onTabChange: (tab: 'search' | 'import') => void;
}

export function Tabs({ activeTab, onTabChange }: TabsProps) {
  return (
    <div className="mb-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-4" aria-label="Tabs">
          <button
            onClick={() => onTabChange('search')}
            className={`
              flex items-center gap-2 px-4 py-2 border-b-2 text-sm font-medium
              ${activeTab === 'search'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            <Search className="h-4 w-4" />
            Recherche
          </button>
          <button
            onClick={() => onTabChange('import')}
            className={`
              flex items-center gap-2 px-4 py-2 border-b-2 text-sm font-medium
              ${activeTab === 'import'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            <Upload className="h-4 w-4" />
            Import CSV
          </button>
        </nav>
      </div>
    </div>
  );
}