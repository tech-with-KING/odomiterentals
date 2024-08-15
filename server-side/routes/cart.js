const express = require('express');
const { v4: uuidv4 } = require('uuid');
const {Carts} = require('../models/cart');
const { authMiddleware} = require('../milldewares/auth');
const cartRouter = express.Router();


// Get cart for the current user
cartRouter.get('/', async (req, res) => {
  try {
    const cart = await Carts.findOne({ userId: req.body.id });
    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
});

// Add or update cart items
cartRouter.post('/', async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Invalid items array' });
    }
    console.log(req.body.id)
    let cart = Carts ?  Carts.findOne({ userId:req.body.id }) : {};

    if (cart) {
      // Update existing cart
      console.log(cart)
      items.forEach(newItem => {
        const existingItemIndex = cart
        if (existingItemIndex > -1) {
          cart.items[existingItemIndex].quantity = newItem.quantity;
        } else {
          cart.items.push(newItem);
        }
      });
      cart.updatedAt = new Date();
      cart.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Reset expiration
    } else {
      // Create new cart
      cart = new Carts({
        cartId: uuidv4(),
        userId: req.user.id,
        items: items,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });
    }

    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(400).json({ message: 'Error updating cart', error: error.message });
  }
});

// Update entire cart
cartRouter.put('/', async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Invalid items array' });
    }

    const updatedCart = await Carts.findOneAndUpdate(
      { userId: req.user.id },
      { 
        items: items,
        updatedAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      { new: true, upsert: true }
    );

    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ message: 'Error updating cart', error: error.message });
  }
});

// Delete entire cart
cartRouter.delete('/', async (req, res) => {
  try {
    const result = await Carts.findOneAndDelete({ userId: req.user.id });
    if (!result) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.json({ message: 'Cart deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting cart', error: error.message });
  }
});

module.exports = cartRouter;
