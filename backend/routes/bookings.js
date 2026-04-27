const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

// All booking routes require authentication
router.use(auth);

// Get user's bookings
router.get('/', bookingController.getUserBookings);

// Create a new booking
router.post('/', bookingController.createBooking);

// Cancel a booking
router.patch('/:id/cancel', bookingController.cancelBooking);

module.exports = router;