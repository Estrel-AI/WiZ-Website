/**
 * WiiZ Frontend Configuration
 * Dynamically loads backend URL based on environment
 */

class WiiZConfig {
  constructor() {
    this.config = {
      // Default development URLs
      BACKEND_URL: 'http://localhost:3001',
      FRONTEND_URL: 'http://localhost:3000',
      
      // Production URLs (will be loaded dynamically)
      PRODUCTION_BACKEND_URL: 'https://backend.wiiz.it',
      PRODUCTION_FRONTEND_URL: 'https://www.wiiz.it',
      
      // Environment detection
      IS_PRODUCTION: true,
      IS_LOCALHOST: false
    };
    
    this.init();
  }
  
  init() {
    // Detect environment
    this.detectEnvironment();
    
    // Load configuration
    this.loadConfig();
  }
  
  detectEnvironment() {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = window.location.port;
    
    // Check if running on localhost
    this.config.IS_LOCALHOST = hostname === 'localhost' || hostname === '127.0.0.1';
    
    // Check if running in production
    this.config.IS_PRODUCTION = !this.config.IS_LOCALHOST && hostname !== '';
    
    console.log('🌐 WiiZ Environment Detection:', {
      hostname,
      protocol,
      port,
      isLocalhost: this.config.IS_LOCALHOST,
      isProduction: this.config.IS_PRODUCTION,
      backendUrl: this.getBackendUrl(),
      frontendUrl: this.getFrontendUrl()
    });
  }
  
  loadConfig() {
    if (this.config.IS_PRODUCTION) {
      // Production environment - load from meta tags or window object
      this.loadProductionConfig();
    } else {
      // Development environment - use localhost
      this.loadDevelopmentConfig();
    }
  }
  
  loadProductionConfig() {
    // Hardcoded production URLs
     this.config.PRODUCTION_BACKEND_URL = 'https://backend.wiiz.it';
     this.config.PRODUCTION_FRONTEND_URL = 'https://www.wiiz.it';
    // this.config.PRODUCTION_BACKEND_URL = 'http://localhost:3001';
    // this.config.PRODUCTION_FRONTEND_URL = 'http://localhost:3001';
    
    console.log('🚀 Production Config Loaded:', {
      backend: this.config.PRODUCTION_BACKEND_URL,
      frontend: this.config.PRODUCTION_FRONTEND_URL
    });
  }
  
  loadDevelopmentConfig() {
    console.log('🛠️ Development Config Loaded:', {
      backend: this.config.BACKEND_URL,
      frontend: this.config.FRONTEND_URL
    });
  }
  
  // Public methods to get URLs
  getBackendUrl() {
    return this.config.IS_PRODUCTION 
      ? this.config.PRODUCTION_BACKEND_URL 
      : this.config.BACKEND_URL;
  }
  
  getFrontendUrl() {
    return this.config.IS_PRODUCTION 
      ? this.config.PRODUCTION_FRONTEND_URL 
      : this.config.FRONTEND_URL;
  }
  
  // Helper methods for common endpoints
  getAuthUrl(provider) {
    return `${this.getBackendUrl()}/auth/${provider}`;
  }
  
  getApiUrl(endpoint) {
    return `${this.getBackendUrl()}/api/${endpoint}`;
  }
  
  isProduction() {
    return this.config.IS_PRODUCTION;
  }
  
  isLocalhost() {
    return this.config.IS_LOCALHOST;
  }
  
  // Test method to verify configuration
  testConfiguration() {
    console.log('🧪 WiiZ Configuration Test:', {
      environment: this.config.IS_PRODUCTION ? 'production' : 'development',
      backendUrl: this.getBackendUrl(),
      frontendUrl: this.getFrontendUrl(),
      authUrls: {
        google: this.getAuthUrl('google'),
        linkedin: this.getAuthUrl('linkedin'),
        github: this.getAuthUrl('github')
      },
      apiUrls: {
        fixZohoCustomer: this.getApiUrl('fix-zoho-customer'),
        example: this.getApiUrl('example')
      }
    });
    return true;
  }
}

// Create global instance
window.WiiZConfig = new WiiZConfig();

// Export for modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WiiZConfig;
}