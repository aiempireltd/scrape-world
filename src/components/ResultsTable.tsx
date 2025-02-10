import { Business } from '../types/business';
import { BusinessRow } from './ResultsTable/BusinessRow';
import { TableColumns } from './ResultsTable/TableColumns';
import { TableHeader } from './ResultsTable/TableHeader';

interface ResultsTableProps {
  businesses: Business[];
  onExport: () => void;
  onExportMailisto: () => void;
  isSearchingEmails: boolean;
  emailSearchProgress: {
    current: number;
    total: number;
  };
}

export default function ResultsTable({ 
  businesses, 
  onExport,
  onExportMailisto,
  isSearchingEmails,
  emailSearchProgress
}: ResultsTableProps) {
  const hasData = businesses.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <TableHeader 
        onExport={onExport}
        onExportMailisto={onExportMailisto}
        hasData={hasData}
        isSearchingEmails={isSearchingEmails}
        emailSearchProgress={emailSearchProgress}
      />
      
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
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                  Aucun résultat trouvé. Lancez une recherche pour voir les entreprises ici.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}