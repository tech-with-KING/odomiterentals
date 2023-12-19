import React, { useState } from 'react';
import './menu.css';
import { Cancel, CancelOutlined, Close, Home, MenuBookOutlined, MenuOpen } from '@mui/icons-material';

const Menu = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
      <div className="menu__wrapper">
        <div className="menu__bar">
          <div href="#" title="Logo" className="logo">
            <h1>ODOMITE RENTALS</h1>
          </div>
          <div
            className="menu-icon"
            title="Burger Menu"
            alt="Burger Menu"
            onClick={toggleMenu}
          >{isMobileMenuOpen ? <Close style={{fontSize:"30px"}}/> : <MenuOpen style={{fontSize:"30px"}}/>}</div>
          <ul className={`navigation ${isMobileMenuOpen ? 'navigation--mobile' : ''}`}>
            <li>
              <a href="#services" title="Services">
                Services
              </a>
            </li>
            <li>
              <a href="#blog" title="Blog">
                Blog
              </a>
            </li>
            <li>
              <a href="#about" title="About">
                About
              </a>
            </li>
            <li>
              <a href="#contact-us" title="Contact Us">
                Contact Us
              </a>
            </li>
          </ul>
        </div>
      </div>
  );
};

export default Menu;
