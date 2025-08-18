from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
import json
from datetime import datetime
import uuid
import socket

# Import models
from models import db, User, Category, Product, Order, OrderItem

app = Flask(__name__)
app.config['SECRET_KEY'] = 'zeecloths-secret-key-2024'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///zeecloths.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'static/images/products'
app.config['PERMANENT_SESSION_LIFETIME'] = 1800  # 30 minutes

# Initialize extensions
db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Import and register blueprints
from routes.user_routes import user_bp
from routes.shop_routes import shop_bp
from routes.admin_routes import admin_bp

app.register_blueprint(user_bp)
app.register_blueprint(shop_bp)
app.register_blueprint(admin_bp)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Main routes
@app.route('/')
def index():
    categories = Category.query.all()
    featured_products = Product.query.limit(8).all()
    return render_template('index.html', categories=categories, featured_products=featured_products)

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

# Cart routes
@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No data received'})
        
        product_id = data.get('product_id')
        quantity = data.get('quantity', 1)
        size = data.get('size')
        color = data.get('color')
        
        if not product_id:
            return jsonify({'success': False, 'message': 'Product ID is required'})
        
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'success': False, 'message': 'Product not found'})
        
        if product.stock < quantity:
            return jsonify({'success': False, 'message': 'Not enough stock available'})
        
        cart = session.get('cart', [])
        
        # Check if product already in cart
        for item in cart:
            if item['product_id'] == product_id and item.get('size') == size and item.get('color') == color:
                item['quantity'] += quantity
                session['cart'] = cart
                session.modified = True
                return jsonify({'success': True, 'message': 'Quantity updated in cart'})
        
        # Add new item to cart
        cart_item = {
            'product_id': product_id,
            'name': product.name,
            'price': float(product.price),  # Ensure price is float
            'quantity': quantity,
            'image_url': product.image_url,
            'size': size,
            'color': color,
            'added_at': datetime.utcnow().isoformat()  # Track when item was added
        }
        cart.append(cart_item)
        
        session['cart'] = cart
        session.modified = True
        
        # Calculate cart statistics
        cart_count = len(cart)
        cart_total = sum(item['price'] * item['quantity'] for item in cart)
        
        print(f"DEBUG: Added product {product_id} to cart via main route. Cart now has {cart_count} items")
        print(f"DEBUG: Session cart: {session.get('cart')}")
        
        return jsonify({
            'success': True, 
            'message': 'Product added to cart',
            'cart_count': cart_count,
            'cart_total': cart_total,
            'product_name': product.name
        })
    except Exception as e:
        print(f"Error in add_to_cart: {str(e)}")
        return jsonify({'success': False, 'message': f'Error: {str(e)}'})

@app.route('/update_cart', methods=['POST'])
def update_cart():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No data received'})
        
        index = data.get('index')
        quantity = data.get('quantity')
        
        if index is None or quantity is None:
            return jsonify({'success': False, 'message': 'Index and quantity are required'})
        
        cart = session.get('cart', [])
        if 0 <= index < len(cart):
            cart[index]['quantity'] = quantity
            session['cart'] = cart
            session.modified = True
            return jsonify({'success': True})
        return jsonify({'success': False, 'message': 'Invalid index'})
    except Exception as e:
        print(f"Error in update_cart: {str(e)}")
        return jsonify({'success': False, 'message': f'Error: {str(e)}'})

@app.route('/remove_from_cart', methods=['POST'])
def remove_from_cart():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No data received'})
        
        index = data.get('index')
        if index is None:
            return jsonify({'success': False, 'message': 'Index is required'})
        
        cart = session.get('cart', [])
        if 0 <= index < len(cart):
            cart.pop(index)
            session['cart'] = cart
            session.modified = True
            return jsonify({'success': True})
        return jsonify({'success': False, 'message': 'Invalid index'})
    except Exception as e:
        print(f"Error in remove_from_cart: {str(e)}")
        return jsonify({'success': False, 'message': f'Error: {str(e)}'})

