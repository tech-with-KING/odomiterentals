const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { Carts } = require('../models/cart');
const { authMiddleware } = require('../milldewares/auth');
const cartRouter = express.Router();

// Apply authentication middleware to all cart routes
cartRouter.use(authMiddleware);

// Get cart
cartRouter.get('/', async (req, res) => {
  try {
    const cart = await Carts.findOne({ userId: req.user.id });
    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
});

// Update cart (create if not exists)
cartRouter.post('/', async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Invalid items array' });
    }

    const updatedCart = await Carts.findOneAndUpdate(
      { userId: req.user.id },
      {
        $set: {
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          })),
          updatedAt: new Date(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      },
      { new: true, upsert: true }
    );

    res.status(200).json(updatedCart);
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
