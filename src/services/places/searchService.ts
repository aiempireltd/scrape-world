import { MAPS_CONFIG } from '../../config/maps';
import type { SearchProgress } from '../../types/search';
import { getSimilarKeywords } from '../../utils/searchKeywords';
import { geocodeAddress } from '../geocoding';
import GoogleMapsLoader from '../googleMapsLoader';
import { handlePlacesError } from './errorHandler';
import { SearchStrategy } from './searchStrategy';

const RADIUS_INCREMENTS = [1, 1.5, 2, 3, 4, 5]; // Multiplicateurs pour l'expansion du rayon

export async function searchNearbyPlaces(
  searchQuery: string,
  location: string,
  maxResults: number,
  onProgress?: (progress: SearchProgress) => void
): Promise<google.maps.places.PlaceResult[]> {
  try {
    await GoogleMapsLoader.getInstance().initialize();
    
    const keywords = getSimilarKeywords(searchQuery);
    let allResults: google.maps.places.PlaceResult[] = [];
    const seenPlaceIds = new Set<string>();
    
    // Obtenir les coordonnées du point central
    const centerCoords = await geocodeAddress(location);
    let currentRadius = MAPS_CONFIG.DEFAULT_RADIUS;
    let radiusMultiplierIndex = 0;
    
    // Continuer la recherche tant qu'on n'a pas assez de résultats et qu'on peut augmenter le rayon
    while (allResults.length < maxResults && radiusMultiplierIndex < RADIUS_INCREMENTS.length) {
      const effectiveRadius = Math.min(
        currentRadius * RADIUS_INCREMENTS[radiusMultiplierIndex],
        MAPS_CONFIG.MAX_RADIUS
      );

      console.log(`Recherche avec rayon: ${Math.round(effectiveRadius / 1000)}km`);
      
      for (const keyword of keywords) {
        if (allResults.length >= maxResults) break;
        
        try {
          const searchStrategy = new SearchStrategy(
            keyword,
            centerCoords,
            effectiveRadius,
            maxResults - allResults.length,
            (progress) => {
              onProgress?.({
                current: Math.min(allResults.length + progress.current, maxResults),
                total: maxResults,
                step: `Recherche dans un rayon de ${Math.round(effectiveRadius / 1000)}km...`,
                validResults: allResults.length,
                validEmails: 0
              });
            }
          );
          
          const results = await searchStrategy.executeSearch();
          
          for (const place of results) {
            if (!place.place_id || seenPlaceIds.has(place.place_id)) continue;
            seenPlaceIds.add(place.place_id);
            allResults.push(place);
            
            if (allResults.length >= maxResults) break;
          }
        } catch (error) {
          console.warn(`Search failed for keyword "${keyword}":`, error);
          continue;
        }
      }

      // Si on n'a pas assez de résultats, on augmente le rayon
      if (allResults.length < maxResults) {
        radiusMultiplierIndex++;
        if (radiusMultiplierIndex < RADIUS_INCREMENTS.length) {
          console.log('Augmentation du rayon de recherche...');
        }
      }
    }

    if (allResults.length === 0) {
      throw new Error('Aucun résultat trouvé pour cette recherche');
    }

    // Trier par note et limiter au nombre demandé
    return allResults
      .sort((a, b) => {
        const ratingDiff = (b.rating || 0) - (a.rating || 0);
        if (ratingDiff !== 0) return ratingDiff;
        return (b.user_ratings_total || 0) - (a.user_ratings_total || 0);
      })
      .slice(0, maxResults);
  } catch (error) {
    throw handlePlacesError(error);
  }
}