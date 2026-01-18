/**
 * =====================================================
 * CHANDNI JEWELLERY - Cart Model
 * =====================================================
 */

import { apiService } from '../services/ApiService.js';

export class CartModel {
  constructor() {
    this.cart = null;
    this.isLoading = false;
    this.activeNotification = null;
    this.notificationTimeout = null;
  }

  /**
   * Get user cart
   */
  async getCart() {
    try {
      this.isLoading = true;
      const response = await apiService.get('/cart');
      // Backend returns { data: { cart } }
      const data = response.data || response;
      this.cart = data.cart || response.cart;
      console.log('Cart loaded:', this.cart);
      this.updateCartBadge();
      return { cart: this.cart };
    } catch (error) {
      console.error('Get cart error:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Add item to cart
   */
  async addToCart(itemData) {
    try {
      console.log('📦 CartModel.addToCart called with:', itemData);
      this.isLoading = true;
      console.log('Making POST request to /cart/items...');
      const response = await apiService.post('/cart/items', itemData);
      console.log('API response received:', response);
      // Backend returns { data: { cart } }
      const data = response.data || response;
      this.cart = data.cart || response.cart;
      console.log('Cart updated:', this.cart);
      this.updateCartBadge();
      this.showCartNotification('Item added to cart');
      return { cart: this.cart };
    } catch (error) {
      console.error('Add to cart error:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(itemId, quantity) {
    try {
      this.isLoading = true;
      const response = await apiService.put(`/cart/items/${itemId}`, { quantity });
      // Backend returns { data: { cart } }
      const data = response.data || response;
      this.cart = data.cart || response.cart;
      this.updateCartBadge();
      return { cart: this.cart };
    } catch (error) {
      console.error('Update cart item error:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(itemId) {
    try {
      this.isLoading = true;
      const response = await apiService.delete(`/cart/items/${itemId}`);
      // Backend returns { data: { cart } }
      const data = response.data || response;
      this.cart = data.cart || response.cart;
      this.updateCartBadge();
      this.showCartNotification('Item removed from cart');
      return { cart: this.cart };
    } catch (error) {
      console.error('Remove from cart error:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Clear cart
   */
  async clearCart() {
    try {
      this.isLoading = true;
      const response = await apiService.delete('/cart');
      // Backend returns { data: { cart } }
      const data = response.data || response;
      this.cart = data.cart || null;
      this.updateCartBadge();
      this.showCartNotification('Cart cleared');
      return { cart: this.cart };
    } catch (error) {
      console.error('Clear cart error:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Apply promo code
   */
  async applyPromoCode(promoCode) {
    try {
      this.isLoading = true;
      const response = await apiService.post('/cart/promo', { promoCode });
      // Backend returns { data: { cart } }
      const data = response.data || response;
      this.cart = data.cart || response.cart;
      this.showCartNotification(`Promo code "${promoCode}" applied successfully`);
      return { cart: this.cart };
    } catch (error) {
      console.error('Apply promo code error:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Remove promo code
   */
  async removePromoCode() {
    try {
      this.isLoading = true;
      const response = await apiService.delete('/cart/promo');
      // Backend returns { data: { cart } }
      const data = response.data || response;
      this.cart = data.cart || response.cart;
      this.showCartNotification('Promo code removed');
      return { cart: this.cart };
    } catch (error) {
      console.error('Remove promo code error:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Update order note
   */
  async updateOrderNote(note) {
    try {
      this.isLoading = true;
      const response = await apiService.put('/cart/note', { note });
      this.cart = response.cart;
      return response;
    } catch (error) {
      console.error('Update order note error:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Get cart item count
   */
  getItemCount() {
    if (!this.cart || !this.cart.items) return 0;
    return this.cart.items.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Get cart total
   */
  getCartTotal() {
    return this.cart ? this.cart.totalAmount : 0;
  }

  /**
   * Update cart badge in header
   */
  updateCartBadge() {
    const cartBadges = document.querySelectorAll('.cart-badge');
    const itemCount = this.getItemCount();
    
    cartBadges.forEach(badge => {
      if (itemCount > 0) {
        badge.textContent = itemCount > 99 ? '99+' : itemCount;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    });

    // Update mobile cart count
    const mobileCartCount = document.querySelector('.mobile-cart-count');
    if (mobileCartCount) {
      mobileCartCount.textContent = itemCount;
      mobileCartCount.style.display = itemCount > 0 ? 'inline' : 'none';
    }
  }

  /**
   * Show cart notification
   */
  showCartNotification(message) {
    // Clear any existing notification to prevent accumulation
    if (this.activeNotification) {
      if (this.notificationTimeout) {
        clearTimeout(this.notificationTimeout);
        this.notificationTimeout = null;
      }
      this.activeNotification.remove();
      this.activeNotification = null;
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    
    const content = document.createElement('div');
    content.className = 'cart-notification__content';
    
    const messageSpan = document.createElement('span');
    messageSpan.className = 'cart-notification__message';
    messageSpan.textContent = message; // Safe: uses textContent instead of innerHTML
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'cart-notification__close';
    closeBtn.setAttribute('aria-label', 'Close notification');
    closeBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;
    
    content.appendChild(messageSpan);
    content.appendChild(closeBtn);
    notification.appendChild(content);

    // Add to page
    document.body.appendChild(notification);
    this.activeNotification = notification;

    // Add close functionality with { once: true } to prevent memory leak
    closeBtn.addEventListener('click', () => {
      if (this.notificationTimeout) {
        clearTimeout(this.notificationTimeout);
        this.notificationTimeout = null;
      }
      notification.remove();
      this.activeNotification = null;
    }, { once: true });

    // Auto-remove after 3 seconds
    this.notificationTimeout = setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
        this.activeNotification = null;
      }
      this.notificationTimeout = null;
    }, 3000);

    // Trigger entrance animation
    requestAnimationFrame(() => {
      notification.classList.add('is-visible');
    });
  }

  /**
   * Check if item exists in cart
   */
  isInCart(productId, selectedColor = null) {
    if (!this.cart || !this.cart.items) return false;
    
    return this.cart.items.some(item => {
      if (selectedColor) {
        return item.productId._id === productId && item.selectedColor === selectedColor;
      }
      return item.productId._id === productId;
    });
  }

  /**
   * Get cart item by product ID and color
   */
  getCartItem(productId, selectedColor = null) {
    if (!this.cart || !this.cart.items) return null;
    
    return this.cart.items.find(item => {
      if (selectedColor) {
        return item.productId._id === productId && item.selectedColor === selectedColor;
      }
      return item.productId._id === productId;
    });
  }
}

// Create singleton instance
export const cartModel = new CartModel();