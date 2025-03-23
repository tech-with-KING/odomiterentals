import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authcontext';
import './index.css';

const SignupForm = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [user_name, setUserName] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const getPasswordStrength = (password) => {
    if (password.length < 8) return 'Weak';
    if (password.length < 12) return 'Medium';
    return 'Strong';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('user_name', user_name);
      formData.append('first_name', first_name);
      formData.append('last_name', last_name);
      if (image) formData.append('image', image);

      const success = await signup(formData);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Signup failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during signup. Please try again.');
      console.error('Signup error:', err);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="auth-container">
      <h1>Don't Have an Account? No worries</h1>
      <p>Register to continue shopping with us</p>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="youremail@example.com" 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="user_name">Username</label>
          <input 
            type="text" 
            id="user_name" 
            value={user_name}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Username" 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input 
            type="text" 
            id="first_name" 
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name" 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="last_name">Last Name</label>
          <input 
            type="text" 
            id="last_name" 
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name" 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <small>Must be at least 8 characters</small>
          <span className="password-strength">{getPasswordStrength(password)}</span>
        </div>
        
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input 
            type="password" 
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Profile Image</label>
          <input 
            type="file" 
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit" className="auth-btn">Register</button>
      </form>
      
      <div className="social-auth">
        <p>Or Register with</p>
        <button className="google-btn">Google</button>
        <button className="apple-btn">Apple ID</button>
      </div>
      
      <p className="switch-auth">Already have an account? <button onClick={onSwitchToLogin}>Log In</button></p>
    </div>
  );
};

export default SignupForm;
