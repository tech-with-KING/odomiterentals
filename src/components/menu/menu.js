import React, { useState } from 'react';
import './menu.css';
import { Link, useNavigate } from 'react-router-dom';
import { Close, MenuOpen, Phone } from '@mui/icons-material';

const Menu = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle navigation and close menu
  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="menu__wrapper">
      <div className="menu__bar">
        <div
          to="/"
          title="Logo"
          className="logo"
          onClick={() => handleNavigation('/')}
        >
          <h1 className='Heading'>ODOMITE RENTALS</h1>
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
            <div
              className='a'
              title="home"
              onClick={() => handleNavigation('/')}
            >
              Home
            </div>
          </li>
          <li>
            <div
              className='a'
              title="products"
              onClick={() => handleNavigation('/products/')}
            >
              Products
            </div>
          </li>
          <li>
            <div
              className='a'
              title="services"
              onClick={() => handleNavigation('/services')}
            >
              Services
            </div>
          </li>
          <li>
            <div
              className='a'
              title="About"
              onClick={() => handleNavigation('/aboutpage')}
            >
              About
            </div>
          </li>
          <li>
            <div
              className='a'
              title="Contact Us"
              style={{ display: "flex", alignItems: 'center' }}
              onClick={() => handleNavigation('/contactpage')}
            >
              <Phone style={{ color: 'blue', fontWeight: "bolder", fontSize: "30px", margin: '5px' }} />
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Menu;


