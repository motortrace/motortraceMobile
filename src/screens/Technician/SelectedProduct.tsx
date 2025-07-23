import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../constants/colors';
import Header from '../../components/Header';
import CategoryBadge from '../../components/CategoryBadge';
import Button from '../../components/Button'
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';
import Label from '../../components/Label';

const TechnicianPartsViewScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Mock data - in real app, this would come from the customer's selection
  const customerPartsSelection = [
    {
      id: 1,
      repairId: 1,
      repairName: 'Brake Pads Replacement',
      partName: 'Brake Pads Set (Front)',
      partNumber: 'BP-F-2021-001',
      oem: 'Bosch',
      garagePrice: 85,
      marketPrice: '65-95',
      warrantyGarage: '12 months',
      warrantyOwnParts: '6 months labor only',
      category: 'Critical',
      categoryColor: Colors.danger,
      categoryBg: Colors.dangerLight,
      estimatedTime: '2 hours',
      selectedBy: 'garage', // 'garage' or 'customer'
      status: 'pending', // 'pending', 'in_progress', 'completed'
    },
    {
      id: 2,
      repairId: 3,
      repairName: 'Tire Replacement (Front Left)',
      partName: 'All-Season Tire 225/60R16',
      partNumber: 'AT-225-60-16',
      oem: 'Michelin',
      garagePrice: 95,
      marketPrice: '75-110',
      warrantyGarage: '24 months',
      warrantyOwnParts: '6 months labor only',
      category: 'Critical',
      categoryColor: Colors.danger,
      categoryBg: Colors.dangerLight,
      estimatedTime: '45 minutes',
      selectedBy: 'customer',
      status: 'pending',
    },
    {
      id: 3,
      repairId: 2,
      repairName: 'Engine Oil Change',
      partName: 'Synthetic Motor Oil 5W-30',
      partNumber: 'SO-5W30-5L',
      oem: 'Shell',
      garagePrice: 35,
      marketPrice: '25-40',
      warrantyGarage: '6 months',
      warrantyOwnParts: '3 months labor only',
      category: 'Recommended',
      categoryColor: Colors.warning,
      categoryBg: Colors.warningLight,
      estimatedTime: '30 minutes',
      selectedBy: 'garage',
      status: 'pending',
    },
    {
      id: 4,
      repairId: 5,
      repairName: 'Battery Check & Clean',
      partName: 'Battery Terminal Cleaner',
      partNumber: 'BTC-SPRAY-250',
      oem: 'CRC',
      garagePrice: 15,
      marketPrice: '10-18',
      warrantyGarage: '3 months',
      warrantyOwnParts: '1 month labor only',
      category: 'Recommended',
      categoryColor: Colors.warning,
      categoryBg: Colors.warningLight,
      estimatedTime: '20 minutes',
      selectedBy: 'garage',
      status: 'pending',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return Colors.success;
      case 'in_progress':
        return Colors.warning;
      default:
        return Colors.neutral400;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      default:
        return 'Pending';
    }
  };

  const calculateTotals = () => {
    const garageParts = customerPartsSelection.filter(part => part.selectedBy === 'garage');
    const customerParts = customerPartsSelection.filter(part => part.selectedBy === 'customer');
    
    return {
      garagePartsTotal: garageParts.reduce((sum, part) => sum + part.garagePrice, 0),
      garagePartsCount: garageParts.length,
      customerPartsCount: customerParts.length,
    };
  };

  const totals = calculateTotals();

  const TechnicianPartCard = ({ part }) => (
    <View style={styles.partCard}>
      <View style={styles.partHeader}>
        <View style={styles.partHeaderLeft}>
          <CategoryBadge
            category={part.category}
            color={part.categoryColor}
            backgroundColor={part.categoryBg}
          />
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(part.status) }]}>
            <Text style={styles.statusText}>{getStatusText(part.status)}</Text>
          </View>
        </View>
        <View style={styles.partHeaderRight}>
          <Text style={styles.estimatedTime}>{part.estimatedTime}</Text>
        </View>
      </View>

      <Text style={styles.repairName}>{part.repairName}</Text>
      <Text style={styles.partName}>{part.partName}</Text>
      
      <View style={styles.partDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Part Number:</Text>
          <Text style={styles.detailValue}>{part.partNumber}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>OEM:</Text>
          <Text style={styles.detailValue}>{part.oem}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Provided by:</Text>
          <Text style={[styles.detailValue, { 
            color: part.selectedBy === 'garage' ? Colors.primary : Colors.warning,
            fontWeight: '600'
          }]}>
            {part.selectedBy === 'garage' ? 'Garage' : 'Customer'}
          </Text>
        </View>
        {part.selectedBy === 'garage' && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Price:</Text>
            <Text style={styles.detailValue}>${part.garagePrice}</Text>
          </View>
        )}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Warranty:</Text>
          <Text style={styles.detailValue}>
            {part.selectedBy === 'garage' ? part.warrantyGarage : part.warrantyOwnParts}
          </Text>
        </View>
      </View>

      {part.selectedBy === 'customer' && (
        <View style={styles.customerPartNote}>
          <Text style={styles.customerPartNoteText}>
            ⚠️ Customer will provide this part. Verify compatibility before installation.
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        icon="back"
        name="Work Order - Parts"
        image=""
        onIconPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.scrollView}>
        {/* Work Order Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Work Order Summary</Text>
          <Text style={styles.summarySubtitle}>
            Customer has selected parts for {customerPartsSelection.length} repairs
          </Text>
          
          <View style={styles.statusOverview}>
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, { backgroundColor: Colors.primary }]} />
              <Text style={styles.statusLabel}>Garage Parts: {totals.garagePartsCount}</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, { backgroundColor: Colors.warning }]} />
              <Text style={styles.statusLabel}>Customer Parts: {totals.customerPartsCount}</Text>
            </View>
          </View>

          <View style={styles.priorityContainer}>
            <Text style={styles.priorityTitle}>Priority Levels:</Text>
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Colors.danger }]} />
                <Text style={styles.legendText}>Critical - Safety Priority</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Colors.warning }]} />
                <Text style={styles.legendText}>Recommended - Performance</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Colors.info }]} />
                <Text style={styles.legendText}>Optional - Enhancement</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Parts List */}
        <View style={styles.partsContainer}>
          <Text style={styles.sectionTitle}>Parts & Repairs</Text>
          {customerPartsSelection.map((part) => (
            <TechnicianPartCard key={part.id} part={part} />
          ))}
        </View>
      </ScrollView>

      {/* Bottom Summary */}
      <View style={styles.bottomActionBar}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Garage Parts ({totals.garagePartsCount})</Text>
          <Text style={styles.summaryAmount}>${totals.garagePartsTotal}</Text>
        </View>
        
        {totals.customerPartsCount > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Customer Parts ({totals.customerPartsCount})</Text>
            <Text style={styles.summaryAmount}>Customer Provided</Text>
          </View>
        )}

        <Button 
          label= "Start Work Order"
          onPress={() => navigation.goBack()}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primarybg,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 160,
  },
  summaryCard: {
    backgroundColor: Colors.neutral0,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 20,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 14,
    color: Colors.neutral600,
    marginBottom: 20,
  },
  statusOverview: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 20,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: Colors.neutral700,
    fontWeight: '500',
  },
  priorityContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
    paddingTop: 16,
  },
  priorityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral800,
    marginBottom: 12,
  },
  legendContainer: {
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 13,
    color: Colors.neutral600,
  },
  partsContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 16,
  },
  partCard: {
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  partHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  partHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  partHeaderRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.neutral0,
  },
  estimatedTime: {
    fontSize: 12,
    color: Colors.neutral600,
    fontWeight: '500',
  },
  repairName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 4,
  },
  partName: {
    fontSize: 14,
    color: Colors.neutral700,
    marginBottom: 16,
  },
  partDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  detailValue: {
    fontSize: 14,
    color: Colors.neutral800,
    fontWeight: '500',
  },
  customerPartNote: {
    backgroundColor: Colors.warningLight,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  customerPartNoteText: {
    fontSize: 13,
    color: Colors.neutral700,
    lineHeight: 18,
  },
  bottomActionBar: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    backgroundColor: Colors.neutral0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral900,
  },
});

export default TechnicianPartsViewScreen