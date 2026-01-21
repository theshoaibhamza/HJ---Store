# Getting Started with Chandni Jewellery

Your complete guide to setting up and running the Chandni Jewellery e-commerce platform.

## 🎯 5-Minute Quick Start (Windows)

```bash
cd e:\website
start-dev.bat
```

Then open your browser to `http://localhost:8000`

That's it! Both backend and frontend will start automatically.

---

## 📖 Complete Step-by-Step Setup

### Step 1: Verify Prerequisites

Before you start, ensure you have:

**Check Node.js:**
```bash
node --version
# Should be v14 or higher
```

**Check npm:**
```bash
npm --version
# Should be v6 or higher
```

**Download if needed:**
- Node.js: https://nodejs.org/ (Download LTS version)
- This includes npm automatically

### Step 2: Prepare Your Computer

#### Option A: MongoDB Local (Recommended for Development)

**Windows:**
1. Download: https://www.mongodb.com/try/download/community
2. Run installer
3. Select "Install MongoDB as a Service"
4. MongoDB will start automatically

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongod
```

#### Option B: MongoDB Atlas (Cloud - Easier)

1. Visit: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create new project and cluster (free tier)
4. Create database user
5. Whitelist your IP address
6. Get connection string
7. Keep the connection string for later

### Step 3: Backend Setup

**Open Terminal/PowerShell and run:**

```bash
# Navigate to backend directory
cd e:\website\Chandni-Jewellery-Backend-main

# Install dependencies (first time only)
npm install

# Create .env file (use one of the templates below)
```

**Create `.env` file with one of these options:**

**Option A: Local MongoDB**
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/chandni_ecommerce
JWT_SECRET=your_super_secret_key_at_least_32_characters_long_12345
JWT_EXPIRE=30d
BCRYPT_SALT_ROUNDS=12
CLIENT_URL=http://localhost:3000
MAX_FILE_SIZE=5000000
FILE_UPLOAD_PATH=./uploads
```

**Option B: MongoDB Atlas (Cloud)**
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/chandni_ecommerce?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_at_least_32_characters_long_12345
JWT_EXPIRE=30d
BCRYPT_SALT_ROUNDS=12
CLIENT_URL=http://localhost:3000
MAX_FILE_SIZE=5000000
FILE_UPLOAD_PATH=./uploads
```

**Then seed the database:**
```bash
npm run seed
```

This creates sample data:
- Admin user: admin@chandni.com / Admin@123
- Test user: john@example.com / User@123
- Sample products
- Promo codes

**Start the backend:**
```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
✅ Connected to MongoDB: chandni_ecommerce
```

**Keep this terminal open!** ✋

### Step 4: Frontend Setup

**Open NEW Terminal/PowerShell and run:**

```bash
# Navigate to frontend directory
cd e:\website\MFCJ

# Optional: Install dependencies (not required)
npm install

# Start frontend server
python -m http.server 8000
```

You should see:
```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/)
```

**Keep this terminal open!** ✋

### Step 5: Test It Works

1. **Open browser** to: http://localhost:8000
2. **Verify homepage** loads with products
3. **Try to login** with:
   - Email: john@example.com
   - Password: User@123
4. **Add item to cart**
5. **Proceed to checkout**

If you see products loading, you're good to go! 🎉

---

## 🆘 Troubleshooting

### Problem: "Cannot find module 'express'"

**Solution:**
```bash
# Make sure you're in the backend directory
cd Chandni-Jewellery-Backend-main
npm install
```

### Problem: "MongoDB connection failed"

**Solution 1: Start MongoDB locally**
```bash
# Windows (MongoDB already set to autostart)
# If not started, search "Services" and start "MongoDB"

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Solution 2: Use MongoDB Atlas**
1. Update MONGO_URI in .env
2. Restart backend

### Problem: "Port 5000 already in use"

**Solution:**
```bash
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace XXXXX with PID)
taskkill /PID XXXXX /F

# Or use different port in .env
PORT=5001
```

### Problem: "Cannot GET /" or products not loading

**Solution:**
1. Verify backend is running: http://localhost:5000/api/products
2. Check browser console (F12 → Console tab)
3. Check backend console for errors
4. Verify API URL in `MFCJ/js/core/config.js`

### Problem: Login doesn't work

**Solution:**
1. Run `npm run seed` in backend directory (creates test users)
2. Use exact credentials:
   - Email: `john@example.com`
   - Password: `User@123`
3. Check backend console for errors

### Problem: "CORS error" or "blocked by CORS policy"

**Solution:**
1. Verify backend is running
2. Check `CLIENT_URL` in backend .env matches your setup
3. Restart backend after changing .env

---

## 📂 Important Files to Know

### Backend
- **`.env`** - Configuration (IMPORTANT: Never commit this!)
- **`server.js`** - Starts the server
- **`seeders/seedDatabase.js`** - Creates sample data
- **`controllers/`** - Handles requests
- **`models/`** - Database schemas

### Frontend
- **`index.html`** - Homepage
- **`js/core/config.js`** - Configuration (verify API URL here)
- **`js/services/ApiService.js`** - Handles API calls
- **`js/models/`** - Data models
- **`js/controllers/`** - UI logic
- **`pages/`** - Other HTML pages

---

