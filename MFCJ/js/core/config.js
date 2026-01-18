/**
 * =====================================================
 * CHANDNI JEWELLERY - Configuration
 * =====================================================
 */

export const Config = {
  // Site info
  siteName: 'Chandni Jewellery',
  siteUrl: 'https://chandnijewellery.com.au',
  
  // API endpoints - Matches backend at http://localhost:5000/api
  api: {
    baseUrl: 'http://localhost:5000/api',
    auth: '/auth',
    products: '/products',
    cart: '/cart',
    orders: '/orders',
    users: '/users',
    promocodes: '/promocodes',
    // Specific endpoints from backend documentation
    authEndpoints: {
      register: '/auth/register',
      login: '/auth/login',
      me: '/auth/me',
      profile: '/auth/profile',
      password: '/auth/password',
      logout: '/auth/logout'
    },
    productEndpoints: {
      list: '/products',
      featured: '/products/featured',
      categories: '/products/categories',
      single: '/products/:id',
      reviews: '/products/:id/reviews',
      create: '/products',
      update: '/products/:id',
      delete: '/products/:id'
    },
    cartEndpoints: {
      get: '/cart',
      addItem: '/cart/items',
      updateItem: '/cart/items/:itemId',
      removeItem: '/cart/items/:itemId',
      clear: '/cart',
      applyPromo: '/cart/promo',
      removePromo: '/cart/promo',
      updateNote: '/cart/note'
    },
    orderEndpoints: {
      create: '/orders',
      list: '/orders',
      single: '/orders/:id',
      cancel: '/orders/:id/cancel',
      adminList: '/orders/admin/all',
      adminStats: '/orders/admin/stats',
      updateStatus: '/orders/:id/status',
      updatePayment: '/orders/:id/payment'
    },
    promoEndpoints: {
      list: '/promocodes',
      validate: '/promocodes/validate',
      create: '/promocodes',
      adminList: '/promocodes/admin',
      single: '/promocodes/:id',
      update: '/promocodes/:id',
      delete: '/promocodes/:id',
      adminStats: '/promocodes/admin/stats'
    }
  },

  // Default currency
  currency: {
    code: 'PKR',
    symbol: '₨',
    locale: 'en-PK'
  },

  // Available currencies
  currencies: [
    { code:  'PKR', symbol: '₨', name: 'Pakistani Rupee', locale: 'en-PK', country: 'Pakistan', flag: 'pk' },
    { code: 'AUD', symbol: '$', name: 'Australian Dollar', locale:  'en-AU', country: 'Australia', flag: 'au' },
    { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US', country: 'United States', flag: 'us' },
    { code: 'GBP', symbol:  '£', name:  'British Pound', locale: 'en-GB', country: 'United Kingdom', flag: 'gb' },
    { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE', country: 'Europe', flag: 'eu' },
    { code: 'CAD', symbol: '$', name: 'Canadian Dollar', locale:  'en-CA', country: 'Canada', flag: 'ca' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', locale: 'ar-AE', country: 'United Arab Emirates', flag:  'ae' },
    { code:  'INR', symbol: '₹', name:  'Indian Rupee', locale: 'en-IN', country: 'India', flag: 'in' }
  ],

  // Breakpoints (match CSS)
  breakpoints:  {
    sm: 640,
    md:  768,
    lg: 1024,
    xl:  1280,
    xxl: 1440
  },

  // Animation durations (ms)
  animation: {
    fast: 150,
    base: 300,
    slow: 500,
    slower: 700
  },

  // Carousel defaults
  carousel: {
    autoplay: true,
    autoplayInterval: 5000,
    pauseOnHover: true,
    loop: true
  },

  // Cart settings
  cart: {
    maxQuantity: 10,
    freeShippingThreshold: 100 // in AUD (Australian Dollars) - converted for other currencies
  },

  // Search settings
  search: {
    minChars: 2,
    debounceTime: 300,
    maxResults: 10
  },

  // Toast notifications
  toast: {
    duration: 5000,
    position: 'bottom-right'
  },

  // Local storage keys
  storageKeys: {
    cart: 'chandni_cart',
    currency: 'chandni_currency',
    wishlist: 'chandni_wishlist',
    recentlyViewed: 'chandni_recently_viewed',
    cookieConsent: 'chandni_cookie_consent'
  },

  // Social links
  social: {
    facebook: 'https://facebook.com/chandnijewellery21',
    instagram: 'https://instagram.com/chandni.jewellery'
  },

  // Contact info
  contact: {
    email: 'info@chandnijewellery.com.au',
    phone: '',
    location: 'Brisbane, Australia'
  },

  // Test Credentials (from backend README - for development only)
  // REMOVE THESE IN PRODUCTION
  testAccounts: {
    admin: {
      email: 'admin@chandni.com',
      password: 'Admin@123',
      role: 'admin'
    },
    user: {
      email: 'john@example.com',
      password: 'User@123',
      role: 'user'
    }
  },

  // Test Promo Codes
  testPromoCodes: [
    { code: 'WELCOME10', description: '10% off first order (min $100)' },
    { code: 'SAVE20', description: '20% off orders above $200' },
    { code: 'FREESHIP', description: 'Free shipping on all orders' }
  ],

  // Backend Server Configuration
  backend: {
    environment: 'development', // Change to 'production' for deployment
    port: 5000,
    host: 'http://localhost:5000',
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000 // 1 second between retries
  },

  // JWT Configuration
  jwt: {
    storageKey: 'authToken',
    expiresIn: '30d'
  },

  // Request Headers
  requestHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};