import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { colors, fonts, spacing } from '../styles/theme';

export default function CartItem({ item, index, onRemove, onUpdateQuantity }) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: item.image }}
        style={styles.itemImage}
        resizeMode="cover"
      />
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.name}
        </Text>
        
        <View style={styles.itemVariants}>
          {item.size && (
            <View style={styles.variant}>
              <Text style={styles.variantText}>Size: {item.size}</Text>
            </View>
          )}
          {item.color && (
            <View style={styles.variant}>
              <Text style={styles.variantText}>Color: {item.color}</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.itemPrice}>₹{Math.round(item.price)}</Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => onUpdateQuantity(item.quantity - 1)}
          >
            <Icon name="remove" size={16} color={colors.white} />
          </TouchableOpacity>
          
          <Text style={styles.quantity}>{item.quantity}</Text>
          
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => onUpdateQuantity(item.quantity + 1)}
          >
            <Icon name="add" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
        <Icon name="close" size={20} color="rgba(255, 255, 255, 0.6)" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.white,
    marginBottom: 8,
    lineHeight: 20,
  },
  itemVariants: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  variant: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  variantText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  itemPrice: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.cyan,
    marginBottom: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.white,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 6,
    borderRadius: 6,
  },
});