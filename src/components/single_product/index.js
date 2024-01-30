import React, { useEffect, useState } from 'react';
import "./single_product.css"
import { useParams } from "react-router-dom";
import {products} from '../../deviceinfo';
import ProductCard from '../shoppingCard/card';
function ProductPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Ensure productId is a valid number
    if (!productId || isNaN(+productId)) {
      return;
    }

    // Convert productId to a number before using it as an index
    const productIndex = +productId;

    // Check if the index is within the bounds of the array
    if (productIndex >= 0 && productIndex < products.length) {
      setProduct(products[productIndex]);
    }
  }, [productId]);
  const backgroundcolor = {
    color: "rgb(250, 250, 250,0.77)",
    fontSize: "20px",
    marginLeft: "0px",
    marginRight: "0px"
  };

  if (!product) {
    return <><h1></h1></>;
  }

  return (
    <main className='main-container'>
    <div className="containerised" >
      <div className='flex_div'>
      <div className='image_container'>
        <div className='image_container_child'>
          <img className="product_image" src={`${product.img}`} alt="Nike Air"></img>
        </div>
      </div>
      <div className='Product_detail'>
        <h3 className='product_name'>{product.Product_name}</h3>
        <span className='product_price'>{product.price}</span>
        <hr className='my_3'></hr>
        <div className="custom-container mt-2">
			  <div className="custom-flex items-center mt-1">
			<p className='custom-label'>
        {product.desc}
      </p>
		  </div>
		</div>
		<div className="custom-flex items-center mt-6">
		  <button className="custom-order-button px-8 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500">Call to order</button>
		  <button className="custom-secondary-button mx-2 text-gray-600 border rounded-md p-2 hover:bg-gray-200 focus:outline-none">
		  </button>
		</div>
      </div>
      </div>
    </div>
    </main>
  );
}

// const MoreProducts = ({cart})=>{
//   return(
//     <div className="more-products-container">
//       <h3 className="more-products-title">More Products</h3>
//       <ProductCard  cart={cart} devices={products}/>
//   </div>

//   )
// }

export default ProductPage;
