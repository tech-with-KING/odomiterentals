import React from 'react';
import { Link } from 'react-router-dom';
import '../globalstyle.css'
import Img from './2.jpg'
const FooterBanner = () => {
  return (
    <div className="footer-banner-container">
      <div className="banner-desc">
        <div className="left">
          <p>20%</p>
          <h3>10X10 tent</h3>
          <h3>15X15 tents</h3>
          <p>in 2 weeks</p>
        </div>
        <div className="right">
          <p>this is a small text</p>
          <h3>this is a mid text </h3>
          <p>products description area</p>
          <Link href={`/shop`}>
            <button type="button">View IN store</button>
          </Link>
        </div>

        <img 
          src={Img} href='img' className="footer-banner-image"
        />
      </div>
    </div>
  )
}

export default FooterBanner