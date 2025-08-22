import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { loginUser, clearError } from '../../store/slices/authSlice';
import { colors, fonts, spacing } from '../../styles/theme';
import SplineBackground from '../../components/SplineBackground';
import LoadingOverlay from '../../components/LoadingOverlay';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Clear any previous errors
    dispatch(clearError());
    
    // Animate on mount
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
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Login Error', error);
    }
  }, [error]);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await dispatch(loginUser({ username: username.trim(), password })).unwrap();
      // Navigation will be handled by AppNavigator based on auth state
    } catch (err) {
      // Error is handled by the error state
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Background */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#000000']}
        style={styles.background}
      />
      
      <View style={styles.content}>
        {/* Left Side - Login Form */}
        <Animated.View 
          style={[
            styles.loginContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <BlurView intensity={20} style={styles.loginCard}>
            {/* Header */}
            <View style={styles.loginHeader}>
              <Text style={styles.loginTitle}>ZEECLOTHS</Text>
              <Text style={styles.loginSubtitle}>Welcome back. Please login to continue.</Text>
            </View>

            {/* Form */}
            <View style={styles.loginForm}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Username</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter your username"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.formInput, styles.passwordInput]}
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    style={styles.passwordToggle}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Icon
                      name={showPassword ? 'visibility-off' : 'visibility'}
                      size={20}
                      color="rgba(255, 255, 255, 0.6)"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? 'LOGGING IN...' : 'LOGIN'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Demo Info */}
            <View style={styles.demoInfo}>
              <Text style={styles.demoTitle}>Demo Credentials:</Text>
              <Text style={styles.demoText}>
                <Text style={styles.demoBold}>Admin User:</Text> Username: admin | Password: admin123
              </Text>
              <Text style={styles.demoText}>
                <Text style={styles.demoBold}>Normal User:</Text> Username: user | Password: user123
              </Text>
            </View>

            {/* Footer */}
            <View style={styles.loginFooter}>
              <TouchableOpacity onPress={navigateToRegister}>
                <Text style={styles.registerLink}>
                  Don't have an account? Register here
                </Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </Animated.View>

        {/* Right Side - 3D Background */}
        <View style={styles.splineContainer}>
          <SplineBackground />
        </View>
      </View>

      {isLoading && <LoadingOverlay />}
    </KeyboardAvoidingView>
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
    flexDirection: width > 768 ? 'row' : 'column',
  },
  loginContainer: {
    flex: width > 768 ? 1 : 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.large,
    minHeight: width > 768 ? 'auto' : height * 0.6,
  },
  loginCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 20,
    padding: 40,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  loginHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  loginTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 32,
    color: colors.white,
    letterSpacing: 2,
    marginBottom: 8,
  },
  loginSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  loginForm: {
    marginBottom: 30,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.white,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  formInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.white,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    top: 17,
  },
  loginButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.white,
    letterSpacing: 1,
  },
  demoInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  demoTitle: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  demoText: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
  demoBold: {
    fontFamily: fonts.medium,
    color: colors.white,
  },
  loginFooter: {
    alignItems: 'center',
  },
  registerLink: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.cyan,
  },
  splineContainer: {
    flex: width > 768 ? 1 : 0,
    height: width > 768 ? '100%' : height * 0.4,
    backgroundColor: colors.black,
  },
});