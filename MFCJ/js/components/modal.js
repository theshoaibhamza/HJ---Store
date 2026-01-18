/**
 * =====================================================
 * CHANDNI JEWELLERY - Modal Component
 * =====================================================
 */

import { Utils } from '../core/utils.js';

export class Modal {
  /**
   * Create a modal
   * @param {Object} options - Modal options
   */
  constructor(options = {}) {
    this.options = {
      selector: null,
      openSelector: null,
      closeSelector: '[data-modal-close]',
      overlayClose: true,
      escapeClose: true,
      onOpen: null,
      onClose: null,
      ...options
    };

    this.modal = typeof this.options.selector === 'string'
      ? document.querySelector(this.options.selector)
      : this.options.selector;

    if (!this.modal) return;

    this.isOpen = false;
    this.previousActiveElement = null;
    this.focusTrap = null;

    // Store bound event handlers for cleanup
    this.boundHandlers = {
      escapeKey: (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      },
      overlayClick: () => this.close(),
      openClick: (e) => {
        e.preventDefault();
        this.open();
      },
      closeClick: (e) => {
        e.preventDefault();
        this.close();
      }
    };

    // Store references to button elements for cleanup
    this.openButtons = [];
    this.closeButtons = [];
    this.overlay = null;

    this.init();
  }

  /**
   * Initialize modal
   */
  init() {
    this.bindEvents();
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Open triggers
    if (this.options.openSelector) {
      this.openButtons = Array.from(document.querySelectorAll(this.options.openSelector));
      this.openButtons.forEach(btn => {
        btn.addEventListener('click', this.boundHandlers.openClick);
      });
    }

    // Close triggers
    this.closeButtons = Array.from(this.modal.querySelectorAll(this.options.closeSelector));
    this.closeButtons.forEach(btn => {
      btn.addEventListener('click', this.boundHandlers.closeClick);
    });

    // Overlay close
    if (this.options.overlayClose) {
      this.overlay = this.modal.querySelector('.modal__overlay, .drawer__overlay');
      if (this.overlay) {
        this.overlay.addEventListener('click', this.boundHandlers.overlayClick);
      }
    }

    // Escape key close
    if (this.options.escapeClose) {
      document.addEventListener('keydown', this.boundHandlers.escapeKey);
    }
  }

  /**
   * Open modal
   * @param {Object} data - Optional data to pass to modal
   */
  open(data = null) {
    if (this.isOpen) return;

    // Store current active element
    this.previousActiveElement = document.activeElement;

    // Show modal
    this.modal.setAttribute('aria-hidden', 'false');
    this.isOpen = true;

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = this.getScrollbarWidth() + 'px';

    // Trap focus
    this.focusTrap = Utils.trapFocus(this.modal);

    // Callback
    if (typeof this.options.onOpen === 'function') {
      this.options.onOpen(this, data);
    }

    // Dispatch event
    this.modal.dispatchEvent(new CustomEvent('modal:open', { detail: { modal: this, data } }));
  }

  /**
   * Close modal
   */
  close() {
    if (!this.isOpen) return;

    // Hide modal
    this.modal.setAttribute('aria-hidden', 'true');
    this.isOpen = false;

    // Restore body scroll
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';

    // Release focus trap
    if (this.focusTrap) {
      this.focusTrap();
      this.focusTrap = null;
    }

    // Restore focus
    if (this.previousActiveElement) {
      const isInDocument = (typeof this.previousActiveElement.isConnected === 'boolean'
        ? this.previousActiveElement.isConnected
        : document.contains(this.previousActiveElement));
      if (isInDocument && typeof this.previousActiveElement.focus === 'function') {
        try {
          this.previousActiveElement.focus();
        } catch (e) {
          // Ignore focus errors
        }
      }
    }

    // Callback
    if (typeof this.options.onClose === 'function') {
      this.options.onClose(this);
    }

    // Dispatch event
    this.modal.dispatchEvent(new CustomEvent('modal:close', { detail: { modal: this } }));
  }

  /**
   * Toggle modal
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Get scrollbar width
   * @returns {number}
   */
  getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  /**
   * Update modal content
   * WARNING: This method uses innerHTML. Caller is responsible for sanitizing
   * any user-generated content to prevent XSS attacks. For plain text, use
   * setTextContent() instead.
   * @param {string} content - HTML content (must be sanitized if from user input)
   */
  setContent(content) {
    const body = this.modal.querySelector('.modal__body, .drawer__body');
    if (body) {
      body.innerHTML = content;
    }
  }

  /**
   * Update modal content with plain text (XSS-safe)
   * @param {string} text - Plain text content
   */
  setTextContent(text) {
    const body = this.modal.querySelector('.modal__body, .drawer__body');
    if (body) {
      body.textContent = text;
    }
  }

  /**
   * Destroy modal and cleanup all event listeners
   */
  destroy() {
    // Close modal only if currently open (to restore body scroll/focus)
    if (this.isOpen) {
      this.close();
    }

    // Always remove event listeners regardless of modal state
    // Remove document-level keydown listener
    if (this.options.escapeClose) {
      document.removeEventListener('keydown', this.boundHandlers.escapeKey);
    }

    // Remove click handlers from open trigger buttons
    this.openButtons.forEach(btn => {
      btn.removeEventListener('click', this.boundHandlers.openClick);
    });
    this.openButtons = [];

    // Remove click handlers from close trigger buttons
    this.closeButtons.forEach(btn => {
      btn.removeEventListener('click', this.boundHandlers.closeClick);
    });
    this.closeButtons = [];

    // Remove overlay click handler
    if (this.overlay) {
      this.overlay.removeEventListener('click', this.boundHandlers.overlayClick);
      this.overlay = null;
    }

  }
}

// Export default
export default Modal;