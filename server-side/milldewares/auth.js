const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const { UserDetail, AdminDetail } = require('../models/users');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Local Strategy for regular users
passport.use('local', new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await UserDetail.findOne({ email });
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      const isMatch = await bcrypt.compare(password, user.passwd);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Local Strategy for admin users
passport.use('admin-local', new LocalStrategy(
  { usernameField: 'email', passwordField: 'password', passReqToCallback: true },
  async (req, email, password, done) => {
    try {
      const admin = await AdminDetail.findOne({ email });
      if (!admin) {
        return done(null, false, { message: 'Admin not found.' });
      }
      const isMatch = await bcrypt.compare(password, admin.passwd);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      if (admin.adminPin !== req.body.adminPin) {
        return done(null, false, { message: 'Incorrect admin PIN.' });
      }
      return done(null, admin);
    } catch (error) {
      return done(error);
    }
  }
));

// Google Strategy (remains the same)
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await UserDetail.findOne({ googleId: profile.id });
      if (!user) {
        user = new UserDetail({
          id: uuidv4(),
          googleId: profile.id,
          email: profile.emails[0].value,
          first_name: profile.name.givenName,
          last_name: profile.name.familyName,
          profile_image: profile.photos[0].value
        });
        await user.save();
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

const generateToken = (user, isAdmin = false) => {
  return jwt.sign({ id: user.id, isAdmin }, JWT_SECRET, { expiresIn: '1d' });
};

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.userId = decoded.id;
    req.isAdmin = decoded.isAdmin;
    next();
  });
};

const adminAuthMiddleware = (req, res, next) => {
  authMiddleware(req, res, () => {
    if (!req.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  });
};

module.exports = { passport, generateToken, authMiddleware, adminAuthMiddleware };
