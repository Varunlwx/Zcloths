import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { colors, fonts, spacing } from '../styles/theme';

const { width } = Dimensions.get('window');

export default function ProductCard({ product, onPress, onAddToCart, style }) {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image_url || 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg' }}
          style={styles.productImage}
          resizeMode="cover"
        />
        
        {/* Overlay on hover effect */}
        <BlurView intensity={20} style={styles.overlay}>
          <TouchableOpacity style={styles.viewButton} onPress={onPress}>
            <Text style={styles.viewButtonText}>VIEW DETAILS</Text>
          </TouchableOpacity>
        </BlurView>
        
        {/* Product Badge */}
        {product.badge && (
          <View style={styles.productBadge}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.productCategory}>
          {product.category?.name || 'Fashion'}
        </Text>
        <Text style={styles.productPrice}>
          ₹{Math.round(product.price)}
        </Text>
        
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
        >
          <Text style={styles.addToCartText}>ADD TO CART</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 0,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: spacing.medium,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 250,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
  },
  viewButton: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 0,
  },
  viewButtonText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.black,
    letterSpacing: 1,
  },
  productBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.red,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  badgeText: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.white,
    textTransform: 'uppercase',
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.black,
    marginBottom: 4,
    lineHeight: 20,
  },
  productCategory: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  productPrice: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.black,
    marginBottom: 12,
  },
  addToCartButton: {
    backgroundColor: colors.black,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 0,
    alignItems: 'center',
  },
  addToCartText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.white,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});