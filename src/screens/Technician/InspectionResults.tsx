import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
import Colors from '../../constants/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';

// Priority Badge Component
const PriorityBadge = ({ priority }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return '#EF4444';
      case 'recommended': return '#F59E0B';
      case 'optional': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'critical': return 'Critical';
      case 'recommended': return 'Recommended';
      case 'optional': return 'Optional';
      default: return 'Unknown';
    }
  };

  return (
    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(priority) }]}>
      <Text style={styles.priorityText}>{getPriorityText(priority)}</Text>
    </View>
  );
};

// Problem Card Component
const ProblemCard = ({ problem, onEdit, onDelete }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <View style={styles.problemCard}>
      <View style={styles.problemHeader}>
        <View style={styles.problemInfo}>
          <Text style={styles.problemTitle}>{problem.title}</Text>
          <Text style={styles.problemCategory}>{problem.category}</Text>
        </View>
        <View style={styles.problemActions}>
          <PriorityBadge priority={problem.priority} />
          <TouchableOpacity onPress={() => onEdit(problem.id)} style={styles.actionButton}>
            <Icon name="create-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(problem.id)} style={styles.actionButton}>
            <Icon name="trash-outline" size={20} color={Colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.problemDescription}>{problem.description}</Text>
      
      <View style={styles.problemFooter}>
        <View style={styles.costInfo}>
          <Text style={styles.costLabel}>Estimated Cost:</Text>
          <Text style={styles.costAmount}>{formatCurrency(problem.estimatedCost)}</Text>
        </View>
        <Text style={styles.problemDate}>
          {new Date(problem.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
};

// Add/Edit Problem Modal Component
const ProblemModal = ({ visible, onClose, onSave, problem }) => {
  const [title, setTitle] = useState(problem?.title || '');
  const [category, setCategory] = useState(problem?.category || '');
  const [description, setDescription] = useState(problem?.description || '');
  const [priority, setPriority] = useState(problem?.priority || 'optional');
  const [estimatedCost, setEstimatedCost] = useState(problem?.estimatedCost?.toString() || '');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);

  const categories = [
    'Engine & Transmission',
    'Brakes',
    'Suspension',
    'Wheels & Tires',
    'Electrical',
    'Cooling System',
    'Exhaust',
    'Body & Frame',
    'Interior',
    'Air Conditioning',
    'Other'
  ];

  const priorities = [
    { value: 'critical', label: 'Critical - Must Fix', color: '#EF4444' },
    { value: 'recommended', label: 'Recommended', color: '#F59E0B' },
    { value: 'optional', label: 'Optional', color: '#10B981' }
  ];

  const handleSave = () => {
    if (!title.trim() || !category.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const cost = parseFloat(estimatedCost) || 0;
    if (cost < 0) {
      Alert.alert('Error', 'Cost cannot be negative');
      return;
    }

    const problemData = {
      id: problem?.id || Date.now().toString(),
      title: title.trim(),
      category: category.trim(),
      description: description.trim(),
      priority,
      estimatedCost: cost,
      createdAt: problem?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(problemData);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setCategory('');
    setDescription('');
    setPriority('optional');
    setEstimatedCost('');
  };

  const handleClose = () => {
    if (problem) {
      // If editing, don't reset form
      onClose();
    } else {
      // If adding new, reset form
      resetForm();
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {problem ? 'Edit Problem' : 'Add New Problem'}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Icon name="close" size={24} color={Colors.neutral600} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Problem Title *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Brake pads worn out"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category *</Text>
              <TouchableOpacity 
                style={styles.picker}
                onPress={() => setShowCategoryPicker(!showCategoryPicker)}
              >
                <Text style={[styles.pickerText, !category && styles.placeholderText]}>
                  {category || 'Select category'}
                </Text>
                <Icon name="chevron-down" size={20} color={Colors.neutral600} />
              </TouchableOpacity>
              
              {showCategoryPicker && (
                <View style={styles.pickerOptions}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={styles.pickerOption}
                      onPress={() => {
                        setCategory(cat);
                        setShowCategoryPicker(false);
                      }}
                    >
                      <Text style={styles.pickerOptionText}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Priority *</Text>
              <TouchableOpacity 
                style={styles.picker}
                onPress={() => setShowPriorityPicker(!showPriorityPicker)}
              >
                <View style={styles.priorityPickerContent}>
                  <View style={[styles.priorityDot, { backgroundColor: priorities.find(p => p.value === priority)?.color }]} />
                  <Text style={styles.pickerText}>
                    {priorities.find(p => p.value === priority)?.label}
                  </Text>
                </View>
                <Icon name="chevron-down" size={20} color={Colors.neutral600} />
              </TouchableOpacity>
              
              {showPriorityPicker && (
                <View style={styles.pickerOptions}>
                  {priorities.map((prio) => (
                    <TouchableOpacity
                      key={prio.value}
                      style={styles.pickerOption}
                      onPress={() => {
                        setPriority(prio.value);
                        setShowPriorityPicker(false);
                      }}
                    >
                      <View style={styles.priorityPickerContent}>
                        <View style={[styles.priorityDot, { backgroundColor: prio.color }]} />
                        <Text style={styles.pickerOptionText}>{prio.label}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Estimated Cost ($)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="0.00"
                value={estimatedCost}
                onChangeText={setEstimatedCost}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Problem Description *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Describe the problem in detail..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>
          
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>
                {problem ? 'Update' : 'Add'} Problem
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Main Inspection Screen Component
const InspectionScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { workOrder } = route.params || {};

  const [problems, setProblems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);

  const handleAddProblem = () => {
    setEditingProblem(null);
    setModalVisible(true);
  };

  const handleEditProblem = (problemId) => {
    const problem = problems.find(p => p.id === problemId);
    setEditingProblem(problem);
    setModalVisible(true);
  };

  const handleDeleteProblem = (problemId) => {
    Alert.alert(
      'Delete Problem',
      'Are you sure you want to delete this problem?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setProblems(prev => prev.filter(p => p.id !== problemId));
          }
        },
      ]
    );
  };

  const handleSaveProblem = (problemData) => {
    if (editingProblem) {
      // Update existing problem
      setProblems(prev => prev.map(p => 
        p.id === problemData.id ? problemData : p
      ));
    } else {
      // Add new problem
      setProblems(prev => [...prev, problemData]);
    }
  };

  const getInspectionSummary = () => {
    const totalProblems = problems.length;
    const criticalProblems = problems.filter(p => p.priority === 'critical').length;
    const recommendedProblems = problems.filter(p => p.priority === 'recommended').length;
    const optionalProblems = problems.filter(p => p.priority === 'optional').length;
    const totalCost = problems.reduce((sum, p) => sum + p.estimatedCost, 0);

    return {
      totalProblems,
      criticalProblems,
      recommendedProblems,
      optionalProblems,
      totalCost
    };
  };

  const handleCompleteInspection = () => {
    const summary = getInspectionSummary();
    
    if (summary.totalProblems === 0) {
      Alert.alert(
        'No Problems Found',
        'No problems were documented during this inspection. The vehicle appears to be in good condition.',
        [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]
      );
      return;
    }

    Alert.alert(
      'Inspection Complete',
      `Found ${summary.totalProblems} problems with estimated cost of $${summary.totalCost.toFixed(2)}. Generate work order?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Generate Work Order', 
          onPress: () => navigation.navigate('WorkOrderGenerationScreen', { 
            workOrder, 
            inspectionProblems: problems 
          })
        },
      ]
    );
  };

  const summary = getInspectionSummary();

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon="back"
        name="Vehicle Inspection"
        onIconPress={() => navigation.goBack()}
      />
      
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Inspection Summary</Text>
        <View style={styles.summaryStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{summary.totalProblems}</Text>
            <Text style={styles.statLabel}>Problems</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: Colors.danger }]}>{summary.criticalProblems}</Text>
            <Text style={styles.statLabel}>Critical</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>${summary.totalCost.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Est. Cost</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Problems Found</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddProblem}>
          <Icon name="add" size={20} color={Colors.neutral0} />
          <Text style={styles.addButtonText}>Add Problem</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {problems.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="checkmark-circle-outline" size={64} color={Colors.neutral400} />
            <Text style={styles.emptyStateTitle}>No Problems Found</Text>
            <Text style={styles.emptyStateText}>
              Document any problems you find during the inspection
            </Text>
          </View>
        ) : (
          problems.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              onEdit={handleEditProblem}
              onDelete={handleDeleteProblem}
            />
          ))
        )}
      </ScrollView>

      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={styles.completeButton}
          onPress={handleCompleteInspection}
        >
          <Icon name="checkmark-circle-outline" size={20} color={Colors.neutral0} />
          <Text style={styles.completeButtonText}>Complete Inspection</Text>
        </TouchableOpacity>
      </View>

      <ProblemModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveProblem}
        problem={editingProblem}
      />
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
    paddingHorizontal: 20,
  },
  summaryCard: {
    backgroundColor: Colors.neutral0,
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 12,
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
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.neutral600,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  addButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral0,
  },
  problemCard: {
    backgroundColor: Colors.neutral0,
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  problemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  problemInfo: {
    flex: 1,
  },
  problemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  problemCategory: {
    fontSize: 14,
    color: Colors.neutral600,
    marginTop: 2,
  },
  problemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  problemDescription: {
    fontSize: 14,
    color: Colors.neutral800,
    lineHeight: 20,
    marginBottom: 12,
  },
  problemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  costLabel: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  costAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  problemDate: {
    fontSize: 12,
    color: Colors.neutral500,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.neutral0,
    textTransform: 'uppercase',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral600,
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.neutral500,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  actionContainer: {
    padding: 20,
    backgroundColor: Colors.neutral0,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  completeButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral0,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.neutral0,
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  modalBody: {
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral800,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Colors.neutral1000,
  },
  textArea: {
    minHeight: 80,
  },
  picker: {
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 14,
    color: Colors.neutral1000,
  },
  placeholderText: {
    color: Colors.neutral500,
  },
  priorityPickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  pickerOptions: {
    backgroundColor: Colors.neutral0,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
  },
  pickerOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral100,
  },
  pickerOptionText: {
    fontSize: 14,
    color: Colors.neutral1000,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.neutral100,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.neutral600,
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral0,
  },
});

export default InspectionScreen;