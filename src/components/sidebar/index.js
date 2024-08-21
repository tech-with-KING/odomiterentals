import React from 'react';
import './index.css';
import {
  Search,
  Science,
  Description,
  Group,
  Notifications,
  Settings,
  Logout,
  Login,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/authcontext'; // Update this path
import { useNavigate } from 'react-router-dom'; // Import if you're using react-router

const Sidebar = () => {
  const { user, logout, isLoggedIn, isAdmin } = useAuth();
  const navigate = useNavigate(); // Use this if you want to redirect after logout

  const handleLogout = () => {
    logout();
    // navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="profile">
        <img src={"https://avatars.githubusercontent.com/u/214020?s=40&v=4"} alt="hello" />
        <div className="profile-info">
          <div className="profile-name">{'username'}</div>
          <div className="profile-email">{'email@example.com'}</div>
        </div>
      </div>
      <div className="search-bar">
        <Search />
        <input type="text" placeholder="Search..." />
      </div>
      <div className="menu-item">
        <Group />
        <span>Cartegory</span>
      </div>
      <div className="menu-item dropdown">
        <Description />
        <span>Featured</span>
        <div className="dropdown-content">
          <a href="#">Cartegories</a>
          <a href="#">Featured Products</a>
          <a href="#">Quarterly Report</a>
          <a href="#">Promotions</a>
          <a href="#"></a>
        </div>
      </div>
      <div className="menu-item">
        <Notifications />
        <span>Notifications</span>
        <div className="notification-badge">1</div>
      </div>
      <div className="menu-item">
        {
          isAdmin ? <> <Settings /> <span >UpdateProducts</span></> : null
        }

      </div>
      <div className="logout">

        <div className="menu-item" onClick={handleLogout}>
          {
            isLoggedIn ? <>
              <Logout />
              <span>Logout</span>
            </> :
              <>
                <Login />
                <span>Login</span>
              </>
          }

        </div>
      </div>
    </div>
  );
};

export default Sidebar;
