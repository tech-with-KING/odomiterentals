import React from 'react';
import './index.css'; // Create a separate CSS file for the styles
import { useAuth } from '../../contexts/authcontext';
const ProfilePage = () => {
  const {logout} =  useAuth()
    return (
        <div className="profile-container">
            <div className="profile-header">
                <img 
                    src="https://images.unsplash.com/photo-1517423568366-8b83523034fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80" 
                    alt="Profile Photo" 
                    className="profile-photo" 
                />
                <h1>Melissa Peters</h1>
                <p>Interior Designer</p>
                <p>Lagos, Nigeria</p>
            </div>

            <div className="stats">
                <div className="stat">
                    <strong>122</strong>
                    <div>Followers</div>
                </div>
                <div className="stat">
                    <strong>67</strong>
                    <div>Following</div>
                </div>
                <div className="stat">
                    <strong>37K</strong>
                    <div>Likes</div>
                </div>
            </div>

            <div className="buttons">
                <button>Edit Profile</button>
                <button>Add Friends</button>
            </div>

            <h2>Photos</h2>
            <div className="photos">
                <img 
                    src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
                    alt="Dog Photo 1" 
                    className="photo" 
                />
                <img 
                    src="https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
                    alt="Dog Photo 2" 
                    className="photo" 
                />
                <img 
                    src="https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
                    alt="Dog Photo 3" 
                    className="photo" 
                />
            </div>
          <button onClick={()=>logout()}> Logout</button>
        </div>
    );
};

export default ProfilePage;
