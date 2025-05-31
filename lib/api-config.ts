// API Configuration
export const API_CONFIG = {
  // Vercel serverless functions - no external URL needed
  FLASK_BASE_URL: "",
  
  // API endpoints
  ENDPOINTS: {
    AMAZON_SEARCH: "/api/amazon/search",
    AMAZON_BUYBOX: "/api/amazon/buybox",
  }
}

// Helper function to build full API URLs
export function buildApiUrl(endpoint: string): string {
  // For Vercel deployment, use relative URLs for serverless functions
  return endpoint
} 