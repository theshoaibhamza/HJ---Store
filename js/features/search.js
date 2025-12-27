/**
 * =====================================================
 * CHANDNI JEWELLERY - Search Feature
 * =====================================================
 */

import { Utils } from '../core/utils.js';
import { Config } from '../core/config.js';

export class Search {
  /**
   * Create search instance
   * @param {Object} options - Search options
   */
  constructor(options = {}) {
    this.options = {
      toggleSelector: '[data-search-toggle]',
      modalSelector: '#searchModal',
      inputSelector: '[data-search-input]',
      clearSelector: '[data-search-clear]',
      resultsSelector: '[data-search-results]',
      closeSelector: '[data-modal-close]',
      minChars: Config?.search?.minChars || 2,
      debounceTime: Config?.search?.debounceTime || 300,
      maxResults: Config?.search?.maxResults || 10,
      onSearch: null,
      onSelect: null,
      ...options
    };

    this.modal = document.querySelector(this.options.modalSelector);
    this.input = this.modal?.querySelector(this.options.inputSelector);
    this.clearBtn = this.modal?.querySelector(this.options.clearSelector);
    this.resultsContainer = this.modal?.querySelector(this.options.resultsSelector);

    this.isOpen = false;
    this.searchResults = [];

    if (this.modal && this.input) {
      this.init();
      console.log('✅ Search initialized successfully');
    } else {
      console.error('❌ Search initialization failed - modal:', this.modal, 'input:', this.input);
    }
  }

