import React, { useState } from 'react';
import './header.css';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../contexts/authcontext';

const Menu = () => {
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn, isAdmin, logout } = useAuth()
  const navigate = useNavigate();

  const toggleNav = () => {
    setIsNavVisible(!isNavVisible);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsNavVisible(false);
  };

  return (
    <>
      <div className="top-bar">
        <div className="language-currency">
          <select>
            <option>ENG</option>
          </select>
          <select>
            <option>USD</option>
          </select>
        </div>
        <div className="top-links">
          <a href="#" onClick={() => handleNavigation('/Contactus')}>Contact Us</a>
          <a href="#" onClick={() => handleNavigation('/aboutpage')}>About Us</a>
          <a href="#">FAQ</a>
        </div>
      </div>
      <header className="main-header">
        <div className="logos" onClick={() => handleNavigation('/')}><> <h2>OdomiteRentals</h2> <p>a party rental you can trust</p></></div>
        <div className="menu-toggle" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </div>
        <nav className={`main-nav ${isNavVisible || isMobileMenuOpen ? 'active' : ''}`}>
          <a onClick={() => handleNavigation('/Catalogue')}>Products</a>
          <a onClick={() => handleNavigation('/Catalogue')}>Cartegories</a>
          <a onClick={() => handleNavigation('/services')}>Services</a>
          {isAdmin ? <a onClick={() => handleNavigation('/addproducts')}>UpdateStore</a>: null}    
          {/*<a  >Login</a>*/}
        </nav>
        <div className="user-actions">

          <a href="#"><SearchIcon /></a>
          <a href="#" onClick={() => handleNavigation('/cart')}><ShoppingCartIcon style={{fontSize: '30px'}}/></a>
          {!isAdmin && !isLoggedIn ?<a href="#"  onClick={() => handleNavigation('/accounts')}>Login <PersonIcon /></a>:  <img src="https://images.unsplash.com/photo-1517423568366-8b83523034fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80"                     alt="Profile Photo" 
            className="user_photo"  onClick={() => handleNavigation('/profile')}/>}
        </div>
      </header>
      <div className="info-bar">
        <span>📦 Seamless Shipping Accross New Jersey</span>
        <span>🔄 45 Early Pickup And Delivery</span>
        <span>⭐⭐⭐⭐⭐  Perfect five star reviews form over 100+ clients</span>
      </div>
    </>
  );
};

export default Menu;

