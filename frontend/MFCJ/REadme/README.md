# Chandni E-Commerce Backend

A comprehensive RESTful API for an e-commerce platform built with Node.js, Express.js, and MongoDB. Features JWT authentication, bcrypt password hashing, and follows MVC architecture.

## 🚀 Features

### Authentication & Security
- JWT-based authentication
- Bcrypt password hashing
- Role-based access control (Admin/User)
- Request rate limiting
- Input validation and sanitization
- CORS protection
- Helmet security headers

### Core Functionality
- **User Management**: Registration, login, profile management, addresses
- **Product Management**: CRUD operations, categories, search, filtering
- **Shopping Cart**: Add/remove items, quantity management, promo codes
- **Order Management**: Order creation, tracking, status updates
- **Promo Codes**: Discount management, validation, usage tracking
- **Reviews & Ratings**: Product reviews and rating system

### Advanced Features
- File upload support for product images
- Advanced search and filtering
- Pagination for all list endpoints
- Order tracking and history
- Inventory management
- Admin dashboard statistics
- Email validation and phone number validation

## 📁 Project Structure

```
chandni-backend/
├── controllers/           # Request handlers
│   ├── authController.js
│   ├── cartController.js
│   ├── orderController.js
│   ├── productController.js
│   ├── promoCodeController.js
│   └── userController.js
├── middleware/           # Custom middleware
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   ├── upload.js
│   └── validation.js
├── models/              # MongoDB schemas
│   ├── Cart.js
│   ├── Order.js
│   ├── Product.js
│   ├── PromoCode.js
│   └── User.js
├── routes/              # API routes
│   ├── authRoutes.js
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   ├── productRoutes.js
│   ├── promoCodeRoutes.js
│   └── userRoutes.js
├── utils/               # Utility functions
│   └── helpers.js
├── config/              # Configuration files
│   └── database.js
├── seeders/             # Database seeders
│   └── seedDatabase.js
├── uploads/             # File uploads directory
├── .env                 # Environment variables
├── .gitignore
├── package.json
├── README.md
└── server.js           # Entry point
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd chandni-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create a `.env` file in the root directory:
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
Make sure MongoDB is running on your system.

5. **Seed the database** (Optional but recommended)
```bash
npm run seed
```

6. **Start the server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will be running on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | User login | Public |
| GET | `/auth/me` | Get current user profile | Private |
| PUT | `/auth/profile` | Update user profile | Private |
| PUT | `/auth/password` | Change password | Private |
| POST | `/auth/logout` | Logout user | Private |

### Product Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/products` | Get all products (with filters) | Public |
| GET | `/products/:id` | Get single product | Public |
| GET | `/products/featured` | Get featured products | Public |
| GET | `/products/categories` | Get all categories | Public |
| POST | `/products` | Create product | Admin |
| PUT | `/products/:id` | Update product | Admin |
| DELETE | `/products/:id` | Delete product | Admin |
| POST | `/products/:id/reviews` | Add product review | Private |

### Cart Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/cart` | Get user cart | Private |
| POST | `/cart/items` | Add item to cart | Private |
| PUT | `/cart/items/:itemId` | Update cart item | Private |
| DELETE | `/cart/items/:itemId` | Remove item from cart | Private |
| DELETE | `/cart` | Clear cart | Private |
| POST | `/cart/promo` | Apply promo code | Private |
| DELETE | `/cart/promo` | Remove promo code | Private |
| PUT | `/cart/note` | Update order note | Private |

### Order Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/orders` | Create new order | Private |
| GET | `/orders` | Get user orders | Private |
| GET | `/orders/:id` | Get single order | Private |
| PUT | `/orders/:id/cancel` | Cancel order | Private |
| GET | `/orders/admin/all` | Get all orders | Admin |
| GET | `/orders/admin/stats` | Get order statistics | Admin |
| PUT | `/orders/:id/status` | Update order status | Admin |
| PUT | `/orders/:id/payment` | Update payment status | Admin |

### User Management Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/users/profile` | Get current user profile | Private |
| PUT | `/users/profile` | Update current user profile | Private |
| POST | `/users/addresses` | Add new address | Private |
| PUT | `/users/addresses/:addressId` | Update address | Private |
| DELETE | `/users/addresses/:addressId` | Delete address | Private |
| GET | `/users` | Get all users | Admin |
| GET | `/users/:id` | Get single user | Admin |
| PUT | `/users/:id` | Update user | Admin |
| DELETE | `/users/:id` | Delete/deactivate user | Admin |
| GET | `/users/admin/stats` | Get user statistics | Admin |

### Promo Code Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/promocodes` | Get active promo codes | Public |
| POST | `/promocodes/validate` | Validate promo code | Private |
| POST | `/promocodes` | Create promo code | Admin |
| GET | `/promocodes/admin` | Get all promo codes | Admin |
| GET | `/promocodes/:id` | Get single promo code | Admin |
| PUT | `/promocodes/:id` | Update promo code | Admin |
| DELETE | `/promocodes/:id` | Delete promo code | Admin |
| GET | `/promocodes/admin/stats` | Get promo code statistics | Admin |

## 🔐 Authentication

All private endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 📝 Sample API Requests

### Register User
```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

### Create Product (Admin)
```json
POST /api/products
{
  "title": "Wireless Headphones",
  "description": "High-quality wireless headphones",
  "price": 199.99,
  "category": "Electronics",
  "quantity": 50,
  "image_url": ["https://example.com/image.jpg"],
  "colors": ["Black", "White"],
  "isFeatured": true
}
```

### Add to Cart
```json
POST /api/cart/items
{
  "productId": "product_id_here",
  "quantity": 2,
  "selectedColor": "Black"
}
```

### Create Order
```json
POST /api/orders
{
  "shippingInfo": {
    "email": "user@example.com",
    "fname": "John",
    "lname": "Doe",
    "address": "123 Main St",
    "city": "New York",
    "country": "USA",
    "phone_number": "+1234567890"
  },
  "paymentInfo": {
    "method": "card"
  }
}
```

## 🧪 Testing

### Default Admin Account
```
Email: admin@chandni.com
Password: Admin@123
```

### Default User Account
```
Email: john@example.com
Password: User@123
```

### Sample Promo Codes
- `WELCOME10` - 10% off first order (min $100)
- `SAVE20` - 20% off orders above $200
- `FREESHIP` - Free shipping on all orders

## 🚀 Features in Detail

### Product Search & Filtering
- Text search in title and description
- Filter by category, price range, rating
- Sort by price, rating, date, featured status
- Pagination support

### Shopping Cart Features
- Persistent cart per user
- Real-time price calculations
- Tax and shipping calculations
- Promo code support
- Order notes

### Order Management
- Order tracking with status updates
- Order history
- Cancellation support
- Payment status tracking
- Admin order management

### Security Features
- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- Input validation
- CORS protection
- File upload restrictions

## 📊 Database Schema

The application uses the following main collections:
- `users` - User accounts and profiles
- `products` - Product catalog
- `carts` - Shopping carts
- `orders` - Order data
- `promocodes` - Discount codes

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development |
| `PORT` | Server port | 5000 |
| `MONGO_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | 30d |
| `BCRYPT_SALT_ROUNDS` | Bcrypt salt rounds | 12 |
| `CLIENT_URL` | Frontend URL for CORS | http://localhost:3000 |
| `MAX_FILE_SIZE` | Max upload file size | 5000000 |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.
