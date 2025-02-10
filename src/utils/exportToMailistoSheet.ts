import { Business } from '../types/business';
import * as XLSX from 'xlsx';

export function exportToSheets(businesses: Business[], filename: string) {
  // Préparer les données dans l'ordre souhaité : email puis nom
  const data = businesses
    .filter(business => business.email)
    .map(business => [
      business.email || '', // Colonne A
      business.name || ''   // Colonne B
    ]);
  
  // Créer un nouveau workbook
  const wb = XLSX.utils.book_new();
  
  // Convertir les données en worksheet
  // Pas de headers comme demandé
  const ws = XLSX.utils.aoa_to_sheet(data);
  
  // Ajouter la worksheet au workbook
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  
  // Générer le fichier XLSX
  XLSX.writeFile(wb, `${filename}`);
}

// Exemple d'utilisation :
// exportToSheets(businessList, "mes_entreprises");