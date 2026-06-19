import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Lock, Mail, ShoppingBag, User, Sparkles, ArrowRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register, user } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const strength = Math.min(100, password.length * 14 + (/[A-Z]/.test(password) ? 15 : 0) + (/[0-9]/.test(password) ? 15 : 0));

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Frontend validations
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    const result = await register(username, email, password, confirmPassword);
    if (result.success) {
      navigate('/');
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
          <Sparkles size={12} /> Create your ShopEZ ID
        </motion.span>
        <h1>Build your profile, cart, and order history.</h1>
        <p>Modern customer accounts make the project feel like a complete commerce platform.</p>
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
          <h2>Create Account</h2>
          <p>Sign up to start shopping on ShopEZ</p>
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
          
          {/* Username */}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-with-icon">
              <User size={18} />
              <input
                type="text"
                id="username"
                className="form-input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
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

          {/* Password */}
          <div className="form-group">
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
            <motion.div 
              className="password-meter" 
              aria-label="Password strength"
              initial={{ width: 0 }}
              animate={{ width: `${strength}%` }}
              transition={{ duration: 0.3 }}
            >
              <span style={{ width: `${strength}%` }} />
            </motion.div>
          </div>

          {/* Confirm Password */}
          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-with-icon">
              <Lock size={18} />
              <input
                type="password"
                id="confirmPassword"
                className="form-input"
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            {submitting ? 'Creating account...' : (
              <>
                Register <ArrowRight size={16} />
              </>
            )}
          </motion.button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in here</Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Register;
