import React from 'react';
import { motion } from 'framer-motion';

const Input = ({
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  icon: Icon,
  error,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`form-group ${className}`}>
      {label && <label htmlFor={props.id}>{label}</label>}
      <div className="input-with-icon" style={{ position: 'relative' }}>
        {Icon && (
          <Icon 
            size={17} 
            style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }} 
          />
        )}
        <motion.input
          type={type}
          className="form-input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          style={{
            paddingLeft: Icon ? '40px' : '12px',
            borderColor: error ? 'var(--danger)' : undefined
          }}
          whileFocus={{ scale: 1.01 }}
          {...props}
        />
      </div>
      {error && (
        <motion.span 
          style={{ 
            color: 'var(--danger)', 
            fontSize: '12px', 
            marginTop: '4px',
            display: 'block'
          }}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.span>
      )}
    </div>
  );
};

export default Input;
