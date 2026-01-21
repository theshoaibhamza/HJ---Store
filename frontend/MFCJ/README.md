# Chandni Jewellery - Frontend

A complete, production-ready frontend implementation for Chandni Jewellery e-commerce website, built with modern HTML, CSS, and JavaScript. Integrated with a comprehensive Node.js/Express/MongoDB backend API for full e-commerce functionality.

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
- **JWT Authentication**: Secure user authentication with token-based access
- **Real-time API Integration**: Connected to backend e-commerce API

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
- **Cookie Consent**: GDPR-compliant banner
- **Product Filtering**: Search, filter by category, price range
- **Order Tracking**: User order history and status updates
- **User Authentication**: Registration, login, profile management

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js (optional, for development server)
- Backend server running at `http://localhost:5000` (see Backend Setup)

### 1. Clone or Download

```bash
git clone https://github.com/your-repo/chandni-jewellery.git
cd chandni-jewellery
```

### 2. Backend Setup (Required)

Before starting the frontend, ensure the backend is running:

```bash
# Navigate to backend directory
cd ../Chandni-Jewellery-Backend-main

# Install dependencies
npm install

# Configure environment (.env file)
# See Backend Configuration section below

# Start MongoDB
mongod

# Seed database (optional)
npm run seed

# Start backend server
npm run dev
```

Backend will be available at: `http://localhost:5000/api`

### 3. Open Frontend in Browser

Simply open `index.html` in your web browser.

### 4. Development Server (Optional)

For better development experience with live reload:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000`

## 🎨 Customization

### Frontend Configuration

Edit `js/core/config.js` for JavaScript settings:

```javascript
export const Config = {
  siteName: 'Chandni Jewellery',
  apiBaseUrl: 'http://localhost:5000/api',  // Backend API
  currency: {
    code: 'PKR',
    symbol: '₨',
    locale: 'en-PK'
  },
  // ... 
};
```

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

## � Backend Configuration & API Integration

### Backend Environment Variables

The backend requires a `.env` file with the following configuration:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/chandni_ecommerce
JWT_SECRET=your_jwt_secret_key_here_make_it_very_long_and_secure
JWT_EXPIRE=30d
BCRYPT_SALT_ROUNDS=12
CLIENT_URL=http://localhost:3000
MAX_FILE_SIZE=5000000
FILE_UPLOAD_PATH=./uploads
```

### API Endpoints Reference

**Base URL**: `http://localhost:5000/api`

#### Authentication (`/auth`)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user profile (requires token)
- `PUT /auth/profile` - Update profile (requires token)
- `PUT /auth/password` - Change password (requires token)
- `POST /auth/logout` - Logout (requires token)

#### Products (`/products`)
- `GET /products` - Get all products (with filtering)
- `GET /products/featured` - Get featured products
- `GET /products/categories` - Get all categories
- `GET /products/:id` - Get single product
- `POST /products` - Create product (Admin only)
- `PUT /products/:id` - Update product (Admin only)
- `DELETE /products/:id` - Delete product (Admin only)
- `POST /products/:id/reviews` - Add product review (requires token)

#### Shopping Cart (`/cart`)
- `GET /cart` - Get user cart (requires token)
- `POST /cart/items` - Add item to cart (requires token)
- `PUT /cart/items/:itemId` - Update cart item (requires token)
- `DELETE /cart/items/:itemId` - Remove item from cart (requires token)
- `DELETE /cart` - Clear entire cart (requires token)
- `POST /cart/promo` - Apply promo code (requires token)
- `DELETE /cart/promo` - Remove promo code (requires token)
- `PUT /cart/note` - Update order note (requires token)

#### Orders (`/orders`)
- `POST /orders` - Create new order (requires token)
- `GET /orders` - Get user's orders (requires token)
- `GET /orders/:id` - Get single order (requires token)
- `PUT /orders/:id/cancel` - Cancel order (requires token)
- `GET /orders/admin/all` - Get all orders (Admin only)
- `GET /orders/admin/stats` - Get order statistics (Admin only)
- `PUT /orders/:id/status` - Update order status (Admin only)
- `PUT /orders/:id/payment` - Update payment status (Admin only)

#### Promo Codes (`/promocodes`)
- `GET /promocodes` - Get active promo codes
- `POST /promocodes/validate` - Validate promo code (requires token)
- `POST /promocodes` - Create promo code (Admin only)
- `GET /promocodes/admin` - Get all promo codes (Admin only)
- `GET /promocodes/:id` - Get single promo code (Admin only)
- `PUT /promocodes/:id` - Update promo code (Admin only)
- `DELETE /promocodes/:id` - Delete promo code (Admin only)
- `GET /promocodes/admin/stats` - Get statistics (Admin only)

#### Users (`/users`)
- `GET /users/profile` - Get current user profile (requires token)
- `PUT /users/profile` - Update current user profile (requires token)
- `POST /users/addresses` - Add new address (requires token)
- `PUT /users/addresses/:addressId` - Update address (requires token)
- `DELETE /users/addresses/:addressId` - Delete address (requires token)
- `GET /users` - Get all users (Admin only)
- `GET /users/:id` - Get single user (Admin only)
- `PUT /users/:id` - Update user (Admin only)
- `DELETE /users/:id` - Delete/deactivate user (Admin only)
- `GET /users/admin/stats` - Get user statistics (Admin only)

### Authentication Header

All private endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Testing Credentials

**Admin Account**
- Email: `admin@chandni.com`
- Password: `Admin@123`

**User Account**
- Email: `john@example.com`
- Password: `User@123`

**Sample Promo Codes**
- `WELCOME10` - 10% off first order (min $100)
- `SAVE20` - 20% off orders above $200
- `FREESHIP` - Free shipping on all orders

## �📱 Responsive Breakpoints

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

**Frontend**: No external JavaScript libraries or CSS frameworks required.

**Backend**: See [Chandni-Jewellery-Backend](https://github.com/theshoaibhamza/Chandni-Jewellery-Backend) for backend dependencies.

### Frontend Fonts

Fonts are loaded from Google Fonts: 
- Cormorant Garamond (headings)
- Inter (body text)

## 🛠 Development Notes

### CSS Architecture
- BEM naming convention
- CSS custom properties for theming
- Mobile-first media queries
- Logical grouping of styles
- Component-based organization

### JavaScript Architecture
- ES6 modules
- Class-based components
- Event-driven communication
- Local storage for persistence
- API service layer for backend communication

### Performance Tips
- Images use `loading="lazy"` attribute
- Critical CSS is inlined (production)
- JavaScript is loaded with `type="module"`
- Debouncing and throttling for scroll/resize events

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🔗 Related Repositories

- **Backend**: [Chandni-Jewellery-Backend](https://github.com/theshoaibhamza/Chandni-Jewellery-Backend)
- **API Integration Guide**: See [API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md) in this repository

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, questions, or issues:
- Create an issue in this repository
- Contact the development team
- Check the [API Integration Guide](API_INTEGRATION_GUIDE.md) for setup issues 