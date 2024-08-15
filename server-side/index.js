#!/usr/bin/env node
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const passport = require('passport');
const { authMiddleware } = require('./milldewares/auth'); // Make sure to create this file

const app = express();
const productRouter = require('./routes/product');
const userRouter = require('./routes/users');
const sendMail = require('./routes/email');
const cartRouter = require('./routes/cart')

// Load environment variables from a .env file if it exists
require('dotenv').config();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// // Session configuration
// app.use(session({ 
//   secret: process.env.SESSION_SECRET || 'your_session_secret', 
//   resave: false, 
//   saveUninitialized: false 
// }));

// // Passport initialization
// app.use(passport.initialize());
// app.use(passport.session());

// MongoDB connection
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected successfully to MongoDB');
  } catch (e) {
    console.log('MongoDB connection error:', e);
  }
};
connect();

// Routes
app.use('/addproducts', productRouter);
app.use('/auth', userRouter); // Changed from '/signup' to '/auth' for more general auth routes
app.use('/email', sendMail);
app.use('/cart', cartRouter)
// Protected route example
// app.get('/protected', authMiddleware, (req, res) => {
//   res.json({ message: 'This is a protected route', userId: req.userId });
// });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
