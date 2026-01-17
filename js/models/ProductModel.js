/**
 * =====================================================
 * CHANDNI JEWELLERY - Product Model
 * =====================================================
 */

import { apiService } from '../services/ApiService.js';

export class ProductModel {
  // Stock threshold for "Low Stock" status
  static LOW_STOCK_THRESHOLD = 5;

  constructor() {
    this.products = [];
    this.categories = [];
    this.currentProduct = null;
  }

  /**
   * Get all products with filters
   */
  async getProducts(filters = {}) {
    try {
      const response = await apiService.get('/products', filters);
      this.products = response.products || [];
      return response;
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  }

  /**
   * Get single product by ID
   */
  async getProduct(id) {
    try {
      const response = await apiService.get(`/products/${id}`);
      this.currentProduct = response.product;
      return response;
    } catch (error) {
      console.error('Get product error:', error);
      throw error;
    }
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts() {
    try {
      const response = await apiService.get('/products/featured');
      return response;
    } catch (error) {
      console.error('Get featured products error:', error);
      throw error;
    }
  }

  /**
   * Get all categories
   */
  async getCategories() {
    try {
      const response = await apiService.get('/products/categories');
      this.categories = response.categories || [];
      return response;
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  }

  /**
   * Search products
   */
  async searchProducts(query, filters = {}) {
    try {
      const searchParams = {
        search: query,
        ...filters
      };
      const response = await apiService.get('/products', searchParams);
      return response;
    } catch (error) {
      console.error('Search products error:', error);
      throw error;
    }
  }

  /**
   * Add product review
   */
  async addReview(productId, reviewData) {
    try {
      const response = await apiService.post(`/products/${productId}/reviews`, reviewData);
      return response;
    } catch (error) {
      console.error('Add review error:', error);
      throw error;
    }
  }

  /**
   * Admin: Create product
   */
  async createProduct(productData) {
    try {
      const response = await apiService.post('/products', productData);
      return response;
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
    }
  }

  /**
   * Admin: Update product
   */
  async updateProduct(id, productData) {
    try {
      const response = await apiService.put(`/products/${id}`, productData);
      return response;
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  }

  /**
   * Admin: Delete product
   */
  async deleteProduct(id) {
    try {
      const response = await apiService.delete(`/products/${id}`);
      return response;
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    }
  }

  /**
   * Format price based on currency
   */
  formatPrice(price, currency = 'PKR') {
    const currencyMap = {
      PKR: { symbol: '₨', locale: 'en-PK' },
      AUD: { symbol: '$', locale: 'en-AU' },
      USD: { symbol: '$', locale: 'en-US' },
      GBP: { symbol: '£', locale: 'en-GB' },
      EUR: { symbol: '€', locale: 'de-DE' }
    };

    // Use the provided currency if supported, otherwise fall back to PKR
    const validCurrency = currencyMap[currency] ? currency : 'PKR';
    const currencyInfo = currencyMap[validCurrency];
    
    return new Intl.NumberFormat(currencyInfo.locale, {
      style: 'currency',
      currency: validCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  }

  /**
   * Get product availability status
   */
  getAvailabilityStatus(product) {
    if (!product || product.quantity === 0) {
      return 'Out of Stock';
    } else if (product.quantity < ProductModel.LOW_STOCK_THRESHOLD) {
      return 'Low Stock';
    } else {
      return 'In Stock';
    }
  }
}

// Create singleton instance
export const productModel = new ProductModel();