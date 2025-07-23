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
import Button from '../../components/Button';
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
    isSelected: true,
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
    isSelected: false,
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
    isSelected: true,
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
    isSelected: false,
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
    isSelected: false,
  },
];

const TechnicianRepairsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const selectedRepairs = repairs.filter(r => r.isSelected);
  const unselectedRepairs = repairs.filter(r => !r.isSelected);

  const getSelectedRepairsTotal = () => {
    return selectedRepairs.reduce((total, repair) => total + repair.price, 0);
  };

  const getSelectedRepairsCount = () => {
    return selectedRepairs.length;
  };

  const renderRepairCard = (repair, isSelected) => {
    return (
      <View
        key={repair.id}
        style={[
          styles.repairCard, 
          isSelected ? styles.repairCardSelected : styles.repairCardNotSelected
        ]}
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
        
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusIndicator, 
            isSelected ? styles.statusIndicatorSelected : styles.statusIndicatorNotSelected
          ]}>
            <Text style={[
              styles.statusText,
              isSelected ? styles.statusTextSelected : styles.statusTextNotSelected
            ]}>
              {isSelected ? '✓ APPROVED' : '✗ NOT APPROVED'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        name="Repair Work Order" 
        icon="back" 
        onIconPress={() => navigation.goBack()} 
      />

      <ScrollView style={styles.scrollView}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Work Order Summary</Text>
          <Text style={styles.summarySubtitle}>
            Customer approved repairs and maintenance items
          </Text>
          
          <View style={styles.workOrderStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{getSelectedRepairsCount()}</Text>
              <Text style={styles.statLabel}>Approved Repairs</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>${getSelectedRepairsTotal()}</Text>
              <Text style={styles.statLabel}>Total Value</Text>
            </View>
          </View>
          
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

        {/* Approved Repairs Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>✅ Approved Repairs</Text>
          <Text style={styles.sectionSubtitle}>Proceed with these repairs</Text>
          {selectedRepairs.length > 0 ? (
            selectedRepairs.map(repair => renderRepairCard(repair, true))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No repairs approved by customer.</Text>
            </View>
          )}
        </View>

        {/* Not Approved Repairs Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>❌ Not Approved</Text>
          <Text style={styles.sectionSubtitle}>Customer declined these repairs</Text>
          {unselectedRepairs.length > 0 ? (
            unselectedRepairs.map(repair => renderRepairCard(repair, false))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>All recommended repairs approved.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomActionBar}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>
            Work Order Total
          </Text>
          <Text style={styles.totalAmount}>
            ${getSelectedRepairsTotal()} ({getSelectedRepairsCount()} items)
          </Text>
        </View>

        <Button 
          label = "Start Work on Approved Repairs"
          onPress={() => navigation.goBack()}
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
  workOrderStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: Colors.neutral50,
    borderRadius: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.neutral600,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.neutral200,
    marginHorizontal: 20,
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
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.neutral600,
    marginBottom: 16,
  },
  repairCard: {
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  repairCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarybg,
  },
  repairCardNotSelected: {
    borderColor: Colors.neutral300,
    backgroundColor: Colors.neutral50,
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
  statusContainer: {
    alignItems: 'flex-start',
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusIndicatorSelected: {
    backgroundColor: Colors.infoLight,
    borderColor: Colors.success,
  },
  statusIndicatorNotSelected: {
    backgroundColor: Colors.neutral100,
    borderColor: Colors.neutral400,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextSelected: {
    color: Colors.success,
  },
  statusTextNotSelected: {
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
});

export default TechnicianRepairsScreen;