/**
 * =====================================================
 * CHANDNI JEWELLERY - Currency Feature
 * =====================================================
 */

import { Utils } from '../core/utils.js';
import { Config } from '../core/config.js';

export class Currency {
  /**
   * Create currency selector instance
   * @param {Object} options - Currency options
   */
  constructor(options = {}) {
    this.options = {
      selectorContainer: '[data-currency-selector]',
      toggleSelector: '[data-currency-toggle]',
      dropdownSelector: '[data-currency-dropdown]',
      optionSelector: '.currency-selector__option',
      searchSelector: '[data-currency-search]',
      flagSelector: '[data-currency-flag]',
      codeSelector: '[data-currency-code]',
      storageKey: Config.storageKeys.currency,
      currencies: Config.currencies,
      defaultCurrency: Config.currency.code,
      onChange: null,
      ...options
    };

    this.container = document.querySelector(this.options.selectorContainer);
    
    if (!this.container) return;

    this.toggle = this.container.querySelector(this.options.toggleSelector);
    this.dropdown = this.container.querySelector(this.options.dropdownSelector);
    this.searchInput = this.container.querySelector(this.options.searchSelector);

    this.currentCurrency = null;
    this.isOpen = false;

    // Bound handlers for cleanup
    this._boundHandlers = {
      onOutsideClick: this._handleOutsideClick.bind(this),
      onEscapeKey: this._handleEscapeKey.bind(this)
    };

    this.init();
  }

  /**
   * Handle outside click
   * @param {Event} e
   * @private
   */
  _handleOutsideClick(e) {
    if (this.isOpen && !this.container.contains(e.target)) {
      this.closeDropdown();
    }
  }

  /**
   * Handle escape key
   * @param {KeyboardEvent} e
   * @private
   */
  _handleEscapeKey(e) {
    if (e.key === 'Escape' && this.isOpen) {
      this.closeDropdown();
      this.toggle?.focus();
    }
  }

