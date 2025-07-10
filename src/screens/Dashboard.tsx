import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, FlatList, Image } from "react-native"
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from "../constants/colors"
import Header from '../components/Header'
import Footer from "../components/Footer";
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';

interface Vehicle {
  id: string;
  name: string;
  model: string;
  year: string;
  license: string;
  color: string;
  type: 'sedan' | 'suv' | 'truck' | 'hatchback';
}

interface DashboardScreenProps {
  userName?: string
  onMenuPress?: () => void
  onNotificationPress?: () => void
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({
  userName = "Terry",
  onMenuPress,
  onNotificationPress,
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState(0)

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Function to get current greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const vehicles: Vehicle[] = [
    {
      id: '1',
      name: 'Toyota Camry',
      model: 'Camry',
      year: '2022',
      license: 'ABC-1234',
      color: Colors.primary,
      type: 'sedan'
    },
    {
      id: '2',
      name: 'Honda CR-V',
      model: 'CR-V',
      year: '2021',
      license: 'XYZ-5678',
      color: Colors.primary,
      type: 'suv'
    },
    {
      id: '3',
      name: 'Ford F-150',
      model: 'F-150',
      year: '2023',
      license: 'DEF-9012',
      color: Colors.primary,
      type: 'truck'
    }
  ]

  const quickActions: { id: number; title: string; icon: string; color: string; screen: keyof RootStackParamList; bgColor: string }[] = [
    { 
      id: 1,
      title: "Garages",
      icon: "construct-outline",
      color: Colors.primary,
      screen: "Garages" as keyof RootStackParamList,
      bgColor: Colors.neutral0
    },
    { 
      id: 2,
      title: "Forums",
      icon: "chatbubbles-outline",
      color: Colors.primary,
      screen: "Forum" as keyof RootStackParamList,
      bgColor: Colors.neutral0
    },
    { 
      id: 3,
      title: "Parts",
      icon: "settings-outline",
      color: Colors.primary,
      screen: "Parts" as keyof RootStackParamList,
      bgColor: Colors.neutral0
    },
    { 
      id: 4,
      title: "Trips",
      icon: "map-outline",
      color: Colors.primary,
      screen: "Trips" as keyof RootStackParamList,
      bgColor: Colors.neutral0
    },
  ]

  const recentActivity = [
    { id: 1, title: "Oil Change Completed", date: "2 days ago", status: "completed", icon: "checkmark-circle" },
    { id: 2, title: "Tire Rotation Scheduled", date: "Tomorrow", status: "upcoming", icon: "time" },
    { id: 3, title: "Annual Service Due", date: "Next week", status: "pending", icon: "alert-circle" },
  ]

  // Maintenance alert logic based on current mileage
  const getCurrentMileage = () => {
    // This would typically come from your vehicle data
    return 23500; // Example current mileage
  }

  const getMaintenanceAlerts = () => {
    const currentMileage = getCurrentMileage();
    const alerts = [];

    // Oil Change - every 5,000-7,500 miles
    const lastOilChange = Math.floor(currentMileage / 5000) * 5000;
    const nextOilChange = lastOilChange + 5000;
    if (nextOilChange - currentMileage <= 1000) {
      alerts.push({
        id: 'oil',
        title: 'Oil & Filter Change',
        type: 'oil',
        milesLeft: nextOilChange - currentMileage,
        nextMileage: nextOilChange,
        priority: nextOilChange - currentMileage <= 500 ? 'high' : 'medium',
        icon: 'water-outline',
        color: nextOilChange - currentMileage <= 500 ? '#EF4444' : '#F59E0B'
      });
    }

    // Tire Rotation - every 5,000-7,500 miles
    const lastTireRotation = Math.floor(currentMileage / 6000) * 6000;
    const nextTireRotation = lastTireRotation + 6000;
    if (nextTireRotation - currentMileage <= 1000) {
      alerts.push({
        id: 'tires',
        title: 'Tire Rotation',
        type: 'tires',
        milesLeft: nextTireRotation - currentMileage,
        nextMileage: nextTireRotation,
        priority: nextTireRotation - currentMileage <= 500 ? 'high' : 'medium',
        icon: 'swap-horizontal-outline',
        color: nextTireRotation - currentMileage <= 500 ? '#EF4444' : '#F59E0B'
      });
    }

    // Brake Inspection - every 15,000 miles
    const lastBrakeInspection = Math.floor(currentMileage / 15000) * 15000;
    const nextBrakeInspection = lastBrakeInspection + 15000;
    if (nextBrakeInspection - currentMileage <= 2000) {
      alerts.push({
        id: 'brakes',
        title: 'Brake Inspection',
        type: 'brakes',
        milesLeft: nextBrakeInspection - currentMileage,
        nextMileage: nextBrakeInspection,
        priority: nextBrakeInspection - currentMileage <= 1000 ? 'high' : 'medium',
        icon: 'disc-outline',
        color: nextBrakeInspection - currentMileage <= 1000 ? '#EF4444' : '#F59E0B'
      });
    }

    // Air Filter - every 15,000-30,000 miles
    const lastAirFilter = Math.floor(currentMileage / 20000) * 20000;
    const nextAirFilter = lastAirFilter + 20000;
    if (nextAirFilter - currentMileage <= 2000) {
      alerts.push({
        id: 'airfilter',
        title: 'Air Filter Replacement',
        type: 'filter',
        milesLeft: nextAirFilter - currentMileage,
        nextMileage: nextAirFilter,
        priority: nextAirFilter - currentMileage <= 1000 ? 'high' : 'low',
        icon: 'leaf-outline',
        color: nextAirFilter - currentMileage <= 1000 ? '#EF4444' : '#10B981'
      });
    }

    // Transmission Service - every 30,000-60,000 miles
    const lastTransmission = Math.floor(currentMileage / 40000) * 40000;
    const nextTransmission = lastTransmission + 40000;
    if (nextTransmission - currentMileage <= 5000) {
      alerts.push({
        id: 'transmission',
        title: 'Transmission Service',
        type: 'transmission',
        milesLeft: nextTransmission - currentMileage,
        nextMileage: nextTransmission,
        priority: nextTransmission - currentMileage <= 2000 ? 'high' : 'low',
        icon: 'cog-outline',
        color: nextTransmission - currentMileage <= 2000 ? '#EF4444' : '#10B981'
      });
    }

    return alerts.sort((a, b) => a.milesLeft - b.milesLeft);
  }

  const maintenanceAlerts = getMaintenanceAlerts();

  const stats = [
    { label: "Total Services", value: "12", change: "+2", icon: "build", color: Colors.primary },
    { label: "Miles Driven", value: "15.2K", change: "+1.2K", icon: "speedometer", color: Colors.primary },
    { label: "Fuel Efficiency", value: "28.5 MPG", change: "+0.8", icon: "leaf", color: Colors.success },
    { label: "Monthly Savings", value: "$142", change: "+$12", icon: "wallet", color: Colors.success },
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

  const renderVehicleCard = ({ item, index }: { item: Vehicle; index: number }) => (
    <TouchableOpacity
      style={[
        styles.vehicleCard,
        { marginLeft: index === 0 ? 24 : 0, marginRight: 16 },
        index === selectedVehicle && styles.selectedVehicleCard
      ]}
      onPress={() => setSelectedVehicle(index)}
    >
      <View style={[styles.vehicleIconContainer, { backgroundColor: item.color + '15' }]}>
        <Icon name={getVehicleIcon(item.type)} size={36} color={item.color} />
      </View>
      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleName}>{item.name}</Text>
        <Text style={styles.vehicleYear}>{item.year}</Text>
        <Text style={styles.vehicleDetails}>{item.license}</Text>
      </View>
      {index === selectedVehicle && (
        <View style={styles.selectedIndicator}>
          <Icon name="checkmark-circle" size={24} color={Colors.success} />
        </View>
      )}
    </TouchableOpacity>
  )

  const selectedVehicleData = vehicles[selectedVehicle] || vehicles[0];

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Dashboard"
        name={userName}
        modern={true}
        onSearchPress={() => console.log('Search pressed')}
        onNotificationPress={onNotificationPress || (() => console.log('Notification pressed'))}
        image={undefined}
      />



      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Fleet Overview Section */}
          <View style={styles.fleetOverviewContainer}>
            <View style={styles.fleetOverviewCardsRow}>
              <View style={styles.fleetCardCompact}>
                <Text style={styles.fleetCardLabelSmall}>Vehicles</Text>
                <Text style={styles.fleetCardValueSmall}>3</Text>
              </View>
              <View style={styles.fleetCardCompact}>
                <Text style={styles.fleetCardLabelSmall}>Miles travelled</Text>
                <Text style={styles.fleetCardValueSmall}>1,247</Text>
              </View>
            </View>
          </View>
        {/* Currently Selected Vehicle Section */}
        <View style={styles.section}>
          <View style={[styles.cardsHeaderRow, {marginTop: 18}]}> 
            <Text style={styles.cardsHeaderTitle}>Currently Selected</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Cars')}>
              <Text style={styles.cardsHeaderAction}>Change vehicle</Text>
            </TouchableOpacity>
          </View>
          
          {/* Properly positioned vehicle card */}
          <View style={styles.vehicleCardContainer}>
            <View style={styles.vehicleCardNeoLarge}>
              <View style={styles.vehicleCardContentRow}>
                <View style={styles.vehicleCardTextSection}>
                  <Text style={styles.vehicleNameNeo}>{selectedVehicleData.name}</Text>
                  <Text style={styles.vehicleYearNeo}>{selectedVehicleData.year}</Text>
                  <Text style={styles.vehicleLicenseNeo}>{selectedVehicleData.license}</Text>
                  <TouchableOpacity style={styles.vehicleDetailsBtn}>
                    <Icon name="eye-outline" size={18} color="#222" style={{ marginRight: 4 }} />
                    <Text style={styles.vehicleDetailsBtnText}>Details</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.vehicleImageSection} pointerEvents="none">
                  <Image source={require('../assets/images/car.png')} style={styles.vehicleImageNeoLarge} />
                </View>
              </View>
            </View>
          </View>
        </View>

