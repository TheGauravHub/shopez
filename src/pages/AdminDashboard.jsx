import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, CheckCircle2, Edit2, Landmark, Plus, Search, ShoppingBag, Trash2, Users, Sparkles, TrendingUp, Package, DollarSign } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  // Tabs: 'dashboard' | 'products' | 'orders'
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Dashboard Metrics State
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0
  });
  
  // Products Management State
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null when adding new
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    category: 'Electronics',
    gender: 'Unisex',
    price: '',
    discount: '',
    stock: '',
    image: ''
  });

  // Orders Management State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // General loading states
  const [metricsLoading, setMetricsLoading] = useState(true);

  // Load Dashboard Metrics
  const fetchMetrics = async () => {
    setMetricsLoading(true);
    try {
      const response = await api.get('/api/admin/dashboard');
      setMetrics(response.data);
    } catch (error) {
      console.error('Failed to load metrics:', error);
    } finally {
      setMetricsLoading(false);
    }
  };

  // Load Products list
  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const response = await api.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  // Load Orders list
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await api.get('/api/orders/all');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchMetrics();
  }, []);

  // Fetch tab-specific data on tab switch
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchMetrics();
    } else if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  // Product actions: Edit / Delete / Create
  const handleOpenProductModal = (prod = null) => {
    if (prod) {
      // Edit mode
      setEditingProduct(prod);
      setProductForm({
        title: prod.title,
        description: prod.description,
        category: prod.category,
        gender: prod.gender || 'Unisex',
        price: prod.price,
        discount: prod.discount,
        stock: prod.stock,
        image: prod.image
      });
    } else {
      // Create mode
      setEditingProduct(null);
      setProductForm({
        title: '',
        description: '',
        category: 'Electronics',
        gender: 'Unisex',
        price: '',
        discount: '0',
        stock: '10',
        image: ''
      });
    }
    setProductModalOpen(true);
  };

  const handleProductFormSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...productForm,
      price: parseFloat(productForm.price),
      discount: parseInt(productForm.discount) || 0,
      stock: parseInt(productForm.stock) || 10
    };

    try {
      if (editingProduct) {
        // Update product
        await api.put(`/api/products/${editingProduct._id}`, payload);
        alert('Product updated successfully.');
      } else {
        // Create product
        await api.post('/api/products', payload);
        alert('Product created successfully.');
      }
      setProductModalOpen(false);
      fetchProducts();
      fetchMetrics();
    } catch (error) {
      console.error('Failed to save product:', error);
      alert(error.response?.data?.message || 'Error saving product.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/api/products/${id}`);
        alert('Product deleted successfully.');
        fetchProducts();
        fetchMetrics();
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Error deleting product.');
      }
    }
  };

  // Order actions: Update status
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await api.put('/api/orders/status', { orderId, status: newStatus });
      alert('Order status updated successfully.');
      fetchOrders();
      fetchMetrics();
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Error updating order status.');
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const revenueData = [
    { month: 'Jan', revenue: metrics.revenue * 0.24 + 800 },
    { month: 'Feb', revenue: metrics.revenue * 0.34 + 1200 },
    { month: 'Mar', revenue: metrics.revenue * 0.48 + 1800 },
    { month: 'Apr', revenue: metrics.revenue * 0.62 + 2400 },
    { month: 'May', revenue: metrics.revenue * 0.78 + 3100 },
    { month: 'Jun', revenue: metrics.revenue + 4200 }
  ];

  const categoryData = Object.values(products.reduce((acc, product) => {
    const key = product.category || 'Other';
    acc[key] = acc[key] || { name: key, value: 0 };
    acc[key].value += 1;
    return acc;
  }, {}));

  const statusData = Object.values(orders.reduce((acc, order) => {
    const key = order.status || 'Pending';
    acc[key] = acc[key] || { name: key, value: 0 };
    acc[key].value += 1;
    return acc;
  }, {}));

  const filteredProducts = products.filter((prod) =>
    `${prod.title} ${prod.category}`.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter((ord) =>
    `${ord.userId?.username || ''} ${ord.productId?.title || ''} ${ord.status}`.toLowerCase().includes(orderSearch.toLowerCase())
  );

  const chartColors = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e'];

  return (
    <motion.div 
      className="container" 
      style={{ minHeight: '80vh', paddingBottom: '60px' }}
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
        <motion.span 
          className="eyebrow"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, delay: 0.1 }}
        >
          <Sparkles size={12} /> Admin Control Center
        </motion.span>
        <h1 className="section-title">ShopEZ analytics dashboard</h1>
        <p className="section-subtitle">Revenue, inventory, customers, order operations, and catalog controls in one premium workspace.</p>
      </motion.div>

      <div className="profile-layout">
        {/* Left Side: Navigation tabs */}
        <motion.aside 
          className="profile-sidebar" 
          style={{ width: '250px' }}
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
              style={{ backgroundColor: 'var(--secondary)' }}
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
              AD
            </motion.div>
            <h2 className="profile-username">ShopEZ Admin</h2>
            <p className="profile-email">{user?.email}</p>
          </motion.div>

          <motion.div 
            className={`profile-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <BarChart3 size={18} />
            <span>Dashboard Metrics</span>
          </motion.div>

          <motion.div 
            className={`profile-tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <ShoppingBag size={18} />
            <span>Manage Products</span>
          </motion.div>

          <motion.div 
            className={`profile-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <CheckCircle2 size={18} />
            <span>All Orders</span>
          </motion.div>
        </motion.aside>

        {/* Right Side: Tab panel contents */}
        <motion.main 
          className="profile-main-content"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {/* TAB 1: METRICS DASHBOARD */}
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '24px' }}>Overview Metrics</h2>
                
                {metricsLoading ? (
                  <div className="flex-center" style={{ height: '200px' }}>
                    <div style={{ width: '30px', height: '30px', border: '3px solid var(--primary-light)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  </div>
                ) : (
                  <div className="admin-metrics-grid">
                    {/* Users Count */}
                    <motion.div 
                      className="metric-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="metric-info">
                        <h4>Total Users</h4>
                        <div className="metric-val">{metrics.totalUsers}</div>
                      </div>
                      <div className="metric-icon-box blue">
                        <Users size={24} />
                      </div>
                    </motion.div>

                    {/* Products Count */}
                    <motion.div 
                      className="metric-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="metric-info">
                        <h4>Products</h4>
                        <div className="metric-val">{metrics.totalProducts}</div>
                      </div>
                      <div className="metric-icon-box cyan">
                        <ShoppingBag size={24} />
                      </div>
                    </motion.div>

                    {/* Orders Count */}
                    <motion.div 
                      className="metric-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="metric-info">
                        <h4>Orders</h4>
                        <div className="metric-val">{metrics.totalOrders}</div>
                      </div>
                      <div className="metric-icon-box yellow">
                        <CheckCircle2 size={24} />
                      </div>
                    </motion.div>

                    {/* Total Revenue */}
                    <motion.div 
                      className="metric-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="metric-info">
                        <h4>Revenue</h4>
                        <div className="metric-val">${metrics.revenue.toFixed(2)}</div>
                      </div>
                      <div className="metric-icon-box green">
                        <Landmark size={24} />
                      </div>
                    </motion.div>
                  </div>
                )}

                <div className="chart-grid">
                  <motion.div 
                    className="chart-card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex-between" style={{ marginBottom: '16px' }}>
                      <h3>Revenue Trends</h3>
                      <motion.span 
                        className="status-badge processing"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Live
                      </motion.span>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="revenue" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.45} />
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="month" stroke="var(--text-muted)" />
                        <YAxis stroke="var(--text-muted)" />
                        <Tooltip />
                        <Area type="monotone" dataKey="revenue" stroke="#4f46e5" fill="url(#revenue)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </motion.div>

                  <motion.div 
                    className="chart-card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex-between" style={{ marginBottom: '16px' }}>
                      <h3>Order Status</h3>
                      <span className="status-badge delivered">Tracking</span>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie data={statusData.length ? statusData : [{ name: 'Pending', value: 1 }]} dataKey="value" nameKey="name" innerRadius={60} outerRadius={92}>
                          {(statusData.length ? statusData : [{ name: 'Pending', value: 1 }]).map((entry, index) => (
                            <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </motion.div>
                </div>
              </motion.div>
            )}

          {/* TAB 2: MANAGE PRODUCTS (CRUD) */}
          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="toolbar-card"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: '800' }}>Catalog Products</h2>
                  <p style={{ color: 'var(--text-muted)' }}>Search, edit, add, preview, and manage inventory.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div className="input-with-icon" style={{ minWidth: '240px' }}>
                    <Search size={17} />
                    <input className="form-input" value={productSearch} onChange={(e) => setProductSearch(e.target.value)} placeholder="Search products" />
                  </div>
                <motion.button 
                  className="btn-primary" 
                  onClick={() => handleOpenProductModal()}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={16} /> Add Product
                </motion.button>
                </div>
              </motion.div>

              {productsLoading ? (
                <div className="flex-center" style={{ height: '200px' }}>
                  <div style={{ width: '30px', height: '30px', border: '3px solid var(--primary-light)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                </div>
              ) : (
                <motion.div 
                  className="shopez-table-wrapper"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <table className="shopez-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((prod, index) => (
                        <motion.tr 
                          key={prod._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <td>
                            <img src={prod.image} alt={prod.title} className="table-product-img" />
                          </td>
                          <td style={{ fontWeight: '600', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {prod.title}
                          </td>
                          <td>{prod.category}</td>
                          <td style={{ fontWeight: '700' }}>${prod.price.toFixed(2)}</td>
                          <td style={{ fontWeight: '600' }}>{prod.stock}</td>
                          <td>
                            <motion.button 
                              className="action-btn"
                              onClick={() => handleOpenProductModal(prod)}
                              title="Edit Product"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Edit2 size={13} />
                            </motion.button>
                            <motion.button 
                              className="action-btn delete"
                              onClick={() => handleDeleteProduct(prod._id)}
                              title="Delete Product"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 size={13} />
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              )}
              <motion.div 
                className="chart-card" 
                style={{ marginTop: '18px' }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h3 style={{ marginBottom: '16px' }}>Inventory Overview</h3>
                <ResponsiveContainer width="100%" height={230}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--text-muted)" />
                    <YAxis stroke="var(--text-muted)" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </motion.div>
          )}

          {/* TAB 3: ALL ORDERS */}
          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="toolbar-card"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: '800' }}>System Orders</h2>
                  <p style={{ color: 'var(--text-muted)' }}>Search orders, update status, and review delivery data.</p>
                </div>
                <div className="input-with-icon" style={{ minWidth: '260px' }}>
                  <Search size={17} />
                  <input className="form-input" value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} placeholder="Search orders" />
                </div>
              </motion.div>

              {ordersLoading ? (
                <div className="flex-center" style={{ height: '200px' }}>
                  <div style={{ width: '30px', height: '30px', border: '3px solid var(--primary-light)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                </div>
              ) : (
                <motion.div 
                  className="shopez-table-wrapper"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <table className="shopez-table">
                    <thead>
                      <tr>
                        <th>User Name</th>
                        <th>Product Name</th>
                        <th>Qty</th>
                        <th>Shipping Address</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((ord, index) => {
                        const userObj = ord.userId;
                        const prodObj = ord.productId;
                        
                        return (
                          <motion.tr 
                            key={ord._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <td style={{ fontWeight: '600' }}>
                              {userObj ? userObj.username : 'Deleted User'}
                            </td>
                            <td style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {prodObj ? prodObj.title : 'Deleted Product'}
                            </td>
                            <td style={{ fontWeight: '600' }}>{ord.quantity}</td>
                            <td style={{ fontSize: '12px', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={`${ord.address.address}, ${ord.address.city}, ${ord.address.state} - ${ord.address.pincode}`}>
                              {ord.address.fullName} ({ord.address.mobile}) <br />
                              {ord.address.address}, {ord.address.city}
                            </td>
                            <td>{formatDate(ord.orderDate)}</td>
                            <td>
                              <select
                                className="select-status"
                                value={ord.status}
                                onChange={(e) => handleOrderStatusChange(ord._id, e.target.value)}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </motion.div>
              )}
            </motion.div>
          )}
          </AnimatePresence>
        </motion.main>
      </div>

      {/* POPUP MODAL: Add / Edit Product */}
      <AnimatePresence>
        {productModalOpen && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="modal-header">
                <h3 style={{ fontSize: '18px', fontWeight: '700' }}>
                  {editingProduct ? 'Edit Catalog Product' : 'Add New Product'}
                </h3>
                <motion.button 
                  onClick={() => setProductModalOpen(false)}
                  style={{ fontSize: '20px', color: 'var(--gray-text)', fontWeight: '700' }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  &times;
                </motion.button>
              </div>
              
              <form onSubmit={handleProductFormSubmit}>
                <div className="modal-body">
                  {/* Title */}
                  <div className="form-group">
                    <label htmlFor="modal-title">Product Title *</label>
                    <input
                      type="text"
                      id="modal-title"
                      className="form-input"
                      value={productForm.title}
                      onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="form-group">
                    <label htmlFor="modal-desc">Description *</label>
                    <textarea
                      id="modal-desc"
                      className="form-input"
                      rows="3"
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  {/* Category & Gender */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="modal-cat">Category *</label>
                      <select
                        id="modal-cat"
                        className="form-input"
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      >
                        <option value="Electronics">Electronics</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Mobiles">Mobiles</option>
                        <option value="Groceries">Groceries</option>
                        <option value="Sports Equipment">Sports Equipment</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="modal-gender">Gender Target</label>
                      <select
                        id="modal-gender"
                        className="form-input"
                        value={productForm.gender}
                        onChange={(e) => setProductForm({ ...productForm, gender: e.target.value })}
                      >
                        <option value="Unisex">Unisex</option>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                      </select>
                    </div>
                  </div>

                  {/* Price, Discount & Stock */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="modal-price">Price ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        id="modal-price"
                        className="form-input"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="modal-discount">Discount (%)</label>
                      <input
                        type="number"
                        id="modal-discount"
                        className="form-input"
                        value={productForm.discount}
                        onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="modal-stock">Stock *</label>
                      <input
                        type="number"
                        id="modal-stock"
                        className="form-input"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Image URL */}
                  <div className="form-group" style={{ marginBottom: '0' }}>
                    <label htmlFor="modal-image">Image URL *</label>
                    <input
                      type="url"
                      id="modal-image"
                      className="form-input"
                      placeholder="https://unsplash.com/photo-..."
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <motion.button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={() => setProductModalOpen(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button 
                    type="submit" 
                    className="btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {editingProduct ? 'Save Changes' : 'Add Product'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminDashboard;
