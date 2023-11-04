import React from 'react';
import { Link } from 'react-router-dom';
import '../globalstyle.css'
import Img from './2.jpg'
const HeaderBanner = () => {
  return (
    <div className="hero-banner-container">
      <div>
        <div className="left">
          <p className='beats-solo'>20%</p>
          <h3>AMAZING DISCOUNTS<br></br> THIS CHRISTMAS</h3>
          <img 
          src={Img} alt='img' className="hero-banner-image"  />
            <Link href={`/shop`}>
            <button type="button">View in store</button>
          </Link>
          <div className='desc'>
            <h5>Description</h5>
            <p>This is the Description for the above product and also be able to sort them</p>
          </div>
       
        </div>

     
      </div>
    </div>
  )
}

export default HeaderBanner