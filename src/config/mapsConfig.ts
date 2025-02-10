export const MAPS_CONFIG = {
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
  ] as const
} as const;