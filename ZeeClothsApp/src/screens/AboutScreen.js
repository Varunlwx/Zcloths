import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import CustomNavbar from '../components/CustomNavbar';
import SplineBackground from '../components/SplineBackground';
import { colors, fonts, spacing } from '../styles/theme';

const { width, height } = Dimensions.get('window');

export default function AboutScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      <LinearGradient
        colors={['#f8f8f8', '#f8f8f8']}
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
      >
        <View style={styles.content}>
          <Animated.View 
            style={[
              styles.textContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <Text style={styles.aboutTitle}>ABOUT ZEECLOTHS</Text>
            <Text style={styles.aboutDescription}>
              We are passionate about creating premium menswear that combines sustainable materials with minimalist design. 
              Our commitment to quality craftsmanship and timeless style defines every piece in our collection.
            </Text>
            
            <View style={styles.featuresGrid}>
              <View style={styles.feature}>
                <Text style={styles.featureTitle}>Sustainable</Text>
                <Text style={styles.featureDescription}>Eco-friendly materials and ethical production</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureTitle}>Minimalist</Text>
                <Text style={styles.featureDescription}>Clean lines and timeless design</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureTitle}>Premium</Text>
                <Text style={styles.featureDescription}>Exceptional quality and craftsmanship</Text>
              </View>
            </View>
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.splineContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }],
              }
            ]}
          >
            <SplineBackground />
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
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
    flexDirection: width > 768 ? 'row' : 'column',
    alignItems: 'center',
    paddingTop: 120,
    paddingHorizontal: spacing.large,
    paddingBottom: 60,
    gap: 40,
  },
  textContent: {
    flex: 1,
    alignItems: width > 768 ? 'flex-start' : 'center',
  },
  aboutTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 36,
    color: colors.black,
    letterSpacing: 1,
    marginBottom: 24,
    textAlign: width > 768 ? 'left' : 'center',
    textTransform: 'uppercase',
  },
  aboutDescription: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    color: colors.gray,
    marginBottom: 40,
    textAlign: width > 768 ? 'left' : 'center',
  },
  featuresGrid: {
    flexDirection: width > 768 ? 'row' : 'column',
    gap: 24,
    width: '100%',
  },
  feature: {
    flex: 1,
    alignItems: width > 768 ? 'flex-start' : 'center',
    padding: 16,
  },
  featureTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.black,
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  featureDescription: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.gray,
    lineHeight: 20,
    textAlign: width > 768 ? 'left' : 'center',
  },
  splineContainer: {
    flex: 1,
    height: 400,
    minHeight: 300,
    borderRadius: 0,
    overflow: 'hidden',
  },
});