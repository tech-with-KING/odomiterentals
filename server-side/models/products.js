#!/usr/bin/node
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  cartegory: {
    type: String,
    required: true
  },
  product_name: {
    type: String,
    required: true
  },
  price: {
    type: String, // Keeping as String to store formatted price (e.g., "$5")
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  img: {
    type: String, // URL for image
    default: null
  },
  instock: {
    type: Boolean,
    required: true
  },
  uniltsleft: {
    type: Number, // Number of units left
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  color: {
    type: String,
    default: 'white'
  }
});

// Create and export the Product model
const Product = mongoose.model('Product', ProductSchema);
module.exports.ProductDetail = Product;
