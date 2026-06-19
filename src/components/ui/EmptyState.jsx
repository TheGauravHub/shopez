import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Package, AlertCircle, RefreshCw } from 'lucide-react';

const EmptyState = ({
  icon: Icon = ShoppingBag,
  title = 'No items found',
  description = 'There are no items to display at the moment.',
  actionLabel,
  onAction,
  actionIcon: ActionIcon = RefreshCw,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variants = {
    default: {
      iconBg: 'var(--primary-soft)',
      iconColor: 'var(--primary)'
    },
    error: {
      iconBg: 'var(--danger-soft)',
      iconColor: 'var(--danger)'
    },
    warning: {
      iconBg: 'var(--warning-soft)',
      iconColor: 'var(--warning)'
    }
  };
  
  const currentVariant = variants[variant] || variants.default;
  
  return (
    <motion.div
      className={`empty-state ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-3xl) var(--spacing-lg)',
        textAlign: 'center'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      {...props}
    >
      <motion.div
        className="empty-state-icon"
        style={{
          width: '80px',
          height: '80px',
          borderRadius: 'var(--radius-xl)',
          background: currentVariant.iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--spacing-lg)',
          color: currentVariant.iconColor
        }}
        whileHover={{ scale: 1.05, rotate: 5 }}
      >
        <Icon size={40} />
      </motion.div>
      <h3 className="empty-state-title" style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)', marginBottom: 'var(--spacing-sm)' }}>
        {title}
      </h3>
      <p className="empty-state-description" style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: 'var(--spacing-lg)', maxWidth: '320px' }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <motion.button
          className="empty-state-action"
          onClick={onAction}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: 'var(--radius-md)',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all var(--transition)',
            background: 'var(--primary)',
            color: 'white',
            border: 'none'
          }}
          whileHover={{ scale: 1.05, boxShadow: 'var(--shadow-md)' }}
          whileTap={{ scale: 0.95 }}
        >
          {ActionIcon && <ActionIcon size={16} />}
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;
