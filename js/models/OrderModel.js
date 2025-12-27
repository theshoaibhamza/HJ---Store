/**
 * =====================================================
 * CHANDNI JEWELLERY - Order Model
 * =====================================================
 */

import { apiService } from '../services/ApiService.js';

export class OrderModel {
  // Delivery day constants
  static EXPRESS_DELIVERY_DAYS = 3;
  static STANDARD_DELIVERY_DAYS = 7;

  // Status display text maps
  static ORDER_STATUS_TEXT = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    refunded: 'Refunded'
  };

  static ORDER_STATUS_CLASS = {
    pending: 'status--pending',
    confirmed: 'status--confirmed',
    processing: 'status--processing',
    shipped: 'status--shipped',
    delivered: 'status--delivered',
    cancelled: 'status--cancelled',
    refunded: 'status--refunded'
  };

  static PAYMENT_STATUS_TEXT = {
    pending: 'Payment Pending',
    paid: 'Paid',
    failed: 'Payment Failed',
    refunded: 'Refunded',
    cancelled: 'Cancelled'
  };

  constructor() {
    this.orders = [];
    this.currentOrder = null;
  }

  /**
   * Create new order
   */
  async createOrder(orderData) {
    try {
      const response = await apiService.post('/orders', orderData);
      this.currentOrder = response.order;
      return response;
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  }

  /**
   * Get user orders
   */
  async getUserOrders(page = 1, limit = 10) {
    try {
      const response = await apiService.get('/orders', { page, limit });
      this.orders = response.orders || [];
      return response;
    } catch (error) {
      console.error('Get user orders error:', error);
      throw error;
    }
  }

  /**
   * Get single order by ID
   */
  async getOrder(orderId) {
    try {
      const response = await apiService.get(`/orders/${orderId}`);
      this.currentOrder = response.order;
      return response;
    } catch (error) {
      console.error('Get order error:', error);
      throw error;
    }
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId) {
    try {
      const response = await apiService.put(`/orders/${orderId}/cancel`);
      return response;
    } catch (error) {
      console.error('Cancel order error:', error);
      throw error;
    }
  }

  /**
   * Admin: Get all orders
   */
  async getAllOrders(page = 1, limit = 20, filters = {}) {
    try {
      const params = { page, limit, ...filters };
      const response = await apiService.get('/orders/admin/all', params);
      return response;
    } catch (error) {
      console.error('Get all orders error:', error);
      throw error;
    }
  }

  /**
   * Admin: Get order statistics
   */
  async getOrderStats() {
    try {
      const response = await apiService.get('/orders/admin/stats');
      return response;
    } catch (error) {
      console.error('Get order stats error:', error);
      throw error;
    }
  }

  /**
   * Admin: Update order status
   */
  async updateOrderStatus(orderId, status) {
    try {
      const response = await apiService.put(`/orders/${orderId}/status`, { status });
      return response;
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  }

  /**
   * Admin: Update payment status
   */
  async updatePaymentStatus(orderId, paymentStatus) {
    try {
      const response = await apiService.put(`/orders/${orderId}/payment`, { paymentStatus });
      return response;
    } catch (error) {
      console.error('Update payment status error:', error);
      throw error;
    }
  }

  /**
   * Get order status display text
   */
  getOrderStatusText(status) {
    return OrderModel.ORDER_STATUS_TEXT[status] || status;
  }

  /**
   * Get order status color class
   */
  getOrderStatusClass(status) {
    return OrderModel.ORDER_STATUS_CLASS[status] || 'status--default';
  }

  /**
   * Get payment status display text
   */
  getPaymentStatusText(status) {
    return OrderModel.PAYMENT_STATUS_TEXT[status] || status;
  }

  /**
   * Check if order can be cancelled
   */
  canCancelOrder(order) {
    const cancellableStatuses = ['pending', 'confirmed'];
    return cancellableStatuses.includes(order.orderStatus);
  }

  /**
   * Format order date
   */
  formatOrderDate(date) {
    return new Date(date).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Calculate order total from components
   * Note: Use this for calculating totals from item subtotals.
   * If order.totalAmount is already the final amount, use that directly.
   * @param {Object} order - Order object
   * @param {boolean} useSubtotals - If true, calculate from items; if false, use totalAmount
   * @returns {number}
   */
  calculateOrderTotal(order, useSubtotals = true) {
    let subtotal;
    
    if (useSubtotals && order.items && Array.isArray(order.items)) {
      // Calculate from item subtotals
      subtotal = order.items.reduce((sum, item) => {
        const itemPrice = item.price || 0;
        const itemQuantity = item.quantity || 1;
        return sum + (itemPrice * itemQuantity);
      }, 0);
    } else {
      // Use totalAmount as the subtotal (assumes it's item total before adjustments)
      subtotal = order.subtotal || order.totalAmount || 0;
    }
    
    let total = subtotal;
    
    // Apply discount
    if (order.discount && typeof order.discount.amount === 'number') {
      total -= order.discount.amount;
    }
    
    // Add shipping cost
    if (order.shipping && typeof order.shipping.cost === 'number') {
      total += order.shipping.cost;
    }
    
    // Add tax
    if (order.tax && typeof order.tax.amount === 'number') {
      total += order.tax.amount;
    }
    
    return Math.max(0, total);
  }

  /**
   * Get estimated delivery date
   * @param {Object} order - Order object
   * @returns {Date|null} - Estimated delivery date or null if cannot be calculated
   */
  getEstimatedDelivery(order) {
    // Use existing estimated delivery if available
    if (order.shipping?.estimatedDelivery) {
      const estimatedDate = new Date(order.shipping.estimatedDelivery);
      if (!isNaN(estimatedDate.getTime())) {
        return estimatedDate;
      }
    }
    
    // Validate order.createdAt before using it
    if (!order.createdAt) {
      console.warn('Order missing createdAt date, cannot calculate estimated delivery');
      return null;
    }
    
    const orderDate = new Date(order.createdAt);
    if (isNaN(orderDate.getTime())) {
      console.warn('Invalid order createdAt date:', order.createdAt);
      return null;
    }
    
    // Calculate based on order date and shipping method
    const deliveryDays = order.shipping?.method === 'express' 
      ? OrderModel.EXPRESS_DELIVERY_DAYS 
      : OrderModel.STANDARD_DELIVERY_DAYS;
    
    const estimatedDate = new Date(orderDate);
    estimatedDate.setDate(orderDate.getDate() + deliveryDays);
    
    return estimatedDate;
  }
}

// Create singleton instance
export const orderModel = new OrderModel();