const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  cartId: { type: String, required: true, unique: true },
  userId: { type: String, required: true, unique: true },
  items: [{
    product_id: { type: String, required: true },
    quantity: { type: Number, required: true }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});
// Indexes
// cartSchema.index({ userId: 1, cartId: 1 });
// cartSchema.index({ cartId: 1, product_id: 1 }, { unique: true });

// // TTL index
// cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Cart = mongoose.model('Cart', cartSchema);
module.exports.Carts = Cart;

