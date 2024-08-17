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
} from '@mui/icons-material';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="profile">
        <img src="https://via.placeholder.com/40" alt="John Doe" />
        <div className="profile-info">
          <div className="profile-name">John Doe</div>
          <div className="profile-email">johndoe@gmail.com</div>
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
        <Settings />
        <span>Settings</span>
      </div>
      <div className="logout">
        <div className="menu-item">
          <Logout />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
