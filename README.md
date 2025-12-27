# Chandni Jewellery - Frontend

A complete, production-ready frontend implementation for Chandni Jewellery e-commerce website, built with modern HTML, CSS, and JavaScript.

## 📁 Project Structure

```
chandni-jewellery/
├── index.html                    # Main homepage
├── css/
│   ├── main.css                  # Main CSS entry (imports all)
│   ├── base/
│   │   ├── reset.css             # CSS reset
│   │   ├── variables.css         # CSS custom properties
│   │   └── typography.css        # Typography styles
│   ├── layout/
│   │   ├── grid.css              # Grid system
│   │   ├── header.css            # Header styles
│   │   ├── footer.css            # Footer styles
│   │   └── sections.css          # Section layouts
│   ├── components/
│   │   ├── buttons.css           # Button styles
│   │   ├── cards.css             # Card components
│   │   ├── forms.css             # Form elements
│   │   ├── modals.css            # Modals & drawers
│   │   └── navigation.css        # Navigation & carousels
│   ├── pages/
│   │   └── home.css              # Homepage specific styles
│   └── utilities/
│       ├── animations.css        # Animations
│       ├── helpers.css           # Utility classes
│       └── responsive.css        # Responsive styles
├── js/
│   ├── app.js                    # Main application entry
│   ├── core/
│   │   ├── utils.js              # Utility functions
│   │   └── config.js             # Configuration
│   ├── components/
│   │   ├── Carousel.js           # Carousel component
│   │   ├── Modal.js              # Modal component
│   │   ├── Accordion.js          # Accordion component
│   │   └── Dropdown.js           # Dropdown component
│   └── features/
│       ├── Cart.js               # Shopping cart
│       ├── Search.js             # Search functionality
│       ├── Currency.js           # Currency selector
│       └── Navigation.js         # Navigation
├── assets/
│   ├── images/                   # Local images
│   ├── icons/                    # Icon files
│   └── fonts/                    # Custom fonts
└── README.md                     # This file
```

## ✨ Features

### Core Features
- **Responsive Design**: Mobile-first approach, works on all devices
- **Accessible**: WCAG 2.1 AA compliant
- **Performance Optimized**: Lazy loading, debouncing, efficient DOM manipulation
- **Modern JavaScript**: ES6+ modules, class-based architecture
- **CSS Custom Properties**: Easy theming and customization

### Components
- **Hero Slideshow**: Auto-playing, touch-enabled carousel
- **Product Carousels**: Touch/swipe support, responsive breakpoints
- **Mega Menus**: Multi-column dropdown navigation
- **Mobile Navigation**: Full-screen drawer with submenus
- **Currency Selector**: Multi-currency support with persistence
- **Search Modal**: Live search with keyboard navigation
- **Shopping Cart**: Drawer-based cart with quantity controls
- **FAQ Accordion**: Animated expand/collapse
- **Toast Notifications**: Success/error feedback
- **Cookie Consent**:  GDPR-compliant banner

## 🚀 Quick Start

### 1. Clone or Download

```bash
git clone https://github.com/your-repo/chandni-jewellery.git
cd chandni-jewellery
```

### 2. Open in Browser

Simply open `index.html` in your web browser.

### 3. Development Server (Optional)

For a better development experience with live reload:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve

# Using PHP
php -S localhost:8000
```

## 🎨 Customization

### Colors

Edit `css/base/variables.css` to customize colors: 

```css
:root {
  --color-primary: #6d4e35;
  --color-primary-dark: #5a3f2a;
  --color-primary-light:  #8b6247;
  /* ... */
}
```

### Typography

Update font families in `css/base/variables.css`:

```css
: root {
  --font-heading: 'Cormorant Garamond', Georgia, serif;
  --font-body:  'Inter', sans-serif;
  /* ... */
}
```

### Configuration

Edit `js/core/config.js` for JavaScript settings:

```javascript
export const Config = {
  siteName: 'Chandni Jewellery',
  currency: {
    code: 'PKR',
    symbol: '₨',
    locale: 'en-PK'
  },
  // ... 
};
```

## 📱 Responsive Breakpoints

| Breakpoint | Width | Description |
|------------|-------|-------------|
| sm | 640px | Small devices |
| md | 768px | Tablets |
| lg | 1024px | Laptops |
| xl | 1280px | Desktops |
| xxl | 1440px | Large screens |

## ♿ Accessibility

- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Skip links
- Screen reader friendly
- Reduced motion support
- High contrast mode support

## 🔧 Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- iOS Safari
- Chrome for Android

## 📝 JavaScript API

### Cart

```javascript
// Add item
window.ChandniApp.modules.cart.addItem({
  id: 'product-id',
  title: 'Product Name',
  price:  5000,
  image: 'image-url. jpg',
  variant: 'Color - Size'
});

// Remove item
window.ChandniApp.modules.cart.removeItem('product-id');

// Update quantity
window.ChandniApp.modules.cart.updateQuantity('product-id', 3);

// Get cart data
const cartData = window.ChandniApp.modules.cart.getCartData();
```

### Currency

```javascript
// Change currency
window.ChandniApp.modules.currency.selectCurrency('AUD');

// Get current currency
const currency = window.ChandniApp.modules. currency.getCurrentCurrency();

// Format price
const formatted = window.ChandniApp.modules. currency.formatPrice(5000);
```

### Events

```javascript
// Cart updated
document.addEventListener('cart:updated', (e) => {
  console.log('Cart updated:', e.detail);
});

// Currency changed
document.addEventListener('currency:changed', (e) => {
  console.log('Currency:', e.detail. currency);
});

// Mobile menu
document.addEventListener('navigation:mobile-open', () => {
  console.log('Mobile menu opened');
});
```

## 📦 Dependencies

**None! ** This project uses no external JavaScript libraries or CSS frameworks. 

Fonts are loaded from Google Fonts: 
- Cormorant Garamond (headings)
- Inter (body text)

## 🛠 Development Notes

### CSS Architecture
- BEM naming convention
- CSS custom properties for theming
- Mobile-first media queries
- Logical grouping of styles

### JavaScript Architecture
- ES6 modules
- Class-based components
- Event-driven communication
- Local storage for persistence

### Performance Tips
- Images use `loading="lazy"` attribute
- Critical CSS is inlined (production)
- JavaScript is loaded with `type="module"`
- Debouncing and throttling for scroll/resize events

## 📄 