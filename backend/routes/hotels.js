const express = require('express');
const {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  getHotelsByCity
} = require('../controllers/hotelController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const upload = require('../config/multer');

const router = express.Router();

// Public routes
router.get('/', getHotels);
router.get('/city/:cityName', getHotelsByCity);
router.get('/:id', getHotelById);

// Admin routes (protected)
router.post('/', authMiddleware, adminMiddleware, upload.array('images', 5), createHotel);
router.patch('/:id', authMiddleware, adminMiddleware, upload.array('images', 5), updateHotel);
router.delete('/:id', authMiddleware, adminMiddleware, deleteHotel);

module.exports = router;
