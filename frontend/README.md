# Chandni Jewellery - Complete E-Commerce Platform

A full-stack e-commerce platform built with modern web technologies, featuring a beautiful frontend interface and a robust backend API.

## 📋 Quick Links

- **Frontend**: [MFCJ/README.md](MFCJ/README.md) - HTML, CSS, JavaScript frontend
- **Backend**: [Chandni-Jewellery-Backend-main/README.md](Chandni-Jewellery-Backend-main/README.md) - Node.js, Express, MongoDB API
- **Setup Guide**: [SETUP.md](SETUP.md) - Complete installation instructions
- **Integration Checklist**: [INTEGRATION_CHECKLIST.md](INTEGRATION_CHECKLIST.md) - Verification checklist
- **Quick Start**: [start-dev.bat](start-dev.bat) - Windows quick start script

## 🚀 Quick Start (Windows)

Run the Windows quick start script from the root directory:

```bash
start-dev.bat
```

This will:
1. Check Node.js and MongoDB installation
2. Install backend dependencies
3. Install frontend dependencies
4. Start backend server (http://localhost:5000)
5. Start frontend server (http://localhost:8000)

**Manual Quick Start:**

**Terminal 1 - Backend:**
```bash
cd Chandni-Jewellery-Backend-main
npm install
npm run seed
npm run dev
# Backend runs on http://localhost:5000/api
```

**Terminal 2 - Frontend:**
```bash
cd MFCJ
python -m http.server 8000
# Frontend runs on http://localhost:8000
```

Then open your browser to `http://localhost:8000`

## 📁 Project Structure

```
website/
├── Chandni-Jewellery-Backend-main/      # Backend API server
│   ├── config/                          # Database config
│   ├── controllers/                     # Request handlers
│   ├── middleware/                      # Auth, validation, etc.
│   ├── models/                          # MongoDB schemas
│   ├── routes/                          # API routes
│   ├── utils/                           # Helper functions
│   ├── seeders/                         # Database seeds
│   ├── package.json                     # Backend dependencies
│   ├── server.js                        # Entry point
│   ├── README.md                        # Backend documentation
│   └── INSTALLATION.md                  # Backend setup guide
│
├── MFCJ/                                # Frontend application
│   ├── index.html                       # Homepage
│   ├── pages/                           # HTML pages
│   ├── css/                             # Stylesheets
│   ├── js/                              # JavaScript modules
│   ├── assets/                          # Images, fonts, icons
│   ├── package.json                     # Frontend metadata
│   ├── README.md                        # Frontend documentation
│   ├── SETUP.md                         # Frontend setup guide
│   └── API_INTEGRATION_GUIDE.md        # API integration details
│
├── start-dev.bat                        # Windows quick start script
├── SETUP.md                             # Main setup guide
├── INTEGRATION_CHECKLIST.md             # Integration verification
└── README.md                            # This file
```

## 🛠 Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox
- **JavaScript (ES6+)** - Vanilla JS, no frameworks
- **Responsive Design** - Mobile-first approach
- **Accessibility** - WCAG 2.1 AA compliant

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Document database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads

### Development Tools
- **npm** - Package management
- **Git** - Version control
- **MongoDB Atlas** - Cloud database (optional)
- **Postman** - API testing
- **VS Code** - Code editor

## 📦 Key Features

### Frontend
✅ Responsive & mobile-friendly design
✅ Product browsing and search
✅ Shopping cart
✅ User authentication
✅ Order management
✅ User profile management
✅ Wishlist functionality
✅ Multi-currency support
✅ Advanced filtering & sorting
✅ Toast notifications
✅ Cookie consent banner
✅ Accessibility features

### Backend
✅ RESTful API
✅ User authentication (JWT)
✅ Password hashing (Bcrypt)
✅ Role-based access control (Admin/User)
✅ Product management
✅ Shopping cart
✅ Order processing
✅ Promo code system
✅ User management
✅ Address management
✅ File uploads
✅ Error handling
✅ Rate limiting
✅ Input validation

### Integration
✅ Real-time API communication
✅ Token-based authentication
✅ Error handling
✅ CORS support
✅ Environment configuration
✅ Database seeding
✅ API documentation

## 🔑 Test Credentials

After running `npm run seed` in the backend:

**User Account**
- Email: `john@example.com`
- Password: `User@123`

**Admin Account**
- Email: `admin@chandni.com`
- Password: `Admin@123`

**Test Promo Codes**
- `WELCOME10` - 10% off first order (min $100)
- `SAVE20` - 20% off orders above $200
- `FREESHIP` - Free shipping on all orders

## 📚 API Endpoints (Base: http://localhost:5000/api)

### Authentication
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `GET /auth/me` - Current user (private)
- `POST /auth/logout` - Logout (private)

### Products
- `GET /products` - Get all products
- `GET /products/featured` - Featured products
- `GET /products/:id` - Single product

### Cart
- `GET /cart` - Get cart (private)
- `POST /cart/items` - Add to cart (private)
- `DELETE /cart/items/:itemId` - Remove item (private)

### Orders
- `POST /orders` - Create order (private)
- `GET /orders` - User orders (private)
- `GET /orders/:id` - Order details (private)

### User
- `GET /users/profile` - Profile (private)
- `PUT /users/profile` - Update profile (private)
- `POST /users/addresses` - Add address (private)

See [API Documentation](MFCJ/API_INTEGRATION_GUIDE.md) for complete reference.

## 🎯 Installation

### Prerequisites
- Node.js v14+
- MongoDB (local or Atlas)
- npm v6+
- Git (optional)

### Step-by-Step Guide

1. **Clone/Navigate to project**
```bash
cd website
```

2. **Setup Backend** (see [Backend INSTALLATION](Chandni-Jewellery-Backend-main/INSTALLATION.md))
```bash
cd Chandni-Jewellery-Backend-main
npm install
# Create .env file with configuration
npm run seed  # Optional: add sample data
npm run dev   # Start backend
```

3. **Setup Frontend** (see [Frontend SETUP](MFCJ/SETUP.md))
```bash
cd ../MFCJ
npm install  # Optional: no required dependencies
python -m http.server 8000  # Start frontend
```

4. **Verify Integration**
- Open http://localhost:8000 in browser
- Test login with provided credentials
- See [Integration Checklist](INTEGRATION_CHECKLIST.md) for complete verification

For detailed setup instructions, see [SETUP.md](SETUP.md)

## 🔧 Configuration

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/chandni_ecommerce
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
```

### Frontend (js/core/config.js)
```javascript
export const Config = {
  api: {
    baseUrl: 'http://localhost:5000/api'
  },
  currency: {
    code: 'PKR',
    symbol: '₨',
    locale: 'en-PK'
  }
  // ... more config
};
```

## 📖 Documentation

- [Backend README](Chandni-Jewellery-Backend-main/README.md) - Backend documentation
- [Backend Installation](Chandni-Jewellery-Backend-main/INSTALLATION.md) - Backend setup
- [Frontend README](MFCJ/README.md) - Frontend documentation
- [Frontend Setup](MFCJ/SETUP.md) - Frontend setup
- [API Integration Guide](MFCJ/API_INTEGRATION_GUIDE.md) - API integration details
- [Integration Checklist](INTEGRATION_CHECKLIST.md) - Verification checklist
- [Main Setup Guide](SETUP.md) - Complete setup for both

## 🚀 Development

### File Structure
- **Controllers**: Handle request logic
- **Models**: Define data schemas
- **Services**: API communication layer
- **Middleware**: Request processing
- **Routes**: API endpoints
- **Views**: HTML pages
- **Styles**: CSS organization
- **Components**: Reusable UI elements

### Code Quality
- Follows MVC architecture
- ES6+ JavaScript
- Semantic HTML5
- BEM CSS naming
- Error handling
- Input validation
- Security best practices

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes
git add .
git commit -m "Description of changes"

# Push to remote
git push origin feature/feature-name

# Create Pull Request
```

## 🐛 Troubleshooting

### Common Issues

**Backend won't start**
- Check MongoDB is running
- Verify `.env` configuration
- Ensure port 5000 is available
- See [Backend INSTALLATION](Chandni-Jewellery-Backend-main/INSTALLATION.md) troubleshooting

**Frontend can't connect to backend**
- Verify backend is running on correct port
- Check API base URL in `js/core/config.js`
- Verify CORS is enabled on backend
- See [Integration Checklist](INTEGRATION_CHECKLIST.md) troubleshooting

**Database errors**
- Verify MongoDB connection string
- Check database credentials
- Ensure database exists
- Run `npm run seed` to initialize

## 🔒 Security

- ✅ Passwords hashed with Bcrypt
- ✅ JWT token authentication
- ✅ Input validation & sanitization
- ✅ CORS protection
- ✅ Environment variables for secrets
- ✅ Error messages don't leak info
- ✅ SQL/NoSQL injection prevention
- ✅ XSS protection

**Before Production:**
- Change all default secrets
- Use HTTPS/SSL
- Enable rate limiting
- Set up monitoring
- Configure backups
- Review security headers

## 📱 Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Latest 2 versions |
| Firefox | ✅ Latest 2 versions |
| Safari | ✅ Latest 2 versions |
| Edge | ✅ Latest 2 versions |
| iOS Safari | ✅ Latest 2 versions |
| Chrome Android | ✅ Latest 2 versions |

## 🌐 Deployment

### Production Checklist
- [ ] Use HTTPS/SSL
- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas or hosted database
- [ ] Configure environment variables
- [ ] Enable rate limiting
- [ ] Set up error logging
- [ ] Enable monitoring
- [ ] Configure backups
- [ ] Test all features

### Deployment Platforms
- Heroku - Simple deployment
- AWS - Scalable infrastructure
- Azure - Microsoft cloud
- DigitalOcean - Affordable VPS
- Vercel - Frontend hosting

## 👥 Team

Developed by the Chandni Jewellery team

## 📄 License

MIT License - See LICENSE files in respective directories

## 🤝 Contributing

1. Read contributing guidelines
2. Create feature branch
3. Make changes following code standards
4. Test thoroughly
5. Submit pull request
6. Wait for review and approval

## 📞 Support

For issues or questions:
1. Check relevant README files
2. Review Integration Checklist
3. Check troubleshooting sections
4. Create GitHub issue with details
5. Contact development team

## 📈 Project Status

- ✅ Core functionality complete
- ✅ Frontend polished
- ✅ Backend tested
- ✅ Documentation complete
- ⏳ Payment integration (in progress)
- ⏳ Email notifications (in progress)
- ⏳ Analytics (planned)

## 🔗 Quick Links

| Link | Purpose |
|------|---------|
| [Frontend](MFCJ/) | Frontend application |
| [Backend](Chandni-Jewellery-Backend-main/) | Backend API |
| [Setup Guide](SETUP.md) | Installation guide |
| [API Docs](MFCJ/API_INTEGRATION_GUIDE.md) | API documentation |
| [Checklist](INTEGRATION_CHECKLIST.md) | Verification guide |

---

**Last Updated:** January 2026

**Next Steps:**
1. Follow [SETUP.md](SETUP.md) for installation
2. Use [INTEGRATION_CHECKLIST.md](INTEGRATION_CHECKLIST.md) to verify
3. Start developing features
4. Deploy to production

**Questions?** Check the relevant README files or see the troubleshooting section.
