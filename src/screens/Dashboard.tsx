import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, FlatList } from "react-native"
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from "../constants/colors"
import Header from '../components/Header'
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
  userName = "John Doe",
  onMenuPress,
  onNotificationPress,
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState(0)

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

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

  const quickActions = [
    { 
      id: 1, 
      title: "Rewards", 
      icon: "gift-outline", 
      color: Colors.primary, 
      screen: "Rewards",
      bgColor: Colors.neutral0
    },
    { 
      id: 2, 
      title: "Find Location", 
      icon: "location-outline", 
      color: Colors.primary, 
      screen: "Locations",
      bgColor: Colors.neutral0
    },
    { 
      id: 3, 
      title: "Forum", 
      icon: "chatbubbles-outline", 
      color: Colors.primary,
      screen: "Forum",
      bgColor: Colors.neutral0
    },
    { 
      id: 4, 
      title: "MarketPlace", 
      icon: "storefront-outline", 
      color: Colors.primary,
      screen: "MarketPlace",
      bgColor: Colors.neutral0
    },
    { 
      id: 5, 
      title: "Cars", 
      icon: "car-outline", 
      color: Colors.primary,
      screen: "Cars",
      bgColor: Colors.neutral0
    },
    { 
      id: 6, 
      title: "Reservations", 
      icon: "calendar-outline", 
      color: Colors.primary,
      screen: "Reservations",
      bgColor: Colors.neutral0
    },
  ]

  const recentActivity = [
    { id: 1, title: "Oil Change Completed", date: "2 days ago", status: "completed", icon: "checkmark-circle" },
    { id: 2, title: "Tire Rotation Scheduled", date: "Tomorrow", status: "upcoming", icon: "time" },
    { id: 3, title: "Annual Service Due", date: "Next week", status: "pending", icon: "alert-circle" },
  ]

  const stats = [
    { label: "Total Services", value: "12", change: "+2", icon: "build", color: Colors.primary },
    { label: "Miles Driven", value: "15.2K", change: "+1.2K", icon: "speedometer", color: Colors.primary },
    { label: "Fuel Efficiency", value: "28.5 MPG", change: "+0.8", icon: "leaf", color: Colors.success },
    { label: "Fuel Efficiency", value: "28.5 MPG", change: "+0.8", icon: "leaf", color: Colors.success },
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

  return (
    <SafeAreaView style={styles.container}>
        <Header
          icon=""
          name="John Doe"
          image=""
          onIconPress={() => navigation.navigate('Home')}
        />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Vehicles Section */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, {marginTop: 40}]}>
            <Text style={styles.sectionTitle}>My Vehicles</Text>
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

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderSimple}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity 
                key={action.id} 
                style={[styles.quickActionCard, { backgroundColor: action.bgColor }]}
                onPress={() => navigation.navigate(action.screen)}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color + "15" }]}>
                  <Icon name={action.icon} size={26} color={action.color} />
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Overview Stats */}
        <View style={[styles.section,{marginTop: 10}]}>
          <View style={styles.sectionHeaderSimple}>
            <Text style={styles.sectionTitle}>Overview</Text>
          </View>
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + "15" }]}>
                  <Icon name={stat.icon} size={22} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <View style={styles.statChangeContainer}>
                  <Icon name="trending-up" size={14} color={Colors.success} />
                  <Text style={styles.statChange}>{stat.change}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderSimple}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>
          <View style={styles.activityContainer}>
            {recentActivity.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={[
                  styles.activityIconContainer,
                  {
                    backgroundColor: activity.status === "completed"
                      ? Colors.success + "15"
                      : activity.status === "upcoming"
                        ? Colors.primary + "15"
                        : Colors.warning + "15"
                  }
                ]}>
                  <Icon 
                    name={activity.icon} 
                    size={22} 
                    color={
                      activity.status === "completed"
                        ? Colors.success
                        : activity.status === "upcoming"
                          ? Colors.primary
                          : Colors.warning
                    }
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDate}>{activity.date}</Text>
                </View>
                <View
                  style={[
                    styles.activityStatus,
                    {
                      backgroundColor:
                        activity.status === "completed"
                          ? Colors.success
                          : activity.status === "upcoming"
                            ? Colors.primary
                            : Colors.warning,
                    },
                  ]}
                />
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
  section: {
    marginBottom: 36,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionHeaderSimple: {
    paddingHorizontal: 24,
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
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 24,
    gap: 20,
  },
  quickActionCard: {
    width: "46%",
    backgroundColor: Colors.neutral0,
    borderRadius: 20,
    padding: 24,
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
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  quickActionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.neutral700 || "#374151",
    textAlign: "center",
    letterSpacing: -0.2,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 24,
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
    paddingHorizontal: 24,
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
})

export default DashboardScreen