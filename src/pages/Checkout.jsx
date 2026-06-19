import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, CreditCard, Home, PackageCheck, ShieldCheck, Truck, Wallet, ChevronRight, Sparkles } from 'lucide-react';
import api from '../services/api';
import { CartContext } from '../context/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartSubtotal, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Address Fields State
  const [address, setAddress] = useState({
    fullName: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState('Cash On Delivery');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post('/api/orders', {
        address,
        paymentMethod
      });

      // Clear the local cart context
      clearCart();

      // Navigate to order success page and pass order details in state
      navigate('/order-success', { 
        state: { 
          orders: response.data.orders,
          address,
          paymentMethod
        } 
      });
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <div className="alert alert-warning">Your cart is empty. Please add items to proceed.</div>
        <button className="btn-primary" onClick={() => navigate('/products')} style={{ marginTop: '16px' }}>
          Shop Products
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      className="container" 
      style={{ paddingBottom: '60px' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div 
        style={{ marginTop: '28px' }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <span className="eyebrow">Secure Checkout</span>
        <h1 className="section-title">Complete your order</h1>
        <p className="section-subtitle">A production-style checkout with address, payment, and review steps.</p>
      </motion.div>

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

      <form onSubmit={handleSubmit} className="checkout-layout">
        {/* Left: Forms */}
        <motion.div 
          className="checkout-box"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="checkout-progress">
            <motion.div 
              className="checkout-step active"
              whileHover={{ scale: 1.05 }}
            >
              <Home size={18} /> Address
            </motion.div>
            <ChevronRight size={16} style={{ color: 'var(--border)' }} />
            <motion.div 
              className="checkout-step active"
              whileHover={{ scale: 1.05 }}
            >
              <CreditCard size={18} /> Payment
            </motion.div>
            <ChevronRight size={16} style={{ color: 'var(--border)' }} />
            <motion.div 
              className="checkout-step active"
              whileHover={{ scale: 1.05 }}
            >
              <PackageCheck size={18} /> Review
            </motion.div>
          </div>
          
          {/* Shipping Address Section */}
          <div className="checkout-section" style={{ marginBottom: '36px' }}>
            <h2 className="checkout-section-title">Shipping Address</h2>
            
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="form-input"
                placeholder="Enter your full name"
                value={address.fullName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="mobile">Mobile Number</label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  className="form-input"
                  placeholder="10-digit mobile number"
                  value={address.mobile}
                  onChange={handleInputChange}
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit mobile number"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="pincode">Pincode</label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  className="form-input"
                  placeholder="6-digit pincode"
                  value={address.pincode}
                  onChange={handleInputChange}
                  pattern="[0-9]{6}"
                  title="Please enter a valid 6-digit pincode"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Address (Area and Street)</label>
              <textarea
                id="address"
                name="address"
                className="form-input"
                placeholder="Enter your street address, apartment details, etc."
                value={address.address}
                onChange={handleInputChange}
                rows="3"
                style={{ resize: 'vertical' }}
                required
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City/District/Town</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="form-input"
                  placeholder="Enter city"
                  value={address.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  className="form-input"
                  placeholder="Enter state"
                  value={address.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Methods Section */}
          <div className="checkout-section">
            <h2 className="checkout-section-title">Payment Method</h2>
            
            <div className="payment-options">
              {/* COD */}
              <motion.div 
                className={`payment-card ${paymentMethod === 'Cash On Delivery' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('Cash On Delivery')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Cash On Delivery'}
                  onChange={() => setPaymentMethod('Cash On Delivery')}
                />
                <div className="payment-card-info">
                  <span className="payment-card-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Truck size={16} /> Cash On Delivery (COD)
                  </span>
                  <span className="payment-card-desc">Pay cash when your order gets delivered.</span>
                </div>
              </motion.div>

              {/* UPI */}
              <motion.div 
                className={`payment-card ${paymentMethod === 'UPI' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('UPI')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'UPI'}
                  onChange={() => setPaymentMethod('UPI')}
                />
                <div className="payment-card-info">
                  <span className="payment-card-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Wallet size={16} /> UPI (Google Pay, PhonePe, BHIM)
                  </span>
                  <span className="payment-card-desc">Scan QR code or enter your UPI ID.</span>
                </div>
              </motion.div>

              {/* Credit Card */}
              <motion.div 
                className={`payment-card ${paymentMethod === 'Credit Card' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('Credit Card')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Credit Card'}
                  onChange={() => setPaymentMethod('Credit Card')}
                />
                <div className="payment-card-info">
                  <span className="payment-card-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={16} /> Credit / Debit Card
                  </span>
                  <span className="payment-card-desc">Pay using Visa, MasterCard, RuPay, or AMEX.</span>
                </div>
              </motion.div>
            </div>
          </div>

        </motion.div>

        {/* Right: Order Summary */}
        <motion.div 
          className="cart-summary"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '20px' }}>Items Review</h3>
          
          <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '20px', borderBottom: '1px solid var(--gray-border)', paddingBottom: '16px' }}>
            {cartItems.map((item) => {
              const product = item.productId;
              if (!product) return null;
              const finalPrice = product.price * (1 - (product.discount || 0) / 100);
              
              return (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '10px' }}>
                  <span style={{ fontWeight: '500', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {product.title} <span style={{ color: 'var(--gray-text)' }}>x{item.quantity}</span>
                  </span>
                  <span style={{ fontWeight: '700' }}>
                    ${(finalPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${cartSubtotal.toFixed(2)}</span>
          </div>
          
          <div className="summary-row">
            <span>Shipping</span>
            <span style={{ color: 'var(--success)', fontWeight: '600' }}>FREE</span>
          </div>

          <div className="summary-row total">
            <span>Order Total</span>
            <span>${cartSubtotal.toFixed(2)}</span>
          </div>

          <motion.button 
            type="submit"
            className="btn-checkout"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Processing Order...' : (
              <>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <CheckCircle2 size={18} />
                </motion.div>
                Place Order
              </>
            )}
          </motion.button>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--gray-text)', fontSize: '12px', marginTop: '16px', fontWeight: '500' }}>
            <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
            <span>Secure 256-bit SSL checkout encryption</span>
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default Checkout;
