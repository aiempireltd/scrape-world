import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Layout/Header';
import { RequestCounter } from './components/Layout/RequestCounter';
import { LoadingIndicator } from './components/LoadingIndicator';
import ResultsTable from './components/ResultsTable';
import SearchForm from './components/SearchForm';
import { exportToCsv } from './utils/exportToCsv';
import { usePlacesSearch } from './services/usePlacesSearch';
import { exportToSheets } from './utils/exportToMailistoSheet';

export default function App() {
  const { businesses, isLoading, progress, search } = usePlacesSearch();
  const [isSearchingEmails] = useState(false);
  const [emailSearchProgress] = useState({ current: 0, total: 0 });

  const handleExport = () => {
    if (!businesses || businesses.length === 0) return;

    const filename = `businesses-${new Date().toISOString().split('T')[0]}.csv`;
    exportToCsv(businesses, filename);
  };

  const handleExportMailisto = () => {
    if (!businesses || businesses.length === 0) return;

    const filename = `mailisto-${new Date().toISOString().split('T')[0]}.xlsx`;
    exportToSheets(businesses, filename);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100">
        <Toaster position="top-right" />
        {isLoading && <LoadingIndicator progress={progress} />}

        <div className="max-w-7xl mx-auto px-4 py-8">
          <Header />

          <div className="space-y-6">
            <SearchForm onSearch={search} isLoading={isLoading} />
            <ResultsTable
              businesses={businesses}
              onExport={handleExport}
              onExportMailisto={handleExportMailisto}
              isSearchingEmails={isSearchingEmails}
              emailSearchProgress={emailSearchProgress}
            />
          </div>

          <RequestCounter />
        </div>
      </div>
    </ErrorBoundary>
  );
}