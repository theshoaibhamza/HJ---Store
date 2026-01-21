# Chandni Jewellery - Integration Checklist

Use this checklist to verify that your frontend and backend are properly integrated and working correctly.

## Pre-Setup Checklist

- [ ] Node.js v14+ installed (`node --version`)
- [ ] npm v6+ installed (`npm --version`)
- [ ] MongoDB running or MongoDB Atlas connection string ready
- [ ] Git installed (optional but recommended)
- [ ] Code editor installed (VS Code, Sublime, etc.)
- [ ] Multiple terminal windows available

## Backend Setup Checklist

### Installation
- [ ] Backend repository cloned/located at `e:\website\Chandni-Jewellery-Backend-main`
- [ ] Navigated to backend directory
- [ ] Ran `npm install` successfully
- [ ] All dependencies installed without errors

### Configuration
- [ ] Created `.env` file in backend root
- [ ] Set `NODE_ENV=development`
- [ ] Set `PORT=5000`
- [ ] Set `MONGO_URI` (local or Atlas)
- [ ] Set strong `JWT_SECRET` (at least 32 characters)
- [ ] Set `JWT_EXPIRE=30d`
- [ ] Set `CLIENT_URL=http://localhost:3000` or your frontend URL
- [ ] All required variables filled in `.env`

### Database
- [ ] MongoDB server is running
  - [ ] Windows: MongoDB service running in Services
  - [ ] macOS: `brew services list` shows mongod running
  - [ ] Linux: `sudo systemctl status mongod` shows active
- [ ] OR MongoDB Atlas configured with correct connection string
- [ ] Connection string tested

### Database Seeding
- [ ] Ran `npm run seed` successfully
- [ ] No errors during seed process
- [ ] Sample data created in MongoDB

### Server Startup
- [ ] Backend started with `npm run dev`
- [ ] Terminal shows: "Server running on http://localhost:5000"
- [ ] Terminal shows: "Connected to MongoDB"
- [ ] No error messages in backend terminal

### Backend Verification
- [ ] Can access `http://localhost:5000/api/products` in browser
  - [ ] Returns JSON array
  - [ ] Contains product objects
- [ ] Attempted test login with curl or Postman:
  ```
  POST http://localhost:5000/api/auth/login
  Body: {"email":"john@example.com","password":"User@123"}
  ```
  - [ ] Returns 200 status
  - [ ] Response includes JWT token
- [ ] Admin endpoints accessible (e.g., `/api/orders/admin/all`)

## Frontend Setup Checklist

### Installation
- [ ] Frontend repository located at `e:\website\MFCJ`
- [ ] Navigated to frontend directory
- [ ] Ran `npm install` (optional, frontend has no hard dependencies)
- [ ] No installation errors

### Configuration
- [ ] Opened `js/core/config.js`
- [ ] Verified `api.baseUrl` points to backend:
  ```javascript
  baseUrl: 'http://localhost:5000/api'
  ```
- [ ] If backend on different host/port, updated accordingly
- [ ] Verified all other config settings (currency, breakpoints, etc.)

### Frontend Server
- [ ] Development server started (Python, Node.js, or IDE Live Server)
- [ ] Can access frontend in browser:
  - [ ] Python: `http://localhost:8000`
  - [ ] Node.js: `http://localhost:3000`
  - [ ] IDE: Check configured port
- [ ] No errors in browser console (F12 → Console)
- [ ] Page loads without visual issues

## Integration Verification Checklist

### Network Connection
- [ ] Browser console shows no CORS errors
- [ ] Browser DevTools Network tab shows requests to backend
- [ ] Network requests have 200/201 status codes
- [ ] Network requests include Authorization header where needed

### Data Loading
- [ ] Homepage loads products from backend
  - [ ] Products appear on page
  - [ ] Product names and images display
  - [ ] Prices shown in correct currency
- [ ] Featured products section loads
- [ ] Categories load correctly
- [ ] Search functionality works
- [ ] Product filtering works

### Authentication
- [ ] Login form accessible on `/pages/login.html`
- [ ] Can log in with test credentials:
  - [ ] Email: `john@example.com`
  - [ ] Password: `User@123`
  - [ ] After login: Redirected to home or dashboard
  - [ ] User profile shows in top nav
- [ ] JWT token stored in localStorage (DevTools → Application → Storage)
- [ ] Can access protected pages (cart, orders, profile)
- [ ] Can logout successfully
- [ ] After logout: Redirected to login/home

### Admin Functions
- [ ] Can log in as admin: `admin@chandni.com` / `Admin@123`
- [ ] Admin panel accessible
- [ ] Can view all orders
- [ ] Can view all users
- [ ] Can create/edit products
- [ ] Can manage promo codes

### Shopping Features
- [ ] Add to cart works
- [ ] Cart items persist (check localStorage)
- [ ] Can update cart quantity
- [ ] Can remove items from cart
- [ ] Cart total calculates correctly
- [ ] Promo code validation works
  - [ ] Test with: `WELCOME10`, `SAVE20`, `FREESHIP`
  - [ ] Discount applies correctly
- [ ] Can proceed to checkout

### Order Management
- [ ] Can create order with valid data
- [ ] Order stored in backend database
- [ ] Can view order history
- [ ] Can view order details
- [ ] Order status updates work (admin)
- [ ] Payment status can be updated (admin)
- [ ] Can cancel order

### User Profile
- [ ] Can update profile information
- [ ] Changes saved to backend
- [ ] Can add shipping addresses
- [ ] Can edit addresses
- [ ] Can delete addresses
- [ ] Can change password
- [ ] Password change requires old password

