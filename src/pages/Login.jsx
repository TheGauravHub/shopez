import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Lock, Mail, ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, loading } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await login(email, password);
    if (result.success) {
      // Check if redirected from checkout
      const from = location.state?.from?.pathname || '/';
      navigate(from);
    } else {
      setError(result.message);
    }
    setSubmitting(false);
  };

  return (
    <motion.div 
      className="auth-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div 
        className="auth-visual"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <motion.span 
          className="hero-pill"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
        >
          <Sparkles size={12} /> Premium account access
        </motion.span>
        <h1>Sign in to a smarter ShopEZ experience.</h1>
        <p>Track orders, manage carts, unlock wishlist flows, and continue checkout on every device.</p>
      </motion.div>
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="auth-header">
          <motion.div 
            className="logo"
            whileHover={{ scale: 1.05 }}
          >
            <span className="logo-mark"><ShoppingBag size={23} /></span>
            <span>ShopEZ</span>
          </motion.div>
          <h2>Welcome Back</h2>
          <p>Please enter your details to sign in</p>
        </div>

        <div className="social-grid">
          <motion.button 
            className="btn-secondary" 
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Github size={17} /> GitHub
          </motion.button>
          <motion.button 
            className="btn-secondary" 
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            G Google
          </motion.button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              className="alert alert-danger"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} />
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Lock size={18} />
              <input
                type="password"
                id="password"
                className="form-input"
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <motion.button 
            type="submit" 
            className="auth-submit-btn"
            disabled={submitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {submitting ? 'Signing in...' : (
              <>
                Sign In <ArrowRight size={16} />
              </>
            )}
          </motion.button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
          <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--gray-border)' }}>
            Are you an administrator? <Link to="/admin/login" style={{ color: 'var(--secondary)' }}>Admin Login</Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
