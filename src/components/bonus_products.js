import React from 'react';
import { Link } from 'react-router-dom';
import '../globalstyle.css'
import Img from './2.jpg'
import HeaderSlideBar from './new_slidebar/slidebar';
const HeaderBanner = () => {
  return (
    <div className="hero-banner-container">
          <p className='beats-solo'>20%</p>
          <h3>AMAZING DISCOUNTS<br></br> THIS CHRISTMAS</h3>
            <Link href={`/shop`}>
            <button type="button">View in store</button>
          </Link>
        
      <HeaderSlideBar />
    </div>
  )
}

export default HeaderBanner