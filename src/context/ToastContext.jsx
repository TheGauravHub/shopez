import React, { createContext, useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Info, TriangleAlert, X, Sparkles } from 'lucide-react';

export const ToastContext = createContext();

const toastIcons = {
  success: CheckCircle2,
  error: TriangleAlert,
  warning: TriangleAlert,
  info: Info
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((items) => items.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((items) => [...items, { id, message, type }]);
    window.setTimeout(() => dismissToast(id), 3600);
  }, [dismissToast]);

  const value = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" aria-live="polite">
        <AnimatePresence>
          {toasts.map((toast, index) => {
            const Icon = toastIcons[toast.type] || Info;
            return (
              <motion.div
                key={toast.id}
                className={`toast toast-${toast.type}`}
                initial={{ opacity: 0, x: 100, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.9 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 25,
                  delay: index * 0.05 
                }}
                whileHover={{ scale: 1.02 }}
                layout
              >
                <motion.div
                  animate={{ 
                    rotate: toast.type === 'success' ? [0, 10, -10, 0] : 0,
                    scale: toast.type === 'success' ? [1, 1.1, 1] : 1
                  }}
                  transition={{ 
                    duration: 0.6,
                    delay: 0.2
                  }}
                >
                  <Icon size={18} />
                </motion.div>
                <span>{toast.message}</span>
                <motion.button 
                  type="button" 
                  onClick={() => dismissToast(toast.id)} 
                  aria-label="Dismiss notification"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={16} />
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
