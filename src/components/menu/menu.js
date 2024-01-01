import React, { useState } from 'react';
import './menu.css';
import { Link } from 'react-router-dom';
import { Cancel, CancelOutlined, Close, Home, MenuBookOutlined, MenuOpen, Phone } from '@mui/icons-material';

const Menu = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="menu__wrapper">
    <div className="menu__bar">
      <div to="/" title="Logo" className="logo">
        <h1>ODOMITE RENTALS</h1>
        <p>A party rental You can trust always</p>
      </div>
      <div
        className="menu-icon"
        title="Burger Menu"
        alt="Burger Menu"
        onClick={toggleMenu}
      >
        {isMobileMenuOpen ? (
          <Close style={{ fontSize: "30px" }} />
        ) : (
          <MenuOpen style={{ fontSize: "30px" }} />
        )}
      </div>
      <ul className={`navigation ${isMobileMenuOpen ? 'navigation--mobile' : ''}`}>
        <li>
          <Link className='a' to="/" title="home">
            Home
          </Link>
        </li>
        <li>
          <Link  className='a' to="/products" title="products">
            Products
          </Link>
        </li>
        <li>
          <Link  className='a' to="/services" title="services">
            Services
          </Link>
        </li>
        <li>
          <Link className='a'  to="/aboutus" title="About">
            About
          </Link>
        </li>
        <li>
          <Link className='a' to="/contact" title="Contact Us" style={{display: "flex", alignItems: 'center'}}>
            <Phone style={{color: 'blue'}}/> Contact Us
          </Link>
        </li>
      </ul>
    </div>
  </div>
  );
};

export default Menu;
