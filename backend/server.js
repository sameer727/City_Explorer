require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const cityRoutes = require('./routes/cities');
const attractionRoutes = require('./routes/attractions');
const hotelRoutes = require('./routes/hotels');
const messageRoutes = require('./routes/messages');
const bookingRoutes = require('./routes/bookings');

const app = express();

// Middleware
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB();

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to City Explorer API 🏙️',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/register',
        login: 'POST /api/login'
      },
      cities: {
        getAll: 'GET /api/cities (public)'
      },
      attractions: {
        getAll: 'GET /api/attractions (protected)',
        addReview: 'POST /api/attractions/review (protected)',
        getReviews: 'GET /api/attractions/reviews/:attractionId (protected)',
        addFavorites: 'POST /api/attractions/favorites (protected)',
        getFavorites: 'GET /api/attractions/favorites (protected)'
      },
      bookings: {
        getUserBookings: 'GET /api/bookings (protected)',
        createBooking: 'POST /api/bookings (protected)',
        cancelBooking: 'PATCH /api/bookings/:id/cancel (protected)'
      }
    },
    note: 'Protected routes require Authorization header with Bearer token'
  });
});

// Routes
app.use('/api', authRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/attractions', attractionRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/bookings', bookingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
