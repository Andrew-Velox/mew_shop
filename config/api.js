// API Configuration
// You can easily switch between production and development APIs here

const API_CONFIG = {
  // Production API (Railway deployment)
  PRODUCTION: 'https://shopdrf-production.up.railway.app',
  
  // Development API (local Django server)
  DEVELOPMENT: 'http://127.0.0.1:8000',
  
  // Current environment - NOW USING PRODUCTION
  CURRENT: 'PRODUCTION' // Production is working!
}

// Get the base URL for API calls
export const getApiBaseUrl = () => {
  // You can manually override this by changing CURRENT above
  if (API_CONFIG.CURRENT === 'PRODUCTION') {
    return API_CONFIG.PRODUCTION
  }
  return API_CONFIG.DEVELOPMENT
}

// Get API endpoints
export const API_ENDPOINTS = {
  LOGIN: '/users/login/',
  REGISTER: '/users/register/',
  LOGOUT: '/users/logout/',
}

// Build full API URL
export const buildApiUrl = (endpoint) => {
  return `${getApiBaseUrl()}${endpoint}`
}

// API URLs with fallback
export const getApiUrls = (endpoint) => {
  return [
    `${API_CONFIG.PRODUCTION}${endpoint}`,
    `${API_CONFIG.DEVELOPMENT}${endpoint}`
  ]
}

export default API_CONFIG
