/**
 * =====================================================
 * CHANDNI JEWELLERY - Carousel Component
 * =====================================================
 */


export class Carousel {
  /**
   * Create a carousel
   * @param {Object} options - Carousel options
   */
  constructor(options = {}) {
    this.options = {
      container: null,
      slideSelector: '.slide',
      dotSelector: null,
      prevSelector: null,
      nextSelector: null,
      autoplay: true,
      autoplayInterval: 5000,
      pauseOnHover: true,
      loop: true,
      onChange: null,
      ...options
    };

    this.container = typeof this.options.container === 'string' 
      ? document.querySelector(this.options.container) 
      : this.options.container;

    if (!this.container) return;

    this.slides = this.container.querySelectorAll(this.options.slideSelector);
    this.dots = this.options.dotSelector ? this.container.querySelectorAll(this.options.dotSelector) : [];
    this.prevBtn = this.options.prevSelector ? this.container.querySelector(this.options.prevSelector) : null;
    this.nextBtn = this.options.nextSelector ? this.container.querySelector(this.options.nextSelector) : null;

    this.currentIndex = 0;
    this.autoplayTimer = null;
    this.isPlaying = false;
    this.isPaused = false; // Track temporary pause state

    // Store bound event handlers for cleanup
    this.boundHandlers = {
      prev: () => this.prev(),
      next: () => this.next(),
      mouseenter: () => this.temporaryPause(),
      mouseleave: () => this.resumeAutoplay(),
      keydown: (e) => this.handleKeydown(e),
      visibilitychange: () => this.handleVisibilityChange(),
      touchstart: null,
      touchend: null
    };

    if (this.slides.length > 0) {
      this.init();
    }
  }

