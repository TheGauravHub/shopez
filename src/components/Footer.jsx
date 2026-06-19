import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Send, ShieldCheck, ShoppingBag, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="shopez-footer">
      <div className="container footer-content">
        <div className="footer-column">
          <div className="footer-logo">
            <span className="logo-mark">
              <ShoppingBag size={22} />
            </span>
            <span>ShopEZ</span>
          </div>
          <p className="footer-text">
            A premium MERN commerce experience with curated products, fast checkout, secure accounts, and a dashboard built for serious portfolio reviews.
          </p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
            {[Instagram, Twitter, Facebook, Linkedin].map((Icon, index) => (
              <button key={index} className="icon-btn" type="button" aria-label="Social link">
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>

        <div className="footer-column">
          <h4>Categories</h4>
          <ul className="footer-links">
            <li><Link to="/products?category=Electronics">Electronics</Link></li>
            <li><Link to="/products?category=Fashion">Fashion</Link></li>
            <li><Link to="/products?category=Mobiles">Mobiles</Link></li>
            <li><Link to="/products?category=Groceries">Groceries</Link></li>
            <li><Link to="/products?category=Sports Equipment">Sports Equipment</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Account</h4>
          <ul className="footer-links">
            <li><Link to="/profile">My Account</Link></li>
            <li><Link to="/cart">Shopping Cart</Link></li>
            <li><Link to="/login">Login / Register</Link></li>
            <li><Link to="/admin/login">Admin Center</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Stay Updated</h4>
          <p className="footer-text" style={{ marginTop: 0 }}>
            Get launch drops, flash deals, and delivery updates.
          </p>
          <form className="newsletter-form" style={{ display: 'grid' }}>
            <input type="email" placeholder="Email address" aria-label="Newsletter email" />
            <button className="btn-primary" type="button">
              <Send size={16} /> Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} ShopEZ Inc. All rights reserved.</p>
        <p style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} /> Secure checkout, encrypted sessions, portfolio-ready UX.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
