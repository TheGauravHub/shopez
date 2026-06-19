import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hover = false,
  onClick,
  ...props
}) => {
  return (
    <motion.div
      className={`card ${className}`}
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        padding: 'var(--spacing-lg)',
        border: '1px solid var(--border)'
      }}
      whileHover={hover ? { scale: 1.02, boxShadow: 'var(--shadow-lg)' } : undefined}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
