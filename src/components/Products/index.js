import React, { useState } from 'react';
import './index.css';

const ProductUpload = ({ existingProduct, onSave }) => {
  const [productName, setProductName] = useState('Full Spectrum CBD Tincture - Pet Tincture');
  const [description, setDescription] = useState('The ...');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('Beauty');
  const [inventory, setInventory] = useState(1500);
  const [sku, setSku] = useState('USG-BB-PUB-08');
  const [price, setPrice] = useState(180.00);
  const [inStore, setInStore] = useState(true);
  const [online, setOnline] = useState(false);

  const categories = [
    'Health & Medicine',
    'Beauty',
    'Electronics',
    'Clothing',
    'Food & Beverage',
    'Home & Garden'
  ];

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Product added:', { productName, description, category, subcategory, inventory, sku, price, inStore, online });
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
              <div className="image-placeholder">Upload Image</div>
              <div className="image-placeholder">Upload Image</div>
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
            <label htmlFor="subcategory">Product Category</label>
            <select
              id="subcategory"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
            >
              <option>Beauty</option>
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
            <label htmlFor="sku">SKU (Optional)</label>
            <input
              type="text"
              id="sku"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
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
          <div className="form-group">
            <label>Selling Type</label>
            <div className="selling-type">
              <label>
                <input
                  type="checkbox"
                  id="in-store"
                  checked={inStore}
                  onChange={(e) => setInStore(e.target.checked)}
                />
                In-store selling only
              </label>
              <label>
                <input
                  type="checkbox"
                  id="online"
                  checked={online}
                  onChange={(e) => setOnline(e.target.checked)}
                />
                Online selling only
              </label>
            </div>
          </div>
          <button type="submit" className="button">Add Product</button>
        </form>
      </div>
    </div>
  );
};

export default ProductUpload;
