import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  FlatList,
  Dimensions,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
import BottomNavigation from '../../components/BottomNav';
import Colors from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';

const { width: screenWidth } = Dimensions.get('window');

// Current Work Progress Component
const CurrentWorkProgress = ({ currentWork, onUpdateProgress }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'inspection': return '#3B82F6';
      case 'diagnosis': return '#F59E0B';
      case 'repair': return '#EF4444';
      case 'testing': return '#8B5CF6';
      case 'completion': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getPhaseIcon = (phase) => {
    switch (phase) {
      case 'inspection': return 'search-outline';
      case 'diagnosis': return 'analytics-outline';
      case 'repair': return 'build-outline';
      case 'testing': return 'flash-outline';
      case 'completion': return 'checkmark-circle-outline';
      default: return 'ellipse-outline';
    }
  };

  const phases = ['inspection', 'diagnosis', 'repair', 'testing', 'completion'];
  const currentPhaseIndex = phases.indexOf(currentWork.currentPhase);
  const progressPercentage = ((currentPhaseIndex + 1) / phases.length) * 100;

  return (
    <View style={styles.currentWorkContainer}>
      <View style={styles.currentWorkHeader}>
        <Text style={styles.currentWorkTitle}>Currently Working On</Text>
        <View style={styles.timeContainer}>
          <Icon name="time-outline" size={16} color={Colors.neutral600} />
          <Text style={styles.elapsedTime}>{currentWork.elapsedTime}</Text>
        </View>
      </View>
      
      <View style={styles.workOrderInfo}>
        <Text style={styles.workOrderId}>#{currentWork.id}</Text>
        <Text style={styles.customerName}>{currentWork.customerName}</Text>
        <Text style={styles.vehicleInfo}>
          {currentWork.vehicle.year} {currentWork.vehicle.make} {currentWork.vehicle.model}
        </Text>
        <Text style={styles.serviceType}>{currentWork.serviceType}</Text>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Progress</Text>
          <Text style={styles.progressPercentage}>{Math.round(progressPercentage)}%</Text>
        </View>
        
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
        </View>
        
        <View style={styles.phasesContainer}>
          {phases.map((phase, index) => (
            <View key={phase} style={styles.phaseItem}>
              <View style={[
                styles.phaseIcon,
                { 
                  backgroundColor: index <= currentPhaseIndex ? getPhaseColor(phase) : Colors.neutral200,
                  borderColor: index === currentPhaseIndex ? getPhaseColor(phase) : 'transparent',
                  borderWidth: index === currentPhaseIndex ? 2 : 0
                }
              ]}>
                <Icon 
                  name={getPhaseIcon(phase)} 
                  size={16} 
                  color={index <= currentPhaseIndex ? Colors.neutral0 : Colors.neutral600} 
                />
              </View>
              <Text style={[
                styles.phaseLabel,
                { 
                  color: index <= currentPhaseIndex ? Colors.neutral1000 : Colors.neutral600,
                  fontWeight: index === currentPhaseIndex ? '600' : '400'
                }
              ]}>
                {phase.charAt(0).toUpperCase() + phase.slice(1)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.updateButton}
          onPress={() => navigation.navigate('TestDrive')}
        >
          <Icon name="refresh-outline" size={18} color={Colors.neutral0} />
          <Text style={styles.updateButtonText}>Update Progress</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.pauseButton}
          onPress={() => Alert.alert('Pause Work', 'Are you sure you want to pause this work order?')}
        >
          <Icon name="pause-outline" size={18} color={Colors.primary} />
          <Text style={styles.pauseButtonText}>Pause</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Work Order Queue Item Component
const WorkOrderQueueItem = ({ workOrder, index, onStart, onReschedule }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#EAB308';
      case 'urgent': return '#EF4444';
      case 'scheduled': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'urgent': return 'Urgent';
      case 'scheduled': return 'Scheduled';
      default: return 'Unknown';
    }
  };

  const isNext = index === 0;
  const isPastDue = workOrder.isPastDue;

  return (
    <View style={[
      styles.queueItem,
      isNext && styles.nextQueueItem,
      isPastDue && styles.pastDueItem
    ]}>
      <View style={styles.queueItemHeader}>
        <View style={styles.queueItemLeft}>
          <Text style={styles.queueNumber}>{index + 1}</Text>
          <View>
            <Text style={styles.queueWorkOrderId}>#{workOrder.id}</Text>
            <Text style={styles.queueCustomerName}>{workOrder.customerName}</Text>
          </View>
        </View>
        
        <View style={styles.queueItemRight}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(workOrder.status) }]}>
            <Text style={styles.statusText}>{getStatusText(workOrder.status)}</Text>
          </View>
          {isPastDue && (
            <View style={styles.pastDueBadge}>
              <Icon name="warning" size={12} color={Colors.neutral0} />
              <Text style={styles.pastDueText}>Past Due</Text>
            </View>
          )}
        </View>
      </View>
      
      <Text style={styles.queueVehicleInfo}>
        {workOrder.vehicle.year} {workOrder.vehicle.make} {workOrder.vehicle.model}
      </Text>
      <Text style={styles.queueServiceType}>{workOrder.serviceType}</Text>
      
      <View style={styles.queueItemFooter}>
        <View style={styles.timeInfo}>
          <Icon name="time-outline" size={14} color={Colors.neutral600} />
          <Text style={styles.scheduledTime}>{workOrder.scheduledTime}</Text>
          <Text style={styles.estimatedDuration}>• {workOrder.estimatedDuration}</Text>
        </View>
        
        <View style={styles.queueActions}>
          {isNext && (
            <TouchableOpacity 
              style={styles.startButton}
              onPress={() => onStart(workOrder)}
            >
              <Icon name="play" size={14} color={Colors.neutral0} />
              <Text style={styles.startButtonText}>Start</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.rescheduleButton}
            onPress={() => onReschedule(workOrder)}
          >
            <Icon name="calendar-outline" size={14} color={Colors.neutral600} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Main Assigned Work Screen Component
const AssignedWorkScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  // Mock current work data
  const currentWork = {
    id: 'WO002',
    customerName: 'Sarah Johnson',
    vehicle: {
      year: 2019,
      make: 'Honda',
      model: 'Civic'
    },
    serviceType: 'Brake Inspection & Replacement',
    currentPhase: 'diagnosis',
    elapsedTime: '1h 23m',
    startTime: '10:30 AM',
    estimatedCompletion: '2:00 PM'
  };

  // Mock work queue data
  const workQueue = [
    {
      id: 'WO003',
      customerName: 'Mike Davis',
      vehicle: { year: 2021, make: 'BMW', model: 'X3' },
      serviceType: 'Engine Diagnostics',
      status: 'urgent',
      scheduledTime: '2:00 PM',
      estimatedDuration: '2h',
      isPastDue: false
    },
    {
      id: 'WO004',
      customerName: 'Lisa Anderson',
      vehicle: { year: 2020, make: 'Tesla', model: 'Model 3' },
      serviceType: 'Software Update',
      status: 'scheduled',
      scheduledTime: '3:30 PM',
      estimatedDuration: '30m',
      isPastDue: false
    },
    {
      id: 'WO005',
      customerName: 'Robert Wilson',
      vehicle: { year: 2018, make: 'Ford', model: 'F-150' },
      serviceType: 'Tire Rotation',
      status: 'pending',
      scheduledTime: '4:00 PM',
      estimatedDuration: '45m',
      isPastDue: true
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
      onPress: () => navigation.navigate('Work')
    },
    {
      id: "inspection",
      icon: "search",
      label: "Inspect",
      onPress: () => navigation.navigate('Search')
    },
    {
      id: "inventory",
      icon: "cube",
      label: "Inventory",
      onPress: () => navigation.navigate('Inventory')
    },
    {
      id: "profile",
      icon: "person",
      label: "Profile",
      onPress: () => navigation.navigate('TechnicianPofile')
    }
  ];

  const handleUpdateProgress = (workOrderId) => {
    Alert.alert(
      'Update Progress',
      'Move to next phase?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => console.log('Progress updated') }
      ]
    );
  };

  const handleStartWork = (workOrder) => {
    Alert.alert(
      'Start Work Order',
      `Start working on ${workOrder.customerName}'s ${workOrder.vehicle.year} ${workOrder.vehicle.make} ${workOrder.vehicle.model}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start', onPress: () => console.log('Work started') }
      ]
    );
  };

  const handleReschedule = (workOrder) => {
    Alert.alert(
      'Reschedule Work Order',
      `Reschedule ${workOrder.customerName}'s appointment?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reschedule', onPress: () => console.log('Rescheduled') }
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon=""
        name="T"
      />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.content}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
      >
        <CurrentWorkProgress 
          currentWork={currentWork}
          onUpdateProgress={handleUpdateProgress}
        />
        
        <View style={styles.queueSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Work Queue</Text>
            <Text style={styles.queueCount}>{workQueue.length} pending</Text>
          </View>
          
          <FlatList
            data={workQueue}
            renderItem={({ item, index }) => (
              <WorkOrderQueueItem 
                workOrder={item} 
                index={index}
                onStart={handleStartWork}
                onReschedule={handleReschedule}
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
  currentWorkContainer: {
    backgroundColor: Colors.neutral0,
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  currentWorkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  currentWorkTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  elapsedTime: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral600,
    marginLeft: 4,
  },
  workOrderInfo: {
    marginBottom: 24,
  },
  workOrderId: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 4,
  },
  customerName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral1000,
    marginBottom: 4,
  },
  vehicleInfo: {
    fontSize: 16,
    color: Colors.neutral600,
    marginBottom: 8,
  },
  serviceType: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral1000,
  },
  progressSection: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.neutral200,
    borderRadius: 4,
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  phasesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  phaseItem: {
    alignItems: 'center',
    flex: 1,
  },
  phaseIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  phaseLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  updateButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  updateButtonText: {
    color: Colors.neutral0,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  pauseButton: {
    backgroundColor: Colors.neutral0,
    borderWidth: 1,
    borderColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  pauseButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  queueSection: {
    backgroundColor: Colors.neutral0,
    marginTop: 8,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  queueCount: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  queueItem: {
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  nextQueueItem: {
    borderColor: Colors.primary,
    borderWidth: 2,
    backgroundColor: '#F8FAFC',
  },
  pastDueItem: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  queueItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  queueItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  queueNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginRight: 12,
    minWidth: 24,
  },
  queueWorkOrderId: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral600,
  },
  queueCustomerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  queueItemRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.neutral0,
  },
  pastDueBadge: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pastDueText: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.neutral0,
    marginLeft: 4,
  },
  queueVehicleInfo: {
    fontSize: 14,
    color: Colors.neutral600,
    marginBottom: 4,
  },
  queueServiceType: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral1000,
    marginBottom: 12,
  },
  queueItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  scheduledTime: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral1000,
    marginLeft: 4,
  },
  estimatedDuration: {
    fontSize: 14,
    color: Colors.neutral600,
    marginLeft: 4,
  },
  queueActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  startButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  startButtonText: {
    color: Colors.neutral0,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  rescheduleButton: {
    padding: 8,
  },
});

export default AssignedWorkScreen;