## 🔐 Test Accounts

After running `npm run seed`:

| Account | Email | Password | Role |
|---------|-------|----------|------|
| User | john@example.com | User@123 | User |
| Admin | admin@chandni.com | Admin@123 | Admin |

## 🎟️ Test Promo Codes

- `WELCOME10` - 10% off
- `SAVE20` - 20% off
- `FREESHIP` - Free shipping

---

## 📱 Testing Features

### Try These to Verify Everything Works

1. **View Products**
   - Homepage should load products
   - Click on product for details

2. **Search Products**
   - Use search bar to find items
   - Filter by category

3. **Login**
   - Use test credentials
   - Should show user profile

4. **Add to Cart**
   - Click "Add to Cart"
   - Open cart drawer
   - Adjust quantities

5. **Promo Code**
   - In checkout, try: WELCOME10
   - Should apply discount

6. **Place Order**
   - Fill shipping info
   - Review order
   - Submit order

---

## 🔥 Common Workflows

### Development Changes

**If you modify backend code:**
- Backend auto-reloads (thanks to npm run dev)
- Test changes in http://localhost:5000/api

**If you modify frontend code:**
- Refresh browser (F5 or Ctrl+R)
- Or use browser live reload extension

### Viewing Logs

**Backend logs (where `npm run dev` is running):**
- Shows all API requests
- Shows errors
- Shows connection status

**Browser logs (F12 → Console):**
- Shows frontend errors
- Shows API response data
- Shows warnings

### Database Changes

**Reset database:**
```bash
# Delete all data and reseed
npm run seed
```

**View database:**
```bash
# Open MongoDB Shell
mongosh

# Connect to database
use chandni_ecommerce

# View data
db.products.find()
db.users.find()
db.orders.find()
```

---

## 📚 Full Documentation

For detailed information, see:

1. **[Complete Setup Guide](SETUP.md)** - Detailed installation
2. **[Integration Checklist](INTEGRATION_CHECKLIST.md)** - Verify everything
3. **[Backend Documentation](Chandni-Jewellery-Backend-main/README.md)** - API details
4. **[Frontend Documentation](MFCJ/README.md)** - UI components
5. **[API Integration Guide](MFCJ/API_INTEGRATION_GUIDE.md)** - API endpoints

---

## ❓ FAQ

**Q: Do I need to install anything else?**
A: No, just Node.js and MongoDB. Python might be helpful for the development server.

**Q: Can I use a different database?**
A: Currently configured for MongoDB. Backend code would need changes for other databases.

**Q: Can I run on different ports?**
A: Yes! Change PORT in .env file. Update frontend config.js to match.

**Q: How do I use MongoDB Atlas instead of local?**
A: Update MONGO_URI in .env with your Atlas connection string.

**Q: Where do I put my API keys?**
A: In the .env file (never commit it to git).

**Q: How do I deploy to production?**
A: See "Production Deployment" section in [SETUP.md](SETUP.md)

**Q: Is there a limit on the number of products?**
A: No, as long as MongoDB has space.

**Q: Can multiple users use the system?**
A: Yes! Each user has their own account.

**Q: How do I add new products?**
A: Use the admin panel or API directly.

**Q: Is the data persistent?**
A: Yes, it's saved in MongoDB.

---

## 🎓 Learning Resources

### Frontend Learning
- HTML: https://developer.mozilla.org/en-US/docs/Web/HTML
- CSS: https://developer.mozilla.org/en-US/docs/Web/CSS
- JavaScript: https://developer.mozilla.org/en-US/docs/Web/JavaScript

### Backend Learning
- Node.js: https://nodejs.org/en/docs/
- Express.js: https://expressjs.com/
- MongoDB: https://docs.mongodb.com/
- JWT: https://jwt.io/introduction

### Development Tools
- VS Code: https://code.visualstudio.com/
- Postman: https://www.postman.com/
- MongoDB Compass: https://www.mongodb.com/products/compass

---

## ✅ Next Steps

Once everything is working:

1. **Explore the codebase**
   - Check the file structure
   - Understand the MVC pattern
   - Review the code comments

2. **Make a small change**
   - Change a color in CSS
   - Update a product description
   - See your changes live

3. **Add a new feature**
   - Add a new field to products
   - Create a new page
   - Add API endpoint

4. **Deploy somewhere**
   - Heroku (easy, free tier)
   - AWS (scalable)
   - DigitalOcean (affordable)

---

## 🤝 Getting Help

If something doesn't work:

1. **Check the error message** - Usually tells you what's wrong
2. **Check relevant README** - Answers are often there
3. **Check troubleshooting section** - Common issues listed
4. **Check console logs** - Browser (F12) and backend terminal
5. **Create an issue** - If stuck, describe the problem

---

## 🎉 You're Ready!

Congratulations! Your development environment is set up.

**Now you can:**
- ✅ Develop new features
- ✅ Test the application
- ✅ Explore the codebase
- ✅ Learn full-stack development
- ✅ Deploy to production

### Bookmark These Links:
- **Frontend**: http://localhost:8000
- **Backend API**: http://localhost:5000/api
- **Backend Docs**: http://localhost:5000/api/docs (if available)

**Happy coding! 🚀**

---

**Questions?** See the full documentation files or check the troubleshooting section.
