import React, { useCallback } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { Business } from '../types/business';
import { toast } from 'react-hot-toast';

interface ImportFormProps {
  onImport: (businesses: Business[]) => void;
  isLoading: boolean;
}

export function ImportForm({ onImport, isLoading }: ImportFormProps) {
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error('Veuillez sélectionner un fichier CSV');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
        
        // Détecter et supprimer le BOM si présent
        const firstLine = lines[0].replace(/^\uFEFF/, '');
        const headers = firstLine.split(',').map(h => 
          h.trim()
            .toLowerCase()
            .replace(/^"/, '')
            .replace(/"$/, '')
        );

        // Vérifier les colonnes requises
        const requiredColumns = ['nom', 'site web'];
        const missingColumns = requiredColumns.filter(col => !headers.includes(col));
        
        if (missingColumns.length > 0) {
          toast.error(`Colonnes manquantes : ${missingColumns.join(', ')}`);
          return;
        }

        // Mapper les index des colonnes
        const columnIndexes = {
          name: headers.indexOf('nom'),
          website: headers.indexOf('site web'),
          address: headers.indexOf('adresse'),
          phone: headers.indexOf('téléphone'),
          rating: headers.indexOf('note'),
          reviews: headers.indexOf('nombre d\'avis'),
          email: headers.indexOf('email'),
          types: headers.indexOf('types')
        };

        const businesses: Business[] = [];
        
        // Traiter chaque ligne
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];
          if (!line) continue;

          // Parser la ligne en gérant correctement les guillemets
          const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)
            ?.map(val => val.replace(/^"(.*)"$/, '$1').trim()) || [];

          if (values.length < headers.length) continue;

          const business: Business = {
            name: values[columnIndexes.name] || 'Unknown',
            website: values[columnIndexes.website] || 'No website',
            address: values[columnIndexes.address] || 'No address',
            phoneNumber: values[columnIndexes.phone] || '',
            rating: parseFloat(values[columnIndexes.rating]) || 0,
            reviewCount: parseInt(values[columnIndexes.reviews]) || 0,
            email: values[columnIndexes.email] || '',
            types: columnIndexes.types >= 0 ? values[columnIndexes.types].split(';').map(t => t.trim()) : [],
            placeId: `imported-${i}`,
          };

          businesses.push(business);
        }

        if (businesses.length === 0) {
          toast.error('Aucune entreprise trouvée dans le fichier');
          return;
        }

        onImport(businesses);
        toast.success(`${businesses.length} entreprises importées avec succès`);
        event.target.value = '';
      } catch (error) {
        console.error('Error parsing CSV:', error);
        toast.error('Erreur lors de la lecture du fichier CSV');
      }
    };

    reader.readAsText(file, 'UTF-8');
  }, [onImport]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Importer un fichier CSV
          </h2>
          <p className="text-sm text-gray-600">
            Le fichier doit contenir au minimum les colonnes "Nom" et "Site Web"
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center">
            <label className="relative cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={isLoading}
              />
              <div className="flex flex-col items-center gap-2 p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">
                  {isLoading ? 'Importation en cours...' : 'Cliquez pour sélectionner un fichier CSV'}
                </span>
              </div>
            </label>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Format attendu du CSV :</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Séparateur : virgule (,)</li>
                  <li>Colonnes requises : Nom, Site Web</li>
                  <li>Colonnes optionnelles : Adresse, Téléphone, Note, Nombre d'avis, Email, Types</li>
                  <li>Encodage : UTF-8</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}