import { Loader } from '@googlemaps/js-api-loader';
import { GOOGLE_MAPS_API_KEY } from '../config/maps';

let isInitialized = false;

export async function initializeGoogleMaps() {
  if (isInitialized) {
    return;
  }

  const loader = new Loader({
    apiKey: GOOGLE_MAPS_API_KEY,
    version: "weekly",
    libraries: ["places"]
  });

  await loader.load();
  isInitialized = true;
}