import { Business } from '../types/business';

export function exportToCsv(businesses: Business[], filename: string) {
  const headers = [
    'Nom',
    'Adresse',
    'Téléphone',
    'Email',
    'Note',
    'Nombre d\'avis',
    'Site Web',
    'Types'
  ];
  
  const data = businesses.map(business => [
    business.name,
    business.address || 'No address',
    business.phoneNumber || 'No phone',
    business.email || '',
    business.rating || 0,
    business.reviewCount || 0,
    business.website || 'No website',
    (business.types || []).join('; ')
  ]);

  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      row.map(cell => {
        // Échapper les virgules et les guillemets dans les valeurs
        const value = String(cell).replace(/"/g, '""');
        return value.includes(',') || value.includes('"') || value.includes('\n')
          ? `"${value}"`
          : value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}