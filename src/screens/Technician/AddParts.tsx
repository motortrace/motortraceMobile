import React, { useState, useEffect } from 'react';
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
  Image,
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
      case 'urgent': return '#EF4444';
      case 'high': return '#F59E0B';
      case 'medium': return '#3B82F6';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'urgent': return 'Urgent';
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return 'Unknown';
    }
  };

  return (
    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(priority) }]}>
      <Text style={styles.priorityText}>{getPriorityText(priority)}</Text>
    </View>
  );
};

// Availability Status Component
const AvailabilityStatus = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'in_stock': return '#10B981';
      case 'order_required': return '#F59E0B';
      case 'back_order': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'in_stock': return 'In Stock';
      case 'order_required': return 'Order Required';
      case 'back_order': return 'Back Order';
      default: return 'Unknown';
    }
  };

  return (
    <View style={[styles.availabilityBadge, { backgroundColor: getStatusColor(status) }]}>
      <Text style={styles.availabilityText}>{getStatusText(status)}</Text>
    </View>
  );
};

// Part Card Component
const PartCard = ({ part, onEdit, onDelete }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const totalCost = part.unitPrice * part.quantity;

  return (
    <View style={styles.partCard}>
      <View style={styles.partHeader}>
        <View style={styles.partInfo}>
          <Text style={styles.partName}>{part.partName}</Text>
          <Text style={styles.partNumber}>Part #: {part.partNumber}</Text>
          <Text style={styles.partCategory}>{part.category}</Text>
        </View>
        <View style={styles.partActions}>
          <PriorityBadge priority={part.priority} />
          <TouchableOpacity onPress={() => onEdit(part.id)} style={styles.actionButton}>
            <Icon name="create-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(part.id)} style={styles.actionButton}>
            <Icon name="trash-outline" size={20} color={Colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
      
      {part.description && (
        <Text style={styles.partDescription}>{part.description}</Text>
      )}
      
      <View style={styles.partDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Quantity:</Text>
          <Text style={styles.detailValue}>{part.quantity}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Unit Price:</Text>
          <Text style={styles.detailValue}>{formatCurrency(part.unitPrice)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total Cost:</Text>
          <Text style={[styles.detailValue, styles.totalCost]}>{formatCurrency(totalCost)}</Text>
        </View>
      </View>

      <View style={styles.partFooter}>
        <AvailabilityStatus status={part.availability} />
        {part.supplier && (
          <Text style={styles.supplierText}>Supplier: {part.supplier}</Text>
        )}
        <Text style={styles.partDate}>
          {new Date(part.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
};

// Add/Edit Part Modal Component
const PartModal = ({ visible, onClose, onSave, part }) => {
  const [partName, setPartName] = useState(part?.partName || '');
  const [partNumber, setPartNumber] = useState(part?.partNumber || '');
  const [category, setCategory] = useState(part?.category || '');
  const [description, setDescription] = useState(part?.description || '');
  const [quantity, setQuantity] = useState(part?.quantity?.toString() || '1');
  const [unitPrice, setUnitPrice] = useState(part?.unitPrice?.toString() || '');
  const [priority, setPriority] = useState(part?.priority || 'medium');
  const [availability, setAvailability] = useState(part?.availability || 'in_stock');
  const [supplier, setSupplier] = useState(part?.supplier || '');
  const [estimatedDelivery, setEstimatedDelivery] = useState(part?.estimatedDelivery || '');
  
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);
  const [showAvailabilityPicker, setShowAvailabilityPicker] = useState(false);

  const categories = [
    'Engine Parts',
    'Brake System',
    'Suspension',
    'Transmission',
    'Electrical',
    'Cooling System',
    'Exhaust System',
    'Filters',
    'Belts & Hoses',
    'Tires',
    'Body Parts',
    'Interior',
    'Fluids',
    'Hardware',
    'Other'
  ];

  const priorities = [
    { value: 'urgent', label: 'Urgent - Safety Critical', color: '#EF4444' },
    { value: 'high', label: 'High Priority', color: '#F59E0B' },
    { value: 'medium', label: 'Medium Priority', color: '#3B82F6' },
    { value: 'low', label: 'Low Priority', color: '#10B981' }
  ];

  const availabilityOptions = [
    { value: 'in_stock', label: 'In Stock', color: '#10B981' },
    { value: 'order_required', label: 'Order Required', color: '#F59E0B' },
    { value: 'back_order', label: 'Back Order', color: '#EF4444' }
  ];

  const handleSave = () => {
    if (!partName.trim() || !partNumber.trim() || !category.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const qty = parseInt(quantity) || 1;
    const price = parseFloat(unitPrice) || 0;
    
    if (qty < 1) {
      Alert.alert('Error', 'Quantity must be at least 1');
      return;
    }

    if (price < 0) {
      Alert.alert('Error', 'Unit price cannot be negative');
      return;
    }

    const partData = {
      id: part?.id || Date.now().toString(),
      partName: partName.trim(),
      partNumber: partNumber.trim(),
      category: category.trim(),
      description: description.trim(),
      quantity: qty,
      unitPrice: price,
      priority,
      availability,
      supplier: supplier.trim(),
      estimatedDelivery: estimatedDelivery.trim(),
      createdAt: part?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(partData);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setPartName('');
    setPartNumber('');
    setCategory('');
    setDescription('');
    setQuantity('1');
    setUnitPrice('');
    setPriority('medium');
    setAvailability('in_stock');
    setSupplier('');
    setEstimatedDelivery('');
  };

  const handleClose = () => {
    if (part) {
      onClose();
    } else {
      resetForm();
      onClose();
    }
  };

  const totalCost = (parseFloat(unitPrice) || 0) * (parseInt(quantity) || 1);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {part ? 'Edit Part' : 'Add New Part'}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Icon name="close" size={24} color={Colors.neutral600} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Part Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Brake Pads Front Set"
                value={partName}
                onChangeText={setPartName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Part Number *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., BP-2024-FR"
                value={partNumber}
                onChangeText={setPartNumber}
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

            <View style={styles.InputColumn}>
              <View style={[styles.inputGroup, styles.inputHalf]}>
                <Text style={styles.inputLabel}>Quantity *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="1"
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={[styles.inputGroup, styles.inputHalf]}>
                <Text style={styles.inputLabel}>Unit Price ($) *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="0.00"
                  value={unitPrice}
                  onChangeText={setUnitPrice}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {totalCost > 0 && (
              <View style={styles.totalCostDisplay}>
                <Text style={styles.totalCostLabel}>Total Cost: </Text>
                <Text style={styles.totalCostValue}>
                  ${totalCost.toFixed(2)}
                </Text>
              </View>
            )}

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
              <Text style={styles.inputLabel}>Availability *</Text>
              <TouchableOpacity 
                style={styles.picker}
                onPress={() => setShowAvailabilityPicker(!showAvailabilityPicker)}
              >
                <View style={styles.priorityPickerContent}>
                  <View style={[styles.priorityDot, { backgroundColor: availabilityOptions.find(a => a.value === availability)?.color }]} />
                  <Text style={styles.pickerText}>
                    {availabilityOptions.find(a => a.value === availability)?.label}
                  </Text>
                </View>
                <Icon name="chevron-down" size={20} color={Colors.neutral600} />
              </TouchableOpacity>
              
              {showAvailabilityPicker && (
                <View style={styles.pickerOptions}>
                  {availabilityOptions.map((avail) => (
                    <TouchableOpacity
                      key={avail.value}
                      style={styles.pickerOption}
                      onPress={() => {
                        setAvailability(avail.value);
                        setShowAvailabilityPicker(false);
                      }}
                    >
                      <View style={styles.priorityPickerContent}>
                        <View style={[styles.priorityDot, { backgroundColor: avail.color }]} />
                        <Text style={styles.pickerOptionText}>{avail.label}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Supplier</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., AutoParts Inc."
                value={supplier}
                onChangeText={setSupplier}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Estimated Delivery</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., 2-3 business days"
                value={estimatedDelivery}
                onChangeText={setEstimatedDelivery}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description/Notes</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Additional notes about this part..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
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
                {part ? 'Update' : 'Add'} Part
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Main Parts Replacement Screen Component
const PartsReplacementScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { workOrder, inspectionResults } = route.params || {};

  const [parts, setParts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPart, setEditingPart] = useState(null);

  // Auto-populate parts from inspection results if available
  useEffect(() => {
    if (inspectionResults && parts.length === 0) {
      // This would typically generate suggested parts based on inspection problems
      // For now, we'll show an empty state
    }
  }, [inspectionResults]);

  const handleAddPart = () => {
    setEditingPart(null);
    setModalVisible(true);
  };

  const handleEditPart = (partId) => {
    const part = parts.find(p => p.id === partId);
    setEditingPart(part);
    setModalVisible(true);
  };

  const handleDeletePart = (partId) => {
    Alert.alert(
      'Delete Part',
      'Are you sure you want to remove this part?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setParts(prev => prev.filter(p => p.id !== partId));
          }
        },
      ]
    );
  };

  const handleSavePart = (partData) => {
    if (editingPart) {
      setParts(prev => prev.map(p => 
        p.id === partData.id ? partData : p
      ));
    } else {
      setParts(prev => [...prev, partData]);
    }
  };

  const getPartsSummary = () => {
    const totalParts = parts.length;
    const totalItems = parts.reduce((sum, p) => sum + p.quantity, 0);
    const totalCost = parts.reduce((sum, p) => sum + (p.unitPrice * p.quantity), 0);
    const urgentParts = parts.filter(p => p.priority === 'urgent').length;
    const backOrderParts = parts.filter(p => p.availability === 'back_order').length;
    const inStockParts = parts.filter(p => p.availability === 'in_stock').length;

    return {
      totalParts,
      totalItems,
      totalCost,
      urgentParts,
      backOrderParts,
      inStockParts
    };
  };

  const handleGenerateOrder = () => {
    const summary = getPartsSummary();
    
    if (summary.totalParts === 0) {
      Alert.alert(
        'No Parts Added',
        'Please add parts that need to be replaced before generating an order.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Generate Parts Order',
      `Generate order for ${summary.totalParts} parts (${summary.totalItems} items) totaling $${summary.totalCost.toFixed(2)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Generate Order', 
          onPress: () => navigation.navigate('OrderSummaryScreen', { 
            workOrder, 
            parts,
            orderSummary: summary
          })
        },
      ]
    );
  };

  const summary = getPartsSummary();

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon="back"
        name="Parts Replacement"
        onIconPress={() => navigation.goBack()}
      />
      
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Parts Summary</Text>
        <View style={styles.summaryStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{summary.totalParts}</Text>
            <Text style={styles.statLabel}>Parts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: Colors.danger }]}>{summary.urgentParts}</Text>
            <Text style={styles.statLabel}>Urgent</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>${summary.totalCost.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Total Cost</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Required Parts</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPart}>
          <Icon name="add" size={20} color={Colors.neutral0} />
          <Text style={styles.addButtonText}>Add Part</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {parts.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="construct-outline" size={64} color={Colors.neutral400} />
            <Text style={styles.emptyStateTitle}>No Parts Added</Text>
            <Text style={styles.emptyStateText}>
              Add parts that need to be replaced for this vehicle
            </Text>
          </View>
        ) : (
          parts.map((part) => (
            <PartCard
              key={part.id}
              part={part}
              onEdit={handleEditPart}
              onDelete={handleDeletePart}
            />
          ))
        )}
      </ScrollView>

      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={styles.generateButton}
          onPress={handleGenerateOrder}
        >
          <Icon name="receipt-outline" size={20} color={Colors.neutral0} />
          <Text style={styles.generateButtonText}>Generate Parts Order</Text>
        </TouchableOpacity>
      </View>

      <PartModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSavePart}
        part={editingPart}
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
  partCard: {
    backgroundColor: Colors.neutral0,
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  partHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  partInfo: {
    flex: 1,
  },
  partName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  partNumber: {
    fontSize: 12,
    color: Colors.neutral600,
    marginTop: 2,
  },
  partCategory: {
    fontSize: 14,
    color: Colors.neutral700,
    marginTop: 2,
  },
  partActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  partDescription: {
    fontSize: 14,
    color: Colors.neutral800,
    lineHeight: 20,
    marginBottom: 12,
  },
  partDetails: {
    backgroundColor: Colors.neutral50,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  totalCost: {
    color: Colors.primary,
    fontSize: 16,
  },
  partFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  supplierText: {
    fontSize: 12,
    color: Colors.neutral600,
  },
  partDate: {
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
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  availabilityText: {
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
  generateButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  generateButtonText: {
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
    maxHeight: 500,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'column',
  },
  InputColumn: {
    flexDirection: 'row',
    gap: '12',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral800,
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.neutral300,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.neutral1000,
    backgroundColor: Colors.neutral0,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  
  // Input row layout
  inputHalf: {
    width: '48%',
  },
  
  // Picker styles
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.neutral300,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.neutral0,
  },
  pickerText: {
    fontSize: 14,
    color: Colors.neutral1000,
  },
  placeholderText: {
    color: Colors.neutral500,
  },
  pickerOptions: {
    borderWidth: 1,
    borderColor: Colors.neutral300,
    borderRadius: 8,
    backgroundColor: Colors.neutral0,
    marginTop: 4,
    maxHeight: 200,
  },
  pickerOption: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  pickerOptionText: {
    fontSize: 14,
    color: Colors.neutral1000,
  },
  
  // Priority picker specific styles
  priorityPickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  
  // Total cost display
  totalCostDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neutral100,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  totalCostLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral700,
  },
  totalCostValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  
  // Modal action buttons
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.neutral300,
    backgroundColor: Colors.neutral0,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral700,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral0,
  }
});

export default PartsReplacementScreen;