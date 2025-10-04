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
import LoadingComponent from '../../components/Loading';
import AppointmentSheet from '../../components/AppointmentSheet';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReservationsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'ongoing', 'completed'
  const [notifications, setNotifications] = useState<any[]>([]);
  const [appointmentSheetVisible, setAppointmentSheetVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [upcomingReservations, setUpcomingReservations] = useState<any[]>([]);
  const [ongoingReservations, setOngoingReservations] = useState<any[]>([]);
  const [completedReservations, setCompletedReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for upcoming reservations - fallback when backend is unavailable
  const mockUpcomingReservations = [
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

  // Fetch appointments from backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const userStr = await AsyncStorage.getItem('user');
        if (!userStr) {
          console.log('No user found, using mock data');
          setUpcomingReservations(mockUpcomingReservations);
          setOngoingReservations(mockOngoingReservations);
          setCompletedReservations(mockCompletedReservations);
          return;
        }

        const user = JSON.parse(userStr);
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.log('No token found, using mock data');
          setUpcomingReservations(mockUpcomingReservations);
          setOngoingReservations(mockOngoingReservations);
          setCompletedReservations(mockCompletedReservations);
          return;
        }

        console.log('Fetching appointments for user:', user.id);
        
        // Fetch appointments for this customer
        const res = await fetch(`http://10.0.2.2:3000/appointments?customerId=${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json();
        console.log('Appointments response:', data);

        if (res.ok && data.data) {
          const appointments = data.data;
          
          // Categorize appointments by status
          const upcoming = appointments.filter((apt: any) => 
            apt.status === 'PENDING' || apt.status === 'CONFIRMED'
          ).map((apt: any) => ({
            id: apt.id,
            customerName: apt.customer?.name || 'Customer',
            vehicleInfo: apt.vehicle ? `${apt.vehicle.year} ${apt.vehicle.make} ${apt.vehicle.model}` : 'Unknown Vehicle',
            Numberplate: apt.vehicle?.licensePlate || 'N/A',
            serviceType: apt.cannedServices?.map((cs: any) => cs.cannedService?.name).join(', ') || 'Service',
            scheduledDate: apt.requestedAt ? new Date(apt.requestedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            scheduledTime: apt.startTime ? new Date(apt.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'TBD',
            estimatedDuration: '2 hours', // Default duration
            status: apt.status?.toLowerCase() === 'confirmed' ? 'confirmed' : 'pending_confirmation',
            phone: apt.customer?.phone || 'N/A',
          }));

          const ongoing = appointments.filter((apt: any) =>
            apt.status === 'IN_PROGRESS' || apt.status === 'CHECKED_IN'
          ).map((apt: any) => ({
            id: apt.id,
            customerName: apt.customer?.name || 'Customer',
            vehicleInfo: apt.vehicle ? `${apt.vehicle.year} ${apt.vehicle.make} ${apt.vehicle.model}` : 'Unknown Vehicle',
            Numberplate: apt.vehicle?.licensePlate || 'N/A',
            serviceType: apt.cannedServices?.map((cs: any) => cs.cannedService?.name).join(', ') || 'Service',
            checkedInDate: apt.startTime ? new Date(apt.startTime).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            checkedInTime: apt.startTime ? new Date(apt.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'TBD',
            currentPhase: 'in_progress',
            phaseDescription: 'Service in Progress',
            estimatedCompletion: apt.endTime ? new Date(apt.endTime).toLocaleString() : 'TBD',
            assignedBay: 'Bay 1', // Default bay
            technician: 'Technician', // Default technician
            hasNotification: false,
            progress: 50, // Default progress
            navigation: 'InspectionOngoing',
          }));

          const completed = appointments.filter((apt: any) => 
            apt.status === 'COMPLETED' || apt.status === 'CANCELLED'
          ).map((apt: any) => ({
            id: apt.id,
            customerName: apt.customer?.name || 'Customer',
            vehicleInfo: apt.vehicle ? `${apt.vehicle.year} ${apt.vehicle.make} ${apt.vehicle.model}` : 'Unknown Vehicle',
            Numberplate: apt.vehicle?.licensePlate || 'N/A',
            serviceType: apt.cannedServices?.map((cs: any) => cs.cannedService?.name).join(', ') || 'Service',
            completedDate: apt.endTime ? new Date(apt.endTime).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            completedTime: apt.endTime ? new Date(apt.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'TBD',
            totalCost: 0, // Default cost
            status: apt.status?.toLowerCase() === 'completed' ? 'paid' : 'cancelled',
          }));

          setUpcomingReservations(upcoming.length > 0 ? upcoming : mockUpcomingReservations);
          setOngoingReservations(ongoing.length > 0 ? ongoing : mockOngoingReservations);
          setCompletedReservations(completed.length > 0 ? completed : mockCompletedReservations);
        } else {
          console.error('Failed to fetch appointments:', data);
          setUpcomingReservations(mockUpcomingReservations);
          setOngoingReservations(mockOngoingReservations);
          setCompletedReservations(mockCompletedReservations);
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setUpcomingReservations(mockUpcomingReservations);
        setOngoingReservations(mockOngoingReservations);
        setCompletedReservations(mockCompletedReservations);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

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
        <BorderButton label="Reschedule" icon="create-outline" style={{width: 140}} onPress={() => {
          setSelectedReservation(item);
          setAppointmentSheetVisible(true);
        }} />
      </View>
    </TouchableOpacity>
  );

  const renderOngoingReservation = ({ item }) => {
    // Check if car has arrived (using checkedInDate as indicator)
    const carArrived = item.checkedInDate && item.checkedInTime;

    return (
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

        {!carArrived ? (
          // Car not arrived yet
          <View style={styles.waitingSection}>
            <Text style={styles.waitingTitle}>Waiting for Vehicle Arrival</Text>
            <Text style={styles.waitingDescription}>
              Your vehicle has not arrived at the garage yet. Please arrive at your scheduled time.
            </Text>
            <View style={styles.scheduledTimeContainer}>
              <Text style={styles.scheduledTimeLabel}>Scheduled Arrival:</Text>
              <Text style={styles.scheduledTimeValue}>
                {item.scheduledDate} at {item.scheduledTime}
              </Text>
            </View>
          </View>
        ) : (
          // Car has arrived - show progress
          <>
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
          </>
        )}

        <View style={styles.cardActions}>
          <Button label="Call" icon='call' containerStyle={{width: 100}} onPress={() => {}} />
          <Button label="Chat" icon='chatbubble' containerStyle={{width: 100}} onPress={() =>navigation.navigate('ChatBox') } />
          <BorderButton
            label={carArrived ? "View Details" : "View Schedule"}
            icon="eye"
            style={{width: 140}}
            onPress={() => {
              if (carArrived) {
                // Navigate to InspectionOngoing for arrived cars
                navigation.navigate('InspectionOngoing');
              } else {
                // Could navigate to a schedule details screen or just show alert
                Alert.alert('Vehicle Not Arrived', 'Please arrive at the garage at your scheduled time.');
              }
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };

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
        <BorderButton label="View Report" icon="eye" style={{width: '100%'}} onPress={() => navigation.navigate('PaidServiceBillSummary', {
          serviceType: item.serviceType,
          location: 'Garage Location',
          date: item.completedDate,
          time: item.completedTime,
          garageName: 'MotorTrace Garage',
          services: [{ name: item.serviceType, price: item.totalCost }],
          cgst: 2.00,
          sgst: 2.00,
          discount: 5.00,
          workOrderId: item.id,
          serviceDetails: [
            {
              name: item.serviceType,
              description: `Completed ${item.serviceType} service`,
              status: 'completed',
              beforeCondition: 'Vehicle inspection needed',
              afterCondition: 'Service completed successfully',
              cost: item.totalCost
            }
          ]
        })} />
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

      {/* Appointment Sheet */}
      <AppointmentSheet
        visible={appointmentSheetVisible}
        onClose={() => setAppointmentSheetVisible(false)}
        onConfirm={(appointmentData) => {
          console.log('Appointment rescheduled:', appointmentData);
          // Here you would call the API to reschedule the appointment
          Alert.alert('Success', 'Appointment rescheduled successfully!');
        }}
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
});

export default ReservationsScreen;