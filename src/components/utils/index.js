import React from 'react';
import './index.css';

export const LoadingPage = () => (
  <div className="card">
    <div className="cityscape">
      <div className="building"></div>
      <div className="building"></div>
      <div className="building"></div>
      <div className="building"></div>
      <div className="building"></div>
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    </div>
    <div className="message">
      Loading...
    </div>
  </div>
);

export const CartEmpty = () => (
  <div className="card">
    <div className="cityscape">
      <div className="building"></div>
      <div className="building"></div>
      <div className="building"></div>
      <div className="building"></div>
      <div className="building"></div>
      <div className="cart-icon"></div>
    </div>
    <div className="message">
      No Items In Your Cart :(
    </div>
  </div>
);

export const PageNotAvailable = () => (
  <div className="card">
    <div className="cityscape">
      <div className="building"></div>
      <div className="building"></div>
      <div className="building"></div>
      <div className="building"></div>
      <div className="building"></div>
      <div className="error-icon">!</div>
    </div>
    <div className="message">
      Page Not Available :(
    </div>
  </div>
);
