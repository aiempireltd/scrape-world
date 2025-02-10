import { Loader } from '@googlemaps/js-api-loader';
import { GOOGLE_MAPS_API_KEY, MAPS_CONFIG } from '../config/maps';
import { toast } from 'react-hot-toast';

class GoogleMapsLoader {
  private static instance: GoogleMapsLoader;
  private initialized: boolean = false;
  private loader: Loader;
  private initializationPromise: Promise<void> | null = null;
  private initializationAttempts: number = 0;
  private readonly maxAttempts: number = 3;

  private constructor() {
    this.loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: [...MAPS_CONFIG.LIBRARIES],
      language: MAPS_CONFIG.LANGUAGE,
      region: MAPS_CONFIG.REGION
    });
  }

  public static getInstance(): GoogleMapsLoader {
    if (!GoogleMapsLoader.instance) {
      GoogleMapsLoader.instance = new GoogleMapsLoader();
    }
    return GoogleMapsLoader.instance;
  }

  private async verifyApiKey(): Promise<void> {
    if (!GOOGLE_MAPS_API_KEY) {
      toast.error('La clé API Google Maps n\'est pas configurée.');
      throw new Error('MissingApiKeyError');
    }

    try {
      // Créer un élément div temporaire pour tester l'initialisation de Places
      const tempDiv = document.createElement('div');
      const service = new google.maps.places.PlacesService(tempDiv);
      
      const request = {
        placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
        fields: ['name']
      };

      await new Promise<void>((resolve, reject) => {
        service.getDetails(request, (result, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK || 
              status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            resolve();
          } else if (status === google.maps.places.PlacesServiceStatus.REQUEST_DENIED) {
            toast.error('La clé API Google Maps n\'est pas valide ou n\'a pas les autorisations nécessaires.');
            reject(new Error('InvalidApiKeyError'));
          } else if (status === google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
            toast.error('Limite de requêtes Google Maps atteinte. Veuillez réessayer plus tard.');
            reject(new Error('OverQueryLimitError'));
          } else {
            reject(new Error(`ApiError: ${status}`));
          }
        });
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('google is not defined')) {
          throw new Error('LoadError');
        }
        throw error;
      }
      throw new Error('ApiVerificationError');
    }
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = (async () => {
      try {
        if (this.initializationAttempts >= this.maxAttempts) {
          const message = 'Impossible de charger Google Maps après plusieurs tentatives. Veuillez rafraîchir la page.';
          toast.error(message);
          throw new Error('MaxAttemptsReachedError');
        }

        this.initializationAttempts++;

        // Charger l'API Google Maps
        try {
          await this.loader.load();
          // Une fois l'API chargée, vérifier la validité de la clé
          await this.verifyApiKey();
          this.initialized = true;
          this.initializationAttempts = 0;
        } catch (loadError) {
          const message = loadError instanceof Error 
            ? `Erreur lors du chargement de Google Maps: ${loadError.message}`
            : 'Erreur lors du chargement de Google Maps';
          
          console.error('Load error details:', loadError);
          toast.error(message);
          throw new Error(`LoadError: ${message}`);
        }
      } catch (error) {
        this.initialized = false;
        this.initializationPromise = null;

        if (error instanceof Error) {
          const knownErrors = [
            'MissingApiKeyError',
            'InvalidApiKeyError',
            'OverQueryLimitError',
            'ApiError',
            'MaxAttemptsReachedError',
            'LoadError'
          ];
          
          if (knownErrors.some(e => error.message.startsWith(e))) {
            throw error;
          }
        }
        
        console.error('Google Maps initialization error:', {
          error,
          attempts: this.initializationAttempts,
          apiKey: GOOGLE_MAPS_API_KEY ? 'Present' : 'Missing'
        });
        
        toast.error('Une erreur est survenue lors de l\'initialisation de Google Maps. Veuillez vérifier votre connexion internet et rafraîchir la page.');
        throw new Error('InitializationError');
      }
    })();

    return this.initializationPromise;
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public reset(): void {
    this.initialized = false;
    this.initializationPromise = null;
    this.initializationAttempts = 0;
  }
}

export default GoogleMapsLoader;