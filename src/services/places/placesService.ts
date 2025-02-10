let placesService: google.maps.places.PlacesService | null = null;

export function getPlacesService(): google.maps.places.PlacesService {
  if (!placesService) {
    const div = document.createElement('div');
    placesService = new google.maps.places.PlacesService(div);
  }
  return placesService;
}

export function resetPlacesService(): void {
  placesService = null;
}