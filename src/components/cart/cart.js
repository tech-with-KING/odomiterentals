import React, { useState, useEffect } from 'react';
import { Delete } from '@mui/icons-material';
import OrderSummary from './index';
import './cart.css';
import axios from 'axios';
import { CartEmpty, LoadingPage } from '../utils';

const API_URL = 'http://localhost:8000/cart';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showOrderSummary, setShowOrderSummary] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [grandTotalPrice, setGrandTotalPrice] = useState(0);
  const [inputQuantities, setInputQuantities] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  const updateTotalPrices = () => {
    const subtotal = cartItems.reduce((total, item) => {
      return total + parseFloat(calculateSubtotal(item.price, item.quantity));
    }, 0);
    setTotalPrice(subtotal);
    setGrandTotalPrice(subtotal); // Assuming no additional fees for now
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    updateTotalPrices();
  }, [cartItems]);

  const fetchCartItems = async () => {
    setLoading(true); // Set loading to true when starting to fetch
    try {
      const response = await axios.get(API_URL);
      setCartItems(response.data);
      if (response.data.length === 0) {
        setError('Your cart is empty.');
      }
    } catch (error) {
      setError('Error fetching cart items.');
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };

  const updateCartItem = async (updatedItem) => {
    try {
      await axios.put(`${API_URL}/${updatedItem.id}`, updatedItem);
      fetchCartItems(); // Refresh cart items after update
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const removeCartItem = async (itemId) => {
    try {
      await axios.delete(`${API_URL}/${itemId}`);
      fetchCartItems(); // Refresh cart items after deletion
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  const handleCheckout = () => {
    setShowOrderSummary(true);
  };

  const handleCancelOrderSummary = () => {
    setShowOrderSummary(false);
  };

  const handleQuantityChange = async (id, change) => {
    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
    );
    const updatedItem = updatedItems.find(item => item.id === id);
    await updateCartItem(updatedItem);
  };

  const handleInputChange = (productId, value) => {
    setInputQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, parseInt(value) || 0)
    }));
  };

  const calculateSubtotal = (price, quantity) => {
    return (parseFloat(price.replace('$', '')) * quantity).toFixed(2);
  };

  const handleUpdateQuantity = async (productId) => {
    const newQuantity = inputQuantities[productId];
    if (newQuantity !== undefined) {
      const updatedItem = cartItems.find(item => item.id === productId);
      await updateCartItem({ ...updatedItem, quantity: newQuantity });
      setInputQuantities(prev => ({ ...prev, [productId]: undefined }));
    }
  };

  if (loading) {
    return <div id="loading"><LoadingPage /></div>; // Render loading component
  }

  if (error) {
    return <div id="empty-cart"><CartEmpty /></div>; // Render empty cart message
  }

  return (
    <div className="cart-container">
      <div className="cart-items">
        <h1 className="cart-title">Cart Items</h1>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.img} alt={item.Product_name} className="product-image" />
              <div className="product-details">
                <div className="product-name">
                  <h2>{item.Product_name}</h2>
                  <p>{item.category}</p>
                </div>
                <div className="product-actions">
                  <div className="quantity">
                    <span className="decrease" onClick={() => handleQuantityChange(item.id, -1)}> - </span>
                    <div className="quantity-input-group">
                      <input
                        className="quantity-input"
                        type="number"
                        value={inputQuantities[item.id] !== undefined ? inputQuantities[item.id] : item.quantity}
                        min="1"
                        onChange={(e) => handleInputChange(item.id, e.target.value)}
                      />
                      <button
                        className="update-quantity-btn"
                        onClick={() => handleUpdateQuantity(item.id)}
                        disabled={inputQuantities[item.id] === undefined}
                      >
                        Update
                      </button>
                    </div>
                    <span className="increase" onClick={() => handleQuantityChange(item.id, 1)}> + </span>
                  </div>
                  <div className="price">
                    <p>Price per unit: {item.price}</p>
                    <p>Price for {item.quantity}: ${calculateSubtotal(item.price, item.quantity)}</p>
                    <Delete color="action" className="remove-icon" onClick={() => removeCartItem(item.id)} />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-cart">Your cart is empty.</div>
        )}
      </div>
      <div className="subtotal">
        <div className="subtotal-item">
          <p>Subtotal</p>
          <p>${totalPrice.toFixed(2)}</p>
        </div>
        <div className="subtotal-item">
          <p>Shipping</p>
          <p>TBD</p>
        </div>
        <hr className="subtotal-divider" />
        <div className="subtotal-item total">
          <p>Total</p>
          <div className="total-price">
            <p>${grandTotalPrice.toFixed(2)} USD</p>
            <p className="vat">including VAT</p>
          </div>
        </div>
        <button className="checkout-button" onClick={handleCheckout}>Check out</button>
      </div>
      {showOrderSummary && <OrderSummary items={cartItems} />}
    </div>
  );
};

export default CartPage;
