const FormData = require('form-data');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const mongoose = require('mongoose');

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  const User = require('./models/User');
  const user = await User.findOne();
  if (!user) {
    console.log("No users found");
    return;
  }
  
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  console.log("Generated token for:", user.email);

  const form = new FormData();
  form.append('attractionId', '123');
  form.append('rating', 5);
  form.append('comment', 'test');
  
  const response = await fetch('http://localhost:5000/api/attractions/review', {
    method: 'POST',
    body: form,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const data = await response.json();
  console.log("Response:", data);
  process.exit(0);
}
test();
