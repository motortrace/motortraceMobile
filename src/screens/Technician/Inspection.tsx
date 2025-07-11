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

// Inspection Item Card Component
const InspectionItemCard = ({ item, onStatusChange, onAddNote }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass': return { name: 'checkmark-circle', color: Colors.success };
      case 'fail': return { name: 'close-circle', color: Colors.danger };
      case 'needs_attention': return { name: 'warning', color: Colors.warning };
      default: return { name: 'ellipse-outline', color: Colors.neutral400 };
    }
  };

  const statusIcon = getStatusIcon(item.status);

  return (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <TouchableOpacity onPress={() => onStatusChange(item.id)}>
          <Icon name={statusIcon.name} size={24} color={statusIcon.color} />
        </TouchableOpacity>
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
        </View>
        {item.priority && <PriorityBadge priority={item.priority} />}
      </View>
      
      {item.notes && (
        <View style={styles.itemNotes}>
          <Text style={styles.notesLabel}>Notes:</Text>
          <Text style={styles.notesText}>{item.notes}</Text>
        </View>
      )}
      
      <TouchableOpacity 
        style={styles.addNoteButton}
        onPress={() => onAddNote(item.id)}
      >
        <Icon name="create-outline" size={16} color={Colors.primary} />
        <Text style={styles.addNoteText}>Add Note</Text>
      </TouchableOpacity>
    </View>
  );
};

// Inspection Category Component
const InspectionCategory = ({ category, items, onItemStatusChange, onAddNote }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <View style={styles.categoryContainer}>
      <TouchableOpacity 
        style={styles.categoryHeader}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Icon name="construct-outline" size={20} color={Colors.primary} />
        <Text style={styles.categoryTitle}>{category}</Text>
        <Icon 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={Colors.neutral600} 
        />
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.categoryItems}>
          {items.map((item) => (
            <InspectionItemCard
              key={item.id}
              item={item}
              onStatusChange={onItemStatusChange}
              onAddNote={onAddNote}
            />
          ))}
        </View>
      )}
    </View>
  );
};

