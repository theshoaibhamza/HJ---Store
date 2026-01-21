/**
 * =====================================================
 * CHANDNI JEWELLERY - Product Controller
 * =====================================================
 */

import { productModel } from '../models/ProductModel.js';
import { cartModel } from '../models/CartModel.js';

/**
 * SVG Icon Templates - extracted for reuse and maintainability
 */
const SVG_ICONS = {
  quickView: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 3C4.5 3 1.73 5.61 1 8c.73 2.39 3.5 5 7 5s6.27-2.61 7-5c-.73-2.39-3.5-5-7-5z" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.5"/>
  </svg>`,
  starFull: `<svg class="star star--full" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 12.25l-4.7 2.47 0.9-5.23L.4 5.82l5.26-0.76L8 0l2.34 5.06 5.26 0.76-3.8 3.67 0.9 5.23L8 12.25z"/>
  </svg>`,
  starHalf: `<svg class="star star--half" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 12.25l-4.7 2.47 0.9-5.23L.4 5.82l5.26-0.76L8 0v12.25z"/>
  </svg>`,
  starEmpty: `<svg class="star star--empty" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true">
    <path d="M8 12.25l-4.7 2.47 0.9-5.23L.4 5.82l5.26-0.76L8 0l2.34 5.06 5.26 0.76-3.8 3.67 0.9 5.23L8 12.25z"/>
  </svg>`,
  minus: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
  </svg>`,
  plus: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
  </svg>`
};

export class ProductController {
  constructor() {
    this.currentFilters = {};
    this.currentSort = 'featured';
    this.currentPage = 1;
    this.productsPerPage = 12;
    this.currentProductId = null;
    this.initEventListeners();
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
   * Validate and sanitize color values to prevent CSS injection
   * Only allows safe color formats: named colors, hex, rgb, hsl
   * @param {string} color
   * @returns {string}
   */
  sanitizeColor(color) {
    if (!color) return 'transparent';
    
    const colorLower = color.toLowerCase().trim();
    
    // Whitelist of common named colors
    const namedColors = [
      'black', 'white', 'red', 'green', 'blue', 'yellow', 'orange', 'purple',
      'pink', 'brown', 'gray', 'grey', 'gold', 'silver', 'bronze', 'navy',
      'teal', 'maroon', 'olive', 'aqua', 'fuchsia', 'lime', 'coral', 'salmon',
      'turquoise', 'violet', 'indigo', 'beige', 'ivory', 'khaki', 'lavender',
      'magenta', 'cyan', 'crimson', 'chocolate', 'tomato', 'tan', 'plum',
      'orchid', 'peru', 'sienna', 'wheat', 'transparent'
    ];
    
    if (namedColors.includes(colorLower)) {
      return colorLower;
    }
    
    // Allow hex colors (3, 4, 6, or 8 digits)
    if (/^#[0-9a-f]{3,8}$/i.test(color)) {
      return color;
    }
    
    // Allow rgb/rgba
    if (/^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*[\d.]+)?\s*\)$/i.test(color)) {
      return color;
    }
    
    // Allow hsl/hsla
    if (/^hsla?\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*(,\s*[\d.]+)?\s*\)$/i.test(color)) {
      return color;
    }
    
    // Default fallback for invalid colors
    return 'gray';
  }

  /**
   * Initialize event listeners
   */
  initEventListeners() {
    // Product filters
    const filterForm = document.getElementById('productFilters');
    if (filterForm) {
      filterForm.addEventListener('change', () => this.handleFiltersChange());
    }

    // Sort dropdown
    const sortSelect = document.getElementById('productSort');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => this.handleSortChange(e));
    }

    // Search form
    const searchForm = document.getElementById('productSearch');
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => this.handleSearch(e));
    }

    // Product review form
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
      reviewForm.addEventListener('submit', (e) => this.handleReviewSubmit(e));
    }

    // Global event delegation for dynamic elements
    document.addEventListener('click', (e) => {
      // Add to cart buttons
      if (e.target.matches('[data-add-to-cart]') || e.target.closest('[data-add-to-cart]')) {
        this.handleAddToCart(e);
      }

      // Quick view buttons
      if (e.target.matches('[data-quick-view]') || e.target.closest('[data-quick-view]')) {
        this.handleQuickView(e);
      }

      // Pagination
      if (e.target.matches('[data-page]')) {
        this.handlePagination(e);
      }

      // Thumbnail image switch
      if (e.target.matches('[data-switch-image]') || e.target.closest('[data-switch-image]')) {
        this.handleSwitchImage(e);
      }

      // Quantity decrease
      if (e.target.matches('[data-quantity-decrease]') || e.target.closest('[data-quantity-decrease]')) {
        this.handleQuantityDecrease(e);
      }

      // Quantity increase
      if (e.target.matches('[data-quantity-increase]') || e.target.closest('[data-quantity-increase]')) {
        this.handleQuantityIncrease(e);
      }

      // Add to cart from product details
      if (e.target.matches('[data-add-to-cart-details]') || e.target.closest('[data-add-to-cart-details]')) {
        this.handleAddToCartFromDetails(e);
      }

      // Error retry button
      if (e.target.matches('.js-error-retry')) {
        location.reload();
      }
    });
  }

  /**
   * Handle image switch in product gallery
   */
  handleSwitchImage(event) {
    event.preventDefault();
    const button = event.target.closest('[data-switch-image]');
    if (!button) return;

    const rawImageUrl = button.dataset.switchImage;
    const imageUrl = this.sanitizeImageUrl(rawImageUrl);
    const index = parseInt(button.dataset.imageIndex);
    
    const mainImage = document.getElementById('mainProductImage');
    if (mainImage && imageUrl) {
      mainImage.src = imageUrl;
    }

    // Update active thumbnail
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });
  }

  /**
   * Handle quantity decrease
   */
  handleQuantityDecrease(event) {
    event.preventDefault();
    const input = document.getElementById('quantity');
    if (input) {
      const currentValue = parseInt(input.value) || 1;
      input.value = Math.max(1, currentValue - 1);
    }
  }

  /**
   * Handle quantity increase
   */
  handleQuantityIncrease(event) {
    event.preventDefault();
    const input = document.getElementById('quantity');
    if (input) {
      const currentValue = parseInt(input.value) || 1;
      const maxValue = parseInt(input.max) || 99;
      input.value = Math.min(maxValue, currentValue + 1);
    }
  }

  /**
   * Handle add to cart from product details page
   */
  async handleAddToCartFromDetails(event) {
    event.preventDefault();
    const button = event.target.closest('[data-add-to-cart-details]');
    if (!button) return;

    const productId = button.dataset.productId;
    const quantityInput = document.getElementById('quantity');
    const quantity = parseInt(quantityInput?.value || '1');
    
    // Get selected color if available
    const colorInput = document.querySelector('input[name="selectedColor"]:checked');
    const selectedColor = colorInput?.value || null;

    if (!productId) return;

    try {
      button.disabled = true;
      button.textContent = 'Adding...';

      const itemData = {
        productId,
        quantity,
        ...(selectedColor && { selectedColor })
      };

      await cartModel.addToCart(itemData);

      button.textContent = 'Added!';
      setTimeout(() => {
        button.disabled = false;
        button.textContent = 'Add to Cart';
      }, 2000);

    } catch (error) {
      console.error('Add to cart error:', error);
      button.disabled = false;
      button.textContent = 'Add to Cart';
      this.showNotification(error.message || 'Failed to add to cart', 'error');
    }
  }

  /**
   * Load products for home page
   */
  async loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featuredProducts');
    if (!featuredContainer) return;

    try {
      this.showLoading(featuredContainer);
      
      const response = await productModel.getFeaturedProducts();
      this.renderProducts(response.products, featuredContainer, true);

    } catch (error) {
      console.error('Load featured products error:', error);
      this.showError(featuredContainer, 'Failed to load featured products');
    }
  }

  /**
   * Load products for collection page
   */
  async loadProducts(filters = {}) {
    const productsContainer = document.getElementById('productsGrid');
    if (!productsContainer) return;

    try {
      this.showLoading(productsContainer);

      const queryParams = {
        page: this.currentPage,
        limit: this.productsPerPage,
        sort: this.currentSort,
        ...this.currentFilters,
        ...filters
      };

      const response = await productModel.getProducts(queryParams);
      
      this.renderProducts(response.products, productsContainer);
      this.renderPagination(response.pagination);

    } catch (error) {
      console.error('Load products error:', error);
      this.showError(productsContainer, 'Failed to load products');
    }
  }

  /**
   * Load single product
   */
  async loadProduct(productId) {
    const productContainer = document.getElementById('productDetails');
    if (!productContainer) return;

    try {
      this.showLoading(productContainer);
      this.currentProductId = productId;

      const response = await productModel.getProduct(productId);
      this.renderProductDetails(response.product);

    } catch (error) {
      console.error('Load product error:', error);
      this.showError(productContainer, 'Failed to load product');
    }
  }

  /**
   * Handle filters change
   */
  handleFiltersChange() {
    const filterForm = document.getElementById('productFilters');
    if (!filterForm) return;

    const formData = new FormData(filterForm);
    this.currentFilters = {};

    // Category filter
    const categories = formData.getAll('category');
    if (categories.length > 0) {
      this.currentFilters.category = categories;
    }

    // Price range filter
    const minPrice = formData.get('minPrice');
    const maxPrice = formData.get('maxPrice');
    if (minPrice) this.currentFilters.minPrice = minPrice;
    if (maxPrice) this.currentFilters.maxPrice = maxPrice;

    // Rating filter
    const minRating = formData.get('rating');
    if (minRating) this.currentFilters.rating = minRating;

    // Color filter
    const colors = formData.getAll('color');
    if (colors.length > 0) {
      this.currentFilters.colors = colors;
    }

    // Reset to first page and reload
    this.currentPage = 1;
    this.loadProducts();
  }

  /**
   * Handle sort change
   */
  handleSortChange(event) {
    this.currentSort = event.target.value;
    this.currentPage = 1;
    this.loadProducts();
  }

  /**
   * Handle search
   */
  async handleSearch(event) {
    event.preventDefault();
    
    const searchInput = event.target.querySelector('input[name="search"]');
    const query = searchInput.value.trim();

    if (!query) return;

    const productsContainer = document.getElementById('productsGrid');
    if (!productsContainer) return;

    try {
      this.showLoading(productsContainer);

      const response = await productModel.searchProducts(query, this.currentFilters);
      this.renderProducts(response.products, productsContainer);
      this.renderPagination(response.pagination);

      // Update search results heading
      const resultsHeading = document.getElementById('searchResultsHeading');
      if (resultsHeading) {
        // Validate that total is a number to prevent injection
        const totalCount = typeof response.total === 'number' && Number.isFinite(response.total)
          ? Math.floor(response.total)
          : 0;
        resultsHeading.textContent = `Search results for "${query}" (${totalCount} found)`;
      }

    } catch (error) {
      console.error('Search error:', error);
      this.showError(productsContainer, 'Search failed. Please try again.');
    }
  }

  /**
   * Handle add to cart
   */
  async handleAddToCart(event) {
    event.preventDefault();
    console.log('🛒 handleAddToCart triggered');
    
    const button = event.target.closest('[data-add-to-cart]') || event.target;
    const productId = button.dataset.productId;
    const selectedColor = button.dataset.selectedColor || null;
    const quantity = parseInt(button.dataset.quantity || '1');

    console.log('Product ID:', productId, 'Color:', selectedColor, 'Quantity:', quantity);

    if (!productId) {
      console.error('No product ID found');
      return;
    }

    try {
      button.disabled = true;
      button.textContent = 'Adding...';

      const itemData = {
        productId,
        quantity,
        ...(selectedColor && { selectedColor })
      };

      console.log('Calling cartModel.addToCart with:', itemData);
      await cartModel.addToCart(itemData);

      // Update button state
      button.textContent = 'Added!';
      setTimeout(() => {
        button.disabled = false;
        button.textContent = 'Add to Cart';
      }, 2000);

    } catch (error) {
      console.error('Add to cart error:', error);
      button.disabled = false;
      button.textContent = 'Add to Cart';
      
      // Show error notification
      this.showNotification(error.message || 'Failed to add to cart', 'error');
    }
  }

  /**
   * Handle quick view
   */
  async handleQuickView(event) {
    event.preventDefault();
    
    const button = event.target.closest('[data-quick-view]') || event.target;
    const productId = button.dataset.productId;
    if (!productId) return;

    try {
      const response = await productModel.getProduct(productId);
      this.showQuickViewModal(response.product);

    } catch (error) {
      console.error('Quick view error:', error);
      this.showNotification('Failed to load product details', 'error');
    }
  }

  /**
   * Handle review submission
   */
  async handleReviewSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');

    try {
      submitButton.disabled = true;
      submitButton.textContent = 'Submitting...';

      const reviewData = {
        rating: parseInt(formData.get('rating')),
        comment: formData.get('comment')
      };

      const productId = form.dataset.productId;
      await productModel.addReview(productId, reviewData);

      form.reset();
      this.showNotification('Review submitted successfully!', 'success');
      
      // Reload product to show new review
      await this.loadProduct(productId);

    } catch (error) {
      console.error('Review submission error:', error);
      this.showNotification(error.message || 'Failed to submit review', 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Submit Review';
    }
  }

  /**
   * Handle pagination
   */
  handlePagination(event) {
    event.preventDefault();
    
    const page = parseInt(event.target.dataset.page);
    if (page && page !== this.currentPage) {
      this.currentPage = page;
      this.loadProducts();
      
      // Scroll to top of products grid
      const productsContainer = document.getElementById('productsGrid');
      if (productsContainer) {
        productsContainer.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  /**
   * Render products grid
   */
  renderProducts(products, container, isFeatured = false) {
    if (!container) return;

    if (!products || products.length === 0) {
      container.innerHTML = `
        <div class="no-products">
          <p>No products found.</p>
        </div>
      `;
      return;
    }

    const productsHTML = products.map(product => this.renderProductCard(product, isFeatured)).join('');
    container.innerHTML = productsHTML;
  }

  /**
   * Render single product card
   */
  renderProductCard(product, isFeatured = false) {
    const availability = productModel.getAvailabilityStatus(product);
    const isOutOfStock = availability === 'Out of Stock';
    const escapedTitle = this.escapeHtml(product.title);
    const escapedId = this.escapeHtml(product._id);
    
    // Sanitize image URL
    const rawImageUrl = Array.isArray(product.image_url)
      ? product.image_url[0]
      : product.image_url;
    const imageSrc = this.sanitizeImageUrl(rawImageUrl) || '/assets/images/placeholder.jpg';
    
    // Escape color if present
    const escapedColor = product.colors && product.colors.length > 0 
      ? this.escapeHtml(product.colors[0]) 
      : '';
    
    return `
      <div class="product-card ${isOutOfStock ? 'product-card--out-of-stock' : ''}">
        <div class="product-card__image">
          <a href="/pages/product.html?id=${escapedId}">
            <img src="${imageSrc}" 
                 alt="${escapedTitle}" 
                 loading="lazy">
          </a>
          ${product.isFeatured ? '<span class="product-badge">Featured</span>' : ''}
          ${isOutOfStock ? '<span class="product-badge product-badge--out-of-stock">Out of Stock</span>' : ''}
          
          <div class="product-card__actions">
            <button type="button" 
                    class="btn btn--icon" 
                    data-quick-view 
                    data-product-id="${escapedId}"
                    aria-label="Quick view ${escapedTitle}">
              ${SVG_ICONS.quickView}
            </button>
          </div>
        </div>
        
        <div class="product-card__content">
          <h3 class="product-card__title">
            <a href="/pages/product.html?id=${escapedId}">${escapedTitle}</a>
          </h3>
          
          <div class="product-card__price">
            ${productModel.formatPrice(product.price)}
          </div>
          
          ${product.rating ? `
            <div class="product-rating">
              <div class="stars" aria-label="Rating: ${product.rating} out of 5 stars">
                ${this.renderStars(product.rating)}
              </div>
              <span class="rating-count">(${product.reviewCount || 0})</span>
            </div>
          ` : ''}
          
          <div class="product-card__availability">
            <span class="availability-status availability-status--${availability.toLowerCase().replace(' ', '-')}">${this.escapeHtml(availability)}</span>
          </div>
          
          ${!isOutOfStock ? `
            <button type="button" 
                    class="btn btn--primary btn--full-width" 
                    data-add-to-cart 
                    data-product-id="${escapedId}"
                    ${escapedColor ? `data-selected-color="${escapedColor}"` : ''}>
              Add to Cart
            </button>
          ` : `
            <button type="button" class="btn btn--secondary btn--full-width" disabled>
              Out of Stock
            </button>
          `}
        </div>
      </div>
    `;
  }

  /**
   * Render product details
   */
  renderProductDetails(product) {
    const container = document.getElementById('productDetails');
    if (!container) return;

    const availability = productModel.getAvailabilityStatus(product);
    const isOutOfStock = availability === 'Out of Stock';
    const escapedTitle = this.escapeHtml(product.title);
    const escapedDescription = this.escapeHtml(product.description);
    const escapedId = this.escapeHtml(product._id);
    
    // Process images
    const images = Array.isArray(product.image_url) ? product.image_url : [];
    const sanitizedImages = images
      .map(url => this.sanitizeImageUrl(url))
      .filter(url => url !== null);
    const hasImages = sanitizedImages.length > 0;
    const mainImageSrc = hasImages ? sanitizedImages[0] : '/assets/images/placeholder.jpg';

    container.innerHTML = `
      <div class="product-details">
        <div class="product-gallery">
          <div class="main-image">
            <img id="mainProductImage" src="${mainImageSrc}" alt="${escapedTitle}">
          </div>
          ${sanitizedImages.length > 1 ? `
            <div class="thumbnail-gallery">
              ${sanitizedImages.map((url, index) => {
                const escapedUrl = this.escapeHtml(url);
                return `
                <button class="thumbnail ${index === 0 ? 'active' : ''}" 
                        data-switch-image="${escapedUrl}"
                        data-image-index="${index}"
                        aria-label="View image ${index + 1}">
                  <img src="${url}" alt="${escapedTitle} - Image ${index + 1}">
                </button>
              `;
              }).join('')}
            </div>
          ` : ''}
        </div>
        
        <div class="product-info">
          <h1 class="product-title">${escapedTitle}</h1>
          
          <div class="product-price">
            ${productModel.formatPrice(product.price)}
          </div>
          
          ${product.rating ? `
            <div class="product-rating">
              <div class="stars" aria-label="Rating: ${product.rating} out of 5 stars">
                ${this.renderStars(product.rating)}
              </div>
              <span class="rating-text">${product.rating}/5 (${product.reviewCount || 0} reviews)</span>
            </div>
          ` : ''}
          
          <div class="product-availability">
            <span class="availability-status availability-status--${availability.toLowerCase().replace(' ', '-')}">${this.escapeHtml(availability)}</span>
          </div>
          
          <div class="product-description">
            <p>${escapedDescription}</p>
          </div>
          
          ${product.colors && product.colors.length > 0 ? `
            <div class="product-options">
              <label>Color:</label>
              <div class="color-options">
                ${product.colors.map((color, index) => {
                  const escapedColor = this.escapeHtml(color);
                  const safeColorStyle = this.sanitizeColor(color);
                  return `
                    <label class="color-option">
                      <input type="radio" name="selectedColor" value="${escapedColor}" ${index === 0 ? 'checked' : ''}>
                      <span class="color-swatch" style="background-color: ${safeColorStyle}"></span>
                      <span class="color-name">${escapedColor}</span>
                    </label>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}
          
          <div class="product-actions">
            <div class="quantity-selector">
              <label for="quantity">Quantity:</label>
              <div class="quantity-input">
                <button type="button" class="quantity-btn" data-quantity-decrease aria-label="Decrease quantity">
                  ${SVG_ICONS.minus}
                </button>
                <input type="number" id="quantity" value="1" min="1" max="${product.quantity || 99}" aria-label="Quantity">
                <button type="button" class="quantity-btn" data-quantity-increase aria-label="Increase quantity">
                  ${SVG_ICONS.plus}
                </button>
              </div>
            </div>
            
            ${!isOutOfStock ? `
              <button type="button" 
                      class="btn btn--primary btn--large" 
                      data-add-to-cart-details
                      data-product-id="${escapedId}">
                Add to Cart
              </button>
            ` : `
              <button type="button" class="btn btn--secondary btn--large" disabled>
                Out of Stock
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render pagination
   */
  renderPagination(pagination) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer || !pagination) return;

    const { page, pages } = pagination;
    
    if (pages <= 1) {
      paginationContainer.innerHTML = '';
      return;
    }

    let paginationHTML = '<nav class="pagination" aria-label="Products pagination"><ul>';

    // Previous button
    if (page > 1) {
      paginationHTML += `<li><a href="#" data-page="${page - 1}" class="pagination-link">Previous</a></li>`;
    }

    // Page numbers with ellipsis for large datasets
    const visibleItems = [];
    const delta = 1;
    const range = [];

    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || (i >= page - delta && i <= page + delta)) {
        range.push(i);
      }
    }

    let lastPageInRange = 0;
    for (const p of range) {
      if (lastPageInRange) {
        const gap = p - lastPageInRange;
        if (gap === 2) {
          visibleItems.push(lastPageInRange + 1);
        } else if (gap > 2) {
          visibleItems.push('ellipsis');
        }
      }
      visibleItems.push(p);
      lastPageInRange = p;
    }

    for (const item of visibleItems) {
      if (item === 'ellipsis') {
        paginationHTML += `<li><span class="pagination-ellipsis" aria-hidden="true">…</span></li>`;
      } else if (item === page) {
        paginationHTML += `<li><span class="pagination-link pagination-link--current" aria-current="page">${item}</span></li>`;
      } else {
        paginationHTML += `<li><a href="#" data-page="${item}" class="pagination-link">${item}</a></li>`;
      }
    }

    // Next button
    if (page < pages) {
      paginationHTML += `<li><a href="#" data-page="${page + 1}" class="pagination-link">Next</a></li>`;
    }

    paginationHTML += '</ul></nav>';
    paginationContainer.innerHTML = paginationHTML;
  }

  /**
   * Render star rating
   */
  renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let starsHTML = '';

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      starsHTML += SVG_ICONS.starFull;
    }

    // Half star
    if (hasHalfStar) {
      starsHTML += SVG_ICONS.starHalf;
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      starsHTML += SVG_ICONS.starEmpty;
    }

    return starsHTML;
  }

  /**
   * Show loading state
   */
  showLoading(container) {
    if (!container) return;
    container.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    `;
  }

  /**
   * Show error state
   */
  showError(container, message) {
    if (!container) return;
    const escapedMessage = this.escapeHtml(message);
    container.innerHTML = `
      <div class="error-container">
        <p class="error-message">${escapedMessage}</p>
        <button type="button" class="btn btn--secondary js-error-retry">
          Try Again
        </button>
      </div>
    `;
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

  /**
   * Show quick view modal (placeholder - implement as needed)
   */
  showQuickViewModal(product) {
    // TODO: Implement quick view modal
    console.log('Quick view for product:', product._id);
  }
}

// Create singleton instance
export const productController = new ProductController();
