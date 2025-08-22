import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import { colors, fonts, spacing } from '../styles/theme';

export default function OrderCard({ order, onPress }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'processing': return '#0d6efd';
      case 'shipped': return '#198754';
      case 'delivered': return '#20c997';
      case 'cancelled': return '#dc3545';
      default: return colors.gray;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>Order #{order.orderNumber}</Text>
          <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(order.status)}20` }]}>
          <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
            {order.status.toUpperCase()}
          </Text>
        </View>
      </View>
      
      <View style={styles.orderItems}>
        {order.items?.slice(0, 3).map((item, index) => (
          <View key={index} style={styles.orderItem}>
            <Image
              source={{ uri: item.productImage }}
              style={styles.itemImage}
              resizeMode="cover"
            />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.productName}
              </Text>
              <Text style={styles.itemMeta}>
                Qty: {item.quantity} | ₹{Math.round(item.price)}
              </Text>
            </View>
          </View>
        ))}
        {order.items?.length > 3 && (
          <View style={styles.moreItems}>
            <Text style={styles.moreItemsText}>
              +{order.items.length - 3} more items
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.orderFooter}>
        <Text style={styles.orderTotal}>
          Total: ₹{Math.round(order.totalAmount)}
        </Text>
        <View style={styles.orderActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>VIEW DETAILS</Text>
          </TouchableOpacity>
          {order.status === 'delivered' && (
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>WRITE REVIEW</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.black,
    marginBottom: 4,
  },
  orderDate: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.gray,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statusText: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  orderItems: {
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.black,
    marginBottom: 2,
  },
  itemMeta: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.gray,
  },
  moreItems: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  moreItemsText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.gray,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  orderTotal: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.black,
  },
  orderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.cyan,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  actionButtonText: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.cyan,
    letterSpacing: 0.5,
  },
});