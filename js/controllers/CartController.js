/**
 * =====================================================
 * CHANDNI JEWELLERY - Cart Controller
 * =====================================================
 */

import { cartModel } from '../models/CartModel.js';
import { productModel } from '../models/ProductModel.js';

export class CartController {
  static MAX_QUANTITY = 10;

  constructor() {
    this.isLoading = false;
    this.pendingConfirmCallback = null;
    this.createConfirmDialog();
  }

  /**
   * Escape HTML to prevent XSS
   * @param {string} str
   * @returns {string}
   */
  escapeHtml(str) {
    if (str == null) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Create accessible confirm dialog
   */
  createConfirmDialog() {
    if (document.getElementById('cartConfirmDialog')) return;

    const dialog = document.createElement('div');
    dialog.id = 'cartConfirmDialog';
    dialog.className = 'cart-confirm-dialog';
    dialog.setAttribute('role', 'alertdialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', 'cartConfirmTitle');
    dialog.setAttribute('aria-describedby', 'cartConfirmMessage');
    dialog.setAttribute('aria-hidden', 'true');
    dialog.innerHTML = `
      <div class="cart-confirm-dialog__overlay"></div>
      <div class="cart-confirm-dialog__content" role="document">
        <h2 id="cartConfirmTitle" class="cart-confirm-dialog__title">Confirm</h2>
        <p id="cartConfirmMessage" class="cart-confirm-dialog__message"></p>
        <div class="cart-confirm-dialog__actions">
          <button type="button" class="btn btn--secondary" data-confirm-cancel>Cancel</button>
          <button type="button" class="btn btn--primary" data-confirm-ok>Confirm</button>
        </div>
      </div>
    `;
    document.body.appendChild(dialog);

    this.addConfirmDialogStyles();

    const cancelBtn = dialog.querySelector('[data-confirm-cancel]');
    const okBtn = dialog.querySelector('[data-confirm-ok]');
    const overlay = dialog.querySelector('.cart-confirm-dialog__overlay');

    cancelBtn.addEventListener('click', () => this.closeConfirmDialog(false));
    okBtn.addEventListener('click', () => this.closeConfirmDialog(true));
    overlay.addEventListener('click', () => this.closeConfirmDialog(false));
    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeConfirmDialog(false);
    });
  }

  /**
   * Add confirm dialog styles
   */
  addConfirmDialogStyles() {
    if (document.getElementById('cartConfirmDialogStyles')) return;
    const styles = document.createElement('style');
    styles.id = 'cartConfirmDialogStyles';
    styles.textContent = `
      .cart-confirm-dialog {
        display: none;
        position: fixed;
        inset: 0;
        z-index: 9999;
      }
      .cart-confirm-dialog.is-open {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .cart-confirm-dialog__overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
      }
      .cart-confirm-dialog__content {
        position: relative;
        background: white;
        padding: 2rem;
        border-radius: 8px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      }
      .cart-confirm-dialog__title {
        margin: 0 0 1rem;
        font-size: 1.25rem;
        font-weight: 600;
      }
      .cart-confirm-dialog__message {
        margin: 0 0 1.5rem;
        color: #666;
      }
      .cart-confirm-dialog__actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
      }
    `;
    document.head.appendChild(styles);
  }

  /**
   * Show accessible confirm dialog
   * @param {string} message
   * @param {string} title
   * @returns {Promise<boolean>}
   */
  showConfirmDialog(message, title = 'Confirm') {
    return new Promise((resolve) => {
      const dialog = document.getElementById('cartConfirmDialog');
      const titleEl = dialog.querySelector('#cartConfirmTitle');
      const messageEl = dialog.querySelector('#cartConfirmMessage');
      const okBtn = dialog.querySelector('[data-confirm-ok]');

      titleEl.textContent = title;
      messageEl.textContent = message;

      dialog.classList.add('is-open');
      dialog.setAttribute('aria-hidden', 'false');

      this.pendingConfirmCallback = resolve;
      okBtn.focus();
    });
  }

  /**
   * Close confirm dialog
   * @param {boolean} confirmed
   */
  closeConfirmDialog(confirmed) {
    const dialog = document.getElementById('cartConfirmDialog');
    dialog.classList.remove('is-open');
    dialog.setAttribute('aria-hidden', 'true');

    if (this.pendingConfirmCallback) {
      this.pendingConfirmCallback(confirmed);
      this.pendingConfirmCallback = null;
    }
  }

  /**
   * Initialize cart controller
   */
  init() {
    this.loadCart();
    this.initEventListeners();
  }

  /**
   * Initialize event listeners
   */
  initEventListeners() {
    // Global event delegation for cart actions
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-update-quantity]')) {
        this.handleQuantityUpdate(e);
      }
      
      if (e.target.matches('[data-remove-item]')) {
        this.handleRemoveItem(e);
      }
      

      if (e.target.matches('[data-remove-promo]')) {
        this.handleRemovePromo(e);
      }
      
      if (e.target.matches('[data-checkout]')) {
        this.handleCheckout(e);
      }

      if (e.target.matches('[data-clear-cart]')) {
        this.handleClearCart(e);
      }
    });

    // Quantity input changes
    document.addEventListener('change', (e) => {
      if (e.target.matches('.quantity-input')) {
        this.handleQuantityChange(e);
      }
    });

    // Promo form submission
    document.addEventListener('submit', (e) => {
      if (e.target.matches('#promoForm')) {
        e.preventDefault();
        this.handlePromoSubmit(e);
      }
    });
  }

  /**
   * Load and render cart
   */
  async loadCart() {
    try {
      this.isLoading = true;
      const container = document.getElementById('cartContent');
      
      if (!container) {
        console.error('Cart container element not found');
        return;
      }

      container.innerHTML = this.getLoadingHTML();

      const response = await cartModel.getCart();
      this.renderCart(response.cart);

    } catch (error) {
      console.error('Load cart error:', error);
      this.renderError('Failed to load cart. Please try again.');
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Render cart content
   */
  renderCart(cart) {
    const container = document.getElementById('cartContent');
    
    if (!container) {
      console.error('Cart container element not found');
      return;
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      container.innerHTML = this.renderEmptyCart();
      return;
    }

    container.innerHTML = `
      <div class="cart-items">
        <div class="cart-items-header">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h2 style="font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; margin: 0;">
              Cart Items (${cart.items.length})
            </h2>
            <button class="btn btn--secondary btn--small" data-clear-cart>
              Clear Cart
            </button>
          </div>
        </div>
        
        <div class="cart-items-list">
          ${cart.items.map(item => this.renderCartItem(item)).join('')}
        </div>
      </div>
      
      <div class="cart-sidebar">
        ${this.renderCartSummary(cart)}
      </div>
    `;
  }

  /**
   * Render single cart item
   */
  renderCartItem(item) {
    const product = item.productId;
    const subtotal = item.quantity * item.price;
    const escapedTitle = this.escapeHtml(product.title);
    const escapedColor = this.escapeHtml(item.selectedColor);
    // Validate image URL - only allow http(s) or relative paths
    const imageUrl = this.sanitizeImageUrl(product.image_url?.[0]) || '/assets/images/placeholder.jpg';

    return `
      <div class="cart-item" data-item-id="${this.escapeHtml(item._id)}">
        <img src="${imageUrl}" 
             alt="${escapedTitle}" 
             class="item-image">
        
        <div class="item-details">
          <h3>${escapedTitle}</h3>
          <p>Price: ${productModel.formatPrice(item.price)}</p>
          ${item.selectedColor ? `<p>Color: ${escapedColor}</p>` : ''}
          <p>Subtotal: ${productModel.formatPrice(subtotal)}</p>
        </div>
        
        <div class="quantity-controls">
          <button class="quantity-btn" data-update-quantity="${this.escapeHtml(item._id)}" data-action="decrease" aria-label="Decrease quantity">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
            </svg>
          </button>
          <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="${CartController.MAX_QUANTITY}" data-item-id="${this.escapeHtml(item._id)}" aria-label="Item quantity">
          <button class="quantity-btn" data-update-quantity="${this.escapeHtml(item._id)}" data-action="increase" aria-label="Increase quantity">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
          </button>
        </div>
        
        <button class="remove-btn" data-remove-item="${this.escapeHtml(item._id)}" aria-label="Remove ${escapedTitle} from cart">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </button>
      </div>
    `;
  }

  /**
   * Sanitize image URL to prevent XSS
   * @param {string} url
   * @returns {string|null}
   */
  sanitizeImageUrl(url) {
    if (!url) return null;
    // Only allow http, https, or relative URLs
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
      return url;
    }
    return null;
  }

  /**
   * Render cart summary
   */
  renderCartSummary(cart) {
    return `
      <div class="cart-summary">
        <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.25rem; margin-bottom: 1.5rem;">
          Order Summary
        </h3>
        
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>${productModel.formatPrice(cart.subtotal)}</span>
        </div>
        
        ${cart.discount ? `
          <div class="summary-row">
            <span>Discount:</span>
            <span style="color: #28a745;">-${productModel.formatPrice(cart.discount.amount)}</span>
          </div>
        ` : ''}
        
        <div class="summary-row">
          <span>Shipping:</span>
          <span>${cart.shipping ? productModel.formatPrice(cart.shipping.cost) : 'Calculated at checkout'}</span>
        </div>
        
        ${cart.tax ? `
          <div class="summary-row">
            <span>Tax:</span>
            <span>${productModel.formatPrice(cart.tax.amount)}</span>
          </div>
        ` : ''}
        
        <div class="summary-row total">
          <span>Total:</span>
          <span>${productModel.formatPrice(cart.totalAmount)}</span>
        </div>
        
        ${this.renderPromoSection(cart)}
        
        <button class="checkout-btn" data-checkout ${cart.items.length === 0 ? 'disabled' : ''}>
          Proceed to Checkout
        </button>
        
        <div style="text-align: center; margin-top: 1rem; font-size: 0.875rem; color: #666;">
          <svg width="16" height="16" fill="currentColor" style="vertical-align: middle; margin-right: 0.5rem;">
            <path d="M8 1a2 2 0 012 2v4h3a2 2 0 012 2v6a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2h3V3a2 2 0 012-2zM6 9H3v6h10V9H6z"/>
          </svg>
          Secure SSL encryption
        </div>
      </div>
    `;
  }

  /**
   * Render promo section
   */
  renderPromoSection(cart) {
    if (cart.appliedPromo) {
      const escapedCode = this.escapeHtml(cart.appliedPromo.code);
      return `
        <div class="promo-section">
          <div class="applied-promo">
            <div>
              <div class="promo-code">${escapedCode}</div>
              <div style="font-size: 0.875rem; color: #28a745;">
                ${cart.appliedPromo.discountType === 'percentage' ? 
                  `${this.escapeHtml(String(cart.appliedPromo.discountValue))}% off` : 
                  `${productModel.formatPrice(cart.appliedPromo.discountValue)} off`}
              </div>
            </div>
            <button class="remove-promo" data-remove-promo>Remove</button>
          </div>
        </div>
      `;
    }

    return `
      <div class="promo-section">
        <h4 style="margin-bottom: 0.75rem; font-weight: 500;">Have a promo code?</h4>
        <form id="promoForm" class="promo-form">
          <input type="text" class="promo-input" name="promoCode" placeholder="Enter code" required>
          <button type="submit" class="promo-btn">Apply</button>
        </form>
      </div>
    `;
  }

  /**
   * Render empty cart
   */
  renderEmptyCart() {
    return `
      <div class="empty-cart">
        <svg class="empty-cart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"/>
        </svg>
        
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any items to your cart yet.</p>
        
        <a href="/pages/collection.html" class="btn btn--primary">
          Start Shopping
        </a>
      </div>
    `;
  }

  /**
   * Handle quantity update via buttons
   */
  async handleQuantityUpdate(event) {
    event.preventDefault();
    
    const button = event.target.closest('[data-update-quantity]');
    const itemId = button.dataset.updateQuantity;
    const action = button.dataset.action;

    const quantityInput = document.querySelector(`.quantity-input[data-item-id="${itemId}"]`);
    let newQuantity = parseInt(quantityInput.value);

    if (action === 'increase') {
      newQuantity = Math.min(CartController.MAX_QUANTITY, newQuantity + 1);
    } else if (action === 'decrease') {
      newQuantity = Math.max(1, newQuantity - 1);
    }

    await this.updateItemQuantity(itemId, newQuantity);
  }

  /**
   * Handle quantity change via input
   */
  async handleQuantityChange(event) {
    const itemId = event.target.dataset.itemId;
    const newQuantity = Math.min(CartController.MAX_QUANTITY, Math.max(1, parseInt(event.target.value) || 1));
    
    await this.updateItemQuantity(itemId, newQuantity);
  }

  /**
   * Update item quantity
   */
  async updateItemQuantity(itemId, quantity) {
    try {
      await cartModel.updateCartItem(itemId, quantity);
      
      // Update quantity input
      const quantityInput = document.querySelector(`.quantity-input[data-item-id="${itemId}"]`);
      if (quantityInput) {
        quantityInput.value = quantity;
      }

      // Reload cart to update totals
      this.loadCart();

    } catch (error) {
      console.error('Update quantity error:', error);
      this.showNotification('Failed to update quantity', 'error');
    }
  }

  /**
   * Handle remove item
   */
  async handleRemoveItem(event) {
    event.preventDefault();
    
    const confirmed = await this.showConfirmDialog(
      'Are you sure you want to remove this item from your cart?',
      'Remove Item'
    );
    if (!confirmed) return;

    const itemId = event.target.closest('[data-remove-item]').dataset.removeItem;

    try {
      await cartModel.removeFromCart(itemId);
      this.loadCart(); // Reload cart
    } catch (error) {
      console.error('Remove item error:', error);
      this.showNotification('Failed to remove item', 'error');
    }
  }

  /**
   * Handle promo form submission
   */
  async handlePromoSubmit(event) {
    const formData = new FormData(event.target);
    const promoCode = formData.get('promoCode').trim();

    if (!promoCode) return;

    try {
      await cartModel.applyPromoCode(promoCode);
      this.loadCart(); // Reload to show applied promo
    } catch (error) {
      console.error('Apply promo error:', error);
      this.showNotification(error.message || 'Invalid promo code', 'error');
    }
  }

  /**
   * Handle remove promo
   */
  async handleRemovePromo(event) {
    event.preventDefault();

    try {
      await cartModel.removePromoCode();
      this.loadCart(); // Reload cart
    } catch (error) {
      console.error('Remove promo error:', error);
      this.showNotification('Failed to remove promo code', 'error');
    }
  }

  /**
   * Handle checkout
   */
  handleCheckout(event) {
    event.preventDefault();
    
    // Redirect to checkout page
    window.location.href = '/pages/checkout.html';
  }

  /**
   * Handle clear cart
   */
  async handleClearCart(event) {
    event.preventDefault();
    
    const confirmed = await this.showConfirmDialog(
      'Are you sure you want to clear your entire cart?',
      'Clear Cart'
    );
    if (!confirmed) return;

    try {
      await cartModel.clearCart();
      this.loadCart(); // Reload cart
    } catch (error) {
      console.error('Clear cart error:', error);
      this.showNotification('Failed to clear cart', 'error');
    }
  }

  /**
   * Get loading HTML
   */
  getLoadingHTML() {
    return `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading your cart...</p>
      </div>
    `;
  }

  /**
   * Render error state
   */
  renderError(message) {
    const container = document.getElementById('cartContent');
    if (!container) {
      console.error('Cart container element not found');
      return;
    }

    const escapedMessage = this.escapeHtml(message);
    container.innerHTML = `
      <div class="error-container">
        <h2>Error Loading Cart</h2>
        <p class="error-message">${escapedMessage}</p>
        <button class="btn btn--primary js-cart-retry-button">
          Try Again
        </button>
      </div>
    `;

    const retryButton = container.querySelector('.js-cart-retry-button');
    if (retryButton) {
      retryButton.addEventListener('click', () => {
        window.location.reload();
      });
    }
  }
  /**
   * Show notification
   * @param {string} message - Message to display (will be safely escaped)
   * @param {string} type - Notification type
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    
    const content = document.createElement('div');
    content.className = 'notification__content';
    
    const messageSpan = document.createElement('span');
    messageSpan.className = 'notification__message';
    messageSpan.textContent = message; // Safe: uses textContent to prevent XSS
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification__close';
    closeBtn.setAttribute('aria-label', 'Close notification');
    closeBtn.textContent = '×';
    
    content.appendChild(messageSpan);
    content.appendChild(closeBtn);
    notification.appendChild(content);

    document.body.appendChild(notification);

    closeBtn.addEventListener('click', () => notification.remove());

    setTimeout(() => {
      if (notification.parentNode) notification.remove();
    }, 4000);

    requestAnimationFrame(() => {
      notification.classList.add('is-visible');
    });
  }
}

// Export for use in cart.html
window.CartController = CartController;