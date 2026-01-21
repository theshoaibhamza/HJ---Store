# Chandni Jewellery Frontend - Complete Setup Guide

This guide will help you set up both the frontend and backend to run the complete Chandni Jewellery e-commerce platform locally.

## Table of Contents

- [System Requirements](#system-requirements)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Testing the Integration](#testing-the-integration)
- [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)

## System Requirements

- **Node.js**: v14 or higher
- **npm**: v6 or higher
- **MongoDB**: Local installation or MongoDB Atlas cloud
- **Git**: For cloning repositories
- **Modern Web Browser**: Chrome, Firefox, Safari, or Edge (latest 2 versions)
- **Windows, macOS, or Linux**: OS compatibility

### Check Your Setup

```bash
# Check Node.js version
node --version
# Should be v14.0.0 or higher

# Check npm version
npm --version
# Should be v6.0.0 or higher

# Check MongoDB (if installed locally)
mongod --version
```

## Backend Setup

### Step 1: Clone the Backend Repository

```bash
cd e:\website
git clone https://github.com/theshoaibhamza/Chandni-Jewellery-Backend.git
cd Chandni-Jewellery-Backend-main
```

Or navigate to the existing backend directory:

```bash
cd e:\website\Chandni-Jewellery-Backend-main
```

### Step 2: Install Backend Dependencies

```bash
npm install
```

This installs all required packages:
- Express.js - Web framework
- MongoDB/Mongoose - Database
- JWT - Authentication
- Bcrypt - Password hashing
- CORS - Cross-origin support
- And other dependencies

### Step 3: Configure Environment Variables

Create a `.env` file in the backend root directory with the following configuration:

```env
# Environment
NODE_ENV=development

# Server
PORT=5000
HOST=localhost

# Database
MONGO_URI=mongodb://localhost:27017/chandni_ecommerce

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_make_it_very_long_and_secure_at_least_32_chars
JWT_EXPIRE=30d

# Bcrypt
BCRYPT_SALT_ROUNDS=12

# CORS - Allow frontend to access backend
CLIENT_URL=http://localhost:3000

# File Uploads
MAX_FILE_SIZE=5000000
FILE_UPLOAD_PATH=./uploads

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password

# Payment Gateway (optional)
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Step 4: Start MongoDB

#### Option A: Local MongoDB Installation

```bash
# Windows
mongod

# macOS
mongod

# Linux
sudo systemctl start mongod
```

#### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get connection string
5. Update `MONGO_URI` in `.env`

```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/chandni_ecommerce?retryWrites=true&w=majority
```

### Step 5: Seed the Database (Optional but Recommended)

This adds sample data for testing:

```bash
npm run seed
```

This will create:
- Admin user (admin@chandni.com / Admin@123)
- Test user (john@example.com / User@123)
- Sample products
- Sample promo codes
- Sample orders

### Step 6: Start the Backend Server

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

You should see output like:
```
Server running on http://localhost:5000
Connected to MongoDB: chandni_ecommerce
```

**Keep this terminal open!** The backend must be running for the frontend to work.

## Frontend Setup

### Step 1: Navigate to Frontend Directory

```bash
cd e:\website\MFCJ
```

### Step 2: Install Frontend Dependencies (Optional)

Frontend has no required npm packages, but you can install development dependencies:

```bash
npm install
```

### Step 3: Verify Configuration

Check `js/core/config.js` to ensure it points to the correct backend:

```javascript
export const Config = {
  siteName: 'Chandni Jewellery',
  api: {
    baseUrl: 'http://localhost:5000/api',  // ← Make sure this is correct
    // ... rest of config
  },
  // ...
};
```

If you're running backend on a different host/port, update this value.

### Step 4: Start Development Server

**Option A: Using Python** (Recommended - no dependencies)

```bash
python -m http.server 8000
```

Then open your browser to: `http://localhost:8000`

**Option B: Using Node.js**

```bash
npx serve
```

Then open your browser to: `http://localhost:3000`

**Option C: Direct Browser** (No server needed, but some features may not work)

1. Right-click on `index.html`
2. Select "Open with" → Choose your browser
3. Or drag `index.html` into your browser

## Testing the Integration

### 1. Verify Backend is Running

```bash
# Test backend API
curl http://localhost:5000/api/products

# Should return JSON with products array
```

### 2. Verify Frontend Connection

1. Open frontend in browser (http://localhost:8000)
2. Open browser console (F12 → Console tab)
3. Check for any errors
4. Try to log in using test credentials:
   - Email: `john@example.com`
   - Password: `User@123`

### 3. Test Key Features

- **Products**: View products on home page (should load from backend)
- **Authentication**: Try logging in with test credentials
- **Shopping Cart**: Add items to cart
- **Checkout**: Complete order flow
- **Admin Features**: Log in as admin (admin@chandni.com / Admin@123)

### 4. Check Network Requests

1. Open browser Developer Tools (F12)
2. Go to "Network" tab
3. Perform an action (e.g., load products, login)
4. You should see requests to `http://localhost:5000/api/*`
5. Check response status (should be 200 for success)

## Troubleshooting

### Frontend Can't Connect to Backend

**Problem**: "Network error" or "Cannot connect to API"

**Solutions**:
1. Verify backend is running: `http://localhost:5000/api/products`
2. Check `js/core/config.js` for correct `baseUrl`
3. Check browser console for specific error messages
4. Verify firewall isn't blocking port 5000
5. Restart both backend and frontend

### MongoDB Connection Error

**Problem**: "Cannot connect to MongoDB"

**Solutions**:
1. Verify MongoDB is running:
   - Windows: Check Services for "MongoDB"
   - macOS: `brew services list` should show mongod running
   - Linux: `sudo systemctl status mongod`
2. Check `MONGO_URI` in `.env`
3. For MongoDB Atlas, ensure:
   - Connection string is correct
   - IP whitelist includes your machine
   - Username/password are correct

### Authentication Issues

**Problem**: Can't log in or JWT errors

**Solutions**:
1. Run seed command: `npm run seed`
2. Check JWT_SECRET in `.env` is set properly
3. Verify token is being stored in localStorage:
   - Open DevTools → Application → Storage → Local Storage
   - Look for `authToken` key
4. Check backend logs for specific error

### CORS Errors

**Problem**: "No 'Access-Control-Allow-Origin' header"

**Solutions**:
1. Verify `CLIENT_URL` in backend `.env` matches frontend URL
2. Ensure backend is running with updated `.env`
3. Clear browser cache and cookies
4. Try in incognito/private mode

### Port Already in Use

**Problem**: "Port 5000 is already in use" or "Port 3000 is already in use"

**Solutions**:
```bash
# Find process using port 5000 (Windows)
netstat -ano | findstr :5000

# Find process using port 5000 (macOS/Linux)
lsof -i :5000

# Kill process (get PID from above command)
# Windows
taskkill /PID <PID> /F

# macOS/Linux
kill -9 <PID>
```

Or change the port in `.env`:
```env
PORT=5001  # Use different port
```

And update frontend config:
```javascript
baseUrl: 'http://localhost:5001/api'
```

## Project Structure

### Backend Directory: `Chandni-Jewellery-Backend-main/`

```
├── config/              # Database configuration
├── controllers/         # Request handlers (Auth, Products, Orders, etc.)
├── middleware/          # Authentication, validation, error handling
├── models/              # MongoDB schemas
├── routes/              # API route definitions
├── utils/               # Helper functions
├── seeders/             # Database seeding scripts
├── uploads/             # User-uploaded files
├── .env                 # Environment variables (create this)
├── package.json         # Backend dependencies
└── server.js            # Entry point
```

### Frontend Directory: `MFCJ/`

```
├── index.html           # Homepage
├── pages/               # Other HTML pages
├── css/                 # Stylesheets
│   ├── base/            # Reset, variables, typography
│   ├── layout/          # Grid, header, footer
│   ├── components/      # Buttons, cards, forms
│   └── pages/           # Page-specific styles
├── js/                  # JavaScript modules
│   ├── app.js           # Main application entry
│   ├── core/            # Config and utilities
│   ├── components/      # UI components
│   ├── controllers/     # MVC controllers
│   ├── models/          # Data models
│   ├── services/        # API service
│   └── features/        # Feature modules
├── assets/              # Images, fonts, icons
├── package.json         # Frontend metadata
└── README.md            # Frontend documentation
```

## API Endpoints Reference

All endpoints are prefixed with `http://localhost:5000/api`

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user (requires token)
- `POST /auth/logout` - Logout user

### Products
- `GET /products` - Get all products
- `GET /products/featured` - Get featured products
- `GET /products/:id` - Get single product

### Cart
- `GET /cart` - Get user's cart (requires token)
- `POST /cart/items` - Add item to cart
- `PUT /cart/items/:itemId` - Update cart item
- `DELETE /cart/items/:itemId` - Remove item from cart

### Orders
- `POST /orders` - Create order (requires token)
- `GET /orders` - Get user's orders (requires token)
- `GET /orders/:id` - Get single order

For complete API documentation, see:
- [Backend README](../Chandni-Jewellery-Backend-main/README.md)
- [Frontend README](./README.md)

## Development Tips

### Hot Module Reloading

For auto-reloading during development:

**Backend**:
```bash
npm run dev
```

**Frontend**:
- Python server: Use browser refresh (F5)
- Or use IDE extension like "Live Server" for VS Code

### Debugging

**Frontend**: Press `F12` to open Developer Tools
- Console: View logs and errors
- Network: Monitor API calls
- Storage: View localStorage/sessionStorage
- Debugger: Set breakpoints in code

**Backend**: Check terminal output or add logging
```javascript
console.log('Debug info:', data);
```

### Testing Credentials

After running seed script:

**Admin Account**
- Email: `admin@chandni.com`
- Password: `Admin@123`

**User Account**
- Email: `john@example.com`
- Password: `User@123`

**Test Promo Codes**
- `WELCOME10` - 10% off first order (min $100)
- `SAVE20` - 20% off orders above $200
- `FREESHIP` - Free shipping on all orders

## Next Steps

1. **Customize Site**: Update branding in `js/core/config.js`
2. **Add Products**: Use admin panel or API
3. **Configure Email**: Set SMTP settings in `.env`
4. **Set Up Payment**: Configure Stripe/payment gateway
5. **Deploy**: See deployment guides in respective README files

## Support & Resources

- [Backend README](../Chandni-Jewellery-Backend-main/README.md)
- [Frontend README](./README.md)
- [API Integration Guide](./API_INTEGRATION_GUIDE.md)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)

## License

MIT License - See LICENSE file for details
