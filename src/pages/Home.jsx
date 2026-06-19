import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Headphones,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Clock,
  Flame,
  Mail,
  CheckCircle
} from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const banners = [
  {
    title: 'Premium shopping, delivered fast.',
    desc: 'Discover curated fashion, electronics, mobiles, groceries, and sports gear with a checkout flow built for speed.',
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1600&auto=format&fit=crop&q=85',
    category: 'Fashion'
  },
  {
    title: 'Next-gen tech for your everyday.',
    desc: 'Upgrade your setup with smart devices, audio gear, accessories, and limited-time launch offers.',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1600&auto=format&fit=crop&q=85',
    category: 'Electronics'
  },
  {
    title: 'Fitness, essentials, and fresh finds.',
    desc: 'Shop top-rated daily essentials and performance gear with free delivery on eligible orders.',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&auto=format&fit=crop&q=85',
    category: 'Sports Equipment'
  }
];

const categories = [
  ['Fashion', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80'],
  ['Electronics', 'https://images.unsplash.com/photo-1498049531479-7f71afae5d21?w=600&auto=format&fit=crop&q=80'],
  ['Mobiles', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80'],
  ['Groceries', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'],
  ['Sports Equipment', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=80']
];

const brands = ['Nike', 'Apple', 'Sony', 'Samsung', 'Adidas', 'Puma'];
const reviews = [
  ['Aarav S.', 'The UI feels like a real product. Checkout was smooth and the dashboard looks interview-ready.'],
  ['Meera K.', 'Loved the filters and product cards. The site looks clean on mobile and desktop.'],
  ['Rohan P.', 'Fast browsing, polished visuals, and the admin panel gives a premium SaaS vibe.']
];

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft((current) => {
        const total = current.hours * 3600 + current.minutes * 60 + current.seconds - 1;
        const next = total > 0 ? total : 12 * 3600;
        return {
          hours: Math.floor(next / 3600),
          minutes: Math.floor((next % 3600) / 60),
          seconds: next % 60
        };
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await api.get('/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to load home products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const featured = useMemo(() => products.slice(0, 4), [products]);
  const trending = useMemo(() => [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4), [products]);
  const flashSale = useMemo(() => products.filter((product) => product.discount > 0).slice(0, 4), [products]);
  const newArrivals = useMemo(() => products.slice(-4).reverse(), [products]);

  const goToCategory = (category) => navigate(`/products?category=${encodeURIComponent(category)}`);
  const nextSlide = () => setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

  const ProductSection = ({ kicker, title, subtitle, items }) => (
    <section className="home-section">
      <div className="section-heading">
        <div>
          <motion.div 
            className="section-kicker"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {kicker}
          </motion.div>
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">{subtitle}</p>
        </div>
        <motion.button 
          className="btn-secondary" 
          type="button" 
          onClick={() => navigate('/products')}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.95 }}
        >
          View all <ArrowRight size={16} />
        </motion.button>
      </div>
      {loading ? (
        <div className="grid-products">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="skeleton" key={index} style={{ height: 380 }} />
          ))}
        </div>
      ) : (
        <div className="grid-products">
          {(items.length ? items : products.slice(0, 4)).map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div className="home-container">
      <div className="wide-container">
        <section className="hero-carousel" aria-label="Featured campaigns">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              className="carousel-slide"
              style={{ backgroundImage: `url(${banners[currentSlide].image})` }}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.55 }}
            >
              <div className="carousel-overlay" />
              <div className="carousel-content">
                <motion.span 
                  className="hero-pill"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <Sparkles size={16} /> New season edit
                </motion.span>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {banners[currentSlide].title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {banners[currentSlide].desc}
                </motion.p>
                <motion.button 
                  className="carousel-btn" 
                  type="button" 
                  onClick={() => goToCategory(banners[currentSlide].category)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Shop collection <ArrowRight size={17} />
                </motion.button>
                <motion.div 
                  className="hero-meta"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.span 
                    className="hero-pill"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Truck size={15} /> Fast delivery
                  </motion.span>
                  <motion.span 
                    className="hero-pill"
                    whileHover={{ scale: 1.05 }}
                  >
                    <ShieldCheck size={15} /> Secure checkout
                  </motion.span>
                  <motion.span 
                    className="hero-pill"
                    whileHover={{ scale: 1.05 }}
                  >
                    <PackageCheck size={15} /> Easy returns
                  </motion.span>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          <motion.button 
            className="carousel-arrow left" 
            type="button" 
            onClick={prevSlide} 
            aria-label="Previous banner"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={24} />
          </motion.button>
          <motion.button 
            className="carousel-arrow right" 
            type="button" 
            onClick={nextSlide} 
            aria-label="Next banner"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight size={24} />
          </motion.button>
          <div className="carousel-dots">
            {banners.map((_, index) => (
              <motion.button
                key={index}
                className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                type="button"
                onClick={() => setCurrentSlide(index)}
                aria-label={`Open banner ${index + 1}`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
              />
            ))}
          </div>
        </section>
      </div>

      <div className="container">
        <div className="stat-strip">
          {[
            ['24h', 'Priority dispatch'],
            ['50K+', 'Products explored'],
            ['4.8/5', 'Customer rating'],
            ['100%', 'Secure payments']
          ].map(([value, label]) => (
            <div className="feature-card" key={label}>
              <span className="eyebrow">{label}</span>
              <strong style={{ fontSize: '28px' }}>{value}</strong>
            </div>
          ))}
        </div>

        <section className="home-section">
          <div className="section-heading">
            <div>
              <div className="section-kicker">Featured Categories</div>
              <h2 className="section-title">Shop by department</h2>
            </div>
          </div>
          <div className="categories-grid">
            {categories.map(([name, image]) => (
              <motion.button
                type="button"
                className="category-card"
                key={name}
                whileHover={{ y: -6 }}
                onClick={() => goToCategory(name)}
              >
                <div className="category-img-container">
                  <img className="category-img" src={image} alt={name} loading="lazy" />
                </div>
                <div className="category-name">
                  <span>{name}</span>
                  <ArrowRight size={16} />
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        <ProductSection
          kicker="Trending Products"
          title="What shoppers love right now"
          subtitle="High-rating products with strong visual cards, quick actions, and modern commerce interactions."
          items={trending}
        />

        <section className="home-section deal-band">
          <span className="hero-pill"><Sparkles size={16} /> Flash sale live</span>
          <h2>Hot discounts before the timer ends.</h2>
          <p>Limited deals are refreshed throughout the day across electronics, fashion, and sports gear.</p>
          <div className="countdown">
            {[
              ['Hours', timeLeft.hours],
              ['Minutes', timeLeft.minutes],
              ['Seconds', timeLeft.seconds]
            ].map(([label, value]) => (
              <div className="countdown-box" key={label}>
                <strong>{String(value).padStart(2, '0')}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <ProductSection
          kicker="Flash Sale"
          title="Deals worth opening twice"
          subtitle="Discounted products get a dedicated premium shelf with countdown urgency."
          items={flashSale}
        />

        <ProductSection
          kicker="Best Sellers"
          title="Reliable picks for every cart"
          subtitle="A curated storefront helps the project feel closer to a real production marketplace."
          items={featured}
        />

        <ProductSection
          kicker="New Arrivals"
          title="Fresh additions to the catalog"
          subtitle="Recently added inventory gets its own spotlight for better discovery."
          items={newArrivals}
        />

        <section className="home-section">
          <div className="section-heading">
            <div>
              <div className="section-kicker">Top Brands</div>
              <h2 className="section-title">Trusted names, curated here</h2>
            </div>
          </div>
          <div className="brand-grid">
            {brands.map((brand) => (
              <div className="brand-card" key={brand}>
                <Headphones size={24} color="var(--accent)" />
                <strong>{brand}</strong>
                <span style={{ color: 'var(--text-muted)' }}>Verified store</span>
              </div>
            ))}
          </div>
        </section>

        <section className="home-section">
          <div className="section-heading">
            <div>
              <div className="section-kicker">Customer Reviews</div>
              <h2 className="section-title">Loved by demo shoppers</h2>
            </div>
          </div>
          <div className="review-grid">
            {reviews.map(([name, text]) => (
              <div className="review-card" key={name}>
                <div className="rating-row">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={16} fill="currentColor" />
                  ))}
                </div>
                <strong>{name}</strong>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="home-section newsletter-band">
          <motion.div 
            className="newsletter-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="newsletter-icon"
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
              <Mail size={48} />
            </motion.div>
            <span className="hero-pill">ShopEZ Insider</span>
            <h2>Get the next launch drop first.</h2>
            <p>Join the newsletter UI for promotions, restocks, and order updates.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" aria-label="Newsletter email" />
              <motion.button 
                className="btn-primary" 
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe <ArrowRight size={16} />
              </motion.button>
            </form>
            <div className="newsletter-benefits">
              <span><CheckCircle size={14} /> Exclusive offers</span>
              <span><CheckCircle size={14} /> Early access</span>
              <span><CheckCircle size={14} /> No spam</span>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Home;
