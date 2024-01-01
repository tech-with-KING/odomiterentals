import React, { useEffect, useState } from 'react';
import "./single_product.css"
import GradeIcon from '@mui/icons-material/Grade';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useParams } from "react-router-dom";
import { device } from '../../deviceinfo';
import Header from '../../body/header';

function ProductPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Find the product in the array based on the productId from the route
    const foundProduct = device.find(item => item.id === productId);

    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [productId]);

  const backgroundcolor = {
    color: "rgb(250, 250, 250,0.77)",
    fontSize: "20px",
    marginLeft: "0px",
    marginRight: "0px"
  };

  if (!product) {
    return <></>; // Add a loading state or redirect to a 404 page
  }

  return (
    <main className='main-container'>
    <div className="containerised" >
      <div className='flex_div'>
      <div className='image_container'>
        <div className='image_container_child'>
          <img className="product_image" src={`/img/${product.img}`} alt="Nike Air"></img>
        </div>
      </div>
      <div className='Product_detail'>
        <h3 className='product_name'>Nike Air</h3>
        <span className='product_price'>{product.price}</span>
        <hr className='my_3'></hr>
        <div className="custom-container mt-2">
		  <label className="custom-label" for="count">Count:</label>
		  <div className="custom-flex items-center mt-1">
			<button className="custom-button">
			  <svg className="custom-svg h-5 w-5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
				<path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
			  </svg>
			</button>
			<span className="custom-span">20</span>
			<button className="custom-button">
			  <svg className="custom-svg h-5 w-5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
				<path d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
			  </svg>
			</button>
		  </div>
		</div>
		<div className="custom-mt-3">
		  <label className="custom-label" for="count">Color:</label>
		  <div className="custom-flex items-center mt-1">
			<button className="custom-color-button"></button>
			<button className="custom-color-button"></button>
			<button className="custom-color-button"></button>
		  </div>
		</div>
		<div className="custom-flex items-center mt-6">
		  <button className="custom-order-button px-8 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500">Order Now</button>
		  <button className="custom-secondary-button mx-2 text-gray-600 border rounded-md p-2 hover:bg-gray-200 focus:outline-none">
			<svg className="custom-svg h-5 w-5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
			  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
			</svg>
		  </button>
		</div>

      </div>
      </div>
      <MoreProducts />
    </div>
    </main>
  );
}

const MoreProducts = ()=>{
  return(
    <div className="more-products-container">
    <h3 className="more-products-title">More Products</h3>
    <div className="more-products-grid grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
      <div className="product-item w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
        <div className="product-image flex items-end justify-end h-56 w-full bg-cover" style={{backgroundImage: `url('https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=376&q=80')`}}>
          <button className="product-button p-2 rounded-full bg-blue-600 text-white mx-5 -mb-4 hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
            <svg className="product-svg h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </button>
        </div>
        <div className="product-details px-5 py-3">
          <h3 className="product-name text-gray-700 uppercase">Chanel</h3>
          <span className="product-price text-gray-500 mt-2">$12</span>
        </div>
      </div>
    </div>
  </div>

  )
}

export default ProductPage;
