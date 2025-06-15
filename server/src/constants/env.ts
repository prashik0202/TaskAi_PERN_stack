// function to get env variables
const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`Missing String environment variable for ${key}`);
  }
  return value;
};

export const DATABASE_URL = getEnv("DATABASE_URL");
export const NODE_ENV = getEnv("NODE_ENV", "development");
export const APP_ORIGIN = getEnv("APP_ORIGIN");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const RESEND_API = getEnv("RESEND_API");
export const EMAIL_SENDER = getEnv("EMAIL_SENDER");
export const PORT = getEnv("PORT");