                {/* Quick Actions - Improved Design */}
        <View style={styles.section}>
          <View style={[styles.cardsHeaderRow, {marginTop: 0}]}> 
            <Text style={styles.cardsHeaderTitle}>Quick Actions</Text>
            <TouchableOpacity onPress={() => console.log('View all actions')}>
              <Text style={styles.cardsHeaderAction}>View all</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.quickActionsContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickActionsRowNeo}
            >
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={styles.quickActionSquareBtn}
                  onPress={() => navigation.navigate(action.screen as any)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.quickActionSquareIcon, { backgroundColor: action.bgColor || '#111' }]}> 
                    <Icon name={action.icon} size={36} color={'#0958dc'} />
                    {action.title === 'Garages' && (
                      <View style={styles.quickActionNotificationBadge}>
                        <Text style={styles.quickActionNotificationBadgeText}>2</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.quickActionSquareLabel, action.color ? { color: action.color } : null]}>{action.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Maintenance Alerts Section */}
        {maintenanceAlerts.length > 0 && (
          <View style={styles.section}>
            <View style={[styles.cardsHeaderRow, {marginTop: 0}]}> 
              <Text style={styles.cardsHeaderTitle}>Maintenance Alerts</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Garages' as any)}>
                <Text style={styles.cardsHeaderAction}>View all</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.maintenanceAlertsContainer}>
              {maintenanceAlerts.slice(0, 3).map((alert) => (
                <View key={alert.id} style={styles.maintenanceAlertCard}>
                  <View style={[styles.maintenanceAlertIcon, { backgroundColor: alert.color + '15' }]}>
                    <Icon name={alert.icon} size={28} color={alert.color} />
                  </View>
                  <View style={styles.maintenanceAlertContent}>
                    <Text style={styles.maintenanceAlertTitle}>{alert.title}</Text>
                    <Text style={styles.maintenanceAlertMileage}>
                      {alert.milesLeft} miles left
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.maintenanceAlertButton}
                    onPress={() => navigation.navigate('Garages' as any)}
                  >
                    <Icon name="search-outline" size={20} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}



        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
      <Footer activeTab="home" />
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
  section: {
    marginBottom: 36,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  sectionHeaderSimple: {
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.neutral1000 || "#111827",
    letterSpacing: -0.5,
  },
  addButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: Colors.primary + "10",
  },
  vehiclesList: {
    paddingRight: 24,
  },
  vehicleCard: {
    width: 380,
    backgroundColor: Colors.neutral0,
    borderRadius: 24,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  selectedVehicleCard: {
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "05",
  },
  vehicleIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 19,
    fontWeight: "700",
    color: Colors.neutral1000 || "#111827",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  vehicleYear: {
    fontSize: 15,
    color: Colors.neutral600 || "#6B7280",
    marginBottom: 4,
    fontWeight: "500",
  },
  vehicleDetails: {
    fontSize: 14,
    color: Colors.neutral500 || "#9CA3AF",
    fontWeight: "500",
  },
  selectedIndicator: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    padding: 2,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  // NEW QUICK ACTIONS STYLES - Matching "Currently Selected" Design
  quickActionsContainer: {
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  quickActionsRowNeo: {
    paddingHorizontal: 18,
    gap: 18,
    overflow: 'visible',
  },
  quickActionSquareBtn: {
    alignItems: 'center',
    marginRight: 18,
    width: 72,
    overflow: 'visible',
  },
quickActionSquareIcon: {
  width: 80,
  height: 80,
  borderRadius: 24,
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 8,
  position: 'relative',
  // Remove overflow property altogether
},

  quickActionSquareLabel: {
    fontSize: 15,
    fontFamily: 'Coinbase_Sans-Medium',
    color: '#222',
    textAlign: 'center',
    marginTop: 2,
  },
  
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    gap: 16,
  },
  statCard: {
    flexGrow: 0,
    backgroundColor: Colors.neutral0,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    minHeight: 140,
    justifyContent: "center",
    width: '47%'
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  statValue: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.neutral1000 || "#111827",
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.neutral500 || "#6B7280",
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "500",
  },
  statChangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.success + "10",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statChange: {
    fontSize: 13,
    color: Colors.success,
    fontWeight: "700",
  },
  activityContainer: {
    paddingHorizontal: 18,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.neutral0,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  activityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.neutral1000 || "#111827",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  activityDate: {
    fontSize: 15,
    color: Colors.neutral500 || "#6B7280",
    fontWeight: "500",
  },
  activityStatus: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  bottomSpacing: {
    height: 40,
  },
  
  // Maintenance Alerts Styles
  maintenanceAlertsContainer: {
    paddingHorizontal: 18,
  },
  maintenanceAlertCard: {
    backgroundColor: Colors.neutral0,
    borderRadius: 18,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FD7E7E',
    // shadowColor: Colors.shadowMd,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.06,
    // shadowRadius: 6,
    // elevation: 2,
  },
  maintenanceAlertIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  maintenanceAlertContent: {
    flex: 1,
  },
  maintenanceAlertTitle: {
    fontSize: 20,
    fontFamily: 'Coinbase_Sans-Medium',
    color: Colors.neutral1000,
    marginBottom: 4,
  },
  maintenanceAlertMileage: {
    fontSize: 14,
    color: Colors.neutral600,
    marginBottom: 8,
    fontFamily: 'Coinbase_Mono-Regular',
  },
  maintenanceAlertPriority: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  maintenanceAlertPriorityText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  maintenanceAlertButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  
  fleetOverviewContainer: {
    paddingHorizontal: 18,
    marginTop: 18,
    marginBottom: 10,
  },
  fleetOverviewCardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  fleetCardCompact: {
    flex: 1,
    backgroundColor: Colors.neutral0,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.neutral200 || "#f2f4f5",
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  fleetCardLabelSmall: {
    fontSize: 14,
    color: Colors.neutral500 || '#9CA3AF',
    fontFamily: 'Coinbase_Sans-Medium',
    // fontWeight: '500',
    marginBottom: 4,
  },
  fleetCardValueSmall: {
    fontSize: 30,
    // fontWeight: '700',
      fontFamily: 'Coinbase_Sans-Medium',
    color: Colors.neutral1000 || '#111827',
  },
  cardsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  cardsHeaderTitle: {
    fontSize: 20,
    fontFamily: 'Coinbase_Sans-Medium',
    color: Colors.neutral1000 || '#111827',
  },
  cardsHeaderAction: {
    fontSize: 16,
    // fontWeight: '500',
    color: '#0958DC',
  },
  // Fixed vehicle card container and styling
  vehicleCardContainer: {
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  vehicleCardNeoLarge: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    position: 'relative',
  },
  vehicleCardContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    minHeight: 140,
  },
  vehicleCardTextSection: {
    flex: 1,
    paddingRight: 16,
    // Remove top padding so text is vertically centered
  },
  vehicleImageSection: {
    position: 'absolute',
    top: 10,
    right: -15,
    zIndex: 2,
    pointerEvents: 'none',
  },
  vehicleNameNeo: {
    fontSize: 20,
    color: '#222',
    marginBottom: 4,
    fontFamily: 'Coinbase_Sans-Medium',
  },
  vehicleYearNeo: {
    fontSize: 16,
    color: Colors.neutral600,
    marginBottom: 2,
    fontWeight: '500',
  },
  vehicleLicenseNeo: {
    fontSize: 14,
    color: Colors.neutral500,
    marginBottom: 12,
    fontFamily: 'Coinbase_Mono-Regular',
  },
  vehicleDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '10',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.primary + '20',
  },
  vehicleDetailsBtnText: {
    fontSize: 14,
    color: 'Colors.primary',
    fontFamily: 'Coinbase_Sans-Medium',
  },
  vehicleImageNeoLarge: {
    width: 196,
    height: 126,
    resizeMode: 'contain',
  },
  quickActionNotificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    paddingHorizontal: 4,
  },
  quickActionNotificationBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
})

export default DashboardScreen