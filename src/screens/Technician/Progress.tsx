import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  FlatList,
  TextInput,
  Image,
  Modal,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
import BottomNavigation from '../../components/BottomNav';
import Colors from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';
import SearchBar from '../../components/SearchBar';

// Image Upload Component for Cards
const ImageUploadSection = ({ images, onAddImage, onRemoveImage, workOrderId }) => {
  return (
    <View style={styles.imageUploadSection}>
      <Text style={styles.imageUploadTitle}>Proof Images</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {images.map((image, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri: image.uri }} style={styles.proofImage} />
            <TouchableOpacity
              style={styles.removeImageBtn}
              onPress={() => onRemoveImage(workOrderId, index)}
            >
              <Icon name="close-circle" size={16} color={Colors.error} />
            </TouchableOpacity>
          </View>
        ))}
        
        <TouchableOpacity 
          style={styles.addImageBtn} 
          onPress={() => onAddImage(workOrderId)}
        >
          <Icon name="camera-outline" size={20} color={Colors.primary} />
          <Text style={styles.addImageText}>Add</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// Filter Tabs Component
const FilterTabs = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'All', count: 28 },
    { id: 'pending', label: 'Pending', count: 8 },
    { id: 'in_progress', label: 'In Progress', count: 3 }
  ];

  return (
    <View style={styles.filterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterTab,
              activeFilter === filter.id && styles.filterTabActive
            ]}
            onPress={() => onFilterChange(filter.id)}
          >
            <Text style={[
              styles.filterText,
              activeFilter === filter.id && styles.filterTextActive
            ]}>
              {filter.label}
            </Text>
            <View style={[
              styles.filterCount,
              activeFilter === filter.id && styles.filterCountActive
            ]}>
              <Text style={[
                styles.filterCountText,
                activeFilter === filter.id && styles.filterCountTextActive
              ]}>
                {filter.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Enhanced Work Order Card with Completion Features
const WorkOrderCard = ({ 
  workOrder, 
  onPress, 
  onMarkAsDone, 
  onAddImage, 
  onRemoveImage,
  onAddNote,
  images = [],
  isExpanded,
  onToggleExpand
}) => {
  const [completionNote, setCompletionNote] = useState(workOrder.completionNote || '');

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#EAB308';
      case 'in_progress': return '#3B82F6';
      case 'completed': return '#10B981';
      case 'urgent': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'urgent': return 'Urgent';
      default: return 'Unknown';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'alert-circle';
      case 'medium': return 'alert';
      case 'low': return 'information-circle';
      default: return 'information-circle';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const handleMarkAsDone = () => {
    if (images.length === 0) {
      Alert.alert('Missing Proof', 'Please add at least one proof image before marking as done.');
      return;
    }
    
    Alert.alert(
      'Mark as Done',
      'Are you sure you want to mark this work order as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Yes, Done', 
          onPress: () => onMarkAsDone(workOrder.id, completionNote)
        }
      ]
    );
  };

  const handleNoteChange = (text) => {
    setCompletionNote(text);
    onAddNote(workOrder.id, text);
  };

  return (
    <View style={[
      styles.workOrderCard,
      workOrder.status === 'completed' && styles.completedCard
    ]}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.workOrderHeader}>
          <View style={styles.workOrderTitleRow}>
            <Text style={styles.workOrderId}>#{workOrder.id}</Text>
            <Icon 
              name={getPriorityIcon(workOrder.priority)} 
              size={16} 
              color={getPriorityColor(workOrder.priority)} 
            />
          </View>
          <View style={styles.statusRow}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(workOrder.status) }]}>
              <Text style={styles.statusText}>{getStatusText(workOrder.status)}</Text>
            </View>
            {workOrder.status === 'completed' && (
              <Icon name="checkmark-circle" size={20} color={Colors.success} />
            )}
          </View>
        </View>
        
        <Text style={styles.customerName}>{workOrder.customerName}</Text>
        <Text style={styles.vehicleInfo}>
          {workOrder.vehicle.year} {workOrder.vehicle.make} {workOrder.vehicle.model}
        </Text>
        <Text style={styles.plateNumber}>Plate: {workOrder.vehicle.plateNumber}</Text>
        
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceType}>{workOrder.serviceType}</Text>
          <Text style={styles.appointmentTime}>{workOrder.appointmentTime}</Text>
        </View>
        
        <View style={styles.workOrderDetails}>
          <View style={styles.detailItem}>
            <Icon name="time-outline" size={14} color={Colors.neutral600} />
            <Text style={styles.detailText}>Est: {workOrder.estimatedTime}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="cash-outline" size={14} color={Colors.neutral600} />
            <Text style={styles.detailText}>${workOrder.estimatedCost}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="calendar-outline" size={14} color={Colors.neutral600} />
            <Text style={styles.detailText}>{workOrder.scheduledDate}</Text>
          </View>
        </View>
        
        <View style={styles.cardFooter}>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>Progress: {workOrder.progress}%</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${workOrder.progress}%` }
                ]} 
              />
            </View>
          </View>
          <TouchableOpacity onPress={onToggleExpand}>
            <Icon 
              name={isExpanded ? "chevron-up" : "chevron-down"} 
              size={16} 
              color={Colors.neutral600} 
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Expanded Section for Completion */}
      {isExpanded && workOrder.status !== 'completed' && (
        <View style={styles.completionSection}>
          <View style={styles.completionDivider} />
          
          {/* Image Upload Section */}
          <ImageUploadSection
            images={images}
            onAddImage={onAddImage}
            onRemoveImage={onRemoveImage}
            workOrderId={workOrder.id}
          />

          {/* Completion Notes */}
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>Completion Notes</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Add notes about completed work..."
              multiline
              numberOfLines={3}
              value={completionNote}
              onChangeText={handleNoteChange}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.markDoneButton}
              onPress={handleMarkAsDone}
            >
              <Icon name="checkmark-circle-outline" size={18} color={Colors.neutral0} />
              <Text style={styles.markDoneText}>Mark as Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Show completion info for completed work orders */}
      {workOrder.status === 'completed' && (
        <View style={styles.completedSection}>
          <View style={styles.completionDivider} />
          <View style={styles.completedInfo}>
            <Icon name="checkmark-circle" size={20} color={Colors.success} />
            <Text style={styles.completedText}>Work completed successfully</Text>
          </View>
          
          {images.length > 0 && (
            <View style={styles.completedImages}>
              <Text style={styles.completedImagesTitle}>Proof Images:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {images.map((image, index) => (
                  <Image key={index} source={{ uri: image.uri }} style={styles.completedProofImage} />
                ))}
              </ScrollView>
            </View>
          )}
          
          {completionNote && (
            <View style={styles.completedNotes}>
              <Text style={styles.completedNotesTitle}>Completion Notes:</Text>
              <Text style={styles.completedNotesText}>{completionNote}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

// Main Assigned Work Screen Component
const AssignedWorkScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeTab, setActiveTab] = useState(1);
  const [expandedCards, setExpandedCards] = useState({});
  const [workOrderImages, setWorkOrderImages] = useState({});
  const [workOrderNotes, setWorkOrderNotes] = useState({});

  // Mock data - work orders
  const [workOrders, setWorkOrders] = useState([
    {
      id: 'WO001',
      customerName: 'John Smith',
      vehicle: {
        year: 2020,
        make: 'Toyota',
        model: 'Camry',
        plateNumber: 'ABC-123'
      },
      serviceType: 'Oil Change & Inspection',
      status: 'pending',
      priority: 'medium',
      appointmentTime: '09:00 AM',
      scheduledDate: 'Today',
      estimatedTime: '45 min',
      estimatedCost: '85.00',
      progress: 0
    },
    {
      id: 'WO002',
      customerName: 'Sarah Johnson',
      vehicle: {
        year: 2019,
        make: 'Honda',
        model: 'Civic',
        plateNumber: 'XYZ-456'
      },
      serviceType: 'Brake Inspection',
      status: 'in_progress',
      priority: 'high',
      appointmentTime: '10:30 AM',
      scheduledDate: 'Today',
      estimatedTime: '1.5 hrs',
      estimatedCost: '150.00',
      progress: 35
    },
    {
      id: 'WO003',
      customerName: 'Mike Davis',
      vehicle: {
        year: 2021,
        make: 'BMW',
        model: 'X3',
        plateNumber: 'BMW-789'
      },
      serviceType: 'Engine Diagnostics',
      status: 'completed',
      priority: 'high',
      appointmentTime: '02:00 PM',
      scheduledDate: 'Yesterday',
      estimatedTime: '2 hrs',
      estimatedCost: '200.00',
      progress: 100,
      completionNote: 'Engine diagnostic completed. Found faulty oxygen sensor, replaced successfully.'
    }
  ]);

  const navItems = [
    {
      id: "home",
      icon: "home",
      label: "Home",
      onPress: () => navigation.navigate('TechnicianHome')
    },
    {
      id: "work",
      icon: "clipboard",
      label: "Work Orders",
      onPress: () => setActiveTab(1)
    },
    {
      id: "inspection",
      icon: "search",
      label: "Inspect",
    },
    {
      id: "inventory",
      icon: "cube",
      label: "Inventory",
    },
    {
      id: "profile",
      icon: "person",
      label: "Profile",
    }
  ];

  // Filter work orders based on search and filter
  const filteredWorkOrders = workOrders.filter(workOrder => {
    const matchesSearch = workOrder.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workOrder.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workOrder.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workOrder.vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || workOrder.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const handleToggleExpand = (workOrderId) => {
    setExpandedCards(prev => ({
      ...prev,
      [workOrderId]: !prev[workOrderId]
    }));
  };

  const handleAddImage = (workOrderId) => {
    // Mock image addition - in real app, would use image picker
    const newImage = {
      uri: 'https://via.placeholder.com/100x100/007bff/ffffff?text=Work+Photo',
      type: 'image/jpeg',
      name: `work_photo_${Date.now()}.jpg`
    };
    
    setWorkOrderImages(prev => ({
      ...prev,
      [workOrderId]: [...(prev[workOrderId] || []), newImage]
    }));
  };

  const handleRemoveImage = (workOrderId, imageIndex) => {
    setWorkOrderImages(prev => ({
      ...prev,
      [workOrderId]: prev[workOrderId]?.filter((_, index) => index !== imageIndex) || []
    }));
  };

  const handleAddNote = (workOrderId, note) => {
    setWorkOrderNotes(prev => ({
      ...prev,
      [workOrderId]: note
    }));
  };

  const handleMarkAsDone = (workOrderId, note) => {
    setWorkOrders(prev => 
      prev.map(wo => 
        wo.id === workOrderId 
          ? { ...wo, status: 'completed', progress: 100, completionNote: note }
          : wo
      )
    );
    
    // Collapse the card after marking as done
    setExpandedCards(prev => ({
      ...prev,
      [workOrderId]: false
    }));
    
    Alert.alert('Success', 'Work order marked as completed successfully!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon=""
        name="Work Orders"
        onIconPress={() => navigation.goBack()}
      />

      <SearchBar 
        placeholder='Search Work orders'
      />
      
      <View style={styles.content}>
        <FilterTabs 
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        
        <View style={styles.listHeader}>
          <Text style={styles.resultsText}>
            {filteredWorkOrders.length} work order{filteredWorkOrders.length !== 1 ? 's' : ''}
          </Text>
        </View>
        
        <FlatList
          data={filteredWorkOrders}
          renderItem={({ item }) => (
            <WorkOrderCard 
              workOrder={item} 
              onPress={() => {}}
              onMarkAsDone={handleMarkAsDone}
              onAddImage={handleAddImage}
              onRemoveImage={handleRemoveImage}
              onAddNote={handleAddNote}
              images={workOrderImages[item.id] || []}
              isExpanded={expandedCards[item.id]}
              onToggleExpand={() => handleToggleExpand(item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    
      <BottomNavigation
        navItems={navItems}
        activeTab={activeTab}
        onTabPress={setActiveTab}
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
  filterContainer: {
    marginBottom: 16,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral0,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral600,
    marginRight: 8,
  },
  filterTextActive: {
    color: Colors.neutral0,
  },
  filterCount: {
    backgroundColor: Colors.neutral200,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  filterCountActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.neutral600,
  },
  filterCountTextActive: {
    color: Colors.neutral0,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral1000,
  },
  listContent: {
    paddingBottom: 20,
  },
  workOrderCard: {
    backgroundColor: Colors.neutral0,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  completedCard: {
    backgroundColor: '#F0F9FF',
    borderColor: Colors.success,
  },
  workOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  workOrderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  workOrderId: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.neutral1000,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.neutral0,
    textTransform: 'uppercase',
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 4,
  },
  vehicleInfo: {
    fontSize: 14,
    color: Colors.neutral600,
    marginBottom: 2,
  },
  plateNumber: {
    fontSize: 13,
    color: Colors.neutral500,
    marginBottom: 12,
  },
  serviceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceType: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.neutral1000,
    flex: 1,
  },
  appointmentTime: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  workOrderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: Colors.neutral600,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  progressContainer: {
    flex: 1,
    marginRight: 16,
  },
  progressText: {
    fontSize: 12,
    color: Colors.neutral600,
    marginBottom: 6,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.neutral200,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  // Completion Section Styles
  completionSection: {
    marginTop: 16,
  },
  completionDivider: {
    height: 1,
    backgroundColor: Colors.neutral200,
    marginBottom: 16,
  },
  imageUploadSection: {
    marginBottom: 16,
  },
  imageUploadTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 8,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 8,
  },
  proofImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  removeImageBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: Colors.neutral0,
    borderRadius: 8,
  },
  addImageBtn: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neutral50,
  },
  addImageText: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '500',
    marginTop: 2,
  },
  notesSection: {
    marginBottom: 16,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: Colors.neutral50,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Colors.neutral1000,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  markDoneButton: {
    backgroundColor: Colors.success,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  markDoneText: {
    color: Colors.neutral0,
    fontSize: 14,
    fontWeight: '600',
  },
  // Completed Section Styles
  completedSection: {
    marginTop: 16,
  },
  completedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  completedText: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: '600',
  },
  completedImages: {
    marginBottom: 12,
  },
  completedImagesTitle: {
    fontSize: 12,
    color: Colors.neutral600,
    marginBottom: 6,
  },
  completedProofImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 6,
  },
  completedNotes: {
    backgroundColor: Colors.neutral50,
    borderRadius: 8,
    padding: 12,
  },
  completedNotesTitle: {
    fontSize: 12,
    color: Colors.neutral600,
    marginBottom: 4,
  },
  completedNotesText: {
    fontSize: 13,
    color: Colors.neutral1000,
  },
});

export default AssignedWorkScreen;