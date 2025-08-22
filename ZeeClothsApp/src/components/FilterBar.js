import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { colors, fonts, spacing } from '../styles/theme';

export default function FilterBar({ categories, selectedCategory, onCategorySelect }) {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedCategory === 'all' && styles.activeFilterButton
          ]}
          onPress={() => onCategorySelect('all')}
        >
          <Text style={[
            styles.filterButtonText,
            selectedCategory === 'all' && styles.activeFilterButtonText
          ]}>
            All
          </Text>
        </TouchableOpacity>
        
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.filterButton,
              selectedCategory === category.id && styles.activeFilterButton
            ]}
            onPress={() => onCategorySelect(category.id)}
          >
            <Text style={[
              styles.filterButtonText,
              selectedCategory === category.id && styles.activeFilterButtonText
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    paddingVertical: 16,
  },
  filterContainer: {
    paddingHorizontal: spacing.large,
    gap: 4,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 0,
    marginRight: 4,
  },
  activeFilterButton: {
    backgroundColor: '#e5e7eb',
  },
  filterButtonText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: '#9ca3af',
    textTransform: 'capitalize',
  },
  activeFilterButtonText: {
    fontFamily: fonts.medium,
    color: '#111827',
  },
});