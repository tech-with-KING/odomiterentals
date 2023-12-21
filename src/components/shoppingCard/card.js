import React from 'react';
import './card.css'
import img from './assets/forest-resized.jpg'
import { Chair, Home } from '@mui/icons-material';
import { Table } from '@mui/material';
import ItemCard from './test';

const ProductCard = () => {
  return (
    <>
      <div className="wrapper">
        <div className='div'>
            <h3 className='heading'>ALL PRODUCTS </h3>
            <ul className='shop_list'>
                <li className='menu_child'><Home /><button>Chairs</button></li>
                <li className='menu_child'><Table /><button>Tables</button></li>
                <li className='menu_child'><Home /><button>Tents</button></li>
                <li className='menu_child'><Chair /><button>Chairs</button></li>
                
            </ul>
        </div>
{/* cards contents  */}
      <div className='container_wrapper'>
              <ul className="container">
                <li><ItemCard /> </li>
                <li><ItemCard /></li>
                <li><ItemCard /></li>
                <li><ItemCard /></li>
                <li><ItemCard /></li>
              </ul>
            </div>`
      </div>
      {/*the classed  */}
     
    </>
  );
};

export default ProductCard;
