import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Heart, ShoppingCart, Star, Sparkles } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const [adding, setAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { _id, title, price, discount, image, category, rating, stock } = product;

  // Calculate final discounted price
  const discountedPrice = Math.round(price * (1 - (discount || 0) / 100) * 100) / 100;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setAdding(true);
    const res = await addToCart(_id, 1);
    if (!res.success) {
      showToast(res.message, 'error');
      if (res.message.includes('log in')) {
        navigate('/login');
      }
    } else {
      showToast(`${title} added to cart`, 'success');
    }
    setAdding(false);
  };

  const handleCardClick = () => {
    navigate(`/products/${_id}`);
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    showToast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'success');
  };

  const isOutOfStock = stock <= 0;
  const stars = Math.round(rating || 4);

  return (
    <motion.article
      className="product-card"
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, type: "spring" }}
      layout
    >
      <div className="product-card-img-box">
        {discount > 0 && (
          <motion.span 
            className="discount-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            <Sparkles size={10} />
            {discount}% OFF
          </motion.span>
        )}
        <span className={`stock-badge ${isOutOfStock ? 'out' : ''}`}>
          {isOutOfStock ? 'Sold out' : 'In stock'}
        </span>
        
        <motion.div 
          className="product-card-img-wrapper"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
        >
          <img src={image} alt={title} className="product-card-img" loading="lazy" />
        </motion.div>
        
        <span className="rating-badge">
          <Star size={12} className="rating-star" fill="currentColor" />
          <span>{rating ? rating.toFixed(1) : '4.0'}</span>
        </span>
        
        <AnimatePresence>
          <motion.div 
            className="card-actions"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              type="button"
              className="quick-action"
              aria-label={`Quick view ${title}`}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/products/${_id}`);
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Eye size={17} />
            </motion.button>
            <motion.button
              type="button"
              className={`quick-action ${isWishlisted ? 'wishlisted' : ''}`}
              aria-label={`Add ${title} to wishlist`}
              onClick={handleWishlistToggle}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart size={17} fill={isWishlisted ? 'currentColor' : 'none'} />
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="product-card-info">
        <span className="product-card-category">{category}</span>
        <h3 className="product-card-title">{title}</h3>
        <div className="rating-row" aria-label={`${stars} star rating`}>
          <div className="stars-container">
            {Array.from({ length: 5 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Star 
                  size={14} 
                  fill={index < stars ? 'currentColor' : 'none'}
                  className={index < stars ? 'star-filled' : 'star-empty'}
                />
              </motion.div>
            ))}
          </div>
          <span style={{ color: 'var(--text-muted)', marginLeft: '8px', fontSize: '13px', fontWeight: 700 }}>
            {rating ? rating.toFixed(1) : '4.0'}
          </span>
        </div>

        <div className="product-card-price-box">
          <span className="discount-price">${discountedPrice.toFixed(2)}</span>
          {discount > 0 && (
            <span className="original-price">${price.toFixed(2)}</span>
          )}
        </div>

        {user?.role !== 'admin' && (
          <motion.button
            className="product-card-btn"
            onClick={handleAddToCart}
            disabled={isOutOfStock || adding}
            aria-label={`Add ${title} to cart`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              animate={adding ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <ShoppingCart size={15} />
            </motion.div>
            <span>
              {isOutOfStock 
                ? 'Out of Stock' 
                : adding 
                  ? 'Adding...' 
                  : 'Add To Cart'}
            </span>
          </motion.button>
        )}
      </div>
    </motion.article>
  );
};

export default ProductCard;
