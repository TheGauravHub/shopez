import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Download, Heart, Home, Lock, Mail, MapPin, ShoppingBag, User, Sparkles, Settings } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await api.get('/api/orders/user');
        setOrders(response.data);
      } catch (err) {
        console.error('Failed to load user orders:', err);
        setError('Could not load your order history.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserOrders();
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div 
      className="container" 
      style={{ minHeight: '80vh' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="profile-layout">
        
        {/* Left: Sidebar profile details */}
        <motion.aside 
          className="profile-sidebar"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.div 
            className="profile-avatar-box"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div 
              className="profile-avatar"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {getInitials(user?.username)}
            </motion.div>
            <h2 className="profile-username">{user?.username || 'User'}</h2>
            <p className="profile-email">{user?.email}</p>
          </motion.div>

          <motion.div 
            className={`profile-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <ShoppingBag size={18} />
            <span>Order History ({orders.length})</span>
          </motion.div>

          <motion.div 
            className={`profile-tab ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <User size={18} />
            <span>Profile Information</span>
          </motion.div>

          {[
            ['addresses', Home, 'Address Management'],
            ['wishlist', Heart, 'Wishlist'],
            ['security', Lock, 'Security Settings']
          ].map(([tab, Icon, label]) => (
            <motion.div
              key={tab}
              className={`profile-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </motion.div>
          ))}
        </motion.aside>

        {/* Right: Main content panel */}
        <motion.main 
          className="profile-main-content"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {activeTab === 'orders' ? (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>Your Orders</h2>
                
                {loading ? (
                  <div className="flex-center" style={{ height: '200px' }}>
                    <div style={{
                      width: '30px',
                      height: '30px',
                      border: '3px solid var(--primary-light)',
                      borderTopColor: 'var(--primary)',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                  </div>
                ) : error ? (
                  <motion.div 
                    className="alert alert-danger"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.div>
                ) : orders.length === 0 ? (
                  <motion.div 
                    style={{ textAlign: 'center', padding: '40px 0', color: 'var(--gray-text)' }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <p>You haven't placed any orders yet.</p>
                  </motion.div>
                ) : (
                  <div className="timeline">
                    {orders.map((order, index) => {
                      const product = order.productId;
                      if (!product) return null;
                      const finalPrice = product.price * (1 - (product.discount || 0) / 100);
                      const subtotal = finalPrice * order.quantity;

                      return (
                        <motion.div 
                          className="timeline-item" 
                          key={order._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <img src={product.image} alt={product.title} className="table-product-img" />
                          <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>{product.title}</h3>
                            <p style={{ color: 'var(--text-muted)', fontWeight: 700 }}>
                              Qty {order.quantity} / ${subtotal.toFixed(2)} / {formatDate(order.orderDate)}
                            </p>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '10px', alignItems: 'center' }}>
                              {['Pending', 'Processing', 'Delivered'].map((status) => (
                                <span key={status} className={`status-badge ${status.toLowerCase()}`} style={{ opacity: status === order.status ? 1 : 0.38 }}>
                                  {status}
                                </span>
                              ))}
                            </div>
                          </div>
                          <motion.button 
                            className="btn-secondary" 
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Download size={16} /> Invoice
                          </motion.button>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            ) : activeTab === 'info' ? (
              <motion.div
                key="info"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Profile Information</h2>
                
                <div style={{ display: 'grid', gap: '20px', maxWidth: '500px' }}>
                  <motion.div 
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', backgroundColor: 'var(--gray-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-border)' }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <User size={20} style={{ color: 'var(--primary)' }} />
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--gray-text)', fontWeight: '600' }}>USERNAME</div>
                      <div style={{ fontWeight: '700' }}>{user?.username}</div>
                    </div>
                  </motion.div>

                  <motion.div 
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', backgroundColor: 'var(--gray-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-border)' }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Mail size={20} style={{ color: 'var(--primary)' }} />
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--gray-text)', fontWeight: '600' }}>EMAIL ADDRESS</div>
                      <div style={{ fontWeight: '700' }}>{user?.email}</div>
                    </div>
                  </motion.div>

                  <motion.div 
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', backgroundColor: 'var(--gray-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-border)' }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Calendar size={20} style={{ color: 'var(--primary)' }} />
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--gray-text)', fontWeight: '600' }}>ROLE</div>
                      <div style={{ fontWeight: '700', textTransform: 'capitalize' }}>{user?.role}</div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ) : activeTab === 'addresses' ? (
              <motion.div
                key="addresses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px' }}>Address Management</h2>
                <div className="spec-grid">
                  <motion.div className="spec-item" whileHover={{ scale: 1.05 }}>
                    <MapPin size={20} color="var(--primary)" />
                    <strong>Home Address</strong>
                    <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>Add saved addresses after connecting the address endpoint.</p>
                  </motion.div>
                  <motion.div className="spec-item" whileHover={{ scale: 1.05 }}>
                    <MapPin size={20} color="var(--accent)" />
                    <strong>Work Address</strong>
                    <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>Fast checkout-ready address cards.</p>
                  </motion.div>
                </div>
              </motion.div>
            ) : activeTab === 'wishlist' ? (
              <motion.div
                key="wishlist"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px' }}>Wishlist</h2>
                <motion.div 
                  className="empty-state" 
                  style={{ margin: 0 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Heart size={42} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
                  </motion.div>
                  <h3>Wishlist UI ready</h3>
                  <p>Hook this tab to a wishlist model when you add the backend endpoint.</p>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px' }}>Security Settings</h2>
                <div className="spec-grid">
                  <motion.div className="spec-item" whileHover={{ scale: 1.05 }}><Lock size={20} color="var(--success)" /><strong>Password protected</strong><p style={{ color: 'var(--text-muted)' }}>JWT session stored locally.</p></motion.div>
                  <motion.div className="spec-item" whileHover={{ scale: 1.05 }}><Mail size={20} color="var(--primary)" /><strong>Email login</strong><p style={{ color: 'var(--text-muted)' }}>Account recovery UI can be added here.</p></motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>
      </div>
    </motion.div>
  );
};

export default Profile;
