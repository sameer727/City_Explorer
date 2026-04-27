# 🏙️ City Explorer - Full Stack Application

> A modern, professional, and responsive city exploration web application built with React, Node.js, Express, and MongoDB. Perfect for college projects and demonstrating full-stack development skills.

---

## 📸 Quick Overview

- **Frontend**: React + Tailwind CSS + Vite
- **Backend**: Node.js + Express + MongoDB
- **Authentication**: JWT tokens with secure storage
- **Deployment**: Production-ready architecture

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- npm v8+
- MongoDB (local or Atlas)

### 1️⃣ Setup Backend

```bash
cd backend
npm install

# Create .env file with:
# PORT=3000
# MONGODB_URI=mongodb://localhost:27017/city-explorer
# JWT_SECRET=your_secret_key_here
# NODE_ENV=development

npm start
```
✅ Backend running on `http://localhost:3000`

### 2️⃣ Setup Frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
```
✅ Frontend running on `http://localhost:5173`

### 3️⃣ Test It!

1. Open `http://localhost:5173`
2. Click "Create one" to register
3. Enter email and password
4. Login and see attractions load from API
5. Enjoy! 🎉

---

## ✨ Key Features

### 🔐 Authentication
- ✅ User registration with validation
- ✅ Email + password login
- ✅ JWT token authentication
- ✅ Secure token storage in localStorage
- ✅ Protected routes (auto-redirect to login)
- ✅ Auto-logout on token expiration
- ✅ Password hashing with bcryptjs

### 📊 Dashboard
- ✅ Fetch attractions from API
- ✅ Search by name/city (live filtering)
- ✅ Filter by category
- ✅ Display ratings and descriptions
- ✅ Loading skeleton states
- ✅ Error handling with user feedback
- ✅ Responsive grid layout

### 🎨 UI/UX
- ✅ Modern, professional design
- ✅ Dark mode toggle
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Smooth animations
- ✅ Hover effects on cards
- ✅ Clean, readable typography
- ✅ Intuitive navigation

### 🔧 Developer Features
- ✅ Clean code structure
- ✅ Component-based architecture
- ✅ Global state management (Context API)
- ✅ Axios interceptors for API calls
- ✅ Environment variable management
- ✅ Comprehensive error handling
- ✅ Production build optimization

---

## 📁 Project Structure

```
CityExplorer/
├── backend/                 # Express.js + MongoDB
│   ├── config/             # Database configuration
│   ├── controllers/        # Business logic
│   ├── middleware/         # JWT authentication
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── server.js
│   └── .env               # Environment variables
│
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Global state (Auth)
│   │   ├── lib/           # API client & utilities
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── PROJECT_SUMMARY.md      # Complete project overview
├── FRONTEND_GUIDE.md       # Frontend documentation
├── API_INTEGRATION_GUIDE.md # API endpoints guide
├── SETUP_GUIDE.md          # Detailed setup instructions
└── README.md              # This file
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/register      Register new user
POST   /api/login         Login (returns JWT token)
```

### Attractions (Protected)
```
GET    /api/attractions   Get all attractions
GET    /api/attractions/favorites    Get user's favorites
POST   /api/attractions/favorites    Add to favorites
POST   /api/attractions/review       Add review
GET    /api/attractions/reviews/:id  Get reviews
```

---

## 🔐 How Authentication Works

