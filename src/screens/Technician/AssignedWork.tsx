import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  FlatList,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
import BottomNavigation from '../../components/BottomNav';
import Colors from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';
import SearchBar from '../../components/SearchBar';

// Filter Tabs Component
const FilterTabs = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'All', count: 28 },
    { id: 'pending', label: 'Pending', count: 8 },
    { id: 'in_progress', label: 'In Progress', count: 3 },
    { id: 'completed', label: 'Completed', count: 15 },
    { id: 'urgent', label: 'Urgent', count: 2 }
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

// Enhanced Work Order Card Component
const WorkOrderCard = ({ workOrder, onPress, onStatusChange }) => {
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

  return (
    <TouchableOpacity style={styles.workOrderCard} onPress={onPress}>
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
          <TouchableOpacity 
            style={styles.statusUpdateButton}
            onPress={() => onStatusChange(workOrder)}
          >
            <Icon name="create-outline" size={16} color={Colors.primary} />
          </TouchableOpacity>
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
        <Icon name="chevron-forward" size={16} color={Colors.neutral600} />
      </View>
    </TouchableOpacity>
  );
};

// Sort Options Component
const SortModal = ({ visible, onClose, currentSort, onSortChange }) => {
  const sortOptions = [
    { id: 'date_desc', label: 'Newest First' },
    { id: 'date_asc', label: 'Oldest First' },
    { id: 'priority_high', label: 'High Priority First' },
    { id: 'status', label: 'Status' },
    { id: 'customer_name', label: 'Customer Name' }
  ];

  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.sortModal}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Sort Work Orders</Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color={Colors.neutral600} />
          </TouchableOpacity>
        </View>
        
        {sortOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.sortOption}
            onPress={() => {
              onSortChange(option.id);
              onClose();
            }}
          >
            <Text style={styles.sortOptionText}>{option.label}</Text>
            {currentSort === option.id && (
              <Icon name="checkmark" size={20} color={Colors.primary} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// Main Assigned Work Screen Component
const AssignedWorkScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [currentSort, setCurrentSort] = useState('date_desc');
  const [activeTab, setActiveTab] = useState(1);

  // Mock data - expanded work orders
  const allWorkOrders = [
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
      status: 'urgent',
      priority: 'high',
      appointmentTime: '02:00 PM',
      scheduledDate: 'Today',
      estimatedTime: '2 hrs',
      estimatedCost: '200.00',
      progress: 0
    },
    {
      id: 'WO004',
      customerName: 'Emily Wilson',
      vehicle: {
        year: 2018,
        make: 'Ford',
        model: 'F-150',
        plateNumber: 'FRD-101'
      },
      serviceType: 'Transmission Service',
      status: 'completed',
      priority: 'medium',
      appointmentTime: '08:00 AM',
      scheduledDate: 'Yesterday',
      estimatedTime: '3 hrs',
      estimatedCost: '350.00',
      progress: 100
    },
    {
      id: 'WO005',
      customerName: 'Robert Brown',
      vehicle: {
        year: 2022,
        make: 'Chevrolet',
        model: 'Silverado',
        plateNumber: 'CHV-202'
      },
      serviceType: 'Tire Rotation & Balance',
      status: 'pending',
      priority: 'low',
      appointmentTime: '03:30 PM',
      scheduledDate: 'Tomorrow',
      estimatedTime: '1 hr',
      estimatedCost: '75.00',
      progress: 0
    }
  ];

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
    //   onPress: () => navigation.navigate('InspectionScreen')
    },
    {
      id: "inventory",
      icon: "cube",
      label: "Inventory",
    //   onPress: () => navigation.navigate('InventorySearchScreen')
    },
    {
      id: "profile",
      icon: "person",
      label: "Profile",
    //   onPress: () => navigation.navigate('ProfileScreen')
    }
  ];

  // Filter work orders based on search and filter
  const filteredWorkOrders = allWorkOrders.filter(workOrder => {
    const matchesSearch = workOrder.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workOrder.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workOrder.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workOrder.vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || workOrder.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

//   const handleWorkOrderPress = (workOrder) => {
//     navigation.navigate('WorkOrderDetailsScreen', { workOrder });
//   };

//   const handleStatusChange = (workOrder) => {
//     navigation.navigate('StatusUpdateScreen', { workOrder });
//   };

  const handleSortChange = (sortType) => {
    setCurrentSort(sortType);
    // Implement sorting logic here
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon=""
        name="Work Orders"
        onIconPress={() => navigation.goBack()}
      />

      <SearchBar 
        placeholder='Serach Work orders'
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
          <TouchableOpacity 
            style={styles.sortButton}
            onPress={() => setSortModalVisible(true)}
          >
            <Text style={styles.sortText}>Sort</Text>
            <Icon name="swap-vertical" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={filteredWorkOrders}
          renderItem={({ item }) => (
            <WorkOrderCard 
              workOrder={item} 
              onPress={() => {}}
              onStatusChange={ () => {}}
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
      
      <SortModal
        visible={sortModalVisible}
        onClose={() => setSortModalVisible(false)}
        currentSort={currentSort}
        onSortChange={handleSortChange}
      />
    
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.neutral1000,
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
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
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
  statusUpdateButton: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: Colors.neutral50,
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
  // Modal styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  sortModal: {
    backgroundColor: Colors.neutral0,
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  sortOptionText: {
    fontSize: 16,
    color: Colors.neutral1000,
  },
});

export default AssignedWorkScreen;