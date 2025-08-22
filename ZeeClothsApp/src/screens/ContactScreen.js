import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

import CustomNavbar from '../components/CustomNavbar';
import { colors, fonts, spacing } from '../styles/theme';
import { showToast } from '../utils/toast';

const { width, height } = Dimensions.get('window');

export default function ContactScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
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

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const { name, email, subject, message } = formData;
    
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    // Simulate form submission
    showToast('Thank you for your message! We\'ll get back to you soon.', 'success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <LinearGradient
        colors={['#ffffff', '#ffffff']}
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
        contentContainerStyle={styles.scrollContent}
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
            <Text style={styles.contactTitle}>Get in Touch</Text>
            <Text style={styles.contactDescription}>
              Have questions about our premium menswear collection or need assistance with your order? 
              We're here to help! Reach out to us and we'll get back to you as soon as possible.
            </Text>
            
            <View style={styles.contactInfo}>
              <View style={styles.contactItem}>
                <Icon name="email" size={20} color={colors.cyan} />
                <Text style={styles.contactItemText}>info@zeecloths.com</Text>
              </View>
              <View style={styles.contactItem}>
                <Icon name="phone" size={20} color={colors.cyan} />
                <Text style={styles.contactItemText}>+91 (555) 123-4567</Text>
              </View>
              <View style={styles.contactItem}>
                <Icon name="location-on" size={20} color={colors.cyan} />
                <Text style={styles.contactItemText}>123 Fashion Street, Mumbai, India</Text>
              </View>
            </View>
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <View style={styles.contactForm}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>FULL NAME</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.gray}
                  value={formData.name}
                  onChangeText={(value) => updateFormData('name', value)}
                  autoCapitalize="words"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>EMAIL ADDRESS</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter your email address"
                  placeholderTextColor={colors.gray}
                  value={formData.email}
                  onChangeText={(value) => updateFormData('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>SUBJECT</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="What's this about?"
                  placeholderTextColor={colors.gray}
                  value={formData.subject}
                  onChangeText={(value) => updateFormData('subject', value)}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>MESSAGE</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  placeholder="Tell us how we can help you..."
                  placeholderTextColor={colors.gray}
                  value={formData.message}
                  onChangeText={(value) => updateFormData('message', value)}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
              </View>
              
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>SEND MESSAGE</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  content: {
    flexDirection: width > 768 ? 'row' : 'column',
    alignItems: 'center',
    paddingTop: 120,
    paddingHorizontal: spacing.large,
    gap: 40,
  },
  textContent: {
    flex: 1,
    alignItems: width > 768 ? 'flex-start' : 'center',
  },
  contactTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 36,
    color: colors.black,
    letterSpacing: 1,
    marginBottom: 24,
    textAlign: width > 768 ? 'left' : 'center',
    textTransform: 'uppercase',
  },
  contactDescription: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    color: colors.gray,
    marginBottom: 40,
    textAlign: width > 768 ? 'left' : 'center',
  },
  contactInfo: {
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactItemText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.black,
  },
  formContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 500,
  },
  contactForm: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.lightGray,
    borderRadius: 8,
    padding: 32,
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.black,
    marginBottom: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  formInput: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.lightGray,
    borderRadius: 6,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.black,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: colors.cyan,
    borderWidth: 2,
    borderColor: colors.cyan,
    borderRadius: 6,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.white,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});