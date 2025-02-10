// Configuration de l'API Google Maps
export const GOOGLE_MAPS_API_KEY = 'AIzaSyDQmYQrbl8L6cDu2odQ4RUDmQsX_yHyb9k';

export const MAPS_CONFIG = {
  MAX_DAILY_REQUESTS: 2500,
  WARNING_THRESHOLD: 2400,
  DEFAULT_RADIUS: 50000, // 50km en mètres
  MAX_RADIUS: 250000, // 250km en mètres (augmenté de 200km à 250km)
  MAX_RESULTS: 2500,
  LIBRARIES: ["places", "geometry"] as const,
  LANGUAGE: "fr",
  REGION: "FR",
  PLACE_FIELDS: [
    'name',
    'formatted_address',
    'formatted_phone_number',
    'rating',
    'user_ratings_total',
    'website',
    'business_status',
    'place_id',
    'types',
    'url',
    'geometry'
  ] as const,
  SEARCH_DELAY: 2000, // Délai entre les requêtes en ms
  MAX_PAGES_PER_SEARCH: 3, // Nombre maximum de pages par recherche
  RADIUS_INCREMENTS: [1, 1.5, 2, 3, 4] // Multiplicateurs pour l'augmentation du rayon
};