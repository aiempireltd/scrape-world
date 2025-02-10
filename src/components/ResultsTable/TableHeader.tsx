import { Download } from 'lucide-react';

interface TableHeaderProps {
  onExport: () => void;
  onExportMailisto: () => void;
  hasData: boolean;
  isSearchingEmails: boolean;
  emailSearchProgress: {
    current: number;
    total: number;
  };
}

export function TableHeader({ 
  onExport, 
  onExportMailisto, 
  hasData, 
  isSearchingEmails,
  emailSearchProgress 
}: TableHeaderProps) {
  return (
    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-800">Résultats de recherche</h2>
        <div className="flex flex-col">
          {isSearchingEmails && emailSearchProgress.total > 0 && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(emailSearchProgress.current / emailSearchProgress.total) * 100}%` 
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <button
        onClick={onExportMailisto}
        disabled={!hasData}
        className="flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Download className="h-4 w-4" />
        Exporter Mailisto
      </button>
      <button
        onClick={onExport}
        disabled={!hasData}
        className="flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Download className="h-4 w-4" />
        Exporter CSV
      </button>
    </div>
  );
}