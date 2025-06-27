import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ViewStyle,
  TextStyle
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';

interface Product {
  name: string;
  brand: string;
  price: number;
  quantity: number;
}

interface Vehicle {
  year: number;
  make: string;
  model: string;
  color: string;
}

interface OrderItemData {
  id: number;
  orderNumber: string;
  date: string;
  time: string;
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled';
  vehicle: Vehicle;
  products: Product[];
  total: number;
  trackingNumber?: string;
}

interface OrderItemProps {
  item: OrderItemData;
  onReorder: (item: OrderItemData) => void;
  onViewDetails: (item: OrderItemData) => void;
  style?: ViewStyle;
}

interface StatusBadgeProps {
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled';
}

// Order Status Badge Component
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'delivered': return Colors.success;
      case 'shipped': return Colors.primary;
      case 'processing': return Colors.warning;
      case 'cancelled': return Colors.error;
      default: return Colors.neutral600;
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'shipped': return 'Shipped';
      case 'processing': return 'Processing';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  return (
    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) + '15' }]}>
      <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
        {getStatusText(status)}
      </Text>
    </View>
  );
};

const OrderItem: React.FC<OrderItemProps> = ({ item, onReorder, onViewDetails, style }) => {
  return (
    <View style={[styles.orderCard, style]}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>Order #{item.orderNumber}</Text>
          <Text style={styles.orderDate}>{item.date} • {item.time}</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>

      <View style={styles.vehicleInfo}>
        <Icon name="car" size={16} color={Colors.primary} />
        <Text style={styles.vehicleText}>
          {item.vehicle.year} {item.vehicle.make} {item.vehicle.model} • {item.vehicle.color}
        </Text>
      </View>

      <View style={styles.orderItems}>
        {item.products.map((product, index) => (
          <View key={index} style={styles.productItem}>
            <View style={styles.productImage}>
              <Icon name="cube-outline" size={24} color={Colors.neutral600} />
            </View>
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productBrand}>{product.brand}</Text>
              <Text style={styles.productPrice}>${product.price} x {product.quantity}</Text>
            </View>
            <Text style={styles.productTotal}>${(product.price * product.quantity).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <View style={styles.orderTotal}>
          <Text style={styles.totalLabel}>Total: </Text>
          <Text style={styles.totalAmount}>${item.total.toFixed(2)}</Text>
        </View>
        <View style={styles.orderActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onViewDetails(item)}
          >
            <Text style={styles.actionButtonText}>View Details</Text>
          </TouchableOpacity>
          {item.status === 'delivered' && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.reorderButton]}
              onPress={() => onReorder(item)}
            >
              <Text style={styles.reorderButtonText}>Reorder</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 4,
  } as TextStyle,
  orderDate: {
    fontSize: 14,
    color: Colors.neutral600,
  } as TextStyle,
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  } as TextStyle,
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.primary + '08',
    borderRadius: 8,
  },
  vehicleText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginLeft: 8,
  } as TextStyle,
  orderItems: {
    marginBottom: 16,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral100,
  },
  productImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.neutral100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 2,
  } as TextStyle,
  productBrand: {
    fontSize: 12,
    color: Colors.neutral600,
    marginBottom: 2,
  } as TextStyle,
  productPrice: {
    fontSize: 12,
    color: Colors.neutral600,
  } as TextStyle,
  productTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral1000,
  } as TextStyle,
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  orderTotal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    color: Colors.neutral600,
  } as TextStyle,
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral1000,
  } as TextStyle,
  orderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  actionButtonText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  } as TextStyle,
  reorderButton: {
    backgroundColor: Colors.primary,
  },
  reorderButtonText: {
    color: Colors.neutral0,
    fontSize: 12,
    fontWeight: '500',
  } as TextStyle,
});

export default OrderItem;