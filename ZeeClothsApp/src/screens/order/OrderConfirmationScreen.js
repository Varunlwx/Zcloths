import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import CustomNavbar from '../../components/CustomNavbar';
import { colors, fonts, spacing } from '../../styles/theme';

const { width } = Dimensions.get('window');

export default function OrderConfirmationScreen({ navigation, route }) {
  const { orderId } = route.params;
  const { currentOrder } = useSelector(state => state.orders);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for success icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!currentOrder) {
    return (
      <View style={styles.container}>
        <CustomNavbar navigation={navigation} showBackButton />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading order details...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <LinearGradient
        colors={['#ffffff', '#ffffff']}
        style={styles.background}
      />
      
      <CustomNavbar 
        navigation={navigation} 
        showBackButton
        backgroundColor={colors.white}
        textColor={colors.black}
      />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Order Confirmed!</Text>
            <Text style={styles.confirmationMessage}>
              Thank you for your order. Your order number is{' '}
              <Text style={styles.orderNumber}>#{currentOrder.orderNumber}</Text>
            </Text>
          </View>

          {/* Success Icon */}
          <Animated.View 
            style={[
              styles.successIcon,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <Icon name="check" size={40} color={colors.green} />
          </Animated.View>

          {/* Order Details */}
          <BlurView intensity={80} style={styles.orderDetails}>
            <Text style={styles.sectionTitle}>Order Details</Text>
            <View style={styles.detailGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Order Number</Text>
                <Text style={styles.detailValue}>#{currentOrder.orderNumber}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Order Date</Text>
                <Text style={styles.detailValue}>{formatDate(currentOrder.createdAt)}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Order Status</Text>
                <Text style={styles.detailValue}>{currentOrder.status.toUpperCase()}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Payment Method</Text>
                <Text style={styles.detailValue}>{currentOrder.paymentMethod?.toUpperCase() || 'CARD'}</Text>
              </View>
            </View>
            
            {/* Shipping Address */}
            <View style={styles.addressSection}>
              <Text style={styles.detailLabel}>Shipping Address</Text>
              <Text style={styles.addressText}>
                {currentOrder.shippingAddress || 'Default shipping address'}
              </Text>
            </View>

            {/* Order Items */}
            <View style={styles.orderItems}>
              <Text style={styles.itemsTitle}>Order Items</Text>
              {currentOrder.items?.map((item, index) => (
                <View key={index} style={styles.orderItem}>
                  <Image
                    source={{ uri: item.productImage }}
                    style={styles.itemImage}
                    resizeMode="cover"
                  />
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.productName}</Text>
                    <Text style={styles.itemMeta}>
                      Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                    </Text>
                  </View>
                  <Text style={styles.itemPrice}>₹{Math.round(item.price)}</Text>
                </View>
              ))}
            </View>
          </BlurView>

          {/* Order Summary */}
          <BlurView intensity={80} style={styles.orderSummary}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Amount</Text>
              <Text style={styles.summaryValue}>₹{Math.round(currentOrder.totalAmount)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Order Status</Text>
              <Text style={styles.summaryValue}>{currentOrder.status.toUpperCase()}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Order Number</Text>
              <Text style={styles.summaryValue}>{currentOrder.orderNumber}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Order Date</Text>
              <Text style={styles.summaryValue}>{formatDate(currentOrder.createdAt)}</Text>
            </View>
          </BlurView>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Shop')}
            >
              <Icon name="home" size={16} color={colors.white} />
              <Text style={styles.primaryButtonText}>CONTINUE SHOPPING</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Icon name="person" size={16} color={colors.cyan} />
              <Text style={styles.secondaryButtonText}>VIEW ORDERS</Text>
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
    paddingBottom: 60,
  },
  content: {
    paddingTop: 120,
    paddingHorizontal: spacing.large,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.black,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize: 32,
    color: colors.black,
    letterSpacing: 1,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  confirmationMessage: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 24,
  },
  orderNumber: {
    fontFamily: fonts.semiBold,
    color: colors.cyan,
  },
  successIcon: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 3,
    borderColor: colors.green,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  orderDetails: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 2,
    borderColor: colors.lightGray,
    borderRadius: 8,
    padding: 32,
    width: '100%',
    maxWidth: 600,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 20,
    color: colors.black,
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  detailGrid: {
    gap: 16,
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.black,
  },
  addressSection: {
    marginBottom: 24,
  },
  addressText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.black,
    lineHeight: 20,
    marginTop: 8,
  },
  orderItems: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  itemsTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.black,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.lightGray,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.black,
    marginBottom: 4,
  },
  itemMeta: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemPrice: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.cyan,
  },
  orderSummary: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    padding: 32,
    width: '100%',
    maxWidth: 600,
    marginBottom: 32,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  summaryLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.gray,
  },
  summaryValue: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.black,
  },
  actionButtons: {
    flexDirection: width > 480 ? 'row' : 'column',
    gap: 16,
    width: '100%',
    maxWidth: 600,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.cyan,
    borderWidth: 2,
    borderColor: colors.cyan,
    borderRadius: 0,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.white,
    letterSpacing: 1,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.cyan,
    borderRadius: 0,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryButtonText: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.cyan,
    letterSpacing: 1,
  },
});