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
import Colors from '../constants/colors';
import Header from '../components/Header';
import Button from '../components/Button'
import CategoryBadge from '../components/CategoryBadge';

const PartsSelectionScreen = ({ route, navigation }) => {
  const { approvedRepairs } = route.params || {};
  
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
      selected: 'garage', // 'garage' or 'customer'
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
        `You've chosen to provide ${customerParts.length} part(s). Please bring these parts on your service date. Total garage parts: $${totals.garagePartsTotal}`,
        [
          { text: 'OK', onPress: () => navigation.navigate('ServiceSchedule') }
        ]
      );
    } else {
      Alert.alert(
        'Parts Confirmed',
        `All parts will be provided by the garage. Total: $${totals.garagePartsTotal}`,
        [
          { text: 'OK', onPress: () => navigation.navigate('ServiceSchedule') }
        ]
      );
    }
  };

  const renderPartCard = (part) => {
    const selection = getPartSelection(part.id);
    
    return (
      <View key={part.id} style={styles.partCard}>

        <View style={styles.flex}>
          <View style={styles.partDetails}>
            <Text style={styles.partName}>{part.partName}</Text>
            <Text style={styles.partNumber}>Part #: {part.partNumber}</Text>
            <Text style={styles.oemBrand}>OEM: {part.oem}</Text>
          </View>

          <View>
          <CategoryBadge 
            category={part.category}
            categoryColor={part.categoryColor}
            categoryBg={part.categoryBg}
          />
          <Text> </Text>
          </View>
        </View>

        {/* Selection Options */}
        <View style={styles.selectionContainer}>
          <Text style={styles.selectionTitle}>Who will provide this part?</Text>
          
          {/* Garage Option */}
          <TouchableOpacity
            style={[
              styles.selectionOption,
              selection === 'garage' && styles.selectionOptionSelected
            ]}
            onPress={() => handlePartSelection(part.id, 'garage')}
          >
            <View style={styles.selectionOptionLeft}>
              <View style={[
                styles.radioButton,
                selection === 'garage' && styles.radioButtonSelected
              ]}>
                {selection === 'garage' && <View style={styles.radioButtonInner} />}
              </View>
              <View>
                <Text style={styles.selectionOptionTitle}>Garage Provides</Text>
                <Text style={styles.selectionOptionSubtitle}>
                  ${part.garagePrice} • {part.warrantyGarage} warranty
                </Text>
              </View>
            </View>
            <View style={styles.recommendedBadge}>
              <Text style={styles.recommendedText}>RECOMMENDED</Text>
            </View>
          </TouchableOpacity>

          {/* Customer Option */}
          <TouchableOpacity
            style={[
              styles.selectionOption,
              selection === 'customer' && styles.selectionOptionSelected
            ]}
            onPress={() => handlePartSelection(part.id, 'customer')}
          >
            <View style={styles.selectionOptionLeft}>
              <View style={[
                styles.radioButton,
                selection === 'customer' && styles.radioButtonSelected
              ]}>
                {selection === 'customer' && <View style={styles.radioButtonInner} />}
              </View>
              <View>
                <Text style={styles.selectionOptionTitle}>I'll Provide</Text>
                <Text style={styles.selectionOptionSubtitle}>
                  Market: ${part.marketPrice} • {part.warrantyOwnParts}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Warning for customer parts */}
        {selection === 'customer' && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningText}>
              Please bring this part on your service date. Quality and compatibility are your responsibility.
            </Text>
          </View>
        )}
      </View>
    );
  };

  const totals = calculateTotals();

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        icon="back"
        name="Parts Selection"
        image=""
      />

      <ScrollView style={styles.scrollView}>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Required Parts</Text>
          <Text style={styles.summarySubtitle}>
            {requiredParts.length} parts needed for your approved repairs
          </Text>
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              💡 Choose who provides each part. We recommend garage-provided parts for quality assurance and warranty coverage.
            </Text>
          </View>
        </View>

        {/* Parts List */}
        <View style={styles.partsContainer}>
          {requiredParts.map(renderPartCard)}
        </View>
      </ScrollView>

      {/* Bottom Summary */}
      <View style={styles.bottomSummary}>
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

        < Button label="Confirm Parts selection"/>

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
    marginTop: 20
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
    marginBottom: 16,
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
  partCard: {
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  partHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  partHeaderLeft: {
    flex: 1,
  },
  flex: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  repairName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 8,
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  urgencyText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  partDetails: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  partName: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.neutral800,
    marginBottom: 4,
  },
  partNumber: {
    fontSize: 13,
    color: Colors.neutral600,
    marginBottom: 2,
  },
  oemBrand: {
    fontSize: 13,
    color: Colors.neutral600,
  },
  selectionContainer: {
    marginBottom: 8,
  },
  selectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral800,
    marginBottom: 12,
  },
  selectionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.neutral0,
    marginBottom: 8,
  },
  selectionOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarybg,
  },
  selectionOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.neutral400,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioButtonSelected: {
    borderColor: Colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  selectionOptionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral800,
  },
  selectionOptionSubtitle: {
    fontSize: 12,
    color: Colors.neutral600,
    marginTop: 2,
  },
  recommendedBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.neutral0,
    letterSpacing: 0.3,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.warningLight,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  warningIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  warningText: {
    fontSize: 12,
    color: Colors.warning,
    flex: 1,
    lineHeight: 16,
  },
  bottomSummary: {
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
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  summaryLabel: {
    fontSize: 16,
    color: Colors.neutral600,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral900,
  },
});

export default PartsSelectionScreen;