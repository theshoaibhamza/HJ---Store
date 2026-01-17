/**
 * =====================================================
 * CHANDNI JEWELLERY - Navigation Feature
 * =====================================================
 */

import { Utils } from '../core/utils.js';

export class Navigation {
  /**
   * Create navigation instance
   * @param {Object} options - Navigation options
   */
  constructor(options = {}) {
    this.options = {
      mobileMenuSelector: '#mobileMenu',
      mobileToggleSelector: '[data-mobile-menu-toggle]',
      mobileCloseSelector: '[data-mobile-menu-close]',
      submenuToggleSelector: '[data-submenu-toggle]',
      headerSelector: '#siteHeader',
      scrollThreshold: 100,
      hideOnScroll: false,
      ...options
    };

    this.mobileMenu = document.querySelector(this.options.mobileMenuSelector);
    this.mobileToggle = document.querySelector(this.options.mobileToggleSelector);
    this.header = document.querySelector(this.options.headerSelector);

    this.isMobileMenuOpen = false;
    this.lastScrollY = 0;
    this.focusTrap = null;

    // Bound handlers for cleanup
    this._boundHandlers = {
      onEscapeKey: this._handleEscapeKey.bind(this),
      onResize: Utils.debounce(this._handleResize.bind(this), 250)
    };

    this.init();
  }

  /**
   * Handle escape key press
   * @param {KeyboardEvent} e
   * @private
   */
  _handleEscapeKey(e) {
    if (e.key === 'Escape' && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  /**
   * Handle window resize
   * @private
   */
  _handleResize() {
    if (window.innerWidth >= 1024 && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  /**
   * Initialize navigation
   */
  init() {
    this.bindMobileMenuEvents();
    this.bindSubmenuEvents();
    this.bindDesktopDropdowns();
  }

  /**
   * Bind mobile menu events
   */
  bindMobileMenuEvents() {
    // Toggle button
    if (this.mobileToggle) {
      this.mobileToggle.addEventListener('click', () => {
        this.toggleMobileMenu();
      });
    }

    // Close buttons
    if (this.mobileMenu) {
      const closeButtons = this.mobileMenu.querySelectorAll(this.options.mobileCloseSelector);
      closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          this.closeMobileMenu();
        });
      });

      // Overlay close
      const overlay = this.mobileMenu.querySelector('.mobile-menu__overlay');
      if (overlay) {
        overlay.addEventListener('click', () => {
          this.closeMobileMenu();
        });
      }
    }

    // Escape key
    document.addEventListener('keydown', this._boundHandlers.onEscapeKey);

    // Close on resize to desktop
    window.addEventListener('resize', this._boundHandlers.onResize);
  }

