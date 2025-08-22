import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { fetchProducts, fetchCategories, searchProducts } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import CustomNavbar from '../components/CustomNavbar';
import ProductCard from '../components/ProductCard';
import FilterBar from '../components/FilterBar';
import SearchBar from '../components/SearchBar';
import { colors, fonts, spacing } from '../styles/theme';
import { showToast } from '../utils/toast';

const { width } = Dimensions.get('window');

export default function ShopScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const { products, categories, isLoading, searchResults } = useSelector(state => state.products);
  
  const [selectedCategory, setSelectedCategory] = useState(route.params?.categoryId || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isSearching, setIsSearching] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    dispatch(fetchProducts({ category: selectedCategory !== 'all' ? selectedCategory : null }));
    dispatch(fetchCategories());
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [selectedCategory]);

  useEffect(() => {
    if (searchQuery.length > 2) {
      setIsSearching(true);
      const timeoutId = setTimeout(() => {
        dispatch(searchProducts(searchQuery));
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery]);

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ 
      product, 
      size: 'M', // Default size
      color: 'Black', // Default color
      quantity: 1 
    }));
    showToast('Product added to cart!', 'success');
  };

  const navigateToProduct = (productId) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const displayProducts = searchQuery.length > 2 ? searchResults : products;

  const renderProduct = ({ item, index }) => (
    <Animated.View
      style={[
        styles.productContainer,
        {
          opacity: fadeAnim,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          }],
        }
      ]}
    >
      <ProductCard
        product={item}
        onPress={() => navigateToProduct(item.id)}
        onAddToCart={() => handleAddToCart(item)}
        style={styles.productCard}
      />
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <CustomNavbar 
        navigation={navigation} 
        backgroundColor={colors.white}
        textColor={colors.black}
      />
      
      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search products..."
        isLoading={isSearching}
      />
      
      {/* Filter Bar */}
      <FilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategoryFilter}
      />
      
      {/* Results Info */}
      <View style={styles.resultsInfo}>
        <Text style={styles.resultsText}>
          Showing {displayProducts.length} products
          {searchQuery.length > 2 && ` for "${searchQuery}"`}
        </Text>
      </View>
      
      {/* Products Grid */}
      <FlatList
        data={displayProducts}
        renderItem={renderProduct}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        numColumns={2}
        contentContainerStyle={styles.productsContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        columnWrapperStyle={styles.productRow}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Icon name="search-off" size={64} color={colors.gray} />
            <Text style={styles.emptyStateTitle}>No Products Found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery.length > 2 
                ? `No results found for "${searchQuery}"`
                : 'No products available in this category'
              }
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  productContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  productCard: {
    flex: 1,
  },
  productRow: {
    justifyContent: 'space-between',
    paddingHorizontal: spacing.medium,
  },
  productsContainer: {
    padding: spacing.medium,
    paddingTop: 0,
  },
  resultsInfo: {
    paddingHorizontal: spacing.large,
    paddingVertical: spacing.medium,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  resultsText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.gray,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.black,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
});