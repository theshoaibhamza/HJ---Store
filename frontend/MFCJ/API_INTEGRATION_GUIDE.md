# Frontend-Backend API Integration Guide

## Configuration Status ✅

Your frontend is now configured to work with the backend at:
- **Base URL**: `http://localhost:5000/api`
- **Environment**: Development

## Backend Setup

1. **Clone Backend Repository**
```bash
git clone https://github.com/theshoaibhamza/Chandni-Jewellery-Backend.git
cd Chandni-Jewellery-Backend
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment Variables** (`.env` file)
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

4. **Start MongoDB**
```bash
# Windows (if using local MongoDB)
mongod

# Or use MongoDB Atlas cloud database
```

5. **Seed Database** (Optional - adds test data)
```bash
npm run seed
```

6. **Start Backend Server**
```bash
npm run dev
```

The backend will be available at: `http://localhost:5000`

---

## Test Credentials

Use these credentials for testing (from backend README):

### Admin Account
- **Email**: admin@chandni.com
- **Password**: Admin@123

### User Account
- **Email**: john@example.com
- **Password**: User@123

### Test Promo Codes
- `WELCOME10` - 10% off first order (min $100)
- `SAVE20` - 20% off orders above $200
- `FREESHIP` - Free shipping on all orders

---

## API Endpoints Reference

### Authentication (`/auth`)
```javascript
POST   /auth/register          // Register new user
POST   /auth/login             // Login and get JWT token
GET    /auth/me                // Get current user profile (requires token)
PUT    /auth/profile           // Update profile (requires token)
PUT    /auth/password          // Change password (requires token)
POST   /auth/logout            // Logout (requires token)
```

### Products (`/products`)
```javascript
GET    /products               // Get all products (with filtering)
GET    /products/featured      // Get featured products
GET    /products/categories    // Get all categories
GET    /products/:id           // Get single product
POST   /products               // Create product (Admin only)
PUT    /products/:id           // Update product (Admin only)
DELETE /products/:id           // Delete product (Admin only)
POST   /products/:id/reviews   // Add product review (requires token)
```

### Shopping Cart (`/cart`)
```javascript
GET    /cart                   // Get user cart (requires token)
POST   /cart/items             // Add item to cart (requires token)
PUT    /cart/items/:itemId     // Update cart item (requires token)
DELETE /cart/items/:itemId     // Remove item from cart (requires token)
DELETE /cart                   // Clear entire cart (requires token)
POST   /cart/promo             // Apply promo code (requires token)
DELETE /cart/promo             // Remove promo code (requires token)
PUT    /cart/note              // Update order note (requires token)
```

### Orders (`/orders`)
```javascript
POST   /orders                 // Create new order (requires token)
GET    /orders                 // Get user's orders (requires token)
GET    /orders/:id             // Get single order (requires token)
PUT    /orders/:id/cancel      // Cancel order (requires token)
GET    /orders/admin/all       // Get all orders (Admin only)
GET    /orders/admin/stats     // Get order statistics (Admin only)
PUT    /orders/:id/status      // Update order status (Admin only)
PUT    /orders/:id/payment     // Update payment status (Admin only)
```

### Promo Codes (`/promocodes`)
```javascript
GET    /promocodes             // Get active promo codes
POST   /promocodes/validate    // Validate promo code (requires token)
POST   /promocodes             // Create promo code (Admin only)
GET    /promocodes/admin       // Get all promo codes (Admin only)
GET    /promocodes/:id         // Get single promo code (Admin only)
PUT    /promocodes/:id         // Update promo code (Admin only)
DELETE /promocodes/:id         // Delete promo code (Admin only)
GET    /promocodes/admin/stats // Get statistics (Admin only)
```

### Users (`/users`)
```javascript
GET    /users/profile          // Get current user profile (requires token)
PUT    /users/profile          // Update current user profile (requires token)
POST   /users/addresses        // Add new address (requires token)
PUT    /users/addresses/:addressId    // Update address (requires token)
DELETE /users/addresses/:addressId    // Delete address (requires token)
GET    /users                  // Get all users (Admin only)
GET    /users/:id              // Get single user (Admin only)
PUT    /users/:id              // Update user (Admin only)
DELETE /users/:id              // Delete/deactivate user (Admin only)
GET    /users/admin/stats      // Get user statistics (Admin only)
```

