import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Modal,
  TextInput,
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

// Parts Selection Card Component
const PartsSelectionCard = ({ part, onToggleSelect, onQuantityChange, onNotesChange }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <View style={styles.partCard}>
      <View style={styles.partHeader}>
        <TouchableOpacity 
          style={styles.selectButton}
          onPress={() => onToggleSelect(part.id)}
        >
          <Icon 
            name={part.selected ? "checkmark-circle" : "ellipse-outline"} 
            size={24} 
            color={part.selected ? Colors.primary : Colors.neutral400} 
          />
        </TouchableOpacity>
        
        <View style={styles.partInfo}>
          <Text style={styles.partName}>{part.name}</Text>
          <Text style={styles.partDescription}>{part.description}</Text>
          <View style={styles.partMeta}>
            <Text style={styles.partPrice}>${part.price}</Text>
            <Text style={styles.partStock}>Stock: {part.stock}</Text>
          </View>
        </View>
        
        <View style={styles.partActions}>
          <PriorityBadge priority={part.priority} />
          <TouchableOpacity 
            style={styles.detailsButton}
            onPress={() => setShowDetails(!showDetails)}
          >
            <Icon 
              name={showDetails ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={Colors.neutral600} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {showDetails && (
        <View style={styles.partDetails}>
          <Text style={styles.detailsTitle}>Part Details</Text>
          <Text style={styles.detailsText}>Part Number: {part.partNumber}</Text>
          <Text style={styles.detailsText}>Labor Time: {part.laborTime}</Text>
          <Text style={styles.detailsText}>Warranty: {part.warranty}</Text>
          
          {part.selected && (
            <View style={styles.selectionOptions}>
              <View style={styles.quantitySection}>
                <Text style={styles.quantityLabel}>Quantity:</Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => onQuantityChange(part.id, Math.max(1, part.quantity - 1))}
                  >
                    <Icon name="remove" size={20} color={Colors.primary} />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{part.quantity}</Text>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => onQuantityChange(part.id, part.quantity + 1)}
                  >
                    <Icon name="add" size={20} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.notesButton}
                onPress={() => onNotesChange(part.id)}
              >
                <Icon name="create-outline" size={16} color={Colors.primary} />
                <Text style={styles.notesButtonText}>
                  {part.notes ? 'Edit Notes' : 'Add Notes'}
                </Text>
              </TouchableOpacity>
              
              {part.notes && (
                <View style={styles.notesDisplay}>
                  <Text style={styles.notesLabel}>Notes:</Text>
                  <Text style={styles.notesText}>{part.notes}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

// Service Category Component
const ServiceCategory = ({ category, parts, onToggleSelect, onQuantityChange, onNotesChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const selectedCount = parts.filter(part => part.selected).length;
  const totalCount = parts.length;

  return (
    <View style={styles.categoryContainer}>
      <TouchableOpacity 
        style={styles.categoryHeader}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Icon name="construct-outline" size={20} color={Colors.primary} />
        <Text style={styles.categoryTitle}>{category}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{selectedCount}/{totalCount}</Text>
        </View>
        <Icon 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={Colors.neutral600} 
        />
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.categoryParts}>
          {parts.map((part) => (
            <PartsSelectionCard
              key={part.id}
              part={part}
              onToggleSelect={onToggleSelect}
              onQuantityChange={onQuantityChange}
              onNotesChange={onNotesChange}
            />
          ))}
        </View>
      )}
    </View>
  );
};

// Notes Modal Component
const NotesModal = ({ visible, onClose, onSave, currentNote, partName }) => {
  const [noteText, setNoteText] = useState(currentNote || '');

  useEffect(() => {
    setNoteText(currentNote || '');
  }, [currentNote]);

  const handleSave = () => {
    onSave(noteText);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Notes for {partName}</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={Colors.neutral600} />
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={styles.noteInput}
            placeholder="Enter installation notes, special instructions, or observations..."
            value={noteText}
            onChangeText={setNoteText}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
          
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
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

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPartId, setSelectedPartId] = useState(null);
  const [selectedPartName, setSelectedPartName] = useState('');
  const [partsData, setPartsData] = useState({
    'Brake System': [
      {
        id: 'brake_pads_front',
        name: 'Front Brake Pads',
        description: 'OEM quality ceramic brake pads',
        price: '89.99',
        stock: 12,
        priority: 'critical',
        partNumber: 'BP-F-2024',
        laborTime: '1.5 hours',
        warranty: '2 years',
        selected: false,
        quantity: 1,
        notes: null,
      },
      {
        id: 'brake_discs_front',
        name: 'Front Brake Discs',
        description: 'Vented brake discs for improved cooling',
        price: '159.99',
        stock: 8,
        priority: 'critical',
        partNumber: 'BD-F-2024',
        laborTime: '2 hours',
        warranty: '3 years',
        selected: false,
        quantity: 2,
        notes: null,
      },
      {
        id: 'brake_fluid',
        name: 'Brake Fluid',
        description: 'DOT 4 brake fluid',
        price: '24.99',
        stock: 25,
        priority: 'recommended',
        partNumber: 'BF-DOT4',
        laborTime: '0.5 hours',
        warranty: '1 year',
        selected: false,
        quantity: 1,
        notes: null,
      },
    ],
    'Engine & Fluids': [
      {
        id: 'oil_filter',
        name: 'Oil Filter',
        description: 'High-efficiency oil filter',
        price: '15.99',
        stock: 50,
        priority: 'recommended',
        partNumber: 'OF-2024',
        laborTime: '0.3 hours',
        warranty: '1 year',
        selected: false,
        quantity: 1,
        notes: null,
      },
      {
        id: 'engine_oil',
        name: 'Engine Oil (5W-30)',
        description: 'Full synthetic motor oil',
        price: '45.99',
        stock: 30,
        priority: 'recommended',
        partNumber: 'EO-5W30',
        laborTime: '0.2 hours',
        warranty: '6 months',
        selected: false,
        quantity: 1,
        notes: null,
      },
      {
        id: 'coolant',
        name: 'Engine Coolant',
        description: 'Long-life antifreeze coolant',
        price: '29.99',
        stock: 20,
        priority: 'optional',
        partNumber: 'EC-LL',
        laborTime: '0.5 hours',
        warranty: '2 years',
        selected: false,
        quantity: 1,
        notes: null,
      },
    ],
    'Tires & Wheels': [
      {
        id: 'tire_front_left',
        name: 'Front Left Tire',
        description: 'All-season radial tire',
        price: '120.00',
        stock: 15,
        priority: 'critical',
        partNumber: 'T-AS-205',
        laborTime: '0.5 hours',
        warranty: '5 years',
        selected: false,
        quantity: 1,
        notes: null,
      },
      {
        id: 'wheel_alignment',
        name: 'Wheel Alignment Service',
        description: 'Complete 4-wheel alignment',
        price: '79.99',
        stock: 999,
        priority: 'recommended',
        partNumber: 'WA-SERVICE',
        laborTime: '1 hour',
        warranty: '6 months',
        selected: false,
        quantity: 1,
        notes: null,
      },
    ],
    'Electrical': [
      {
        id: 'battery',
        name: 'Car Battery',
        description: 'AGM battery with 3-year warranty',
        price: '149.99',
        stock: 10,
        priority: 'optional',
        partNumber: 'BAT-AGM-12V',
        laborTime: '0.5 hours',
        warranty: '3 years',
        selected: false,
        quantity: 1,
        notes: null,
      },
      {
        id: 'headlight_bulb',
        name: 'Headlight Bulb',
        description: 'LED headlight bulb',
        price: '35.99',
        stock: 40,
        priority: 'recommended',
        partNumber: 'HB-LED-H7',
        laborTime: '0.3 hours',
        warranty: '2 years',
        selected: false,
        quantity: 2,
        notes: null,
      },
    ],
  });

  const handleToggleSelect = (partId) => {
    setPartsData(prevData => {
      const newData = { ...prevData };
      Object.keys(newData).forEach(category => {
        newData[category] = newData[category].map(part => 
          part.id === partId ? { ...part, selected: !part.selected } : part
        );
      });
      return newData;
    });
  };

  const handleQuantityChange = (partId, newQuantity) => {
    setPartsData(prevData => {
      const newData = { ...prevData };
      Object.keys(newData).forEach(category => {
        newData[category] = newData[category].map(part => 
          part.id === partId ? { ...part, quantity: newQuantity } : part
        );
      });
      return newData;
    });
  };

  const handleNotesChange = (partId) => {
    let currentNotes = null;
    let partName = '';
    
    Object.values(partsData).forEach(category => {
      category.forEach(part => {
        if (part.id === partId) {
          currentNotes = part.notes;
          partName = part.name;
        }
      });
    });
    
    setSelectedPartId(partId);
    setSelectedPartName(partName);
    setModalVisible(true);
  };

  const handleSaveNotes = (notes) => {
    setPartsData(prevData => {
      const newData = { ...prevData };
      Object.keys(newData).forEach(category => {
        newData[category] = newData[category].map(part => 
          part.id === selectedPartId ? { ...part, notes: notes } : part
        );
      });
      return newData;
    });
  };

  const calculateEstimate = () => {
    let totalParts = 0;
    let totalLabor = 0;
    let selectedItems = 0;
    let criticalItems = 0;
    let recommendedItems = 0;

    Object.values(partsData).forEach(category => {
      category.forEach(part => {
        if (part.selected) {
          selectedItems++;
          totalParts += parseFloat(part.price) * part.quantity;
          
          // Calculate labor cost (assuming $100/hour)
          const laborHours = parseFloat(part.laborTime);
          totalLabor += laborHours * 100;
          
          if (part.priority === 'critical') criticalItems++;
          if (part.priority === 'recommended') recommendedItems++;
        }
      });
    });

    return {
      totalParts,
      totalLabor,
      total: totalParts + totalLabor,
      selectedItems,
      criticalItems,
      recommendedItems,
    };
  };

  const handleProceedToService = () => {
    const estimate = calculateEstimate();
    
    if (estimate.selectedItems === 0) {
      Alert.alert(
        'No Parts Selected',
        'Please select at least one part to proceed.',
        [{ text: 'OK' }]
      );
      return;
    }

    const selectedParts = [];
    Object.entries(partsData).forEach(([category, parts]) => {
      parts.forEach(part => {
        if (part.selected) {
          selectedParts.push({ ...part, category });
        }
      });
    });

    Alert.alert(
      'Confirm Service',
      `Proceed with ${estimate.selectedItems} selected parts?\n\nTotal Estimate: ${estimate.total.toFixed(2)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Proceed', 
          onPress: () => navigation.navigate('ServiceExecutionScreen', { 
            workOrder,
            selectedParts,
            estimate
          })
        },
      ]
    );
  };

  const estimate = calculateEstimate();

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon="chevron-back"
        name="Parts & Services"
        onIconPress={() => navigation.goBack()}
      />
      
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Service Estimate</Text>
        <View style={styles.summaryStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{estimate.selectedItems}</Text>
            <Text style={styles.statLabel}>Selected</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: Colors.danger }]}>
              {estimate.criticalItems}
            </Text>
            <Text style={styles.statLabel}>Critical</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: Colors.warning }]}>
              {estimate.recommendedItems}
            </Text>
            <Text style={styles.statLabel}>Recommended</Text>
          </View>
        </View>
        
        <View style={styles.estimateBreakdown}>
          <View style={styles.estimateRow}>
            <Text style={styles.estimateLabel}>Parts:</Text>
            <Text style={styles.estimateValue}>${estimate.totalParts.toFixed(2)}</Text>
          </View>
          <View style={styles.estimateRow}>
            <Text style={styles.estimateLabel}>Labor:</Text>
            <Text style={styles.estimateValue}>${estimate.totalLabor.toFixed(2)}</Text>
          </View>
          <View style={[styles.estimateRow, styles.estimateTotal]}>
            <Text style={styles.estimateTotalLabel}>Total:</Text>
            <Text style={styles.estimateTotalValue}>${estimate.total.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {Object.entries(partsData).map(([category, parts]) => (
          <ServiceCategory
            key={category}
            category={category}
            parts={parts}
            onToggleSelect={handleToggleSelect}
            onQuantityChange={handleQuantityChange}
            onNotesChange={handleNotesChange}
          />
        ))}
      </ScrollView>

      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={[
            styles.proceedButton,
            estimate.selectedItems === 0 && styles.proceedButtonDisabled
          ]}
          onPress={handleProceedToService}
          disabled={estimate.selectedItems === 0}
        >
          <Icon name="construct-outline" size={20} color={Colors.neutral0} />
          <Text style={styles.proceedButtonText}>Proceed to Service</Text>
        </TouchableOpacity>
      </View>

      <NotesModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveNotes}
        currentNote={selectedPartId ? partsData[Object.keys(partsData).find(cat => 
          partsData[cat].find(part => part.id === selectedPartId)
        )]?.find(part => part.id === selectedPartId)?.notes : null}
        partName={selectedPartName}
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
    marginBottom: 16,
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
  estimateBreakdown: {
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
    paddingTop: 12,
  },
  estimateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  estimateLabel: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  estimateValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral1000,
  },
  estimateTotal: {
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
    paddingTop: 8,
    marginTop: 8,
  },
  estimateTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  estimateTotalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral0,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    gap: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.neutral0,
  },
  categoryParts: {
    paddingTop: 8,
  },
  partCard: {
    backgroundColor: Colors.neutral0,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    overflow: 'hidden',
  },
  partHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  selectButton: {
    padding: 4,
  },
  partInfo: {
    flex: 1,
  },
  partName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  partDescription: {
    fontSize: 14,
    color: Colors.neutral600,
    marginTop: 2,
  },
  partMeta: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
  },
  partPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  partStock: {
    fontSize: 12,
    color: Colors.neutral600,
  },
  partActions: {
    alignItems: 'center',
    gap: 8,
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
  detailsButton: {
    padding: 4,
  },
  partDetails: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 8,
  },
  detailsText: {
    fontSize: 12,
    color: Colors.neutral600,
    marginBottom: 4,
  },
  selectionOptions: {
    marginTop: 12,
    padding: 12,
    backgroundColor: Colors.neutral50,
    borderRadius: 8,
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral1000,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.neutral0,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
    minWidth: 30,
    textAlign: 'center',
  },
  notesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  notesButtonText: {
    fontSize: 14,
    color: Colors.primary,
  },
  notesDisplay: {
    padding: 8,
    backgroundColor: Colors.neutral0,
    borderRadius: 6,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.neutral600,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: Colors.neutral1000,
  },
  actionContainer: {
    padding: 20,
    backgroundColor: Colors.neutral0,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  proceedButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  proceedButtonDisabled: {
    backgroundColor: Colors.neutral400,
  },
  proceedButtonText: {
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
    flex: 1,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: Colors.neutral1000,
    minHeight: 120,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
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

export default PartsReplacementScreen;