  /**
   * Initialize carousel
   */
  init() {
    // Make container focusable for keyboard navigation if not already
    if (!this.container.hasAttribute('tabindex')) {
      this.container.setAttribute('tabindex', '0');
    }
    
    this.bindEvents();
    this.showSlide(0);

    if (this.options.autoplay) {
      this.startAutoplay();
    }
  }

  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} e
   */
  handleKeydown(e) {
    if (e.key === 'ArrowLeft') {
      this.prev();
    } else if (e.key === 'ArrowRight') {
      this.next();
    }
  }

  /**
   * Handle visibility change
   */
  handleVisibilityChange() {
    if (document.hidden) {
      this.temporaryPause();
    } else {
      this.resumeAutoplay();
    }
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Previous button
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', this.boundHandlers.prev);
    }

    // Next button
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', this.boundHandlers.next);
    }

    // Dot navigation - store handlers for each dot
    this.boundHandlers.dots = [];
    this.dots.forEach((dot, index) => {
      const handler = () => this.goTo(index);
      this.boundHandlers.dots.push(handler);
      dot.addEventListener('click', handler);
    });

    // Pause on hover
    if (this.options.pauseOnHover) {
      this.container.addEventListener('mouseenter', this.boundHandlers.mouseenter);
      this.container.addEventListener('mouseleave', this.boundHandlers.mouseleave);
    }

    // Keyboard navigation
    this.container.addEventListener('keydown', this.boundHandlers.keydown);

    // Touch/swipe support
    this.initTouchEvents();

    // Visibility change (pause when tab is not visible)
    document.addEventListener('visibilitychange', this.boundHandlers.visibilitychange);
  }

  /**
   * Initialize touch events for swipe
   */
  initTouchEvents() {
    let touchStartX = 0;
    const threshold = 50;

    this.boundHandlers.touchstart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    this.boundHandlers.touchend = (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
    };

    this.container.addEventListener('touchstart', this.boundHandlers.touchstart, { passive: true });
    this.container.addEventListener('touchend', this.boundHandlers.touchend, { passive: true });
  }

  /**
   * Show specific slide
   * @param {number} index - Slide index
   */
  showSlide(index) {
    // Handle bounds
    if (this.options.loop) {
      if (index < 0) index = this.slides.length - 1;
      if (index >= this.slides.length) index = 0;
    } else {
      if (index < 0) index = 0;
      if (index >= this.slides.length) index = this.slides.length - 1;
    }

    // Update slides
    this.slides.forEach((slide, i) => {
      const isActive = i === index;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', !isActive);
    });

    // Update dots
    this.dots.forEach((dot, i) => {
      const isActive = i === index;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', isActive);
    });

    // Update buttons
    if (!this.options.loop) {
      if (this.prevBtn) this.prevBtn.disabled = index === 0;
      if (this.nextBtn) this.nextBtn.disabled = index === this.slides.length - 1;
    }

    this.currentIndex = index;

    // Callback
    if (typeof this.options.onChange === 'function') {
      this.options.onChange(index, this.slides[index]);
    }
  }

  /**
   * Go to specific slide
   * @param {number} index - Slide index
   */
  goTo(index) {
    this.showSlide(index);
    this.resetAutoplay();
  }

  /**
   * Go to next slide
   */
  next() {
    this.showSlide(this.currentIndex + 1);
    this.resetAutoplay();
  }

  /**
   * Go to previous slide
   */
  prev() {
    this.showSlide(this.currentIndex - 1);
    this.resetAutoplay();
  }

  /**
   * Start autoplay
   */
  startAutoplay() {
    if (this.slides.length <= 1) return;
    this.isPlaying = true;
    this.isPaused = false;
    this.autoplayTimer = setInterval(() => {
      this.showSlide(this.currentIndex + 1);
    }, this.options.autoplayInterval);
  }

  /**
   * Stop autoplay completely
   */
  stopAutoplay() {
    this.isPlaying = false;
    this.isPaused = false;
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  /**
   * Temporarily pause autoplay (can be resumed)
   * Used for hover and visibility change
   */
  temporaryPause() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
      this.isPaused = true;
    }
  }

  /**
   * Resume autoplay after temporary pause
   */
  resumeAutoplay() {
    if (this.isPlaying && this.isPaused && !this.autoplayTimer) {
      this.isPaused = false;
      this.autoplayTimer = setInterval(() => {
        this.showSlide(this.currentIndex + 1);
      }, this.options.autoplayInterval);
    }
  }

  /**
   * Reset autoplay timer
   */
  resetAutoplay() {
    if (this.isPlaying) {
      this.stopAutoplay();
      this.startAutoplay();
    }
  }

  /**
   * Get current slide index
   * @returns {number}
   */
  getCurrentIndex() {
    return this.currentIndex;
  }

  /**
   * Get total slides count
   * @returns {number}
   */
  getCount() {
    return this.slides.length;
  }

  /**
   * Destroy carousel and cleanup all event listeners
   */
  destroy() {
    // Stop autoplay
    this.stopAutoplay();

    // Remove previous button listener
    if (this.prevBtn) {
      this.prevBtn.removeEventListener('click', this.boundHandlers.prev);
    }

    // Remove next button listener
    if (this.nextBtn) {
      this.nextBtn.removeEventListener('click', this.boundHandlers.next);
    }

    // Remove dot listeners
    if (this.boundHandlers.dots) {
      this.dots.forEach((dot, index) => {
        dot.removeEventListener('click', this.boundHandlers.dots[index]);
      });
    }

    // Remove hover listeners
    if (this.options.pauseOnHover) {
      this.container.removeEventListener('mouseenter', this.boundHandlers.mouseenter);
      this.container.removeEventListener('mouseleave', this.boundHandlers.mouseleave);
    }

    // Remove keyboard listener
    this.container.removeEventListener('keydown', this.boundHandlers.keydown);

    // Remove touch listeners
    if (this.boundHandlers.touchstart) {
      this.container.removeEventListener('touchstart', this.boundHandlers.touchstart);
    }
    if (this.boundHandlers.touchend) {
      this.container.removeEventListener('touchend', this.boundHandlers.touchend);
    }

    // Remove visibility change listener from document
    document.removeEventListener('visibilitychange', this.boundHandlers.visibilitychange);

    // Clear references
    this.boundHandlers = null;
  }
}

// Export default
export default Carousel;