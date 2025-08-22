import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, fonts } from '../styles/theme';

export default function CategoryCard({ category, onPress, style }) {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <Image
        source={{ 
          uri: category.image_url || 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg' 
        }}
        style={styles.categoryImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.overlay}
      />
      <Text style={styles.categoryLabel}>{category.name.toUpperCase()}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 0,
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  categoryLabel: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.white,
    letterSpacing: 1,
  },
});