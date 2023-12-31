import React from 'react';
import { Link } from 'react-router-dom';
import '../globalstyle.css'
import HeaderSlideBar from './new_slidebar/slidebar';
const HeaderBanner = () => {
  return (
    <div className="hero-banner-container">
      <div className='banner-wrapper'> 
          <p className='beats-solo'>we offer wide range of services</p>
          <h3>OUR SERVICES</h3>
            <Link href={`/shop`}>
            <button type="button">Visit Store</button>
          </Link>
        </div>  
      <HeaderSlideBar />
    </div>
  )
}

export default HeaderBanner