import React, { useState } from 'react';
import './index.css';
import axios from 'axios';

const ProductUpload = () => {
  const [productName, setProductName] = useState('product name');
  const [description, setDescription] = useState('no description');
  const [category, setCategory] = useState('');
  const [inventory, setInventory] = useState(1500);
  const [color, setColor] = useState([]);
  const [price, setPrice] = useState(180.00);
  const categories = [
    'Chairs',
    'Tables',
    'Table Covers',
    'Tents',
    'Sashes',
    'Kids Rentals'
  ];
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('img', image);
    formData.append('category', category);
    formData.append('Product_name', productName);
    formData.append('price', `$${price}`);
    formData.append('desc', description);
    formData.append('instock', inventory > 0);
    formData.append('unitsleft', inventory);
    formData.append('color', color);
    
    try {
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
   
      const response = await axios.post('hello', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Product added:', response.data);
      // Handle success (e.g., show a success message, clear form, etc.)
    } catch (error) {
      console.error('Error adding product:', error);
      // Handle error (e.g., show error message)
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    document.querySelectorAll('.category-list input[type="checkbox"]').forEach(cb => {
      cb.checked = cb.value === selectedCategory;
    });
  };

  const handleSidebarCategoryChange = (e) => {
    if (e.target.checked) {
      setCategory(e.target.value);
      document.querySelectorAll('.category-list input[type="checkbox"]').forEach(cb => {
        if (cb !== e.target) cb.checked = false;
      });
    } else {
      setCategory('');
    }
  };


  return (
    <div className="add-product-container">
      <div className="sidebar">
        <h2>Categories</h2>
        <ul className="category-list">
          {categories.map((cat, index) => (
            <li key={index}>
              <label>
                <input
                  type="checkbox"
                  name="category"
                  value={cat}
                  checked={category === cat}
                  onChange={handleSidebarCategoryChange}
                />
                {cat}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div className="main-content">
        <div className="header">
          <h1>Add New Product</h1>
          <button className="button">View Shop</button>
        </div>
        <form id="productForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="product-name">Product Name</label>
            <input
              type="text"
              id="product-name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Product Images</label>
            <div className="image-upload">
              <div className="image-placeholder">
                <label htmlFor="image">Upload Image</label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              {image && (
                <div className="image-preview">
                  <img src={URL.createObjectURL(image)} alt="Preview" />
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="">Select a category</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="inventory">Inventory</label>
            <input
              type="number"
              id="inventory"
              value={inventory}
              onChange={(e) => setInventory(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="color">color (Optional)</label>
            <input
              type="text"
              id="color"
              value={color}
              defaultValue={'white'}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>
          <button type="submit" className="button" >Add Product</button>
        </form>
      </div>
    </div>
  );
};
export default ProductUpload;
