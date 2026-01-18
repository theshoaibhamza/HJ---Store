/**
 * =====================================================
 * CHANDNI JEWELLERY - User Model
 * =====================================================
 */

import { apiService } from '../services/ApiService.js';

export class UserModel {
  constructor() {
    this.currentUser = null;
  }

  /**
   * Register new user
   */
  async register(userData) {
    const response = await apiService.post('/auth/register', userData);
    // Backend returns { data: { token, user } }
    const data = response.data || response;
    if (data.token) {
      apiService.setToken(data.token);
      this.saveUserToStorage(data.user);
    }
    return response;
  }

  /**
   * Login user
   */
  async login(credentials) {
    const response = await apiService.post('/auth/login', credentials);
    // Backend returns { data: { token, user } }
    const data = response.data || response;
    if (data.token) {
      console.log('Login successful, saving token and user data');
      console.log('Response structure:', response);
      console.log('Token from data:', data.token);
      apiService.setToken(data.token);
      this.saveUserToStorage(data.user);
      console.log('Token saved:', !!localStorage.getItem('authToken'));
      console.log('User data saved:', !!localStorage.getItem('userData'));
    } else {
      console.error('No token in response!', response);
    }
    return response;
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      apiService.setToken(null);
      this.clearUserFromStorage();
      window.location.href = '/';
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser() {
    try {
      const response = await apiService.get('/auth/me');
      this.currentUser = response.user;
      return response;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userData) {
    const response = await apiService.put('/auth/profile', userData);
    if (response.user) {
      this.saveUserToStorage(response.user);
    }
    return response;
  }

  /**
   * Change password
   */
  async changePassword(passwordData) {
    return await apiService.put('/auth/password', passwordData);
  }

  /**
   * Add user address
   */
  async addAddress(addressData) {
    return await apiService.post('/users/addresses', addressData);
  }

  /**
   * Update user address
   */
  async updateAddress(addressId, addressData) {
    return await apiService.put(`/users/addresses/${addressId}`, addressData);
  }

  /**
   * Delete user address
   */
  async deleteAddress(addressId) {
    return await apiService.delete(`/users/addresses/${addressId}`);
  }

  /**
   * Check if user is logged in
   * Verifies both token existence and user state consistency
   */
  isLoggedIn() {
    const hasToken = !!apiService.getToken();
    const hasUser = !!this.currentUser;
    
    // If token exists but no user in memory, try to restore from storage
    if (hasToken && !hasUser) {
      this.getUserFromStorage();
    }
    
    return hasToken && !!this.currentUser;
  }

  /**
   * Check if user is admin
   */
  isAdmin() {
    return this.currentUser && this.currentUser.role === 'admin';
  }

  /**
   * Get user data from localStorage
   */
  getUserFromStorage() {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        this.currentUser = JSON.parse(userData);
        return this.currentUser;
      }
    } catch (error) {
      console.warn('Failed to parse user data from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('userData');
    }
    return null;
  }

  /**
   * Save user data to localStorage
   */
  saveUserToStorage(user) {
    localStorage.setItem('userData', JSON.stringify(user));
    this.currentUser = user;
  }

  /**
   * Clear user data from localStorage
   */
  clearUserFromStorage() {
    localStorage.removeItem('userData');
    this.currentUser = null;
  }
}

// Create singleton instance
export const userModel = new UserModel();