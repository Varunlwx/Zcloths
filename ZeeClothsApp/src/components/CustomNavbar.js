import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  StatusBar,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { openCart } from '../store/slices/cartSlice';
import { colors, fonts, spacing } from '../styles/theme';

const { width } = Dimensions.get('window');

export default function CustomNavbar({ 
  navigation, 
  showBackButton = false, 
  backgroundColor = 'transparent',
  textColor = colors.white 
}) {
  const dispatch = useDispatch();
  const { items } = useSelector(state => state.cart);
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('Shop', { searchQuery: searchQuery.trim() });
      setSearchQuery('');
    }
  };

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  const handleProfilePress = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleNavigation = (screen) => {
    navigation.navigate(screen);
    setShowProfileMenu(false);
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar 
        barStyle={textColor === colors.white ? "light-content" : "dark-content"} 
        backgroundColor={backgroundColor === 'transparent' ? colors.black : backgroundColor}
      />
      
      <BlurView 
        intensity={backgroundColor === 'transparent' ? 0 : 20} 
        style={styles.navbar}
      >
        <View style={styles.navContent}>
          {/* Left Section */}
          <View style={styles.leftSection}>
            {showBackButton ? (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Icon name="arrow-back" size={24} color={textColor} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <View style={styles.brand}>
                  <View style={styles.brandBadge} />
                  <Text style={[styles.brandText, { color: textColor }]}>ZEECLOTHS</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* Center Section - Navigation */}
          {!showBackButton && (
            <View style={styles.centerSection}>
              <TouchableOpacity onPress={() => handleNavigation('Home')}>
                <Text style={[styles.navLink, { color: textColor }]}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleNavigation('About')}>
                <Text style={[styles.navLink, { color: textColor }]}>About</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleNavigation('Shop')}>
                <Text style={[styles.navLink, { color: textColor }]}>Collections</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleNavigation('Contact')}>
                <Text style={[styles.navLink, { color: textColor }]}>Contact</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Right Section */}
          <View style={styles.rightSection}>
            {/* Search */}
            <View style={styles.searchContainer}>
              <View style={styles.searchInputWrapper}>
                <TextInput
                  style={[styles.searchInput, { color: textColor }]}
                  placeholder="Search products..."
                  placeholderTextColor={`${textColor}70`}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={handleSearch}
                  returnKeyType="search"
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                  <Icon name="search" size={20} color={textColor} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Cart */}
            <TouchableOpacity style={styles.cartIcon} onPress={handleCartPress}>
              <Icon name="shopping-cart" size={24} color={textColor} />
              {cartCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Profile */}
            {isAuthenticated ? (
              <View style={styles.profileContainer}>
                <TouchableOpacity style={styles.profileIcon} onPress={handleProfilePress}>
                  <Icon name="person" size={24} color={textColor} />
                </TouchableOpacity>
                
                {showProfileMenu && (
                  <BlurView intensity={90} style={styles.profileMenu}>
                    <View style={styles.profileMenuHeader}>
                      <Text style={styles.welcomeText}>Welcome, {user?.firstName}</Text>
                    </View>
                    <View style={styles.profileMenuDivider} />
                    
                    {user?.isAdmin && (
                      <TouchableOpacity
                        style={styles.profileMenuItem}
                        onPress={() => handleNavigation('AdminDashboard')}
                      >
                        <Icon name="admin-panel-settings" size={16} color={colors.black} />
                        <Text style={styles.profileMenuText}>Admin Dashboard</Text>
                      </TouchableOpacity>
                    )}
                    
                    <TouchableOpacity
                      style={styles.profileMenuItem}
                      onPress={() => handleNavigation('Profile')}
                    >
                      <Icon name="person" size={16} color={colors.black} />
                      <Text style={styles.profileMenuText}>Profile</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.profileMenuItem}
                      onPress={() => {
                        setShowProfileMenu(false);
                        setTimeout(() => {
                          Alert.alert(
                            'Logout',
                            'Are you sure you want to logout?',
                            [
                              { text: 'Cancel', style: 'cancel' },
                              { 
                                text: 'Logout', 
                                onPress: () => dispatch(logoutUser())
                              },
                            ]
                          );
                        }, 100);
                      }}
                    >
                      <Icon name="logout" size={16} color={colors.black} />
                      <Text style={styles.profileMenuText}>Logout</Text>
                    </TouchableOpacity>
                  </BlurView>
                )}
              </View>
            ) : (
              <View style={styles.authButtons}>
                <TouchableOpacity
                  style={[styles.authButton, { borderColor: textColor }]}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={[styles.authButtonText, { color: textColor }]}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.authButton, styles.registerButton]}
                  onPress={() => navigation.navigate('Register')}
                >
                  <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  navbar: {
    paddingTop: StatusBar.currentHeight || 44,
    paddingBottom: 16,
    paddingHorizontal: spacing.large,
  },
  navContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flex: 1,
  },
  centerSection: {
    flexDirection: 'row',
    gap: 24,
    flex: 2,
    justifyContent: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    justifyContent: 'flex-end',
  },
  backButton: {
    padding: 8,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.cyan,
  },
  brandText: {
    fontFamily: fonts.semiBold,
    fontSize: 20,
    letterSpacing: 2,
  },
  navLink: {
    fontFamily: fonts.regular,
    fontSize: 14,
    letterSpacing: 0.5,
  },
  searchContainer: {
    flex: 1,
    maxWidth: 200,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    paddingVertical: 8,
  },
  searchButton: {
    padding: 4,
  },
  cartIcon: {
    position: 'relative',
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: colors.red,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.white,
  },
  profileContainer: {
    position: 'relative',
  },
  profileIcon: {
    padding: 8,
  },
  profileMenu: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    minWidth: 200,
    paddingVertical: 8,
    zIndex: 1001,
  },
  profileMenuHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  welcomeText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.white,
  },
  profileMenuDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  profileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  profileMenuText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.white,
  },
  authButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  authButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  authButtonText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  registerButton: {
    backgroundColor: colors.cyan,
    borderColor: colors.cyan,
  },
  registerButtonText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});