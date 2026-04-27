const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const Hotel = require('../models/Hotel');

async function updateAllHotels() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Update all hotels where rooms or capacity is 0 to have some default values
    // or just ensure they are numbers.
    // Based on the user's request, they want to "update this part for every hotel",
    // and showed an image of the Admin Panel with Rooms=2 and Capacity=0.
    // I will set some reasonable defaults for hotels that have 0 rooms/capacity.
    
    const hotels = await Hotel.find({});
    console.log(`Found ${hotels.length} hotels`);

    let updatedCount = 0;
    for (const hotel of hotels) {
      let needsUpdate = false;
      if (hotel.rooms === 0) {
        hotel.rooms = 10; // Default rooms
        needsUpdate = true;
      }
      if (hotel.capacity === 0) {
        hotel.capacity = 20; // Default capacity
        needsUpdate = true;
      }

      if (needsUpdate) {
        await hotel.save();
        updatedCount++;
      }
    }

    console.log(`Updated ${updatedCount} hotels with default values.`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating hotels:', error);
    process.exit(1);
  }
}

updateAllHotels();
