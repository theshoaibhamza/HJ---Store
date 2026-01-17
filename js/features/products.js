/**
 * Product Page Functionality
 * Handles individual product interactions and cart management
 */

class ProductManager {
    constructor() {
        this.init();
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
     * Sanitize image URL
     * @param {string} url
     * @returns {string}
     */
    sanitizeImageUrl(url) {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/') || url.startsWith('data:image/')) {
            return url;
        }
        return '';
    }

    /**
     * Safely parse JSON from localStorage
     * @param {string} key - localStorage key
     * @param {*} defaultValue - default value if parsing fails
     * @returns {*}
     */
    safeGetStorage(key, defaultValue = []) {
        try {
            const data = localStorage.getItem(key);
            if (!data) return defaultValue;
            return JSON.parse(data);
        } catch (e) {
            console.warn(`Failed to parse localStorage key '${key}':`, e);
            return defaultValue;
        }
    }

    init() {
        this.bindEvents();
        this.initializeQuickActions();
        this.setupImageGallery();
        this.handleVariantSelection();
    }

    bindEvents() {
        // Consolidated click event handler using event delegation
        document.addEventListener('click', (e) => {
            const target = e.target;

            // Add to cart buttons
            if (target.matches('.add-to-cart, .product-card__add-to-cart') || 
                target.closest('.add-to-cart, .product-card__add-to-cart')) {
                e.preventDefault();
                this.handleAddToCart(e);
                return;
            }

            // Wishlist toggle
            if (target.matches('.add-to-wishlist, .product-card__action[data-action="wishlist"]') ||
                target.closest('.add-to-wishlist, .product-card__action[data-action="wishlist"]')) {
                e.preventDefault();
                this.handleWishlistToggle(e);
                return;
            }

            // Quick view
            if (target.matches('.quick-view, .product-card__action[data-action="quick-view"]') ||
                target.closest('.quick-view, .product-card__action[data-action="quick-view"]')) {
                e.preventDefault();
                this.handleQuickView(e);
                return;
            }

            // Quantity controls
            if (target.matches('.quantity-btn--decrease') || target.closest('.quantity-btn--decrease')) {
                this.decreaseQuantity(e);
                return;
            }
            if (target.matches('.quantity-btn--increase') || target.closest('.quantity-btn--increase')) {
                this.increaseQuantity(e);
                return;
            }

            // Size guide modal
            if (target.matches('.size-guide-trigger') || target.closest('.size-guide-trigger')) {
                e.preventDefault();
                this.openSizeGuide();
                return;
            }
        });
    }

    initializeQuickActions() {
        // Initialize heart icons for wishlist
        const wishlistButtons = document.querySelectorAll('.add-to-wishlist, [data-action="wishlist"]');
        wishlistButtons.forEach(button => {
            if (!button.querySelector('svg')) {
                const svg = this.createHeartSvg();
                button.appendChild(svg);
            }
        });

        // Initialize eye icons for quick view
        const quickViewButtons = document.querySelectorAll('.quick-view, [data-action="quick-view"]');
        quickViewButtons.forEach(button => {
            if (!button.querySelector('svg')) {
                const svg = this.createEyeSvg();
                button.appendChild(svg);
            }
        });
    }

