/**
 * =====================================================
 * CHANDNI JEWELLERY - Configuration
 * =====================================================
 */

export const Config = {
  // Site info
  siteName: 'Chandni Jewellery',
  siteUrl: 'https://chandnijewellery.com.au',
  
  // API endpoints
  api: {
    baseUrl: 'https://chandni-jewellery-backend.vercel.app/api',
    auth: 'https://chandni-jewellery-backend.vercel.app/api/auth',
    products: 'https://chandni-jewellery-backend.vercel.app/api/products',
    cart: 'https://chandni-jewellery-backend.vercel.app/api/cart',
    orders: 'https://chandni-jewellery-backend.vercel.app/api/orders',
    users: 'https://chandni-jewellery-backend.vercel.app/api/users',
    promocodes: 'https://chandni-jewellery-backend.vercel.app/api/promocodes'
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
  }
};

// Export default
export default Config;