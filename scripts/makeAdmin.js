const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../src/models/User');

dotenv.config({ path: '../.env' });

const makeAdmin = async () => {
  const mobile = process.argv[2];

  if (!mobile) {
    console.log('Please provide a mobile number: node makeAdmin.js <mobile_number>');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const user = await User.findOne({ mobile });
    if (!user) {
      console.log(`User with mobile ${mobile} not found.`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();
    console.log(`Successfully made ${user.name} (${mobile}) an admin!`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

makeAdmin();
