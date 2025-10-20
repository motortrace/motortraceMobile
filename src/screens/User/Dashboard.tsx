import React, { useState, useCallback } from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, FlatList, ImageBackground } from "react-native"
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from "../../constants/colors"
import Header from '../../components/Header'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';
import { useUser } from '../../store/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert, { CustomAlertProps } from '../../components/Alert';

interface Vehicle {
  id: string;
  name: string;
  model: string;
  year: string;
  license: string;
  color: string;
  type: 'sedan' | 'suv' | 'truck' | 'hatchback';
  mileage: number;
  nextService: string;
  serviceStatus: 'good' | 'warning' | 'critical';
}

interface ServiceStatus {
  id: string;
  title: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'overdue';
  date: string;
  time: string;
  serviceType: string;
  vehicle: string;
  icon: string;
  color: string;
}

interface DashboardScreenProps {
  userName?: string
  onMenuPress?: () => void
  onNotificationPress?: () => void
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({
  _onMenuPress,
  _onNotificationPress,
}) => {
  const { user } = useUser();
  const userName = user?.name || "John Doe";
  const [selectedVehicle, setSelectedVehicle] = useState(0)
  const [trackedVehicleId, setTrackedVehicleId] = useState<string | null>(null);
  const [asyncStorageUser, setAsyncStorageUser] = useState<any>(null);
  const [realVehicles, setRealVehicles] = useState<Vehicle[]>([]);
  const [realServices, setRealServices] = useState<ServiceStatus[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    vehicles: 0,
    active: 0,
    scheduled: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [alertConfig, setAlertConfig] = useState<CustomAlertProps | null>(null);

  // Fetch dashboard data from backend
  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const userStr = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('token');

      if (!userStr || !token) {
        console.log('No user or token found, using mock data');
        setRealVehicles(vehicles); // Use existing mock data
        setRealServices(serviceStatuses);
        setDashboardStats({ vehicles: 2, active: 1, scheduled: 3 });
        return;
      }

      const user = JSON.parse(userStr);

      // Fetch vehicles
      try {
        console.log('📡 Fetching vehicles for customerId:', user.customerId || user.id);
        const customerId = user.customerId || user.id;
        const vehiclesRes = await fetch(`http://10.0.2.2:3000/vehicles?customerId=${customerId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Client-Type': 'mobile',
          },
        });

        console.log('📡 Vehicles response status:', vehiclesRes.status);

        if (vehiclesRes.ok) {
          const vehiclesData = await vehiclesRes.json();
          console.log('✅ Vehicles data received:', vehiclesData);

          if (vehiclesData.data && Array.isArray(vehiclesData.data)) {
            const formattedVehicles: Vehicle[] = vehiclesData.data.map((vehicle: any) => ({
              id: vehicle.id,
              name: `${vehicle.year || 'Unknown'} ${vehicle.make || 'Unknown'} ${vehicle.model || 'Unknown'}`,
              model: vehicle.model || 'Unknown',
              year: vehicle.year?.toString() || 'Unknown',
              license: vehicle.licensePlate || 'N/A',
              color: Colors.primary, // Default color
              type: 'sedan' as const, // Default type
              mileage: vehicle.currentMileage || 0, // Use actual mileage if available
              nextService: vehicle.nextServiceDue || 'Oil Change', // Use actual next service if available
              serviceStatus: vehicle.serviceStatus || 'good' as const,
            }));
            console.log('✅ Formatted vehicles:', formattedVehicles.length);
            console.log('🔍 DEBUG: Setting realVehicles to:', formattedVehicles);
            setRealVehicles(formattedVehicles);
          } else {
            console.log('⚠️ No vehicles data or invalid format');
            setRealVehicles([]);
          }
        } else {
          const errorText = await vehiclesRes.text();
          console.error('❌ Vehicles API error:', errorText);
          setRealVehicles([]);
        }
      } catch (error) {
        console.error('❌ Error fetching vehicles:', error);
        setAlertConfig({
          visible: true,
          title: 'Connection Error',
          message: 'Unable to load vehicle data. Please check your connection.',
          type: 'error',
          onClose: () => setAlertConfig(null),
        });
        setRealVehicles([]);
      }

      // Fetch appointments/services
      try {
        console.log('📡 Fetching appointments for customerId:', user.customerId || user.id);
        const customerId = user.customerId || user.id;
        console.log('📡 Appointments API URL:', `http://10.0.2.2:3000/appointments?customerId=${customerId}`);
        const appointmentsRes = await fetch(`http://10.0.2.2:3000/appointments?customerId=${customerId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Client-Type': 'mobile',
          },
        });

        console.log('📡 Appointments response status:', appointmentsRes.status);
        console.log('📡 Appointments response ok:', appointmentsRes.ok);

        if (appointmentsRes.ok) {
          const appointmentsData = await appointmentsRes.json();
          console.log('✅ Appointments data received:', appointmentsData);
          console.log('✅ Appointments data structure:', {
            hasData: !!appointmentsData.data,
            dataType: typeof appointmentsData.data,
            dataLength: appointmentsData.data?.length || 0
          });

          if (appointmentsData.data && Array.isArray(appointmentsData.data)) {
            const appointments = appointmentsData.data;
            console.log('📊 Total appointments found:', appointments.length);

            // Calculate stats from real data
            const now = new Date();
            const totalVehicles = realVehicles.length > 0 ? realVehicles.length : 0;
            const activeServices = appointments.filter((apt: any) => {
              const startTime = apt.startTime ? new Date(apt.startTime) : null;
              return (apt.status === 'IN_PROGRESS' || apt.status === 'CHECKED_IN') &&
                     (!startTime || startTime <= now);
            }).length;
            const scheduledServices = appointments.filter((apt: any) => {
              const startTime = apt.startTime ? new Date(apt.startTime) : null;
              return (apt.status === 'PENDING' || apt.status === 'CONFIRMED') &&
                     startTime && startTime > now;
            }).length;

            console.log('📊 Dashboard stats calculated:', {
              vehicles: totalVehicles,
              active: activeServices,
              scheduled: scheduledServices
            });
            console.log('🔍 DEBUG: realVehicles state at stats calc:', realVehicles.length, 'vehicles');
            // console.log('🔍 DEBUG: formattedVehicles from API:', formattedVehicles?.length || 0, 'vehicles');

            setDashboardStats({
              vehicles: totalVehicles,
              active: activeServices,
              scheduled: scheduledServices
            });
            console.log('🔍 DEBUG: dashboardStats set to:', { vehicles: totalVehicles, active: activeServices, scheduled: scheduledServices });

            // Format recent services (show all appointments, not just first 3)
            const formattedServices: ServiceStatus[] = appointments.map((apt: any) => ({
              id: apt.id,
              title: apt.cannedServices?.map((cs: any) => cs.cannedService?.name).join(', ') || 'Service',
              status: apt.status === 'IN_PROGRESS' ? 'in-progress' :
                     apt.status === 'COMPLETED' ? 'completed' :
                     apt.status === 'PENDING' ? 'scheduled' :
                     apt.status === 'CONFIRMED' ? 'scheduled' : 'scheduled',
              date: apt.startTime ? new Date(apt.startTime).toLocaleDateString() : 'TBD',
              time: apt.startTime ? new Date(apt.startTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              }) : 'TBD',
              serviceType: 'Service',
              vehicle: apt.vehicle ? `${apt.vehicle.year || 'Unknown'} ${apt.vehicle.make || 'Unknown'} ${apt.vehicle.model || 'Unknown'}` : 'Unknown Vehicle',
              icon: 'construct',
              color: Colors.primary
            }));

            console.log('✅ Formatted services:', formattedServices.length);
            setRealServices(formattedServices.length > 0 ? formattedServices : []);
          } else {
            console.log('⚠️ No appointments data or invalid format');
            setDashboardStats({ vehicles: realVehicles.length, active: 0, scheduled: 0 });
            setRealServices([]);
          }
        } else {
          const errorText = await appointmentsRes.text();
          console.error('❌ Appointments API error:', errorText);
          setDashboardStats({ vehicles: realVehicles.length, active: 0, scheduled: 0 });
          setRealServices([]);
        }
      } catch (error) {
        console.error('❌ Error fetching appointments:', error);
        setAlertConfig({
          visible: true,
          title: 'Connection Error',
          message: 'Unable to load appointment data. Please check your connection.',
          type: 'error',
          onClose: () => setAlertConfig(null),
        });
        setDashboardStats({ vehicles: realVehicles.length, active: 0, scheduled: 0 });
        setRealServices([]);
      }

    } catch (error) {
      console.error('Error in dashboard data fetch:', error);
      // Use mock data as fallback
      setRealVehicles(vehicles);
      setRealServices(serviceStatuses);
      setDashboardStats({ vehicles: 2, active: 1, scheduled: 3 });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [fetchDashboardData])
  );

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const vehicles: Vehicle[] = [
    {
      id: '1',
      name: 'Toyota Camry',
      model: 'Camry',
      year: '2022',
      license: 'ABC-1234',
      color: Colors.primary,
      type: 'sedan',
      mileage: 45230,
      nextService: 'Oil Change',
      serviceStatus: 'warning'
    },
    {
      id: '2',
      name: 'Honda CR-V',
      model: 'CR-V',
      year: '2021',
      license: 'XYZ-5678',
      color: Colors.primary,
      type: 'suv',
      mileage: 32150,
      nextService: 'Brake Inspection',
      serviceStatus: 'good'
    }
  ]

  const serviceStatuses: ServiceStatus[] = [
    {
      id: '1',
      title: 'Oil Change & Filter',
      status: 'scheduled',
      date: 'Tomorrow',
      time: '10:00 AM',
      serviceType: 'Maintenance',
      vehicle: 'Toyota Camry',
      icon: 'construct',
      color: Colors.primary
    },
    {
      id: '2',
      title: 'Brake System Inspection',
      status: 'in-progress',
      date: 'Today',
      time: '2:30 PM',
      serviceType: 'Inspection',
      vehicle: 'Honda CR-V',
      icon: 'shield-checkmark',
      color: Colors.warning
    },
    {
      id: '3',
      title: 'Tire Rotation',
      status: 'completed',
      date: '2 days ago',
      time: '11:00 AM',
      serviceType: 'Maintenance',
      vehicle: 'Toyota Camry',
      icon: 'car-sport',
      color: Colors.success
    }
  ]

  const quickActions = [
    { 
      id: 1, 
      title: "Book Services", 
      subtitle: "Buy packages for your vehicles",
      icon: "time", 
      color: "#3B82F6",
      screen: "AllPackages",
      bgColor: "#EFF6FF"
    },
    { 
      id: 2, 
      title: "Vehicle Details",
      subtitle: "Manage your cars",
      icon: "car", 
      color: "#10B981",
      screen: "Cars",
      bgColor: "#ECFDF5",
    },
    {
      id: 3,
      title: "Track Service",
      subtitle: "Real-time updates",
      icon: "location",
      color: "#F59E0B",
      screen: "Reservations",
      bgColor: "#FFFBEB"
    },
    {
      id: 4,
      title: "Appointments",
      subtitle: "View your bookings",
      icon: "receipt",
      color: "#8B5CF6",
      screen: "Appointments",
      bgColor: "#F3F4FF"
    },
  ]

  // This will be populated from backend data or can be removed if not needed
  // Removed upcomingServices - now using real appointment data


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return Colors.primary;
      case 'in-progress': return Colors.warning;
      case 'completed': return Colors.success;
      case 'overdue': return Colors.danger;
      default: return Colors.neutral500;
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Scheduled';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'overdue': return 'Overdue';
      default: return 'Unknown';
    }
  }

  const getServiceStatusColor = (status: string) => {
    switch (status) {
      case 'good': return Colors.success;
      case 'warning': return Colors.warning;
      case 'critical': return Colors.danger;
      default: return Colors.neutral500;
    }
  }

  const renderVehicleCard = ({ item, index }: { item: Vehicle; index: number }) => (
    <TouchableOpacity
      style={[
        styles.vehicleCard,
        { marginLeft: index === 0 ? 20 : 0, marginRight: 12 },
        index === selectedVehicle && styles.selectedVehicleCard
      ]}
      onPress={() => setSelectedVehicle(index)}
    >
      <View style={styles.vehicleHeader}>
        <View>
        </View>
        <View style={[styles.statusIndicator, { backgroundColor: getServiceStatusColor(item.serviceStatus) }]} />
      </View>
      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.vehicleDetails}>{item.year} • {item.license}</Text>
        <View style={styles.vehicleMetrics}>
          <Text style={styles.mileageText}>{item.mileage.toLocaleString()} km</Text>
          <View style={styles.nextServiceContainer}>
            <Icon name="time-outline" size={12} color={Colors.neutral500} />
            <Text style={styles.nextServiceText}>{item.nextService}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderServiceStatus = ({ item }: { item: ServiceStatus }) => (
    <TouchableOpacity style={[styles.serviceCard, { marginLeft: item.id === '1' ? 20 : 0 }]}>
      <View style={styles.serviceHeader}>
        <View style={[styles.serviceIconContainer, { backgroundColor: item.color + '15' }]}>
          <Icon name={item.icon} size={18} color={item.color} />
        </View>
        <View style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusChipText}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>
      <Text style={styles.serviceTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.serviceVehicle} numberOfLines={1}>{item.vehicle}</Text>
      <View style={styles.serviceDateTime}>
        <Icon name="calendar-outline" size={12} color={Colors.neutral400} />
        <Text style={styles.serviceDateTimeText}>{item.date}</Text>
        <Text style={styles.serviceTimeText}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon="none"
        showNotification={true}
      />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            Good morning, <Text style={styles.userName}>{userName.split(' ')[0]}</Text>
          </Text>
          <Text style={styles.welcomeSubtitle}>Let's keep your vehicles in perfect condition</Text>
          
          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{dashboardStats.vehicles}</Text>
              <Text style={styles.statLabel}>Vehicles</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{dashboardStats.active}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{dashboardStats.scheduled}</Text>
              <Text style={styles.statLabel}>Scheduled</Text>
            </View>
          </View>
        </View>

        {/* Debug: AsyncStorage User Data - Commented out for production
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {marginLeft: 20}]}>🔍 Debug: AsyncStorage User Data</Text>
          <View style={styles.debugContainer}>
            <Text style={styles.debugTitle}>User from AsyncStorage:</Text>
            {asyncStorageUser ? (
              <ScrollView style={styles.debugScrollView} showsVerticalScrollIndicator={false}>
                <Text style={styles.debugText}>
                  {JSON.stringify(asyncStorageUser, null, 2)}
                </Text>
              </ScrollView>
            ) : (
              <Text style={styles.debugText}>No user data found in AsyncStorage</Text>
            )}

            <Text style={[styles.debugTitle, {marginTop: 16}]}>User from Context:</Text>
            <ScrollView style={styles.debugScrollView} showsVerticalScrollIndicator={false}>
              <Text style={styles.debugText}>
                {JSON.stringify(user, null, 2)}
              </Text>
            </ScrollView>
          </View>
        </View>
        */}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {marginLeft: 20}] }>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickActionCard, { backgroundColor: action.bgColor }]}
                // @ts-ignore - Navigation type issue
                onPress={() => navigation.navigate(action.screen)}
              >
                <View style={[styles.quickActionIconContainer, { backgroundColor: action.color + "15" }]}>
                  <Icon name={action.icon} size={20} color={action.color} />
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
                <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* My Vehicles */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Vehicles</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Cars')}>
              <Icon name="add" size={18} color={Colors.primary} />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={realVehicles.length > 0 ? realVehicles : vehicles}
            renderItem={renderVehicleCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.vehiclesList}
          />
        </View>

        {/* Recent Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Services</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ServiceProgress')}>
              <Text style={styles.viewAllButton}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={realServices.length > 0 ? realServices : serviceStatuses}
            renderItem={renderServiceStatus}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesList}
          />
        </View>

        {/* Recent Services - Now shows actual appointment data */}
        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Services</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Appointments')}>
              <Text style={styles.viewAllButton}>View All</Text>
            </TouchableOpacity>
          </View>
          {realServices.length > 0 ? (
            <FlatList
              data={realServices.slice(0, 3)} // Show only first 3
              renderItem={renderServiceStatus}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.servicesList}
            />
          ) : (
            <View style={styles.emptyStateContainer}>
              <Icon name="construct-outline" size={48} color={Colors.neutral400} />
              <Text style={styles.emptyStateTitle}>No Recent Services</Text>
              <Text style={styles.emptyStateText}>Your service history will appear here</Text>
            </View>
          )}
        </View>
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  
  // Welcome Section
  welcomeSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 25,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 32,
  },
  userName: {
    color: Colors.primary,
    fontWeight: '700',
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '400',
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },

  // Section Styles
  section: {
    marginBottom: 28,
  },
  lastSection: {
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  viewAllButton: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  addButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },

  // Quick Actions
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  quickActionCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  quickActionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 2,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },

  // Vehicles List
  vehiclesList: {
    paddingRight: 20,
  },
  vehicleCard: {
    width: 240,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  selectedVehicleCard: {
    borderColor: Colors.primary,
    borderWidth: 2,
    shadowColor: Colors.primary,
    shadowOpacity: 0.15,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  vehicleIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  vehicleDetails: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  vehicleMetrics: {
    gap: 6,
  },
  mileageText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  nextServiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  nextServiceText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },

  // Services List
  servicesList: {
    paddingRight: 20,
  },
  serviceCard: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    lineHeight: 18,
  },
  serviceVehicle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  serviceDateTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  serviceDateTimeText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  serviceTimeText: {
    fontSize: 11,
    color: '#6B7280',
  },

  // Empty State Styles
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral700,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.neutral500,
    textAlign: 'center',
  },

  // Debug Section Styles
  debugContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  debugScrollView: {
    maxHeight: 200,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  debugText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#374151',
    lineHeight: 16,
  },
})

export default DashboardScreen