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
        <img src={isLoggedIn & user._image ? user._image : "https://avatars.githubusercontent.com/u/214020?s=40&v=4"} alt={user.name} />
        <div className="profile-info">
          <div className="profile-name">{isLoggedIn ? user.name : 'username'}</div>
          <div className="profile-email">{isLoggedIn ? user.email : 'email@example.com'}</div>
        </div>
      </div>
      <div className="search-bar">
        <Search />
        <input type="text" placeholder="Search..." />
      </div>
      <div className="menu-item">
        <Science />
        <span>Research</span>
      </div>
      <div className="menu-item dropdown">
        <Description />
        <span>Reports</span>
        <div className="dropdown-content">
          <a href="#">Daily Report</a>
          <a href="#">Weekly Report</a>
          <a href="#">Monthly Report</a>
          <a href="#">Quarterly Report</a>
          <a href="#">Annual Report</a>
          <a href="#">Custom Report</a>
        </div>
      </div>
      <div className="menu-item">
        <Group />
        <span>Groups</span>
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
