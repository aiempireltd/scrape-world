import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { EmailService } from './emailService';
import { Business, SearchParams } from '../types/business';
import { useApiUsage } from './apiUsage';
import GoogleMapsLoader from './googleMapsLoader';
import { searchNearbyPlaces } from './places/searchService';
import { getPlaceDetails, transformPlaceToBusiness } from './places/detailsService';
import { SearchProgress } from '../types/search';
import { BATCH_SIZE } from '../config/scrapeConfig';

export function usePlacesSearch() {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState<SearchProgress>({
        current: 0, total: 0, step: '', validResults: 0, validEmails: 0
    });

    const { incrementGoogle } = useApiUsage();

    const updateProgress = useCallback((
        current: number,
        total: number,
        step: string,
        validResults: number,
        validEmails: number
    ) => {
        setProgress({ current, total, step, validResults, validEmails });
    }, []);

    const handleError = useCallback((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Une erreur inattendue est survenue';
        console.error('Search error:', error);
        toast.error(message);
    }, []);

    const processBusinessesInBatches = async (validBusinesses: Business[]) => {
        let currentEmailsFound = 0;

        for (let i = 0; i < validBusinesses.length; i += BATCH_SIZE) {
            const batch = validBusinesses.slice(i, i + BATCH_SIZE);
            await EmailService.collectEmailsForBatch(
                batch,
                updateProgress,
                validBusinesses.length,
                currentEmailsFound
            );

            currentEmailsFound = validBusinesses.filter(b => b.email).length;
            setBusinesses([...validBusinesses]); // Update UI after each batch
        }

        return validBusinesses;
    };

    const search = useCallback(async (params: SearchParams) => {
        setIsLoading(true);
        setBusinesses([]);
        updateProgress(0, 100, 'Initialisation...', 0, 0);

        try {
            await GoogleMapsLoader.getInstance().initialize();
            incrementGoogle();

            updateProgress(0, params.maxResults, 'Recherche des entreprises...', 0, 0);
            const places = await searchNearbyPlaces(
                params.businessType,
                params.location,
                params.maxResults,
                (searchProgress) => updateProgress(
                    searchProgress.current,
                    params.maxResults,
                    'Collecte des données de base...',
                    businesses.length,
                    0
                )
            );

            if (!places.length) {
                toast.error('Aucune entreprise trouvée dans cette zone');
                return;
            }

            const validBusinesses: Business[] = [];
            for (const [index, place] of places.entries()) {
                
                if (validBusinesses.length >= params.maxResults) break;

                try {
                    incrementGoogle();
                    updateProgress(
                        index + 1,
                        places.length,
                        `Analyse des données (${validBusinesses.length}/${params.maxResults})`,
                        validBusinesses.length,
                        0
                    );

                    const detail = await getPlaceDetails(place.place_id!);
                    const business = await transformPlaceToBusiness(detail, {
                        collectEmail: false,
                        collectPhone: params.collectPhone
                    });

                    if (business) validBusinesses.push(business);
                } catch (error) {
                    console.warn('Error processing business:', {
                        placeId: place.place_id,
                        error: error instanceof Error ? error.message : 'Unknown error'
                    });
                }
            }

            const businessesWithEmails = await processBusinessesInBatches(validBusinesses);
            const validEmailsCount = businessesWithEmails.filter(b => b.email).length;

            updateProgress(100, 100, 'Finalisation...', businessesWithEmails.length, validEmailsCount);

            if (businessesWithEmails.length === 0) {
                toast.error('Aucun résultat trouvé');
            } else {
                toast.success(
                    `${businessesWithEmails.length} entreprise${businessesWithEmails.length > 1 ? 's' : ''} trouvée${businessesWithEmails.length > 1 ? 's' : ''}`
                );
            }
        } catch (error) {
            handleError(error);
            setBusinesses([]);
        } finally {
            setIsLoading(false);
        }
    }, [handleError, incrementGoogle, updateProgress, businesses.length]);

    return { businesses, setBusinesses, isLoading, progress, search };
}