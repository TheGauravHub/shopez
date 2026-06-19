import React from 'react';
import { motion } from 'framer-motion';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const variants = {
    default: {
      background: 'var(--primary-soft)',
      color: 'var(--primary)'
    },
    success: {
      background: 'var(--success-soft)',
      color: 'var(--success)'
    },
    warning: {
      background: 'var(--warning-soft)',
      color: 'var(--warning)'
    },
    danger: {
      background: 'var(--danger-soft)',
      color: 'var(--danger)'
    },
    info: {
      background: 'var(--secondary-soft)',
      color: 'var(--secondary)'
    }
  };
  
  const sizes = {
    sm: {
      padding: '4px 8px',
      fontSize: '11px',
      borderRadius: 'var(--radius-sm)'
    },
    md: {
      padding: '6px 12px',
      fontSize: '12px',
      borderRadius: 'var(--radius-md)'
    },
    lg: {
      padding: '8px 16px',
      fontSize: '14px',
      borderRadius: 'var(--radius-lg)'
    }
  };
  
  const currentVariant = variants[variant] || variants.default;
  const currentSize = sizes[size] || sizes.md;
  
  return (
    <motion.span
      className={`status-badge ${className}`}
      style={{
        ...currentVariant,
        ...currentSize,
        display: 'inline-flex',
        alignItems: 'center',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}
      whileHover={{ scale: 1.05 }}
      {...props}
    >
      {children}
    </motion.span>
  );
};

export default Badge;
