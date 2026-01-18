/**
 * =====================================================
 * CHANDNI JEWELLERY - Main Application
 * =====================================================
 */

// Import modules
import { Utils } from './core/utils.js';
import { Config } from './core/config.js';
import { Carousel } from './components/carousel.js';
import { Modal } from './components/modal.js';
import { Accordion } from './components/accordion.js';
import { Dropdown } from './components/dropdown.js';
import './components/faq.js';
import { Cart } from './features/carts.js';
import { Search, SearchBar } from './features/search.js';
import { Currency } from './features/currency.js';
import { Navigation } from './features/navigation.js';
// Import MVC Components
import { authController } from './controllers/AuthController.js';
import { productController } from './controllers/ProductController.js';
import { cartModel } from './models/CartModel.js';
import { productModel } from './models/ProductModel.js';
import { userModel } from './models/UserModel.js';
/**
 * Main Application Class
 */
class App {
  constructor() {
    this.isInitialized = false;
    this.modules = {};
  }

  /**
   * Initialize the application
   */
  init() {
    if (this.isInitialized) return;

    // Wait for DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.bootstrap());
    } else {
      this.bootstrap();
    }
  }

  /**
   * Bootstrap all modules
   */
  bootstrap() {
    console.log('🚀 Chandni Jewellery - Initializing...');

    // Initialize authentication first
    this.initAuthentication();

    // Initialize core modules
    this.initNavigation();
    this.initAnnouncementBar();
    this.initHeroSlideshow();
    this.initProductCarousels();
    this.initFeaturesCarousel();
    this.initFAQ();
    this.initCurrency();
    this.initSearch();
    this.initCart();
    this.initAccountMenu();
    this.initModals();
    this.initCookieBanner();
    this.initScrollReveal();
    this.initHeaderScroll();
    this.initProducts();
    this.initContactForm();
    this.initProductPage();

    // Mark as initialized
    this.isInitialized = true;

    // Hide page loader
    this.hidePageLoader();

    console.log('✅ Chandni Jewellery - Ready!');
  }

  /**
   * Initialize Navigation
   */
  initNavigation() {
    this.modules.navigation = new Navigation({
      mobileMenuSelector: '#mobileMenu',
      mobileToggleSelector: '[data-mobile-menu-toggle]',
      mobileCloseSelector: '[data-mobile-menu-close]',
      submenuToggleSelector: '[data-submenu-toggle]'
    });
  }

  /**
   * Initialize Announcement Bar Carousel
   */
  initAnnouncementBar() {
    const carousel = document.querySelector('[data-announcement-carousel]');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.announcement-bar__slide');
    const prevBtn = document.querySelector('[data-announcement-prev]');
    const nextBtn = document.querySelector('[data-announcement-next]');

    if (slides.length <= 1) return;

    let currentIndex = 0;
    let autoplayInterval;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('is-active', i === index);
      });
      currentIndex = index;
    };

    const nextSlide = () => {
      const next = (currentIndex + 1) % slides.length;
      showSlide(next);
    };

    const prevSlide = () => {
      const prev = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(prev);
    };

    const startAutoplay = () => {
      autoplayInterval = setInterval(nextSlide, 5000);
    };

    const resetAutoplay = () => {
      clearInterval(autoplayInterval);
      startAutoplay();
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
      });
    }

    startAutoplay();
  }

  /**
   * Initialize Hero Slideshow
   */
  initHeroSlideshow() {
    const slideshow = document.querySelector('[data-hero-slideshow]');
    if (!slideshow) return;

    this.modules.heroSlideshow = new Carousel({
      container: slideshow,
      slideSelector: '.hero__slide',
      dotSelector: '[data-hero-dot]',
      prevSelector: '[data-hero-prev]',
      nextSelector: '[data-hero-next]',
      autoplay: true,
      autoplayInterval: 6000,
      pauseOnHover: true
    });

    // Scroll down button
    const scrollBtn = document.querySelector('[data-scroll-down]');
    if (scrollBtn) {
      scrollBtn.addEventListener('click', () => {
        const nextSection = document.querySelector('.hero').nextElementSibling;
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  /**
   * Initialize Product Carousels
   */
  initProductCarousels() {
    const carousels = document.querySelectorAll('[data-product-carousel]');
    
    carousels.forEach(carousel => {
      const name = carousel.dataset.productCarousel;
      const track = carousel.querySelector('[data-carousel-track]');
      const prevBtn = carousel.querySelector('[data-carousel-prev]');
      const nextBtn = carousel.querySelector('[data-carousel-next]');
      const cards = carousel.querySelectorAll('[data-product-card]');

      if (!track || cards.length === 0) return;

      let currentIndex = 0;
      let itemsPerView = this.getItemsPerView();

      const updateCarousel = () => {
        const maxIndex = Math.max(0, cards.length - itemsPerView);
        currentIndex = Math.min(currentIndex, maxIndex);

        // For CSS Grid, we hide overflow items
        cards.forEach((card, i) => {
          if (i >= currentIndex && i < currentIndex + itemsPerView) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });

        // Update buttons
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex >= maxIndex;
      };

      const next = () => {
        const maxIndex = cards.length - itemsPerView;
        if (currentIndex < maxIndex) {
          currentIndex++;
          updateCarousel();
        }
      };

      const prev = () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateCarousel();
        }
      };

      if (nextBtn) nextBtn.addEventListener('click', next);
      if (prevBtn) prevBtn.addEventListener('click', prev);

      // Update on resize
      window.addEventListener('resize', Utils.debounce(() => {
        itemsPerView = this.getItemsPerView();
        updateCarousel();
      }, 250));

      // Initial update
      updateCarousel();
    });
  }

  /**
   * Get items per view based on screen width
   */
  getItemsPerView() {
    const width = window.innerWidth;
    if (width < 640) return 2;
    if (width < 1024) return 3;
    return 4;
  }

  /**
   * Initialize Features Carousel
   */
  initFeaturesCarousel() {
    const carousel = document.querySelector('[data-features-carousel]');
    if (!carousel) return;

    // Only run on mobile
    if (window.innerWidth >= 1024) return;

    const slides = carousel.querySelectorAll('[data-feature]');
    const dots = carousel.querySelectorAll('[data-feature-dot]');

    if (slides.length <= 1) return;

    let currentIndex = 0;
    let autoplayInterval;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index);
        dot.setAttribute('aria-selected', i === index);
      });
      currentIndex = index;
    };

    const nextSlide = () => {
      const next = (currentIndex + 1) % slides.length;
      showSlide(next);
    };

    const startAutoplay = () => {
      autoplayInterval = setInterval(nextSlide, 5000);
    };

    const resetAutoplay = () => {
      clearInterval(autoplayInterval);
      startAutoplay();
    };

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(index);
        resetAutoplay();
      });
    });

    startAutoplay();

    // Handle resize
    window.addEventListener('resize', Utils.debounce(() => {
      if (window.innerWidth >= 1024) {
        clearInterval(autoplayInterval);
        slides.forEach(slide => slide.classList.add('is-active'));
      } else {
        showSlide(0);
        startAutoplay();
      }
    }, 250));
  }

  /**
   * Initialize FAQ Accordion
   */
  initFAQ() {
    // Support both <details class="faq-item"> accordions and legacy footer button FAQ items
    const detailsFaqs = document.querySelectorAll('details.faq-item');
    const faqButtons = document.querySelectorAll('.footer__faq-item');

    if (detailsFaqs.length === 0 && faqButtons.length === 0) return;

    // Use the Accordion component for native <details> FAQ items so only one opens at a time
    if (detailsFaqs.length > 0) {
      this.modules.faq = new Accordion({
        items: detailsFaqs,
        allowMultiple: false
      });
      // Open the first FAQ item by default so users see content immediately
      try {
        const first = detailsFaqs[0];
        if (first && !first.open) first.open = true;
      } catch (e) {
        // ignore
      }
    }

    // Fallback for custom footer FAQ buttons (non-<details>)
    if (faqButtons.length > 0) {
      const closeAll = () => {
        faqButtons.forEach((b) => {
          b.setAttribute('aria-expanded', 'false');
          const answerId = b.getAttribute('aria-controls');
          if (answerId) {
            const answer = document.getElementById(answerId);
            if (answer) answer.hidden = true;
          }
        });
      };

      faqButtons.forEach((btn, idx) => {
        let answerId = btn.getAttribute('aria-controls');
        if (!answerId) {
          answerId = btn.dataset.answerId || `footer-faq-answer-${idx}`;
          btn.setAttribute('aria-controls', answerId);
        }

        if (!btn.hasAttribute('role')) btn.setAttribute('role', 'button');
        btn.setAttribute('aria-expanded', 'false');

        const answerEl = document.getElementById(answerId);
        if (answerEl) answerEl.hidden = true;

        btn.addEventListener('click', function () {
          const expanded = btn.getAttribute('aria-expanded') === 'true';
          closeAll();
          if (!expanded) {
            btn.setAttribute('aria-expanded', 'true');
            const ans = document.getElementById(answerId);
            if (ans) ans.hidden = false;
          }
        });

        btn.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btn.click();
          }
        });
      });
    }
  }

  /**
   * Initialize Currency Selector
   */
  initCurrency() {
    this.modules.currency = new Currency({
      selectorContainer: '[data-currency-selector]',
      toggleSelector: '[data-currency-toggle]',
      dropdownSelector: '[data-currency-dropdown]',
      optionSelector: '.currency-selector__option',
      searchSelector: '[data-currency-search]'
    });
  }

  /**
   * Initialize Search
   */
  initSearch() {
    // Initialize modal search
    this.modules.search = new Search({
      toggleSelector: '[data-search-toggle]',
      modalSelector: '#searchModal',
      inputSelector: '[data-search-input]',
      clearSelector: '[data-search-clear]',
      resultsSelector: '[data-search-results]'
    });

    // Initialize inline search bar below navbar
    this.modules.searchBar = new SearchBar({
      formSelector: '[data-searchbar-form]',
      inputSelector: '[data-searchbar-input]',
      clearSelector: '[data-searchbar-clear]',
      suggestionsSelector: '[data-searchbar-suggestions]',
      resultsSelector: '[data-searchbar-results]'
    });
  }

  /**
   * Initialize Cart
   */
  initCart() {
    // Load cart from API for logged in users
    if (userModel.isLoggedIn()) {
      cartModel.getCart().catch(error => {
        console.error('Failed to load cart:', error);
      });
    }
    
    // Initialize cart UI
    this.modules.cart = new Cart({
      toggleSelector: '[data-cart-toggle]',
      drawerSelector: '#cartDrawer',
      countSelector: '[data-cart-count]',
      drawerCountSelector: '[data-cart-drawer-count]',
      bodySelector: '[data-cart-drawer-body]',
      footerSelector: '[data-cart-drawer-footer]',
      emptySelector: '[data-cart-empty]',
      itemsSelector: '[data-cart-items]',
      subtotalSelector: '[data-cart-subtotal]',
      quickAddSelector: '[data-quick-add]'
    });
    
    console.log('🛒 Cart system initialized');
  }

  /**
   * Initialize Account Menu
   */
  initAccountMenu() {
    const accountMenu = document.querySelector('[data-account-menu]');
    if (!accountMenu) return;

    const authLink = accountMenu.querySelector('[data-auth-link]');
    const userMenu = accountMenu.querySelector('[data-user-menu]');
    const userToggle = accountMenu.querySelector('[data-user-toggle]');
    const userPanel = accountMenu.querySelector('[data-user-panel]');
    const userNameEl = accountMenu.querySelector('[data-user-name]');
    const logoutBtn = accountMenu.querySelector('[data-logout]');

    // Check if user is logged in
    const user = Utils.storage.get('user');
    
    if (user && user.name) {
      // Show user menu, hide auth link
      if (authLink) authLink.style.display = 'none';
      if (userMenu) {
        userMenu.style.display = 'block';
        if (userNameEl) userNameEl.textContent = user.name;
      }
    } else {
      // Show auth link, hide user menu
      if (authLink) authLink.style.display = '';
      if (userMenu) userMenu.style.display = 'none';
    }

    // User menu toggle
    if (userToggle && userPanel) {
      userToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = userPanel.classList.contains('is-open');
        userPanel.classList.toggle('is-open');
        userToggle.setAttribute('aria-expanded', !isOpen);
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!accountMenu.contains(e.target)) {
          userPanel.classList.remove('is-open');
          userToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Logout functionality
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        Utils.storage.remove('user');
        Utils.storage.remove('authToken');
        this.showToast('Logged Out', 'You have been successfully logged out');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
    }
  }

  /**
   * Show toast notification
   */
  showToast(title, message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <div class="toast__icon">
        ${type === 'success' ? 
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M8 12l3 3 5-6" stroke="currentColor" stroke-width="2"/></svg>' : 
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2"/></svg>'
        }
      </div>
      <div class="toast__content">
        <p class="toast__title">${title}</p>
        <p class="toast__message">${message}</p>
      </div>
      <button type="button" class="toast__close" aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" stroke-width="2"/></svg>
      </button>
    `;

    container.appendChild(toast);

    // Close button
    toast.querySelector('.toast__close').addEventListener('click', () => {
      toast.classList.add('toast--hiding');
      setTimeout(() => toast.remove(), 300);
    });

    // Auto remove
    setTimeout(() => {
      toast.classList.add('toast--hiding');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  /**
   * Initialize Modals
   */
  initModals() {
    // Generic modal initialization
    const modalTriggers = document.querySelectorAll('[data-modal-open]');
    const modalCloses = document.querySelectorAll('[data-modal-close]');

    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const modalId = trigger.dataset.modalOpen;
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    modalCloses.forEach(close => {
      close.addEventListener('click', () => {
        const modal = close.closest('.modal, .drawer');
        if (modal) {
          modal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      });
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal[aria-hidden="false"], .drawer[aria-hidden="false"]');
        openModals.forEach(modal => {
          modal.setAttribute('aria-hidden', 'true');
        });
        document.body.style.overflow = '';
      }
    });
  }

  /**
   * Initialize Cookie Banner
   */
  initCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    if (!banner) return;

    // Check if already consented
    const consent = Utils.storage.get('cookieConsent');
    if (consent) return;

    // Show banner after delay
    setTimeout(() => {
      banner.hidden = false;
    }, 2000);

    const acceptBtn = banner.querySelector('[data-cookie-accept]');
    const declineBtn = banner.querySelector('[data-cookie-decline]');
    const closeBtn = banner.querySelector('[data-cookie-close]');

    const hideBanner = () => {
      banner.hidden = true;
    };

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        Utils.storage.set('cookieConsent', 'accepted');
        hideBanner();
      });
    }

    if (declineBtn) {
      declineBtn.addEventListener('click', () => {
        Utils.storage.set('cookieConsent', 'declined');
        hideBanner();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', hideBanner);
    }
  }

  /**
   * Initialize Scroll Reveal Animations
   */
  initScrollReveal() {
    const elements = document.querySelectorAll('[data-reveal]');
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    elements.forEach(el => observer.observe(el));
  }

  /**
   * Initialize Header Scroll Behavior
   */
  initHeaderScroll() {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 100;

    const handleScroll = Utils.throttle(() => {
      const currentScroll = window.pageYOffset;

      // Add scrolled class
      header.classList.toggle('is-scrolled', currentScroll > 10);

      // Hide/show on scroll (optional - uncomment to enable)
      // if (currentScroll > scrollThreshold) {
      //   if (currentScroll > lastScroll) {
      //     header.classList.add('is-hidden');
      //   } else {
      //     header.classList.remove('is-hidden');
      //   }
      // }

      lastScroll = currentScroll;
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /**
   * Hide Page Loader
   */
  hidePageLoader() {
    const loader = document.getElementById('pageLoader');
    if (loader) {
      loader.classList.remove('is-loading');
    }
  }
  /**
   * Initialize Authentication
   */
  initAuthentication() {
    // Auth controller is initialized on import
    console.log('🔐 Authentication system initialized');
  }

  /**
   * Initialize Products
   */
  initProducts() {
    // Load featured products on home page
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
      productController.loadFeaturedProducts();
    }
    
    // Load products on collection page
    if (window.location.pathname === '/pages/collection.html') {
      productController.loadProducts();
    }
    
    // Load single product on product page
    if (window.location.pathname === '/pages/product.html') {
      const urlParams = new URLSearchParams(window.location.search);
      const productId = urlParams.get('id');
      if (productId) {
        productController.loadProduct(productId);
      }
    }
    
    console.log('📦 Products system initialized');
  }

  /**
   * Initialize Contact Form
   */
  initContactForm() {
    const form = document.querySelector('[data-contact-form]');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;

      // Disable button and show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span>Sending...</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="animate-spin">
          <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" stroke-dasharray="40" stroke-dashoffset="10"/>
        </svg>
      `;

      // Collect form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
        // Simulate API call (replace with actual endpoint)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Show success message
        this.showContactSuccess(form);
        
        // Reset form
        form.reset();

        console.log('📧 Contact form submitted:', data);
      } catch (error) {
        console.error('Contact form error:', error);
        
        // Show error toast
        this.showToast('Error', 'Sorry, there was an error sending your message. Please try again.', 'error');
      } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });

    console.log('📬 Contact form initialized');
  }

  /**
   * Initialize Product Page Features
   */
  initProductPage() {
    // Only run on product page
    if (!document.body.classList.contains('page-product')) return;

    this.initProductGallery();
    this.initProductForm();
    this.initProductAccordions();
    this.initProductShare();

    console.log('🛍️ Product page initialized');
  }

  /**
   * Initialize Product Gallery
   */
  initProductGallery() {
    const gallery = document.querySelector('[data-product-gallery]');
    if (!gallery) return;

    const mainImage = gallery.querySelector('#mainProductImage');
    const thumbnails = gallery.querySelectorAll('[data-gallery-thumb]');
    const prevBtn = gallery.querySelector('[data-gallery-prev]');
    const nextBtn = gallery.querySelector('[data-gallery-next]');
    const zoomBtn = gallery.querySelector('[data-gallery-zoom]');

    if (!mainImage || thumbnails.length === 0) return;

    let currentIndex = 0;
    const images = [
      'https://chandnijewellery.com.au/cdn/shop/files/ZeebaMehndi.jpg?width=800',
      'https://chandnijewellery.com.au/cdn/shop/files/ZeebaPink.jpg?width=800',
      'https://chandnijewellery.com.au/cdn/shop/files/ZeebaWhite.jpg?width=800',
      'https://chandnijewellery.com.au/cdn/shop/files/ZeebaDetail.jpg?width=800'
    ];

    const altTexts = [
      'Zeeba Tikka Set with Sahara - Mehndi Green',
      'Zeeba Tikka Set with Sahara - Pink',
      'Zeeba Tikka Set with Sahara - White',
      'Zeeba Tikka Set with Sahara - Detail'
    ];

    // Update main image
    const updateMainImage = (index) => {
      mainImage.src = images[index];
      mainImage.alt = altTexts[index];
      
      // Update active thumbnail
      thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('is-active', i === index);
      });
      
      currentIndex = index;
    };

    // Thumbnail clicks
    thumbnails.forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        updateMainImage(index);
      });
    });

    // Navigation buttons
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
        updateMainImage(newIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
        updateMainImage(newIndex);
      });
    }

    // Zoom functionality
    if (zoomBtn) {
      zoomBtn.addEventListener('click', () => {
        // Create and show zoom modal
        this.showImageZoom(images[currentIndex], altTexts[currentIndex]);
      });
    }

    // Keyboard navigation
    gallery.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' && prevBtn) {
        prevBtn.click();
      } else if (e.key === 'ArrowRight' && nextBtn) {
        nextBtn.click();
      }
    });
  }

  /**
   * Initialize Product Form
   */
  initProductForm() {
    const form = document.querySelector('[data-product-form]');
    if (!form) return;

    const swatches = form.querySelectorAll('[data-swatch]');
    const selectedValue = form.querySelector('[data-selected-color]');
    const quantityBtns = form.querySelectorAll('[data-quantity-minus], [data-quantity-plus]');
    const quantityInput = form.querySelector('[data-quantity-input]');
    const addToCartBtn = form.querySelector('[data-add-to-cart]');
    const buyNowBtn = form.querySelector('[data-buy-now]');

    // Color swatch selection
    swatches.forEach(swatch => {
      swatch.addEventListener('change', (e) => {
        if (e.target.checked && selectedValue) {
          selectedValue.textContent = e.target.value;
          
          // Update main image based on color
          const colorImageMap = {
            'Mehndi Green': 0,
            'Pink': 1,
            'White': 2
          };
          
          const imageIndex = colorImageMap[e.target.value];
          if (imageIndex !== undefined) {
            const thumbnails = document.querySelectorAll('[data-gallery-thumb]');
            if (thumbnails[imageIndex]) {
              thumbnails[imageIndex].click();
            }
          }
        }
      });
    });

    // Quantity controls
    quantityBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (!quantityInput) return;
        
        const currentValue = parseInt(quantityInput.value) || 1;
        const min = parseInt(quantityInput.min) || 1;
        const max = parseInt(quantityInput.max) || 10;
        
        let newValue = currentValue;
        
        if (btn.dataset.quantityMinus !== undefined) {
          newValue = Math.max(min, currentValue - 1);
        } else if (btn.dataset.quantityPlus !== undefined) {
          newValue = Math.min(max, currentValue + 1);
        }
        
        quantityInput.value = newValue;
        
        // Update button states
        quantityBtns.forEach(qBtn => {
          if (qBtn.dataset.quantityMinus !== undefined) {
            qBtn.disabled = newValue <= min;
          } else if (qBtn.dataset.quantityPlus !== undefined) {
            qBtn.disabled = newValue >= max;
          }
        });
      });
    });

    // Form submission
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const productData = {
          id: 'zeeba-tikka-set',
          name: 'Zeeba Tikka Set with Sahara',
          price: 8300,
          color: formData.get('color') || 'Mehndi Green',
          quantity: parseInt(formData.get('quantity')) || 1,
          image: document.getElementById('mainProductImage')?.src
        };

        await this.handleAddToCart(productData, addToCartBtn);
      });
    }

    // Buy now functionality
    if (buyNowBtn) {
      buyNowBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Add to cart and redirect to checkout
        if (addToCartBtn) {
          addToCartBtn.click();
          setTimeout(() => {
            window.location.href = '/pages/cart.html';
          }, 1000);
        }
      });
    }
  }

  /**
   * Initialize Product Accordions
   */
  initProductAccordions() {
    const accordions = document.querySelectorAll('.product-accordion');
    
    accordions.forEach(accordion => {
      const summary = accordion.querySelector('summary');
      if (summary) {
        summary.addEventListener('click', (e) => {
          // Let the browser handle details/summary, but we can add custom logic here
          setTimeout(() => {
            const icon = summary.querySelector('.product-accordion__icon');
            if (icon) {
              icon.style.transform = accordion.open ? 'rotate(180deg)' : 'rotate(0deg)';
            }
          }, 0);
        });
      }
    });
  }

  /**
   * Initialize Product Share
   */
  initProductShare() {
    const shareLinks = document.querySelectorAll('.product-share__link');
    const copyBtn = document.querySelector('[data-copy-link]');

    shareLinks.forEach(link => {
      if (link.href === '#') {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          
          const currentUrl = window.location.href;
          const productTitle = document.querySelector('.product-info__title')?.textContent || 'Product';
          const platform = link.dataset.socialPlatform;
          
          let shareUrl = '';
          
          switch (platform) {
            case 'facebook':
              shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
              break;
            case 'pinterest':
              shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&description=${encodeURIComponent(productTitle)}`;
              break;
            case 'twitter':
              shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(productTitle)}`;
              break;
            default:
              return;
          }
          
          if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
          }
        });
      }
    });

    // Copy link functionality
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          this.showToast('Link copied to clipboard!', 'success');
        } catch (error) {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = window.location.href;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          this.showToast('Link copied to clipboard!', 'success');
        }
      });
    }
  }

  /**
   * Handle Add to Cart
   */
  async handleAddToCart(productData, button) {
    const originalText = button.innerHTML;
    
    // Show loading state
    button.disabled = true;
    button.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="animate-spin">
        <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" stroke-dasharray="40" stroke-dashoffset="10"/>
      </svg>
      <span>Adding...</span>
    `;

    try {
      // Import CartModel dynamically
      const { cartModel } = await import('./models/CartModel.js');
      
      // Actually add to cart via API
      await cartModel.addToCart({
        productId: productData.id,
        quantity: productData.quantity || 1,
        selectedColor: productData.color || null,
        selectedSize: productData.size || null
      });
      
      // Show success state
      button.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M16 6L8 14L4 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Added!</span>
      `;
      
      // Cart count is updated by cartModel.addToCart via updateCartBadge()
      
      // Show toast notification
      this.showToast(`${productData.name} added to cart!`, 'success');
      
      // Reset button after 2 seconds
      setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
      }, 2000);
      
    } catch (error) {
      console.error('Add to cart error:', error);
      this.showToast('Failed to add item to cart. Please try again.', 'error');
      
      // Reset button
      button.innerHTML = originalText;
      button.disabled = false;
    }
  }

  /**
   * Show Image Zoom Modal
   */
  showImageZoom(imageSrc, altText) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal modal--zoom';
    modal.setAttribute('aria-hidden', 'false');
    modal.innerHTML = `
      <div class="modal__overlay"></div>
      <div class="modal__content">
        <button type="button" class="modal__close" aria-label="Close zoom">
          <svg width="24" height="24" viewBox="0 0 24 24"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2"/></svg>
        </button>
        <img src="${imageSrc}" alt="${altText}" style="width: 100%; height: auto;">
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Close functionality
    const closeModal = () => {
      modal.remove();
      document.body.style.overflow = '';
    };

    modal.querySelector('.modal__overlay').addEventListener('click', closeModal);
    modal.querySelector('.modal__close').addEventListener('click', closeModal);
    
    // Close on escape
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  /**
   * Show Contact Form Success Message
   */
  showContactSuccess(form) {
    const wrapper = form.closest('.contact-form-wrapper');
    
    // Create success message if it doesn't exist
    let successMsg = wrapper.querySelector('.contact-form__success-message');
    if (!successMsg) {
      successMsg = document.createElement('div');
      successMsg.className = 'contact-form__success-message';
      successMsg.innerHTML = `
        <div class="contact-form__success-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h3 class="contact-form__success-title">Message Sent!</h3>
        <p class="contact-form__success-text">Thank you for contacting us. We'll get back to you within 24-48 hours.</p>
        <button type="button" class="btn btn--outline" data-send-another>Send Another Message</button>
      `;
      wrapper.appendChild(successMsg);
      
      // Add event listener for "Send Another" button
      const sendAnotherBtn = successMsg.querySelector('[data-send-another]');
      sendAnotherBtn.addEventListener('click', () => {
        form.classList.remove('contact-form--success');
        successMsg.style.display = 'none';
      });
    }
    
    // Show success state
    form.classList.add('contact-form--success');
    successMsg.style.display = 'block';
  }

  /**
   * Show Toast Notification
   */
  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <span class="toast__message">${message}</span>
      <button type="button" class="toast__close" aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 16 16"><path d="M4 4L12 12M12 4L4 12" stroke="currentColor" stroke-width="2"/></svg>
      </button>
    `;

    container.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
      toast.classList.add('toast--hiding');
      setTimeout(() => toast.remove(), 300);
    }, 5000);

    // Close button
    toast.querySelector('.toast__close').addEventListener('click', () => {
      toast.classList.add('toast--hiding');
      setTimeout(() => toast.remove(), 300);
    });
  }
}

// Initialize the app
const app = new App();
app.init();

// Export for external use
window.ChandniApp = app;