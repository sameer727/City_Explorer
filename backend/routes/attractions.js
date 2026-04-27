const express = require('express');
const multer = require('multer');
const path = require('path');
const { getAttractions, addReview, getReviews, addToFavorites, getFavorites, removeFromFavorites } = require('../controllers/attractionController');
const auth = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.get('/', auth, getAttractions);
const fs = require('fs');
router.post('/review', auth, (req, res, next) => {
  const log = `--- Incoming POST ---\nContent-Type: ${req.headers['content-type']}\nBody before: ${JSON.stringify(req.body)}\n`;
  fs.appendFileSync('debug.log', log);
  next();
}, upload.single('image'), (req, res, next) => {
  const log = `Body after: ${JSON.stringify(req.body)}\nFile after: ${JSON.stringify(req.file)}\n`;
  fs.appendFileSync('debug.log', log);
  next();
}, addReview);
router.get('/reviews/:attractionId', auth, getReviews);
router.post('/favorites', auth, addToFavorites);
router.get('/favorites', auth, getFavorites);
router.delete('/favorites/:attractionId', auth, removeFromFavorites);

module.exports = router;
