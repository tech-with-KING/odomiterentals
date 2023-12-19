import React, { useState } from 'react';
import './footer.css'; // Import your CSS file

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSignUp = () => {
    // Implement your sign-up logic here
    console.log(`Signed up with email: ${email}`);
  };

  return (
    <footer>
      <div className="footer-line"></div>
      <div className="footer-wrapper">
        <section className="footer-top">
          <div className="footer-headline">
            <h2>Subscribe to our newsletter</h2>
            <p>Stay up to date with our news and articles</p>
          </div>
          <div className="footer-subscribe">
            <input
              type="email"
              spellCheck="false"
              placeholder="Your Email"
              value={email}
              onChange={handleEmailChange}
            />
            <button onClick={handleSignUp}>Sign Up</button>
          </div>
        </section>
        <div className="footer-columns">
          <section className="footer-logo">
            <h2>
              <svg width="1103" height="996" viewBox="0 0 1103 996" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Your SVG path goes here */}
              </svg>
            </h2>
          </section>
          <section>
            <h3>Product</h3>
            <ul>
              <li>
                <a href="#" title="API">
                  API
                </a>
              </li>
              {/* Add more links */}
            </ul>
          </section>
          {/* Add more sections as needed */}
        </div>
        <div className="footer-bottom">
          <div className="social-links">
            <ul>
              <li>
                <a href="#" title="Instagram">
                  <img src="assets/instagram.svg" alt="Instagram" />
                </a>
              </li>
              {/* Add more social links */}
            </ul>
          </div>
          <small>© Atheros Intelligence Ltd. <span id="year">{new Date().getFullYear()}</span>, All rights reserved</small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
