import { MAPS_CONFIG } from '../config/maps';
import type { Business } from '../types/business';
import GoogleMapsLoader from './googleMapsLoader';

let placesService: google.maps.places.PlacesService | null = null;

function getPlacesService() {
  if (!placesService) {
    const div = document.createElement('div');
    placesService = new google.maps.places.PlacesService(div);
  }
  return placesService;
}

export async function searchNearbyPlaces(
  location: { lat: number; lng: number },
  type: string,
  radius: number
): Promise<google.maps.places.PlaceResult[]> {
  await GoogleMapsLoader.getInstance().initialize();

  return new Promise((resolve, reject) => {
    const request: google.maps.places.TextSearchRequest = {
      location: new google.maps.LatLng(location.lat, location.lng),
      radius,
      query: `${type} in ${location.lat},${location.lng}`,
      type: type.toLowerCase()
    };

    try {
      getPlacesService().textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          resolve(results);
        } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          resolve([]);
        } else {
          reject(new Error(`Places search failed: ${status}`));
        }
      });
    } catch (error) {
      reject(new Error('Failed to execute places search. Please check API configuration.'));
    }
  });
}

export async function getPlaceDetails(
  placeId: string
): Promise<google.maps.places.PlaceResult> {
  return new Promise((resolve, reject) => {
    const request = {
      placeId,
      fields: MAPS_CONFIG.PLACE_FIELDS
    };

    try {
      getPlacesService().getDetails(request as unknown as google.maps.places.PlaceDetailsRequest, (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && result) {
          resolve(result);
        } else {
          reject(new Error(`Place details failed: ${status}`));
        }
      });
    } catch (error) {
      reject(new Error('Failed to get place details. Please check API configuration.'));
    }
  });
}

export function transformPlaceToBusiness(place: google.maps.places.PlaceResult): Business {
  return {
    name: place.name || 'Unknown',
    address: place.formatted_address || 'No address',
    phoneNumber: place.formatted_phone_number || 'No phone',
    rating: place.rating || 0,
    reviewCount: place.user_ratings_total || 0,
    website: place.website || 'No website',
    placeId: place.place_id || '',
  } as unknown as Business;
}