---

## Frontend Integration Points

### 1. Authentication Controller
Located at: `js/controllers/AuthController.js`

Handles login/register with the backend. Stores JWT token in localStorage.

```javascript
// Usage in frontend
import { authController } from './controllers/AuthController.js';

// Login
await authController.login(email, password);

// Logout
await authController.logout();

// Get current user
const user = await authController.getCurrentUser();
```

### 2. Product Controller
Located at: `js/controllers/ProductController.js`

Fetches products from backend API.

```javascript
// Get all products
const products = await productController.getAllProducts();

// Get featured products
const featured = await productController.getFeaturedProducts();

// Get product by ID
const product = await productController.getProduct(productId);
```

### 3. Cart Controller
Located at: `js/controllers/CartController.js`

Manages shopping cart operations.

```javascript
// Get cart
const cart = await cartController.getCart();

// Add to cart
await cartController.addItem(productId, quantity, color);

// Apply promo code
await cartController.applyPromoCode(code);
```

### 4. API Service
Located at: `js/services/ApiService.js`

Base service for all API calls with JWT authentication.

```javascript
// Usage
import { apiService } from './services/ApiService.js';

// Make authenticated request
const response = await apiService.get('/products');

// Make POST request
const result = await apiService.post('/orders', orderData);
```

---

## Configuration File

Located at: `js/core/config.js`

All API endpoints and settings are configured here. Update this file if:
- Backend URL changes
- New endpoints are added
- Environment variables change

---

## Common Integration Tasks

### 1. Testing Authentication
```javascript
// In browser console
await apiService.post('/auth/login', {
  email: 'admin@chandni.com',
  password: 'Admin@123'
});
```

### 2. Getting Products
```javascript
// Fetch all products
const response = await apiService.get('/products');

// Fetch with filters
const response = await apiService.get('/products?category=necklace&minPrice=100&maxPrice=500');

// Fetch featured
const response = await apiService.get('/products/featured');
```

### 3. Creating an Order
```javascript
const orderData = {
  shippingInfo: {
    email: 'user@example.com',
    fname: 'John',
    lname: 'Doe',
    address: '123 Main St',
    city: 'New York',
    country: 'USA',
    phone_number: '+1234567890'
  },
  paymentInfo: {
    method: 'card'
  }
};

const order = await apiService.post('/orders', orderData);
```

---

## Troubleshooting

### CORS Issues
If you see CORS errors, ensure:
1. Backend is running on `http://localhost:5000`
2. Backend has CORS enabled (should be in package)
3. Frontend is accessing from `http://localhost:3000` (or configured CLIENT_URL)

### Authentication Errors
- Clear localStorage: `localStorage.clear()`
- Check if backend is running
- Verify JWT token is being stored: `localStorage.getItem('authToken')`

### API Connection Issues
- Check backend is running: `http://localhost:5000`
- Check MongoDB is running
- Check network tab in browser DevTools
- Verify config.js has correct baseUrl

### Token Expiration
- Frontend will automatically redirect to login if token expires
- Token is stored in localStorage as `authToken`
- Refresh page to get new token

---

## Production Deployment

Before deploying to production:

1. **Update Backend URL in config.js**
   ```javascript
   baseUrl: 'https://your-backend-domain.com/api'
   ```

2. **Remove Test Credentials**
   - Delete or comment out `testAccounts` in config.js
   - Remove any hardcoded passwords

3. **Enable HTTPS**
   - Update all API URLs to use `https://`
   - Ensure backend also uses HTTPS

4. **Security Headers**
   - Enable CORS properly
   - Add Content Security Policy headers
   - Use httpOnly cookies for tokens (if possible)

5. **Environment Variables**
   - Use `.env` file for sensitive data
   - Never commit secrets to version control

---

## Support

For backend API documentation, visit:
https://github.com/theshoaibhamza/Chandni-Jewellery-Backend

For frontend issues, check:
- `js/core/config.js` - Configuration
- `js/services/ApiService.js` - API service implementation
- `js/controllers/` - Business logic
- Browser DevTools Network tab - API requests/responses

---

**Last Updated**: January 17, 2026
**Frontend**: Aligned with Backend v1.0
