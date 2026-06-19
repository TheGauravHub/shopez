import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  BadgeCheck,
  Heart,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  Plus,
  Minus,
  ZoomIn,
  Sparkles
} from 'lucide-react';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [shoppingNow, setShoppingNow] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/products/${id}`);
        setProduct(response.data);
        const relatedResponse = await api.get('/api/products', {
          params: { category: response.data.category }
        });
        setRelated(relatedResponse.data.filter((item) => item._id !== id).slice(0, 4));
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Product not found or failed to load details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const gallery = useMemo(() => {
    if (!product?.image) return [];
    return [product.image, product.image, product.image, product.image];
  }, [product]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '32px 0 72px' }}>
        <div className="details-container">
          <div className="skeleton" style={{ height: 520 }} />
          <div className="skeleton" style={{ height: 520 }} />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '40px 0' }}>
        <div className="alert alert-danger">{error || 'Product details are unavailable.'}</div>
        <button className="btn-secondary" type="button" onClick={() => navigate(-1)} style={{ marginTop: '16px' }}>
          <ArrowLeft size={16} /> Back
        </button>
      </div>
    );
  }

  const { title, description, price, discount, image, category, gender, stock, rating } = product;
  const discountedPrice = Math.round(price * (1 - (discount || 0) / 100) * 100) / 100;
  const isOutOfStock = stock <= 0;

  const handleAddToCart = async () => {
    setAdding(true);
    const res = await addToCart(product._id, quantity);
    if (res.success) {
      showToast(`${quantity} ${quantity === 1 ? 'item' : 'items'} added to cart successfully.`, 'success');
    } else {
      showToast(res.message, 'error');
      if (res.message.includes('log in')) navigate('/login');
    }
    setAdding(false);
  };

  const handleShopNow = async () => {
    setShoppingNow(true);
    const res = await addToCart(product._id, quantity);
    if (res.success) {
      navigate('/cart');
    } else {
      showToast(res.message, 'error');
      if (res.message.includes('log in')) navigate('/login');
    }
    setShoppingNow(false);
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = Math.max(1, Math.min(stock, quantity + delta));
    setQuantity(newQuantity);
  };

  return (
    <div className="container">
      <motion.button 
        className="btn-secondary" 
        type="button" 
        onClick={() => navigate(-1)} 
        style={{ marginTop: '24px' }}
        whileHover={{ x: -4 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft size={16} /> Back to Products
      </motion.button>

      <div className="details-container">
        <div className="details-gallery">
          <motion.div 
            className="details-image-box" 
            layout
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
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
            <motion.img 
              src={gallery[activeImage] || image} 
              alt={title} 
              className="details-image"
              whileHover={{ scale: isZoomed ? 1.5 : 1.1 }}
              onClick={() => setIsZoomed(!isZoomed)}
              style={{ cursor: isZoomed ? 'zoom-out' : 'zoom-in' }}
            />
            <motion.button
              className="zoom-toggle"
              type="button"
              onClick={() => setIsZoomed(!isZoomed)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ZoomIn size={18} />
            </motion.button>
          </motion.div>
          <div className="thumbnail-row">
            {gallery.map((thumb, index) => (
              <motion.button
                className={`thumbnail-card ${activeImage === index ? 'active' : ''}`}
                key={index}
                type="button"
                onClick={() => setActiveImage(index)}
                aria-label={`View product image ${index + 1}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <img src={thumb} alt={`${title} thumbnail ${index + 1}`} />
              </motion.button>
            ))}
          </div>
        </div>

        <div className="details-info">
          <span className="details-category-gender">{category} / {gender || 'Unisex'}</span>
          <h1 className="details-title">{title}</h1>

          <div className="details-rating">
            <Star size={16} fill="currentColor" />
            <span>{rating ? rating.toFixed(1) : '4.0'} rating</span>
            <span style={{ color: 'var(--text-muted)' }}>| 2.4k reviews</span>
          </div>

          <p className="details-desc">{description}</p>

          <div className="details-price-box">
            <span className="discount-price" style={{ fontSize: '38px' }}>
              ${discountedPrice.toFixed(2)}
            </span>
            {discount > 0 && (
              <>
                <span className="original-price" style={{ fontSize: '18px' }}>${price.toFixed(2)}</span>
                <span className="status-badge pending">{discount}% saved</span>
              </>
            )}
          </div>

          <div className="details-stock">
            Availability:{' '}
            {isOutOfStock ? (
              <span className="stock-out">Out of Stock</span>
            ) : (
              <span className="stock-in">In Stock ({stock} units available)</span>
            )}
          </div>

          {!isOutOfStock && (
            <motion.div 
              className="quantity-selector"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="quantity-label">Quantity</span>
              <div className="quantity-controls">
                <motion.button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Minus size={16} />
                </motion.button>
                <span className="quantity-value">{quantity}</span>
                <motion.button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= stock}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus size={16} />
                </motion.button>
              </div>
            </motion.div>
          )}

          <div className="spec-grid">
            <div className="spec-item"><span>Brand</span><strong>{product.brand || 'ShopEZ Select'}</strong></div>
            <div className="spec-item"><span>Category</span><strong>{category}</strong></div>
            <div className="spec-item"><span>Delivery</span><strong>2-4 business days</strong></div>
            <div className="spec-item"><span>Returns</span><strong>7 day easy return</strong></div>
          </div>

          <div className="benefit-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '22px' }}>
            {[
              [Truck, 'Free delivery'],
              [ShieldCheck, 'Secure payment'],
              [BadgeCheck, 'Quality assured']
            ].map(([Icon, label]) => (
              <div className="spec-item" key={label}>
                <Icon size={20} color="var(--primary)" />
                <strong>{label}</strong>
              </div>
            ))}
          </div>

          {user?.role !== 'admin' && (
            <motion.div 
              className="details-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button 
                className="btn-add-cart" 
                type="button" 
                onClick={handleAddToCart} 
                disabled={isOutOfStock || adding || shoppingNow}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  animate={adding ? { rotate: 360 } : {}}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <ShoppingCart size={18} />
                </motion.div>
                {adding ? 'Adding...' : 'Add To Cart'}
              </motion.button>
              <motion.button 
                className="btn-shop-now" 
                type="button" 
                onClick={handleShopNow} 
                disabled={isOutOfStock || adding || shoppingNow}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {shoppingNow ? 'Checking Out...' : 'Buy Now'}
              </motion.button>
              <motion.button 
                className="icon-btn" 
                type="button" 
                onClick={() => showToast('Saved to wishlist UI.', 'info')} 
                aria-label="Wishlist"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart size={19} />
              </motion.button>
              <motion.button 
                className="icon-btn" 
                type="button" 
                onClick={() => showToast('Share link copied UI.', 'success')} 
                aria-label="Share"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Share2 size={19} />
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>

      <section className="home-section" style={{ marginTop: 0, marginBottom: '72px' }}>
        <div className="section-heading">
          <div>
            <div className="section-kicker">Frequently Bought Together</div>
            <h2 className="section-title">Complete the set</h2>
          </div>
        </div>
        <div className="grid-products">
          {related.map((item) => <ProductCard key={item._id} product={item} />)}
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
