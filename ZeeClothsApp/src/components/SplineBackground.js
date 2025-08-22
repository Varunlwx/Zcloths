import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '../styles/theme';

const { width, height } = Dimensions.get('window');

export default function SplineBackground() {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Continuous rotation animation
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );

    // Floating animation
    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    // Scale animation
    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    );

    rotateAnimation.start();
    floatAnimation.start();
    scaleAnimation.start();

    return () => {
      rotateAnimation.stop();
      floatAnimation.stop();
      scaleAnimation.stop();
    };
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f3460', '#533483', '#16537e']}
        style={styles.background}
      />
      
      {/* Animated 3D-like shapes */}
      <Animated.View
        style={[
          styles.shape1,
          {
            transform: [
              { rotate },
              { scale: scaleAnim },
              { translateY },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(34, 211, 238, 0.3)', 'rgba(167, 139, 250, 0.3)']}
          style={styles.shapeGradient}
        />
      </Animated.View>
      
      <Animated.View
        style={[
          styles.shape2,
          {
            transform: [
              { rotate: rotate },
              { scale: scaleAnim },
              { translateY: floatAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 15],
              }) },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(244, 114, 182, 0.3)', 'rgba(34, 211, 238, 0.3)']}
          style={styles.shapeGradient}
        />
      </Animated.View>
      
      <Animated.View
        style={[
          styles.shape3,
          {
            transform: [
              { rotate: rotate },
              { scale: scaleAnim },
              { translateY: floatAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -10],
              }) },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(167, 139, 250, 0.3)', 'rgba(244, 114, 182, 0.3)']}
          style={styles.shapeGradient}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  shape1: {
    position: 'absolute',
    width: 200,
    height: 200,
    top: '20%',
    left: '20%',
    borderRadius: 100,
  },
  shape2: {
    position: 'absolute',
    width: 150,
    height: 150,
    top: '60%',
    right: '15%',
    borderRadius: 75,
  },
  shape3: {
    position: 'absolute',
    width: 120,
    height: 120,
    top: '40%',
    left: '60%',
    borderRadius: 60,
  },
  shapeGradient: {
    flex: 1,
    borderRadius: 100,
  },
});