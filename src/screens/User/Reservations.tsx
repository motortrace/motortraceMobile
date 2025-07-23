import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import Colors from '../../constants/colors';
import Header from '../../components/Header';
import Button from '../../components/Button';
import BorderButton from '../../components/BorderButton';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';

const ReservationsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'ongoing', 'completed'
  const [notifications, setNotifications] = useState([]);

  // Mock data for upcoming reservations
  const upcomingReservations = [
    {
      id: 1,
      customerName: 'John Smith',
      vehicleInfo: '2020 Toyota Camry',
      Numberplate: 'ABC123',
      serviceType: 'Full Inspection',
      scheduledDate: '2025-06-25',
      scheduledTime: '09:00 AM',
      estimatedDuration: '2 hours',
      status: 'confirmed',
      phone: '+1-555-0123',
    },
    {
      id: 2,
      customerName: 'Sarah Wilson',
      vehicleInfo: '2019 Honda Civic',
      Numberplate: 'XYZ789',
      serviceType: 'Oil Change + Brake Check',
      scheduledDate: '2025-06-25',
      scheduledTime: '11:30 AM',
      estimatedDuration: '1.5 hours',
      status: 'pending_confirmation',
      phone: '+1-555-0456',
    },
    {
      id: 3,
      customerName: 'Mike Johnson',
      vehicleInfo: '2021 Ford F-150',
      Numberplate: 'DEF456',
      serviceType: 'Engine Diagnostic',
      scheduledDate: '2025-06-26',
      scheduledTime: '08:00 AM',
      estimatedDuration: '3 hours',
      status: 'confirmed',
      phone: '+1-555-0789',
    },
  ];

  const ongoingReservations = [
    {
      id: 4,
      customerName: 'David Brown',
      vehicleInfo: '2018 BMW 320i',
      Numberplate: 'GHI789',
      serviceType: 'Full Inspection',
      checkedInDate: '2025-06-24',
      checkedInTime: '08:30 AM',
      currentPhase: 'inspection_completed',
      phaseDescription: 'Inspection Complete - Results Available',
      estimatedCompletion: '2025-06-24 03:00 PM',
      assignedBay: 'Bay 2',
      technician: 'Alex Martinez',
      hasNotification: true,
      notificationType: 'inspection_results',
      progress: 75,
      navigation: 'InspectionCar',
    },
    {
      id: 5,
      customerName: 'Lisa Garcia',
      vehicleInfo: '2020 Audi A4',
      Numberplate: 'JKL012',
      serviceType: 'Brake Repair + Oil Change',
      checkedInDate: '2025-06-24',
      checkedInTime: '10:15 AM',
      currentPhase: 'in_progress',
      phaseDescription: 'Brake Work in Progress',
      estimatedCompletion: '2025-06-24 04:30 PM',
      assignedBay: 'Bay 1',
      technician: 'Maria Rodriguez',
      hasNotification: false,
      progress: 45,
      navigation: 'InspectionCar',
    },
    {
      id: 6,
      customerName: 'Tom Anderson',
      vehicleInfo: '2017 Mercedes C300',
      Numberplate: 'MNO345',
      serviceType: 'Engine Diagnostic',
      checkedInDate: '2025-06-24',
      checkedInTime: '07:00 AM',
      currentPhase: 'awaiting_parts',
      phaseDescription: 'Waiting for Parts Delivery',
      estimatedCompletion: '2025-06-25 12:00 PM',
      assignedBay: 'Bay 3',
      technician: 'James Wilson',
      hasNotification: true,
      notificationType: 'parts_needed',
      progress: 30,
      navigation: 'InspectionCar',
    },
  ];

  // Mock completed reservations
  const completedReservations = [
    {
      id: 7,
      customerName: 'Emma Thompson',
      vehicleInfo: '2019 Lexus ES',
      Numberplate: 'PQR678',
      serviceType: 'Full Service',
      completedDate: '2025-06-23',
      completedTime: '02:30 PM',
      totalCost: 285,
      status: 'paid',
    },
  ];

  useEffect(() => {
    // Check for notifications from ongoing reservations
    const activeNotifications = ongoingReservations
      .filter(reservation => reservation.hasNotification)
      .map(reservation => ({
        id: reservation.id,
        type: reservation.notificationType,
        message: getNotificationMessage(reservation),
        vehicleInfo: reservation.vehicleInfo,
        customerName: reservation.customerName,
      }));
    
    setNotifications(activeNotifications);
  }, []);

  const getNotificationMessage = (reservation) => {
    switch (reservation.notificationType) {
      case 'inspection_results':
        return 'Inspection results are ready for review';
      case 'parts_needed':
        return 'Waiting for parts - customer approval needed';
      case 'ready_for_pickup':
        return 'Vehicle is ready for customer pickup';
      default:
        return 'Status update available';
    }
  };

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'inspection_completed':
        return Colors.success;
      case 'in_progress':
        return Colors.warning;
      case 'awaiting_parts':
        return Colors.info;
      case 'ready_for_pickup':
        return Colors.primary;
      default:
        return Colors.neutral500;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return Colors.success;
      case 'pending_confirmation':
        return Colors.warning;
      case 'paid':
        return Colors.success;
      default:
        return Colors.neutral500;
    }
  };

  const renderUpcomingReservation = ({ item }) => (
    <TouchableOpacity style={styles.reservationCard}>
      <View style={styles.cardHeader}>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{item.vehicleInfo}</Text>
          <Text style={styles.customerInfo}>{item.Numberplate}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
      </View>
      
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceType}>{item.serviceType}</Text>
        <Text style={styles.scheduleText}>
          📅 {item.scheduledDate} at {item.scheduledTime}
        </Text>
        <Text style={styles.durationText}>
          ⏱️ Est. Duration: {item.estimatedDuration}
        </Text>
      </View>
      
      <View style={styles.cardActions}>
        <Button label="Call" icon='call' containerStyle={{width: 100}} onPress={() => {}} />
        <Button label="Chat" icon='chatbubble' containerStyle={{width: 100}} onPress={() => {navigation.navigate('ChatBox')}} />
        <BorderButton label="Reschedule" icon="create-outline" style={{width: 140}} onPress={() => {}} />
      </View>
    </TouchableOpacity>
  );

  const renderOngoingReservation = ({ item }) => (
    <TouchableOpacity style={styles.reservationCard}>
      {item.hasNotification && (
        <View style={styles.notificationBadge}>
          <Text style={styles.notificationText}>🔔 New Update</Text>
        </View>
      )}
      
      <View style={styles.cardHeader}>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{item.customerName}</Text>
          <Text style={styles.vehicleInfo}>{item.vehicleInfo}</Text>
        </View>
        <View style={styles.bayInfo}>
          <Text style={styles.bayText}>{item.assignedBay}</Text>
        </View>
      </View>
      
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.currentPhase}>{item.phaseDescription}</Text>
          <Text style={styles.progressPercent}>{item.progress}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[styles.progressFill, { 
              width: `${item.progress}%`,
              backgroundColor: getPhaseColor(item.currentPhase)
            }]} 
          />
        </View>
      </View>
      
      <View style={styles.serviceDetails}>
        <Text style={styles.serviceType}>{item.serviceType}</Text>
        <Text style={styles.timeInfo}>
          📅 Checked in: {item.checkedInDate} at {item.checkedInTime}
        </Text>
        <Text style={styles.estimatedCompletion}>
          🕒 Est. Completion: {item.estimatedCompletion}
        </Text>
        <Text style={styles.technicianInfo}>
          👨‍🔧 Technician: {item.technician}
        </Text>
      </View>
      
      <View style={styles.cardActions}>
        <Button label="Call" icon='call' containerStyle={{width: 100}} onPress={() => {}} />
        <Button label="Chat" icon='chatbubble' containerStyle={{width: 100}} onPress={() =>navigation.navigate('ChatBox') } />
        <BorderButton label="View Details" icon="eye" style={{width: 140}} onPress={() => navigation.navigate(item.navigation)} />
      </View>
    </TouchableOpacity>
  );

  const renderCompletedReservation = ({ item }) => (
    <TouchableOpacity style={[styles.reservationCard, styles.completedCard]}>
      <View style={styles.cardHeader}>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{item.customerName}</Text>
          <Text style={styles.vehicleInfo}>{item.vehicleInfo}</Text>
        </View>
        <View style={styles.costInfo}>
          <Text style={styles.costText}>${item.totalCost}</Text>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>
      
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceType}>{item.serviceType}</Text>
        <Text style={styles.completedText}>
          ✅ Completed: {item.completedDate} at {item.completedTime}
        </Text>
      </View>
      
      <View style={styles.cardActions}>
        <BorderButton label="View Report" icon="eye" style={{width: '100%'}} onPress={() => {}} />
      </View>
    </TouchableOpacity>
  );

  const renderTabButton = (tabName, label, count) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tabName && styles.activeTab]}
      onPress={() => setActiveTab(tabName)}
    >
      <Text style={[styles.tabText, activeTab === tabName && styles.activeTabText]}>
        {label}
      </Text>
      <View style={styles.countBadge}>
        <Text style={styles.countText}>{count}</Text>
      </View>
    </TouchableOpacity>
  );

  const getCurrentData = () => {
    switch (activeTab) {
      case 'upcoming':
        return upcomingReservations;
      case 'ongoing':
        return ongoingReservations;
      case 'completed':
        return completedReservations;
      default:
        return [];
    }
  };

  const getCurrentRenderItem = () => {
    switch (activeTab) {
      case 'upcoming':
        return renderUpcomingReservation;
      case 'ongoing':
        return renderOngoingReservation;
      case 'completed':
        return renderCompletedReservation;
      default:
        return renderUpcomingReservation;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        icon="back"
        name="Garage Management"
        image=""
        onIconPress={() => navigation.navigate('Home')}
      />

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {renderTabButton('upcoming', 'Upcoming', upcomingReservations.length)}
        {renderTabButton('ongoing', 'In Garage', ongoingReservations.length)}
        {renderTabButton('completed', 'Completed', completedReservations.length)}
      </View>

      {/* Summary Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{ongoingReservations.length}</Text>
          <Text style={styles.statLabel}>Active Jobs</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{upcomingReservations.length}</Text>
          <Text style={styles.statLabel}>Today's Schedule</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {ongoingReservations.filter(r => r.hasNotification).length}
          </Text>
          <Text style={styles.statLabel}>Pending Actions</Text>
        </View>
      </View>

      {/* Reservations List */}
      <FlatList
        data={getCurrentData()}
        renderItem={getCurrentRenderItem()}
        keyExtractor={(item) => item.id.toString()}
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primarybg,
  },
  notificationsBar: {
    backgroundColor: Colors.warning + '20',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  notificationItem: {
    backgroundColor: Colors.neutral0,
    marginHorizontal: 8,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
    minWidth: 200,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 12,
    color: Colors.neutral600,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral0,
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral600,
    marginRight: 6,
  },
  activeTabText: {
    color: Colors.neutral0,
  },
  countBadge: {
    backgroundColor: Colors.neutral200,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.neutral700,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.neutral600,
    textAlign: 'center',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  reservationCard: {
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  completedCard: {
    opacity: 0.85,
  },
  notificationBadge: {
    position: 'absolute',
    top: -6,
    right: 12,
    backgroundColor: Colors.danger,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  notificationText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.neutral0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 4,
  },
  vehicleInfo: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bayInfo: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  bayText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  costInfo: {
    alignItems: 'flex-end',
  },
  costText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.success,
    marginBottom: 4,
  },
  progressSection: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentPhase: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral800,
    flex: 1,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.neutral200,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  serviceInfo: {
    marginBottom: 12,
  },
  serviceDetails: {
    marginBottom: 12,
  },
  serviceType: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral800,
    marginBottom: 6,
  },
  scheduleText: {
    fontSize: 14,
    color: Colors.neutral600,
    marginBottom: 4,
  },
  durationText: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  timeInfo: {
    fontSize: 13,
    color: Colors.neutral600,
    marginBottom: 3,
  },
  estimatedCompletion: {
    fontSize: 13,
    color: Colors.warning,
    marginBottom: 3,
  },
  technicianInfo: {
    fontSize: 13,
    color: Colors.info,
  },
  completedText: {
    fontSize: 14,
    color: Colors.success,
  },
  cardActions: {
    width: '100%',
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.neutral100,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  primaryAction: {
    backgroundColor: Colors.primary,
  },
  notificationAction: {
    backgroundColor: Colors.danger,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.neutral700,
  },
  primaryActionText: {
    color: Colors.neutral0,
  },
  notificationActionText: {
    color: Colors.neutral0,
  },
});

export default ReservationsScreen;