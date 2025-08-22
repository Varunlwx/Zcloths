# ZeeCloths React Native App

A complete React Native clone of the ZEECLOTHS Flask e-commerce application with identical functionality and UI design.

## 🚀 Features

### Core Features
- **Identical UI/UX** to the original Flask application
- **3D Interactive Backgrounds** using animated components
- **User Authentication** with login/register
- **Product Catalog** with categories and search
- **Shopping Cart** with real-time updates
- **Order Management** with status tracking
- **Admin Dashboard** for store management
- **Responsive Design** for all device sizes

### Technical Features
- **React Native** with Expo
- **Redux Toolkit** for state management
- **React Navigation** for routing
- **Animated Components** for smooth interactions
- **AsyncStorage** for data persistence
- **Custom Components** matching original design
- **Toast Notifications** for user feedback

## 🎨 Design Highlights

### Authentic Recreation
- **Exact Color Scheme** - Black background with cyan accents
- **Poppins Font Family** - Matching typography
- **Glassmorphism Effects** - Blur and transparency
- **Smooth Animations** - Fade, slide, and scale effects
- **3D Background Simulation** - Animated geometric shapes
- **Responsive Layout** - Adapts to different screen sizes

### Screen Fidelity
- **Login/Register** - 3D background with glassmorphism cards
- **Home Screen** - Hero section with discover grid
- **Shop Screen** - Product grid with filters
- **Product Detail** - Image gallery with options
- **Cart Screen** - Side panel design
- **Profile Screen** - Order history and user info
- **Admin Dashboard** - Stats and management tools

## 📱 Installation

1. **Install Dependencies**
   ```bash
   cd ZeeClothsApp
   npm install
   ```

2. **Add Fonts**
   - Download Poppins fonts from Google Fonts
   - Place font files in `assets/fonts/` directory:
     - Poppins-Regular.ttf
     - Poppins-Medium.ttf
     - Poppins-SemiBold.ttf
     - Poppins-Bold.ttf

3. **Configure Backend**
   - Update `BASE_URL` in `src/services/api.js` to your Flask app URL
   - Ensure Flask app is running and accessible

4. **Run the App**
   ```bash
   npm start
   ```

## 🏗️ Project Structure

```
ZeeClothsApp/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── CustomNavbar.js  # Navigation bar
│   │   ├── ProductCard.js   # Product display card
│   │   ├── CartItem.js      # Cart item component
│   │   ├── SplineBackground.js # 3D background simulation
│   │   └── ...
│   ├── navigation/          # Navigation configuration
│   │   └── AppNavigator.js  # Main navigation setup
│   ├── screens/            # Screen components
│   │   ├── auth/           # Authentication screens
│   │   ├── shop/           # Shopping screens
│   │   ├── cart/           # Cart screens
│   │   ├── admin/          # Admin screens
│   │   └── ...
│   ├── store/              # Redux store
│   │   ├── slices/         # Redux slices
│   │   └── store.js        # Store configuration
│   ├── services/           # API services
│   │   └── api.js          # API endpoints
│   ├── styles/             # Theme and styling
│   │   └── theme.js        # Design system
│   └── utils/              # Utility functions
│       ├── toast.js        # Toast notifications
│       ├── storage.js      # AsyncStorage helpers
│       ├── validation.js   # Form validation
│       └── helpers.js      # General helpers
├── assets/                 # Static assets
│   └── fonts/             # Font files
└── ...
```

## 🔧 Configuration

### API Integration
The app connects to your Flask backend through the API service. Update the base URL in `src/services/api.js`:

```javascript
const BASE_URL = 'http://your-flask-app-url:5000';
```

### State Management
- **Redux Toolkit** for global state
- **Redux Persist** for data persistence
- **Async Thunks** for API calls

### Navigation
- **Stack Navigation** for screen transitions
- **Tab Navigation** for main app sections
- **Conditional Navigation** based on auth state

## 🎯 Key Components

### CustomNavbar
- Transparent on hero, solid on scroll
- Search functionality
- Cart badge with item count
- Profile dropdown menu

### ProductCard
- Image with overlay effects
- Product information display
- Add to cart functionality
- Hover state animations

### SplineBackground
- Animated geometric shapes
- Gradient backgrounds
- Continuous rotation and floating
- 3D-like visual effects

### CartItem
- Product image and details
- Quantity controls
- Remove functionality
- Variant display (size/color)

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px - Single column layout
- **Tablet**: 768px - 1024px - Adapted layouts
- **Desktop**: > 1024px - Full desktop experience

### Adaptive Features
- **Navigation**: Collapsible on mobile
- **Product Grid**: Responsive columns
- **Forms**: Stacked on mobile, side-by-side on desktop
- **Images**: Optimized for different screen densities

## 🔐 Authentication

### Login System
- Username/email and password
- Demo credentials included
- Session persistence
- Error handling

### User Roles
- **Regular Users**: Shopping and profile management
- **Admin Users**: Full dashboard access
- **Role-based Navigation**: Conditional screen access

## 🛒 E-commerce Features

### Shopping Cart
- Add/remove items
- Quantity management
- Size and color variants
- Real-time total calculation
- Persistent across sessions

### Order Management
- Order creation and tracking
- Order history
- Status updates
- Order confirmation screen

### Product Catalog
- Category filtering
- Search functionality
- Product details
- Image galleries
- Stock management

## 🎨 Styling System

### Theme Configuration
- **Colors**: Brand colors with semantic naming
- **Typography**: Poppins font family with weights
- **Spacing**: Consistent spacing scale
- **Shadows**: Elevation system for depth

### Animation System
- **Fade Animations**: Smooth opacity transitions
- **Slide Animations**: Directional movement
- **Scale Animations**: Size transformations
- **Continuous Animations**: Rotating and floating effects

## 🚀 Deployment

### Development
```bash
npm start
# Then scan QR code with Expo Go app
```

### Production Build
```bash
# For Android
expo build:android

# For iOS
expo build:ios
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on multiple devices
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Original Flask App** - ZEECLOTHS web application
- **Expo** - React Native development platform
- **Redux Toolkit** - State management
- **React Navigation** - Navigation library
- **Poppins Font** - Typography system

---

**ZeeCloths React Native** - Bringing premium fashion to mobile 📱✨