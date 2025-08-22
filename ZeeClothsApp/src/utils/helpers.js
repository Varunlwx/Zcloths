export const helpers = {
  // Format currency
  formatCurrency: (amount, currency = '₹') => {
    return `${currency}${Math.round(amount).toLocaleString()}`;
  },

  // Format date
  formatDate: (date, options = {}) => {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    };
    return new Date(date).toLocaleDateString('en-US', defaultOptions);
  },

  // Format date with time
  formatDateTime: (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  // Capitalize first letter
  capitalize: (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  // Truncate text
  truncate: (text, length = 50) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  },

  // Generate order number
  generateOrderNumber: () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const randomStr = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `ZEE${dateStr}${randomStr}`;
  },

  // Calculate discount percentage
  calculateDiscount: (originalPrice, salePrice) => {
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  },

  // Debounce function
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Deep clone object
  deepClone: (obj) => {
    return JSON.parse(JSON.stringify(obj));
  },

  // Check if object is empty
  isEmpty: (obj) => {
    return Object.keys(obj).length === 0;
  },

  // Generate unique ID
  generateId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  // Get image URI with fallback
  getImageUri: (uri, fallback = 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg') => {
    return uri || fallback;
  },

  // Calculate cart total
  calculateCartTotal: (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  // Get status color
  getStatusColor: (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#ffc107';
      case 'processing': return '#0d6efd';
      case 'shipped': return '#198754';
      case 'delivered': return '#20c997';
      case 'cancelled': return '#dc3545';
      default: return '#6b7280';
    }
  },

  // Format phone number
  formatPhoneNumber: (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  },

  // Validate image URL
  isValidImageUrl: (url) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext)) || url.includes('pexels.com');
  },
};