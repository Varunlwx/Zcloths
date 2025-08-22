import axios from 'axios';

// Base URL - Update this to your Flask app URL
const BASE_URL = 'http://127.0.0.1:5000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = null; // Get from AsyncStorage if implementing JWT
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.log('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username, password) =>
    api.post('/login', { username, password }),
  
  register: (userData) =>
    api.post('/register', userData),
  
  logout: () =>
    api.post('/logout'),
  
  getProfile: () =>
    api.get('/profile'),
  
  updateProfile: (userData) =>
    api.put('/profile/edit', userData),
};

// Product API
export const productAPI = {
  getProducts: (params = {}) =>
    api.get('/shop', { params }),
  
  getProductById: (id) =>
    api.get(`/product/${id}`),
  
  getCategories: () =>
    api.get('/api/categories'),
  
  searchProducts: (query) =>
    api.get('/search', { params: { q: query } }),
  
  getFeaturedProducts: () =>
    api.get('/api/featured-products'),
};

// Order API
export const orderAPI = {
  createOrder: (orderData) =>
    api.post('/api/orders', orderData),
  
  getUserOrders: (userId) =>
    api.get(`/api/orders/user/${userId}`),
  
  getOrderById: (orderId) =>
    api.get(`/api/orders/${orderId}`),
  
  updateOrderStatus: (orderId, status) =>
    api.put(`/api/orders/${orderId}/status`, { status }),
};

// Admin API
export const adminAPI = {
  getDashboardStats: () =>
    api.get('/admin/api/stats'),
  
  getProducts: (params = {}) =>
    api.get('/admin/products', { params }),
  
  createProduct: (productData) =>
    api.post('/admin/products/add', productData),
  
  updateProduct: (productId, productData) =>
    api.put(`/admin/products/edit/${productId}`, productData),
  
  deleteProduct: (productId) =>
    api.delete(`/admin/products/delete/${productId}`),
  
  getOrders: (params = {}) =>
    api.get('/admin/orders', { params }),
  
  getUsers: (params = {}) =>
    api.get('/admin/users', { params }),
};

export default api;