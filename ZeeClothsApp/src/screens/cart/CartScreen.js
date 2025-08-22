import React, { useRef, useEffect } from 'react';
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
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { 
  removeFromCart, 
  updateQuantity, 
  clearCart 
} from '../../store/slices/cartSlice';
import { createOrder } from '../../store/slices/orderSlice';
import CustomNavbar from '../../components/CustomNavbar';
import CartItem from '../../components/CartItem';
import { colors, fonts, spacing } from '../../styles/theme';
import { showToast } from '../../utils/toast';

const { width } = Dimensions.get('window');

export default function CartScreen({ navigation }) {
  const dispatch = useDispatch();
  const { items, total } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const { isLoading } = useSelector(state => state.orders);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleRemoveItem = (index) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            dispatch(removeFromCart(index));
            showToast('Item removed from cart', 'info');
          }
        },
      ]
    );
  };

  const handleUpdateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(index);
      return;
    }
    dispatch(updateQuantity({ index, quantity: newQuantity }));
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: () => {
            dispatch(clearCart());
            showToast('Cart cleared', 'info');
          }
        },
      ]
    );
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty');
      return;
    }

    try {
      const orderData = {
        userId: user.id,
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color,
        })),
        totalAmount: total,
        shippingAddress: user.address || 'Default Address',
        paymentMethod: 'card',
      };

      const result = await dispatch(createOrder(orderData)).unwrap();
      
      // Clear cart after successful order
      dispatch(clearCart());
      
      // Navigate to order confirmation
      navigation.navigate('OrderConfirmation', { orderId: result.id });
      
      showToast('Order placed successfully!', 'success');
    } catch (error) {
      Alert.alert('Checkout Error', error || 'Failed to place order');
    }
  };

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.9)']}
          style={styles.background}
        />
        <CustomNavbar 
          navigation={navigation} 
          backgroundColor="transparent"
          textColor={colors.white}
        />
        
        <View style={styles.emptyCart}>
          <Icon name="shopping-cart" size={80} color="rgba(255, 255, 255, 0.3)" />
          <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
          <Text style={styles.emptyCartText}>Add some products to get started</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('Shop')}
          >
            <Text style={styles.shopButtonText}>START SHOPPING</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.9)']}
        style={styles.background}
      />
      
      <CustomNavbar 
        navigation={navigation} 
        backgroundColor="transparent"
        textColor={colors.white}
      />
      
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
          <TouchableOpacity onPress={handleClearCart}>
            <Text style={styles.clearButton}>Clear All</Text>
          </TouchableOpacity>
        </View>

        {/* Cart Items */}
        <ScrollView 
          style={styles.cartItems}
          showsVerticalScrollIndicator={false}
        >
          {items.map((item, index) => (
            <CartItem
              key={`${item.id}-${item.size}-${item.color}-${index}`}
              item={item}
              index={index}
              onRemove={() => handleRemoveItem(index)}
              onUpdateQuantity={(newQuantity) => handleUpdateQuantity(index, newQuantity)}
            />
          ))}
        </ScrollView>

        {/* Footer */}
        <BlurView intensity={20} style={styles.cartFooter}>
          <View style={styles.subtotalContainer}>
            <Text style={styles.subtotalLabel}>Subtotal:</Text>
            <Text style={styles.subtotalAmount}>₹{Math.round(total)}</Text>
          </View>
          
          <View style={styles.cartActions}>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
              disabled={isLoading}
            >
              <Text style={styles.checkoutButtonText}>
                {isLoading ? 'PROCESSING...' : 'CHECKOUT'}
              </Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    paddingTop: 100, // Account for navbar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.large,
    paddingVertical: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 24,
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  clearButton: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.cyan,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cartItems: {
    flex: 1,
    paddingHorizontal: spacing.large,
  },
  cartFooter: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing.large,
  },
  subtotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  subtotalLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.white,
  },
  subtotalAmount: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.cyan,
  },
  cartActions: {
    gap: 12,
  },
  checkoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 0,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.white,
    letterSpacing: 1,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.large,
  },
  emptyCartTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 24,
    color: colors.white,
    marginTop: 24,
    marginBottom: 8,
  },
  emptyCartText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 32,
  },
  shopButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 0,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  shopButtonText: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.white,
    letterSpacing: 1,
  },
});