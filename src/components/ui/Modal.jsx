import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  className = '',
  ...props
}) => {
  const sizes = {
    sm: { maxWidth: '400px' },
    md: { maxWidth: '500px' },
    lg: { maxWidth: '700px' },
    xl: { maxWidth: '900px' }
  };
  
  const currentSize = sizes[size] || sizes.md;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
          />
          <motion.div
            className={`modal-content ${className}`}
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'var(--surface)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-xl)',
              width: '100%',
              ...currentSize,
              maxHeight: '90vh',
              overflow: 'auto',
              zIndex: 1001
            }}
            onClick={(e) => e.stopPropagation()}
            {...props}
          >
            {(title || showCloseButton) && (
              <div
                className="modal-header"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px',
                  borderBottom: '1px solid var(--border)'
                }}
              >
                {title && (
                  <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>
                    {title}
                  </h3>
                )}
                {showCloseButton && (
                  <motion.button
                    onClick={onClose}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)',
                      padding: '4px',
                      borderRadius: 'var(--radius-sm)'
                    }}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </motion.button>
                )}
              </div>
            )}
            <div className="modal-body" style={{ padding: '20px' }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
