// Main JavaScript file for ZEECLOTHS

// Flash message auto-dismiss
document.addEventListener('DOMContentLoaded', function() {
    // Auto-dismiss flash messages after 5 seconds
    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(function(message) {
        setTimeout(function() {
            message.style.opacity = '0';
            setTimeout(function() {
                message.remove();
            }, 300);
        }, 5000);
    });

    // Close flash messages on click
    flashMessages.forEach(function(message) {
        message.addEventListener('click', function() {
            this.style.opacity = '0';
            setTimeout(() => this.remove(), 300);
        });
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(0, 0, 0, 0.9)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'transparent';
        navbar.style.backdropFilter = 'none';
    }
});

// Mobile menu toggle (if needed)
function toggleMobileMenu() {
    const navList = document.querySelector('.nav-list');
    navList.classList.toggle('active');
}



// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1002;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.background = '#10b981';
            break;
        case 'error':
            notification.style.background = '#ef4444';
            break;
        case 'warning':
            notification.style.background = '#f59e0b';
            break;
        default:
            notification.style.background = '#3b82f6';
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return strength;
}

// Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Search functionality
function performSearch(query) {
    if (query.trim().length < 2) return;
    
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize search with debounce
const debouncedSearch = debounce(performSearch, 300);

// Product filter functionality
function filterProducts(category, priceRange, sortBy) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (priceRange) params.append('price', priceRange);
    if (sortBy) params.append('sort', sortBy);
    
    window.location.href = `/collection?${params.toString()}`;
}

// Wishlist functionality
function toggleWishlist(productId) {
    fetch('/toggle-wishlist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            product_id: productId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const wishlistBtn = document.querySelector(`[data-product-id="${productId}"]`);
            if (wishlistBtn) {
                wishlistBtn.classList.toggle('active');
            }
            showNotification(data.message, 'success');
        } else {
            showNotification(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('An error occurred', 'error');
    });
}



// Initialize tooltips
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.dataset.tooltip;
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 0.5rem;
                border-radius: 4px;
                font-size: 0.875rem;
                z-index: 1000;
                pointer-events: none;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
            
            this.tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this.tooltip) {
                this.tooltip.remove();
                this.tooltip = null;
            }
        });
    });
}

// Search functionality
let searchTimeout;

function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchSuggestions = document.getElementById('searchSuggestions');
    
    if (!searchInput || !searchSuggestions) return;
    
    // Handle input changes
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        
        // Clear previous timeout
        clearTimeout(searchTimeout);
        
        if (query.length < 2) {
            hideSuggestions();
            return;
        }
        
        // Debounce search requests
        searchTimeout = setTimeout(() => {
            fetchSearchSuggestions(query);
        }, 300);
    });
    
    // Handle form submission
    searchInput.closest('form').addEventListener('submit', function(e) {
        const query = searchInput.value.trim();
        if (!query) {
            e.preventDefault();
            searchInput.focus();
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
            hideSuggestions();
        }
    });
    
    // Handle keyboard navigation
    searchInput.addEventListener('keydown', function(e) {
        const suggestions = searchSuggestions.querySelectorAll('.suggestion-item');
        const activeSuggestion = searchSuggestions.querySelector('.suggestion-item.active');
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                navigateSuggestions(suggestions, activeSuggestion, 1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                navigateSuggestions(suggestions, activeSuggestion, -1);
                break;
            case 'Enter':
                if (activeSuggestion) {
                    e.preventDefault();
                    window.location.href = activeSuggestion.dataset.url;
                }
                break;
            case 'Escape':
                hideSuggestions();
                searchInput.blur();
                break;
        }
    });
}

function fetchSearchSuggestions(query) {
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuggestions(data.products, query);
            } else {
                showNoSuggestions();
            }
        })
        .catch(error => {
            console.error('Search error:', error);
            showNoSuggestions();
        });
}

function showSuggestions(products, query) {
    const searchSuggestions = document.getElementById('searchSuggestions');
    
    if (!products || products.length === 0) {
        showNoSuggestions();
        return;
    }
    
    const suggestionsHTML = products.map(product => `
        <div class="suggestion-item" data-url="/product/${product.id}">
            <img src="${product.image_url}" alt="${product.name}">
            <div class="suggestion-content">
                <div class="suggestion-title">${highlightQuery(product.name, query)}</div>
                <div class="suggestion-price">₹${product.price}</div>
            </div>
        </div>
    `).join('');
    
    searchSuggestions.innerHTML = suggestionsHTML;
    searchSuggestions.classList.add('active');
    
    // Add click handlers to suggestions
    searchSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
            window.location.href = this.dataset.url;
        });
        
        item.addEventListener('mouseenter', function() {
            searchSuggestions.querySelectorAll('.suggestion-item').forEach(s => s.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function showNoSuggestions() {
    const searchSuggestions = document.getElementById('searchSuggestions');
    searchSuggestions.innerHTML = '<div class="no-suggestions">No products found</div>';
    searchSuggestions.classList.add('active');
}

function hideSuggestions() {
    const searchSuggestions = document.getElementById('searchSuggestions');
    searchSuggestions.classList.remove('active');
}

function navigateSuggestions(suggestions, activeSuggestion, direction) {
    const currentIndex = Array.from(suggestions).indexOf(activeSuggestion);
    let newIndex;
    
    if (direction === 1) {
        newIndex = currentIndex < suggestions.length - 1 ? currentIndex + 1 : 0;
    } else {
        newIndex = currentIndex > 0 ? currentIndex - 1 : suggestions.length - 1;
    }
    
    suggestions.forEach(s => s.classList.remove('active'));
    suggestions[newIndex].classList.add('active');
}

function highlightQuery(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Initialize search on page load
document.addEventListener('DOMContentLoaded', initSearch);

// Initialize tooltips on page load
document.addEventListener('DOMContentLoaded', initTooltips);

// Export functions for use in other scripts
window.ZEECLOTHS = {
    showNotification,
    toggleWishlist,
    filterProducts,
    validateForm,
    checkPasswordStrength,
    initSearch
};

