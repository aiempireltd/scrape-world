import { MAPS_CONFIG } from '../../config/maps';
import type { Business } from '../../types/business';
import { getPlacesService } from './placesService';

interface TransformOptions {
  collectEmail: boolean;
  collectPhone: boolean;
}

export async function getPlaceDetails(
  placeId: string
): Promise<google.maps.places.PlaceResult> {
  return new Promise((resolve, reject) => {
    const request = {
      placeId,
      fields: MAPS_CONFIG.PLACE_FIELDS,
      language: MAPS_CONFIG.LANGUAGE,
      region: MAPS_CONFIG.REGION
    };

    try {
      getPlacesService().getDetails(request as unknown as google.maps.places.PlaceDetailsRequest, (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && result) {
          resolve(result);
        } else {
          console.error('Place Details API Error:', status);
          reject(new Error(`Failed to get place details: ${status}`));
        }
      });
    } catch (error) {
      console.error('Place Details Error:', error);
      reject(new Error('Failed to get place details'));
    }
  });
}

export async function transformPlaceToBusiness(
  place: google.maps.places.PlaceResult,
  options: TransformOptions
): Promise<Business | null> {
  const phoneNumber = place.formatted_phone_number || '';

  return {
    name: place.name || 'Unknown',
    address: place.formatted_address || 'No address',
    phoneNumber: options.collectPhone ? (phoneNumber || 'No phone') : '',
    rating: place.rating || 0,
    reviewCount: place.user_ratings_total || 0,
    website: place.website || place.url || 'No website',
    email: '', // Les emails seront collectés séparément via le bouton de recherche
    types: place.types || [],
    placeId: place.place_id || '',
  };
}