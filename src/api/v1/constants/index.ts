// .env destructuring
export const {
  NODE_ENV,
  SERVER_PORT,
  SERVER_HOST,
  API_VERSION,
  SESSION_ID,
  SESSION_SECRET,
  REDIS_DB_HOST,
  REDIS_DB_PORT,
  DATABASE_DIALECT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_DB,
  DATABASE_HOST,
  DATABASE_PORT,
} = process.env;

export const production = NODE_ENV === 'production';
export const development = NODE_ENV === 'development';
export const rootDir = production ? 'build/api/v1' : 'src/api/v1';
export const fileExtension = production ? '*.js' : '*.ts';

// maximum items to return from database for each query requests
export const maxLimit = 10;

export const invalidRate = 'Rating should be between 0 and 10.';

export const invalidIdentifier = 'Identifier is invalid.';

// Opening balance on account creation
export const openingBalance = 1000;

// server ready message
export const serverReady = `\n🚀 Server ready at http://${SERVER_HOST}:${SERVER_PORT}${API_VERSION}`;

// cookie max age in ms of 1 hour
export const maxAge = 1000 * 60 * 60;

export const countries = [
  {
    code: 'US',
    name: 'United States',
    emoji: '🇺🇸',
  },
  {
    code: 'CN',
    name: 'China',
    emoji: '🇨🇳',
  },
  {
    code: 'JP',
    name: 'Japan',
    emoji: '🇯🇵',
  },
  {
    code: 'DE',
    name: 'Germany',
    emoji: '🇩🇪',
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    emoji: '🇬🇧',
  },
  {
    code: 'IN',
    name: 'India',
    emoji: '🇮🇳',
  },
  {
    code: 'FR',
    name: 'France',
    emoji: '🇫🇷',
  },
  {
    code: 'IT',
    name: 'Italy',
    emoji: '🇮🇹',
  },
  {
    code: 'NG',
    name: 'Nigeria',
    emoji: '🇳🇬',
  },
  {
    code: 'EG',
    name: 'Egypt',
    emoji: '🇪🇬',
  },
  {
    code: 'ZA',
    name: 'South Africa',
    emoji: '🇿🇦',
  },
  {
    code: 'GH',
    name: 'Ghana',
    emoji: '🇬🇭',
  },
];
