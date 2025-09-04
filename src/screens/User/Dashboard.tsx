import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, FlatList, ImageBackground } from "react-native"
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from "../../constants/colors"
import Header from '../../components/Header'
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';
import { useUser } from '../../store/UserContext';

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
      title: "Book Service", 
      subtitle: "Schedule appointment",
      icon: "calendar", 
      color: Colors.primary, 
      screen: "Appointment",
      bgColor: Colors.primaryLight
    },
    { 
      id: 2, 
      title: "Service History", 
      subtitle: "View past services",
      icon: "time", 
      color: Colors.info,
      screen: "ServiceHistory",
      bgColor: Colors.infoLight
    },
    { 
      id: 3, 
      title: "Vehicle Details", 
      subtitle: "Manage your cars",
      icon: "car", 
      color: Colors.success,
      screen: "Cars",
      bgColor: Colors.successLight
    },
    { 
      id: 4, 
      title: "Track Service", 
      subtitle: "Real-time updates",
      icon: "location", 
      color: Colors.warning,
      screen: "ServiceProgress",
      bgColor: Colors.warningLight
    },
  ]

  const upcomingServices = [
    { id: 1, title: "Oil Change", vehicle: "Toyota Camry", dueDate: "Next week", priority: "high" },
    { id: 2, title: "Brake Inspection", vehicle: "Honda CR-V", dueDate: "2 weeks", priority: "medium" },
    { id: 3, title: "Tire Rotation", vehicle: "Toyota Camry", dueDate: "1 month", priority: "low" },
  ]

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'sedan': return 'car-outline'
      case 'suv': return 'car-sport-outline'
      case 'truck': return 'bus-outline'
      case 'hatchback': return 'car-outline'
      default: return 'car-outline'
    }
  }

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
        { marginLeft: index === 0 ? 24 : 0, marginRight: 16 },
        index === selectedVehicle && styles.selectedVehicleCard
      ]}
      onPress={() => setSelectedVehicle(index)}
    >
      <View style={styles.vehicleHeader}>
        <View style={[styles.vehicleIconContainer, { backgroundColor: item.color + '15' }]}>
          <Icon name={getVehicleIcon(item.type)} size={28} color={item.color} />
        </View>
        <View style={styles.vehicleStatus}>
          <View style={[styles.statusDot, { backgroundColor: getServiceStatusColor(item.serviceStatus) }]} />
        </View>
      </View>
      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleName}>{item.name}</Text>
        <Text style={styles.vehicleYear}>{item.year} • {item.license}</Text>
        <Text style={styles.vehicleMileage}>{item.mileage.toLocaleString()} km</Text>
        <Text style={styles.nextService}>Next: {item.nextService}</Text>
      </View>
      {index === selectedVehicle && (
        <View style={styles.selectedIndicator}>
          <Icon name="checkmark-circle" size={20} color={Colors.success} />
        </View>
      )}
    </TouchableOpacity>
  )

  const renderServiceStatus = ({ item }: { item: ServiceStatus }) => (
    <TouchableOpacity style={styles.serviceStatusCard}>
      <View style={styles.serviceStatusHeader}>
        <View style={[styles.serviceIcon, { backgroundColor: item.color + '15' }]}>
          <Icon name={item.icon} size={20} color={item.color} />
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>
      <View style={styles.serviceStatusContent}>
        <Text style={styles.serviceTitle}>{item.title}</Text>
        <Text style={styles.serviceVehicle}>{item.vehicle}</Text>
        <View style={styles.serviceTime}>
          <Icon name="time-outline" size={14} color={Colors.neutral500} />
          <Text style={styles.serviceTimeText}>{item.date} at {item.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon=""
        name={userName}
        image=""
        onIconPress={() => navigation.navigate('Home')}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Welcome back, {userName.split(' ')[0]}!</Text>
            <Text style={styles.heroSubtitle}>Your vehicles are ready for service</Text>
          </View>
          <View style={styles.heroStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2</Text>
              <Text style={styles.statLabel}>Vehicles</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1</Text>
              <Text style={styles.statLabel}>Active Service</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Upcoming</Text>
            </View>
          </View>
        </View>

        {/* Vehicles Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Vehicles</Text>
            <TouchableOpacity style={styles.addButton}>
              <Icon name="add" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={vehicles}
            renderItem={renderVehicleCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.vehiclesList}
          />
        </View>

        {/* Service Status */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Service Status</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ServiceProgress')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={serviceStatuses}
            renderItem={renderServiceStatus}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.serviceStatusList}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity 
                key={action.id} 
                style={[styles.quickActionCard, { backgroundColor: action.bgColor }]}
                onPress={() => navigation.navigate(action.screen)}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color + "20" }]}>
                  <Icon name={action.icon} size={24} color={action.color} />
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
                <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Upcoming Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Services</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ServiceHistory')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.upcomingContainer}>
            {upcomingServices.map((service) => (
              <View key={service.id} style={styles.upcomingItem}>
                <View style={styles.upcomingIcon}>
                  <Icon name="construct-outline" size={20} color={Colors.primary} />
                </View>
                <View style={styles.upcomingContent}>
                  <Text style={styles.upcomingTitle}>{service.title}</Text>
                  <Text style={styles.upcomingVehicle}>{service.vehicle}</Text>
                </View>
                <View style={styles.upcomingDate}>
                  <Text style={styles.upcomingDateText}>{service.dueDate}</Text>
                  <View style={[
                    styles.priorityBadge,
                    { backgroundColor: service.priority === 'high' ? Colors.danger + '15' : 
                                     service.priority === 'medium' ? Colors.warning + '15' : 
                                     Colors.success + '15' }
                  ]}>
                    <Text style={[
                      styles.priorityText,
                      { color: service.priority === 'high' ? Colors.danger : 
                               service.priority === 'medium' ? Colors.warning : 
                               Colors.success }
                    ]}>
                      {service.priority.charAt(0).toUpperCase() + service.priority.slice(1)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primarybg || "#F8FAFC",
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 32,
    marginBottom: 24,
  },
  heroContent: {
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.neutral0,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    color: Colors.neutral0 + "CC",
    fontWeight: "500",
  },
  heroStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.neutral0 + "20",
    borderRadius: 16,
    padding: 20,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.neutral0,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.neutral0 + "CC",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.neutral0 + "30",
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.neutral1000 || "#111827",
    letterSpacing: -0.5,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
  addButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: Colors.primary + "15",
  },
  vehiclesList: {
    paddingRight: 24,
  },
  vehicleCard: {
    width: 280,
    backgroundColor: Colors.neutral0,
    borderRadius: 20,
    padding: 20,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    position: "relative",
  },
  selectedVehicleCard: {
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "05",
  },
  vehicleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  vehicleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  vehicleStatus: {
    alignItems: "flex-end",
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.neutral1000 || "#111827",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  vehicleYear: {
    fontSize: 14,
    color: Colors.neutral600 || "#6B7280",
    marginBottom: 8,
    fontWeight: "500",
  },
  vehicleMileage: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.neutral800,
    marginBottom: 4,
  },
  nextService: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: "600",
  },
  selectedIndicator: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: Colors.neutral0,
    borderRadius: 10,
    padding: 2,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceStatusList: {
    paddingRight: 24,
  },
  serviceStatusCard: {
    width: 280,
    backgroundColor: Colors.neutral0,
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  serviceStatusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  serviceStatusContent: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.neutral900,
    marginBottom: 4,
  },
  serviceVehicle: {
    fontSize: 14,
    color: Colors.neutral600,
    marginBottom: 8,
  },
  serviceTime: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceTimeText: {
    fontSize: 13,
    color: Colors.neutral500,
    marginLeft: 4,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 24,
    gap: 16,
  },
  quickActionCard: {
    width: "47%",
    backgroundColor: Colors.neutral0,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    minHeight: 120,
    justifyContent: "center",
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.neutral700 || "#374151",
    textAlign: "center",
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: Colors.neutral500,
    textAlign: "center",
  },
  upcomingContainer: {
    paddingHorizontal: 24,
  },
  upcomingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.neutral0,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.neutral100,
  },
  upcomingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  upcomingContent: {
    flex: 1,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.neutral900,
    marginBottom: 4,
  },
  upcomingVehicle: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  upcomingDate: {
    alignItems: "flex-end",
  },
  upcomingDateText: {
    fontSize: 13,
    color: Colors.neutral500,
    marginBottom: 6,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: "600",
  },
})

export default DashboardScreen