import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid3X3, List, PackageSearch, SlidersHorizontal, X, Filter } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import SidebarFilters from '../components/SidebarFilters';

const Products = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('Popularity');
  const [gender, setGender] = useState('All');
  const [priceLimit, setPriceLimit] = useState(2000);
  const [rating, setRating] = useState(0);
  const [availability, setAvailability] = useState('All');
  const [brand, setBrand] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const perPage = 8;

  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category') || '';
  const search = queryParams.get('search') || '';

  useEffect(() => {
    setGender('All');
    setBrand('All');
    setPage(1);
  }, [category, search]);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/api/products', {
          params: {
            category,
            search,
            gender: gender !== 'All' ? gender : undefined,
            sort: sort === 'Popularity' ? 'Popular' : sort
          }
        });
        setProducts(response.data);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [category, search, gender, sort]);

  const brands = useMemo(() => {
    const names = products.map((product) => product.brand || product.category).filter(Boolean);
    return [...new Set(names)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => product.price <= priceLimit)
      .filter((product) => (rating ? (product.rating || 0) >= rating : true))
      .filter((product) => {
        if (availability === 'In Stock') return product.stock > 0;
        if (availability === 'Out of Stock') return product.stock <= 0;
        return true;
      })
      .filter((product) => (brand === 'All' ? true : (product.brand || product.category) === brand))
      .sort((a, b) => {
        if (sort === 'Price Low to High') return a.price - b.price;
        if (sort === 'Price High to Low') return b.price - a.price;
        if (sort === 'Newest') return String(b._id).localeCompare(String(a._id));
        return (b.rating || 0) - (a.rating || 0);
      });
  }, [products, priceLimit, rating, availability, brand, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / perPage));
  const visibleProducts = filteredProducts.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    setPage(1);
  }, [priceLimit, rating, availability, brand, sort]);

  const title = category ? `${category} Products` : search ? `Search Results for "${search}"` : 'All Products';

  return (
    <div className="container" style={{ minHeight: '80vh' }}>
      <div className="products-layout">
        <SidebarFilters
          selectedSort={sort}
          onSortChange={setSort}
          selectedGender={gender}
          onGenderChange={setGender}
          priceLimit={priceLimit}
          onPriceLimitChange={setPriceLimit}
          selectedRating={rating}
          onRatingChange={setRating}
          selectedAvailability={availability}
          onAvailabilityChange={setAvailability}
          selectedBrand={brand}
          onBrandChange={setBrand}
          brands={brands}
        />

        <main className="main-products-area">
          <motion.div 
            className="listing-toolbar"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div>
              <span className="eyebrow">Marketplace</span>
              <h1 className="section-title" style={{ fontSize: 'clamp(28px, 3vw, 44px)' }}>{title}</h1>
              <p className="section-subtitle">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} found with premium filtering and responsive cards.
              </p>
            </div>

            <div className="listing-controls">
              <motion.button
                className="btn-secondary show-mobile"
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SlidersHorizontal size={16} />
                Filters
              </motion.button>
              <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
                <option>Popularity</option>
                <option>Price Low to High</option>
                <option>Price High to Low</option>
                <option>Newest</option>
              </select>
              <div className="segment-control" aria-label="Product view mode">
                <motion.button 
                  type="button" 
                  className={viewMode === 'grid' ? 'active' : ''} 
                  onClick={() => setViewMode('grid')} 
                  aria-label="Grid view"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Grid3X3 size={17} />
                </motion.button>
                <motion.button 
                  type="button" 
                  className={viewMode === 'list' ? 'active' : ''} 
                  onClick={() => setViewMode('list')} 
                  aria-label="List view"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <List size={17} />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {loading ? (
            <div className="grid-products">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="skeleton" style={{ height: 380 }} />
              ))}
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : filteredProducts.length === 0 ? (
            <motion.div 
              className="empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div 
                className="success-icon-box" 
                style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}
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
                <Filter size={38} />
              </motion.div>
              <h3>No products found</h3>
              <p>Try adjusting filters, price range, or category selections.</p>
              <motion.button
                className="btn-primary"
                type="button"
                onClick={() => {
                  setSort('Popularity');
                  setGender('All');
                  setPriceLimit(2000);
                  setRating(0);
                  setAvailability('All');
                  setBrand('All');
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear Filters
              </motion.button>
            </motion.div>
          ) : (
            <>
              <motion.div
                className={viewMode === 'grid' ? 'grid-products' : 'products-list-view'}
                layout
              >
                {visibleProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>

              <motion.div 
                className="pagination-row" 
                aria-label="Pagination"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                {Array.from({ length: totalPages }).map((_, index) => (
                  <motion.button
                    key={index}
                    type="button"
                    className={page === index + 1 ? 'active' : ''}
                    onClick={() => setPage(index + 1)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {index + 1}
                  </motion.button>
                ))}
              </motion.div>
            </>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              className="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
            />
            <motion.aside
              className="mobile-filter-sidebar"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="mobile-filter-header">
                <h3>Filters</h3>
                <motion.button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </div>
              <SidebarFilters
                selectedSort={sort}
                onSortChange={setSort}
                selectedGender={gender}
                onGenderChange={setGender}
                priceLimit={priceLimit}
                onPriceLimitChange={setPriceLimit}
                selectedRating={rating}
                onRatingChange={setRating}
                selectedAvailability={availability}
                onAvailabilityChange={setAvailability}
                selectedBrand={brand}
                onBrandChange={setBrand}
                brands={brands}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;
