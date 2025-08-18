// Cart State Management
class CartManager {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    this.isOpen = false;
    this.init();
  }

  init() {
    this.renderCart();
    this.bindEvents();
  }

  // Add product to cart
  addToCart(product) {
    const existingItem = this.cart.find(item => 
      item.id === product.id && 
      item.size === product.size && 
      item.color === product.color
    );

    if (existingItem) {
      existingItem.quantity += product.quantity;
    } else {
      this.cart.push({
        ...product,
        addedAt: new Date().toISOString()
      });
    }

    this.saveCart();
    this.renderCart();
    this.openCart();
    this.showNotification('Product added to cart!', 'success');
  }

  // Remove item from cart
  removeFromCart(index) {
    this.cart.splice(index, 1);
    this.saveCart();
    this.renderCart();
    this.showNotification('Item removed from cart', 'info');
  }

  // Update item quantity
  updateQuantity(index, newQuantity) {
    if (newQuantity <= 0) {
      this.removeFromCart(index);
      return;
    }
    
    this.cart[index].quantity = newQuantity;
    this.saveCart();
    this.renderCart();
  }

  // Clear entire cart
  clearCart() {
    this.cart = [];
    this.saveCart();
    this.renderCart();
    this.showNotification('Cart cleared', 'info');
  }

  // Calculate subtotal
  getSubtotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Get cart count
  getCartCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  // Save cart to localStorage
  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  // Open side cart
  openCart() {
    this.isOpen = true;
    document.body.classList.add('cart-open');
    const cartContainer = document.getElementById('side-cart');
    if (cartContainer) {
      cartContainer.style.display = 'block';
      setTimeout(() => {
        cartContainer.style.opacity = '1';
      }, 10);
    }
    this.renderCart();
  }

  // Close side cart
  closeCart() {
    this.isOpen = false;
    document.body.classList.remove('cart-open');
    const cartContainer = document.getElementById('side-cart');
    if (cartContainer) {
      cartContainer.style.opacity = '0';
      setTimeout(() => {
        cartContainer.style.display = 'none';
      }, 300);
    }
  }

  // Toggle cart
  toggleCart() {
    if (this.isOpen) {
      this.closeCart();
    } else {
      this.openCart();
    }
  }

  // Render cart UI
  renderCart() {
    const cartContainer = document.getElementById('side-cart');
    if (!cartContainer) {
      this.createCartContainer();
    }

    const cartContainer2 = document.getElementById('side-cart');
    const cartContent = document.getElementById('cart-content');
    const cartCount = document.getElementById('cart-count');

    if (cartCount) {
      const count = this.getCartCount();
      cartCount.textContent = count;
      cartCount.style.display = count > 0 ? 'block' : 'none';
    }

    if (cartContent) {
      if (this.cart.length === 0) {
        cartContent.innerHTML = `
          <div class="empty-cart">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h3>Your cart is empty</h3>
            <p>Add some products to get started</p>
          </div>
        `;
      } else {
        cartContent.innerHTML = `
          <div class="cart-header">
            <h3>Shopping Cart</h3>
            <button class="close-cart" onclick="cartManager.closeCart()">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          <div class="cart-items">
            ${this.cart.map((item, index) => `
              <div class="cart-item" data-index="${index}">
                <div class="cart-item-image">
                  <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                  <h4 class="cart-item-name">${item.name}</h4>
                  <div class="cart-item-variants">
                    ${item.size ? `<span class="variant">Size: ${item.size}</span>` : ''}
                    ${item.color ? `<span class="variant">Color: ${item.color}</span>` : ''}
                  </div>
                  <div class="cart-item-price">₹${item.price.toFixed(2)}</div>
                  <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="cartManager.updateQuantity(${index}, ${item.quantity - 1})">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="cartManager.updateQuantity(${index}, ${item.quantity + 1})">+</button>
                  </div>
                </div>
                <button class="remove-item" onclick="cartManager.removeFromCart(${index})">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            `).join('')}
          </div>
          <div class="cart-footer">
            <div class="cart-subtotal">
              <span>Subtotal:</span>
              <span class="subtotal-amount">₹${this.getSubtotal().toFixed(2)}</span>
            </div>
            <div class="cart-actions">
              <button class="btn btn-secondary" onclick="cartManager.clearCart()">Clear Cart</button>
              <button class="btn btn-primary" onclick="cartManager.checkout()">Checkout</button>
            </div>
          </div>
        `;
      }
    }
  }

  // Create cart container
  createCartContainer() {
    const cartHTML = `
      <div id="side-cart" class="side-cart">
        <div class="cart-overlay" onclick="cartManager.closeCart()"></div>
        <div class="cart-panel">
          <div id="cart-content"></div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', cartHTML);
  }

  // Bind events
  bindEvents() {
    // Close cart on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeCart();
      }
    });

    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && e.target.classList.contains('cart-overlay')) {
        this.closeCart();
      }
    });
  }

  // Checkout function
  checkout() {
    if (this.cart.length === 0) {
      this.showNotification('Your cart is empty', 'error');
      return;
    }
    
    // Redirect to checkout page or show checkout modal
    this.showNotification('Proceeding to checkout...', 'info');
    // You can implement checkout logic here
  }

  // Show notification
  showNotification(message, type = 'info') {
    if (window.showNotification) {
      window.showNotification(message, type);
    } else {
      console.log(`${type.toUpperCase()}: ${message}`);
    }
  }
}

// Initialize cart manager
const cartManager = new CartManager();

// Global function to add product to cart
function addToCart(productData) {
  cartManager.addToCart(productData);
}

// Global function to open cart
function openCart() {
  cartManager.openCart();
}

// Global function to close cart
function closeCart() {
  cartManager.closeCart();
}
