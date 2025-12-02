/**
 * Environment variables validation for NeuroExpert
 * Ensures required environment variables are set before app starts
 */

/**
 * Required environment variables by environment
 */
const REQUIRED_ENV_VARS = {
  production: [
    'VITE_SENTRY_DSN', // Required for error monitoring in production
  ],
  development: [
    // No required vars for development
  ],
  test: [
    // No required vars for tests
  ]
};

/**
 * Optional but recommended environment variables
 */
const RECOMMENDED_ENV_VARS = {
  production: [
    'VITE_BACKEND_URL', // Backend URL (defaults to /api if not set)
  ],
  development: [
    'VITE_BACKEND_URL', // Useful for local development
  ]
};

/**
 * Validate environment variables
 * @throws {Error} If required environment variables are missing
 */
export function validateEnv() {
  const env = import.meta.env.MODE || 'development';
  const required = REQUIRED_ENV_VARS[env] || [];
  const recommended = RECOMMENDED_ENV_VARS[env] || [];

  // Check required variables
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    const error = new Error(
      `❌ Missing required environment variables for ${env}:\n` +
      missing.map(key => `  - ${key}`).join('\n') +
      '\n\nPlease check your .env file or Vercel environment variables.'
    );
    
    console.error(error.message);
    
    // In production, throw error to prevent app from starting
    if (env === 'production') {
      throw error;
    }
    
    // In development, just warn
    console.warn('⚠️ App may not function correctly without these variables.');
  }

  // Check recommended variables
  const missingRecommended = recommended.filter(key => !import.meta.env[key]);
  
  if (missingRecommended.length > 0 && env !== 'test') {
    console.warn(
      `⚠️ Missing recommended environment variables for ${env}:\n` +
      missingRecommended.map(key => `  - ${key}`).join('\n')
    );
  }

  // Log successful validation in development
  if (env === 'development' && missing.length === 0) {
    console.log('✅ Environment variables validated successfully');
  }

  return {
    valid: missing.length === 0,
    missing,
    missingRecommended,
    env
  };
}

/**
 * Get environment variable with fallback
 * @param {string} key - Environment variable key
 * @param {string} fallback - Fallback value if not set
 * @returns {string} Environment variable value or fallback
 */
export function getEnv(key, fallback = '') {
  return import.meta.env[key] || fallback;
}

/**
 * Check if running in production
 */
export function isProduction() {
  return import.meta.env.MODE === 'production';
}

/**
 * Check if running in development
 */
export function isDevelopment() {
  return import.meta.env.MODE === 'development';
}

/**
 * Check if running in test
 */
export function isTest() {
  return import.meta.env.MODE === 'test';
}

/**
 * Get current environment
 */
export function getEnvironment() {
  return import.meta.env.MODE || 'development';
}

export default {
  validateEnv,
  getEnv,
  isProduction,
  isDevelopment,
  isTest,
  getEnvironment
};
