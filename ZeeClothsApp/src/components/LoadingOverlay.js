import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import { BlurView } from 'expo-blur';

import { colors, fonts } from '../styles/theme';

export default function LoadingOverlay({ message = 'Loading...' }) {
  return (
    <View style={styles.container}>
      <BlurView intensity={20} style={styles.overlay}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color={colors.cyan} />
          <Text style={styles.message}>{message}</Text>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 16,
  },
  message: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.white,
  },
});