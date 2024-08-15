import React, { useState } from "react";
import "./index.css";

const OrderSummary = ({ items, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    eventAddress: "",
    email: "",
    eventDate: "",
    phone: "",
    requireDelivery: false
  });

  const totalAmount = items.reduce((acc, item) => acc + (parseFloat(item.price.replace('$', '')) * item.quantity), 0);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the form data to your backend
  };

  return (
    <div className="order-summary">
      <h1>Order Summary</h1>
      <div className="order-details">
        <h2>Items Ordered:</h2>
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              <span className="item-name">{item.Product_name}</span>
              <span className="item-quantity">Quantity: {item.quantity}</span>
              <span className="item-price">${parseFloat(item.price.replace('$', '')) * item.quantity}</span>
            </li>
          ))}
        </ul>
        <p className="total-amount">Total Amount: <strong>${totalAmount.toFixed(2)}</strong></p>
      </div>
      <form onSubmit={handleSubmit}>
        <h2>Delivery Information</h2>
        <div className="form-group">
          <label htmlFor="name">Full Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="address">Your Address:</label>
          <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="eventAddress">Event Address (if different):</label>
          <input type="text" id="eventAddress" name="eventAddress" value={formData.eventAddress} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="eventDate">Date of Event:</label>
          <input type="date" id="eventDate" name="eventDate" value={formData.eventDate} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number:</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
        </div>
        <div className="form-group checkbox">
          <label htmlFor="requireDelivery">
            <input type="checkbox" id="requireDelivery" name="requireDelivery" checked={formData.requireDelivery} onChange={handleInputChange} />
            Require Delivery
          </label>
        </div>
        <div className="button-group">
          <button type="submit" className="submit-btn">Submit Order</button>
          <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default OrderSummary;
