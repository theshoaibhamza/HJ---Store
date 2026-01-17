/**
 * =====================================================
 * CHANDNI JEWELLERY - Dropdown Component
 * =====================================================
 */


export class Dropdown {
  /**
   * Create a dropdown
   * @param {Object} options - Dropdown options
   */
  constructor(options = {}) {
    this.options = {
      container: null,
      toggleSelector: '[data-dropdown-toggle]',
      menuSelector: '[data-dropdown-menu]',
      closeOnOutsideClick: true,
      closeOnEscape: true,
      closeOnSelect: true,
      onOpen: null,
      onClose: null,
      onSelect: null,
      ...options
    };

    this.container = typeof this.options.container === 'string'
      ? document.querySelector(this.options.container)
      : this.options.container;

    if (!this.container) return;

    this.toggle = this.container.querySelector(this.options.toggleSelector);
    this.menu = this.container.querySelector(this.options.menuSelector);

    if (!this.toggle || !this.menu) return;

    this.isOpen = false;

    // Store bound event handlers for cleanup
    this.boundHandlers = {
      toggleClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleDropdown();
      },
      outsideClick: (e) => {
        if (this.isOpen && !this.container.contains(e.target)) {
          this.close();
        }
      },
      escapeKey: (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
          this.toggle.focus();
        }
      },
      menuClick: (e) => {
        const option = e.target.closest('[data-value], button, a');
        if (option) {
          if (typeof this.options.onSelect === 'function') {
            this.options.onSelect(option, this);
          }
          this.close();
        }
      },
      toggleKeydown: (e) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.open();
          this.focusFirstItem();
        }
      },
      menuKeydown: (e) => this.handleMenuKeydown(e)
    };

    this.init();
  }

  /**
   * Initialize dropdown
   */
  init() {
    // Set initial aria-hidden state
    this.menu.setAttribute('aria-hidden', 'true');
    
    this.bindEvents();
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Toggle button
    this.toggle.addEventListener('click', this.boundHandlers.toggleClick);

    // Close on outside click
    if (this.options.closeOnOutsideClick) {
      document.addEventListener('click', this.boundHandlers.outsideClick);
    }

    // Close on escape
    if (this.options.closeOnEscape) {
      document.addEventListener('keydown', this.boundHandlers.escapeKey);
    }

    // Close on select
    if (this.options.closeOnSelect) {
      this.menu.addEventListener('click', this.boundHandlers.menuClick);
    }

    // Keyboard navigation
    this.toggle.addEventListener('keydown', this.boundHandlers.toggleKeydown);
    this.menu.addEventListener('keydown', this.boundHandlers.menuKeydown);
  }

  /**
   * Handle menu keyboard navigation
   * @param {KeyboardEvent} e
   */
  handleMenuKeydown(e) {
    const items = Array.from(this.menu.querySelectorAll('button, a, [tabindex]:not([tabindex="-1"])'));
    
    // Guard against empty items array
    if (items.length === 0) return;
    
    const currentIndex = items.indexOf(document.activeElement);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        // If currentIndex is -1, start from first item
        const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % items.length;
        items[nextIndex]?.focus();
        break;

      case 'ArrowUp':
        e.preventDefault();
        // If currentIndex is -1, start from last item
        const prevIndex = currentIndex === -1 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length;
        items[prevIndex]?.focus();
        break;

      case 'Home':
        e.preventDefault();
        items[0]?.focus();
        break;

      case 'End':
        e.preventDefault();
        items[items.length - 1]?.focus();
        break;

      case 'Tab':
        this.close();
        break;
    }
  }

  /**
   * Focus first menu item
   */
  focusFirstItem() {
    const firstItem = this.menu.querySelector('button, a, [tabindex]:not([tabindex="-1"])');
    if (firstItem) {
      setTimeout(() => firstItem.focus(), 0);
    }
  }

  /**
   * Open dropdown
   */
  open() {
    if (this.isOpen) return;

    this.isOpen = true;
    this.toggle.setAttribute('aria-expanded', 'true');
    this.menu.setAttribute('aria-hidden', 'false');
    this.container.classList.add('is-open');

    if (typeof this.options.onOpen === 'function') {
      this.options.onOpen(this);
    }
  }

  /**
   * Close dropdown
   */
  close() {
    if (!this.isOpen) return;

    this.isOpen = false;
    this.toggle.setAttribute('aria-expanded', 'false');
    this.menu.setAttribute('aria-hidden', 'true');
    this.container.classList.remove('is-open');

    if (typeof this.options.onClose === 'function') {
      this.options.onClose(this);
    }
  }

  /**
   * Toggle dropdown
   */
  toggleDropdown() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Destroy dropdown and cleanup all event listeners
   */
  destroy() {
    // Remove toggle listeners
    this.toggle.removeEventListener('click', this.boundHandlers.toggleClick);
    this.toggle.removeEventListener('keydown', this.boundHandlers.toggleKeydown);

    // Remove menu listeners
    this.menu.removeEventListener('keydown', this.boundHandlers.menuKeydown);
    if (this.options.closeOnSelect) {
      this.menu.removeEventListener('click', this.boundHandlers.menuClick);
    }

    // Remove document-level listeners
    if (this.options.closeOnOutsideClick) {
      document.removeEventListener('click', this.boundHandlers.outsideClick);
    }
    if (this.options.closeOnEscape) {
      document.removeEventListener('keydown', this.boundHandlers.escapeKey);
    }

    // Clear references
    this.boundHandlers = null;
  }
}

// Export default
export default Dropdown;