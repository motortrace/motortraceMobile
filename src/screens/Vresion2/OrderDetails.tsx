import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
import Colors from '../../constants/colors';
import BorderButton from '../../components/BorderButton';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';

const orderData = {
  id: 1,
  orderNumber: 'ORD-2024-001234',
  date: 'March 15, 2024',
  time: '2:30 PM',
  status: 'delivered',
  vehicle: {
    year: 2022,
    make: 'Toyota',
    model: 'Camry',
    color: 'Silver',
    vin: '1HGBH41JXMN109186'
  },
  products: [
    {
      name: 'Premium Oil Filter',
      brand: 'AutoMax',
      price: 29.99,
      quantity: 2,
      sku: 'OF-2024-001'
    },
    {
      name: 'Synthetic Motor Oil 5W-30',
      brand: 'TechLube',
      price: 45.99,
      quantity: 1,
      sku: 'MO-5W30-001'
    }
  ],
  total: 105.97,
  subtotal: 89.97,
  tax: 8.00,
  shipping: 8.00,
  trackingNumber: 'TRK123456789',
  estimatedDelivery: 'March 18, 2024',
  shippingAddress: {
    name: 'John Doe',
    street: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    phone: '(555) 123-4567'
  },
  paymentMethod: {
    type: 'card',
    last4: '4242',
    brand: 'Visa'
  },
  orderNotes: 'Please leave package at front door if no one is home.'
};

const OrderDetailsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [expandedSection, setExpandedSection] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return Colors.success;
      case 'shipped': return Colors.primary;
      case 'processing': return Colors.warning;
      case 'cancelled': return Colors.warning;
      default: return Colors.neutral600;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'shipped': return 'Shipped';
      case 'processing': return 'Processing';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Order #${orderData.orderNumber} - Total: $${orderData.total.toFixed(2)}`,
        title: 'Order Details',
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleTrackOrder = () => {
    Alert.alert('Track Order', `Tracking: ${orderData.trackingNumber}`);
  };

  const handleReorder = () => {
    Alert.alert('Reorder', 'Items added to cart!');
  };

  const handleContactSupport = () => {
    Alert.alert('Contact Support', 'Support will contact you soon.');
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const timelineSteps = [
    { key: 'processing', label: 'Order Confirmed', icon: 'checkmark-circle', completed: true },
    { key: 'shipped', label: 'Shipped', icon: 'car', completed: ['shipped', 'delivered'].includes(orderData.status) },
    { key: 'delivered', label: 'Delivered', icon: 'home', completed: orderData.status === 'delivered' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon="back"
        name="John Doe"
        image=""
        onIconPress={() => navigation.navigate('PurchaseHistory')}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.section}>
          <View style={styles.orderSummaryHeader}>
            <View>
              <Text style={styles.orderNumber}>#{orderData.orderNumber}</Text>
              <Text style={styles.orderDate}>{orderData.date} at {orderData.time}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(orderData.status) + '15' }]}>
              <Icon 
                name={orderData.status === 'delivered' ? 'checkmark-circle' : orderData.status === 'shipped' ? 'car' : 'time'} 
                size={16} 
                color={getStatusColor(orderData.status)} 
                style={styles.statusIcon}
              />
              <Text style={[styles.statusText, { color: getStatusColor(orderData.status) }]}>
                {getStatusText(orderData.status)}
              </Text>
            </View>
          </View>
        </View>

        {/* Order Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Progress</Text>
          {orderData.estimatedDelivery && orderData.status !== 'delivered' && (
            <Text style={styles.estimatedDelivery}>Estimated Delivery: {orderData.estimatedDelivery}</Text>
          )}
          <View style={styles.timeline}>
            {timelineSteps.map((step, index) => (
              <View key={step.key} style={styles.timelineStep}>
                <View style={styles.timelineIconContainer}>
                  <View style={[
                    styles.timelineIcon,
                    { backgroundColor: step.completed ? Colors.primary : Colors.neutral200 }
                  ]}>
                    <Icon 
                      name={step.icon} 
                      size={16} 
                      color={step.completed ? Colors.neutral0 : Colors.neutral600} 
                    />
                  </View>
                  {index < timelineSteps.length - 1 && (
                    <View style={[
                      styles.timelineLine,
                      { backgroundColor: step.completed ? Colors.primary : Colors.neutral200 }
                    ]} />
                  )}
                </View>
                <Text style={[
                  styles.timelineLabel,
                  { color: step.completed ? Colors.neutral1000 : Colors.neutral600 }
                ]}>
                  {step.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Vehicle Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Information</Text>
          <View style={styles.vehicleInfo}>
            <Icon name="car" size={20} color={Colors.primary} />
            <View style={styles.vehicleDetails}>
              <Text style={styles.vehicleText}>
                {orderData.vehicle.year} {orderData.vehicle.make} {orderData.vehicle.model}
              </Text>
              <Text style={styles.vehicleSubText}>Color: {orderData.vehicle.color}</Text>
              <Text style={styles.vehicleSubText}>VIN: {orderData.vehicle.vin}</Text>
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('items')}
          >
            <Text style={styles.sectionTitle}>Order Items ({orderData.products.length})</Text>
            <Icon 
              name={expandedSection === 'items' ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={Colors.neutral600} 
            />
          </TouchableOpacity>
          
          {(expandedSection === 'items' || expandedSection === null) && (
            <View style={styles.itemsList}>
              {orderData.products.map((product, index) => (
                <View key={index} style={styles.productItem}>
                  <View style={styles.productImage}>
                    <Icon name="cube-outline" size={24} color={Colors.neutral600} />
                  </View>
                  <View style={styles.productDetails}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productBrand}>{product.brand}</Text>
                    <Text style={styles.productSku}>SKU: {product.sku}</Text>
                    <Text style={styles.productPrice}>${product.price.toFixed(2)} × {product.quantity}</Text>
                  </View>
                  <Text style={styles.productTotal}>
                    ${(product.price * product.quantity).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${orderData.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>
              {orderData.shipping === 0 ? 'Free' : `$${orderData.shipping.toFixed(2)}`}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>${orderData.tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${orderData.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Shipping Address */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('shipping')}
          >
            <Text style={styles.sectionTitle}>Shipping Address</Text>
            <Icon 
              name={expandedSection === 'shipping' ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={Colors.neutral600} 
            />
          </TouchableOpacity>
          
          {(expandedSection === 'shipping' || expandedSection === null) && (
            <View style={styles.addressContainer}>
              <Text style={styles.addressName}>{orderData.shippingAddress.name}</Text>
              <Text style={styles.addressText}>{orderData.shippingAddress.street}</Text>
              <Text style={styles.addressText}>
                {orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.zipCode}
              </Text>
              <Text style={styles.addressText}>{orderData.shippingAddress.phone}</Text>
            </View>
          )}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentMethod}>
            <Icon name="card-outline" size={20} color={Colors.neutral600} />
            <Text style={styles.paymentText}>
              {orderData.paymentMethod.brand} ending in {orderData.paymentMethod.last4}
            </Text>
          </View>
        </View>

        {/* Order Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Notes</Text>
          <Text style={styles.orderNotes}>{orderData.orderNotes}</Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>

        <BorderButton 
          label="Reorder" 
          onPress={handleReorder} 
          style={styles.reorderButton} 
          textStyle={styles.reorderButtonText}
          icon= "refresh"
        />

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral50,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: Colors.neutral0,
    marginBottom: 8,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 12,
  },
  orderSummaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral1000,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 16,
    color: Colors.neutral600,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  estimatedDelivery: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginBottom: 16,
  },
  timeline: {
    marginTop: 8,
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  timelineIconContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineLine: {
    width: 2,
    height: 24,
    marginTop: 4,
  },
  timelineLabel: {
    fontSize: 16,
    fontWeight: '500',
    paddingTop: 6,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.primary + '08',
    borderRadius: 8,
  },
  vehicleDetails: {
    marginLeft: 12,
    flex: 1,
  },
  vehicleText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 4,
  },
  vehicleSubText: {
    fontSize: 14,
    color: Colors.primary,
    opacity: 0.8,
  },
  itemsList: {
    marginTop: 8,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral100,
  },
  productImage: {
    width: 48,
    height: 48,
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
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 2,
  },
  productBrand: {
    fontSize: 14,
    color: Colors.neutral600,
    marginBottom: 2,
  },
  productSku: {
    fontSize: 12,
    color: Colors.neutral500,
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  productTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: Colors.neutral600,
  },
  summaryValue: {
    fontSize: 16,
    color: Colors.neutral1000,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral1000,
  },
  addressContainer: {
    marginTop: 8,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: Colors.neutral600,
    marginBottom: 2,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    fontSize: 16,
    color: Colors.neutral1000,
    marginLeft: 8,
  },
  orderNotes: {
    fontSize: 14,
    color: Colors.neutral600,
    lineHeight: 20,
  },
  actionContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.neutral0,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
    gap: 8,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  reorderButton: {
    backgroundColor: Colors.neutral0,
    width: '100%',
  },
  reorderButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrderDetailsScreen;