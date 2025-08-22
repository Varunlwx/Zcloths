import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { logoutUser } from '../store/slices/authSlice';
import { fetchUserOrders } from '../store/slices/orderSlice';
import CustomNavbar from '../components/CustomNavbar';
import OrderCard from '../components/OrderCard';
import { colors, fonts, spacing } from '../styles/theme';
import { showToast } from '../utils/toast';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { orders } = useSelector(state => state.orders);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (user) {
      dispatch(fetchUserOrders(user.id));
    }
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [user]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            dispatch(logoutUser());
            showToast('Logged out successfully', 'info');
          }
        },
      ]
    );
  };

  const navigateToAdmin = () => {
    navigation.navigate('AdminDashboard');
  };

  const navigateToOrderDetail = (orderId) => {
    navigation.navigate('OrderDetail', { orderId });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <LinearGradient
        colors={['#f8fafc', '#e2e8f0']}
        style={styles.background}
      />
      
      <CustomNavbar 
        navigation={navigation} 
        backgroundColor={colors.white}
        textColor={colors.black}
      />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Profile</Text>
            <Text style={styles.headerSubtitle}>Manage your account and view your order history</Text>
          </View>

          <View style={styles.profileContent}>
            {/* Profile Information */}
            <BlurView intensity={80} style={styles.profileSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                <TouchableOpacity style={styles.editButton}>
                  <Icon name="edit" size={16} color={colors.cyan} />
                  <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.infoCard}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Name:</Text>
                  <Text style={styles.infoValue}>{user?.firstName} {user?.lastName}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Email:</Text>
                  <Text style={styles.infoValue}>{user?.email}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Phone:</Text>
                  <Text style={styles.infoValue}>{user?.phone || 'Not provided'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Address:</Text>
                  <Text style={styles.infoValue}>{user?.address || 'Not provided'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Member Since:</Text>
                  <Text style={styles.infoValue}>{formatDate(user?.createdAt)}</Text>
                </View>
              </View>
            </BlurView>

            {/* Order History */}
            <BlurView intensity={80} style={styles.profileSection}>
              <Text style={styles.sectionTitle}>Order History</Text>
              
              {orders.length > 0 ? (
                <View style={styles.ordersList}>
                  {orders.map((order, index) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onPress={() => navigateToOrderDetail(order.id)}
                    />
                  ))}
                </View>
              ) : (
                <View style={styles.emptyOrders}>
                  <Icon name="receipt-long" size={64} color={colors.gray} />
                  <Text style={styles.emptyOrdersTitle}>No Orders Yet</Text>
                  <Text style={styles.emptyOrdersText}>Start shopping to see your order history here</Text>
                  <TouchableOpacity
                    style={styles.shopButton}
                    onPress={() => navigation.navigate('Shop')}
                  >
                    <Text style={styles.shopButtonText}>START SHOPPING</Text>
                  </TouchableOpacity>
                </View>
              )}
            </BlurView>

            {/* Admin Access */}
            {user?.isAdmin && (
              <BlurView intensity={80} style={styles.profileSection}>
                <Text style={styles.sectionTitle}>Admin Access</Text>
                <TouchableOpacity
                  style={styles.adminButton}
                  onPress={navigateToAdmin}
                >
                  <Icon name="admin-panel-settings" size={20} color={colors.white} />
                  <Text style={styles.adminButtonText}>ADMIN DASHBOARD</Text>
                </TouchableOpacity>
              </BlurView>
            )}

            {/* Logout */}
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Icon name="logout" size={20} color={colors.white} />
              <Text style={styles.logoutButtonText}>LOGOUT</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  content: {
    paddingTop: 100, // Account for navbar
    paddingHorizontal: spacing.large,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 32,
    color: colors.black,
    letterSpacing: 1,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
  },
  profileContent: {
    gap: 24,
  },
  profileSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 16,
    padding: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.lightGray,
  },
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.black,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.cyan,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  editButtonText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.cyan,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    padding: 20,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  infoLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.black,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.gray,
    flex: 1,
    textAlign: 'right',
  },
  ordersList: {
    gap: 16,
  },
  emptyOrders: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyOrdersTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 20,
    color: colors.black,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyOrdersText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.cyan,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  shopButtonText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.cyan,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  adminButton: {
    backgroundColor: 'rgba(34, 211, 238, 0.1)',
    borderWidth: 1,
    borderColor: colors.cyan,
    borderRadius: 0,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  adminButtonText: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.cyan,
    letterSpacing: 1,
  },
  logoutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: colors.red,
    borderRadius: 0,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  logoutButtonText: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.red,
    letterSpacing: 1,
  },
});