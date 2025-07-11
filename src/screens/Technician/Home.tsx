import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  FlatList,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
import BottomNavigation from '../../components/BottomNav';
import Colors from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';

const { width: screenWidth } = Dimensions.get('window');

// Quick Stats Component
const QuickStats = ({ stats }) => (
  <View style={styles.statsContainer}>
    <View style={styles.statsRow}>
      <View style={[styles.statCard, { backgroundColor: '#EFF6FF' }]}>
        <Text style={styles.statNumber}>{stats.pending}</Text>
        <Text style={styles.statLabel}>Pending</Text>
        <Icon name="time-outline" size={20} color="#2563eb" />
      </View>
      <View style={[styles.statCard, { backgroundColor: '#FEF3C7' }]}>
        <Text style={styles.statNumber}>{stats.inProgress}</Text>
        <Text style={styles.statLabel}>In Progress</Text>
        <Icon name="construct-outline" size={20} color="#D97706" />
      </View>
    </View>
    <View style={styles.statsRow}>
      <View style={[styles.statCard, { backgroundColor: '#D1FAE5' }]}>
        <Text style={styles.statNumber}>{stats.completed}</Text>
        <Text style={styles.statLabel}>Completed</Text>
        <Icon name="checkmark-circle-outline" size={20} color="#059669" />
      </View>
      <View style={[styles.statCard, { backgroundColor: '#FEE2E2' }]}>
        <Text style={styles.statNumber}>{stats.urgent}</Text>
        <Text style={styles.statLabel}>Urgent</Text>
        <Icon name="warning-outline" size={20} color="#DC2626" />
      </View>
    </View>
  </View>
);

// Work Order Card Component
const WorkOrderCard = ({ workOrder, onPress }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
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

  return (
    <TouchableOpacity style={styles.workOrderCard} onPress={() => navigation.navigate('WorkOrderDetails')}>
      <View style={styles.workOrderHeader}>
        <Text style={styles.workOrderId}>#{workOrder.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(workOrder.status) }]}>
          <Text style={styles.statusText}>{getStatusText(workOrder.status)}</Text>
        </View>
      </View>
      
      <Text style={styles.customerName}>{workOrder.customerName}</Text>
      <Text style={styles.vehicleInfo}>
        {workOrder.vehicle.year} {workOrder.vehicle.make} {workOrder.vehicle.model}
      </Text>
      
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceType}>{workOrder.serviceType}</Text>
        <Text style={styles.appointmentTime}>{workOrder.appointmentTime}</Text>
      </View>
      
      <View style={styles.cardFooter}>
        <Text style={styles.estimatedTime}>
          <Icon name="time-outline" size={14} color="#6B7280" /> {workOrder.estimatedTime}
        </Text>
        <Icon name="chevron-forward" size={16} color="#6B7280" />
      </View>
    </TouchableOpacity>
  );
};

// Main Technician Home Screen Component
const TechnicianHomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState(0);

  // Mock data
  const technicianStats = {
    pending: 8,
    inProgress: 3,
    completed: 15,
    urgent: 2
  };

  const todayWorkOrders = [
    {
      id: 'WO001',
      customerName: 'John Smith',
      vehicle: {
        year: 2020,
        make: 'Toyota',
        model: 'Camry'
      },
      serviceType: 'Oil Change & Inspection',
      status: 'pending',
      appointmentTime: '09:00 AM',
      estimatedTime: '45 min'
    },
    {
      id: 'WO002',
      customerName: 'Sarah Johnson',
      vehicle: {
        year: 2019,
        make: 'Honda',
        model: 'Civic'
      },
      serviceType: 'Brake Inspection',
      status: 'in_progress',
      appointmentTime: '10:30 AM',
      estimatedTime: '1.5 hrs'
    },
    {
      id: 'WO003',
      customerName: 'Mike Davis',
      vehicle: {
        year: 2021,
        make: 'BMW',
        model: 'X3'
      },
      serviceType: 'Engine Diagnostics',
      status: 'urgent',
      appointmentTime: '02:00 PM',
      estimatedTime: '2 hrs'
    }
  ];

  const navItems = [
    {
      id: "home",
      icon: "home",
      label: "Home",
      onPress: () => setActiveTab(0)
    },
    {
      id: "work",
      icon: "clipboard",
      label: "Work Orders",
    //   onPress: () => navigation.navigate('AssignedWorkScreen')
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

  const handleWorkOrderPress = (workOrder) => {
    navigation.navigate('WorkOrderDetailsScreen', { workOrder });
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'inventory':
        navigation.navigate('InventorySearchScreen');
        break;
      case 'inspection':
        navigation.navigate('InspectionScreen');
        break;
      case 'history':
        navigation.navigate('WorkHistoryScreen');
        break;
      case 'notifications':
        navigation.navigate('NotificationsScreen');
        break;
      default:
        console.log('Action pressed:', action);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon=""
        name="Mike Rodriguez"
      />
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <QuickStats stats={technicianStats} />
        
        <View style={styles.todayWorkSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Work Orders</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('AssignedWork')}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={todayWorkOrders}
            renderItem={({ item }) => (
              <WorkOrderCard 
                workOrder={item} 
                onPress={() => handleWorkOrderPress(item)}
              />
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    
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
  },
  statsContainer: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 6,
    alignItems: 'center',
    position: 'relative',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral1000,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.neutral600,
  },
  quickActionsContainer: {
    padding: 20,
    backgroundColor: Colors.neutral0,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 16,
  },
  todayWorkSection: {
    padding: 20,
    backgroundColor: Colors.neutral0,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  workOrderCard: {
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  workOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workOrderId: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.neutral0,
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
    marginBottom: 12,
  },
  serviceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceType: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral1000,
  },
  appointmentTime: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  estimatedTime: {
    fontSize: 12,
    color: Colors.neutral600,
  },
});

export default TechnicianHomeScreen;