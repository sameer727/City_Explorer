# City Explorer - Complete Setup & Running Guide

## 📋 Prerequisites

- **Node.js**: v16 or higher
- **npm** or **yarn**: Package manager
- **Git**: Version control (optional)
- **MongoDB**: Local or Atlas (for backend)

Check versions:
```bash
node --version    # Should be v16+
npm --version     # Should be v8+
```

---

## 🔧 Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File
Create a `.env` file in the backend directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/city-explorer
JWT_SECRET=your_super_secret_key_here_change_this
NODE_ENV=development
```

**For MongoDB Atlas** (cloud):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/city-explorer?retryWrites=true&w=majority
```

### 4. Start Backend Server
```bash
npm start
# or
npm run dev    # If nodemon is configured
```

**Expected Output**:
```
Server running on http://localhost:3000
Connected to MongoDB
```

✅ Backend is now running on `http://localhost:3000`

---

## 🎨 Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File (Optional)
Create `.env.local` in frontend directory if you need custom API URL:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

*(Default is already set to `http://localhost:3000/api`)*

### 4. Start Development Server
```bash
npm run dev
```

**Expected Output**:
```
  VITE v5.0.0  ready in 123 ms

  ➜  Local:   http://localhost:5173/
```

✅ Frontend is now running on `http://localhost:5173`

---

## 🚀 Running Both Servers Together

### Option 1: Use Two Terminal Windows

**Terminal 1 - Backend**:
```bash
cd backend
npm start
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

### Option 2: Use npm-run-all (in root directory)

If you have a root `package.json`:
```bash
npm run dev
```

---

## ✅ Verification Checklist

### Backend Running?
```bash
# In browser or terminal:
curl http://localhost:3000
# Should see welcome message
```

### Frontend Running?
```bash
# Open browser:
http://localhost:5173
# Should see City Explorer app
```

### API Connection Working?
1. Go to `http://localhost:5173/login`
2. Try registering with test credentials
3. Check browser DevTools Network tab
4. Should see successful POST to `/api/register`

---

## 🔐 Testing Authentication

### 1. Register New Account
- Go to `http://localhost:5173/login`
- Click "Create one" link
- Fill in: Name, Email, Password
- Click "Create account"
- You should see success message

### 2. Login with Credentials
- Enter email and password
- Click "Sign in"
- Should redirect to `/dashboard`
- Attractions should load from API

### 3. Verify Token Storage
- Open DevTools (F12)
- Go to Console tab
- Type: `localStorage.getItem('token')`
- Should show JWT token string

---

## 📝 Environment Variables Cheat Sheet

### Backend (.env)
```env
# Port
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/city-explorer

# JWT
JWT_SECRET=my_secret_key_change_this_in_production

# Environment
NODE_ENV=development
```

### Frontend (.env.local) - Optional
```env
# API Base URL (already default to localhost:3000)
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## 🐛 Troubleshooting

### Backend Won't Start

**Problem**: `Port 3000 already in use`
```bash
# Find and kill process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

**Problem**: `Cannot connect to MongoDB`
- Ensure MongoDB is running
- Check connection string in `.env`
- Try local: `mongodb://localhost:27017/city-explorer`

---

### Frontend Won't Connect to Backend

**Problem**: `Cannot reach backend API`
- Ensure backend is running on `http://localhost:3000`
- Check VITE_API_BASE_URL in `.env.local`
- Open DevTools > Network to inspect requests

**Problem**: `CORS error`
- Backend should have CORS enabled
- Check backend `server.js` has `app.use(cors())`

---

### Authentication Issues

**Problem**: `Login returns 401 Unauthorized`
- Verify user exists in database
- Check password is correct
- Ensure MongoDB has the users collection

**Problem**: `Token expires immediately`
- Check JWT_SECRET matches between login and protected routes
- Verify token expiration in backend (usually 24h)

---

### Port Already in Use

```bash
# Frontend (5173)
npm run dev -- --port 5174

# Backend (3000)
# In package.json, change port:
PORT=3001 npm start
```

---

## 📊 File Structure After Setup

```
CityExplorer/
├── backend/
│   ├── .env                    # ← Create this
│   ├── node_modules/           # ← Auto-created
│   ├── package.json
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
│
├── frontend/
│   ├── .env.local              # ← Optional
│   ├── node_modules/           # ← Auto-created
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── index.html
│
├── FRONTEND_GUIDE.md
└── API_INTEGRATION_GUIDE.md
```

---

## 🎯 Next Steps After Running

### 1. Test Registration
- Create test account
- Verify in MongoDB

### 2. Test Login
- Login with test credentials
- Verify token in localStorage

### 3. View Dashboard
- Should see attractions from API
- Try search functionality

### 4. Explore Features
- Dark mode toggle (Navbar)
- Responsive design (resize browser)
- Navigation between pages

---

## 📱 Responsive Testing

### Mobile View
- DevTools (F12) → Toggle Device Toolbar
- Or resize browser to 375px width

### Tablet View
- Resize to 768px width

### Desktop View
- Full screen (1920px+)

---

## 🔄 Development Workflow

### During Development

**Backend Changes**:
1. Make changes to backend files
2. If using `nodemon`, server auto-restarts
3. Test in frontend or Postman

**Frontend Changes**:
1. Make changes to React components
2. Vite hot-reload automatically updates browser
3. No need to restart dev server

### Database Seeding

Add sample attractions to MongoDB:

```javascript
// In mongosh or MongoDB Compass
use city-explorer
db.attractions.insertMany([
  {
    name: "Eiffel Tower",
    cityName: "Paris",
    description: "Iconic iron lattice tower",
    category: "Landmark"
  },
  // ... more attractions
])
```

---

## 🚀 Production Deployment

### Build Frontend
```bash
cd frontend
npm run build
# Creates dist/ folder with optimized files
```

### Start Backend (Production)
```bash
NODE_ENV=production npm start
```

### Deploy to Hosting
- Frontend: Netlify, Vercel, GitHub Pages
- Backend: Heroku, Railway, AWS, DigitalOcean

---

## 📚 Useful Commands

```bash
# Backend
npm start           # Start server
npm run dev         # Start with nodemon
npm test           # Run tests (if configured)

# Frontend
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Lint code (if configured)

# General
npm install        # Install dependencies
npm update         # Update packages
npm list           # List installed packages
npm audit         # Check security issues
```

---

## ⚡ Quick Start (Copy-Paste)

```bash
# Backend
cd backend
npm install
cat > .env << EOF
PORT=3000
MONGODB_URI=mongodb://localhost:27017/city-explorer
JWT_SECRET=test_secret_key
NODE_ENV=development
EOF
npm start

# In new terminal, Frontend
cd frontend
npm install
npm run dev

# Open http://localhost:5173
```

---

## 📞 Getting Help

### Check Logs
- Backend: Check terminal output
- Frontend: DevTools Console (F12)
- Network: DevTools Network tab

### Common Log Messages
- `Connected to MongoDB` → DB connected ✅
- `Server running on http://localhost:3000` → Backend ready ✅
- `Local: http://localhost:5173` → Frontend ready ✅

### Debug Mode
```javascript
// In frontend components
console.log('Token:', localStorage.getItem('token'));
console.log('Auth state:', useAuth());
console.log('API response:', response);
```

---

## ✨ You're All Set!

Your City Explorer app is now ready for:
- ✅ Development
- ✅ Testing
- ✅ College project submission
- ✅ Viva demonstration

**Happy coding! 🚀**