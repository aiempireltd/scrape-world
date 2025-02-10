import React from 'react';
import { Search, MapPin, Circle, Hash, Mail, Phone } from 'lucide-react';
import { SearchParams } from '../types/business';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [params, setParams] = React.useState<SearchParams>({
    businessType: '',
    location: '',
    radius: 50, // Valeur par défaut de 50km
    maxResults: 100,
    collectEmail: true,
    collectPhone: true,
    onlyWithValidContact: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(params);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Type d'entreprise
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={params.businessType}
              onChange={(e) => setParams({ ...params, businessType: e.target.value })}
              placeholder="ex: Restaurant"
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Localisation
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={params.location}
              onChange={(e) => setParams({ ...params, location: e.target.value })}
              placeholder="Ville ou Adresse"
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Rayon (km)
          </label>
          <div className="relative">
            <Circle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="number"
              min="1"
              max="250"
              value={params.radius}
              onChange={(e) => setParams({ ...params, radius: Number(e.target.value) })}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Nombre de résultats max
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="number"
              min="1"
              max="2500"
              value={params.maxResults}
              onChange={(e) => setParams({ ...params, maxResults: Number(e.target.value) })}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={params.onlyWithValidContact}
            onChange={(e) => setParams({ ...params, onlyWithValidContact: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <span className="ml-2 text-sm text-gray-700">
            Afficher uniquement les résultats avec les informations demandées
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading || (!params.collectEmail && !params.collectPhone)}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Recherche en cours...' : 'Rechercher'}
      </button>
    </form>
  );
}