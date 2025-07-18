import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Colors from '../../constants/colors';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';
import PartCard from '../../components/PartCard';

const repairs = [
  {
    id: 1,
    category: 'Critical',
    categoryColor: Colors.danger,
    categoryBg: Colors.dangerLight,
    title: 'Brake Pads Replacement',
    description: 'Brake pads are severely worn and require immediate replacement for safety.',
    price: 150,
    estimatedTime: '2 hours',
  },
  {
    id: 2,
    category: 'Recommended',
    categoryColor: Colors.warning,
    categoryBg: Colors.warningLight,
    title: 'Engine Oil Change',
    description: 'Oil is due for replacement to maintain optimal engine performance.',
    price: 45,
    estimatedTime: '30 minutes',
  },
  {
    id: 3,
    category: 'Critical',
    categoryColor: Colors.danger,
    categoryBg: Colors.dangerLight,
    title: 'Tire Replacement (Front Left)',
    description: 'Tire tread is below safe limits and poses a safety risk.',
    price: 120,
    estimatedTime: '45 minutes',
  },
  {
    id: 4,
    category: 'Optional',
    categoryColor: Colors.info,
    categoryBg: Colors.infoLight,
    title: 'Air Filter Replacement',
    description: 'Air filter is slightly dirty but can improve fuel efficiency when replaced.',
    price: 25,
    estimatedTime: '15 minutes',
  },
  {
    id: 5,
    category: 'Recommended',
    categoryColor: Colors.warning,
    categoryBg: Colors.warningLight,
    title: 'Battery Check & Clean',
    description: 'Battery terminals show corrosion and should be cleaned for better performance.',
    price: 30,
    estimatedTime: '20 minutes',
  },
];

const PartsSelectionScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  const [partsSelection, setPartsSelection] = useState({});

  // Mock parts data based on approved repairs
  const requiredParts = [
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
      selected: 'garage',
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
      selected: 'garage',
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
      selected: 'garage',
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
      selected: 'garage',
    },
  ];

  const handlePartSelection = (partId, selection) => {
    setPartsSelection(prev => ({
      ...prev,
      [partId]: selection
    }));
  };

  const getPartSelection = (partId) => {
    return partsSelection[partId] || 'garage';
  };

  const calculateTotals = () => {
    const garageParts = requiredParts.filter(part => getPartSelection(part.id) === 'garage');
    const customerParts = requiredParts.filter(part => getPartSelection(part.id) === 'customer');
    
    return {
      garagePartsTotal: garageParts.reduce((sum, part) => sum + part.garagePrice, 0),
      garagePartsCount: garageParts.length,
      customerPartsCount: customerParts.length,
    };
  };

  const handleProceed = () => {
    const totals = calculateTotals();
    const customerParts = requiredParts.filter(part => getPartSelection(part.id) === 'customer');
    
    if (customerParts.length > 0) {
      Alert.alert(
        'Customer Parts Information',
        `You've chosen to provide ${customerParts.length} part(s). Please bring these parts on your service date. Total garage parts: ${totals.garagePartsTotal}`,
        [
          { text: 'OK', onPress: () => navigation.navigate('ServiceSchedule') }
        ]
      );
    } else {
      Alert.alert(
        'Parts Confirmed',
        `All parts will be provided by the garage. Total: ${totals.garagePartsTotal}`,
        [
          { text: 'OK', onPress: () => navigation.navigate('ServiceSchedule') }
        ]
      );
    }
  };

  const totals = calculateTotals();

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        icon="back"
        name="Parts Selection"
        image=""
        onIconPress={() => navigation.navigate('InspectionCar')}
      />

      <ScrollView style={styles.scrollView}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Required Parts</Text>
          <Text style={styles.summarySubtitle}>
            {requiredParts.length} parts needed for your approved repairs
          </Text>
          
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

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              💡 Choose who provides each part. We recommend garage-provided parts for quality assurance and warranty coverage.
            </Text>
          </View>
        </View>

        {/* Parts List */}
        <View style={styles.partsContainer}>
          <Text style={styles.sectionTitle}>Parts Selection</Text>
          {requiredParts.map((part) => (
            <PartCard
              key={part.id}
              part={part}
            />
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
            <Text style={styles.summaryLabel}>Your Parts ({totals.customerPartsCount})</Text>
            <Text style={styles.summaryAmount}>You provide</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.proceedButton}
          onPress={handleProceed}
        >
          <Text style={styles.proceedButtonText}>Confirm Parts Selection</Text>
        </TouchableOpacity>
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
  legendContainer: {
    gap: 12,
    marginBottom: 16,
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
    fontSize: 14,
    color: Colors.neutral700,
  },
  infoContainer: {
    backgroundColor: Colors.primarybg,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  infoText: {
    fontSize: 14,
    color: Colors.neutral700,
    lineHeight: 20,
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
  bottomActionBar: {
    bottom: 0,
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
  proceedButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  proceedButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral0,
  },
});

export default PartsSelectionScreen;