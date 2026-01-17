/**
 * Collection Page Controller
 * Handles product filtering, sorting, pagination, and UI interactions
 */

class CollectionController {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.filters = {
            category: [],
            priceRange: null,
            material: [],
            color: [],
            style: [],
            size: []
        };
        this.sortBy = 'featured';
        
        this.init();
    }

    init() {
        this.loadProducts();
        this.bindEvents();
        this.initializeFilters();
        this.renderProducts();
        this.updatePagination();
    }

    loadProducts() {
        // Get product data from HTML or make API call
        const productElements = document.querySelectorAll('.product-card');
        this.products = Array.from(productElements).map((element, index) => {
            const id = element.getAttribute('data-id') || index;
            const title = element.querySelector('.product-card__title')?.textContent || '';
            const price = this.extractPrice(element.querySelector('.price')?.textContent);
            const originalPrice = this.extractPrice(element.querySelector('.price--original')?.textContent);
            const image = element.querySelector('.product-card__image')?.src || '';
            const category = element.getAttribute('data-category') || '';
            const material = element.getAttribute('data-material') || '';
            const color = element.getAttribute('data-color') || '';
            const style = element.getAttribute('data-style') || '';
            const size = element.getAttribute('data-size') || '';
            const badges = Array.from(element.querySelectorAll('.product-badge')).map(badge => 
                badge.textContent.toLowerCase().trim()
            );

            return {
                id,
                title,
                price,
                originalPrice,
                image,
                category,
                material,
                color,
                style,
                size,
                badges,
                element
            };
        });

        this.filteredProducts = [...this.products];
    }

    extractPrice(priceText) {
        if (!priceText) return 0;
        // Extract numeric value from price text (e.g., "₹2,999" -> 2999)
        return parseFloat(priceText.replace(/[^\d.]/g, '')) || 0;
    }

    bindEvents() {
        // Filter toggle for mobile
        const filterToggle = document.querySelector('[data-filter-toggle]');
        const filterClose = document.querySelector('[data-filter-close]');
        const filterBackdrop = document.querySelector('[data-filter-backdrop]');
        
        if (filterToggle) {
            filterToggle.addEventListener('click', this.toggleFilters.bind(this));
        }
        
        if (filterClose) {
            filterClose.addEventListener('click', this.closeFilters.bind(this));
        }
        
        if (filterBackdrop) {
            filterBackdrop.addEventListener('click', this.closeFilters.bind(this));
        }

        // Filter checkboxes
        document.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox' && e.target.classList.contains('filter-checkbox')) {
                this.handleFilterChange(e);
            }
        });

        // Sort dropdown
        const sortSelect = document.querySelector('[data-sort-select]');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.applyFilters();
            });
        }

        // Clear all filters
        const clearAllBtn = document.querySelector('[data-filter-clear-all]');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', this.clearAllFilters.bind(this));
        }

        // Clear filters button in sidebar
        const clearFilterBtn = document.querySelector('[data-filter-clear]');
        if (clearFilterBtn) {
            clearFilterBtn.addEventListener('click', this.clearAllFilters.bind(this));
        }

        // Filter group toggles
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-filter-toggle]')) {
                this.toggleFilterGroup(e.target.closest('[data-filter-toggle]'));
            }
        });

        // View toggle buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-view]')) {
                this.toggleView(e.target.closest('[data-view]'));
            }
        });

        // Product quick actions
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-quick-add]')) {
                this.handleQuickAdd(e.target.closest('[data-quick-add]'));
            } else if (e.target.closest('.product-card__wishlist')) {
                this.handleWishlist(e.target.closest('.product-card__wishlist'));
            } else if (e.target.closest('[data-quickview]')) {
                this.handleQuickView(e.target.closest('[data-quickview]'));
            }
        });

        // Handle window resize for responsive sidebar
        window.addEventListener('resize', this.handleResize.bind(this));

        // Pagination buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('pagination__number')) {
                e.preventDefault();
                this.goToPage(parseInt(e.target.textContent));
            } else if (e.target.classList.contains('pagination__prev')) {
                e.preventDefault();
                this.goToPage(this.currentPage - 1);
            } else if (e.target.classList.contains('pagination__next')) {
                e.preventDefault();
                this.goToPage(this.currentPage + 1);
            }
        });

        // Product actions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                this.addToCart(e);
            } else if (e.target.classList.contains('add-to-wishlist')) {
                this.addToWishlist(e);
            } else if (e.target.classList.contains('quick-view')) {
                this.quickView(e);
            }
        });

        // Search functionality
        const searchInput = document.querySelector('.collection-search');
        if (searchInput) {
            let searchTimeout = null;
            searchInput.addEventListener('input', (e) => {
                if (searchTimeout) {
                    clearTimeout(searchTimeout);
                }
                searchTimeout = setTimeout(() => {
                    this.searchProducts(e.target.value);
                }, 300);
            });
        }
    }

    initializeFilters() {
        // Set up filter UI based on available products
        this.populateFilterOptions();
    }

    populateFilterOptions() {
        const categories = [...new Set(this.products.map(p => p.category).filter(Boolean))];
        const materials = [...new Set(this.products.map(p => p.material).filter(Boolean))];
        const colors = [...new Set(this.products.map(p => p.color).filter(Boolean))];
        const styles = [...new Set(this.products.map(p => p.style).filter(Boolean))];
        const sizes = [...new Set(this.products.map(p => p.size).filter(Boolean))];

        // Populate filter dropdowns if they exist
        this.populateFilterGroup('category', categories);
        this.populateFilterGroup('material', materials);
        this.populateFilterGroup('color', colors);
        this.populateFilterGroup('style', styles);
        this.populateFilterGroup('size', sizes);
    }

    populateFilterGroup(filterType, options) {
        const container = document.querySelector(`[data-filter="${filterType}"]`);
        if (!container || options.length === 0) return;

        const optionsContainer = container.querySelector('.filters__options');
        if (!optionsContainer) return;

        optionsContainer.innerHTML = '';

        options.forEach(option => {
            const escapedOption = this.escapeHtml(option);
            const optionElement = document.createElement('label');
            optionElement.className = 'filter-option';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'filter-checkbox';
            checkbox.setAttribute('data-filter', filterType);
            checkbox.value = option;
            
            const textSpan = document.createElement('span');
            textSpan.className = 'filter-option__text';
            textSpan.textContent = option;
            
            optionElement.appendChild(checkbox);
            optionElement.appendChild(textSpan);
            optionsContainer.appendChild(optionElement);
        });
    }

    toggleFilters() {
        const sidebar = document.querySelector('.collection-sidebar');
        const backdrop = document.querySelector('[data-filter-backdrop]');
        
        if (sidebar && backdrop) {
            const isOpen = sidebar.classList.toggle('is-open');
            backdrop.classList.toggle('is-active', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        }
    }

    closeFilters() {
        const sidebar = document.querySelector('.collection-sidebar');
        const backdrop = document.querySelector('[data-filter-backdrop]');
        
        if (sidebar && backdrop) {
            sidebar.classList.remove('is-open');
            backdrop.classList.remove('is-active');
            document.body.style.overflow = '';
        }
    }

    handleResize() {
        // Close mobile sidebar when screen becomes desktop-sized
        if (window.innerWidth >= 1024) {
            this.closeFilters();
        }
    }

    clearAllFilters() {
        // Reset all filters
        this.filters = {
            category: [],
            priceRange: null,
            material: [],
            color: [],
            style: [],
            size: []
        };

        // Uncheck all filter checkboxes
        const checkboxes = document.querySelectorAll('input.filter-checkbox[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        // Clear active filters display
        const activeFilters = document.querySelector('[data-active-filters]');
        if (activeFilters) {
            activeFilters.setAttribute('hidden', '');
        }

        // Reapply filters (which will show all products)
        this.applyFilters();
    }

    handleFilterChange(e) {
        const filterType = e.target.getAttribute('data-filter');
        const value = e.target.value;
        const isChecked = e.target.checked;

        if (!this.filters[filterType]) {
            this.filters[filterType] = [];
        }

        if (isChecked) {
            if (!this.filters[filterType].includes(value)) {
                this.filters[filterType].push(value);
            }
        } else {
            this.filters[filterType] = this.filters[filterType].filter(v => v !== value);
        }

        this.applyFilters();
    }

    searchProducts(query) {
        if (!query.trim()) {
            this.applyFilters();
            return;
        }

        const searchTerm = query.toLowerCase();
        this.filteredProducts = this.products.filter(product =>
            product.title.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.material.toLowerCase().includes(searchTerm) ||
            product.style.toLowerCase().includes(searchTerm)
        );

        this.currentPage = 1;
        this.renderProducts();
        this.updatePagination();
        this.updateResultsCount();
    }

    applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            // Category filter
            if (this.filters.category.length > 0 && 
                !this.filters.category.includes(product.category)) {
                return false;
            }

            // Material filter
            if (this.filters.material.length > 0 && 
                !this.filters.material.includes(product.material)) {
                return false;
            }

            // Color filter
            if (this.filters.color.length > 0 && 
                !this.filters.color.includes(product.color)) {
                return false;
            }

            // Style filter
            if (this.filters.style.length > 0 && 
                !this.filters.style.includes(product.style)) {
                return false;
            }

            // Size filter
            if (this.filters.size.length > 0 && 
                !this.filters.size.includes(product.size)) {
                return false;
            }

            // Price range filter
            if (this.filters.priceRange) {
                const [min, max] = this.filters.priceRange;
                if (product.price < min || product.price > max) {
                    return false;
                }
            }

            return true;
        });

        this.sortProducts();
        this.currentPage = 1;
        this.renderProducts();
        this.updatePagination();
        this.updateResultsCount();
    }

    sortProducts() {
        this.filteredProducts.sort((a, b) => {
            switch (this.sortBy) {
                case 'price-low-high':
                    return a.price - b.price;
                case 'price-high-low':
                    return b.price - a.price;
                case 'name-a-z':
                    return a.title.localeCompare(b.title);
                case 'name-z-a':
                    return b.title.localeCompare(a.title);
                case 'newest':
                    return b.badges.includes('new') - a.badges.includes('new');
                case 'best-selling':
                    return b.badges.includes('bestseller') - a.badges.includes('bestseller');
                default: // featured
                    return b.badges.includes('featured') - a.badges.includes('featured');
            }
        });
    }

    renderProducts() {
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) return;

        // Hide all products first
        this.products.forEach(product => {
            product.element.style.display = 'none';
            product.element.setAttribute('aria-hidden', 'true');
        });

        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        // Show filtered products
        productsToShow.forEach(product => {
            product.element.style.display = 'block';
            product.element.removeAttribute('aria-hidden');
        });

        // If no products match filters, show message
        if (this.filteredProducts.length === 0) {
            this.showNoProductsMessage();
        } else {
            this.hideNoProductsMessage();
        }
    }

    showNoProductsMessage() {
        const existingMessage = document.querySelector('.no-products-message');
        if (existingMessage) return;

        const productsGrid = document.querySelector('.products-grid');
        const message = document.createElement('div');
        message.className = 'no-products-message';
        message.style.cssText = `
            grid-column: 1 / -1;
            text-align: center;
            padding: 60px 20px;
            color: var(--color-text-light);
        `;
        message.innerHTML = `
            <h3 style="margin-bottom: 16px; font-size: var(--font-size-xl);">No products found</h3>
            <p>Try adjusting your filters or search terms.</p>
        `;
        
        productsGrid.appendChild(message);
    }

    hideNoProductsMessage() {
        const message = document.querySelector('.no-products-message');
        if (message) {
            message.remove();
        }
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        const paginationNumbers = document.querySelector('.pagination__numbers');
        const prevBtn = document.querySelector('.pagination__prev');
        const nextBtn = document.querySelector('.pagination__next');

        if (!paginationNumbers) return;

        // Update prev/next buttons
        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
        }
        if (nextBtn) {
            nextBtn.disabled = this.currentPage === totalPages || totalPages === 0;
        }

        // Update page numbers
        paginationNumbers.innerHTML = '';

        if (totalPages <= 1) return;

        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `pagination__number ${i === this.currentPage ? 'pagination__number--active' : ''}`;
            pageBtn.textContent = i;
            paginationNumbers.appendChild(pageBtn);
        }
    }

    updateResultsCount() {
        const resultsElement = document.querySelector('.collection-toolbar__results');
        if (resultsElement) {
            const start = (this.currentPage - 1) * this.itemsPerPage + 1;
            const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredProducts.length);
            const total = this.filteredProducts.length;
            
            if (total === 0) {
                resultsElement.textContent = 'No products found';
            } else {
                resultsElement.textContent = `Showing ${start}-${end} of ${total} products`;
            }
        }
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        if (page < 1 || page > totalPages) return;

        this.currentPage = page;
        this.renderProducts();
        this.updatePagination();
        this.updateResultsCount();

        // Scroll to top of products grid
        const productsGrid = document.querySelector('.products-grid');
        if (productsGrid) {
            productsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    addToCart(e) {
        e.preventDefault();
        const productCard = e.target.closest('.product-card');
        const productId = productCard.getAttribute('data-id');
        
        // Show loading state
        const button = e.target;
        const originalText = button.textContent;
        button.textContent = 'Adding...';
        button.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Add to cart logic here (integrate with CartController)
            if (window.cartController) {
                window.cartController.addItem(productId, 1);
            }

            // Show success state
            button.textContent = 'Added!';
            button.style.backgroundColor = 'var(--color-success)';

            // Reset button after delay
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.style.backgroundColor = '';
            }, 2000);
        }, 500);
    }

    addToWishlist(e) {
        e.preventDefault();
        const productCard = e.target.closest('.product-card');
        const productId = productCard.getAttribute('data-id');
        
        // Toggle wishlist state
        e.target.classList.toggle('is-active');
        
        // Add wishlist logic here
        console.log('Added to wishlist:', productId);
    }

    quickView(e) {
        e.preventDefault();
        const productCard = e.target.closest('.product-card');
        const productId = productCard.getAttribute('data-id');
        
        // Open quick view modal
        console.log('Quick view for product:', productId);
        
        // Implementation for quick view modal would go here
    }

    toggleFilterGroup(button) {
        const filterGroup = button.closest('.filter-group');
        const content = filterGroup.querySelector('.filter-group__content');
        const icon = button.querySelector('.filter-group__icon');
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        
        // Add animating class for will-change optimization
        filterGroup.classList.add('is-animating');
        
        if (isExpanded) {
            button.setAttribute('aria-expanded', 'false');
            content.style.maxHeight = content.scrollHeight + 'px';
            // Force reflow
            content.offsetHeight;
            content.style.maxHeight = '0';
            content.style.overflow = 'hidden';
            icon.style.transform = 'rotate(-90deg)';
        } else {
            button.setAttribute('aria-expanded', 'true');
            content.style.display = 'block';
            content.style.maxHeight = content.scrollHeight + 'px';
            content.style.overflow = 'hidden';
            icon.style.transform = 'rotate(0deg)';
        }
        
        // Remove animating class after transition
        content.addEventListener('transitionend', () => {
            filterGroup.classList.remove('is-animating');
            if (!isExpanded) {
                content.style.maxHeight = 'none';
                content.style.overflow = '';
            } else {
                content.style.display = 'none';
            }
        }, { once: true });
    }

    toggleView(button) {
        const view = button.getAttribute('data-view');
        const productGrid = document.querySelector('.products-grid');
        const viewButtons = document.querySelectorAll('[data-view]');
        
        // Remove active class from all buttons
        viewButtons.forEach(btn => btn.classList.remove('is-active'));
        
        // Add active class to clicked button
        button.classList.add('is-active');
        
        // Toggle grid view
        if (view === 'grid') {
            productGrid.classList.remove('collection-grid--list');
        } else if (view === 'list') {
            productGrid.classList.add('collection-grid--list');
        }
    }

    handleQuickAdd(button) {
        const productId = button.getAttribute('data-quick-add');
        
        // Add quick add logic here
        console.log('Quick add product:', productId);
        
        // Show notification
        this.showNotification('Product added to cart!', 'success');
    }

    handleWishlist(button) {
        const productCard = button.closest('.product-card');
        const productId = productCard.getAttribute('data-id') || button.getAttribute('data-product-id');
        
        // Toggle wishlist state
        button.classList.toggle('is-active');
        
        if (button.classList.contains('is-active')) {
            console.log('Added to wishlist:', productId);
            this.showNotification('Added to wishlist!', 'success');
        } else {
            console.log('Removed from wishlist:', productId);
            this.showNotification('Removed from wishlist!', 'info');
        }
    }

    handleQuickView(button) {
        const productId = button.getAttribute('data-quickview');
        
        // Open quick view modal
        console.log('Quick view for product:', productId);
        
        // Implementation for quick view modal would go here
    }

    showNotification(message, type = 'info') {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = `notification notification--${type} is-active`;
        
        const content = document.createElement('div');
        content.className = 'notification__content';
        
        const messageSpan = document.createElement('span');
        messageSpan.className = 'notification__message';
        messageSpan.textContent = message;
        
        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'notification__close';
        closeBtn.setAttribute('aria-label', 'Close notification');
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', () => {
            notification.remove();
        }, { once: true });
        
        content.appendChild(messageSpan);
        content.appendChild(closeBtn);
        notification.appendChild(content);
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
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
}

// Initialize collection controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on collection pages
    if (document.querySelector('.collection-grid')) {
        window.collectionController = new CollectionController();
    }
});
