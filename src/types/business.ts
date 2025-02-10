export interface Business {
  name: string;
  address: string;
  phoneNumber: string;
  rating: number;
  reviewCount: number;
  website: string;
  email: string;
  types: string[];
  placeId: string;
}

export interface SearchParams {
  businessType: string;
  location: string;
  maxResults: number;
  radius: number;
  collectEmail: boolean;
  collectPhone: boolean;
  onlyWithValidContact: boolean;
}

export interface ApiUsage {
  google: number;
  outscrapper: number;
}

export type ContactType = 'email' | 'phone' | 'both';