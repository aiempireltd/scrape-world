import { SearchError } from '../../types/search';

export function handlePlacesError(error: unknown): SearchError {
  if (error instanceof Error) {
    if (error.message.includes('ZERO_RESULTS')) {
      return new Error('Aucun résultat trouvé pour cette recherche.');
    }
    if (error.message.includes('OVER_QUERY_LIMIT')) {
      return new Error('Limite de requêtes atteinte. Veuillez réessayer plus tard.');
    }
    if (error.message.includes('REQUEST_DENIED')) {
      return new Error('Accès refusé. Veuillez vérifier votre clé API.');
    }
    if (error.message.includes('INVALID_REQUEST')) {
      return new Error('Requête invalide. Veuillez vérifier vos paramètres de recherche.');
    }
    return error;
  }
  return new Error('Une erreur inattendue est survenue.');
}