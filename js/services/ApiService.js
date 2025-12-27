/**
 * =====================================================
 * CHANDNI JEWELLERY - API Service
 * =====================================================
 * 
 * SECURITY NOTE: This service stores authentication tokens in localStorage.
 * localStorage is vulnerable to XSS attacks - any JavaScript running on the page
 * can access the token. For enhanced security, consider:
 * 1. Using httpOnly cookies for token storage (requires backend support)
 * 2. Implementing Content Security Policy (CSP) headers
 * 3. Sanitizing all user inputs to prevent XSS
 * 4. Using short-lived tokens with refresh token rotation
 */

import { Config } from '../core/config.js';

/**
 * Custom error class for authentication failures
 */
export class AuthenticationError extends Error {
  constructor(message = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
    this.status = 401;
  }
}

/**
 * Custom error class for API request failures
 */
export class ApiError extends Error {
  constructor(message, status, url, method) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.url = url;
    this.method = method;
  }
}

export class ApiService {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || Config.api.baseUrl;
    this.loginRedirectPath = options.loginRedirectPath || Config.api?.loginRedirectPath || '/pages/login.html';
    this.token = localStorage.getItem('authToken');
  }

  /**
   * Set authentication token
   */
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  /**
   * Get authentication token
   */
  getToken() {
    return this.token || localStorage.getItem('authToken');
  }

  /**
   * Make authenticated request
   */
  async request(url, options = {}) {
    const token = this.getToken();
    const fullUrl = `${this.baseUrl}${url}`;
    const method = options.method || 'GET';
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    };

    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    };

    try {
      const response = await fetch(fullUrl, config);
      
      if (response.status === 401) {
        // Token expired or invalid
        this.setToken(null);
        const error = new AuthenticationError('Session expired. Please log in again.');
        console.error('Authentication Error:', {
          url: fullUrl,
          method,
          status: response.status
        });
        // Redirect to login page
        window.location.href = this.loginRedirectPath;
        throw error;
      }

      // Safely parse JSON response
      let data = null;
      const contentType = response.headers.get('content-type');
      
      if (response.status !== 204 && contentType?.includes('application/json')) {
        try {
          data = await response.json();
        } catch (parseError) {
          console.error('JSON Parse Error:', {
            url: fullUrl,
            method,
            status: response.status,
            contentType,
            error: parseError.message
          });
          // If we can't parse JSON but response is not OK, throw generic error
          if (!response.ok) {
            throw new ApiError(
              `Request failed with status ${response.status}`,
              response.status,
              fullUrl,
              method
            );
          }
          // For OK responses with unparseable body, return null
          data = null;
        }
      }
      
      if (!response.ok) {
        const errorMessage = data?.message || `Request failed with status ${response.status}`;
        throw new ApiError(errorMessage, response.status, fullUrl, method);
      }

      return data;
    } catch (error) {
      // Re-throw our custom errors
      if (error instanceof AuthenticationError || error instanceof ApiError) {
        throw error;
      }
      
      // Log network or other errors with full context
      console.error('API Request Error:', {
        url: fullUrl,
        method,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(url, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const requestUrl = queryString ? `${url}?${queryString}` : url;
    
    return this.request(requestUrl, {
      method: 'GET'
    });
  }

  /**
   * POST request
   */
  async post(url, data = {}) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * PUT request
   */
  async put(url, data = {}) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * DELETE request
   */
  async delete(url) {
    return this.request(url, {
      method: 'DELETE'
    });
  }
}

// Create singleton instance
export const apiService = new ApiService();