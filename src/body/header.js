import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ heading, paragraph }) => {
  const headerStyle = {
    fontFamily: 'Open Sans, sans-serif',
    textAlign: 'center',
    width: '100%',
    backgroundColor: '#f0f0f0', // Add your preferred background color
    padding: '20px',
  };

  const headingStyle = {
    fontSize: '2.5em',
    marginBottom: '10px',
  };

  const paragraphStyle = {
    fontSize: '1.2em',
  };

  return (
    <div style={headerStyle}>
      <h3 style={headingStyle}>{heading}</h3>
      <p style={paragraphStyle}>{paragraph}</p>
    </div>
  );
};

Header.propTypes = {
  heading: PropTypes.string.isRequired,
  paragraph: PropTypes.string.isRequired,
};

export default Header;
