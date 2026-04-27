const Booking = require('../models/Booking');
const jwt = require('jsonwebtoken');

// Get user's bookings
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ user: userId }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { hotel, checkInDate, checkOutDate, guests, totalPrice } = req.body;

    // Validate required fields
    if (!hotel || !checkInDate || !checkOutDate || !totalPrice) {
      return res.status(400).json({ message: 'Missing required booking information' });
    }

    // Calculate number of nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      return res.status(400).json({ message: 'Invalid dates' });
    }

    const booking = new Booking({
      user: userId,
      hotel,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests: guests || 1,
      totalPrice
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    console.error('Booking stack:', error.stack);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid booking data', details: error.message });
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Booking reference conflict, please try again' });
    }
    res.status(500).json({ message: 'Server error', detail: error.message, stack: error.stack });
  }
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookingId = req.params.id;

    const booking = await Booking.findOne({ _id: bookingId, user: userId });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'confirmed') {
      return res.status(400).json({ message: 'Cannot cancel this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
};