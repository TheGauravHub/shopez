import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Boxes,
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Search,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Sun,
  User,
  X
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ThemeContext } from '../context/ThemeContext';
import { ToastContext } from '../context/ToastContext';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const { showToast } = useContext(ToastContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    { name: 'Fashion', icon: Sparkles, text: 'Premium fits, sneakers, watches' },
    { name: 'Electronics', icon: Boxes, text: 'Laptops, audio, desk upgrades' },
    { name: 'Mobiles', icon: ShoppingBag, text: 'Phones, wearables, accessories' },
    { name: 'Groceries', icon: ShoppingCart, text: 'Daily essentials and pantry picks' },
    { name: 'Sports Equipment', icon: Heart, text: 'Fitness gear and outdoor picks' }
  ];

  const suggestions = ['wireless headphones', 'running shoes', 'iphone case', 'coffee maker', 'gym bag'];

  // Sync search input with URL search param if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    if (search) {
      setSearchQuery(search);
    } else if (!location.pathname.startsWith('/products')) {
      setSearchQuery('');
    }
  }, [location]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen(false);
      setMegaOpen(false);
      setSuggestionsOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
    setSuggestionsOpen(false);
  };

  const handleLogoutClick = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const goToCategory = (category) => {
    setMegaOpen(false);
    setMobileMenuOpen(false);
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  const showWishlist = () => {
    showToast('Wishlist UI is ready for your next backend endpoint.', 'info');
  };

  return (
    <>
      <nav className="header-nav" aria-label="Primary navigation">
        <div className="container header-container">
          <Link to="/" className="logo">
            <motion.span 
              className="logo-mark"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ShoppingBag size={23} />
            </motion.span>
            <span>ShopEZ</span>
          </Link>

          {/* Desktop Categories */}
          <div
            className="mega-wrap hide-mobile"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <button className="mega-trigger" type="button" onClick={() => setMegaOpen((open) => !open)}>
              <Menu size={18} />
              <span>Categories</span>
              <ChevronDown size={15} />
            </button>
            <AnimatePresence>
              {megaOpen && (
                <motion.div
                  className="mega-menu"
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  {categories.map(({ name, icon: Icon, text }) => (
                    <motion.button 
                      key={name} 
                      className="mega-card" 
                      type="button" 
                      onClick={() => goToCategory(name)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon size={22} color="var(--primary)" />
                      <strong>{name}</strong>
                      <span>{text}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Search */}
          <form onSubmit={handleSearchSubmit} className="search-bar-form hide-mobile">
            <div className="search-input-wrap">
              <Search size={18} className="search-leading" />
              <input
                type="search"
                className="search-input"
                placeholder="Search products, brands and categories..."
                value={searchQuery}
                aria-label="Search products"
                onFocus={() => setSuggestionsOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSuggestionsOpen(true);
                }}
              />
              <button type="submit" className="search-icon-btn" aria-label="Submit search">
                <Search size={18} />
              </button>
            </div>
            <AnimatePresence>
              {suggestionsOpen && (
                <motion.div
                  className="search-suggestions"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                >
                  {suggestions
                    .filter((item) => item.includes(searchQuery.toLowerCase()) || !searchQuery)
                    .slice(0, 5)
                    .map((item) => (
                      <motion.button
                        key={item}
                        type="button"
                        className="suggestion-item"
                        onMouseDown={() => {
                          setSearchQuery(item);
                          navigate(`/products?search=${encodeURIComponent(item)}`);
                          setSuggestionsOpen(false);
                        }}
                        whileHover={{ x: 4 }}
                      >
                        <Search size={15} />
                        <span>{item}</span>
                      </motion.button>
                    ))}
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <div className="header-actions">
            <motion.button 
              className="theme-toggle" 
              type="button" 
              onClick={toggleTheme} 
              aria-label="Toggle dark mode"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
            >
              {isDark ? <Sun size={19} /> : <Moon size={19} />}
            </motion.button>

            {(!user || user.role !== 'admin') && (
              <motion.button 
                className="icon-btn hide-mobile" 
                type="button" 
                onClick={showWishlist} 
                aria-label="Open wishlist"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart size={20} />
              </motion.button>
            )}

            {(!user || user.role !== 'admin') && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Link to="/cart" className="cart-icon-container" aria-label="Open cart">
                  <motion.div
                    animate={cartCount > 0 ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <ShoppingCart size={20} />
                  </motion.div>
                  {cartCount > 0 && (
                    <motion.span 
                      className="cart-count"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </Link>
              </motion.div>
            )}

            {user ? (
              <div className="profile-menu">
                <motion.button
                  type="button"
                  className="profile-trigger"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="avatar-chip">{user.username?.[0]?.toUpperCase() || 'U'}</span>
                  <span className="hide-mobile">{user.username}</span>
                  <ChevronDown size={14} className="hide-mobile" />
                </motion.button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      className="profile-dropdown"
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      {user.role === 'admin' ? (
                        <Link to="/admin" className="profile-dropdown-item" onClick={() => setDropdownOpen(false)}>
                          <LayoutDashboard size={16} />
                          <span>Admin Panel</span>
                        </Link>
                      ) : (
                        <Link to="/profile" className="profile-dropdown-item" onClick={() => setDropdownOpen(false)}>
                          <User size={16} />
                          <span>My Profile</span>
                        </Link>
                      )}
                      <button type="button" className="profile-dropdown-item logout" onClick={handleLogoutClick}>
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="login-btn hide-mobile">
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <motion.button
              className="icon-btn show-mobile"
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile menu"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Menu size={20} />
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              className="mobile-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="mobile-drawer-header">
                <div className="logo">
                  <span className="logo-mark">
                    <ShoppingBag size={23} />
                  </span>
                  <span>ShopEZ</span>
                </div>
                <motion.button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </div>

              <div className="mobile-drawer-content">
                <div className="mobile-search">
                  <div className="search-input-wrap">
                    <Search size={18} className="search-leading" />
                    <input
                      type="search"
                      className="search-input"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onSubmit={handleSearchSubmit}
                    />
                  </div>
                </div>

                <div className="mobile-categories">
                  <h3>Categories</h3>
                  {categories.map(({ name, icon: Icon }) => (
                    <motion.button
                      key={name}
                      type="button"
                      className="mobile-category-item"
                      onClick={() => goToCategory(name)}
                      whileHover={{ x: 8 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon size={20} />
                      <span>{name}</span>
                    </motion.button>
                  ))}
                </div>

                <div className="mobile-actions">
                  {(!user || user.role !== 'admin') && (
                    <motion.button
                      type="button"
                      className="mobile-action-item"
                      onClick={showWishlist}
                      whileHover={{ x: 8 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Heart size={20} />
                      <span>Wishlist</span>
                    </motion.button>
                  )}
                  
                  {(!user || user.role !== 'admin') && (
                    <Link 
                      to="/cart" 
                      className="mobile-action-item"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <ShoppingCart size={20} />
                      <span>Cart {cartCount > 0 && `(${cartCount})`}</span>
                    </Link>
                  )}

                  {user ? (
                    <>
                      <Link 
                        to={user.role === 'admin' ? '/admin' : '/profile'} 
                        className="mobile-action-item"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {user.role === 'admin' ? <LayoutDashboard size={20} /> : <User size={20} />}
                        <span>{user.role === 'admin' ? 'Admin Panel' : 'My Profile'}</span>
                      </Link>
                      <motion.button
                        type="button"
                        className="mobile-action-item logout"
                        onClick={handleLogoutClick}
                        whileHover={{ x: 8 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <LogOut size={20} />
                        <span>Logout</span>
                      </motion.button>
                    </>
                  ) : (
                    <Link 
                      to="/login" 
                      className="mobile-action-item"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User size={20} />
                      <span>Login</span>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
