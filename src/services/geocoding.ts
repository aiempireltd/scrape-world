import { GOOGLE_MAPS_API_KEY, MAPS_CONFIG } from '../config/maps';
import { toast } from 'react-hot-toast';

export interface GeocodingResult {
  lat: number;
  lng: number;
}

export async function geocodeAddress(address: string): Promise<GeocodingResult> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?` + 
      `address=${encodeURIComponent(address)}` +
      `&key=${GOOGLE_MAPS_API_KEY}` +
      `&language=${MAPS_CONFIG.LANGUAGE}` +
      `&region=${MAPS_CONFIG.REGION}`
    );

    if (!response.ok) {
      throw new Error('La requête de géocodage a échoué');
    }

    const data = await response.json();
    
    if (data.status === 'REQUEST_DENIED') {
      throw new Error(
        'Accès à l\'API Google Maps refusé. Veuillez vérifier votre clé API et activer la facturation sur votre projet Google Cloud.'
      );
    }
    
    if (data.status !== 'OK') {
      if (data.status === 'ZERO_RESULTS') {
        throw new Error('Aucun résultat trouvé pour cette adresse');
      }
      throw new Error(data.error_message || `Erreur de géocodage: ${data.status}`);
    }

    if (!data.results || data.results.length === 0) {
      throw new Error('Aucun résultat trouvé pour cette adresse');
    }

    const { lat, lng } = data.results[0].geometry.location;
    return { lat, lng };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue lors du géocodage';
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
}