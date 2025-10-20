import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/colors';
import Header from '../../components/Header';
import LoadingComponent from '../../components/Loading';
import CustomAlert, { CustomAlertProps } from '../../components/Alert';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Expense category type
type ExpenseCategory = 'MAINTENANCE' | 'REPAIR' | 'FUEL' | 'INSURANCE' | 'REGISTRATION' | 'TIRES' | 'PARTS' | 'WASHING' | 'PARKING' | 'TOLLS' | 'FINES' | 'OTHER';

// Car expense interface
interface CarExpense {
  id: string;
  vehicleId: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
  provider?: string;
  notes?: string;
  createdAt: string;
}

const CarExpensesPage = () => {
  const [carId, setCarId] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<CarExpense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<CarExpense[]>([]);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [newExpenseCategory, setNewExpenseCategory] = useState<ExpenseCategory>('MAINTENANCE');
  const [newExpenseDescription, setNewExpenseDescription] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseDate, setNewExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [newExpenseProvider, setNewExpenseProvider] = useState('');
  const [newExpenseNotes, setNewExpenseNotes] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertConfig, setAlertConfig] = useState<CustomAlertProps | null>(null);

  const loadExpensesCallback = useCallback(async (vehicleId: string) => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(`http://10.0.2.2:3000/car-expenses/vehicle/${vehicleId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setExpenses(data.data || []);
        }
      } else {
        console.warn('Failed to load expenses from server, trying local storage');
        // Fallback to local storage if server fails
        const storedExpenses = await AsyncStorage.getItem(`car_expenses_${vehicleId}`);
        if (storedExpenses) {
          setExpenses(JSON.parse(storedExpenses));
        }
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
      // Fallback to local storage
      try {
        const storedExpenses = await AsyncStorage.getItem(`car_expenses_${vehicleId}`);
        if (storedExpenses) {
          setExpenses(JSON.parse(storedExpenses));
        }
      } catch (localError) {
        console.error('Error loading local expenses:', localError);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const getCarIdAndLoadExpenses = async () => {
      const storedCarId = await AsyncStorage.getItem('selectedCarId');
      setCarId(storedCarId);
      if (storedCarId) {
        loadExpensesCallback(storedCarId);
      } else {
        setIsLoading(false);
      }
    };
    getCarIdAndLoadExpenses();
  }, [loadExpensesCallback]);

  useFocusEffect(
    useCallback(() => {
      if (carId) {
        loadExpensesCallback(carId);
      }
    }, [carId, loadExpensesCallback])
  );


  const saveExpenseLocally = async (expense: CarExpense) => {
    if (!carId) return;
    try {
      const updatedExpenses = [...expenses, expense];
      await AsyncStorage.setItem(`car_expenses_${carId}`, JSON.stringify(updatedExpenses));
      setExpenses(updatedExpenses);
    } catch (error) {
      console.error('Error saving expense locally:', error);
    }
  };

  const filterExpenses = useCallback(() => {
    let filtered = expenses;

    // Filter by category
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(expense => expense.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(expense =>
        expense.description.toLowerCase().includes(query) ||
        expense.provider?.toLowerCase().includes(query) ||
        expense.notes?.toLowerCase().includes(query)
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setFilteredExpenses(filtered);
  }, [expenses, selectedCategory, searchQuery]);

  useEffect(() => {
    filterExpenses();
  }, [filterExpenses]);

  const addExpense = async () => {
    if (!newExpenseDescription.trim()) {
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: 'Please enter a description',
        type: 'error',
        buttonType: 'single',
        onClose: () => setAlertConfig(null)
      });
      return;
    }

    if (!newExpenseAmount.trim() || isNaN(parseFloat(newExpenseAmount))) {
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: 'Please enter a valid amount',
        type: 'error',
        buttonType: 'single',
        onClose: () => setAlertConfig(null)
      });
      return;
    }

    if (!carId) {
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: 'No vehicle selected',
        type: 'error',
        buttonType: 'single',
        onClose: () => setAlertConfig(null)
      });
      return;
    }

    setIsSubmitting(true);

    const expenseData = {
      vehicleId: carId,
      category: newExpenseCategory,
      description: newExpenseDescription.trim(),
      amount: parseFloat(newExpenseAmount),
      date: new Date(newExpenseDate).toISOString(),
      provider: newExpenseProvider.trim() || undefined,
      notes: newExpenseNotes.trim() || undefined,
    };

    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // Try to save to server
        const response = await fetch('http://10.0.2.2:3000/car-expenses', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(expenseData),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setExpenses(prev => [data.data, ...prev]);
            resetForm();
            setShowAddExpenseModal(false);
            setAlertConfig({
              visible: true,
              title: 'Success',
              message: 'Expense added successfully',
              type: 'success',
              buttonType: 'single',
              onClose: () => setAlertConfig(null)
            });
            return;
          }
        }
      }

      // Fallback to local storage
      const localExpense: CarExpense = {
        ...expenseData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      await saveExpenseLocally(localExpense);
      resetForm();
      setShowAddExpenseModal(false);
      setAlertConfig({
        visible: true,
        title: 'Success',
        message: 'Expense added successfully',
        type: 'success',
        buttonType: 'single',
        onClose: () => setAlertConfig(null)
      });

    } catch (error) {
      console.error('Error adding expense:', error);
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: 'Failed to add expense. Please try again.',
        type: 'error',
        buttonType: 'single',
        onClose: () => setAlertConfig(null)
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewExpenseCategory('MAINTENANCE');
    setNewExpenseDescription('');
    setNewExpenseAmount('');
    setNewExpenseDate(new Date().toISOString().split('T')[0]);
    setNewExpenseProvider('');
    setNewExpenseNotes('');
  };

  const deleteExpense = (expenseId: string) => {
    setAlertConfig({
      visible: true,
      title: 'Delete Expense',
      message: 'Are you sure you want to delete this expense?',
      type: 'warning',
      buttonType: 'double',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onCancel: () => setAlertConfig(null),
      onClose: async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          if (token) {
            // Try to delete from server
            const response = await fetch(`http://10.0.2.2:3000/car-expenses/${expenseId}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });

            if (response.ok) {
              setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
              setAlertConfig(null);
              return;
            }
          }

          // Fallback to local update
          const updatedExpenses = expenses.filter(exp => exp.id !== expenseId);
          if (carId) {
            await AsyncStorage.setItem(`car_expenses_${carId}`, JSON.stringify(updatedExpenses));
          }
          setExpenses(updatedExpenses);
          setAlertConfig(null);

        } catch (error) {
          console.error('Error deleting expense:', error);
          setAlertConfig({
            visible: true,
            title: 'Error',
            message: 'Failed to delete expense',
            type: 'error',
            buttonType: 'single',
            onClose: () => setAlertConfig(null)
          });
        }
      }
    });
  };

  const getCategoryIcon = (category: ExpenseCategory) => {
    const icons: Record<ExpenseCategory, string> = {
      MAINTENANCE: 'build-outline',
      REPAIR: 'hammer-outline',
      FUEL: 'water-outline',
      INSURANCE: 'shield-checkmark-outline',
      REGISTRATION: 'document-text-outline',
      TIRES: 'hardware-chip-outline',
      PARTS: 'cog-outline',
      WASHING: 'sparkles-outline',
      PARKING: 'car-outline',
      TOLLS: 'cash-outline',
      FINES: 'warning-outline',
      OTHER: 'ellipsis-horizontal-outline',
    };
    return icons[category] || 'cash-outline';
  };

  const getCategoryColor = (category: ExpenseCategory) => {
    const colors: Record<ExpenseCategory, string> = {
      MAINTENANCE: Colors.primary,
      REPAIR: Colors.danger,
      FUEL: Colors.warning,
      INSURANCE: Colors.success,
      REGISTRATION: Colors.info || Colors.primary,
      TIRES: Colors.neutral600,
      PARTS: Colors.neutral700,
      WASHING: Colors.secondary || Colors.primary,
      PARKING: Colors.neutral500,
      TOLLS: Colors.neutral600,
      FINES: Colors.danger,
      OTHER: Colors.neutral600,
    };
    return colors[category] || Colors.primary;
  };

  const getTotalAmount = () => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const renderExpenseItem = ({ item }: { item: CarExpense }) => (
    <View style={styles.expenseItem}>
      <View style={styles.expenseHeader}>
        <View style={styles.categoryIcon}>
          <Icon name={getCategoryIcon(item.category)} size={20} color={getCategoryColor(item.category)} />
        </View>
        <View style={styles.expenseInfo}>
          <Text style={styles.expenseDescription}>{item.description}</Text>
          <Text style={styles.expenseMeta}>
            {new Date(item.date).toLocaleDateString()}
            {item.provider && ` • ${item.provider}`}
          </Text>
        </View>
        <View style={styles.expenseAmount}>
          <Text style={styles.amountText}>${item.amount.toFixed(2)}</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteExpense(item.id)}
          >
            <Icon name="trash-outline" size={16} color={Colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
      {item.notes && (
        <Text style={styles.expenseNotes}>{item.notes}</Text>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header
          icon="back"
          name="Car Expenses"
          image=""
        />
        <LoadingComponent
          loadingText="Loading expenses..."
          size="medium"
          containerStyle={styles.loadingContainer}
          textStyle={styles.loadingText}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        icon="back"
        name="Car Expenses"
        image=""
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Expense Summary</Text>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{filteredExpenses.length}</Text>
              <Text style={styles.statLabel}>Total Expenses</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>${getTotalAmount().toFixed(2)}</Text>
              <Text style={styles.statLabel}>Total Amount</Text>
            </View>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filtersCard}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search expenses..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilter}>
            {(['ALL', 'MAINTENANCE', 'REPAIR', 'FUEL', 'INSURANCE', 'REGISTRATION', 'TIRES', 'PARTS', 'WASHING', 'PARKING', 'TOLLS', 'FINES', 'OTHER'] as const).map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonSelected
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryButtonText,
                  selectedCategory === category && styles.categoryButtonTextSelected
                ]}>
                  {category === 'ALL' ? 'All' : category.charAt(0) + category.slice(1).toLowerCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Add Expense Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddExpenseModal(true)}
        >
          <Icon name="add-circle" size={24} color={Colors.neutral0} />
          <Text style={styles.addButtonText}>Add New Expense</Text>
        </TouchableOpacity>

        {/* Expenses List */}
        {filteredExpenses.length > 0 ? (
          <FlatList
            data={filteredExpenses}
            renderItem={renderExpenseItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        ) : (
          <View style={styles.emptyState}>
            <Icon name="cash-outline" size={64} color={Colors.neutral400} />
            <Text style={styles.emptyStateText}>No expenses found</Text>
            <Text style={styles.emptyStateSubtext}>
              {selectedCategory !== 'ALL' || searchQuery
                ? 'Try adjusting your filters'
                : 'Add your first expense to start tracking'
              }
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add Expense Modal */}
      <Modal visible={showAddExpenseModal} animationType="slide" presentationStyle="formSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddExpenseModal(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Expense</Text>
            <TouchableOpacity onPress={addExpense} disabled={isSubmitting}>
              <Text style={[styles.modalSaveText, isSubmitting && styles.disabledText]}>
                {isSubmitting ? 'Adding...' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Category *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categorySelector}>
                {(['MAINTENANCE', 'REPAIR', 'FUEL', 'INSURANCE', 'REGISTRATION', 'TIRES', 'PARTS', 'WASHING', 'PARKING', 'TOLLS', 'FINES', 'OTHER'] as ExpenseCategory[]).map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryOption,
                      newExpenseCategory === category && styles.categoryOptionSelected
                    ]}
                    onPress={() => setNewExpenseCategory(category)}
                  >
                    <Icon name={getCategoryIcon(category)} size={20} color={newExpenseCategory === category ? Colors.neutral0 : getCategoryColor(category)} />
                    <Text style={[
                      styles.categoryOptionText,
                      newExpenseCategory === category && styles.categoryOptionTextSelected
                    ]}>
                      {category.charAt(0) + category.slice(1).toLowerCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Description *</Text>
              <TextInput
                style={styles.formInput}
                value={newExpenseDescription}
                onChangeText={setNewExpenseDescription}
                placeholder="e.g., Oil change at Quick Lube"
                maxLength={200}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Amount *</Text>
              <TextInput
                style={styles.formInput}
                value={newExpenseAmount}
                onChangeText={setNewExpenseAmount}
                placeholder="0.00"
                keyboardType="decimal-pad"
                maxLength={10}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Date *</Text>
              <TextInput
                style={styles.formInput}
                value={newExpenseDate}
                onChangeText={setNewExpenseDate}
                placeholder="YYYY-MM-DD"
                maxLength={10}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Provider</Text>
              <TextInput
                style={styles.formInput}
                value={newExpenseProvider}
                onChangeText={setNewExpenseProvider}
                placeholder="e.g., Quick Lube Auto Service"
                maxLength={100}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Notes</Text>
              <TextInput
                style={[styles.formInput, styles.notesInput]}
                value={newExpenseNotes}
                onChangeText={setNewExpenseNotes}
                placeholder="Additional notes..."
                multiline
                numberOfLines={3}
                maxLength={500}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
      {alertConfig && (
        <CustomAlert
          {...alertConfig}
        />
      )}
    </View>
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
  summaryCard: {
    backgroundColor: Colors.neutral0,
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral900,
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral900,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.neutral600,
    marginTop: 4,
  },
  filtersCard: {
    backgroundColor: Colors.neutral0,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.neutral900,
    backgroundColor: Colors.neutral50,
    marginBottom: 16,
  },
  categoryFilter: {
    flexDirection: 'row',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.neutral0,
    marginRight: 8,
  },
  categoryButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    color: Colors.neutral700,
    fontWeight: '500',
  },
  categoryButtonTextSelected: {
    color: Colors.neutral0,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: Colors.neutral0,
    fontSize: 16,
    fontWeight: '600',
  },
  expenseItem: {
    backgroundColor: Colors.neutral0,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
  },
  expenseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 4,
  },
  expenseMeta: {
    fontSize: 12,
    color: Colors.neutral600,
  },
  expenseAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.neutral900,
    marginBottom: 4,
  },
  deleteButton: {
    padding: 4,
  },
  expenseNotes: {
    fontSize: 14,
    color: Colors.neutral700,
    marginTop: 8,
    paddingLeft: 52,
  },
  separator: {
    height: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
    marginHorizontal: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral600,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.neutral500,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.neutral50,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral100,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral900,
  },
  modalCancelText: {
    fontSize: 16,
    color: Colors.neutral600,
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  disabledText: {
    color: Colors.neutral400,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral700,
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.neutral900,
    backgroundColor: Colors.neutral0,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  categorySelector: {
    flexDirection: 'row',
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.neutral0,
    marginRight: 8,
    gap: 8,
  },
  categoryOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryOptionText: {
    fontSize: 14,
    color: Colors.neutral700,
    fontWeight: '500',
  },
  categoryOptionTextSelected: {
    color: Colors.neutral0,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.neutral600,
    fontWeight: '500',
  },
});

export default CarExpensesPage;