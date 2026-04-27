const Hotel = require('../models/Hotel');
const path = require('path');
const fs = require('fs');

// Get all hotels
const getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find().populate('createdBy', 'name email');
    const normalizedHotels = hotels.map((hotel) => ({
      ...hotel.toObject(),
      city: hotel.city || hotel.cityName || ''
    }));
    res.json(normalizedHotels);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single hotel
const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate('createdBy', 'name email');
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create hotel (admin only)
const createHotel = async (req, res) => {
  try {
    const { cityName, name, location, description, amenities, rating, price, rooms, capacity, category, contact } = req.body;

    // Validate required fields
    if (!cityName || !name || !location || rating === undefined || price === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const hotelData = {
      cityName,
      name,
      location,
      description,
      rating: parseFloat(rating),
      price: parseFloat(price),
      rooms: parseInt(rooms) || 0,
      capacity: parseInt(capacity) || 0,
      category: category || 'Standard',
      createdBy: req.user.id
    };

    // Handle multiple image uploads
    if (req.files && req.files.length > 0) {
      hotelData.imageUrl = `/uploads/${req.files[0].filename}`;
      hotelData.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    // Parse amenities if it's a JSON string
    if (amenities) {
      try {
        hotelData.amenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
      } catch (e) {
        hotelData.amenities = amenities;
      }
    }

    // Parse contact if it's a JSON string
    if (contact) {
      try {
        hotelData.contact = typeof contact === 'string' ? JSON.parse(contact) : contact;
      } catch (e) {
        hotelData.contact = contact;
      }
    }

    const hotel = new Hotel(hotelData);
    await hotel.save();

    res.status(201).json({
      message: 'Hotel created successfully',
      hotel: await hotel.populate('createdBy', 'name email')
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update hotel (admin only)
const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const { cityName, name, location, description, amenities, rating, price, rooms, capacity, category, contact } = req.body;

    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // Update fields
    if (cityName) hotel.cityName = cityName;
    if (name) hotel.name = name;
    if (location) hotel.location = location;
    if (description) hotel.description = description;
    if (rating !== undefined) hotel.rating = parseFloat(rating);
    if (price !== undefined) hotel.price = parseFloat(price);
    if (rooms !== undefined) hotel.rooms = parseInt(rooms);
    if (capacity !== undefined) hotel.capacity = parseInt(capacity);
    if (category) hotel.category = category;

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      // Delete old images if they exist
      if (hotel.images && hotel.images.length > 0) {
        hotel.images.forEach(img => {
          const oldImagePath = path.join(__dirname, '../', img);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        });
      }
      hotel.imageUrl = `/uploads/${req.files[0].filename}`;
      hotel.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    // Update amenities
    if (amenities) {
      try {
        hotel.amenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
      } catch (e) {
        hotel.amenities = amenities;
      }
    }

    // Update contact
    if (contact) {
      try {
        hotel.contact = typeof contact === 'string' ? JSON.parse(contact) : contact;
      } catch (e) {
        hotel.contact = contact;
      }
    }

    await hotel.save();

    res.json({
      message: 'Hotel updated successfully',
      hotel: await hotel.populate('createdBy', 'name email')
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete hotel (admin only)
const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // Delete associated images
    if (hotel.imageUrl) {
      const imagePath = path.join(__dirname, '../', hotel.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    if (hotel.images && hotel.images.length > 0) {
      hotel.images.forEach(img => {
        const imagePath = path.join(__dirname, '../', img);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }

    await Hotel.findByIdAndDelete(id);

    res.json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get hotels by city
const getHotelsByCity = async (req, res) => {
  try {
    const { cityName } = req.params;
    const hotels = await Hotel.find({ cityName });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  getHotelsByCity
};