  /**
   * Initialize search
   */
  init() {
    this.bindEvents();
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Toggle buttons
    const toggleBtns = document.querySelectorAll(this.options.toggleSelector);
    console.log('🔍 Search toggle buttons found:', toggleBtns.length);
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('🔍 Search toggle clicked');
        this.open();
      });
    });

    // Close buttons
    const closeBtns = this.modal.querySelectorAll(this.options.closeSelector);
    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => this.close());
    });

    // Overlay close
    const overlay = this.modal.querySelector('.modal__overlay');
    if (overlay) {
      overlay.addEventListener('click', () => this.close());
    }

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Input events
    this.input.addEventListener('input', Utils.debounce((e) => {
      this.handleInput(e.target.value);
    }, this.options.debounceTime));

    this.input.addEventListener('keydown', (e) => {
      this.handleKeydown(e);
    });

    // Clear button
    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', () => {
        this.clearInput();
      });
    }

    // Keyboard shortcut (Cmd/Ctrl + K)
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  /**
   * Handle input changes
   * @param {string} query - Search query
   */
  handleInput(query) {
    const trimmedQuery = query.trim();

    // Update clear button visibility
    if (this.clearBtn) {
      this.clearBtn.hidden = trimmedQuery.length === 0;
    }

    if (trimmedQuery.length < this.options.minChars) {
      this.showPopularSearches();
      return;
    }

    this.performSearch(trimmedQuery);
  }

  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} e
   */
  handleKeydown(e) {
    const results = this.resultsContainer?.querySelectorAll('.search-result-item');
    if (!results || results.length === 0) return;

    const currentIndex = Array.from(results).findIndex(r => r.classList.contains('is-focused'));

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.focusResult(results, currentIndex + 1);
        break;

      case 'ArrowUp':
        e.preventDefault();
        this.focusResult(results, currentIndex - 1);
        break;

      case 'Enter':
        if (currentIndex > -1) {
          e.preventDefault();
          results[currentIndex].click();
        }
        break;
    }
  }

  /**
   * Focus search result
   * @param {NodeList} results - Result elements
   * @param {number} index - Index to focus
   */
  focusResult(results, index) {
    results.forEach(r => r.classList.remove('is-focused'));

    if (index < 0) index = results.length - 1;
    if (index >= results.length) index = 0;

    results[index].classList.add('is-focused');
    results[index].scrollIntoView({ block:  'nearest' });
  }

  /**
   * Perform search
   * @param {string} query - Search query
   */
  performSearch(query) {
    this.showLoading();

    // Simulate API call (replace with actual API)
    setTimeout(() => {
      const results = this.getMockResults(query);
      this.searchResults = results;
      this.renderResults(results, query);

      // Callback
      if (typeof this.options.onSearch === 'function') {
        this.options.onSearch(query, results, this);
      }
    }, 300);
  }

  /**
   * Get mock search results
   * @param {string} query - Search query
   * @returns {Array}
   */
  getMockResults(query) {
    const allProducts = [
      {
        id: 1,
        title: 'Kundan Bridal Necklace Set',
        price: 15999,
        url: '/pages/product.html?id=1',
        image: 'https://chandnijewellery.com.au/cdn/shop/files/Kalyani_White.jpg?width=200',
        category: 'Necklaces'
      },
      {
        id: 2,
        title: 'Gold Plated Bangles Set',
        price: 4999,
        url: '/pages/product.html?id=2',
        image: 'https://chandnijewellery.com.au/cdn/shop/files/Kalyani_White.jpg?width=200',
        category: 'Bangles'
      },
      {
        id: 3,
        title: 'Pearl Tikka Set',
        price: 2999,
        url: '/pages/product.html?id=3',
        image: 'https://chandnijewellery.com.au/cdn/shop/files/Kalyani_White.jpg?width=200',
        category: 'Tikka Sets'
      },
      {
        id: 4,
        title: 'Diamond Jhumka Earrings',
        price: 8999,
        url: '/pages/product.html?id=4',
        image: 'https://chandnijewellery.com.au/cdn/shop/files/Kalyani_White.jpg?width=200',
        category: 'Earrings'
      },
      {
        id: 5,
        title: 'Bridal Choker Set',
        price: 25999,
        url: '/pages/product.html?id=5',
        image: 'https://chandnijewellery.com.au/cdn/shop/files/Kalyani_White.jpg?width=200',
        category: 'Bridal'
      },
      {
        id: 6,
        title: 'Silver Payal Set',
        price: 3499,
        url: '/pages/product.html?id=6',
        image: 'https://chandnijewellery.com.au/cdn/shop/files/Kalyani_White.jpg?width=200',
        category: 'Payals'
      }
    ];

    const lowerQuery = query.toLowerCase();
    return allProducts.filter(product => 
      product.title.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery)
    ).slice(0, this.options.maxResults);
  }

  /**
   * Show loading state
   */
  showLoading() {
    if (this.resultsContainer) {
      this.resultsContainer.innerHTML = `
        <div class="search-loading">
          <div class="spinner"></div>
          <p>Searching...</p>
        </div>
      `;
    }
  }

  /**
   * Render search results
   * @param {Array} results - Search results
   * @param {string} query - Search query
   */
  renderResults(results, query) {
    if (!this.resultsContainer) return;

    if (results.length === 0) {
      this.resultsContainer.innerHTML = `
        <div class="search-no-results">
          <p>No results found for "<strong>${this.escapeHtml(query)}</strong>"</p>
          <p class="text-light">Try a different search term</p>
        </div>
      `;
      return;
    }

    const html = `
      <div class="search-results__list">
        <h3 class="search-results__heading">Products</h3>
        <ul class="search-results__items">
          ${results.map(product => {
            const safeUrl = this.sanitizeUrl(product.url);
            const safeImage = this.sanitizeUrl(product.image);
            const escapedTitle = this.escapeHtml(product.title);
            const escapedCategory = this.escapeHtml(product.category);
            return `
            <li>
              <a href="${safeUrl}" class="search-result-item">
                <img src="${safeImage}" alt="${escapedTitle}" class="search-result-item__image" width="60" height="60" loading="lazy">
                <div class="search-result-item__info">
                  <span class="search-result-item__category">${escapedCategory}</span>
                  <span class="search-result-item__title">${this.highlightMatch(product.title, query)}</span>
                  <span class="search-result-item__price">${Utils.formatCurrency(product.price)}</span>
                </div>
              </a>
            </li>
          `;
          }).join('')}
        </ul>
        <a href="/search?q=${encodeURIComponent(query)}" class="search-results__view-all">
          View all results
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 8h8M8 4l4 4-4 4" stroke="currentColor" stroke-width="2"/></svg>
        </a>
      </div>
    `;

    this.resultsContainer.innerHTML = html;

    // Bind result clicks
    const resultItems = this.resultsContainer.querySelectorAll('.search-result-item');
    resultItems.forEach(item => {
      item.addEventListener('click', () => {
        if (typeof this.options.onSelect === 'function') {
          this.options.onSelect(item.href, this);
        }
        this.close();
      });
    });
  }

  /**
   * Show popular searches
   */
  showPopularSearches() {
    if (!this.resultsContainer) return;

    this.resultsContainer.innerHTML = `
      <div class="search-results__popular">
        <h3 class="search-results__heading">Popular Searches</h3>
        <ul class="search-results__tags">
          <li><a href="/search?q=bangles" class="search-results__tag">Bangles</a></li>
          <li><a href="/search?q=necklace" class="search-results__tag">Necklace Sets</a></li>
          <li><a href="/search?q=tikka" class="search-results__tag">Tikka Sets</a></li>
          <li><a href="/search?q=bridal" class="search-results__tag">Bridal</a></li>
          <li><a href="/search?q=earrings" class="search-results__tag">Earrings</a></li>
        </ul>
      </div>
    `;
  }

  /**
   * Highlight matching text
   * @param {string} text - Text to highlight
   * @param {string} query - Search query
   * @returns {string}
   */
  highlightMatch(text, query) {
    const escapedText = this.escapeHtml(text);
    const escapedQuery = this.escapeHtml(query);
    const regex = new RegExp(`(${this.escapeRegex(escapedQuery)})`, 'gi');
    return escapedText.replace(regex, '<mark>$1</mark>');
  }

  /**
   * Escape HTML
   * @param {string} text - Text to escape
   * @returns {string}
   */
  escapeHtml(text) {
    if (text == null) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Escape regex special characters
   * @param {string} text - Text to escape
   * @returns {string}
   */
  escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Sanitize URL to prevent XSS via javascript: or data: URIs
   * @param {string} url - URL to sanitize
   * @returns {string}
   */
  sanitizeUrl(url) {
    if (!url) return '';
    const trimmed = url.trim().toLowerCase();
    if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:') || trimmed.startsWith('vbscript:')) {
      return '';
    }
    return url;
  }

  /**
   * Clear input
   */
  clearInput() {
    this.input.value = '';
    if (this.clearBtn) this.clearBtn.hidden = true;
    this.showPopularSearches();
    this.input.focus();
  }

  /**
   * Open search modal
   */
  open() {
    console.log('🔍 Search open() called, modal:', this.modal, 'isOpen:', this.isOpen);
    if (!this.modal || this.isOpen) return;

    this.modal.setAttribute('aria-hidden', 'false');
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
    console.log('🔍 Search modal opened');

    // Focus input
    setTimeout(() => {
      this.input.focus();
    }, 100);

    // Focus trap
    this.focusTrap = Utils.trapFocus(this.modal);
  }

  /**
   * Close search modal
   */
  close() {
    if (!this.modal || !this.isOpen) return;

    this.modal.setAttribute('aria-hidden', 'true');
    this.isOpen = false;
    document.body.style.overflow = '';

    // Clear input
    this.input.value = '';
    if (this.clearBtn) this.clearBtn.hidden = true;
    this.showPopularSearches();

    // Release focus trap
    if (this.focusTrap) {
      this.focusTrap();
      this.focusTrap = null;
    }
  }

  /**
   * Toggle search modal
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
}

/**
 * =====================================================
 * SearchBar Class - Inline Search Bar Below Navbar
 * =====================================================
 */
