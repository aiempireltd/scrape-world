import React, { useState } from 'react';
import { Search, MapPin, Hash } from 'lucide-react';
import { SearchParams } from '../../types/business';
import { SearchInput } from './SearchInput';
import { NumberInput } from './NumberInput';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [params, setParams] = useState<SearchParams>({
    businessType: '',
    location: '',
    collectEmail: false,
    collectPhone: false,
    onlyWithValidContact: false,
    maxResults: 1000
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(params);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SearchInput
          label="Type d'entreprise"
          value={params.businessType}
          onChange={(value) => setParams({ ...params, businessType: value })}
          placeholder="ex: Restaurant, Avocat, etc."
          icon={<Search className="h-5 w-5" />}
          required
        />

        <SearchInput
          label="Localisation"
          value={params.location}
          onChange={(value) => setParams({ ...params, location: value })}
          placeholder="Ville, Région ou Pays"
          icon={<MapPin className="h-5 w-5" />}
          required
        />

        <div className="md:col-span-2">
          <NumberInput
            label="Nombre de résultats souhaités"
            value={params.maxResults}
            onChange={(value) => setParams({ ...params, maxResults: value })}
            min={1}
            max={1000}
            icon={<Hash className="h-5 w-5" />}
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Recherche en cours...' : 'Rechercher'}
      </button>
    </form>
  );
}