  /**
   * Bind submenu toggle events
   */
  bindSubmenuEvents() {
    if (!this.mobileMenu) return;

    const submenuToggles = this.mobileMenu.querySelectorAll(this.options.submenuToggleSelector);
    
    submenuToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        const submenuId = toggle.getAttribute('aria-controls');
        const submenu = submenuId ? document.getElementById(submenuId) : toggle.nextElementSibling;
        
        // Close other submenus
        submenuToggles.forEach(otherToggle => {
          if (otherToggle !== toggle) {
            otherToggle.setAttribute('aria-expanded', 'false');
            const otherSubmenuId = otherToggle.getAttribute('aria-controls');
            const otherSubmenu = otherSubmenuId ? document.getElementById(otherSubmenuId) : otherToggle.nextElementSibling;
            if (otherSubmenu) {
              otherSubmenu.setAttribute('aria-hidden', 'true');
            }
          }
        });

        // Toggle current submenu
        toggle.setAttribute('aria-expanded', !isExpanded);
        if (submenu) {
          submenu.setAttribute('aria-hidden', isExpanded);
        }
      });
    });
  }

  /**
   * Bind desktop dropdown events
   */
  bindDesktopDropdowns() {
    const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');

    dropdownItems.forEach(item => {
      const link = item.querySelector('.nav-link');
      const dropdown = item.querySelector('.dropdown-menu');

      if (!link || !dropdown) return;

      // Mouse events
      item.addEventListener('mouseenter', () => {
        this.openDropdown(item, link);
      });

      item.addEventListener('mouseleave', () => {
        this.closeDropdown(item, link);
      });

      // Keyboard events
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault();
          this.openDropdown(item, link);
          this.focusFirstDropdownItem(dropdown);
        }
      });

      // Handle dropdown keyboard navigation (including Escape)
      dropdown.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeDropdown(item, link);
          link.focus();
          return;
        }
        this.handleDropdownKeydown(e, dropdown, item, link);
      });
    });
  }

  /**
   * Handle dropdown keyboard navigation
   * @param {KeyboardEvent} e
   * @param {Element} dropdown
   * @param {Element} item
   * @param {Element} link
   */
  handleDropdownKeydown(e, dropdown, item, link) {
    const links = Array.from(dropdown.querySelectorAll('.dropdown-menu__link'));
    const currentIndex = links.indexOf(document.activeElement);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % links.length;
        links[nextIndex]?.focus();
        break;

      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + links.length) % links.length;
        links[prevIndex]?.focus();
        break;

      case 'Tab':
        // Close dropdown when tabbing out
        if (!e.shiftKey && currentIndex === links.length - 1) {
          this.closeDropdown(item, link);
        } else if (e.shiftKey && currentIndex === 0) {
          this.closeDropdown(item, link);
        }
        break;
    }
  }

  /**
   * Open dropdown
   * @param {Element} item - Nav item
   * @param {Element} link - Nav link
   */
  openDropdown(item, link) {
    item.classList.add('is-open');
    link.setAttribute('aria-expanded', 'true');
  }

  /**
   * Close dropdown
   * @param {Element} item - Nav item
   * @param {Element} link - Nav link
   */
  closeDropdown(item, link) {
    item.classList.remove('is-open');
    link.setAttribute('aria-expanded', 'false');
  }

  /**
   * Focus first dropdown item
   * @param {Element} dropdown
   */
  focusFirstDropdownItem(dropdown) {
    const firstLink = dropdown.querySelector('.dropdown-menu__link');
    if (firstLink) {
      requestAnimationFrame(() => firstLink.focus());
    }
  }

  /**
   * Open mobile menu
   */
  openMobileMenu() {
    if (!this.mobileMenu || this.isMobileMenuOpen) return;

    this.isMobileMenuOpen = true;
    this.mobileMenu.classList.add('is-open');
    this.mobileToggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    // Focus trap
    this.focusTrap = Utils.trapFocus(this.mobileMenu);

    // Dispatch event
    document.dispatchEvent(new CustomEvent('navigation:mobile-open'));
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu() {
    if (!this.mobileMenu || !this.isMobileMenuOpen) return;

    this.isMobileMenuOpen = false;
    this.mobileMenu.classList.remove('is-open');
    this.mobileToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';

    // Close all submenus
    const submenuToggles = this.mobileMenu.querySelectorAll(this.options.submenuToggleSelector);
    submenuToggles.forEach(toggle => {
      toggle.setAttribute('aria-expanded', 'false');
      const submenuId = toggle.getAttribute('aria-controls');
      const submenu = submenuId ? document.getElementById(submenuId) : toggle.nextElementSibling;
      if (submenu) {
        submenu.setAttribute('aria-hidden', 'true');
      }
    });

    // Release focus trap
    if (this.focusTrap) {
      this.focusTrap();
      this.focusTrap = null;
    }

    // Return focus to toggle
    this.mobileToggle?.focus();

    // Dispatch event
    document.dispatchEvent(new CustomEvent('navigation:mobile-close'));
  }

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu() {
    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  /**
   * Check if mobile menu is open
   * @returns {boolean}
   */
  isOpen() {
    return this.isMobileMenuOpen;
  }

  /**
   * Cleanup and destroy instance
   * Removes global event listeners to prevent memory leaks
   */
  destroy() {
    // Remove document/window level event listeners
    document.removeEventListener('keydown', this._boundHandlers.onEscapeKey);
    window.removeEventListener('resize', this._boundHandlers.onResize);

    // Release focus trap if active
    if (this.focusTrap) {
      this.focusTrap();
      this.focusTrap = null;
    }

    // Clear references
    this._boundHandlers = null;
    this.mobileMenu = null;
    this.mobileToggle = null;
    this.header = null;
  }
}

// Export default
export default Navigation;