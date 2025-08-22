import React, { useEffect, useRef } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { fetchProducts, fetchCategories } from '../store/slices/productSlice';
import CustomNavbar from '../components/CustomNavbar';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import { colors, fonts, spacing } from '../styles/theme';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { products, categories, featuredProducts, isLoading } = useSelector(state => state.products);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    
    // Animate on mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const navigateToShop = () => {
    navigation.navigate('Shop');
  };

  const navigateToProduct = (productId) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const navigateToCategory = (categoryId) => {
    navigation.navigate('Shop', { categoryId });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <CustomNavbar navigation={navigation} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg' }}
            style={styles.heroBackground}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
            style={styles.heroOverlay}
          />
          
          <Animated.View 
            style={[
              styles.heroContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <Text style={styles.heroText}>
              Experience premium menswear crafted with sustainable materials and minimalist design.
            </Text>
            <TouchableOpacity style={styles.heroButton} onPress={navigateToShop}>
              <Text style={styles.heroButtonText}>EXPLORE COLLECTION</Text>
            </TouchableOpacity>
          </Animated.View>
          
          <View style={styles.bottomWords}>
            <Text style={styles.bottomWord}>Precision.</Text>
            <Text style={styles.bottomWord}>Comfort.</Text>
            <Text style={[styles.bottomWord, styles.accentWord]}>Style.</Text>
          </View>
        </View>

        {/* Discover Section */}
        <View style={styles.discoverSection}>
          <Text style={styles.sectionTitle}>DISCOVER</Text>
          <View style={styles.discoverGrid}>
            {categories.slice(0, 4).map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                onPress={() => navigateToCategory(category.id)}
                style={styles.categoryCard}
              />
            ))}
          </View>
        </View>

        {/* Future Fashion Section */}
        <View style={styles.futureFashionSection}>
          <View style={styles.futureFashionContent}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg' }}
              style={styles.futureFashionImage}
              resizeMode="cover"
            />
            <View style={styles.futureFashionText}>
              <Text style={styles.futureFashionTitle}>FIND YOUR FUTURE FASHION</Text>
              <Text style={styles.futureFashionDescription}>
                Step into tomorrow's style with our cutting-edge collection. Where innovation meets elegance, 
                we craft garments that don't just follow trends—they define them.
              </Text>
              <TouchableOpacity style={styles.futureFashionButton} onPress={navigateToShop}>
                <Text style={styles.futureFashionButtonText}>SHOP NOW</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Featured Section */}
        <View style={styles.featuredSection}>
          <View style={styles.featuredContent}>
            {/* Main Featured Card */}
            <TouchableOpacity 
              style={styles.featuredMainCard}
              onPress={() => navigateToProduct(featuredProducts[0]?.id)}
            >
              <Image
                source={{ uri: featuredProducts[0]?.image_url || 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg' }}
                style={styles.featuredMainImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
                style={styles.featuredMainOverlay}
              />
              <View style={styles.featuredMainContent}>
                <Text style={styles.featuredMainTitle}>FIND YOUR STYLE</Text>
                <Text style={styles.featuredMainDescription}>
                  Discover your unique fashion identity with our curated collection
                </Text>
              </View>
            </TouchableOpacity>

            {/* Side Cards */}
            <View style={styles.featuredSideCards}>
              {featuredProducts.slice(1, 5).map((product, index) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.featuredSideCard}
                  onPress={() => navigateToProduct(product.id)}
                >
                  <Image
                    source={{ uri: product.image_url }}
                    style={styles.featuredSideImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.featuredSideText}>{product.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Brand Text Section */}
        <View style={styles.brandTextSection}>
          <Text style={styles.brandText}>ZEECLOTHS</Text>
        </View>

        {/* Horizontal Cards Section */}
        <View style={styles.horizontalCardsSection}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalCardsContainer}
          >
            {featuredProducts.map((product, index) => (
              <TouchableOpacity
                key={`${product.id}-${index}`}
                style={styles.horizontalCard}
                onPress={() => navigateToProduct(product.id)}
              >
                <Image
                  source={{ uri: product.image_url }}
                  style={styles.horizontalCardImage}
                  resizeMode="cover"
                />
                <View style={styles.horizontalCardContent}>
                  <Text style={styles.horizontalCardTitle}>{product.name}</Text>
                  <Text style={styles.horizontalCardPrice}>₹{Math.round(product.price)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.footerTop}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg' }}
                style={styles.footerImage}
                resizeMode="cover"
              />
              <View style={styles.footerTextContent}>
                <View style={styles.footerBrand}>
                  <Text style={styles.footerTitle}>ZEECLOTHS</Text>
                  <Text style={styles.footerDescription}>
                    Discover your unique fashion identity with our curated collection of premium menswear. 
                    We blend sustainable materials with minimalist design to create timeless pieces.
                  </Text>
                </View>
                <View style={styles.footerLinks}>
                  <View style={styles.footerColumn}>
                    <Text style={styles.footerSubtitle}>QUICK LINKS</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                      <Text style={styles.footerLink}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Shop')}>
                      <Text style={styles.footerLink}>Collection</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('About')}>
                      <Text style={styles.footerLink}>About</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Contact')}>
                      <Text style={styles.footerLink}>Contact</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.footerColumn}>
                    <Text style={styles.footerSubtitle}>CONTACT INFO</Text>
                    <Text style={styles.footerContactText}>Email: info@zeecloths.com</Text>
                    <Text style={styles.footerContactText}>Phone: +1 (555) 123-4567</Text>
                    <Text style={styles.footerContactText}>Address: 123 Fashion St, Style City</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.footerBottom}>
              <View style={styles.socialSection}>
                <Text style={styles.footerSubtitle}>FOLLOW US</Text>
                <View style={styles.socialLinks}>
                  <Text style={styles.socialLink}>Instagram</Text>
                  <Text style={styles.socialLink}>Facebook</Text>
                  <Text style={styles.socialLink}>Twitter</Text>
                </View>
              </View>
              <Text style={styles.copyright}>© 2024 ZEECLOTHS. All rights reserved.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    height: height,
    position: 'relative',
  },
  heroBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  heroContent: {
    position: 'absolute',
    left: '4%',
    bottom: 140,
    maxWidth: 320,
  },
  heroText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    color: colors.white,
    marginBottom: 20,
  },
  heroButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.white,
    letterSpacing: 1,
  },
  bottomWords: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  bottomWord: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: '#dcdcdc',
  },
  accentWord: {
    color: colors.cyan,
  },
  discoverSection: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 60,
    paddingHorizontal: spacing.large,
  },
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 36,
    color: colors.white,
    letterSpacing: 2,
    marginBottom: 40,
    textTransform: 'uppercase',
  },
  discoverGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 20,
  },
  categoryCard: {
    width: (width - 80) / 2,
    height: 280,
    marginBottom: 20,
  },
  futureFashionSection: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 60,
    paddingHorizontal: spacing.large,
  },
  futureFashionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 40,
  },
  futureFashionImage: {
    flex: 1,
    height: 400,
    borderRadius: 0,
  },
  futureFashionText: {
    flex: 1,
  },
  futureFashionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 28,
    color: colors.white,
    letterSpacing: 1,
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  futureFashionDescription: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 30,
  },
  futureFashionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignSelf: 'flex-start',
  },
  futureFashionButtonText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.white,
    letterSpacing: 1,
  },
  featuredSection: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 60,
    paddingHorizontal: spacing.large,
  },
  featuredContent: {
    flexDirection: 'row',
    gap: 20,
  },
  featuredMainCard: {
    flex: 1,
    height: 320,
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  featuredMainImage: {
    width: '100%',
    height: '100%',
  },
  featuredMainOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  featuredMainContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -50 }],
    alignItems: 'center',
    width: 200,
  },
  featuredMainTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.white,
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 8,
  },
  featuredMainDescription: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 18,
  },
  featuredSideCards: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  featuredSideCard: {
    width: (width * 0.5 - 60) / 2,
    height: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  featuredSideImage: {
    width: '100%',
    height: '100%',
  },
  featuredSideText: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.white,
  },
  brandTextSection: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontFamily: fonts.bold,
    fontSize: 48,
    color: colors.white,
    letterSpacing: 8,
    textAlign: 'center',
  },
  horizontalCardsSection: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 40,
  },
  horizontalCardsContainer: {
    paddingHorizontal: spacing.large,
    gap: 20,
  },
  horizontalCard: {
    width: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  horizontalCardImage: {
    width: '100%',
    height: 250,
  },
  horizontalCardContent: {
    padding: 16,
  },
  horizontalCardTitle: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.white,
    marginBottom: 4,
  },
  horizontalCardPrice: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.cyan,
  },
  footer: {
    backgroundColor: colors.black,
    paddingVertical: 60,
    paddingHorizontal: spacing.large,
  },
  footerContent: {
    flex: 1,
  },
  footerTop: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: 40,
  },
  footerImage: {
    flex: 1,
    height: 300,
    borderRadius: 8,
  },
  footerTextContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  footerBrand: {
    marginBottom: 30,
  },
  footerTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 32,
    color: colors.white,
    letterSpacing: 1,
    marginBottom: 16,
  },
  footerDescription: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  footerLinks: {
    flexDirection: 'row',
    gap: 30,
  },
  footerColumn: {
    flex: 1,
  },
  footerSubtitle: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.white,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.cyan,
    paddingBottom: 8,
    alignSelf: 'flex-start',
  },
  footerLink: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
    lineHeight: 20,
  },
  footerContactText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 6,
    lineHeight: 20,
  },
  footerBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    paddingTop: 30,
  },
  socialSection: {
    alignItems: 'flex-start',
  },
  socialLinks: {
    flexDirection: 'row',
    gap: 20,
  },
  socialLink: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.white,
  },
  copyright: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.white,
    textAlign: 'right',
  },
});