@app.route('/cart')
def cart():
    cart_items = session.get('cart', [])
    
    # Ensure all prices are floats and handle any potential errors
    try:
        total = sum(float(item['price']) * int(item['quantity']) for item in cart_items)
    except (ValueError, TypeError, KeyError) as e:
        print(f"Error calculating cart total: {e}")
        total = 0.0
    
    print(f"DEBUG: Cart route - {len(cart_items)} items, total: {total}")
    
    return render_template('cart.html', cart_items=cart_items, total=total)

@app.route('/debug/products')
def debug_products():
    products = Product.query.all()
    product_list = []
    for product in products:
        product_list.append({
            'id': product.id,
            'name': product.name,
            'price': product.price,
            'stock': product.stock,
            'image_url': product.image_url
        })
    return jsonify({'products': product_list})

@app.route('/debug/cart')
def debug_cart():
    cart_items = session.get('cart', [])
    return jsonify({
        'cart_items': cart_items,
        'cart_count': len(cart_items),
        'session_id': session.sid if hasattr(session, 'sid') else 'No session ID'
    })

@app.route('/test/add_to_cart/<int:product_id>')
def test_add_to_cart(product_id):
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'success': False, 'message': 'Product not found'})
        
        cart = session.get('cart', [])
        cart.append({
            'product_id': product_id,
            'name': product.name,
            'price': product.price,
            'quantity': 1,
            'image_url': product.image_url
        })
        session['cart'] = cart
        session.modified = True
        
        print(f"DEBUG: Added product {product_id} to cart. Cart now has {len(cart)} items")
        print(f"DEBUG: Session cart: {session.get('cart')}")
        
        # Calculate cart statistics
        cart_count = len(cart)
        cart_total = sum(item['price'] * item['quantity'] for item in cart)
        
        return jsonify({
            'success': True, 
            'message': f'Added {product.name} to cart',
            'cart_count': cart_count,
            'cart_total': cart_total,
            'debug_info': {
                'product_id': product_id,
                'product_name': product.name,
                'cart_items': cart_count,
                'session_id': id(session),
                'timestamp': datetime.utcnow().isoformat()
            }
        })
    except Exception as e:
        print(f"ERROR in test_add_to_cart: {str(e)}")
        return jsonify({'success': False, 'message': str(e)})

@app.route('/checkout')
@login_required
def checkout():
    cart_items = session.get('cart', [])
    if not cart_items:
        flash('Your cart is empty', 'error')
        return redirect(url_for('shop.cart'))
    
    # Calculate totals
    subtotal = sum(item['price'] * item['quantity'] for item in cart_items)
    shipping_cost = 0 if subtotal >= 1000 else 100
    total = subtotal + shipping_cost
    
    return render_template('checkout.html', cart_items=cart_items, subtotal=subtotal, shipping_cost=shipping_cost, total=total)



@app.route('/place_order', methods=['POST'])
@login_required
def place_order():
    cart_items = session.get('cart', [])
    if not cart_items:
        flash('Your cart is empty', 'error')
        return redirect(url_for('shop.cart'))
    
    # Calculate total
    total = sum(item['price'] * item['quantity'] for item in cart_items)
    
    # Create order
    order = Order(
        user_id=current_user.id,
        total_amount=total,
        payment_method=request.form.get('payment_method'),
        shipping_address=request.form.get('shipping_address'),
        billing_address=request.form.get('billing_address')
    )
    
    db.session.add(order)
    db.session.flush()  # Get the order ID
    
    # Create order items
    for item in cart_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item['product_id'],
            quantity=item['quantity'],
            price=item['price'],
            size=item.get('size'),
            color=item.get('color')
        )
        db.session.add(order_item)
        
        # Update product stock
        product = Product.query.get(item['product_id'])
        product.stock -= item['quantity']
    
    db.session.commit()
    
    # Clear cart
    session.pop('cart', None)
    
    flash('Order placed successfully!', 'success')
    return redirect(url_for('shop.order_confirmation', order_id=order.id))

