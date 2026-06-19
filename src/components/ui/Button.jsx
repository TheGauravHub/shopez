import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-primary',
    success: 'btn-primary'
  };
  
  const sizeStyles = {
    sm: { padding: '0 16px', minHeight: '36px', fontSize: '13px' },
    md: { padding: '0 20px', minHeight: '44px', fontSize: '14px' },
    lg: { padding: '0 24px', minHeight: '52px', fontSize: '16px' }
  };
  
  const currentSize = sizeStyles[size] || sizeStyles.md;
  
  const dangerStyle = variant === 'danger' ? { background: 'var(--danger)', boxShadow: 'var(--shadow-md)' } : {};
  const successStyle = variant === 'success' ? { background: 'var(--success)', boxShadow: 'var(--shadow-md)' } : {};
  
  return (
    <motion.button
      className={`${variantClasses[variant]} ${className}`}
      style={{
        ...currentSize,
        ...dangerStyle,
        ...successStyle,
        opacity: disabled || loading ? 0.6 : 1,
        cursor: disabled || loading ? 'not-allowed' : 'pointer'
      }}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" style={{ marginRight: '8px' }} />}
      {Icon && !loading && <Icon size={16} style={{ marginRight: '8px' }} />}
      {children}
    </motion.button>
  );
};

export default Button;
