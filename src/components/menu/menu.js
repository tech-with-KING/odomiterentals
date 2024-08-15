import React, { useState } from 'react';
import './header.css';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';

const Menu = () => {
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
        <div className="logos" onClick={() => handleNavigation('/')}>OdomiteRentals</div>
        <div className="menu-toggle" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </div>
        <nav className={`main-nav ${isNavVisible || isMobileMenuOpen ? 'active' : ''}`}>
          <a onClick={() => handleNavigation('/Catalogue')}>Products</a>
          <a onClick={() => handleNavigation('/Catalogue')}>Cartegories</a>
          <a onClick={() => handleNavigation('/services')}>Services</a>
          
          {/*<a  >Login</a>*/}
        </nav>
        <div className="user-actions">
          <a href="#"  onClick={() => handleNavigation('/account')}>Login <PersonIcon /></a>
          <a href="#"><SearchIcon /></a>
          <a href="#"><FavoriteIcon /></a>
          <a href="#" onClick={() => handleNavigation('/cart')}><ShoppingCartIcon /></a>
        </div>
      </header>
      <div className="info-bar">
        <span>📦 Free Shipping Worldwide</span>
        <span>🌳 3 trees planted</span>
        <span>🔄 45 Day free returns</span>
        <span>⭐ 8.2+ Independent Reviews</span>
      </div>
    </>
  );
};

export default Menu;

