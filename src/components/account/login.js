import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authcontext';
import './index.css';

const LoginForm = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const credentials = {
      email,
      password,
      isAdmin: isAdminLogin,
      ...(isAdminLogin && { adminPin })
    };

    try {
      const success = await login(credentials);
      if (success) {
        navigate('/');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="auth-container">
      <h3>Log in to your account to continue exploring</h3>
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
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        
        <div className="form-group">
          <label>
            <input 
              type="checkbox" 
              checked={isAdminLogin}
              onChange={() => setIsAdminLogin(!isAdminLogin)}
            />
            Admin Login
          </label>
        </div>
        {isAdminLogin && (
          <div className="form-group">
            <label htmlFor="admin-pin">Admin PIN</label>
            <input 
              type="password" 
              id="admin-pin"
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              required 
            />
          </div>
        )}
        
        <button type="submit" className="auth-btn">
          {isAdminLogin ? 'Admin Log In' : 'Log In'}
        </button>
      </form>
      
      <div className="social-auth">
        <p>Or Log In with</p>
        <button className="google-btn">Google</button>
        <button className="apple-btn">Apple ID</button>
      </div>
      
      <p className="switch-auth">Don't have an account? <button onClick={onSwitchToSignup}>Sign Up</button></p>
    </div>
  );
};

export default LoginForm;
