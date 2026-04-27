# API Integration Guide

## Overview
The frontend communicates with the backend via HTTP requests through the Axios library. All requests include JWT token authentication.

---

## API Client Setup

### File: `src/lib/api.js`

```javascript
import axios from 'axios';

const TOKEN_KEY = 'token';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 (unauthorized) responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      if (_logoutCallback) _logoutCallback();
    }
    return Promise.reject(error);
  }
);
```

### Key Features
1. **Automatic Token Injection**: Every request includes the stored JWT token
2. **401 Handler**: Automatically logs out users if token expires
3. **Error Handling**: Centralized error management

---

## Authentication API

### Register User

**Endpoint**: `POST /api/register`

**Request**:
```javascript
const payload = {
  name: "John Doe",
  email: "john@example.com",
  password: "securePassword123"
};

const response = await authApi.register(payload);
```

**Response**:
```json
{
  "message": "User registered successfully"
}
```

**Implementation** (LoginPage.jsx):
```javascript
try {
  await authApi.register({
    name: form.name.trim(),
    email: form.email,
    password: form.password
  });
  setSuccess('Account created successfully!');
} catch (error) {
  setError(error.response?.data?.message || 'Registration failed');
}
```

---

### Login User

**Endpoint**: `POST /api/login`

**Request**:
```javascript
const payload = {
  email: "john@example.com",
  password: "securePassword123"
};

const response = await authApi.login(payload);
```

**Response**:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Implementation** (LoginPage.jsx):
```javascript
try {
  const response = await authApi.login({
    email: form.email,
    password: form.password
  });
  
  // Store token
  login(response.data.token);
  
  // Redirect to dashboard
  navigate('/dashboard');
} catch (error) {
  setError('Invalid credentials');
}
```

---

## Attractions API (Protected)

All attraction endpoints require authentication (JWT token in Authorization header).

### Get All Attractions

**Endpoint**: `GET /api/attractions`

**Required Header**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `search` (optional): Search by name, city, or description
- `category` (optional): Filter by category

**Request**:
```javascript
// Get all attractions
const response = await attractionApi.list();

// With filters
const response = await attractionApi.list({
  search: "paris",
  category: "landmark"
});
```

**Response**:
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Eiffel Tower",
    "description": "Iconic iron lattice tower in Paris",
    "cityName": "Paris",
    "category": "Landmark",
    "coordinates": {
      "latitude": 48.8584,
      "longitude": 2.2945
    },
    "createdAt": "2024-01-15T10:30:00Z"
  },
  ...
]
```

**Implementation** (DashboardPage.jsx):
```javascript
useEffect(() => {
  attractionApi
    .list()
    .then((response) => {
      setAttractions(response.data || []);
    })
    .catch((error) => {
      setError('Failed to load attractions');
    })
    .finally(() => {
      setLoading(false);
    });
}, []);
```

---

### Add to Favorites

**Endpoint**: `POST /api/attractions/favorites`

**Request Body**:
```json
{
  "attractionId": "507f1f77bcf86cd799439011"
}
```

**Response**:
```json
{
  "message": "Added to favorites"
}
```

**Implementation**:
```javascript
const onSave = async (attractionId) => {
  try {
    await attractionApi.addFavorite(attractionId);
    setFavorites((prev) => [...new Set([...prev, attractionId])]);
  } catch (error) {
    setError('Login required to save favorites');
  }
};
```

---

### Get Favorites

**Endpoint**: `GET /api/attractions/favorites`

**Response**:
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Eiffel Tower",
    ...
  },
  ...
]
```

**Implementation**:
```javascript
const response = await attractionApi.favorites();
setFavorites(response.data.map((item) => item._id));
```

---

### Add Review

**Endpoint**: `POST /api/attractions/review`

**Request Body**:
```json
{
  "attractionId": "507f1f77bcf86cd799439011",
  "rating": 5,
  "comment": "Amazing place! Must visit."
}
```

