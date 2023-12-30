import React, { useState } from 'react';
import './menu.css';
import { Link } from 'react-router-dom';
import { Cancel, CancelOutlined, Close, Home, MenuBookOutlined, MenuOpen } from '@mui/icons-material';

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
          <Link className='a' to="/" title="Services">
            Services
          </Link>
        </li>
        <li>
          <Link  className='a' to="/shop" title="Blog">
            Blog
          </Link>
        </li>
        <li>
          <Link className='a'  to="/Services" title="About">
            About
          </Link>
        </li>
        <li>
          <Link className='a' to="/About Us" title="Contact Us">
            Contact Us
          </Link>
        </li>
      </ul>
    </div>
  </div>
  );
};

export default Menu;
