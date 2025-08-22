import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Icon from 'react-native-vector-icons/MaterialIcons';

import CustomNavbar from '../../components/CustomNavbar';
import { colors, fonts, spacing } from '../../styles/theme';

const { width } = Dimensions.get('window');

export default function AdminDashboardScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const statsData = [
    { title: 'Total Orders', value: '156', icon: 'shopping-bag', trend: '+12%', color: colors.cyan },
    { title: 'Total Revenue', value: '₹45,230', icon: 'attach-money', trend: '+8%', color: colors.green },
    { title: 'Total Customers', value: '89', icon: 'people', trend: '+15%', color: colors.blue },
    { title: 'Total Products', value: '24', icon: 'inventory', trend: '-3%', color: colors.yellow },
  ];

  const quickActions = [
    { title: 'Manage Products', description: 'Add, edit, or remove products', icon: 'inventory', screen: 'AdminProducts' },
    { title: 'View Orders', description: 'Process and manage orders', icon: 'shopping-bag', screen: 'AdminOrders' },
    { title: 'Manage Users', description: 'View and manage customers', icon: 'people', screen: 'AdminUsers' },
    { title: 'Analytics', description: 'View detailed reports', icon: 'analytics', screen: 'AdminAnalytics' },
  ];

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
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Admin Dashboard</Text>
            <Text style={styles.headerSubtitle}>Welcome back! Here's an overview of your store's performance.</Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {statsData.map((stat, index) => (
              <BlurView key={index} intensity={20} style={styles.statCard}>
                <View style={styles.statHeader}>
                  <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                    <Icon name={stat.icon} size={24} color={stat.color} />
                  </View>
                  <View style={styles.statTrend}>
                    <Icon 
                      name={stat.trend.startsWith('+') ? 'trending-up' : 'trending-down'} 
                      size={16} 
                      color={stat.trend.startsWith('+') ? colors.green : colors.red} 
                    />
                    <Text style={[
                      styles.trendText,
                      { color: stat.trend.startsWith('+') ? colors.green : colors.red }
                    ]}>
                      {stat.trend}
                    </Text>
                  </View>
                </View>
                <Text style={styles.statNumber}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.title.toUpperCase()}</Text>
              </BlurView>
            ))}
          </View>

          {/* Charts Section */}
          <View style={styles.chartsSection}>
            <BlurView intensity={20} style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>SALES OVERVIEW</Text>
                <View style={styles.chartActions}>
                  <TouchableOpacity style={[styles.chartButton, styles.activeChartButton]}>
                    <Text style={styles.activeChartButtonText}>7 DAYS</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.chartButton}>
                    <Text style={styles.chartButtonText}>30 DAYS</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.chartButton}>
                    <Text style={styles.chartButtonText}>90 DAYS</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.chartContainer}>
                <Text style={styles.chartPlaceholder}>Chart will be displayed here</Text>
              </View>
            </BlurView>

            <BlurView intensity={20} style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <Text style={styles.activityTitle}>RECENT ACTIVITY</Text>
                <TouchableOpacity>
                  <Text style={styles.viewAllText}>VIEW ALL</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.activityList}>
                {[
                  { text: 'New order #1234 received', time: '2 minutes ago', icon: 'shopping-bag' },
                  { text: 'New customer registered', time: '15 minutes ago', icon: 'person-add' },
                  { text: 'Product inventory updated', time: '1 hour ago', icon: 'inventory' },
                  { text: 'Daily sales report generated', time: '2 hours ago', icon: 'assessment' },
                ].map((activity, index) => (
                  <View key={index} style={styles.activityItem}>
                    <View style={styles.activityIcon}>
                      <Icon name={activity.icon} size={16} color={colors.cyan} />
                    </View>
                    <View style={styles.activityContent}>
                      <Text style={styles.activityText}>{activity.text}</Text>
                      <Text style={styles.activityTime}>{activity.time.toUpperCase()}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </BlurView>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                onPress={() => navigation.navigate(action.screen)}
              >
                <View style={styles.actionIcon}>
                  <Icon name={action.icon} size={24} color={colors.cyan} />
                </View>
                <Text style={styles.actionTitle}>{action.title.toUpperCase()}</Text>
                <Text style={styles.actionDescription}>{action.description}</Text>
              </TouchableOpacity>
            ))}
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
  scrollContent: {
    paddingBottom: 60,
  },
  content: {
    paddingTop: 120,
    paddingHorizontal: spacing.large,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize: 32,
    color: colors.white,
    letterSpacing: 1,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  headerSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 40,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 0,
    padding: 24,
    width: (width - 80) / 2,
    minHeight: 140,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.cyan,
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontFamily: fonts.medium,
    fontSize: 12,
  },
  statNumber: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.white,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 0.5,
  },
  chartsSection: {
    flexDirection: width > 768 ? 'row' : 'column',
    gap: 24,
    marginBottom: 40,
  },
  chartCard: {
    flex: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 0,
    padding: 24,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.white,
    letterSpacing: 1,
  },
  chartActions: {
    flexDirection: 'row',
    gap: 8,
  },
  chartButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 0,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  activeChartButton: {
    backgroundColor: 'rgba(34, 211, 238, 0.2)',
    borderColor: colors.cyan,
  },
  chartButtonText: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.white,
    letterSpacing: 0.5,
  },
  activeChartButtonText: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.cyan,
    letterSpacing: 0.5,
  },
  chartContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartPlaceholder: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  activityCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 0,
    padding: 24,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  activityTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.white,
    letterSpacing: 1,
  },
  viewAllText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.cyan,
    letterSpacing: 0.5,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  activityIcon: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(34, 211, 238, 0.2)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cyan,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.white,
    marginBottom: 2,
  },
  activityTime: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.5,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 0,
    padding: 20,
    width: (width - 80) / 2,
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(34, 211, 238, 0.2)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.cyan,
    marginBottom: 12,
  },
  actionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  actionDescription: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 16,
  },
});