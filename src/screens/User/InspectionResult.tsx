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
import CategoryBadge from '../components/CategoryBadge';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';

const InspectionResultsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [selectedRepairs, setSelectedRepairs] = useState({});

  // Mock inspection findings with different urgency levels
  const inspectionFindings = [
    {
      id: 1,
      category: 'Critical',
      categoryColor: Colors.danger,
      categoryBg: Colors.dangerLight,
      title: 'Brake Pads Replacement',
      description: 'Brake pads are severely worn and require immediate replacement for safety.',
      price: 150,
      estimatedTime: '2 hours',
      selected: false,
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
      selected: false,
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
      selected: false,
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
      selected: false,
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
      selected: false,
    },
  ];

  const toggleRepairSelection = (repairId) => {
    setSelectedRepairs(prev => ({
      ...prev,
      [repairId]: !prev[repairId]
    }));
  };

  const getSelectedRepairsTotal = () => {
    return inspectionFindings
      .filter(finding => selectedRepairs[finding.id])
      .reduce((total, finding) => total + finding.price, 0);
  };

  const getSelectedRepairsCount = () => {
    return Object.values(selectedRepairs).filter(Boolean).length;
  };

  const handleApproveRepairs = () => {
    const selectedCount = getSelectedRepairsCount();
    if (selectedCount === 0) {
      Alert.alert('No Repairs Selected', 'Please select at least one repair to proceed.');
      return;
    }
    
    Alert.alert(
      'Confirm Repairs',
      `You have selected ${selectedCount} repair(s) totaling $${getSelectedRepairsTotal()}. Do you want to proceed?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Approve', onPress: () => console.log('Repairs approved') }
      ]
    );
  };

  const renderInspectionFinding = (finding) => {
    const isSelected = selectedRepairs[finding.id];
    
    return (
      <TouchableOpacity
        key={finding.id}
        style={[styles.findingCard, isSelected && styles.findingCardSelected]}
        onPress={() => toggleRepairSelection(finding.id)}
      >
        <View style={styles.findingHeader}>
          <CategoryBadge 
            category={finding.category}
            categoryColor={finding.categoryColor}
            categoryBg={finding.categoryBg}
          />
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>${finding.price}</Text>
            <Text style={styles.timeText}>{finding.estimatedTime}</Text>
          </View>
        </View>
        
        <Text style={styles.findingTitle}>{finding.title}</Text>
        <Text style={styles.findingDescription}>{finding.description}</Text>
        
        <View style={styles.selectionContainer}>
          <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
            {isSelected && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.selectionText}>
            {isSelected ? 'Selected for repair' : 'Tap to select'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        icon="back"
        name="Inspection Results"
        image=""
        onIconPress={() => navigation.navigate('InspectionCar')}
      />
      <ScrollView style={styles.scrollView}>

        {/* Inspection Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Inspection Complete</Text>
          <Text style={styles.summarySubtitle}>
            We've identified {inspectionFindings.length} items that need attention
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
        </View>

        {/* Inspection Findings */}
        <View style={styles.findingsContainer}>
          <Text style={styles.sectionTitle}>Repair Recommendations</Text>
          {inspectionFindings.map(renderInspectionFinding)}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomActionBar}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>
            {getSelectedRepairsCount()} repair(s) selected
          </Text>
          <Text style={styles.totalAmount}>
            Total: ${getSelectedRepairsTotal()}
          </Text>
        </View>
        
        <TouchableOpacity
          style={[
            styles.approveButton,
            getSelectedRepairsCount() === 0 && styles.approveButtonDisabled
          ]}
          onPress={handleApproveRepairs}
          disabled={getSelectedRepairsCount() === 0}
        >
          <Text style={styles.approveButtonText}>
            Approve Selected Repairs
          </Text>
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
    paddingBottom: 120, // Space for bottom action bar
  },
  summaryCard: {
    backgroundColor: Colors.neutral0,
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 12,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 15,
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
  findingsContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 16,
  },
  findingCard: {
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.neutral200,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  findingCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLighter,
  },
  findingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral900,
  },
  timeText: {
    fontSize: 12,
    color: Colors.neutral600,
  },
  findingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 6,
  },
  findingDescription: {
    fontSize: 14,
    color: Colors.neutral600,
    lineHeight: 20,
    marginBottom: 12,
  },
  selectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.neutral400,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.neutral0,
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectionText: {
    fontSize: 14,
    color: Colors.neutral600,
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
  totalContainer: {
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral900,
  },
  approveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  approveButtonDisabled: {
    backgroundColor: Colors.neutral300,
    marginBottom: 20,
  },
  approveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral0,
  },
});

export default InspectionResultsScreen;