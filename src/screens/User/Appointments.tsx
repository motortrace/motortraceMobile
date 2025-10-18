import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
import Colors from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert, { CustomAlertProps } from '../../components/Alert';

interface Appointment {
  id: string;
  customerId: string;
  vehicleId: string;
  requestedAt: Date;
  startTime: Date;
  endTime?: Date;
  status: string;
  priority: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  assignedToId?: string;
  cannedServices: {
    id: string;
    code: string;
    name: string;
    duration: number;
    price: number;
    quantity: number;
    notes?: string;
  }[];
  customer: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    profileImage?: string | null;
    userProfileId?: string;
  };
  vehicle: {
    id: string;
    make: string;
    model: string;
    year?: number;
    licensePlate?: string;
  };
  assignedTo?: {
    id: string;
    supabaseUserId: string;
    profileImage?: string | null;
  };
}

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [alertConfig, setAlertConfig] = useState<CustomAlertProps | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      console.log('Fetching appointments...');

      const userStr = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('token');

      if (!userStr || !token) {
        console.log('No user or token found');
        setAlertConfig({
          visible: true,
          title: 'Authentication Required',
          message: 'Please login to view appointments',
          type: 'error',
          onClose: () => setAlertConfig(null),
        });
        return;
      }

      const user = JSON.parse(userStr);
      console.log('User data:', user);
      console.log('User ID:', user.id);
      console.log('Customer ID:', user.customerId);

      // Use customerId if available, otherwise fallback to user.id
      const customerId = user.customerId || user.id;
      console.log('Using customerId for API call:', customerId);

      const response = await fetch(`http://10.0.2.2:3000/appointments?customerId=${customerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('API Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Appointments data:', data);

        if (data.data) {
          // Filter for future appointments only
          const now = new Date();
          const futureAppointments = data.data.filter((apt: any) => {
            const startTime = new Date(apt.startTime);
            return startTime > now;
          });

          console.log('Future appointments:', futureAppointments.length);
          setAppointments(futureAppointments);
        }
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        setAlertConfig({
          visible: true,
          title: 'Error',
          message: 'Failed to load appointments',
          type: 'error',
          onClose: () => setAlertConfig(null),
        });
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: 'Failed to load appointments',
        type: 'error',
        onClose: () => setAlertConfig(null),
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAppointments();
    setRefreshing(false);
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return Colors.warning;
      case 'CONFIRMED': return Colors.primary;
      case 'IN_PROGRESS': return Colors.info;
      case 'COMPLETED': return Colors.success;
      case 'CANCELLED': return Colors.danger;
      default: return Colors.neutral500;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Pending';
      case 'CONFIRMED': return 'Confirmed';
      case 'IN_PROGRESS': return 'In Progress';
      case 'COMPLETED': return 'Completed';
      case 'CANCELLED': return 'Cancelled';
      default: return status;
    }
  };

  const formatDateTime = (date: Date) => {
    const d = new Date(date);
    return {
      date: d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
      time: d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const renderAppointmentCard = (appointment: Appointment) => {
    const { date, time } = formatDateTime(appointment.startTime);

    return (
      <View key={appointment.id} style={styles.appointmentCard}>
        <View style={styles.appointmentHeader}>
          <View style={styles.appointmentInfo}>
            <Text style={styles.vehicleName}>
              {appointment.vehicle.year} {appointment.vehicle.make} {appointment.vehicle.model}
            </Text>
            <Text style={styles.licensePlate}>
              {appointment.vehicle.licensePlate || 'No License'}
            </Text>
          </View>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(appointment.status) + '20' }
              ]}
            >
              <Text
                style={[styles.statusText, { color: getStatusColor(appointment.status) }]}
              >
                {getStatusText(appointment.status)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.appointmentDetails}>
          <View style={styles.dateTimeContainer}>
            <Icon name="calendar-outline" size={16} color={Colors.neutral600} />
            <Text style={styles.dateText}>{date}</Text>
            <Icon name="time-outline" size={16} color={Colors.neutral600} style={styles.timeIcon} />
            <Text style={styles.timeText}>{time}</Text>
          </View>

          <View style={styles.servicesContainer}>
            <Text style={styles.servicesLabel}>Services:</Text>
            <Text style={styles.servicesText}>
              {appointment.cannedServices.map(s => s.name).join(', ')}
            </Text>
          </View>

          {appointment.notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.notesLabel}>Notes:</Text>
              <Text style={styles.notesText}>{appointment.notes}</Text>
            </View>
          )}
        </View>

        {/* No actions for users - appointments are managed by service center */}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.neutral0} />

      <Header
        icon="back"
        name="Appointments"
        image=""
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading appointments...</Text>
          </View>
        ) : appointments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="calendar-outline" size={64} color={Colors.neutral400} />
            <Text style={styles.emptyTitle}>No Upcoming Appointments</Text>
            <Text style={styles.emptySubtitle}>
              You don't have any upcoming appointments scheduled
            </Text>
          </View>
        ) : (
          <View style={styles.appointmentsContainer}>
            {appointments.map(renderAppointmentCard)}
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {alertConfig && (
        <CustomAlert
          visible={alertConfig.visible}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          onClose={alertConfig.onClose}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral0,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.neutral50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.neutral500,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.neutral700,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.neutral500,
    textAlign: 'center',
  },
  appointmentsContainer: {
    padding: 16,
  },
  appointmentCard: {
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.neutral1000,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  appointmentInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.neutral700,
    marginBottom: 4,
  },
  licensePlate: {
    fontSize: 12,
    color: Colors.neutral500,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  appointmentDetails: {
    marginBottom: 12,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral700,
    marginLeft: 4,
  },
  timeIcon: {
    marginLeft: 12,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral700,
    marginLeft: 4,
  },
  servicesContainer: {
    marginBottom: 8,
  },
  servicesLabel: {
    fontSize: 12,
    color: Colors.neutral500,
    marginBottom: 2,
  },
  servicesText: {
    fontSize: 14,
    color: Colors.neutral700,
  },
  notesContainer: {
    marginBottom: 8,
  },
  notesLabel: {
    fontSize: 12,
    color: Colors.neutral500,
    marginBottom: 2,
  },
  notesText: {
    fontSize: 14,
    color: Colors.neutral700,
    fontStyle: 'italic',
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default Appointments;