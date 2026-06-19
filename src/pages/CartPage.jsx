import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BadgePercent, MapPin, ShieldCheck, ShoppingBag, Trash2, Truck, Sparkles, Package } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { ToastContext } from '../context/ToastContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, addToCart, removeFromCart, cartSubtotal, loading } = useContext(CartContext);
  const { showToast } = useContext(ToastContext);

  const handleQtyChange = async (productId, currentQty, amount, maxStock) => {
    const newQty = currentQty + amount;
    if (newQty < 1) return;
    if (newQty > maxStock) {
      showToast(`Cannot add more. Only ${maxStock} items available in stock.`, 'warning');
      return;
    }
    await addToCart(productId, newQty, true); // true = override quantity
  };

  const handleRemoveItem = async (productId) => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      await removeFromCart(productId);
      showToast('Item removed from cart.', 'success');
    }
  };

  if (loading && cartItems.length === 0) {
    return (
      <div className="container flex-center" style={{ height: '60vh' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid var(--primary-light)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <motion.div 
        className="container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div 
          className="empty-state"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div 
            className="success-icon-box" 
            style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}
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
            <Package size={36} />
          </motion.div>
          <h3>Your cart is empty</h3>
          <p>Explore our products and find something you love!</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/products" className="btn-primary" style={{ display: 'inline-block', padding: '12px 30px' }}>
              Browse Products
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
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
        <span className="eyebrow">Shopping Cart</span>
        <h1 className="section-title">Review your bag</h1>
        <p className="section-subtitle">Quantity controls, delivery estimate, coupons, and a sticky checkout summary.</p>
      </motion.div>
      
      <div className="cart-layout">
        {/* Cart Items List */}
        <div className="cart-items-box">
          <AnimatePresence>
            {cartItems.map((item, index) => {
              const product = item.productId;
              if (!product) return null;

              const finalPrice = Math.round(product.price * (1 - (product.discount || 0) / 100) * 100) / 100;
              const itemSubtotal = finalPrice * item.quantity;

              return (
                <motion.div 
                  key={item._id} 
                  className="cart-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <img src={product.image} alt={product.title} className="cart-item-img" />
                  
                  <div className="cart-item-info">
                    <h3 className="cart-item-title">
                      <Link to={`/products/${product._id}`}>{product.title}</Link>
                    </h3>
                    <div className="cart-item-category">{product.category}</div>
                    
                    {/* Quantity Controls */}
                    <div className="cart-item-qty-actions">
                      <motion.button 
                        className="qty-btn"
                        onClick={() => handleQtyChange(product._id, item.quantity, -1, product.stock)}
                        disabled={item.quantity <= 1}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        -
                      </motion.button>
                      <span className="qty-val">{item.quantity}</span>
                      <motion.button 
                        className="qty-btn"
                        onClick={() => handleQtyChange(product._id, item.quantity, 1, product.stock)}
                        disabled={item.quantity >= product.stock}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        +
                      </motion.button>
                      <span style={{ fontSize: '12px', color: 'var(--gray-text)', marginLeft: '10px' }}>
                        (Stock: {product.stock})
                      </span>
                    </div>
                  </div>

                  <div className="cart-item-pricing">
                    <div className="cart-item-subtotal">${itemSubtotal.toFixed(2)}</div>
                    <div style={{ fontSize: '13px', color: 'var(--gray-text)', marginBottom: '8px' }}>
                      (${finalPrice.toFixed(2)} each)
                    </div>
                    <motion.div 
                      className="cart-item-delete"
                      onClick={() => handleRemoveItem(product._id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 size={14} />
                      <span>Remove</span>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Pricing Summary */}
        <motion.div 
          className="cart-summary"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '20px' }}>Order Summary</h3>

          <div className="coupon-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800 }}>
              <BadgePercent size={18} color="var(--primary)" />
              Coupon
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <input className="form-input" placeholder="SHOPEZ20" aria-label="Coupon code" />
              <motion.button 
                className="btn-secondary" 
                type="button" 
                onClick={() => showToast('Coupon UI applied visually.', 'success')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Apply
              </motion.button>
            </div>
          </div>

          <div className="shipping-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800 }}>
              <Truck size={18} color="var(--success)" />
              Estimated delivery
            </div>
            <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>Arrives in 2-4 business days with free shipping.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginTop: '10px', fontWeight: 700 }}>
              <MapPin size={16} /> Shipping calculator available at checkout.
            </div>
          </div>
          
          <div className="summary-row">
            <span>Price ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
            <span>${cartSubtotal.toFixed(2)}</span>
          </div>
          
          <div className="summary-row">
            <span>Delivery Charges</span>
            <span style={{ color: 'var(--success)', fontWeight: '600' }}>FREE</span>
          </div>

          <div className="summary-row total">
            <span>Total Amount</span>
            <span>${cartSubtotal.toFixed(2)}</span>
          </div>

          <motion.button 
            className="btn-checkout"
            onClick={() => navigate('/checkout')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Proceed to Checkout
          </motion.button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 800 }}>
            <ShieldCheck size={16} color="var(--success)" />
            Secure checkout protected
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Link to="/products" style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <ArrowLeft size={14} /> Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CartPage;
