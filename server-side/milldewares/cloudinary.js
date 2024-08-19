#!/usr/bin/Node
const multer = require('multer');
const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({
  limits: {
    fileSize: 3 * 1024 * 1024, // 3mb limit
  },
  fileFilter(req, file, cb) {
    console.log('Multer fileFilter:', file.originalname);
    if (!file.originalname.match(/\.(jpg|jpeg|png|JPG)$/)) {
      return cb(new Error('Please upload an image'));
    }
    cb(undefined, true);
  }
});

// Function to upload to Cloudinary
const uploadToCloudinary = async (buffer) => {
  console.log('Uploading to Cloudinary...hi');
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }).end(buffer);
    });
    console.log('Cloudinary upload successful');
    return result.secure_url;
  } catch (e) {
    console.log('Error uploading to Cloudinary:', e);
    throw e;
  }
};

// Middleware to handle image processing and Cloudinary upload
const processAndUploadImage = async (req, res, next) => {
  console.log('processAndUploadImage middleware started');
  if (!req.file) {
    console.log('No file in request');
    return next();
  }
  try {
    console.log('Processing image with Sharp');
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 600, height: 500, fit: 'inside' })
      .jpeg({ quality: 80 })
      .toBuffer();
    
    console.log('Image processed, uploading to Cloudinary');
    const cloudinaryUrl = await uploadToCloudinary(buffer);
    
    req.processedImage = {
      url: cloudinaryUrl
    };
    console.log('Image processed and uploaded successfully'+ cloudinaryUrl);
    next();
  } catch (error) {
    console.log('Error in processAndUploadImage:', error);
    next(error);
  }
};
const deleteFromCloudinary = async (publicId) => {
  console.log('Deleting from Cloudinary...');
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
    console.log('Cloudinary delete successful');
    return result;
  } catch (e) {
    console.log('Error deleting from Cloudinary:', e);
    throw e;
  }
};

// Helper function to extract public_id from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  return filename.split('.')[0];
};

module.exports = {
  upload: upload.single('img'),
  processAndUploadImage,
  deleteFromCloudinary,
  getPublicIdFromUrl 
};
