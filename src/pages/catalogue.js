import React from 'react';
import './catalogue.css';
import Sidebar from '../components/sidebar';
import ProductCard from '../components/shoppingCard/card';

const CataloguePage = ({ products }) => {
  return (
    <div className="catalogue-container">
      <Sidebar />
      <div className="product-container">
        <ProductCard cart="All" products={products} />
      </div>
    </div>
  );
};

export default CataloguePage;
