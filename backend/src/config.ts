import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || '4000', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL || '',
};

export const DEFAULT_WEIGHTS = {
  infra: 0.30,
  listing: 0.15,
  pricing: 0.25,
  rental: 0.20,
  saturation: 0.10,
};

export type Weights = typeof DEFAULT_WEIGHTS;
