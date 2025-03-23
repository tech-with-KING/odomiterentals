const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { AdminDetail } = require('./models/admin');
async function addAdmin() {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('kingsley', saltRounds);

    const newAdmin = new AdminDetail({
      user_name: 'Kingsley',
      first_name: 'kingsley',
      last_name: 'okpo',
      email: 'kingsleyfrancis42@gmail.com',
      passwd: hashedPassword,
      adminPin: 123691
    });
    await newAdmin.save();
    console.log('Admin added successfully');
  } catch (error) {
    console.error('Error adding admin:', error);
  } finally {
    mongoose.disconnect();
  }
}
module.exports =  addAdmin;
