const bcrypt = require('bcrypt');
const express = require('express');
const { upload, processAndUploadImage } = require('../milldewares/cloudinary');
const { v4: uuidv4 } = require('uuid');
const { UserDetail} = require('../models/users');
const { AdminDetail} = require('../models/admin');
const {generateToken, authMiddleware, adminAuthMiddleware } = require('../milldewares/auth');
const userRouter = express.Router();
userRouter.post('/signup', upload, processAndUploadImage, async (req, res) => {
  if (!req.processedImage) {
    return res.status(400).send({ error: "Profile Image required" });
  }

  let imageUploaded = false;
  try {
    imageUploaded = true;
    const { email, password, first_name, last_name } = req.body;

    const existingUser = await UserDetail.findOne({ email });
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserDetail({
      id: uuidv4(),
      email,
      passwd: hashedPassword,
      first_name,
      last_name,
      img: req.processedImage.url
    });

    await newUser.save();
    const token = generateToken(newUser);
    const userResponse = newUser.toObject();
    delete userResponse.passwd;
    res.status(201).json({ user: userResponse, token });
  } catch (e) {
    console.log('Signup error:', e);
    if (imageUploaded) {
      try {
        const publicId = getPublicIdFromUrl(req.processedImage.url);
        await deleteFromCloudinary(publicId);
        console.log('Cleanup: Image deleted from Cloudinary');
      } catch (deleteError) {
        console.error('Error during image cleanup:', deleteError);
      }
    }
    if (e.message === "Email already exists") {
      res.status(400).send({ error: e.message });
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
});


// User login (email)
userRouter.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await UserDetail.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwd);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user, 'user');
    const userResponse = user.toObject();
    delete userResponse.passwd;  // Remove password from the response
    res.json({ user: userResponse, token });
  } catch (error) {
    console.error('User login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Admin login
userRouter.post('/admin/login', async (req, res) => {
  try {
    const { email, password, adminPin } = req.body;
    const admin = await AdminDetail.findOne({ email });// userRouter.post('/login', async (req, res) => {
    if (!admin) {
      return res.status(400).json({ message: 'Admin not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwd);
    const isPinValid = admin.adminPin == adminPin;
    if (!isPasswordValid || !isPinValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(admin, 'admin');
    const adminResponse = admin.toObject();
    delete adminResponse.passwd;
    delete adminResponse.adminPin;
    res.json({ admin: adminResponse, token });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = userRouter;
