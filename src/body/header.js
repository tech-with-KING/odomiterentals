import React from 'react';
import PropTypes from 'prop-types';

const   Header = ({ heading, paragraph }) => {
  const headerStyle = {
    fontFamily: 'Open Sans, sans-serif',
    textAlign: 'center',
    width: '100%',
    padding: '0px',
    color:"rgb(255, 140, 26)"
  };

  const headingStyle = {
    fontSize: '2.5em',
    marginBottom: '0px',
    
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

export default Header;