export class SearchBar {
  /**
   * Create SearchBar instance
   * @param {Object} options - SearchBar options
   */
  constructor(options = {}) {
    this.options = {
      formSelector: '[data-searchbar-form]',
      inputSelector: '[data-searchbar-input]',
      clearSelector: '[data-searchbar-clear]',
      suggestionsSelector: '[data-searchbar-suggestions]',
      resultsSelector: '[data-searchbar-results]',
      minChars: Config?.search?.minChars || 2,
      debounceTime: Config?.search?.debounceTime || 300,
      maxResults: Config?.search?.maxResults || 6,
      ...options
    };

    this.form = document.querySelector(this.options.formSelector);
    this.input = document.querySelector(this.options.inputSelector);
    this.clearBtn = document.querySelector(this.options.clearSelector);
    this.suggestionsDropdown = document.querySelector(this.options.suggestionsSelector);
    this.resultsContainer = document.querySelector(this.options.resultsSelector);

    this.isOpen = false;

    if (this.form && this.input) {
      this.init();
      console.log('✅ SearchBar initialized successfully');
    } else {
      console.log('ℹ️ SearchBar elements not found - skipping initialization');
    }
  }

  /**
   * Initialize SearchBar
   */
  init() {
    this.bindEvents();
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Input events
    this.input.addEventListener('input', Utils.debounce((e) => {
      this.handleInput(e.target.value);
    }, this.options.debounceTime));

    // Focus events - show suggestions
    this.input.addEventListener('focus', () => {
      this.showSuggestions();
    });

    // Click outside to close suggestions
    document.addEventListener('click', (e) => {
      if (!this.form.contains(e.target)) {
        this.hideSuggestions();
      }
    });

    // Keyboard navigation
    this.input.addEventListener('keydown', (e) => {
      this.handleKeydown(e);
    });

    // Clear button
    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', () => {
        this.clearInput();
      });
    }

    // Form submit
    this.form.addEventListener('submit', (e) => {
      const query = this.input.value.trim();
      if (!query) {
        e.preventDefault();
        this.input.focus();
      }
    });

    // Escape key to close suggestions
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.hideSuggestions();
        this.input.blur();
      }
    });
  }

  /**
   * Handle input changes
   * @param {string} query - Search query
   */
  handleInput(query) {
    const trimmedQuery = query.trim();

    // Update clear button visibility
    if (this.clearBtn) {
      this.clearBtn.hidden = trimmedQuery.length === 0;
    }

    if (trimmedQuery.length < this.options.minChars) {
      this.clearResults();
      return;
    }

    this.performSearch(trimmedQuery);
  }

  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} e
   */
  handleKeydown(e) {
    const results = this.resultsContainer?.querySelectorAll('.search-bar__result-item');
    if (!results || results.length === 0) return;

    const currentIndex = Array.from(results).findIndex(r => r.classList.contains('is-focused'));

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.focusResult(results, currentIndex + 1);
        break;

      case 'ArrowUp':
        e.preventDefault();
        this.focusResult(results, currentIndex - 1);
        break;

      case 'Enter':
        if (currentIndex > -1) {
          e.preventDefault();
          const link = results[currentIndex].querySelector('a');
          if (link) link.click();
        }
        break;
    }
  }

  /**
   * Focus search result
   * @param {NodeList} results - Result elements
   * @param {number} index - Index to focus
   */
  focusResult(results, index) {
    results.forEach(r => r.classList.remove('is-focused'));

    if (index < 0) index = results.length - 1;
    if (index >= results.length) index = 0;

    results[index].classList.add('is-focused');
    results[index].scrollIntoView({ block: 'nearest' });
  }

  /**
   * Show suggestions dropdown
   */
  showSuggestions() {
    if (this.suggestionsDropdown) {
      this.suggestionsDropdown.hidden = false;
      this.isOpen = true;
    }
  }

  /**
   * Hide suggestions dropdown
   */
  hideSuggestions() {
    if (this.suggestionsDropdown) {
      this.suggestionsDropdown.hidden = true;
      this.isOpen = false;
    }
  }

  /**
   * Perform search
   * @param {string} query - Search query
   */
  performSearch(query) {
    this.showLoading();

    // Simulate API call (replace with actual API)
    setTimeout(() => {
      const results = this.getMockResults(query);
      this.renderResults(results, query);
    }, 300);
  }

  /**
   * Get mock search results
   * @param {string} query - Search query
   * @returns {Array} Mock results
   */
  getMockResults(query) {
    const products = [
      { id: 1, title: 'Kundan Bridal Necklace Set', price: 15999, image: 'https://chandnijewellery.com.au/cdn/shop/files/Kalyani_White.jpg?width=200', url: '/pages/product.html?id=1' },
      { id: 2, title: 'Gold Plated Bangles Set', price: 4999, image: 'https://chandnijewellery.com.au/cdn/shop/files/Kalyani_White.jpg?width=200', url: '/pages/product.html?id=2' },
      { id: 3, title: 'Pearl Tikka Set', price: 2999, image: 'https://chandnijewellery.com.au/cdn/shop/files/Kalyani_White.jpg?width=200', url: '/pages/product.html?id=3' },
      { id: 4, title: 'Diamond Jhumka Earrings', price: 8999, image: 'https://chandnijewellery.com.au/cdn/shop/files/Kalyani_White.jpg?width=200', url: '/pages/product.html?id=4' },
      { id: 5, title: 'Bridal Choker Set', price: 25999, image: 'https://chandnijewellery.com.au/cdn/shop/files/Kalyani_White.jpg?width=200', url: '/pages/product.html?id=5' },
      { id: 6, title: 'Silver Payal Set', price: 3499, image: 'https://chandnijewellery.com.au/cdn/shop/files/Kalyani_White.jpg?width=200', url: '/pages/product.html?id=6' }
    ];

    const lowerQuery = query.toLowerCase();
    return products.filter(p => 
      p.title.toLowerCase().includes(lowerQuery)
    ).slice(0, this.options.maxResults);
  }

  /**
   * Show loading state
   */
  showLoading() {
    if (this.resultsContainer) {
      this.resultsContainer.innerHTML = `
        <div class="search-bar__loading">
          <div class="search-bar__loading-spinner"></div>
        </div>
      `;
    }
  }

  /**
   * Render search results
   * @param {Array} results - Search results
   * @param {string} query - Search query
   */
  renderResults(results, query) {
    if (!this.resultsContainer) return;

    if (results.length === 0) {
      this.resultsContainer.innerHTML = `
        <div class="search-bar__no-results">
          <p>No results found for "<strong>${this.escapeHtml(query)}</strong>"</p>
        </div>
      `;
      return;
    }

    const html = results.map(product => {
      const safeUrl = this.sanitizeUrl(product.url);
      const safeImage = this.sanitizeUrl(product.image);
      const escapedTitle = this.escapeHtml(product.title);
      return `
      <a href="${safeUrl}" class="search-bar__result-item">
        <img src="${safeImage}" alt="${escapedTitle}" class="search-bar__result-image" loading="lazy">
        <div class="search-bar__result-info">
          <div class="search-bar__result-title">${this.highlightMatch(product.title, query)}</div>
          <div class="search-bar__result-price">PKR ${product.price.toLocaleString()}</div>
        </div>
      </a>
    `;
    }).join('');

    this.resultsContainer.innerHTML = html;
  }

  /**
   * Highlight matching text
   * @param {string} text - Text to highlight
   * @param {string} query - Query to match
   * @returns {string} HTML with highlighted matches
   */
  highlightMatch(text, query) {
    if (!query) return this.escapeHtml(text);
    const escapedText = this.escapeHtml(text);
    const escapedQuery = this.escapeHtml(query);
    const regex = new RegExp(`(${this.escapeRegex(escapedQuery)})`, 'gi');
    return escapedText.replace(regex, '<mark>$1</mark>');
  }

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string}
   */
  escapeHtml(text) {
    if (text == null) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Escape regex special characters
   * @param {string} text - Text to escape
   * @returns {string}
   */
  escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Sanitize URL to prevent XSS
   * @param {string} url - URL to sanitize
   * @returns {string}
   */
  sanitizeUrl(url) {
    if (!url) return '';
    const trimmed = url.trim().toLowerCase();
    if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:') || trimmed.startsWith('vbscript:')) {
      return '';
    }
    return url;
  }

  /**
   * Clear search results
   */
  clearResults() {
    if (this.resultsContainer) {
      this.resultsContainer.innerHTML = '';
    }
  }

  /**
   * Clear input
   */
  clearInput() {
    this.input.value = '';
    if (this.clearBtn) this.clearBtn.hidden = true;
    this.clearResults();
    this.input.focus();
  }
}

// Export default
export default Search;