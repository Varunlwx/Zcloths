import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
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

import { fetchProductById } from '../../store/slices/productSlice';
import { addToCart } from '../../store/slices/cartSlice';
import CustomNavbar from '../../components/CustomNavbar';
import QuantitySelector from '../../components/QuantitySelector';
import OptionSelector from '../../components/OptionSelector';
import { colors, fonts, spacing } from '../../styles/theme';
import { showToast } from '../../utils/toast';

const { width, height } = Dimensions.get('window');

export default function ProductDetailScreen({ navigation, route }) {
  const { productId } = route.params;
  const dispatch = useDispatch();
  const { currentProduct, isLoading } = useSelector(state => state.products);
  
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    dispatch(fetchProductById(productId));
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [productId]);

  useEffect(() => {
    if (currentProduct) {
      // Auto-select first available options
      if (currentProduct.sizes && currentProduct.sizes.length > 0) {
        setSelectedSize(currentProduct.sizes[0]);
      }
      if (currentProduct.colors && currentProduct.colors.length > 0) {
        setSelectedColor(currentProduct.colors[0]);
      }
    }
  }, [currentProduct]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      Alert.alert('Selection Required', 'Please select size and color');
      return;
    }

    dispatch(addToCart({
      product: currentProduct,
      size: selectedSize,
      color: selectedColor,
      quantity,
    }));
    
    showToast('Added to cart!', 'success');
  };

  const handleAddToWishlist = () => {
    showToast('Added to wishlist!', 'success');
  };

  if (isLoading || !currentProduct) {
    return (
      <View style={styles.loadingContainer}>
        <CustomNavbar navigation={navigation} showBackButton />
        <View style={styles.loadingContent}>
          <Icon name="hourglass-empty" size={48} color={colors.cyan} />
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      </View>
    );
  }

  const productImages = [
    currentProduct.image_url,
    ...(currentProduct.additional_images || [])
  ].filter(Boolean);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.9)']}
        style={styles.background}
      />
      
      <CustomNavbar 
        navigation={navigation} 
        showBackButton 
        backgroundColor="transparent"
        textColor={colors.white}
      />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {/* Product Images */}
          <View style={styles.productImages}>
            <View style={styles.mainImageContainer}>
              <Image
                source={{ uri: productImages[currentImageIndex] }}
                style={styles.mainImage}
                resizeMode="cover"
              />
            </View>
            
            {productImages.length > 1 && (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.thumbnailContainer}
                contentContainerStyle={styles.thumbnailContent}
              >
                {productImages.map((image, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.thumbnail,
                      currentImageIndex === index && styles.activeThumbnail
                    ]}
                    onPress={() => setCurrentImageIndex(index)}
                  >
                    <Image
                      source={{ uri: image }}
                      style={styles.thumbnailImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Product Info */}
          <View style={styles.productInfo}>
            <Text style={styles.productTitle}>{currentProduct.name}</Text>
            <Text style={styles.productPrice}>₹{Math.round(currentProduct.price)}</Text>
            <Text style={styles.productDescription}>{currentProduct.description}</Text>

            {/* Size Selection */}
            {currentProduct.sizes && currentProduct.sizes.length > 0 && (
              <OptionSelector
                title="Size"
                options={currentProduct.sizes}
                selectedOption={selectedSize}
                onSelect={setSelectedSize}
                style={styles.optionSelector}
              />
            )}

            {/* Color Selection */}
            {currentProduct.colors && currentProduct.colors.length > 0 && (
              <OptionSelector
                title="Color"
                options={currentProduct.colors}
                selectedOption={selectedColor}
                onSelect={setSelectedColor}
                style={styles.optionSelector}
              />
            )}

            {/* Quantity Selector */}
            <QuantitySelector
              quantity={quantity}
              onQuantityChange={setQuantity}
              style={styles.quantitySelector}
            />

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={handleAddToCart}
              >
                <Icon name="shopping-cart" size={20} color={colors.white} />
                <Text style={styles.addToCartText}>ADD TO CART</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.wishlistButton}
                onPress={handleAddToWishlist}
              >
                <Icon name="favorite-border" size={20} color={colors.white} />
              </TouchableOpacity>
            </View>

            {/* Product Details */}
            <BlurView intensity={20} style={styles.productDetails}>
              <Text style={styles.detailsTitle}>Product Details</Text>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Category</Text>
                <Text style={styles.detailValue}>{currentProduct.category?.name || 'Fashion'}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Material</Text>
                <Text style={styles.detailValue}>Premium Cotton</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Care Instructions</Text>
                <Text style={styles.detailValue}>Machine wash cold</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>SKU</Text>
                <Text style={styles.detailValue}>ZEE-{currentProduct.id}</Text>
              </View>
            </BlurView>
          </View>
        </Animated.View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.large,
    paddingTop: 100, // Account for navbar
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.black,
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.white,
    marginTop: 16,
  },
  productImages: {
    marginBottom: 30,
  },
  mainImageContainer: {
    width: '100%',
    height: 400,
    borderRadius: 0,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailContainer: {
    marginTop: 16,
  },
  thumbnailContent: {
    gap: 12,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 0,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeThumbnail: {
    borderColor: colors.cyan,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 28,
    color: colors.white,
    letterSpacing: 1,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  productPrice: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.cyan,
    marginBottom: 20,
  },
  productDescription: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 30,
  },
  optionSelector: {
    marginBottom: 24,
  },
  quantitySelector: {
    marginBottom: 30,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 30,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 0,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addToCartText: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.white,
    letterSpacing: 1,
  },
  wishlistButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 0,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productDetails: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 0,
    padding: 24,
  },
  detailsTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.white,
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  detailLabel: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  detailValue: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.white,
  },
});