// Add Note Modal Component
const AddNoteModal = ({ visible, onClose, onSave, currentNote }) => {
  const [noteText, setNoteText] = useState(currentNote || '');

  const handleSave = () => {
    onSave(noteText);
    setNoteText('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Inspection Note</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={Colors.neutral600} />
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={styles.noteInput}
            placeholder="Enter your inspection notes..."
            value={noteText}
            onChangeText={setNoteText}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Note</Text>
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

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [inspectionItems, setInspectionItems] = useState({
    'Engine & Fluids': [
      {
        id: 'engine_oil',
        title: 'Engine Oil',
        description: 'Check oil level and condition',
        status: 'pending',
        priority: null,
        notes: null,
      },
      {
        id: 'coolant',
        title: 'Coolant System',
        description: 'Check coolant level and leaks',
        status: 'pending',
        priority: null,
        notes: null,
      },
      {
        id: 'brake_fluid',
        title: 'Brake Fluid',
        description: 'Check brake fluid level and color',
        status: 'pending',
        priority: null,
        notes: null,
      },
    ],
    'Brakes': [
      {
        id: 'brake_pads',
        title: 'Brake Pads',
        description: 'Check brake pad thickness',
        status: 'pending',
        priority: null,
        notes: null,
      },
      {
        id: 'brake_discs',
        title: 'Brake Discs',
        description: 'Check disc condition and thickness',
        status: 'pending',
        priority: null,
        notes: null,
      },
      {
        id: 'brake_lines',
        title: 'Brake Lines',
        description: 'Check for leaks and damage',
        status: 'pending',
        priority: null,
        notes: null,
      },
    ],
    'Wheels & Tires': [
      {
        id: 'tire_tread',
        title: 'Tire Tread',
        description: 'Check tire tread depth',
        status: 'pending',
        priority: null,
        notes: null,
      },
      {
        id: 'tire_pressure',
        title: 'Tire Pressure',
        description: 'Check tire pressure',
        status: 'pending',
        priority: null,
        notes: null,
      },
      {
        id: 'wheel_alignment',
        title: 'Wheel Alignment',
        description: 'Check wheel alignment',
        status: 'pending',
        priority: null,
        notes: null,
      },
    ],
    'Lights & Electrical': [
      {
        id: 'headlights',
        title: 'Headlights',
        description: 'Check headlight operation',
        status: 'pending',
        priority: null,
        notes: null,
      },
      {
        id: 'taillights',
        title: 'Taillights',
        description: 'Check taillight operation',
        status: 'pending',
        priority: null,
        notes: null,
      },
      {
        id: 'battery',
        title: 'Battery',
        description: 'Check battery condition',
        status: 'pending',
        priority: null,
        notes: null,
      },
    ],
  });

  const handleItemStatusChange = (itemId) => {
    const statusOptions = ['pending', 'pass', 'fail', 'needs_attention'];
    const priorityOptions = [null, 'optional', 'recommended', 'critical'];
    
    Alert.alert(
      'Update Status',
      'Select the inspection result:',
      [
        { text: 'Pass', onPress: () => updateItemStatus(itemId, 'pass', null) },
        { text: 'Fail - Optional', onPress: () => updateItemStatus(itemId, 'fail', 'optional') },
        { text: 'Fail - Recommended', onPress: () => updateItemStatus(itemId, 'fail', 'recommended') },
        { text: 'Fail - Critical', onPress: () => updateItemStatus(itemId, 'fail', 'critical') },
        { text: 'Needs Attention', onPress: () => updateItemStatus(itemId, 'needs_attention', 'recommended') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const updateItemStatus = (itemId, status, priority) => {
    setInspectionItems(prevItems => {
      const newItems = { ...prevItems };
      Object.keys(newItems).forEach(category => {
        newItems[category] = newItems[category].map(item => 
          item.id === itemId ? { ...item, status, priority } : item
        );
      });
      return newItems;
    });
  };

  const handleAddNote = (itemId) => {
    setSelectedItemId(itemId);
    setModalVisible(true);
  };

  const handleSaveNote = (noteText) => {
    if (selectedItemId) {
      setInspectionItems(prevItems => {
        const newItems = { ...prevItems };
        Object.keys(newItems).forEach(category => {
          newItems[category] = newItems[category].map(item => 
            item.id === selectedItemId ? { ...item, notes: noteText } : item
          );
        });
        return newItems;
      });
    }
  };

  const getInspectionSummary = () => {
    let total = 0;
    let completed = 0;
    let failed = 0;
    let critical = 0;
    let recommended = 0;

    Object.values(inspectionItems).forEach(category => {
      category.forEach(item => {
        total++;
        if (item.status !== 'pending') completed++;
        if (item.status === 'fail' || item.status === 'needs_attention') failed++;
        if (item.priority === 'critical') critical++;
        if (item.priority === 'recommended') recommended++;
      });
    });

    return { total, completed, failed, critical, recommended };
  };

  const handleCompleteInspection = () => {
    const summary = getInspectionSummary();
    
    if (summary.completed < summary.total) {
      Alert.alert(
        'Incomplete Inspection',
        `You have ${summary.total - summary.completed} items remaining. Complete all items before finishing.`,
        [{ text: 'OK' }]
      );
      return;
    }

    if (summary.failed > 0) {
      Alert.alert(
        'Issues Found',
        `Found ${summary.failed} issues (${summary.critical} critical, ${summary.recommended} recommended). Navigate to Parts Replacement?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'View Parts', 
            onPress: () => navigation.navigate('PartsReplacementScreen', { 
              workOrder, 
              inspectionResults: inspectionItems 
            })
          },
        ]
      );
    } else {
      Alert.alert(
        'Inspection Complete',
        'All items passed inspection. No issues found.',
        [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]
      );
    }
  };

  const summary = getInspectionSummary();

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon="chevron-back"
        name="Inspection"
        onIconPress={() => navigation.goBack()}
      />
      
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Inspection Progress</Text>
        <View style={styles.summaryStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{summary.completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{summary.total - summary.completed}</Text>
            <Text style={styles.statLabel}>Remaining</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: Colors.danger }]}>{summary.failed}</Text>
            <Text style={styles.statLabel}>Issues</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {Object.entries(inspectionItems).map(([category, items]) => (
          <InspectionCategory
            key={category}
            category={category}
            items={items}
            onItemStatusChange={handleItemStatusChange}
            onAddNote={handleAddNote}
          />
        ))}
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

      <AddNoteModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveNote}
        currentNote={null}
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
  categoryItems: {
    paddingTop: 8,
  },
  itemCard: {
    backgroundColor: Colors.neutral0,
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  itemDescription: {
    fontSize: 14,
    color: Colors.neutral600,
    marginTop: 2,
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
  itemNotes: {
    marginTop: 12,
    padding: 8,
    backgroundColor: Colors.neutral50,
    borderRadius: 8,
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
  addNoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  addNoteText: {
    fontSize: 14,
    color: Colors.primary,
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
  noteInput: {
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: Colors.neutral1000,
    minHeight: 100,
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

export default InspectionScreen;