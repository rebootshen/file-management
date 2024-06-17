// createDefaultUser.js
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const createDefaultUser = async () => {
  const defaultEmail = 'admin@example.com';
  const defaultPassword = 'password123';

  const existingUser = await User.findOne({ email: defaultEmail });
  if (!existingUser) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    const user = new User({
      name: 'Admin',
      email: defaultEmail,
      password: hashedPassword,
      role: 'admin',
    });

    await user.save();
    console.log('Default admin user created');
  } else {
    console.log('Default admin user already exists');
  }
};

module.exports = createDefaultUser;