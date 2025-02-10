interface KeywordMap {
  [key: string]: string[];
}

export const SIMILAR_KEYWORDS: KeywordMap = {
  restaurant: ['restaurant', 'bistrot', 'brasserie', 'restauration', 'traiteur'],
  avocat: ['avocat', 'cabinet avocat', 'juriste', 'conseil juridique'],
  médecin: ['médecin', 'docteur', 'cabinet médical', 'praticien'],
  dentiste: ['dentiste', 'chirurgien dentiste', 'orthodontiste'],
  garage: ['garage', 'mécanicien', 'auto', 'réparation automobile'],
  coiffeur: ['coiffeur', 'salon de coiffure', 'coiffure'],
  boulangerie: ['boulangerie', 'boulanger', 'pâtisserie'],
  pharmacie: ['pharmacie', 'pharmacien'],
  immobilier: ['agence immobilière', 'immobilier', 'agent immobilier'],
  hotel: ['hotel', 'hôtel', 'hébergement'],
  // Ajoutez d'autres catégories selon les besoins
};

export function getSimilarKeywords(businessType: string): string[] {
  const normalizedType = businessType.toLowerCase().trim();
  
  // Recherche exacte
  if (SIMILAR_KEYWORDS[normalizedType]) {
    return SIMILAR_KEYWORDS[normalizedType];
  }
  
  // Recherche partielle
  for (const [key, keywords] of Object.entries(SIMILAR_KEYWORDS)) {
    if (normalizedType.includes(key) || key.includes(normalizedType)) {
      return keywords;
    }
  }
  
  // Si aucune correspondance n'est trouvée, retourner le terme original
  return [businessType];
}