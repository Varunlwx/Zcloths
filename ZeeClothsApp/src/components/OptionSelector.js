import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { colors, fonts, spacing } from '../styles/theme';

export default function OptionSelector({ 
  title, 
  options, 
  selectedOption, 
  onSelect, 
  style 
}) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title.toUpperCase()}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedOption === option && styles.selectedOption
            ]}
            onPress={() => onSelect(option)}
          >
            <Text style={[
              styles.optionText,
              selectedOption === option && styles.selectedOptionText
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.white,
    marginBottom: 12,
    letterSpacing: 1,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 0,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  selectedOption: {
    backgroundColor: 'rgba(34, 211, 238, 0.2)',
    borderColor: colors.cyan,
  },
  optionText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.white,
  },
  selectedOptionText: {
    color: colors.cyan,
  },
});