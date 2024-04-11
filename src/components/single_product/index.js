import React, { useEffect, useState } from 'react';
import "./single_product.css"
import { useParams } from "react-router-dom";
import { products } from '../../deviceinfo';
import ProductCard from '../shoppingCard/card';
import Header from '../../body/header';
function ProductPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  function findProductById(productsArray, pId) {
    return productsArray.find(product => product['id'] === pId);
  }
  useEffect(() => {
    const id = parseInt(productId);
    const foundProduct = findProductById(products, id);
    setProduct(foundProduct);
    console.log(foundProduct)
    console.log(products.length)
  }, [productId]);
  
  if (!product) {
    return <><h1></h1></>;
  }

  return (
    <main className='main-container'>
      <div className="containerised" >
        <div className='flex_div'>
          <div className='image_container'>
            <div className='image_container_child'>
              <img className="product_image" src={`${product.img}`} alt={`${product.product_name}`}></img>
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
      <Header heading='Similar Products' paragraph='See similar Products We have in Stock' />
      <ProductCard cart={product.cartegory} products={products} />
    </main>
  );
}

export default ProductPage;
