const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  cityName: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  amenities: [{
    type: String,
    trim: true
  }],
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  reviews: {
    type: Number,
    default: 0,
    min: 0
  },
  imageUrl: {
    type: String,
    trim: true
  },
  images: [{
    type: String,
    trim: true
  }],
  rooms: {
    type: Number,
    default: 0,
    min: 0
  },
  capacity: {
    type: Number,
    default: 0,
    min: 0
  },
  category: {
    type: String,
    enum: ['Budget', 'Standard', 'Premium', 'Luxury'],
    default: 'Standard'
  },
  contact: {
    phone: String,
    email: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Hotel', hotelSchema);
