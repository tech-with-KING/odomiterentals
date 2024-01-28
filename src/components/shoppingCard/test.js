  import React from 'react';
  import './test.css'
  import { Chair, Home, ShoppingCart, Star } from '@mui/icons-material';
import { Link } from 'react-router-dom';
  const ItemCard = ({ id, name, deviceName, spec, price, img}) => {
    return (
      <article className="card_item_cont">
        <div className="child_div">
          <img src={`${img}`} alt={name} />
          <div className="rating">
            <Star style={{color:"#ff8c1a"}}/>
            <span class="rating_count">4.9</span>
          </div>
        </div>
  
        <div className="prod_desc">
          <p className="p">{deviceName}</p>
          <div className="price">
            <p className="">{price}</p>
            <div className="shopping_cart">
              <Link to={`/products/${id}`} ><button className="text-small cart_btn">View Product Detail</button></Link>
            </div>
          </div>
        </div>
      </article>
    );
  };
  export default ItemCard;