  /**
   * Initialize currency selector
   */
  init() {
    this.loadSavedCurrency();
    this.bindEvents();
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Toggle dropdown
    if (this.toggle) {
      this.toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleDropdown();
      });
    }

    // Close on outside click
    document.addEventListener('click', this._boundHandlers.onOutsideClick);

    // Close on escape
    document.addEventListener('keydown', this._boundHandlers.onEscapeKey);

    // Currency options
    const options = this.container.querySelectorAll(this.options.optionSelector);
    options.forEach(option => {
      option.addEventListener('click', () => {
        const currency = option.dataset.currency;
        this.selectCurrency(currency);
        this.closeDropdown();
      });
    });

    // Search functionality
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.filterCurrencies(e.target.value);
      });
    }

    // Keyboard navigation
    if (this.dropdown) {
      this.dropdown.addEventListener('keydown', (e) => {
        this.handleKeydown(e);
      });
    }
  }

  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} e
   */
  handleKeydown(e) {
    const options = Array.from(this.container.querySelectorAll(`${this.options.optionSelector}:not([hidden])`));
    
    // Guard against empty options array
    if (options.length === 0) return;
    
    const currentIndex = options.findIndex(o => o === document.activeElement);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % options.length;
        options[nextIndex]?.focus();
        break;

      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + options.length) % options.length;
        options[prevIndex]?.focus();
        break;

      case 'Enter':
        if (document.activeElement.matches(this.options.optionSelector)) {
          document.activeElement.click();
        }
        break;
    }
  }

  /**
   * Load saved currency from storage
   */
  loadSavedCurrency() {
    const savedCurrency = Utils.storage.get(this.options.storageKey);
    const currency = savedCurrency || this.options.defaultCurrency;
    this.selectCurrency(currency, false);
  }

  /**
   * Select currency
   * @param {string} currencyCode - Currency code
   * @param {boolean} save - Whether to save to storage
   */
  selectCurrency(currencyCode, save = true) {
    const currency = this.options.currencies.find(c => c.code === currencyCode);
    if (!currency) return;

    this.currentCurrency = currency;

    // Update toggle display
    this.updateToggleDisplay(currency);

    // Update option states
    this.updateOptionStates(currencyCode);

    // Save to storage
    if (save) {
      Utils.storage.set(this.options.storageKey, currencyCode);
    }

    // Update prices on page (in real app, would convert prices)
    this.updatePrices(currency);

    // Callback
    if (typeof this.options.onChange === 'function') {
      this.options.onChange(currency, this);
    }

    // Dispatch event
    document.dispatchEvent(new CustomEvent('currency:changed', {
      detail: { currency }
    }));
  }

  /**
   * Update toggle button display
   * @param {Object} currency - Currency object
   */
  updateToggleDisplay(currency) {
    const flagEl = this.toggle?.querySelector(this.options.flagSelector);
    const codeEl = this.toggle?.querySelector(this.options.codeSelector);

    if (flagEl) {
      flagEl.src = `https://cdn.shopify.com/static/images/flags/${currency.flag}.svg`;
      flagEl.alt = currency.country;
    }

    if (codeEl) {
      codeEl.textContent = `${currency.code} ${currency.symbol}`;
    }
  }

  /**
   * Update option selected states
   * @param {string} selectedCode - Selected currency code
   */
  updateOptionStates(selectedCode) {
    const options = this.container.querySelectorAll(this.options.optionSelector);
    options.forEach(option => {
      const isSelected = option.dataset.currency === selectedCode;
      option.classList.toggle('is-selected', isSelected);
      option.setAttribute('aria-selected', isSelected);
    });
  }

  /**
   * Update prices on page
   * @param {Object} currency - Currency object
   */
  updatePrices(currency) {
    // In a real implementation, this would: 
    // 1. Fetch exchange rates
    // 2. Convert all prices on the page
    // 3. Update the display

    // For demo, just log the change
    console.log(`Currency changed to: ${currency.code} (${currency.symbol})`);

    // Update data attribute on body for CSS/JS hooks
    document.body.dataset.currency = currency.code;
  }

  /**
   * Filter currencies by search query
   * @param {string} query - Search query
   */
  filterCurrencies(query) {
    const options = this.container.querySelectorAll(this.options.optionSelector);
    const lowerQuery = query.toLowerCase().trim();

    options.forEach(option => {
      const country = option.dataset.country?.toLowerCase() || '';
      const currency = option.dataset.currency?.toLowerCase() || '';
      const matches = country.includes(lowerQuery) || currency.includes(lowerQuery);
      option.hidden = !matches;
    });
  }

  /**
   * Open dropdown
   */
  openDropdown() {
    if (this.isOpen) return;

    this.isOpen = true;
    this.toggle?.setAttribute('aria-expanded', 'true');
    this.container.classList.add('is-open');
    this.dropdown?.classList.add('is-active');

    // Clear and focus search
    if (this.searchInput) {
      this.searchInput.value = '';
      this.filterCurrencies('');
      this.searchInput.focus();
    }
  }

  /**
   * Close dropdown
   */
  closeDropdown() {
    if (!this.isOpen) return;

    this.isOpen = false;
    this.toggle?.setAttribute('aria-expanded', 'false');
    this.container.classList.remove('is-open');
    this.dropdown?.classList.remove('is-active');
  }

  /**
   * Toggle dropdown
   */
  toggleDropdown() {
    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  /**
   * Get current currency
   * @returns {Object}
   */
  getCurrentCurrency() {
    return this.currentCurrency;
  }

  /**
   * Format price in current currency
   * @param {number} amount - Amount to format
   * @returns {string}
   */
  formatPrice(amount) {
    if (!this.currentCurrency) return amount.toString();
    return Utils.formatCurrency(amount, this.currentCurrency.code, this.currentCurrency.locale);
  }

  /**
   * Cleanup and destroy instance
   * Removes document-level event listeners to prevent memory leaks
   */
  destroy() {
    // Remove document-level event listeners
    document.removeEventListener('click', this._boundHandlers.onOutsideClick);
    document.removeEventListener('keydown', this._boundHandlers.onEscapeKey);

    // Clear references
    this._boundHandlers = null;
    this.container = null;
    this.toggle = null;
    this.dropdown = null;
    this.searchInput = null;
    this.currentCurrency = null;
  }
}

// Export default
export default Currency;