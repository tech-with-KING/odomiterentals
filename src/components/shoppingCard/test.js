  import React from 'react';
  import './test.css'
  import { Chair, Home, ShoppingCart, Star } from '@mui/icons-material';
  const ItemCard = ({ name, deviceName, spec, price, img }) => {
    return (
      <article className="card_item">
        <div className="child_div">
          <img src={`${img}`} alt={name} />
          <div className="rating">
            <Star style={{color:"#ff8c1a"}}/>
            <span class="rating_count">4.9</span>
          </div>
        </div>
  
        <div className="prod_desc">
          <h2 className="prod">{name}</h2>
          <p className="p">{deviceName}</p>
  
          <div className="price">
            <p className="">{price}</p>
  
            <div className="shopping_cart">
              <button className="text-small cart_btn">Product desc</button>
            </div>
          </div>
        </div>
      </article>
    );
  };
  export default ItemCard;