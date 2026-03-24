import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL,
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  supabase: {
    url: process.env.DATABASE_URL,
    key: process.env.DATABASE_KEY,
    serviceKey: process.env.DATABASE_SERVICE_ROLE_KEY,
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
  }
};

// Validation
const required = ['FIREBASE_PROJECT_ID', 'DATABASE_URL', 'DATABASE_SERVICE_ROLE_KEY'];
required.forEach(key => {
  if (!process.env[key]) throw new Error(`CRITICAL: Missing ${key} in .env`);
});