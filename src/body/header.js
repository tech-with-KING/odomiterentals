import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ heading, paragraph, textColor, backgroundColor }) => {
  const defaultTextColor = textColor || "rgb(255, 140, 26)";
  const defaultBackgroundColor = backgroundColor || "transparent";

  const headerStyle = {
    fontFamily: 'Open Sans, sans-serif',
    textAlign: 'center',
    width: '100%',
    padding: '0px',
    color: defaultTextColor,
    backgroundColor: defaultBackgroundColor,
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

Header.propTypes = {
  heading: PropTypes.string.isRequired,
  paragraph: PropTypes.string.isRequired,
  textColor: PropTypes.string,
  backgroundColor: PropTypes.string,
};

export default Header;
