import { MAX_POLL_ATTEMPTS, API_KEY, POLL_INTERVAL, EXCLUDED_EMAIL_DOMAINS, EXCLUDED_DOMAINS } from '../config/scrapeConfig';
import { Business } from '../types/business';
import { EmailScraperResult, ScrapedEmailData } from '../types/search';

export class EmailService {
    static async pollResults(resultsUrl: string): Promise<EmailScraperResult> {
        let attempts = 0;

        while (attempts < MAX_POLL_ATTEMPTS) {
            const response = await fetch(resultsUrl, {
                headers: {
                    'Accept': 'application/json',
                    'X-API-KEY': API_KEY,
                    'Authorization': `Bearer ${API_KEY}`
                }
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            if (data.status === 'Success') return data;
            if (data.status === 'Failed') throw new Error('La requête a échoué');

            await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
            attempts++;
        }

        throw new Error('Délai d\'attente dépassé');
    }

    static isValidEmail(email: string): boolean {
        if (!email || typeof email !== 'string') return false;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) return false;

        const [localPart, domain] = email.split('@');
        return !(localPart.length > 64 || domain.length > 255 || EXCLUDED_EMAIL_DOMAINS.includes(domain));
    }

    static extractEmails(result: ScrapedEmailData): string[] {
        const emails: string[] = [];

        const addValidEmail = (email: { value: string }) => {
            if (this.isValidEmail(email.value)) {
                emails.push(email.value.toLowerCase());
            }
        };

        result?.external_emails?.forEach(addValidEmail);
        result?.emails?.forEach(addValidEmail);

        if (result?.social_links) {
            Object.values(result.socials || {}).forEach((social: any) => {
                if (typeof social.value === 'string' && social.value.includes('@')) {
                    const emailMatch = social.value.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0];
                    if (emailMatch && this.isValidEmail(emailMatch)) {
                        emails.push(emailMatch.toLowerCase());
                    }
                }
            });
        }

        return emails;
    }

    static async collectEmailsForBatch(
        businesses: Business[],
        updateProgress: (current: number, total: number, step: string, validResults: number, validEmails: number) => void,
        totalBusinesses: number,
        currentEmailsFound: number
    ): Promise<Business[]> {
        const domains = businesses
            .map(b => b.website?.split('//')[1])
            .filter(Boolean)
            .filter(domain => !EXCLUDED_DOMAINS.some(excluded => domain.includes(excluded)));

        if (domains.length === 0) return businesses;

        try {
            const apiUrl = 'https://api.app.outscraper.com/emails-and-contacts?' +
                domains.map(domain => `query=${domain}`).join('&');

            const initialResponse = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-API-KEY': API_KEY,
                    'Authorization': `Bearer ${API_KEY}`
                }
            });

            if (!initialResponse.ok) {
                throw new Error(`Erreur API (${initialResponse.status}): ${await initialResponse.text()}`);
            }

            const initialData = await initialResponse.json();

            if (initialData.status === 'Pending' && initialData.results_location) {
                const results = await this.pollResults(initialData.results_location);
                let batchEmailsFound = 0;

                results.data?.forEach((result: any, index: any) => {
                    const domain = domains[index];
                    if (!domain) return;

                    const business = businesses.find(b => b.website?.split('//')[1] === domain);
                    if (!business || !result) return;

                    const emails = this.extractEmails(result);
                    if (emails.length > 0) {
                        business.email = emails[0];
                        batchEmailsFound++;
                    }
                });

                updateProgress(
                    businesses.length,
                    totalBusinesses,
                    'Collecte des emails...',
                    totalBusinesses,
                    currentEmailsFound + batchEmailsFound
                );
                
                return businesses;
            }
        } catch (error) {
            console.error('Error collecting emails:', error);
        }

        return businesses;
    }
}