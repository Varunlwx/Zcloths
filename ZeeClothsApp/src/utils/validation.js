export const validation = {
  // Email validation
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Phone validation
  isValidPhone: (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  // Password validation
  isValidPassword: (password) => {
    return password.length >= 6;
  },

  // Username validation
  isValidUsername: (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  },

  // Required field validation
  isRequired: (value) => {
    return value && value.toString().trim().length > 0;
  },

  // Name validation
  isValidName: (name) => {
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    return nameRegex.test(name);
  },

  // Price validation
  isValidPrice: (price) => {
    const priceRegex = /^\d+(\.\d{1,2})?$/;
    return priceRegex.test(price) && parseFloat(price) > 0;
  },

  // Stock validation
  isValidStock: (stock) => {
    return Number.isInteger(Number(stock)) && Number(stock) >= 0;
  },

  // Form validation helper
  validateForm: (fields, rules) => {
    const errors = {};
    
    Object.keys(rules).forEach(field => {
      const value = fields[field];
      const fieldRules = rules[field];
      
      fieldRules.forEach(rule => {
        if (rule.required && !validation.isRequired(value)) {
          errors[field] = rule.message || `${field} is required`;
          return;
        }
        
        if (value && rule.validator && !rule.validator(value)) {
          errors[field] = rule.message || `${field} is invalid`;
          return;
        }
      });
    });
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};