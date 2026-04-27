# City Explorer - Frontend Setup & Features Guide

## 🎯 Project Overview

City Explorer is a modern, responsive full-stack web application for exploring attractions around the world. The frontend is built with **React.js + Tailwind CSS** and connects to a backend running on `http://localhost:3000`.

---

## 📋 Pages & Features

### 1. **Login Page** (`/login`)
- **Purpose**: Authenticate users with email and password
- **Features**:
  - Email + Password input fields
  - Form validation
  - Error message display
  - Success feedback
  - JWT token stored in `localStorage` under key `"token"`
  - Redirects to `/dashboard` on success
  - Link to registration page

### 2. **Register Page** (`/register`)
- **Purpose**: Create new user accounts
- **Features**:
  - Name, Email, Password input fields
  - Form validation
  - Success confirmation message
  - Error handling
  - Link back to login page

### 3. **Dashboard / Attractions Page** (`/dashboard`)
- **Purpose**: Display all attractions (protected route)
- **Features**:
  - Fetches attractions from backend API
  - Search bar to filter by name or city
  - Displays loading skeleton cards while fetching
  - Shows error messages if API fails
  - Cards display: Name, Description, Category, Rating
  - Hover effects and smooth animations
  - Responsive grid (1 column mobile, 2 columns tablet, 3 columns desktop)
  - **Protected**: Redirects to login if not authenticated

### 4. **Other Pages**
- **Home Page** (`/`): Landing page with app introduction
- **Explore Cities** (`/explore`): Browse cities (public)
- **Favorites** (`/favorites`): View saved attractions
- **Place Details** (`/places/:id`): View single attraction details

---

## 🔐 Authentication Flow

### Token Storage
```javascript
// Stored in localStorage after successful login
localStorage.getItem("token")
```

### Sending Token with Requests
All API requests automatically include the token in the Authorization header:
```javascript
headers: {
  Authorization: `Bearer ${token}`
}
```

### Logout
- Clears token from localStorage
- Redirects to login page
- Triggered from Navbar logout button

---

## 🔌 API Integration

### Base URL
```
http://localhost:3000/api
```

### Auth Endpoints

#### Register
```
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "User registered successfully"
}
```

#### Login
```
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Attractions Endpoints (Protected)

#### Get All Attractions
```
GET /api/attractions
Authorization: Bearer <token>

Response:
[
  {
    "_id": "123abc",
    "name": "Eiffel Tower",
    "description": "Iconic iron lattice tower",
    "cityName": "Paris",
    "category": "Landmark",
    ...
  },
  ...
]
```

---

## 🎨 UI Design Features

### Design System
- **Theme**: Modern light/dark mode toggle
- **Color Scheme**: Brand colors + Tailwind CSS palette
- **Typography**: Clean, readable fonts
- **Spacing**: Consistent padding and margins
- **Shadows**: Soft shadows for depth

### Component Features
- **Rounded Cards**: 20-24px border radius
- **Hover Effects**: Scale, shadow, color changes
- **Smooth Animations**: Framer Motion transitions
- **Responsive**: Mobile-first approach
- **Accessibility**: Semantic HTML, ARIA labels

### Navbar
- App name with icon
- Search bar (hidden on mobile)
- Navigation links
- Dark mode toggle
- User menu with logout button

---

## 🗂️ Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Navigation bar with search
│   │   ├── AttractionCard.jsx   # Card component for attractions
│   │   ├── SearchBar.jsx        # Search input component
│   │   ├── FilterChips.jsx      # Category filter
│   │   ├── SkeletonCard.jsx     # Loading state placeholder
│   │   └── PageTransition.jsx   # Page animation wrapper
│   ├── pages/
│   │   ├── HomePage.jsx         # Landing page
│   │   ├── LoginPage.jsx        # Authentication
│   │   ├── RegisterPage.jsx     # User registration
│   │   ├── DashboardPage.jsx    # Protected attractions list
│   │   ├── ExploreCitiesPage.jsx
│   │   ├── PlaceDetailsPage.jsx
│   │   └── FavoritesPage.jsx
│   ├── context/
│   │   └── AuthContext.jsx      # Global auth state
│   ├── lib/
│   │   ├── api.js              # Axios instance & API calls
│   │   └── mock.js             # Mock data & utilities
│   ├── App.jsx                 # Main app component
│   └── main.jsx                # Entry point
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- npm or yarn
- Backend running on `http://localhost:3000`

### Installation

1. **Navigate to frontend folder**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🔧 Key Technologies

- **React 18+**: UI framework
- **Vite**: Build tool & dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls
- **Framer Motion**: Animation library
- **React Router**: Client-side routing
- **Lucide Icons**: Icon library

---

## 🎯 Features to Include

### ✅ Completed
- [x] Login page with email/password
- [x] Register page with validation
- [x] Protected dashboard route
- [x] Fetch and display attractions
- [x] Search functionality
- [x] Loading states (skeleton cards)
- [x] Error handling
- [x] Logout functionality
- [x] Dark mode toggle
- [x] Responsive design
- [x] Smooth animations
- [x] Clean navbar

### 📋 Additional Features
- Review system (already supported by backend)
- Favorites/bookmarks system
- Category filtering
- Rating display
- Place details page
- Explore cities page

---

## 💡 Usage Examples

### Login Flow
```javascript
// User enters credentials
// Form submits to /api/login
// Token received and stored
// Redirected to /dashboard
// All subsequent requests include token in header
```

### Protected Route
```javascript
// DashboardPage checks isLoggedIn
if (!isLoggedIn) return <Navigate to="/login" replace />;
// If not logged in, redirects to login
```

### API Call with Token
```javascript
// axios interceptor automatically adds:
// Authorization: Bearer <token>
const response = await attractionApi.list();
```

---

## 🐛 Troubleshooting

### "Cannot reach backend API"
- Ensure backend is running on `http://localhost:3000`
- Check `.env` or API base URL in `lib/api.js`

### "Token expires after login"
- Check backend JWT_SECRET in `.env`
- Verify token expiration time (24 hours default)

### "403 Unauthorized on API call"
- Token might be expired
- Re-login to refresh token
- Check Authorization header format: `Bearer <token>`

### Dark mode not persisting
- Check localStorage for `cityexplorer_dark_mode` key
- Ensure `dark` class is applied to document root

---

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (1 column)
- **Tablet**: 768px - 1024px (2 columns)
- **Desktop**: > 1024px (3 columns)

---

## 🎓 Perfect for College Project & Viva

This frontend is production-ready with:
- ✅ Professional UI design
- ✅ Complete authentication system
- ✅ Protected routes
- ✅ API integration
- ✅ Error handling
- ✅ Loading states
- ✅ Responsive design
- ✅ Dark mode
- ✅ Clean code structure
- ✅ Comprehensive comments

Perfect for demonstrating full-stack development skills! 🚀

---

## 📞 Support

For issues or questions, check:
1. Backend API documentation
2. Browser console for error messages
3. Network tab in DevTools to inspect API calls
4. Auth token in localStorage