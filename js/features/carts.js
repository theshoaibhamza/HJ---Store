/**
 * =====================================================
 * CHANDNI JEWELLERY - Cart Feature
 * =====================================================
 */

import { Utils } from '../core/utils.js';
import { Config } from '../core/config.js';

export class Cart {
  /**
   * Create cart instance
   * @param {Object} options - Cart options
   */
  constructor(options = {}) {
    this.options = {
      toggleSelector: '[data-cart-toggle]',
      drawerSelector: '#cartDrawer',
      countSelector: '[data-cart-count]',
      drawerCountSelector: '[data-cart-drawer-count]',
      bodySelector: '[data-cart-drawer-body]',
      footerSelector: '[data-cart-drawer-footer]',
      emptySelector: '[data-cart-empty]',
      itemsSelector: '[data-cart-items]',
      subtotalSelector: '[data-cart-subtotal]',
      quickAddSelector: '[data-quick-add]',
      closeSelector: '[data-drawer-close]',
      storageKey: Config.storageKeys.cart,
      currency: Config.currency,
      maxQuantity: Config.cart.maxQuantity,
      onAdd: null,
      onRemove: null,
      onUpdate: null,
      ...options
    };

    this.drawer = document.querySelector(this.options.drawerSelector);
    this.items = [];
    this.isOpen = false;

    this.init();
  }

