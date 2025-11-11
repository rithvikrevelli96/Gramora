import React from 'react';

const Button = ({ label, onClick, style = {}, className = '' }) => {
  return (
    <button onClick={onClick} className={`gramora-btn ${className}`} style={style}>
      {label}
    </button>
  );
};

export default Button;