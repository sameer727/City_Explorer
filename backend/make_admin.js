require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function makeAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    const user = await User.findOneAndUpdate(
      { email: 'test@test.com' },
      { $set: { isAdmin: true } },
      { new: true }
    );
    
    if (user) {
      console.log(`Successfully made ${user.email} an admin!`);
    } else {
      console.log('User test@test.com not found.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

makeAdmin();
