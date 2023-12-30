  import React from 'react';
  import './test.css'
  import { Chair, Home, ShoppingCart } from '@mui/icons-material';
  const ItemCard = ({ name, deviceName, spec, price, img }) => {
    return (
      <article className="card_item">
        <div className="child_div">
          <img src={`/img/${img}`} alt={name} />
        </div>
  
        <div className="prod_desc">
          <h2 className="prod">{name}</h2>
          <p className="p">{deviceName}</p>
  
          <div className="price">
            <p className="">{price}</p>
  
            <div className="shopping_cart">
              <ShoppingCart />
              <button className="text-small cart_btn">Add to cart</button>
            </div>
          </div>
        </div>
      </article>
    );
  };
  export default ItemCard;