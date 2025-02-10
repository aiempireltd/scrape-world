interface DirectorySearchParams {
  name: string;
  address: string;
  collectEmail: boolean;
  collectPhone: boolean;
}

interface DirectoryResult {
  email: string;
  phone: string;
}

const BUSINESS_DIRECTORIES = [
  'pagesjaunes.fr',
  'societe.com',
  'linkedin.com/company',
  'facebook.com/business',
  'google.com/business'
];

export async function searchBusinessDirectories(params: DirectorySearchParams): Promise<DirectoryResult> {
  const result: DirectoryResult = { email: '', phone: '' };
  
  try {
    // Construire la requête de recherche
    const searchQuery = `${params.name} ${params.address} site:(${BUSINESS_DIRECTORIES.join(' OR ')})`;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;

    const response = await fetch(searchUrl);
    const html = await response.text();

    // Extraire les emails et téléphones des résultats
    if (params.collectEmail) {
      const emailMatches = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
      if (emailMatches.length > 0 && emailMatches[0]) {
        result.email = emailMatches[0].toLowerCase();
      }
    }

    if (params.collectPhone) {
      const phoneMatches = html.match(/(?:\+33|0)[1-9](?:[\s.-]*\d{2}){4}/g) || [];
      if (phoneMatches.length > 0 && phoneMatches[0]) {
        result.phone = phoneMatches[0].replace(/[\s.-]/g, '');
      }
    }

    return result;
  } catch (error) {
    console.warn('Directory search failed:', error);
    return result;
  }
}