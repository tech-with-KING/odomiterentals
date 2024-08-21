import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { products } from '../../deviceinfo';
import "./single_product.css";
import axios from 'axios';
import { useAuth } from '../../contexts/authcontext';

const API_URL = 'http://localhost:8000/cart';
function ProductPage() {
  const { user, logout, isLoggedIn, isAdmin } = useAuth();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [QTY, setQTY] = useState(1);

  useEffect(() => {
    const id = parseInt(productId);
    const foundProduct = products.find(product => product.id === id);
    setProduct(foundProduct);
  }, [productId]);

  if (!product) {
    return <div >Loading...</div>;
  }
  const handleAddToCart = async () => {
    const cartItem = {
      productId: product.id,
      quantity: QTY,
    };

    try {
      const response = await axios.post('http://localhost:8000/cart', { items: [cartItem] },{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${isAdmin.token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }
      const updatedCart = await response.json();
      console.log('Cart updated:', updatedCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const relatedProducts = products.filter(p => p.cartegory === product.cartegory && p.id !== product.id).slice(0, 4);

  return (
    <main className='product-container'>
      <div className="product-details-container">
        <div className="product-image">
          <img src={product.img} alt={product.Product_name} />
        </div>
        <div className="product-details">
          <h1>{product.Product_name}</h1>
          <p className="price">{product.price}</p>
          <div className="size-options">
            <span className="option-label">QTY</span>
            <label value={QTY} onChange={(e) => setQTY(e.target.value)}>
              <input type='number' />
            </label>
          </div>
          <button className="add-to-cart" onClick={handleAddToCart}>ADD TO CART</button>
          <div className="product-description">
            <p>{product.desc}</p>
          </div>
        </div>
      </div>
      <div className="related-products">
        <h2>RELATED PRODUCTS</h2>
        <div className="related-items">
          {relatedProducts.map((relatedProduct) => (
            <div key={relatedProduct.id} className="related-item">
              <img src={relatedProduct.img} alt={relatedProduct.Product_name} />
              <p>{relatedProduct.Product_name}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default ProductPage;
