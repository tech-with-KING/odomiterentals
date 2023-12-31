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
        
        </section>
        <div className="footer-columns">

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
      </div>
    </footer>
  );
};

export default Footer;
