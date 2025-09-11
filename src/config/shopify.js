// Shopify configuration for frontend
// This file handles environment variables and configuration

const config = {
  // Shopify OAuth Configuration
  shopify: {
    // Use your existing environment variables
    storeDomain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'your-store.myshopify.com',
    apiKey: import.meta.env.VITE_SHOPIFY_API_KEY || 'your-api-key',
    
    // OAuth scopes
    scopes: [
      'read_products',
      'read_orders', 
      'read_customers',
      'read_analytics'
    ].join(',')
  },
  
  // API Configuration
  api: {
    baseUrl: window.location.hostname === 'localhost' 
      ? '/api'  // Use Vite proxy for local development
      : 'https://analytics-dashboard-backend-plum.vercel.app/api'
  }
};

export default config;
