import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ heading, paragraph }) => {
  const headerStyle = {
    fontFamily: 'Open Sans, sans-serif',
    textAlign: 'center',
    width: '100%',
    backgroundColor:'rgba(0, 0, 0, 0.1);', // Add your preferred background color
    padding: '0px',
  };

  const headingStyle = {
    fontSize: '2.5em',
    marginBottom: '0px',
    color:'#053674;'
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
