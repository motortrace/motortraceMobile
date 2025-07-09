import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header'
import Colors from '../constants/colors'
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';
import DetailedBill from './DetailedBill';

interface ServiceItem {
  name: string;
  price: number;
}

interface PaidServiceBillSummaryProps {
  serviceType?: string;
  location?: string;
  date?: string;
  time?: string;
  garageName?: string;
  services?: ServiceItem[];
  cgst?: number;
  sgst?: number;
  discount?: number;
  onViewDetailedBill?: () => void;
  onContinue?: () => void;
}

const PaidServiceBillSummary: React.FC<PaidServiceBillSummaryProps> = ({
  serviceType = "Turbo Tune-Up",
  location = "40B-800 Lpevin City United",
  date = "Mon, 10 Feb",
  time = "10:00 AM",
  garageName = "Spring Car Garage",
  services = [
    { name: "AC Repair", price: 20.00 },
    { name: "Wheel Care", price: 45.00 },
    { name: "Oil Change", price: 30.00 },
    { name: "Brake Inspection", price: 25.00 },
    { name: "Battery Check", price: 15.00 },
    { name: "Tire Rotation", price: 20.00 },
    { name: "Engine Diagnostic", price: 40.00 },
  ],
  cgst = 2.00,
  sgst = 2.00,
  discount = 5.00,
  onViewDetailedBill,
  onContinue,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const subtotal = services.reduce((sum, service) => sum + service.price, 0);
  const totalTax = cgst + sgst;
  const finalTotal = subtotal + totalTax - discount;

  // Show only first 3 services in summary
  const summaryServices = services.slice(0, 3);
  const hasMoreServices = services.length > 3;

  return (
    <View style={styles.container}>
      <Header 
        icon="back"
        name="Jhon"
        image=""
        onIconPress={() => navigation.navigate('GarageHistory')}
      />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Service Info */}
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceType}>{serviceType}</Text>
          <Text style={styles.location}>{location}</Text>
          <Text style={styles.openStatus}>📍 Open</Text>
          
          <View style={styles.dateTimeRow}>
            <View style={styles.dateTimeItem}>
              <Text style={styles.dateTimeLabel}>Date & Time</Text>
              <Text style={styles.dateTimeValue}>{date} - {time}</Text>
            </View>
          </View>
          
          <Text style={styles.garageName}>{garageName}</Text>
        </View>

        {/* Services & Items Section */}
        <View style={styles.servicesContainer}>
          {/* Services Section */}
          <View style={styles.serviceSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.iconContainer}>
                <Icon name="construct-outline" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.sectionTitle}>Services</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{services.length}</Text>
              </View>
            </View>
            
            {summaryServices.map((service, index) => (
              <View key={`service-${index}`} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <View style={styles.itemIcon}>
                    <Icon name="checkmark-circle" size={16} color={Colors.success} />
                  </View>
                  <Text style={styles.itemName}>{service.name}</Text>
                </View>
                <Text style={styles.itemPrice}>${service.price.toFixed(2)}</Text>
              </View>
            ))}
          </View>

          {/* Items Used Section */}
          <View style={styles.itemsSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.iconContainer}>
                <Icon name="cube-outline" size={20} color={Colors.warning} />
              </View>
              <Text style={styles.sectionTitle}>Items Used</Text>
              <View style={[styles.badge, styles.itemsBadge]}>
                <Text style={styles.badgeText}>{services.length}</Text>
              </View>
            </View>
            
            {summaryServices.map((item, index) => (
              <View key={`item-${index}`} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <View style={[styles.itemIcon, styles.itemsIcon]}>
                    <Icon name="cube" size={16} color={Colors.warning} />
                  </View>
                  <Text style={styles.itemName}>{item.name}</Text>
                </View>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
              </View>
            ))}
          </View>

          {/* View More Button */}
          {hasMoreServices && (
            <TouchableOpacity 
              style={styles.viewDetailedButton}
              onPress={() => navigation.navigate('DetailedBill')}
            >
              <View style={styles.viewDetailedContent}>
                <Icon name="receipt-outline" size={20} color={Colors.primary} />
                <Text style={styles.viewDetailedText}>
                  View Detailed Bill
                </Text>
                <View style={styles.moreItemsBadge}>
                  <Text style={styles.moreItemsText}>+{(services.length - 2) * 2}</Text>
                </View>
              </View>
              <Icon name="chevron-forward" size={20} color={Colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Billing Summary */}
        <View style={styles.billingSummary}>
          <View style={styles.billingSummaryHeader}>
            <Icon name="calculator-outline" size={20} color={Colors.Purple} />
            <Text style={styles.billingSummaryTitle}>Bill Summary</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service Charges</Text>
            <Text style={styles.summaryValue}>${cgst.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Items ({services.length * 2})</Text>
            <Text style={styles.summaryValue}>${(subtotal + totalTax).toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.discountLabel}>
              <Icon name="pricetag" size={14} color={Colors.success} /> Coupon Discount
            </Text>
            <Text style={styles.discountValue}>-${discount.toFixed(2)}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Final Total</Text>
            <Text style={styles.totalValue}>${finalTotal.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primarybg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: Colors.neutral0,
  },
  time: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral600,
  },
  summary: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral600,
  },
  serviceInfo: {
    backgroundColor: Colors.neutral0,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral50,
  },
  serviceType: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral600,
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: Colors.neutral400,
    marginBottom: 8,
  },
  openStatus: {
    fontSize: 14,
    color: Colors.success,
    marginBottom: 16,
  },
  dateTimeRow: {
    marginBottom: 16,
  },
  dateTimeItem: {
    backgroundColor: Colors.neutral50,
    padding: 12,
    borderRadius: 8,
  },
  dateTimeLabel: {
    fontSize: 12,
    color: Colors.neutral400,
    marginBottom: 4,
  },
  dateTimeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral600,
  },
  garageName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral600,
  },
  serviceList: {
    backgroundColor: Colors.neutral0,
    padding: 20,
    marginTop: 8,
  },
  serviceListTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral600,
    marginBottom: 16,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral50,
  },
  serviceName: {
    fontSize: 16,
    color: Colors.neutral600,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral600,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginTop: 8,
  },
  viewMoreText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  // New improved styles
  servicesContainer: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: Colors.neutral0,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.neutral1000,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  serviceSection: {
    marginBottom: 24,
  },
  itemsSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.neutral50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral600,
    flex: 1,
  },
  badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  itemsBadge: {
    backgroundColor: Colors.warning,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.neutral0,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral50,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.neutral50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemsIcon: {
    backgroundColor: '#FEF3C7',
  },
  itemName: {
    fontSize: 16,
    color: Colors.neutral600,
    flex: 1,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral600,
  },
  viewDetailedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.neutral50,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.neutral50,
  },
  viewDetailedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  viewDetailedText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
  },
  moreItemsBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  moreItemsText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.neutral0,
  },
  bottomSection: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 16,
  },
  billingSummary: {
    backgroundColor: Colors.neutral0,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.neutral1000,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 40,
  },
  billingSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  billingSummaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral600,
    marginLeft: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color:Colors.neutral400,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral600,
  },
  discountLabel: {
    fontSize: 14,
    color: Colors.success,
  },
  discountValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutral0,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral600,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral600,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral0,
    marginRight: 8,
  },
});

export default PaidServiceBillSummary;