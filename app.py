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
