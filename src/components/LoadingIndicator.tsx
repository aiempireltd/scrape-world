import { Loader2, Building2, Mail } from 'lucide-react';

interface LoadingIndicatorProps {
  progress: {
    current: number;
    total: number;
    step: string;
    validResults: number;
    validEmails: number;
  };
}

export function LoadingIndicator({ progress }: LoadingIndicatorProps) {
  const percentage = Math.round((progress.current / progress.total) * 100);
  const emailPercentage = progress.validResults > 0 
    ? Math.round((progress.validEmails / progress.validResults) * 100)
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-center mb-4">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
        
        <h3 className="text-lg font-semibold text-center mb-2">
          Recherche en cours...
        </h3>
        
        <p className="text-gray-600 text-center mb-4">
          {progress.step}
        </p>

        {progress.validResults > 0 && (
          <div className="space-y-4 mb-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                <span>Entreprises trouvées</span>
              </div>
              <span className="font-medium">{progress.validResults}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-green-600" />
                <span>Emails collectés</span>
              </div>
              <span className="font-medium">
                {progress.validEmails} / {progress.validResults}
              </span>
            </div>

            {/* Barre de progression des emails */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${emailPercentage}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Barre de progression principale */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <p className="text-sm text-gray-500 text-center">
          {progress.current} sur {progress.total}
        </p>
      </div>
    </div>
  );
}