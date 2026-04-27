const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hotel: {
    name: String,
    city: String,
    location: String,
    imageUrl: String,
    price: Number,
    rating: Number
  },
  checkInDate: {
    type: Date,
    required: true
  },
  checkOutDate: {
    type: Date,
    required: true
  },
  guests: {
    type: Number,
    default: 1
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  bookingReference: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Generate booking reference before saving
bookingSchema.pre('save', function() {
  if (!this.bookingReference) {
    this.bookingReference = 'BK' + Date.now() + Math.random().toString(36).slice(2, 9).toUpperCase();
  }
});

module.exports = mongoose.model('Booking', bookingSchema);