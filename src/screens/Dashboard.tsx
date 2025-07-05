import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from "react-native"
import Colors from "../constants/colors"
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';
import Header from '../components/Header'

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
  const [selectedTab, setSelectedTab] = useState("overview")

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const quickActions = [
    { id: 1, title: "Book Service", icon: "🔧", color: "#3B82F6", screen: "Locations" },
    { id: 2, title: "Find Location", icon: "📍", color: "#10B981", screen: "Locations"},
    { id: 3, title: "Support", icon: "💬", color: "#F59E0B",screen: "Locations" },
    { id: 4, title: "Forum", icon: "💬", color: "#F59E0B",screen: "Forum" },
    { id: 4, title: "MarketPlace", icon: "💬", color: "#3B82F6",screen: "MarketPlace" },
  ]

  const recentActivity = [
    { id: 1, title: "Oil Change Completed", date: "2 days ago", status: "completed" },
    { id: 2, title: "Tire Rotation Scheduled", date: "Tomorrow", status: "upcoming" },
    { id: 3, title: "Annual Service Due", date: "Next week", status: "pending" },
  ]

  const stats = [
    { label: "Total Services", value: "12", change: "+2" },
    { label: "Miles Driven", value: "15.2K", change: "+1.2K" },
    { label: "Fuel Efficiency", value: "28.5 MPG", change: "+0.8" },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <Header
        icon="back"
        name="John Doe"
        image=""
        onIconPress={() => navigation.navigate('Home')}
      />

        {/* Vehicle Card */}
        <View style={styles.vehicleCard}>
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleTitle}>My Vehicle</Text>
            <Text style={styles.vehicleName}>Toyota Camry 2022</Text>
            <Text style={styles.vehicleDetails}>License: ABC-1234</Text>
          </View>
          <View style={styles.vehicleImage}>
            <Text style={styles.carIcon}>🚗</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity 
                key={action.id} 
                style={styles.quickActionCard}
                onPress={() => navigation.navigate(action.screen)}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color + "20" }]}>
                  <Text style={styles.quickActionEmoji}>{action.icon}</Text>
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statChange}>{stat.change}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityContainer}>
            {recentActivity.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View
                  style={[
                    styles.activityStatus,
                    {
                      backgroundColor:
                        activity.status === "completed"
                          ? "#10B981"
                          : activity.status === "upcoming"
                            ? "#3B82F6"
                            : "#F59E0B",
                    },
                  ]}
                />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDate}>{activity.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navItem, selectedTab === "overview" && styles.navItemActive]}
          onPress={() => setSelectedTab("overview")}
        >
          <Text style={[styles.navIcon, selectedTab === "overview" && styles.navIconActive]}>🏠</Text>
          <Text style={[styles.navLabel, selectedTab === "overview" && styles.navLabelActive]}>Overview</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, selectedTab === "services" && styles.navItemActive]}
          onPress={() => setSelectedTab("services")}
        >
          <Text style={[styles.navIcon, selectedTab === "services" && styles.navIconActive]}>🔧</Text>
          <Text style={[styles.navLabel, selectedTab === "services" && styles.navLabelActive]}>Services</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, selectedTab === "history" && styles.navItemActive]}
          onPress={() => setSelectedTab("history")}
        >
          <Text style={[styles.navIcon, selectedTab === "history" && styles.navIconActive]}>📋</Text>
          <Text style={[styles.navLabel, selectedTab === "history" && styles.navLabelActive]}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, selectedTab === "profile" && styles.navItemActive]}
          onPress={() => setSelectedTab("profile")}
        >
          <Text style={[styles.navIcon, selectedTab === "profile" && styles.navIconActive]}>👤</Text>
          <Text style={[styles.navLabel, selectedTab === "profile" && styles.navLabelActive]}>Profile</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral100 || "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuIcon: {
    fontSize: 18,
    color: Colors.neutral700 || "#374151",
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: Colors.neutral500 || "#6B7280",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.neutral1000 || "#111827",
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral100 || "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationIcon: {
    fontSize: 18,
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
  },
  vehicleCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleTitle: {
    fontSize: 14,
    color: Colors.neutral500 || "#6B7280",
    marginBottom: 4,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.neutral1000 || "#111827",
    marginBottom: 2,
  },
  vehicleDetails: {
    fontSize: 14,
    color: Colors.neutral500 || "#6B7280",
  },
  vehicleImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary + "20" || "#3B82F620",
    justifyContent: "center",
    alignItems: "center",
  },
  carIcon: {
    fontSize: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.neutral1000 || "#111827",
    marginHorizontal: 20,
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
  },
  quickActionCard: {
    width: "47%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionEmoji: {
    fontSize: 24,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.neutral700 || "#374151",
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.neutral1000 || "#111827",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.neutral500 || "#6B7280",
    textAlign: "center",
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    color: "#10B981",
    fontWeight: "600",
  },
  activityContainer: {
    paddingHorizontal: 20,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.neutral1000 || "#111827",
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 14,
    color: Colors.neutral500 || "#6B7280",
  },
  bottomSpacing: {
    height: 20,
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral300 || "#E5E7EB",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  navItemActive: {
    backgroundColor: Colors.primary + "10" || "#3B82F610",
    borderRadius: 8,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  navIconActive: {
    color: Colors.primary || "#3B82F6",
  },
  navLabel: {
    fontSize: 12,
    color: Colors.neutral500 || "#6B7280",
  },
  navLabelActive: {
    color: Colors.primary || "#3B82F6",
    fontWeight: "600",
  },
})

export default DashboardScreen