### Error Handling
- [ ] Invalid login shows error message
- [ ] Network error displays gracefully
- [ ] Form validation errors show
- [ ] API errors display user-friendly messages
- [ ] No JavaScript errors in console
- [ ] Broken images handled properly

## Performance Checklist

- [ ] Frontend loads in < 3 seconds
- [ ] Products load in < 2 seconds
- [ ] Search responds in < 1 second
- [ ] No console warnings about:
  - [ ] Unused imports
  - [ ] Deprecated functions
  - [ ] Missing dependencies
- [ ] DevTools Lighthouse score acceptable:
  - [ ] Performance: > 70
  - [ ] Accessibility: > 80
  - [ ] Best Practices: > 80
  - [ ] SEO: > 80

## Browser Compatibility Checklist

Test in each supported browser:

### Chrome/Chromium
- [ ] Homepage loads correctly
- [ ] Console shows no errors
- [ ] Login works
- [ ] Add to cart works

### Firefox
- [ ] Homepage loads correctly
- [ ] Console shows no errors
- [ ] Login works
- [ ] Add to cart works

### Safari (macOS/iOS)
- [ ] Homepage loads correctly
- [ ] Console shows no errors
- [ ] Login works
- [ ] Add to cart works

### Edge
- [ ] Homepage loads correctly
- [ ] Console shows no errors
- [ ] Login works
- [ ] Add to cart works

## Mobile Checklist

Test on mobile device or mobile emulation (DevTools):

- [ ] Responsive design works
- [ ] Navigation works on mobile
- [ ] Touch interactions work
- [ ] Carousel swipe works
- [ ] Modal/drawer works
- [ ] Forms accessible on small screens
- [ ] Images load properly
- [ ] No horizontal scroll at any breakpoint

## Security Checklist

- [ ] `.env` not committed to git (check `.gitignore`)
- [ ] JWT token expires after inactivity
- [ ] Passwords hashed (check database)
- [ ] Sensitive data not logged to console
- [ ] CORS properly configured
- [ ] Input validation working
- [ ] XSS protection in place:
  - [ ] HTML sanitization
  - [ ] No eval() usage
  - [ ] No innerHTML with user data
- [ ] CSRF tokens present (if applicable)

## Troubleshooting Applied Checklist

If issues encountered and fixed:

- [ ] Backend connection issues resolved
- [ ] CORS errors fixed
- [ ] MongoDB connection issues resolved
- [ ] Port conflicts resolved
- [ ] Environment variables set correctly
- [ ] API endpoints verified
- [ ] Authentication errors debugged
- [ ] Network requests verified in DevTools

## Documentation Checklist

- [ ] Read backend README
- [ ] Read frontend README
- [ ] Read SETUP.md
- [ ] Read API_INTEGRATION_GUIDE.md
- [ ] Reviewed project structure
- [ ] Understood file organization
- [ ] Familiar with code patterns (MVC, Services, Models)

## Ready for Development Checklist

- [ ] All above checkboxes checked
- [ ] Backend running without errors
- [ ] Frontend loading all data correctly
- [ ] Authentication working
- [ ] Shopping cart functional
- [ ] Can create orders
- [ ] Admin panel accessible
- [ ] No console errors
- [ ] Ready to customize and add features

## Common Issues Troubleshooting

### If Backend Won't Connect

1. Verify backend URL in `js/core/config.js`
2. Check backend is running: `http://localhost:5000/api/products`
3. Clear browser cache and localStorage
4. Check browser console for specific error
5. Verify firewall isn't blocking port 5000
6. Restart both backend and frontend

### If Products Won't Load

1. Check backend is running
2. Check MongoDB is running
3. Check `npm run seed` completed successfully
4. Verify no errors in backend console
5. Check network tab in DevTools (should show `/products` request)
6. Check response status and body in DevTools

### If Login Fails

1. Verify test credentials in seed data:
   - Email: `john@example.com`
   - Password: `User@123`
2. Check backend is running
3. Check JWT_SECRET is set in `.env`
4. Clear localStorage and try again
5. Check browser console for error details
6. Verify network request shows 200 status

### If Getting CORS Errors

1. Verify `CLIENT_URL` in backend `.env`
2. Restart backend after changing `.env`
3. Clear browser cache
4. Check CORS middleware in backend
5. Verify no typos in URLs
6. Try incognito/private mode

## Performance Optimization Checklist

- [ ] Enable compression in backend
- [ ] Enable caching headers
- [ ] Minify CSS and JavaScript
- [ ] Optimize images
- [ ] Lazy load images
- [ ] Enable CDN for static assets
- [ ] Database indexes created
- [ ] Query optimization reviewed

## Deployment Preparation Checklist

- [ ] Environment-specific configurations
- [ ] Production `.env` created (separate from dev)
- [ ] Secrets securely stored
- [ ] HTTPS/SSL configured
- [ ] Database backups configured
- [ ] Error logging enabled
- [ ] Monitoring setup
- [ ] Deployment scripts created

## Final Sign-Off

- [ ] Developer: _________________ Date: _________
- [ ] QA: _________________ Date: _________
- [ ] Ready for Production: [ ] Yes [ ] No

---

**Notes & Issues Found:**

(Add any notes, issues, or special configurations here)

---

**References:**
- [Backend README](../Chandni-Jewellery-Backend-main/README.md)
- [Frontend README](./README.md)
- [Backend INSTALLATION Guide](../Chandni-Jewellery-Backend-main/INSTALLATION.md)
- [Frontend SETUP Guide](./SETUP.md)
- [API Integration Guide](./API_INTEGRATION_GUIDE.md)
