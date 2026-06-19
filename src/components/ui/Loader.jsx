import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({
  size = 'md',
  color = 'primary',
  className = '',
  ...props
}) => {
  const sizes = {
    sm: { width: '20px', height: '20px', borderWidth: '2px' },
    md: { width: '30px', height: '30px', borderWidth: '3px' },
    lg: { width: '40px', height: '40px', borderWidth: '4px' },
    xl: { width: '60px', height: '60px', borderWidth: '5px' }
  };
  
  const colors = {
    primary: 'var(--primary)',
    secondary: 'var(--secondary)',
    accent: 'var(--accent)',
    success: 'var(--success)',
    danger: 'var(--danger)',
    white: 'white'
  };
  
  const currentSize = sizes[size] || sizes.md;
  const currentColor = colors[color] || colors.primary;
  
  return (
    <motion.div
      className={`loader ${className}`}
      style={{
        ...currentSize,
        borderRadius: '50%',
        border: `${currentSize.borderWidth}px solid var(--primary-light)`,
        borderTopColor: currentColor,
        animation: 'spin 1s linear infinite'
      }}
      {...props}
    />
  );
};

export default Loader;
