from flask import Blueprint, render_template, request, jsonify, session, redirect, url_for, flash
from flask_login import login_required, current_user
from models import db, Product, Category, User, Order, OrderItem
from sqlalchemy import or_, desc, asc
import os

shop_bp = Blueprint('shop', __name__)

@shop_bp.route('/shop')
def shop():
    # Get query parameters
    page = request.args.get('page', 1, type=int)
    category_id = request.args.get('category', type=int)
    search = request.args.get('search', '')
    sort_by = request.args.get('sort', '')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    
    # Base query
    query = Product.query
    
    # Apply filters
    if category_id:
        query = query.filter(Product.category_id == category_id)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Product.name.ilike(search_term),
                Product.description.ilike(search_term),
                Category.name.ilike(search_term)
            )
        ).join(Category)
    
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    
    # Apply sorting
    if sort_by == 'name':
        query = query.order_by(Product.name.asc())
    elif sort_by == 'price_low':
        query = query.order_by(Product.price.asc())
    elif sort_by == 'price_high':
        query = query.order_by(Product.price.desc())
    elif sort_by == 'newest':
        query = query.order_by(Product.id.desc())
    else:
        query = query.order_by(Product.id.desc())
    
    # Pagination
    per_page = 12
    products = query.paginate(
        page=page, 
        per_page=per_page, 
        error_out=False
    )
    
    # Get categories for filter
    categories = Category.query.all()
    
    return render_template('shop.html',
                         products=products,
                         categories=categories,
                         current_category=category_id,
                         search=search,
                         sort_by=sort_by,
                         min_price=min_price,
                         max_price=max_price)

@shop_bp.route('/product/<int:product_id>')
def product_detail(product_id):
    product = Product.query.get_or_404(product_id)
    related_products = Product.query.filter(
        Product.category_id == product.category_id,
        Product.id != product_id
    ).limit(4).all()
    
    return render_template('product_detail.html', 
                         product=product, 
                         related_products=related_products)

@shop_bp.route('/search')
def search():
    query = request.args.get('q', '')
    if not query:
        return redirect(url_for('shop.shop'))
    
    page = request.args.get('page', 1, type=int)
    
    # Search in product name, description, and category
    search_term = f"%{query}%"
    products = Product.query.filter(
        or_(
            Product.name.ilike(search_term),
            Product.description.ilike(search_term),
            Category.name.ilike(search_term)
        )
    ).join(Category).paginate(
        page=page, 
        per_page=12, 
        error_out=False
    )
    
    categories = Category.query.all()
    
    return render_template('search_results.html',
                         products=products,
                         categories=categories,
                         search_query=query)

@shop_bp.route('/category/<int:category_id>')
def category(category_id):
    category = Category.query.get_or_404(category_id)
    page = request.args.get('page', 1, type=int)
    
    products = Product.query.filter_by(category_id=category_id).paginate(
        page=page, 
        per_page=12, 
        error_out=False
    )
    
    categories = Category.query.all()
    
    return render_template('shop.html',
                         products=products,
                         categories=categories,
                         current_category=category_id,
                         category_name=category.name)

@shop_bp.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)
    size = data.get('size')
    color = data.get('color')
    
    product = Product.query.get_or_404(product_id)
    
    if product.stock < quantity:
        return jsonify({'success': False, 'message': 'Not enough stock available'})
    
    cart = session.get('cart', [])
    
    # Check if product already in cart
    for item in cart:
        if item['product_id'] == product_id and item.get('size') == size and item.get('color') == color:
            item['quantity'] += quantity
            session['cart'] = cart
            return jsonify({'success': True, 'message': 'Quantity updated in cart'})
    
    # Add new item to cart
    cart.append({
        'product_id': product_id,
        'name': product.name,
        'price': product.price,
        'quantity': quantity,
        'image_url': product.image_url,
        'size': size,
        'color': color
    })
    
    session['cart'] = cart
    return jsonify({'success': True, 'message': 'Product added to cart'})

@shop_bp.route('/update_cart', methods=['POST'])
def update_cart():
    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity')
    
    cart = session.get('cart', [])
    for item in cart:
        if item['product_id'] == product_id:
            item['quantity'] = max(1, quantity)
            session['cart'] = cart
            return jsonify({'success': True})
    return jsonify({'success': False})

@shop_bp.route('/remove_from_cart', methods=['POST'])
def remove_from_cart():
    data = request.get_json()
    product_id = data.get('product_id')
    
    cart = session.get('cart', [])
    for i, item in enumerate(cart):
        if item['product_id'] == product_id:
            cart.pop(i)
            session['cart'] = cart
            return jsonify({'success': True})
    return jsonify({'success': False})

@shop_bp.route('/clear_cart', methods=['POST'])
def clear_cart():
    session.pop('cart', None)
    return jsonify({'success': True})

@shop_bp.route('/cart')
def cart():
    cart_items = session.get('cart', [])
    
    # Calculate totals
    subtotal = sum(item['price'] * item['quantity'] for item in cart_items)
    shipping_cost = 0 if subtotal >= 1000 else 100
    total = subtotal + shipping_cost
    
    return render_template('cart.html', cart_items=cart_items, subtotal=subtotal, shipping_cost=shipping_cost, total=total)

@shop_bp.route('/checkout')
@login_required
def checkout():
    cart_items = session.get('cart', [])
    if not cart_items:
        return redirect(url_for('shop.cart'))
    
    # Calculate totals
    subtotal = sum(item['price'] * item['quantity'] for item in cart_items)
    shipping_cost = 0 if subtotal >= 1000 else 100
    total = subtotal + shipping_cost
    
    return render_template('checkout.html', cart_items=cart_items, subtotal=subtotal, shipping_cost=shipping_cost, total=total)

@shop_bp.route('/place_order', methods=['POST'])
@login_required
def place_order():
    cart_items = session.get('cart', [])
    if not cart_items:
        flash('Your cart is empty', 'error')
        return redirect(url_for('shop.cart'))
    
    try:
        # Get form data
        payment_method = request.form.get('payment_method', 'cod')
        shipping_address = request.form.get('address', '')
        notes = request.form.get('notes', '')
        
        # Calculate total
        total = sum(item['price'] * item['quantity'] for item in cart_items)
        
        # Create order
        order = Order(
            user_id=current_user.id,
            total_amount=total,
            status='pending',
            payment_method=payment_method,
            shipping_address=shipping_address
        )
        db.session.add(order)
        db.session.flush()  # Get the order ID
        
        # Create order items
        for item in cart_items:
            product = Product.query.get(item['product_id'])
            if product and product.stock >= item['quantity']:
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
                product.stock -= item['quantity']
            else:
                db.session.rollback()
                flash('Some products are out of stock', 'error')
                return redirect(url_for('shop.cart'))
        
        # Clear cart
        session.pop('cart', None)
        
        db.session.commit()
        flash('Order placed successfully!', 'success')
        return redirect(url_for('shop.order_confirmation', order_id=order.id))
        
    except Exception as e:
        db.session.rollback()
        flash('Error placing order. Please try again.', 'error')
        return redirect(url_for('shop.cart'))

@shop_bp.route('/order_confirmation/<int:order_id>')
@login_required
def order_confirmation(order_id):
    order = Order.query.get_or_404(order_id)
    if order.user_id != current_user.id:
        return redirect(url_for('shop.shop'))
    
    return render_template('order_confirmation.html', order=order)