    /**
     * Create heart SVG element safely
     * @returns {SVGElement}
     */
    createHeartSvg() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '18');
        svg.setAttribute('height', '18');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('aria-hidden', 'true');
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z');
        svg.appendChild(path);
        
        return svg;
    }

    /**
     * Create eye SVG element safely
     * @returns {SVGElement}
     */
    createEyeSvg() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '18');
        svg.setAttribute('height', '18');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('aria-hidden', 'true');
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z');
        svg.appendChild(path);
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '12');
        circle.setAttribute('cy', '12');
        circle.setAttribute('r', '3');
        svg.appendChild(circle);
        
        return svg;
    }

    setupImageGallery() {
        // Handle product image hover effects
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const image = card.querySelector('.product-card__image');
            if (image && image.dataset.hoverSrc) {
                const originalSrc = image.src;
                const hoverSrc = image.dataset.hoverSrc;

                card.addEventListener('mouseenter', () => {
                    image.src = hoverSrc;
                });

                card.addEventListener('mouseleave', () => {
                    image.src = originalSrc;
                });
            }
        });
    }

    handleVariantSelection() {
        // Handle product variant selection (size, color, etc.)
        document.addEventListener('change', (e) => {
            if (e.target.matches('.variant-select')) {
                this.updateVariant(e);
            }
        });
    }

    /**
     * Update product variant selection
     * @param {Event} e - Change event
     */
    updateVariant(e) {
        const select = e.target;
        const productCard = select.closest('.product-card, .product-item, .product-details');
        if (!productCard) return;

        const selectedOption = select.options[select.selectedIndex];
        const variantData = {
            value: select.value,
            price: selectedOption?.dataset.price,
            sku: selectedOption?.dataset.sku,
            image: selectedOption?.dataset.image
        };

        // Update price display if variant has different price
        if (variantData.price) {
            const priceEl = productCard.querySelector('.price');
            if (priceEl) {
                priceEl.textContent = `₹${parseFloat(variantData.price).toLocaleString()}`;
            }
        }

        // Update image if variant has different image
        if (variantData.image) {
            const imageEl = productCard.querySelector('.product-card__image, .product-image');
            if (imageEl) {
                imageEl.src = this.sanitizeImageUrl(variantData.image);
            }
        }

        // Dispatch event for variant change
        window.dispatchEvent(new CustomEvent('variantChanged', {
            detail: { variant: variantData, productCard }
        }));
    }

    handleAddToCart(e) {
        const button = e.target.closest('.add-to-cart, .product-card__add-to-cart');
        const productCard = button.closest('.product-card, .product-item');
        
        if (!productCard) return;

        const productData = this.extractProductData(productCard);
        
        // Show loading state
        this.setButtonLoading(button, true);

        // Simulate API call delay
        setTimeout(() => {
            this.addToCart(productData);
            this.setButtonSuccess(button);
            
            // Reset button after 2 seconds
            setTimeout(() => {
                this.resetButton(button);
            }, 2000);
        }, 500);
    }

    handleWishlistToggle(e) {
        const button = e.target.closest('.add-to-wishlist, [data-action="wishlist"]');
        const productCard = button.closest('.product-card, .product-item');
        
        if (!productCard) return;

        const productData = this.extractProductData(productCard);
        const isActive = button.classList.contains('is-active');

        if (isActive) {
            this.removeFromWishlist(productData.id);
            button.classList.remove('is-active');
            this.showNotification('Removed from wishlist', 'info');
        } else {
            this.addToWishlist(productData);
            button.classList.add('is-active');
            this.showNotification('Added to wishlist', 'success');
        }

        // Update button appearance
        this.updateWishlistButton(button, !isActive);
    }

    handleQuickView(e) {
        const button = e.target.closest('.quick-view, [data-action="quick-view"]');
        const productCard = button.closest('.product-card, .product-item');
        
        if (!productCard) return;

        const productData = this.extractProductData(productCard);
        this.openQuickViewModal(productData);
    }

    extractProductData(productCard) {
        const productId = productCard.dataset.id || productCard.dataset.productId;
        
        if (!productId) {
            console.error('Product card missing data-id or data-product-id attribute:', productCard);
            throw new Error('Product ID is required. Add data-id attribute to product card.');
        }

        return {
            id: productId,
            title: productCard.querySelector('.product-card__title, .product-title')?.textContent.trim() || 'Unknown Product',
            price: this.extractPrice(productCard.querySelector('.price')?.textContent),
            originalPrice: this.extractPrice(productCard.querySelector('.price--original')?.textContent),
            image: this.sanitizeImageUrl(productCard.querySelector('.product-card__image, .product-image')?.src || ''),
            variant: productCard.querySelector('.product-card__variant, .product-variant')?.textContent.trim() || '',
            category: productCard.dataset.category || '',
            sku: productCard.dataset.sku || '',
            quantity: 1
        };
    }

    extractPrice(priceText) {
        if (!priceText) return 0;
        return parseFloat(priceText.replace(/[^\d.]/g, '')) || 0;
    }

    addToCart(productData) {
        // Get existing cart or create new one
        let cart = this.safeGetStorage('chandni_cart', []);
        
        // Check if product already exists in cart
        const existingItemIndex = cart.findIndex(item => 
            item.id === productData.id && item.variant === productData.variant
        );

        if (existingItemIndex > -1) {
            // Update quantity if item exists
            cart[existingItemIndex].quantity += productData.quantity;
        } else {
            // Add new item to cart
            cart.push({
                ...productData,
                addedAt: Date.now()
            });
        }

        // Save to localStorage
        localStorage.setItem('chandni_cart', JSON.stringify(cart));
        
        // Update cart UI
        this.updateCartCount();
        
        // Show success notification
        this.showNotification('Added to cart successfully!', 'success');
        
        // Dispatch custom event for cart update
        window.dispatchEvent(new CustomEvent('cartUpdated', { 
            detail: { cart, action: 'add', product: productData } 
        }));
    }

    addToWishlist(productData) {
        let wishlist = this.safeGetStorage('chandni_wishlist', []);
        
        // Check if already in wishlist
        if (!wishlist.some(item => item.id === productData.id)) {
            wishlist.push({
                ...productData,
                addedAt: Date.now()
            });
            
            localStorage.setItem('chandni_wishlist', JSON.stringify(wishlist));
            
            // Update wishlist count if UI exists
            this.updateWishlistCount();
            
            // Dispatch event
            window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
                detail: { wishlist, action: 'add', product: productData } 
            }));
        }
    }

    removeFromWishlist(productId) {
        let wishlist = this.safeGetStorage('chandni_wishlist', []);
        wishlist = wishlist.filter(item => item.id !== productId);
        
        localStorage.setItem('chandni_wishlist', JSON.stringify(wishlist));
        this.updateWishlistCount();
        
        window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
            detail: { wishlist, action: 'remove', productId } 
        }));
    }

    updateCartCount() {
        const cart = this.safeGetStorage('chandni_cart', []);
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        const cartCounts = document.querySelectorAll('.cart-count, .header__cart-count');
        cartCounts.forEach(count => {
            count.textContent = totalItems;
            count.style.display = totalItems > 0 ? 'block' : 'none';
        });
    }

    updateWishlistCount() {
        const wishlist = this.safeGetStorage('chandni_wishlist', []);
        const wishlistCounts = document.querySelectorAll('.wishlist-count');
        wishlistCounts.forEach(count => {
            count.textContent = wishlist.length;
            count.style.display = wishlist.length > 0 ? 'block' : 'none';
        });
    }

    setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.dataset.originalText = button.textContent;
            button.textContent = 'Adding...';
            button.disabled = true;
            button.classList.add('is-loading');
        } else {
            button.textContent = button.dataset.originalText || 'Add to Cart';
            button.disabled = false;
            button.classList.remove('is-loading');
        }
    }

    setButtonSuccess(button) {
        button.textContent = 'Added!';
        button.classList.add('is-success');
    }

    resetButton(button) {
        button.textContent = button.dataset.originalText || 'Add to Cart';
        button.disabled = false;
        button.classList.remove('is-loading', 'is-success');
    }

    updateWishlistButton(button, isActive) {
        const svg = button.querySelector('svg path');
        if (svg) {
            svg.setAttribute('fill', isActive ? 'currentColor' : 'none');
        }
    }

    decreaseQuantity(e) {
        const input = e.target.parentElement.querySelector('.quantity-input');
        const currentValue = parseInt(input.value) || 1;
        if (currentValue > 1) {
            input.value = currentValue - 1;
            input.dispatchEvent(new Event('change'));
        }
    }

    increaseQuantity(e) {
        const input = e.target.parentElement.querySelector('.quantity-input');
        const currentValue = parseInt(input.value) || 1;
        const maxValue = parseInt(input.max) || 999;
        if (currentValue < maxValue) {
            input.value = currentValue + 1;
            input.dispatchEvent(new Event('change'));
        }
    }

    openQuickViewModal(productData) {
        // Create and show quick view modal
        const modal = this.createQuickViewModal(productData);
        document.body.appendChild(modal);
        
        // Trigger modal open
        setTimeout(() => {
            modal.classList.add('is-active');
        }, 10);
        
        // Close modal events
        const closeModal = () => {
            modal.classList.remove('is-active');
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        };

        modal.querySelector('.modal__close').addEventListener('click', closeModal);
        modal.querySelector('.modal__backdrop').addEventListener('click', closeModal);
        
        // ESC key to close
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    }

    createQuickViewModal(productData) {
        const escapedTitle = this.escapeHtml(productData.title);
        const escapedCategory = this.escapeHtml(productData.category || 'Jewelry');
        const escapedId = this.escapeHtml(productData.id);
        const escapedSku = this.escapeHtml(productData.sku || 'CJ' + productData.id.toUpperCase());
        const sanitizedImage = this.sanitizeImageUrl(productData.image);
        
        const modal = document.createElement('div');
        modal.className = 'modal modal--quick-view';
        modal.innerHTML = `
            <div class="modal__backdrop"></div>
            <div class="modal__content">
                <button type="button" class="modal__close" aria-label="Close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <div class="quick-view">
                    <div class="quick-view__image">
                        <img src="${sanitizedImage}" alt="${escapedTitle}" loading="lazy">
                    </div>
                    <div class="quick-view__details">
                        <h2 class="quick-view__title">${escapedTitle}</h2>
                        <div class="quick-view__price">
                            <span class="price">₹${productData.price.toLocaleString()}</span>
                            ${productData.originalPrice > 0 && productData.originalPrice !== productData.price ? 
                                `<span class="price--original">₹${productData.originalPrice.toLocaleString()}</span>` : ''
                            }
                        </div>
                        <div class="quick-view__description">
                            <p>Authentic handcrafted jewelry piece featuring traditional design elements. Perfect for special occasions and daily wear.</p>
                        </div>
                        <div class="quick-view__actions">
                            <div class="quantity-selector">
                                <button type="button" class="quantity-btn quantity-btn--decrease" aria-label="Decrease quantity">-</button>
                                <input type="number" class="quantity-input" value="1" min="1" max="10" aria-label="Quantity">
                                <button type="button" class="quantity-btn quantity-btn--increase" aria-label="Increase quantity">+</button>
                            </div>
                            <button type="button" class="btn btn--primary add-to-cart" data-product-id="${escapedId}">
                                Add to Cart
                            </button>
                        </div>
                        <div class="quick-view__meta">
                            <p><strong>SKU:</strong> ${escapedSku}</p>
                            <p><strong>Category:</strong> ${escapedCategory}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return modal;
    }

    openSizeGuide() {
        // Implementation for size guide modal
        console.log('Opening size guide...');
        // This would open a size guide modal with measurements
    }

    showNotification(message, type = 'info') {
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        
        const content = document.createElement('div');
        content.className = 'notification__content';
        
        const messageSpan = document.createElement('span');
        messageSpan.className = 'notification__message';
        messageSpan.textContent = message;
        
        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'notification__close';
        closeButton.setAttribute('aria-label', 'Close');
        closeButton.textContent = '×';
        
        content.appendChild(messageSpan);
        content.appendChild(closeButton);
        notification.appendChild(content);

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('is-active');
        }, 10);

        // Auto remove after 3 seconds
        setTimeout(() => {
            this.removeNotification(notification);
        }, 3000);

        // Close button event
        notification.querySelector('.notification__close').addEventListener('click', () => {
            this.removeNotification(notification);
        });
    }

    removeNotification(notification) {
        notification.classList.remove('is-active');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.productManager = new ProductManager();
    
    // Initialize cart and wishlist counts
    window.productManager.updateCartCount();
    window.productManager.updateWishlistCount();
});