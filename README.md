# ZeeCloths - Modern E-commerce Website

A fully-featured e-commerce platform for men's clothing with a modern, responsive design and 3D interactive elements.

## 🚀 Features

### Frontend
- **Modern UI/UX** with dark theme and glassmorphism effects
- **3D Interactive Background** using Spline 3D models
- **Responsive Design** that works on all devices
- **Smooth Animations** and transitions
- **Real-time Form Validation** with visual feedback
- **Interactive Elements** with hover effects and micro-interactions

### E-commerce Features
- **Product Catalog** with categories and filtering
- **Shopping Cart** with real-time updates
- **User Authentication** with secure login/register
- **Order Management** with status tracking
- **Admin Dashboard** for product and order management
- **Payment Integration** ready for implementation

### Technical Features
- **Flask Backend** with modular architecture
- **SQLAlchemy ORM** for database management
- **Blueprint Structure** for organized routing
- **Session Management** for cart and user data
- **File Upload** for product images
- **Search and Filter** functionality

## 🎨 Design Highlights

### Login & Register Pages
- **3D Spline Background** with interactive elements
- **Glassmorphism Cards** with backdrop blur effects
- **Smooth Animations** for form elements
- **Real-time Validation** with visual feedback
- **Responsive Layout** that adapts to all screen sizes

### Color Scheme
- **Primary**: Dark theme with white text
- **Accent**: Cyan (#22d3ee) for highlights and links
- **Background**: Black with transparency effects
- **Success**: Green for positive actions
- **Error**: Red for validation errors

## 🛠️ Technology Stack

### Backend
- **Python 3.13**
- **Flask 3.0.0**
- **Flask-SQLAlchemy 3.1.1**
- **Flask-Login 0.6.3**
- **SQLite Database**

### Frontend
- **HTML5** with semantic markup
- **CSS3** with modern features (Grid, Flexbox, Animations)
- **JavaScript** for interactivity
- **Spline 3D** for interactive backgrounds
- **Google Fonts** (Poppins)

### Development Tools
- **Git** for version control
- **Pip** for dependency management
- **SQLite** for development database

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ZCLOTHS
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   python app.py
   ```

4. **Access the website**
   - Open your browser and go to `http://127.0.0.1:5000`
   - Admin access: `admin@zeecloths.com` / `admin123`

## 🗂️ Project Structure

```
ZCLOTHS/
├── app.py                 # Main Flask application
├── models.py             # Database models
├── requirements.txt      # Python dependencies
├── routes/              # Blueprint routes
│   ├── user_routes.py   # User authentication
│   ├── shop_routes.py   # Product catalog
│   └── admin_routes.py  # Admin dashboard
├── static/              # Static files
│   ├── css/            # Stylesheets
│   │   ├── styles.css  # Main styles
│   │   ├── login.css   # Login page styles
│   │   └── register.css # Register page styles
│   ├── js/             # JavaScript files
│   │   └── auth.js     # Authentication scripts
│   └── images/         # Image assets
├── templates/           # HTML templates
│   ├── base.html       # Base template
│   ├── login.html      # Login page
│   ├── register.html   # Register page
│   └── admin/          # Admin templates
└── README.md           # This file
```

## 🎯 Key Features

### User Authentication
- **Secure Login** with username/password
- **User Registration** with comprehensive form
- **Password Validation** with real-time feedback
- **Session Management** with Flask-Login
- **Admin Access** with role-based permissions

### Product Management
- **Product Catalog** with categories
- **Image Upload** for product photos
- **Stock Management** with real-time updates
- **Size and Color** variants
- **Search and Filter** functionality

### Shopping Experience
- **Shopping Cart** with session storage
- **Real-time Updates** for cart items
- **Checkout Process** with address collection
- **Order Confirmation** with order tracking
- **Order History** for users

### Admin Dashboard
- **Product Management** (CRUD operations)
- **Order Management** with status updates
- **User Management** with role assignment
- **Category Management** for organization
- **Analytics Dashboard** with revenue tracking

## 🎨 UI/UX Features

### Modern Design Elements
- **Glassmorphism Effects** with backdrop blur
- **Smooth Animations** using CSS keyframes
- **Interactive Hover States** for buttons and inputs
- **Responsive Grid Layouts** for optimal viewing
- **Typography Hierarchy** with Google Fonts

### 3D Integration
- **Spline 3D Background** on auth pages
- **Interactive 3D Elements** that respond to user interaction
- **Seamless Integration** with existing UI elements
- **Performance Optimized** for smooth experience

### Form Enhancements
- **Real-time Validation** with visual feedback
- **Password Strength** indicators
- **Auto-complete** support for better UX
- **Loading States** for form submission
- **Error Handling** with user-friendly messages

## 🔧 Configuration

### Environment Variables
```bash
SECRET_KEY=zeecloths-secret-key-2024
SQLALCHEMY_DATABASE_URI=sqlite:///zeecloths.db
UPLOAD_FOLDER=static/images/products
```

### Database Setup
The application automatically creates the database and sample data on first run:
- Categories: Shirts, T-Shirts, Pants, Hoodies
- Sample Products: 4 products with images and details
- Admin User: admin@zeecloths.com / admin123

## 🚀 Deployment

### Local Development
```bash
python app.py
```

### Production Deployment
1. Set up a production WSGI server (Gunicorn, uWSGI)
2. Configure environment variables
3. Set up a production database (PostgreSQL, MySQL)
4. Configure static file serving
5. Set up SSL certificates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 Acknowledgments

- **Spline** for 3D interactive elements
- **Google Fonts** for typography
- **Flask Community** for the excellent framework
- **CSS Grid & Flexbox** for modern layouts

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**ZeeCloths** - Where Style Meets Technology 🛍️✨

