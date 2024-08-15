import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authcontext'; // Adjust the path as needed
import './index.css';

const SignupForm = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState('creator');
  const [error, setError] = useState('');

  const { signup } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (password) => {
    // Add your password validation logic here
    return password.length >= 8;
  };

  const getPasswordStrength = (password) => {
    // Add your password strength logic here
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
      const success = await signup({ email, password, accountType });
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

  return (
    <div className="auth-container">
      <h1>Don't Have an Account ? No worries</h1>
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
        
        <div className="account-type">
          <p>Select type of your account</p>
          <label>
            <input 
              type="radio" 
              name="account-type" 
              value="creator" 
              checked={accountType === 'creator'}
              onChange={() => setAccountType('creator')}
            />
            Creator Account
          </label>
          <label>
            <input 
              type="radio" 
              name="account-type" 
              value="personal"
              checked={accountType === 'personal'}
              onChange={() => setAccountType('personal')}
            />
            Personal Account
          </label>
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