  /**
   * Initialize cart
   */
  init() {
    this.loadCart();
    this.bindEvents();
    this.updateUI();
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Cart toggle buttons
    const toggleBtns = document.querySelectorAll(this.options.toggleSelector);
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openDrawer();
      });
    });

    // Close buttons
    if (this.drawer) {
      const closeBtns = this.drawer.querySelectorAll(this.options.closeSelector);
      closeBtns.forEach(btn => {
        btn.addEventListener('click', () => this.closeDrawer());
      });

      // Overlay close
      const overlay = this.drawer.querySelector('.drawer__overlay');
      if (overlay) {
        overlay.addEventListener('click', () => this.closeDrawer());
      }
    }

    // Escape key close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeDrawer();
      }
    });

    // Quick add buttons
    document.addEventListener('click', (e) => {
      const quickAddBtn = e.target.closest(this.options.quickAddSelector);
      if (quickAddBtn) {
        e.preventDefault();
        const productHandle = quickAddBtn.dataset.quickAdd;
        this.handleQuickAdd(productHandle, quickAddBtn);
      }
    });

    // Listen for add to cart events from product pages
    document.addEventListener('cart:add', (e) => {
      this.addItem(e.detail);
    });
  }

  /**
   * Load cart from storage
   */
  loadCart() {
    const savedCart = Utils.storage.get(this.options.storageKey);
    if (savedCart && Array.isArray(savedCart)) {
      this.items = savedCart;
    }
  }

  /**
   * Save cart to storage
   */
  saveCart() {
    Utils.storage.set(this.options.storageKey, this.items);
  }

  /**
   * Handle quick add button click
   * @param {string} productHandle - Product handle
   * @param {Element} button - Button element
   */
  handleQuickAdd(productHandle, button) {
    // Add loading state
    button.classList.add('is-loading');
    button.disabled = true;

    // Simulate fetching product data (in real app, fetch from API)
    setTimeout(() => {
      // Mock product data based on handle
      const mockProduct = this.getMockProduct(productHandle);
      
      if (mockProduct) {
        this.addItem(mockProduct);
        this.showToast('Added to cart', `${mockProduct.title} has been added to your cart.`, 'success');
      }

      // Remove loading state
      button.classList.remove('is-loading');
      button.disabled = false;
    }, 500);
  }

  /**
   * Get mock product data (replace with actual API call)
   * @param {string} handle - Product handle
   * @returns {Object}
   */
  getMockProduct(handle) {
    // Mock product database
    const products = {
      'zeeba-tikka-set-with-sahara': {
        id: 'zeeba-tikka-1',
        handle: 'zeeba-tikka-set-with-sahara',
        title:  'Zeeba Tikka Set with Sahara',
        price: 8300,
        image: 'https://chandnijewellery.com.au/cdn/shop/files/ZeebaMehndi.jpg?width=200',
        variant: 'Mehndi Green'
      },
      'parmi-tikka-set-with-sahara': {
        id: 'parmi-tikka-1',
        handle: 'parmi-tikka-set-with-sahara',
        title: 'Parmi Tikka Set with Sahara',
        price:  7400,
        image:  'https://chandnijewellery.com.au/cdn/shop/files/Parmi_Blue.jpg?width=200',
        variant: 'Blue'
      },
      'pooja-earring-and-tikka-set': {
        id: 'pooja-tikka-1',
        handle: 'pooja-earring-and-tikka-set',
        title: 'Pooja Earring and Tikka Set',
        price:  14400,
        image: 'https://chandnijewellery.com.au/cdn/shop/files/Pooja-HotPink.jpg?width=200',
        variant: 'Hot Pink'
      },
      'andal-earring-and-tikka-sets': {
        id: 'andal-tikka-1',
        handle:  'andal-earring-and-tikka-sets',
        title: 'Andal Earring and Tikka Sets',
        price: 6700,
        image:  'https://chandnijewellery.com.au/cdn/shop/files/AndalBabyPink.jpg?width=200',
        variant: 'Baby Pink'
      },
      'naisha-bangles':  {
        id:  'naisha-bangles-1',
        handle: 'naisha-bangles',
        title:  'Naisha Bangles',
        price: 6700,
        image:  'https://chandnijewellery.com.au/cdn/shop/files/NaishaPink.jpg?width=200',
        variant: 'Pink - Size 2. 6'
      },
      'haimi-bangles': {
        id: 'haimi-bangles-1',
        handle: 'haimi-bangles',
        title:  'Haimi Bangles',
        price: 5800,
        image:  'https://chandnijewellery.com.au/cdn/shop/files/HaimiGray.jpg?width=200',
        variant: 'Gray - Size 2.6'
      },
      'keerthi-necklace': {
        id: 'keerthi-necklace-1',
        handle: 'keerthi-necklace',
        title: 'Keerthi Necklace',
        price: 6700,
        image:  'https://chandnijewellery.com.au/cdn/shop/files/Keerthi_Necklace.jpg?width=200',
        variant: 'Gold'
      },
      'nabah-necklace-set-luxury-range': {
        id: 'nabah-necklace-1',
        handle:  'nabah-necklace-set-luxury-range',
        title: 'Nabah Necklace Set - Luxury Range',
        price: 20100,
        image:  'https://chandnijewellery.com.au/cdn/shop/files/Nabah_White_Necklace_Set.jpg?width=200',
        variant: 'White'
      },
      'maira-necklace-set': {
        id: 'maira-necklace-1',
        handle: 'maira-necklace-set',
        title: 'Maira Necklace Set',
        price: 18500,
        image: 'https://chandnijewellery.com.au/cdn/shop/files/MairaNecklaceSet1.jpg?width=200',
        variant: 'Ruby'
      },
      'ayesha-necklace-set': {
        id: 'ayesha-necklace-1',
        handle: 'ayesha-necklace-set',
        title: 'Ayesha Necklace Set',
        price: 15200,
        image: 'https://chandnijewellery.com.au/cdn/shop/files/AyeshaNecklaceSet1.jpg?width=200',
        variant: 'Mint'
      },
      'vinaya-necklace-set': {
        id: 'vinaya-necklace-1',
        handle: 'vinaya-necklace-set',
        title: 'Vinaya Necklace Set',
        price: 12500,
        image: 'https://chandnijewellery.com.au/cdn/shop/files/Vinaya_Necklace_Set.jpg?width=200',
        variant: 'Silver'
      },
      'sunaina-necklace-set': {
        id: 'sunaina-necklace-1',
        handle: 'sunaina-necklace-set',
        title: 'Sunaina Necklace Set',
        price: 32100,
        image: 'https://chandnijewellery.com.au/cdn/shop/files/Sunaina_Necklace_Set.jpg?width=200',
        variant: 'Gold'
      },
      'giva-necklace-set': {
        id: 'giva-necklace-1',
        handle: 'giva-necklace-set',
        title: 'Giva Necklace Set',
        price: 21000,
        image: 'https://chandnijewellery.com.au/cdn/shop/files/Giva_Necklace_Set.jpg?width=200',
        variant: 'Gold'
      },
      'usha-necklace-set': {
        id: 'usha-necklace-1',
        handle: 'usha-necklace-set',
        title: 'Usha Necklace Set',
        price: 6900,
        image: 'https://chandnijewellery.com.au/cdn/shop/files/Usha_Necklace_Set.jpg?width=200',
        variant: 'Gold'
      },
      'radhika-waistband': {
        id: 'radhika-waistband-1',
        handle: 'radhika-waistband',
        title: 'Radhika Waistband',
        price: 9600,
        image: 'https://chandnijewellery.com.au/cdn/shop/files/Radhika_Waistband.jpg?width=200',
        variant: 'Gold'
      },
      'sarojini-waistband': {
        id: 'sarojini-waistband-1',
        handle: 'sarojini-waistband',
        title: 'Sarojini Waistband',
        price: 8100,
        image: 'https://chandnijewellery.com.au/cdn/shop/files/Sarojini_Waistband.jpg?width=200',
        variant: 'Gold'
      },
      'nargis-waistband': {
        id: 'nargis-waistband-1',
        handle: 'nargis-waistband',
        title: 'Nargis Waistband',
        price: 13400,
        image: 'https://chandnijewellery.com.au/cdn/shop/files/Nargis_Waistband.jpg?width=200',
        variant: 'Gold'
      },
      'laghima-waistband': {
        id: 'laghima-waistband-1',
        handle: 'laghima-waistband',
        title: 'Laghima Waistband',
        price: 23900,
        image: 'https://chandnijewellery.com.au/cdn/shop/files/Laghima_Waistband.jpg?width=200',
        variant: 'Gold'
      }
    };

    return products[handle] || null;
  }

  /**
   * Add item to cart
   * @param {Object} product - Product data
   */
  addItem(product) {
    const existingItem = this.items.find(item => item.id === product.id);

    if (existingItem) {
      // Increase quantity if item exists
      if (existingItem.quantity < this.options.maxQuantity) {
        existingItem.quantity += 1;
      }
    } else {
      // Add new item
      this.items.push({
        ...product,
        quantity: 1
      });
    }

    this.saveCart();
    this.updateUI();
    this.openDrawer();

    // Callback
    if (typeof this.options.onAdd === 'function') {
      this.options.onAdd(product, this);
    }

    // Dispatch event
    document.dispatchEvent(new CustomEvent('cart:updated', { 
      detail: { cart: this.items, action: 'add', item: product } 
    }));
  }

  /**
   * Remove item from cart
   * @param {string} itemId - Item ID
   */
  removeItem(itemId) {
    const itemIndex = this.items.findIndex(item => item.id === itemId);
    
    if (itemIndex > -1) {
      const removedItem = this.items[itemIndex];
      this.items.splice(itemIndex, 1);
      
      this.saveCart();
      this.updateUI();

      // Callback
      if (typeof this.options.onRemove === 'function') {
        this.options.onRemove(removedItem, this);
      }

      // Dispatch event
      document.dispatchEvent(new CustomEvent('cart:updated', { 
        detail: { cart: this.items, action: 'remove', item: removedItem } 
      }));
    }
  }

  /**
   * Update item quantity
   * @param {string} itemId - Item ID
   * @param {number} quantity - New quantity
   */
  updateQuantity(itemId, quantity) {
    const item = this.items.find(item => item.id === itemId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeItem(itemId);
      } else {
        item.quantity = Math.min(quantity, Config.cart.maxQuantity);
        this.saveCart();
        this.updateUI();

        // Callback
        if (typeof this.options.onUpdate === 'function') {
          this.options.onUpdate(item, this);
        }

        // Dispatch event
        document.dispatchEvent(new CustomEvent('cart:updated', { 
          detail: { cart:  this.items, action: 'update', item } 
        }));
      }
    }
  }

  /**
   * Get cart subtotal
   * @returns {number}
   */
  getSubtotal() {
    return this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  /**
   * Get total item count
   * @returns {number}
   */
  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  /**
   * Check if cart is empty
   * @returns {boolean}
   */
  isEmpty() {
    return this.items.length === 0;
  }

  /**
   * Clear cart
   */
  clearCart() {
    this.items = [];
    this.saveCart();
    this.updateUI();

    document.dispatchEvent(new CustomEvent('cart:updated', { 
      detail: { cart: this.items, action: 'clear' } 
    }));
  }

  /**
   * Update all UI elements
   */
  updateUI() {
    this.updateCartCount();
    this.updateDrawerContent();
  }

  /**
   * Update cart count badges
   */
  updateCartCount() {
    const count = this.getItemCount();
    
    // Update header count
    const countElements = document.querySelectorAll(this.options.countSelector);
    countElements.forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? '' : 'none';
    });

    // Update drawer count
    const drawerCount = document.querySelector(this.options.drawerCountSelector);
    if (drawerCount) {
      drawerCount.textContent = `(${count})`;
    }
  }

  /**
   * Update drawer content
   */
  updateDrawerContent() {
    if (!this.drawer) return;

    const body = this.drawer.querySelector(this.options.bodySelector);
    const footer = this.drawer.querySelector(this.options.footerSelector);
    const emptyState = this.drawer.querySelector(this.options.emptySelector);
    const itemsContainer = this.drawer.querySelector(this.options.itemsSelector);
    const subtotalEl = this.drawer.querySelector(this.options.subtotalSelector);

    if (this.isEmpty()) {
      // Show empty state
      if (emptyState) emptyState.hidden = false;
      if (itemsContainer) itemsContainer.hidden = true;
      if (footer) footer.hidden = true;
    } else {
      // Show cart items
      if (emptyState) emptyState.hidden = true;
      if (itemsContainer) {
        itemsContainer.hidden = false;
        itemsContainer.innerHTML = this.renderCartItems();
        this.bindCartItemEvents(itemsContainer);
      }
      if (footer) footer.hidden = false;
      if (subtotalEl) {
        subtotalEl.textContent = this.formatPrice(this.getSubtotal());
      }
    }
  }

  /**
   * Escape HTML to prevent XSS
   * @param {string} str - String to escape
   * @returns {string}
   */
  escapeHtml(str) {
    if (str == null) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Sanitize image URL to prevent XSS
   * @param {string} url
   * @returns {string}
   */
  sanitizeImageUrl(url) {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
      return url;
    }
    return '';
  }

  /**
   * Render cart items HTML
   * @returns {string}
   */
  renderCartItems() {
    return this.items.map(item => {
      const escapedId = this.escapeHtml(item.id);
      const escapedTitle = this.escapeHtml(item.title);
      const escapedVariant = this.escapeHtml(item.variant);
      const sanitizedImage = this.sanitizeImageUrl(item.image);
      
      return `
      <div class="cart-item" data-cart-item="${escapedId}">
        <div class="cart-item__image">
          <img src="${sanitizedImage}" alt="${escapedTitle}" width="80" height="80" loading="lazy">
        </div>
        <div class="cart-item__details">
          <h4 class="cart-item__title">${escapedTitle}</h4>
          ${item.variant ? `<p class="cart-item__variant">${escapedVariant}</p>` : ''}
          <p class="cart-item__price">${this.formatPrice(item.price)}</p>
          <div class="cart-item__quantity">
            <button type="button" class="cart-item__qty-btn" data-action="decrease" data-id="${escapedId}" aria-label="Decrease quantity">
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 6h8" stroke="currentColor" stroke-width="2"/></svg>
            </button>
            <span class="cart-item__qty-value">${item.quantity}</span>
            <button type="button" class="cart-item__qty-btn" data-action="increase" data-id="${escapedId}" aria-label="Increase quantity">
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 2v8M2 6h8" stroke="currentColor" stroke-width="2"/></svg>
            </button>
          </div>
        </div>
        <button type="button" class="cart-item__remove" data-action="remove" data-id="${escapedId}" aria-label="Remove ${escapedTitle}">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" stroke-width="2"/></svg>
        </button>
      </div>
    `;
    }).join('');
  }

  /**
   * Bind events to cart items
   * @param {Element} container - Items container
   */
  bindCartItemEvents(container) {
    // Quantity buttons
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;

      const action = btn.dataset.action;
      const itemId = btn.dataset.id;
      const item = this.items.find(i => i.id === itemId);

      if (!item) return;

      switch (action) {
        case 'increase':
          this.updateQuantity(itemId, item.quantity + 1);
          break;
        case 'decrease': 
          this.updateQuantity(itemId, item.quantity - 1);
          break;
        case 'remove': 
          this.removeItem(itemId);
          break;
      }
    });
  }

  /**
   * Format price
   * @param {number} amount - Amount to format
   * @returns {string}
   */
  formatPrice(amount) {
    return Utils.formatCurrency(amount, this.options.currency.code, this.options.currency.locale);
  }

  /**
   * Open cart drawer
   */
  openDrawer() {
    if (!this.drawer || this.isOpen) return;

    this.drawer.setAttribute('aria-hidden', 'false');
    this.isOpen = true;
    document.body.style.overflow = 'hidden';

    // Focus trap
    this.focusTrap = Utils.trapFocus(this.drawer);
  }

  /**
   * Close cart drawer
   */
  closeDrawer() {
    if (!this.drawer || !this.isOpen) return;

    this.drawer.setAttribute('aria-hidden', 'true');
    this.isOpen = false;
    document.body.style.overflow = '';

    // Release focus trap
    if (this.focusTrap) {
      this.focusTrap();
      this.focusTrap = null;
    }
  }

  /**
   * Show toast notification
   * @param {string} title - Toast title
   * @param {string} message - Toast message
   * @param {string} type - Toast type (success, error, warning)
   */
  showToast(title, message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const escapedTitle = this.escapeHtml(title);
    const escapedMessage = this.escapeHtml(message);

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <div class="toast__icon">
        ${type === 'success' ? 
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M8 12l3 3 5-6" stroke="currentColor" stroke-width="2"/></svg>' : 
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2"/></svg>'
        }
      </div>
      <div class="toast__content">
        <p class="toast__title">${escapedTitle}</p>
        <p class="toast__message">${escapedMessage}</p>
      </div>
      <button type="button" class="toast__close" aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" stroke-width="2"/></svg>
      </button>
    `;

    container.appendChild(toast);

    // Close button
    toast.querySelector('.toast__close').addEventListener('click', () => {
      toast.remove();
    });

    // Auto remove
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, Config.toast.duration);
  }

  /**
   * Get cart data
   * @returns {Object}
   */
  getCartData() {
    return {
      items: this.items,
      itemCount: this.getItemCount(),
      subtotal: this.getSubtotal()
    };
  }
}

// Export default
export default Cart;