@app.route('/order_confirmation/<int:order_id>')
@login_required
def order_confirmation(order_id):
    order = Order.query.get_or_404(order_id)
    if order.user_id != current_user.id and not current_user.is_admin:
        flash('Access denied', 'error')
        return redirect(url_for('index'))
    return render_template('order_confirmation.html', order=order)

# Initialize database and sample data
def init_db():
    with app.app_context():
        db.create_all()
        
        # Check if categories exist
        if Category.query.count() == 0:
            categories = [
                Category(name='Shirts', description='Formal and casual shirts', image_url='/static/images/categories/shirts.jpg'),
                Category(name='T-Shirts', description='Comfortable t-shirts', image_url='/static/images/categories/t-shirts.jpg'),
                Category(name='Pants', description='Jeans and trousers', image_url='/static/images/categories/pants.jpg'),
                Category(name='Hoodies', description='Warm and stylish hoodies', image_url='/static/images/categories/hoodies.jpg')
            ]
            db.session.add_all(categories)
            db.session.commit()
        
        # Check if products exist
        if Product.query.count() == 0:
            products = [
                Product(name='Classic White Shirt', description='Premium cotton formal shirt', price=1299.0, stock=50, image_url='/static/images/products/shirt1.jpg', sizes='["S", "M", "L", "XL"]', colors='["White", "Blue", "Black"]', category_id=1),
                Product(name='Casual T-Shirt', description='Comfortable cotton t-shirt', price=599.0, stock=100, image_url='/static/images/products/tshirt1.jpg', sizes='["S", "M", "L", "XL"]', colors='["White", "Black", "Gray"]', category_id=2),
                Product(name='Slim Fit Jeans', description='Modern slim fit jeans', price=1499.0, stock=75, image_url='/static/images/products/jeans1.jpg', sizes='["30", "32", "34", "36"]', colors='["Blue", "Black"]', category_id=3),
                Product(name='Zip Hoodie', description='Warm and comfortable hoodie', price=899.0, stock=60, image_url='/static/images/products/hoodie1.jpg', sizes='["S", "M", "L", "XL"]', colors='["Gray", "Black", "Navy"]', category_id=4)
            ]
            db.session.add_all(products)
            db.session.commit()
        
        # Create admin user if not exists
        if User.query.filter_by(email='admin@zeecloths.com').first() is None:
            admin_user = User(
                username='admin',
                email='admin@zeecloths.com',
                password_hash=generate_password_hash('admin123'),
                first_name='Admin',
                last_name='User',
                is_admin=True
            )
            db.session.add(admin_user)
            db.session.commit()
        
        # Create normal user if not exists
        if User.query.filter_by(email='user@zeecloths.com').first() is None:
            normal_user = User(
                username='user',
                email='user@zeecloths.com',
                password_hash=generate_password_hash('user123'),
                first_name='Normal',
                last_name='User',
                is_admin=False
            )
            db.session.add(normal_user)
            db.session.commit()

def get_local_ip():
    """Get the local IP address of the machine"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except Exception:
        return "127.0.0.1"

if __name__ == '__main__':
    init_db()
    local_ip = get_local_ip()
    print("=" * 60)
    print("🚀 ZEECLOTHS E-commerce Application Starting...")
    print("=" * 60)
    print(f"📍 Local Access: http://127.0.0.1:5000")
    print(f"🌐 Network Access: http://{local_ip}:5000")
    print("=" * 60)
    print("📱 Mobile/Tablet: Use the Network Access URL above")
    print("💻 Desktop: Use either URL")
    print("=" * 60)
    app.run(debug=True, host='0.0.0.0', port=5000)
