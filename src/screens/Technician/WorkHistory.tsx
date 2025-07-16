import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  FlatList,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
import Colors from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';

// Filter Button Component
const FilterButton = ({ title, isActive, onPress }) => (
  <TouchableOpacity 
    style={[styles.filterButton, isActive && styles.filterButtonActive]} 
    onPress={onPress}
  >
    <Text style={[styles.filterButtonText, isActive && styles.filterButtonTextActive]}>
      {title}
    </Text>
  </TouchableOpacity>
);

// Work Order Card Component
const WorkOrderCard = ({ workOrder, onPress }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return Colors.success;
      case 'cancelled': return Colors.error;
      case 'pending_review': return Colors.warning;
      default: return Colors.neutral500;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      case 'pending_review': return 'Pending Review';
      default: return 'Unknown';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return Colors.error;
      case 'medium': return Colors.warning;
      case 'low': return Colors.success;
      default: return Colors.neutral500;
    }
  };

  return (
    <TouchableOpacity style={styles.workOrderCard} onPress={onPress}>
      <View style={styles.workOrderHeader}>
        <View style={styles.workOrderInfo}>
          <Text style={styles.workOrderId}>#{workOrder.id}</Text>
          <View style={styles.workOrderMeta}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(workOrder.status) }]}>
              <Text style={styles.statusText}>{getStatusText(workOrder.status)}</Text>
            </View>
            <View style={[styles.priorityBadge, { borderColor: getPriorityColor(workOrder.priority) }]}>
              <Text style={[styles.priorityText, { color: getPriorityColor(workOrder.priority) }]}>
                {workOrder.priority.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.workOrderDate}>
          <Text style={styles.dateText}>{workOrder.completedDate}</Text>
          <Text style={styles.timeText}>{workOrder.completedTime}</Text>
        </View>
      </View>

      <Text style={styles.workOrderTitle}>{workOrder.title}</Text>
      <Text style={styles.workOrderDescription} numberOfLines={2}>
        {workOrder.description}
      </Text>

      <View style={styles.workOrderDetails}>
        <View style={styles.detailItem}>
          <Icon name="location-outline" size={14} color={Colors.neutral600} />
          <Text style={styles.detailText}>{workOrder.location}</Text>
        </View>
        <View style={styles.detailItem}>
          <Icon name="car-outline" size={14} color={Colors.neutral600} />
          <Text style={styles.detailText}>{workOrder.vehicle}</Text>
        </View>
      </View>

      <View style={styles.workOrderFooter}>
        <View style={styles.timeSpent}>
          <Icon name="time-outline" size={14} color={Colors.neutral600} />
          <Text style={styles.timeSpentText}>{workOrder.timeSpent}</Text>
        </View>
        <View style={styles.rating}>
          <Icon name="star" size={14} color={Colors.warning} />
          <Text style={styles.ratingText}>{workOrder.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Stats Summary Component
const StatsSummary = ({ stats }) => (
  <View style={styles.statsContainer}>
    <View style={styles.statsRow}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{stats.totalCompleted}</Text>
        <Text style={styles.statLabel}>Completed</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{stats.avgRating}</Text>
        <Text style={styles.statLabel}>Avg Rating</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{stats.totalHours}</Text>
        <Text style={styles.statLabel}>Total Hours</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{stats.thisMonth}</Text>
        <Text style={styles.statLabel}>This Month</Text>
      </View>
    </View>
  </View>
);

// Main Work History Screen Component
const WorkHistoryScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data
  const workHistoryStats = {
    totalCompleted: 1247,
    avgRating: '4.8',
    totalHours: '2,840',
    thisMonth: 89
  };

  const workOrders = [
    {
      id: 'WO-2024-1234',
      title: 'Brake System Inspection',
      description: 'Complete brake system check including pads, rotors, and fluid level. Customer reported squeaking noise.',
      location: 'Bay 3',
      vehicle: '2018 Honda Civic',
      status: 'completed',
      priority: 'high',
      completedDate: 'Jul 14, 2025',
      completedTime: '3:45 PM',
      timeSpent: '2.5 hrs',
      rating: '4.9',
      customerName: 'Sarah Johnson'
    },
    {
      id: 'WO-2024-1233',
      title: 'Oil Change & Filter',
      description: 'Standard oil change service with filter replacement. 5W-30 synthetic oil used.',
      location: 'Bay 1',
      vehicle: '2020 Toyota Camry',
      status: 'completed',
      priority: 'low',
      completedDate: 'Jul 14, 2025',
      completedTime: '11:30 AM',
      timeSpent: '45 mins',
      rating: '5.0',
      customerName: 'Mike Davis'
    },
    {
      id: 'WO-2024-1232',
      title: 'Engine Diagnostic',
      description: 'Check engine light diagnostic. Found faulty oxygen sensor, replaced and cleared codes.',
      location: 'Bay 2',
      vehicle: '2019 Ford F-150',
      status: 'completed',
      priority: 'medium',
      completedDate: 'Jul 13, 2025',
      completedTime: '4:15 PM',
      timeSpent: '1.5 hrs',
      rating: '4.7',
      customerName: 'Jennifer Wilson'
    },
    {
      id: 'WO-2024-1231',
      title: 'Tire Rotation',
      description: 'Rotate tires and check tire pressure. All tires in good condition.',
      location: 'Bay 4',
      vehicle: '2021 Subaru Outback',
      status: 'completed',
      priority: 'low',
      completedDate: 'Jul 13, 2025',
      completedTime: '9:20 AM',
      timeSpent: '30 mins',
      rating: '4.8',
      customerName: 'Robert Chen'
    },
    {
      id: 'WO-2024-1230',
      title: 'Transmission Service',
      description: 'Transmission fluid change and filter replacement. System running smoothly.',
      location: 'Bay 2',
      vehicle: '2017 BMW 320i',
      status: 'pending_review',
      priority: 'medium',
      completedDate: 'Jul 12, 2025',
      completedTime: '2:30 PM',
      timeSpent: '3 hrs',
      rating: '4.6',
      customerName: 'Amanda Lee'
    },
    {
      id: 'WO-2024-1229',
      title: 'AC System Repair',
      description: 'AC not cooling properly. Replaced compressor and recharged refrigerant.',
      location: 'Bay 3',
      vehicle: '2016 Mercedes C-Class',
      status: 'cancelled',
      priority: 'high',
      completedDate: 'Jul 12, 2025',
      completedTime: '10:45 AM',
      timeSpent: '4 hrs',
      rating: 'N/A',
      customerName: 'David Thompson'
    }
  ];

  const filterOptions = [
    { id: 'all', label: 'All' },
    { id: 'completed', label: 'Completed' },
    { id: 'pending_review', label: 'Pending Review' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

  // Filter and search logic
  const filteredWorkOrders = useMemo(() => {
    let filtered = workOrders;

    // Apply status filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(order => order.status === activeFilter);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(order => 
        order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [activeFilter, searchQuery]);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleWorkOrderPress = (workOrder) => {
    // Navigate to work order details
    navigation.navigate('WorkOrderDetails', { workOrderId: workOrder.id });
  };

  const renderWorkOrderItem = ({ item }) => (
    <WorkOrderCard 
      workOrder={item} 
      onPress={() => handleWorkOrderPress(item)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon="back"
        name="Work History"
        onIconPress={() => navigation.navigate('TechnicianPofile')}
      />

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Summary */}
        <StatsSummary stats={workHistoryStats} />

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color={Colors.neutral500} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search work orders..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Colors.neutral500}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="close-circle" size={20} color={Colors.neutral500} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterContainer}>
              {filterOptions.map((filter) => (
                <FilterButton
                  key={filter.id}
                  title={filter.label}
                  isActive={activeFilter === filter.id}
                  onPress={() => setActiveFilter(filter.id)}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Work Orders List */}
        <View style={styles.workOrdersList}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>
              {filteredWorkOrders.length} Work Orders
            </Text>
            <TouchableOpacity style={styles.sortButton}>
              <Icon name="swap-vertical" size={16} color={Colors.neutral600} />
              <Text style={styles.sortText}>Sort</Text>
            </TouchableOpacity>
          </View>

          {filteredWorkOrders.length > 0 ? (
            <FlatList
              data={filteredWorkOrders}
              renderItem={renderWorkOrderItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Icon name="clipboard-outline" size={48} color={Colors.neutral400} />
              <Text style={styles.emptyStateTitle}>No work orders found</Text>
              <Text style={styles.emptyStateDescription}>
                {searchQuery 
                  ? `No work orders match "${searchQuery}"`
                  : `No ${activeFilter === 'all' ? '' : activeFilter + ' '}work orders found`
                }
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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
  },
  statsContainer: {
    backgroundColor: Colors.neutral0,
    padding: 20,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral1000,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.neutral600,
    fontWeight: '500',
  },
  searchSection: {
    backgroundColor: Colors.neutral0,
    padding: 20,
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral50,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.neutral1000,
  },
  filterSection: {
    backgroundColor: Colors.neutral0,
    paddingVertical: 16,
    marginBottom: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.neutral100,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral600,
  },
  filterButtonTextActive: {
    color: Colors.neutral0,
  },
  workOrdersList: {
    backgroundColor: Colors.neutral0,
    paddingTop: 20,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: Colors.neutral100,
  },
  sortText: {
    fontSize: 14,
    color: Colors.neutral600,
    marginLeft: 4,
  },
  workOrderCard: {
    backgroundColor: Colors.neutral0,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral100,
  },
  workOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  workOrderInfo: {
    flex: 1,
  },
  workOrderId: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 8,
  },
  workOrderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.neutral0,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '500',
  },
  workOrderDate: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 12,
    color: Colors.neutral600,
    marginBottom: 2,
  },
  timeText: {
    fontSize: 12,
    color: Colors.neutral500,
  },
  workOrderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 8,
  },
  workOrderDescription: {
    fontSize: 14,
    color: Colors.neutral600,
    lineHeight: 20,
    marginBottom: 12,
  },
  workOrderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    fontSize: 12,
    color: Colors.neutral600,
    marginLeft: 6,
  },
  workOrderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral100,
  },
  timeSpent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeSpentText: {
    fontSize: 12,
    color: Colors.neutral600,
    marginLeft: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: Colors.neutral600,
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral600,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: Colors.neutral500,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default WorkHistoryScreen;