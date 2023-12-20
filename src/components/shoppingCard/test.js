  import React from 'react';
  import './test.css'
  import { Chair, Home, ShoppingCart } from '@mui/icons-material';
    
  const ItemCard = () => {
    return(
    <article className="card_item">
        <div className="child_div">
          <img src="https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Hotel Photo" />
        </div>

        <div className="prod_desc">
          <h2 className="prod">Adobe Photoshop CC 2022</h2>
          <p className="p">Lisbon, Portugal</p>

          <div className='price'>
              <p class="">$850</p>

            <div class='shopping_cart'>
              <ShoppingCart />
              <button class="text-smal cart_btn">Add to cart</button>
            </div>
          </div>
        </div>
   </article>
   );
  };
  export default ItemCard;