**Response**:
```json
{
  "message": "Review added successfully",
  "review": {
    "_id": "...",
    "attractionId": "...",
    "rating": 5,
    "comment": "...",
    "user": "..."
  }
}
```

---

### Get Reviews

**Endpoint**: `GET /api/attractions/reviews/:attractionId`

**Response**:
```json
[
  {
    "_id": "...",
    "rating": 5,
    "comment": "Amazing!",
    "user": {
      "_id": "...",
      "name": "John Doe"
    },
    "createdAt": "2024-01-15T10:30:00Z"
  },
  ...
]
```

---

## Error Handling

### Global Error Handling

The axios interceptor catches and handles 401 errors:

```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired - logout user
      localStorage.removeItem(TOKEN_KEY);
      if (_logoutCallback) _logoutCallback();
    }
    return Promise.reject(error);
  }
);
```

### Component-Level Error Handling

```javascript
try {
  const response = await authApi.login(credentials);
  // Success handling
} catch (error) {
  // Check error type
  if (error.response?.status === 401) {
    setError('Invalid credentials');
  } else if (!error.response) {
    setError('Cannot reach backend API');
  } else {
    setError(error.response.data?.message || 'Error occurred');
  }
}
```

---

## Authentication Context

### File: `src/context/AuthContext.jsx`

```javascript
export function useAuth() {
  const { token, isLoggedIn, login, logout } = useContext(AuthContext);
  
  // Use in components
}
```

**Methods**:
- `login(token)`: Store token and update auth state
- `logout()`: Clear token and update auth state
- `isLoggedIn`: Boolean flag for auth status
- `token`: Current JWT token

---

## Protected Routes

### Implementation

```javascript
export default function DashboardPage() {
  const { isLoggedIn } = useAuth();
  
  // Redirect if not logged in
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  
  // Component content
}
```

---

## Request Examples

### Using AuthAPI

```javascript
import { authApi } from './lib/api';

// Register
await authApi.register({
  name: "Jane Doe",
  email: "jane@example.com",
  password: "password123"
});

// Login
const { data } = await authApi.login({
  email: "jane@example.com",
  password: "password123"
});
```

### Using Attractions API

```javascript
import { attractionApi } from './lib/api';

// Get all attractions
const { data } = await attractionApi.list();

// Add to favorites
await attractionApi.addFavorite(attractionId);

// Get favorites
const { data } = await attractionApi.favorites();

// Add review
await attractionApi.addReview({
  attractionId,
  rating: 5,
  comment: "Great place!"
});

// Get reviews
const { data } = await attractionApi.reviews(attractionId);
```

---

## Testing API Integration

### 1. Check Token Storage
```javascript
// In browser console
localStorage.getItem('token')
```

### 2. Check Request Headers
```javascript
// In DevTools Network tab, check Authorization header
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Test API Calls
```javascript
// In browser console
import { authApi } from './lib/api';
await authApi.login({
  email: "test@example.com",
  password: "password123"
});
```

### 4. Monitor Network Tab
- Watch for 401 responses (token expired)
- Verify Authorization header is present
- Check response status codes

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Token expired or missing. Re-login. |
| 400 Bad Request | Check request payload format. |
| 404 Not Found | Verify endpoint URL and backend is running. |
| CORS Error | Check backend CORS configuration. |
| Token not persisting | Check localStorage in DevTools. |
| API not responding | Ensure backend server is running on localhost:3000. |

---

## Security Best Practices

✅ **Implemented**:
- JWT tokens stored securely in localStorage
- Token automatically included in all API requests
- 401 responses trigger automatic logout
- Sensitive operations require authentication
- Password hashed on backend (bcryptjs)

⚠️ **Remember**:
- Never commit `.env` files with secrets
- Use HTTPS in production
- Implement token refresh for longer sessions
- Use secure cookies instead of localStorage (production)