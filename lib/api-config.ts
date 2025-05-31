// API Configuration
export const API_CONFIG = {
  // Flask backend URL - update this to match your Flask server
  FLASK_BASE_URL: process.env.NEXT_PUBLIC_FLASK_API_URL || "http://localhost:5002",
  
  // API endpoints
  ENDPOINTS: {
    AMAZON_SEARCH: "/api/amazon/search",
    AMAZON_BUYBOX: "/api/amazon/buybox",
  }
}

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string) => {
  return `${API_CONFIG.FLASK_BASE_URL}${endpoint}`
} 