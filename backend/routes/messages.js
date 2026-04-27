const express = require('express');
const Message = require('../models/Message');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Public: Submit a new contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, contactNumber, message } = req.body;
    
    if (!name || !email || !contactNumber || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newMessage = new Message({ name, email, contactNumber, message });
    await newMessage.save();

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Protected: Admin only - Get all messages
// auth verifies the JWT; admin checks isAdmin === true in the token payload.
// New registrations always get isAdmin: false, so only pre-existing admin
// accounts (set via make_admin.js) can access this endpoint.
router.get('/', auth, admin, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
