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



@shop_bp.route('/order_confirmation/<int:order_id>')
@login_required
def order_confirmation(order_id):
    order = Order.query.get_or_404(order_id)
    if order.user_id != current_user.id:
        return redirect(url_for('shop.shop'))
    
    return render_template('order_confirmation.html', order=order)
