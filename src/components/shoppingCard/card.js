import React from 'react';
import './card.css'
import { Chair, Home, Search } from '@mui/icons-material';
import { Table } from '@mui/material';
import ItemCard from './test';
const ProductCard = ({ products, cart }) => {
  const chairProducts = products.filter((product) =>
  cart === 'All' ? true : product.cartegory === cart
);
  return (
    <div className='container_wrapper'>
      <ul className="container">
        {chairProducts.map((product) => (
          <li key={product.id}>
            <ItemCard
              id={product.id}
              deviceName={product.Product_name}
              spec={product.desc}
              price={product.price}
              img={product.img}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
const ProductHeader = () => 
{
  return (
    <div className="wrapper">
        <div className='div'>
            <h3 className='heading'>ALL PRODUCTS </h3>
            <ul className='shop_list'>
                <li className='menu_child'><Home /><button>Chairs</button></li>
                <li className='menu_child'><Table /><button>Tables</button></li>
                <li className='menu_child'><Home /><button>Tents</button></li>
                <li className='menu_child'><Chair /><button>Chairs</button></li>
            </ul>
            <SearchPrduct />
        </div>
    </div>
      )
};
const SearchPrduct = (props)=>{
  return(
	<div className="search_letter">
	  <div className='input_container'>
		<input placeholder='enter text ... '/><button>Search</button>
	  </div>
	</div>
  )
}
export {ProductHeader};
      
    
export default ProductCard;
