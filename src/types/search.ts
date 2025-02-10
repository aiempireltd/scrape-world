export interface SearchResult {
  results: google.maps.places.PlaceResult[];
  nextPageToken?: string;
}

export interface SearchError extends Error {
  code?: string;
  status?: string;
}

export interface SearchProgress {
  current: number;
  total: number;
  step: string;
  validResults: number;
  validEmails: number;
}

export interface ScrapedEmailData {
  external_emails?: Array<{ value: string }>;
  emails?: Array<{ value: string }>;
  social_links?: Record<string, any>;
  socials?: Record<string, { value: string }>;
}

export interface EmailScraperResult {
  data?: ScrapedEmailData[];
  status?: string;
}