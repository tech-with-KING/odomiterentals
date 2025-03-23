const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  items: [{
    productId: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

// Indexes
cartSchema.index({ userId: 1 }, { unique: true });
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Cart = mongoose.model('Cart', cartSchema);

module.exports.Carts = Cart;
