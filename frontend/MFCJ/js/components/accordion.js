/**
 * =====================================================
 * CHANDNI JEWELLERY - Accordion Component
 * =====================================================
 */

export class Accordion {
  /**
   * Create an accordion
   * @param {Object} options - Accordion options
   */
  constructor(options = {}) {
    this.options = {
      items: null,
      itemSelector: '.accordion-item',
      triggerSelector: 'summary, [data-accordion-trigger]',
      contentSelector: '.accordion-content, [data-accordion-content]',
      allowMultiple: false,
      onChange: null,
      ...options
    };

    this.items = this.options.items || document.querySelectorAll(this.options.itemSelector);

    if (this.items.length > 0) {
      this.init();
    }
  }

  /**
   * Initialize accordion
   */
  init() {
    this.bindEvents();
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    this.items.forEach((item, index) => {
      // Handle <details> elements
      if (item.tagName === 'DETAILS') {
        item.addEventListener('toggle', (e) => {
          if (item.open && !this.options.allowMultiple) {
            this.closeOthers(index);
          }

          if (typeof this.options.onChange === 'function') {
            this.options.onChange(index, item.open, item);
          }
        });
      } else {
        // Handle custom accordion markup
        const trigger = item.querySelector(this.options.triggerSelector);
        if (trigger) {
          trigger.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggle(index);
          });

          // Keyboard support
          trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this.toggle(index);
            }
          });
        }
      }
    });
  }

  /**
   * Open item
   * @param {number} index - Item index
   */
  open(index) {
    const item = this.items[index];
    if (!item) return;

    if (item.tagName === 'DETAILS') {
      item.open = true;
    } else {
      const trigger = item.querySelector(this.options.triggerSelector);
      const content = item.querySelector(this.options.contentSelector);

      item.classList.add('is-open');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
      if (content) content.hidden = false;
    }

    if (!this.options.allowMultiple) {
      this.closeOthers(index);
    }

    if (typeof this.options.onChange === 'function') {
      this.options.onChange(index, true, item);
    }
  }

  /**
   * Close item
   * @param {number} index - Item index
   */
  close(index) {
    const item = this.items[index];
    if (!item) return;

    if (item.tagName === 'DETAILS') {
      item.open = false;
    } else {
      const trigger = item.querySelector(this.options.triggerSelector);
      const content = item.querySelector(this.options.contentSelector);

      item.classList.remove('is-open');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      if (content) content.hidden = true;
    }

    if (typeof this.options.onChange === 'function') {
      this.options.onChange(index, false, item);
    }
  }

  /**
   * Toggle item
   * @param {number} index - Item index
   */
  toggle(index) {
    const item = this.items[index];
    if (!item) return;

    const isOpen = item.tagName === 'DETAILS' 
      ? item.open 
      : item.classList.contains('is-open');

    if (isOpen) {
      this.close(index);
    } else {
      this.open(index);
    }
  }

  /**
   * Close all items except one
   * @param {number} exceptIndex - Index to keep open
   */
  closeOthers(exceptIndex) {
    this.items.forEach((item, index) => {
      if (index !== exceptIndex) {
        this.close(index);
      }
    });
  }

  /**
   * Close all items
   */
  closeAll() {
    this.items.forEach((item, index) => {
      this.close(index);
    });
  }

  /**
   * Open all items
   */
  openAll() {
    this.items.forEach((item, index) => {
      this.open(index);
    });
  }
}

// Export default
export default Accordion;