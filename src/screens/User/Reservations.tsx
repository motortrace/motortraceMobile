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
  Linking,
} from 'react-native';
import Colors from '../../constants/colors';
import Header from '../../components/Header';
import Button from '../../components/Button';
import BorderButton from '../../components/BorderButton';
import LoadingComponent from '../../components/Loading';
import CustomAlert, { CustomAlertProps } from '../../components/Alert';
import RescheduleSheet from '../../components/RescheduleSheet';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReservationsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  // Default to 'ongoing' and remove the Upcoming tab from the UI
  const [activeTab, setActiveTab] = useState('ongoing'); // 'ongoing', 'completed'
  const [notifications, setNotifications] = useState<any[]>([]);
  const [rescheduleSheetVisible, setRescheduleSheetVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [alertConfig, setAlertConfig] = useState<CustomAlertProps | null>(null);
  const [upcomingReservations, setUpcomingReservations] = useState<any[]>([]);
  const [ongoingReservations, setOngoingReservations] = useState<any[]>([]);
  const [completedReservations, setCompletedReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [serviceAdvisor, setServiceAdvisor] = useState<{name?: string, phone?: string} | null>(null);

  // Mock data for upcoming reservations - fallback when backend is unavailable
  const mockUpcomingReservations: any[] = [];

  const mockOngoingReservations = [
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
      navigation: 'InspectionOngoing',
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
      navigation: 'InspectionOngoing',
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
      navigation: 'InspectionOngoing',
    },
  ];

  // Mock completed reservations - fallback when backend is unavailable
  const mockCompletedReservations = [
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

  // Fetch service advisor info
  const fetchServiceAdvisor = async () => {
    try {
      const response = await fetch('http://10.0.2.2:3000/appointments/service-advisor', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setServiceAdvisor(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching service advisor:', error);
    }
  };

  // Fetch work orders from backend
  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        setIsLoading(true);

        const userStr = await AsyncStorage.getItem('user');
        console.log('📱 User string from AsyncStorage:', userStr);

        if (!userStr) {
          console.log('❌ No user string found in AsyncStorage');
          setOngoingReservations([]);
          setCompletedReservations([]);
          return;
        }

        const user = JSON.parse(userStr);
        console.log('👤 Parsed user object:', user);
        console.log('📧 User email:', user.email);
        console.log('🆔 User ID:', user.id);
        console.log('👥 Customer ID:', user.customerId);

        const token = await AsyncStorage.getItem('token');
        console.log('🔑 Token from AsyncStorage:', token ? 'Token exists' : 'No token');

        if (!token) {
          console.log('❌ No token found in AsyncStorage');
          setOngoingReservations([]);
          setCompletedReservations([]);
          return;
        }

        // Get customer ID from stored user data
        const customerId = user.customerId;
        console.log("✅ Customer ID from stored user:", customerId);

        if (!customerId) {
          console.log('⚠️ No customer ID found in stored user data');
          setOngoingReservations([]);
          setCompletedReservations([]);
          return;
        }

        console.log('Fetching work orders for customer:', customerId);

        // Fetch work orders for this customer
        const res = await fetch(`http://10.0.2.2:3000/customers/${customerId}/work-orders`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json();
        console.log('Work orders response:', data);

        if (res.ok && data.success && data.data) {
          const workOrders = data.data;
          console.log('📅 Raw work orders from API:', workOrders);

          // Map work orders to card format
          const mappedWorkOrders = workOrders.map((wo: any) => ({
            id: wo.id,
            workOrderNumber: wo.workOrderNumber,
            vehicleInfo: wo.vehicle ? `${wo.vehicle.year} ${wo.vehicle.make} ${wo.vehicle.model}` : 'Unknown Vehicle',
            status: wo.status,
            jobType: wo.jobType,
            // Add more fields if needed
          }));

          // Categorize work orders by status
          const ongoing = mappedWorkOrders.filter((wo: any) => wo.status !== 'COMPLETED');
          const completed = mappedWorkOrders.filter((wo: any) => wo.status === 'COMPLETED');

          setOngoingReservations(ongoing);
          setCompletedReservations(completed);
        } else {
          console.error('Failed to fetch work orders:', data);
          setOngoingReservations([]);
          setCompletedReservations([]);
        }
      } catch (err) {
        console.error('Error fetching work orders:', err);
        setOngoingReservations([]);
        setCompletedReservations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkOrders();
    fetchServiceAdvisor();
  }, [refreshTrigger]);

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
  }, [ongoingReservations]);

  const getNotificationMessage = (reservation: any) => {
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
        {/* Top row: Call and Chat */}
        <View style={styles.topActions}>
          <Button label="Call" icon='call' containerStyle={{flex: 1, marginRight: 4}} onPress={() => {}} />
          <Button label="Chat" icon='chatbubble' containerStyle={{flex: 1, marginLeft: 4}} onPress={() => {navigation.navigate('ChatBox')}} />
        </View>
        {/* Bottom row: Delete and Reschedule */}
        <View style={styles.bottomActions}>
          <BorderButton
            label="Delete"
            icon="trash-outline"
            style={{flex: 1, marginRight: 4}}
            onPress={() => {
              setAlertConfig({
                visible: true,
                title: 'Delete Appointment',
                message: 'Are you sure you want to delete this appointment? This action cannot be undone.',
                type: 'warning',
                buttonType: 'double',
                confirmText: 'Delete',
                cancelText: 'Cancel',
                onCancel: () => setAlertConfig(null),
                onClose: async () => {
                  setAlertConfig(null);
                  try {
                    const token = await AsyncStorage.getItem('token');
                    if (!token) {
                      setAlertConfig({
                        visible: true,
                        title: 'Error',
                        message: 'Authentication required',
                        type: 'error',
                        buttonType: 'single',
                        onClose: () => setAlertConfig(null),
                      });
                      return;
                    }

                    console.log('🗑️ Attempting to delete appointment:', item.id);
                    const response = await fetch(`http://10.0.2.2:3000/appointments/${item.id}/cancel`, {
                      method: 'DELETE',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                      },
                    });

                    console.log('🗑️ Delete response status:', response.status);
                    const responseData = await response.json().catch(() => ({}));
                    console.log('🗑️ Delete response data:', responseData);

                    if (response.ok) {
                      setAlertConfig({
                        visible: true,
                        title: 'Success',
                        message: 'Appointment cancelled successfully',
                        type: 'success',
                        buttonType: 'single',
                        onClose: () => {
                          setAlertConfig(null);
                          setRefreshTrigger(prev => prev + 1); // Trigger refresh
                        },
                      });
                    } else {
                      const errorData = await response.json().catch(() => ({}));
                      setAlertConfig({
                        visible: true,
                        title: 'Error',
                        message: errorData.error || 'Failed to cancel appointment',
                        type: 'error',
                        buttonType: 'single',
                        onClose: () => setAlertConfig(null),
                      });
                    }
                  } catch (error) {
                    console.error('Error cancelling appointment:', error);
                    setAlertConfig({
                      visible: true,
                      title: 'Error',
                      message: 'Failed to cancel appointment. Please try again.',
                      type: 'error',
                      buttonType: 'single',
                      onClose: () => setAlertConfig(null),
                    });
                  }
                },
              });
            }}
          />
          <BorderButton
            label="Reschedule"
            icon="create-outline"
            style={{flex: 1, marginLeft: 4}}
            onPress={() => {
              setSelectedReservation(item);
              setRescheduleSheetVisible(true);
            }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderWorkOrderCard = ({ item }) => (
    <View style={styles.reservationCard}>
      <View style={styles.cardHeader}>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{item.workOrderNumber}</Text>
          <Text style={styles.vehicleInfo}>{item.vehicleInfo}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
      </View>
      
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceType}>Job Type: {item.jobType}</Text>
      </View>
      
      <View style={styles.cardActions}>
        <BorderButton label="View" icon="eye" style={{width: '100%'}} onPress={() => {
          // Placeholder for view action
          Alert.alert('View Work Order', `Viewing details for ${item.workOrderNumber}`);
        }} />
      </View>
    </View>
  );

  const renderOngoingReservation = ({ item }) => {
    return renderWorkOrderCard({ item });
  };

  const renderCompletedReservation = ({ item }) => {
    return renderWorkOrderCard({ item });
  };

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
      case 'ongoing':
        return ongoingReservations;
      case 'completed':
        return completedReservations;
      default:
        return ongoingReservations;
    }
  };

  const getCurrentRenderItem = () => {
    switch (activeTab) {
      case 'ongoing':
        return renderOngoingReservation;
      case 'completed':
        return renderCompletedReservation;
      default:
        return renderOngoingReservation;
    }
  };

  // Show loading component while fetching appointments
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header 
          icon="back"
          name="Garage Management"
          image=""
          onIconPress={() => navigation.navigate('Home')}
        />
        
        <LoadingComponent 
          loadingText="Loading appointments..." 
          size="medium"
          containerStyle={styles.loadingContainer}
          textStyle={styles.loadingText}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        icon="back"
        name="Garage Management"
        image=""
        onIconPress={() => navigation.navigate('Home')}
      />

      {/* Tab Navigation (Upcoming tab removed) */}
      <View style={styles.tabContainer}>
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

      {/* Reschedule Sheet */}
      <RescheduleSheet
        visible={rescheduleSheetVisible}
        onClose={() => {
          setRescheduleSheetVisible(false);
          setSelectedReservation(null);
        }}
        onConfirm={async (appointmentData) => {
           if (!selectedReservation) return;

           console.log('Appointment rescheduled successfully:', appointmentData);
           setAlertConfig({
             visible: true,
             title: 'Success',
             message: 'Appointment rescheduled successfully!',
             type: 'success',
             buttonType: 'single',
             onClose: () => {
               setAlertConfig(null);
               setRescheduleSheetVisible(false);
               setSelectedReservation(null);
               setRefreshTrigger(prev => prev + 1); // Trigger refresh
             },
           });
         }}
        existingAppointment={selectedReservation}
      />

      {/* Custom Alert */}
      {alertConfig && (
        <CustomAlert
          {...alertConfig}
        />
      )}
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
  },
  topActions: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bottomActions: {
    flexDirection: 'row',
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
  // Loading state styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.neutral600,
    fontWeight: '500',
  },
  // Waiting section styles
  waitingSection: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  waitingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.warning,
    marginBottom: 8,
  },
  waitingDescription: {
    fontSize: 14,
    color: Colors.neutral600,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  scheduledTimeContainer: {
    backgroundColor: Colors.neutral50,
    padding: 12,
    borderRadius: 8,
    width: '100%',
  },
  scheduledTimeLabel: {
    fontSize: 12,
    color: Colors.neutral500,
    marginBottom: 4,
  },
  scheduledTimeValue: {
    fontSize: 14,
    color: Colors.neutral900,
    fontWeight: '500',
  },
  // Service Advisor Row Styles
  serviceAdvisorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.neutral50,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  advisorInfo: {
    flex: 1,
  },
  advisorLabel: {
    fontSize: 12,
    color: Colors.neutral500,
    marginBottom: 2,
  },
  advisorName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral900,
  },
  callAdvisorButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  callAdvisorText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.neutral0,
  },
});

export default ReservationsScreen;