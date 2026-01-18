/**
 * =====================================================
 * CHANDNI JEWELLERY - Utility Functions
 * =====================================================
 */

export const Utils = {
  /**
   * Query selector shorthand
   * @param {string} selector - CSS selector
   * @param {Element} parent - Parent element
   * @returns {Element|null}
   */
  qs(selector, parent = document) {
    return parent.querySelector(selector);
  },

  /**
   * Query selector all shorthand
   * @param {string} selector - CSS selector
   * @param {Element} parent - Parent element
   * @returns {Element[]}
   */
  qsa(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
  },

  /**
   * Add event listener with optional delegation
   * 
   * WARNING: When using string selector (delegation), the handler is attached to document
   * and cannot be removed via off(). For removable delegated listeners, use onDelegated() instead.
   * Only use this pattern for listeners that should persist for the lifetime of the page.
   * 
   * @param {Element|string} target - Element or selector
   * @param {string} event - Event type
   * @param {Function} handler - Event handler
   * @param {Object} options - Event options
   */
  on(target, event, handler, options = {}) {
    if (typeof target === 'string') {
      // Event delegation - handler attached to document
      document.addEventListener(event, (e) => {
        const element = e.target.closest(target);
        if (element) {
          handler.call(element, e, element);
        }
      }, options);
    } else if (target) {
      target.addEventListener(event, handler, options);
    }
  },

  /**
   * Map to store delegated event handlers for removal
   * @private
   */
  _delegatedHandlers: new Map(),

  /**
   * Add delegated event listener that can be removed
   * @param {string} selector - CSS selector for delegation
   * @param {string} event - Event type
   * @param {Function} handler - Event handler
   * @param {Object} options - Event options
   * @returns {string} - Handler ID for removal
   */
  onDelegated(selector, event, handler, options = {}) {
    const handlerId = this.uniqueId('delegated');
    
    const wrappedHandler = (e) => {
      const element = e.target.closest(selector);
      if (element) {
        handler.call(element, e, element);
      }
    };
    
    document.addEventListener(event, wrappedHandler, options);
    
    this._delegatedHandlers.set(handlerId, {
      event,
      handler: wrappedHandler,
      options
    });
    
    return handlerId;
  },

  /**
   * Remove delegated event listener by ID
   * @param {string} handlerId - Handler ID returned by onDelegated()
   * @returns {boolean} - True if handler was found and removed
   */
  offDelegated(handlerId) {
    const entry = this._delegatedHandlers.get(handlerId);
    if (entry) {
      document.removeEventListener(entry.event, entry.handler, entry.options);
      this._delegatedHandlers.delete(handlerId);
      return true;
    }
    return false;
  },

  /**
   * Remove event listener
   * @param {Element} element - Target element
   * @param {string} event - Event type
   * @param {Function} handler - Event handler
   */
  off(element, event, handler) {
    if (element) {
      element.removeEventListener(event, handler);
    }
  },

  /**
   * Add class to element
   * @param {Element} element - Target element
   * @param {...string} classNames - Class names to add
   */
  addClass(element, ...classNames) {
    if (element) {
      element.classList.add(...classNames);
    }
  },

  /**
   * Remove class from element
   * @param {Element} element - Target element
   * @param {...string} classNames - Class names to remove
   */
  removeClass(element, ...classNames) {
    if (element) {
      element.classList.remove(...classNames);
    }
  },

  /**
   * Toggle class on element
   * @param {Element} element - Target element
   * @param {string} className - Class name to toggle
   * @param {boolean} force - Force add/remove
   */
  toggleClass(element, className, force) {
    if (element) {
      element.classList.toggle(className, force);
    }
  },

  /**
   * Check if element has class
   * @param {Element} element - Target element
   * @param {string} className - Class name to check
   * @returns {boolean}
   */
  hasClass(element, className) {
    return element ? element.classList.contains(className) : false;
  },

  /**
   * Debounce function
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in ms
   * @returns {Function}
   */
  debounce(func, wait = 250) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function
   * @param {Function} func - Function to throttle
   * @param {number} limit - Limit time in ms
   * @returns {Function}
   */
  throttle(func, limit = 250) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Get element offset
   * @param {Element} element - Target element
   * @returns {Object} - { top, left }
   */
  getOffset(element) {
    if (!element) return { top: 0, left: 0 };
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + window.pageYOffset,
      left: rect.left + window.pageXOffset
    };
  },

  /**
   * Smooth scroll to element
   * @param {Element|string} target - Target element or selector
   * @param {number} offset - Offset from top
   */
  scrollTo(target, offset = 0) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!element) return;

    const elementPosition = this.getOffset(element).top;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  },

  /**
   * Check if element is in viewport
   * @param {Element} element - Target element
   * @param {number} threshold - Visibility threshold (0-1)
   * @returns {boolean}
   */
  isInViewport(element, threshold = 0) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    const vertInView = (rect.top <= windowHeight * (1 - threshold)) && ((rect.top + rect.height) >= windowHeight * threshold);
    const horInView = (rect.left <= windowWidth * (1 - threshold)) && ((rect.left + rect.width) >= windowWidth * threshold);

    return vertInView && horInView;
  },

  /**
   * Counter for unique ID generation fallback
   * @private
   */
  _idCounter: 0,

  /**
   * Generate unique ID
   * Uses crypto.randomUUID() when available, falls back to counter-based approach
   * @param {string} prefix - ID prefix
   * @returns {string}
   */
  uniqueId(prefix = 'id') {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return `${prefix}-${crypto.randomUUID()}`;
    }
    // Fallback: counter-based approach guarantees uniqueness within session
    this._idCounter++;
    return `${prefix}-${Date.now()}-${this._idCounter}`;
  },

  /**
   * Format currency
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency code
   * @param {string} locale - Locale string
   * @returns {string}
   */
  formatCurrency(amount, currency = 'PKR', locale = 'en-PK') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  },

  /**
   * Parse price string to number
   * @param {string} priceString - Price string
   * @returns {number}
   */
  parsePrice(priceString) {
    if (typeof priceString === 'number') return priceString;
    return parseFloat(priceString.replace(/[^0-9.-]+/g, '')) || 0;
  },

  /**
   * Local storage helpers
   */
  storage: {
    /**
     * Set item in localStorage
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     */
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn('Error saving to localStorage:', e);
      }
    },

    /**
     * Get item from localStorage
     * @param {string} key - Storage key
     * @returns {*}
     */
    get(key) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (e) {
        console.warn('Error reading from localStorage:', e);
        return null;
      }
    },

    /**
     * Remove item from localStorage
     * @param {string} key - Storage key
     */
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn('Error removing from localStorage:', e);
      }
    },

    /**
     * Clear all localStorage
     */
    clear() {
      try {
        localStorage.clear();
      } catch (e) {
        console.warn('Error clearing localStorage:', e);
      }
    }
  },

  /**
   * Cookie helpers
   */
  cookies: {
    /**
     * Set cookie
     * @param {string} name - Cookie name
     * @param {string} value - Cookie value (will be URI encoded)
     * @param {number} days - Expiry days
     */
    set(name, value, days = 365) {
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      const encodedValue = encodeURIComponent(value);
      document.cookie = `${name}=${encodedValue};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    },

    /**
     * Get cookie
     * @param {string} name - Cookie name
     * @returns {string|null} - Decoded cookie value or null
     */
    get(name) {
      const nameEQ = name + '=';
      const cookieArray = document.cookie.split(';');
      for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') cookie = cookie.substring(1, cookie.length);
        if (cookie.indexOf(nameEQ) === 0) {
          const encodedValue = cookie.substring(nameEQ.length, cookie.length);
          try {
            return decodeURIComponent(encodedValue);
          } catch (e) {
            // Return raw value if decoding fails (for legacy cookies)
            return encodedValue;
          }
        }
      }
      return null;
    },

    /**
     * Delete cookie
     * @param {string} name - Cookie name
     */
    delete(name) {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
    }
  },

  /**
   * Trap focus within element
   * @param {Element} element - Container element
   * @returns {Function} - Cleanup function
   */
  trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleKeydown = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    };

    element.addEventListener('keydown', handleKeydown);

    // Focus first element
    if (firstFocusable) {
      firstFocusable.focus();
    }

    // Return cleanup function
    return () => {
      element.removeEventListener('keydown', handleKeydown);
    };
  },

  /**
   * Fetch with timeout
   * @param {string} url - Fetch URL
   * @param {Object} options - Fetch options
   * @param {number} timeout - Timeout in ms
   * @returns {Promise}
   */
  async fetchWithTimeout(url, options = {}, timeout = 10000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  },

  /**
   * Deep clone object
   * Uses structuredClone() when available (handles more types including Date, Map, Set, etc.)
   * Falls back to JSON method which has limitations:
   * - Cannot clone functions, undefined, symbols
   * - Cannot handle circular references
   * - Date objects become strings
   * 
   * @param {Object} obj - Object to clone
   * @returns {Object}
   * @throws {Error} If object contains circular references (JSON fallback)
   */
  deepClone(obj) {
    if (typeof structuredClone === 'function') {
      try {
        return structuredClone(obj);
      } catch (e) {
        // Fall through to JSON method if structuredClone fails
        console.warn('structuredClone failed, falling back to JSON method:', e);
      }
    }
    // Fallback for older browsers
    return JSON.parse(JSON.stringify(obj));
  },

  /**
   * Check if mobile device
   * @returns {boolean}
   */
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  /**
   * Check if touch device
   * @returns {boolean}
   */
  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
};

// Export default
export default Utils;