```
1. User registers → POST /api/register
2. User logs in → POST /api/login (receives JWT token)
3. Token stored in localStorage
4. Every API request includes: Authorization: Bearer <token>
5. Backend verifies token
6. If expired → Auto logout & redirect to login
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **PROJECT_SUMMARY.md** | Complete project overview & checklist |
| **FRONTEND_GUIDE.md** | Frontend features, structure, usage |
| **API_INTEGRATION_GUIDE.md** | API endpoints, examples, error handling |
| **SETUP_GUIDE.md** | Step-by-step setup & troubleshooting |

---

## 🛠️ Tech Stack

### Frontend
- **React 18+** - UI framework
- **Vite** - Next-gen build tool (⚡ fast)
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations
- **Lucide Icons** - Beautiful icons
- **Context API** - Global state management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM/Schema validation
- **JWT** - Token authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests
- **Dotenv** - Environment variables

---

## 🎯 Perfect For

- ✅ College projects (CSE, IT, BCA, MCA)
- ✅ Internship assignments
- ✅ Portfolio demonstration
- ✅ Learning full-stack development
- ✅ Production deployment
- ✅ Viva presentations

---

## 💡 Features to Highlight in Viva

### Architecture
- Full MVC pattern implementation
- Separation of concerns
- Modular component structure
- Reusable utilities

### Security
- JWT authentication
- Password hashing
- Protected API routes
- CORS protection
- Input validation

### Performance
- Fast builds (Vite)
- Optimized animations
- Efficient API calls
- Lazy loading
- Code splitting

### UX/UI
- Responsive design
- Dark mode support
- Loading states
- Error messages
- Smooth transitions

---

## 🚀 Deployment

### Build for Production

**Frontend**:
```bash
cd frontend
npm run build
# Creates optimized dist/ folder
```

**Backend**:
```bash
NODE_ENV=production npm start
```

### Host On

- **Frontend**: Vercel, Netlify, GitHub Pages
- **Backend**: Heroku, Railway, AWS, DigitalOcean
- **Database**: MongoDB Atlas (cloud)

---

## 📋 Testing Checklist

- [ ] Backend server starts on port 3000
- [ ] Frontend dev server starts on port 5173
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Token stored in localStorage
- [ ] Attractions load on dashboard
- [ ] Search/filter functionality works
- [ ] Logout clears token and redirects
- [ ] Protected routes redirect to login
- [ ] Error messages display properly
- [ ] Dark mode toggle works
- [ ] Responsive on mobile (375px)
- [ ] Responsive on tablet (768px)
- [ ] Responsive on desktop (1920px)

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Cannot Connect to MongoDB
- Ensure MongoDB is running
- Check connection string in `.env`
- Use MongoDB Atlas for cloud database

### API Not Responding
- Verify backend running on localhost:3000
- Check VITE_API_BASE_URL in frontend
- Open DevTools Network tab to inspect requests

### Token Issues
- Clear localStorage and re-login
- Check JWT_SECRET in backend .env
- Verify Authorization header format

---

## 📞 Common Commands

```bash
# Backend
cd backend && npm start           # Start server
npm run dev                        # Start with nodemon

# Frontend
cd frontend && npm run dev        # Dev server
npm run build                     # Production build
npm run preview                   # Preview build

# All dependencies
npm install                       # Install all packages
npm update                        # Update packages
npm list                          # List installed packages
npm audit                         # Security check
```

---

## 📖 Code Examples

### Login API Call
```javascript
import { authApi } from './lib/api';

const response = await authApi.login({
  email: "user@example.com",
  password: "password123"
});

localStorage.setItem("token", response.data.token);
```

### Protected Route
```javascript
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedPage() {
  const { isLoggedIn } = useAuth();
  
  if (!isLoggedIn) return <Navigate to="/login" />;
  
  return <div>Protected Content</div>;
}
```

### API with Token
```javascript
// Token automatically added by axios interceptor
const response = await attractionApi.list();
// Equivalent to:
// GET /api/attractions
// Authorization: Bearer <token>
```

---

## 🌟 What Makes This Project Great

1. **Complete Solution** - Everything works end-to-end
2. **Professional Code** - Industry-standard practices
3. **Well Documented** - 4 comprehensive guides
4. **Scalable Design** - Easy to extend with features
5. **Production Ready** - Can be deployed immediately
6. **Learning Resource** - Perfect for understanding full-stack
7. **Demo Friendly** - Great for viva presentations
8. **Responsive** - Works on all devices

---

## 📝 Environment Variables

### Backend (.env)
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/city-explorer
JWT_SECRET=your_super_secret_key_change_this
NODE_ENV=development
```

### Frontend (.env.local) - Optional
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## ✅ Status

| Component | Status |
|-----------|--------|
| Frontend UI | ✅ Complete |
| Authentication | ✅ Complete |
| API Integration | ✅ Complete |
| Backend Routes | ✅ Complete |
| Database Models | ✅ Complete |
| Error Handling | ✅ Complete |
| Responsive Design | ✅ Complete |
| Documentation | ✅ Complete |

---

## 🎓 Learning Outcomes

After this project, you'll understand:
- ✅ React functional components & hooks
- ✅ Context API for state management
- ✅ React Router for navigation
- ✅ JWT authentication flow
- ✅ Express.js API development
- ✅ MongoDB schema design
- ✅ Axios HTTP client
- ✅ Tailwind CSS styling
- ✅ Responsive web design
- ✅ Full-stack development

---

## 🤝 Contributing

This is a learning project. Feel free to:
- Add new features
- Improve UI/UX
- Optimize performance
- Fix bugs
- Enhance documentation

---

## 📄 License

This project is open source and available for educational purposes.

---

## 🎉 Ready to Go!

Everything is set up and ready to run. Just follow the Quick Start section above.

**Happy coding! 🚀**

---

## 📞 Quick Reference

```bash
# One-liner for both servers (requires pm2 or similar)
npm start && cd frontend && npm run dev

# Manual setup (recommended)
Terminal 1: cd backend && npm start
Terminal 2: cd frontend && npm run dev
Terminal 3: Browser → http://localhost:5173
```

---

**Made with ❤️ for your success! 🏆**