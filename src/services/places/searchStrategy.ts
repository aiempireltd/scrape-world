import { MAPS_CONFIG } from '../../config/mapsConfig';
import { SEARCH_CONFIG } from '../../config/searchConfig';
import type { SearchProgress, SearchResult } from '../../types/search';
import { delay } from '../../utils/timing';
import { getPlacesService } from './placesService';

export class SearchStrategy {
  private seenPlaceIds: Set<string> = new Set();
  private retryCount = 0;
  private readonly maxRetries = 2;

  constructor(
    private readonly searchQuery: string,
    private readonly location: google.maps.LatLngLiteral,
    private readonly radius: number,
    private readonly maxResults: number,
    private readonly onProgress?: (progress: SearchProgress) => void
  ) {}

  async executeSearch(): Promise<google.maps.places.PlaceResult[]> {
    let allResults: google.maps.places.PlaceResult[] = [];
    let pageToken: string | undefined;
    let pageCount = 0;

    try {
      do {
        try {
          const searchResult = await this.performTextSearch(pageToken);
          
          if (searchResult.results && searchResult.results.length > 0) {
            const newResults = this.filterUniqueResults(searchResult.results);
            allResults = [...allResults, ...newResults];
            this.updateProgress(allResults.length);
            
            pageToken = searchResult.nextPageToken;
            pageCount++;

            if (pageToken && allResults.length < this.maxResults) {
              await delay(2000); // Augmenté à 2 secondes pour éviter les limitations
            }
          } else {
            break;
          }
        } catch (error) {
          if (error instanceof Error && error.message.includes('ZERO_RESULTS')) {
            break;
          }
          
          if (this.retryCount < this.maxRetries) {
            this.retryCount++;
            await delay(2000);
            continue;
          }
          throw error;
        }
      } while (
        pageToken && 
        pageCount < SEARCH_CONFIG.API.MAX_PAGES_PER_SEARCH && 
        allResults.length < this.maxResults
      );

      return this.filterAndSortResults(allResults);
    } catch (error) {
      console.error('Search strategy error:', error);
      return allResults;
    }
  }

  private filterUniqueResults(results: google.maps.places.PlaceResult[]): google.maps.places.PlaceResult[] {
    return results.filter(place => {
      if (!place.place_id || this.seenPlaceIds.has(place.place_id)) return false;
      this.seenPlaceIds.add(place.place_id);
      return true;
    });
  }

  private filterAndSortResults(results: google.maps.places.PlaceResult[]): google.maps.places.PlaceResult[] {
    return results
      .slice(0, this.maxResults)
      .sort((a, b) => {
        const ratingDiff = (b.rating || 0) - (a.rating || 0);
        if (ratingDiff !== 0) return ratingDiff;
        return (b.user_ratings_total || 0) - (a.user_ratings_total || 0);
      });
  }

  private async performTextSearch(pageToken?: string): Promise<SearchResult> {
    return new Promise((resolve, reject) => {
      const request: any = {
        query: this.searchQuery,
        location: this.location,
        radius: this.radius,
        language: MAPS_CONFIG.LANGUAGE,
        region: MAPS_CONFIG.REGION,
        pageToken
      };

      getPlacesService().textSearch(request, (results, status, pagination) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          resolve({
            results,
            nextPageToken: (pagination as any)?.nextPageToken
          });
        } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          resolve({ results: [], nextPageToken: undefined });
        } else {
          reject(new Error(`Places API error: ${status}`));
        }
      });
    });
  }

  private updateProgress(currentCount: number): void {
    this.onProgress?.({
      current: Math.min(currentCount, this.maxResults),
      total: this.maxResults,
      step: `Recherche dans un rayon de ${Math.round(this.radius / 1000)}km...`,
      validResults: 0,
      validEmails: 0
    });
  }
}