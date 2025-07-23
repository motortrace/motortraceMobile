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
import CategoryBadge from '../../components/CategoryBadge';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';

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

const ReviewRepairsScreen = () => {
  const [selected, setSelected] = useState<{ [id: number]: boolean }>({
    1: true,
    3: true,
  });

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const toggleRepair = (id: number) => {
    setSelected(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const selectedRepairs = repairs.filter(r => selected[r.id]);
  const unselectedRepairs = repairs.filter(r => !selected[r.id]);

  const getSelectedRepairsTotal = () => {
    return selectedRepairs.reduce((total, repair) => total + repair.price, 0);
  };

  const getSelectedRepairsCount = () => {
    return selectedRepairs.length;
  };

  const handleSubmit = () => {
    const selectedCount = getSelectedRepairsCount();
    const total = getSelectedRepairsTotal();

    if (selectedCount === 0) {
      Alert.alert('No Repairs Selected', 'Please select at least one repair to proceed.');
      return;
    }

    Alert.alert(
      'Submit Repairs',
      `You selected ${selectedCount} repair(s) totaling $${total}. Submit?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Submit', onPress: () => console.log('Repairs submitted:', selectedRepairs) },
      ]
    );
  };

  const renderRepairCard = (repair, isSelected) => {
    return (
      <TouchableOpacity
        key={repair.id}
        style={[styles.repairCard, isSelected && styles.repairCardSelected]}
        onPress={() => toggleRepair(repair.id)}
      >
        <View style={styles.repairHeader}>
          <CategoryBadge 
            category={repair.category}
            categoryColor={repair.categoryColor}
            categoryBg={repair.categoryBg}
          />
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>${repair.price}</Text>
            <Text style={styles.timeText}>{repair.estimatedTime}</Text>
          </View>
        </View>
        
        <Text style={styles.repairTitle}>{repair.title}</Text>
        <Text style={styles.repairDescription}>{repair.description}</Text>
        
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
        name="Review Repairs" 
        icon="back" 
        onIconPress={() => navigation.goBack()} 
      />

      <ScrollView style={styles.scrollView}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Review Your Selection</Text>
          <Text style={styles.summarySubtitle}>
            Review and modify your repair selections before submitting
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

        {/* Selected Repairs Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>✅ Selected Repairs</Text>
          {selectedRepairs.length > 0 ? (
            selectedRepairs.map(repair => renderRepairCard(repair, true))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No repairs selected.</Text>
            </View>
          )}
        </View>

        {/* Unselected Repairs Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>🛠️ Available Repairs</Text>
          {unselectedRepairs.length > 0 ? (
            unselectedRepairs.map(repair => renderRepairCard(repair, false))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>All repairs selected.</Text>
            </View>
          )}
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
            styles.submitButton,
            getSelectedRepairsCount() === 0 && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={getSelectedRepairsCount() === 0}
        >
          <Text style={styles.submitButtonText}>
            Submit Selected Repairs
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
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 16,
  },
  repairCard: {
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
  repairCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLighter,
  },
  repairHeader: {
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
  repairTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 6,
  },
  repairDescription: {
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
  emptyCard: {
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.neutral500,
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
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.neutral300,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral0,
  },
});

export default ReviewRepairsScreen;