import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors'
import Header from '../components/Header'
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';

interface ServiceItem {
  name: string;
  price: number;
}

interface DetailedBillProps {
  serviceType?: string;
  location?: string;
  date?: string;
  time?: string;
  garageName?: string;
  services?: ServiceItem[];
  cgst?: number;
  sgst?: number;
  discount?: number;
  onClose?: () => void;
  onShare?: () => void;
}

const DetailedBill: React.FC<DetailedBillProps> = ({
  serviceType = "Turbo Tune-Up",
  location = "40B-800 Lpevin City United",
  date = "Mon, 10 Feb",
  time = "10:00 AM",
  garageName = "Spring Car Garage",
  services = [
    { name: "AC Repair", price: 25.00 },
    { name: "Wheel Care", price: 50.00 },
    { name: "Oil Change", price: 30.00 },
    { name: "Brake Inspection", price: 25.00 },
    { name: "Battery Check", price: 15.00 },
    { name: "Tire Rotation", price: 20.00 },
    { name: "Engine Diagnostic", price: 40.00 },
  ],
  cgst = 2.00,
  sgst = 2.00,
  discount = 5.00,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const subtotal = services.reduce((sum, service) => sum + service.price, 0);
  const totalTax = cgst + sgst;
  const finalTotal = subtotal + totalTax - discount;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.neutral0} />

      <Header 
        icon="back"
        name="Jhon"
        image=""
        onIconPress={() => navigation.navigate('PaidServiceBillSummary')}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Service Info */}
        <View style={styles.serviceInfoCard}>
          <Text style={styles.serviceType}>{serviceType}</Text>
          <Text style={styles.location}>{location}</Text>
          <View style={styles.dateTimeRow}>
            <Text style={styles.dateTime}>📅 {date} • {time}</Text>
          </View>
          <Text style={styles.garageName}>{garageName}</Text>
        </View>

        {/* All Services & Items */}
        <View style={styles.servicesCard}>
          {/* Services Section */}
          <View style={styles.serviceSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.iconContainer}>
                <Icon name="construct-outline" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.sectionTitle}>Services Performed</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{services.length}</Text>
              </View>
            </View>
            
            {services.map((service, index) => (
              <View key={`service-${index}`} style={styles.serviceRow}>
                <View style={styles.serviceInfo}>
                  <View style={styles.serviceIcon}>
                    <Icon name="checkmark-circle" size={16} color={Colors.success} />
                  </View>
                  <View style={styles.serviceDetails}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text style={styles.serviceDescription}>Professional service</Text>
                  </View>
                </View>
                <Text style={styles.servicePrice}>${service.price.toFixed(2)}</Text>
              </View>
            ))}
          </View>

          {/* Items Used Section */}
          <View style={styles.itemsSection}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconContainer, styles.itemsIconContainer]}>
                <Icon name="cube-outline" size={20} color={Colors.warning} />
              </View>
              <Text style={styles.sectionTitle}>Items & Parts Used</Text>
              <View style={[styles.badge, styles.itemsBadge]}>
                <Text style={styles.badgeText}>{services.length}</Text>
              </View>
            </View>
            
            {services.map((item, index) => (
              <View key={`item-${index}`} style={styles.serviceRow}>
                <View style={styles.serviceInfo}>
                  <View style={[styles.serviceIcon, styles.itemIcon]}>
                    <Icon name="cube" size={16} color={Colors.warning} />
                  </View>
                  <View style={styles.serviceDetails}>
                    <Text style={styles.serviceName}>{item.name} Part</Text>
                    <Text style={styles.serviceDescription}>Original equipment</Text>
                  </View>
                </View>
                <Text style={styles.servicePrice}>${item.price.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Billing Summary */}
        <View style={styles.billingSummaryCard}>
          <Text style={styles.sectionTitle}>Billing Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>CGST</Text>
            <Text style={styles.summaryValue}>${cgst.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>SGST</Text>
            <Text style={styles.summaryValue}>${sgst.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Coupon Discount</Text>
            <Text style={styles.discountValue}>-${discount.toFixed(2)}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total ({services.length} items)</Text>
            <Text style={styles.totalValue}>${finalTotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.paymentCard}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentRow}>
            <View style={styles.paymentInfo}>
              <Icon name="card-outline" size={20} color={Colors.neutral600}/>
              <Text style={styles.paymentText}>Credit Card ending in 4242</Text>
            </View>
            <TouchableOpacity>
              <Icon name="chevron-forward" size={20} color={Colors.neutral400} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.downloadButton}>
            <Icon name="download-outline" size={20} color={Colors.primary} />
            <Text style={styles.downloadButtonText}>Download Receipt</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.printButton}>
            <Icon name="print-outline" size={20} color={Colors.neutral400} />
            <Text style={styles.printButtonText}>Print Bill</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
    backgroundColor: Colors.neutral0,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral700,
  },
  shareButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.neutral50,
  },
  serviceInfoCard: {
    backgroundColor: Colors.neutral0,
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: Colors.neutral1000,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  serviceType: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral700,
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: Colors.neutral500,
    marginBottom: 8,
  },
  dateTimeRow: {
    marginBottom: 12,
  },
  dateTime: {
    fontSize: 14,
    color: Colors.success,
  },
  garageName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral700,
  },
  servicesCard: {
    backgroundColor: Colors.neutral0,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: Colors.neutral1000,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  serviceSection: {
    marginBottom: 24,
  },
  itemsSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral100,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemsIconContainer: {
    backgroundColor: Colors.warning + '40', // Adding transparency
  },
  badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  itemsBadge: {
    backgroundColor: Colors.warning,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.neutral0,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.success + '20', // Adding transparency for light green
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemIcon: {
    backgroundColor: Colors.warning + '40', // Adding transparency
  },
  serviceDetails: {
    flex: 1,
  },
  serviceDescription: {
    fontSize: 12,
    color: Colors.neutral400,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.neutral700,
    flex: 1,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral50,
  },
  serviceName: {
    fontSize: 15,
    color: Colors.neutral700,
    fontWeight: '500',
  },
  servicePrice: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.neutral700,
  },
  billingSummaryCard: {
    backgroundColor: Colors.neutral0,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: Colors.neutral1000,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.neutral500,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral700,
  },
  discountValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutral200,
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
    color: Colors.neutral700,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral700,
  },
  paymentCard: {
    backgroundColor: Colors.neutral0,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: Colors.neutral1000,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentText: {
    fontSize: 14,
    color: Colors.neutral700,
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary + '40', // Adding transparency
  },
  downloadButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    marginLeft: 8,
  },
  printButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neutral50,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  printButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral500,
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 40,
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
  discountLabel: {
    fontSize: 14,
    color: Colors.success,
  },
});
export default DetailedBill;