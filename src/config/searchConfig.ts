export const SEARCH_CONFIG = {
  // API limits
  API: {
    MAX_DAILY_REQUESTS: 2500,
    WARNING_THRESHOLD: 2400,
    MAX_RESULTS: 1000,
    DELAY_BETWEEN_REQUESTS: 2000, // ms
    MAX_PAGES_PER_SEARCH: 10,

  },
  RADIUS: {
    DEFAULT: 50,
    MAX: 100,
    INCREMENTS: [1, 1.5, 2, 3, 4]
  },
  // Search behavior
  BEHAVIOR: {
    MAX_RETRIES: 3,
    BATCH_SIZE: 20
  }
} as const;