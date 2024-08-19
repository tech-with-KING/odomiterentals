import React from 'react';
import './index.css';
import { useAuth } from '../../contexts/authcontext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, logout, isLoggedIn, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isLoggedIn) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img 
          src={ "https://avatars.githubusercontent.com/u/214020?s=40&v=4"}
          alt="Profile Photo" 
          className="profile-photo" 
        />
        <h1>name</h1>
        <p>{ 'Occupation not set'}</p>
        <p>{'Location not set'}</p>
        {isAdmin && <p className="admin-badge">Admin</p>}
      </div>
      <div className="stats">
        <div className="stat">
          <strong>{ 0}</strong>
          <div>Followers</div>
        </div>
        <div className="stat">
          <strong>{0}</strong>
          <div>Following</div>
        </div>
        <div className="stat">
          <strong>{ 0}</strong>
          <div>Likes</div>
        </div>
      </div>
      <div className="buttons">
        <button onClick={() => navigate('/edit-profile')}>Edit Profile</button>
        {!isAdmin && <button>Add Friends</button>}
        {isAdmin && <button onClick={() => navigate('/admin-dashboard')}>Admin Dashboard</button>}
      </div>
      <h2>Items You may like</h2>
      <div className="photos">
        {/*{user.photos && user.photos.map((photo, index) => (
          <img 
            key={index}
            src={photo} 
            alt={`User Photo ${index + 1}`} 
            className="photo" 
          />
          ))}*/}
      </div>
      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
};

export default ProfilePage;
