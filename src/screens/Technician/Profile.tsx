// src/screens/Technician/ProfileScreen.tsx
import React from "react";
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import Colors from "../../constants/colors";

export default function ProfileScreen({ navigation }) {
  const technician = {
    name: "Naveen Perera",
    id: "TECH-452",
    email: "naveen.perera@example.com",
    phone: "+94 77 654 3210",
    avatar: "https://i.pravatar.cc/150?img=12",
    joined: "2021-08-10",
    role: "Field Technician",
    stats: {
      totalWorkOrders: 125,
      completedTasks: 380,
      inspections: 92,
    },
  };

  const handleEditProfile = () => navigation.navigate("EditProfile");
  const handleLogout = () => console.log("Logging out...");

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={Colors.techPrimary} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FeatherIcon name="arrow-left" size={20} color="#fff" />
          <Text style={styles.headerBackText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Card */}
        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: technician.avatar }} style={styles.avatar} />
          </View>
          <Text style={styles.name}>{technician.name}</Text>
          <Text style={styles.role}>{technician.role}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{technician.stats.totalWorkOrders}</Text>
              <Text style={styles.statLabel}>Work Orders</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{technician.stats.completedTasks}</Text>
              <Text style={styles.statLabel}>Tasks Completed</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{technician.stats.inspections}</Text>
              <Text style={styles.statLabel}>Inspections</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <FeatherIcon name="hash" size={16} color="#555" />
            <Text style={styles.infoText}>{technician.id}</Text>
          </View>
          <View style={styles.infoRow}>
            <FeatherIcon name="mail" size={16} color="#555" />
            <Text style={styles.infoText}>{technician.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <FeatherIcon name="phone" size={16} color="#555" />
            <Text style={styles.infoText}>{technician.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <FeatherIcon name="calendar" size={16} color="#555" />
            <Text style={styles.infoText}>Joined: {new Date(technician.joined).toLocaleDateString()}</Text>
          </View>

          <TouchableOpacity style={styles.editBtn} onPress={handleEditProfile}>
            <FeatherIcon name="edit-2" size={16} color="#fff" />
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <TouchableOpacity style={styles.optionRow}>
            <FeatherIcon name="lock" size={18} color={Colors.techPrimary} />
            <Text style={styles.optionText}>Change Password</Text>
            <FeatherIcon name="chevron-right" size={18} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow}>
            <FeatherIcon name="bell" size={18} color={Colors.techPrimary} />
            <Text style={styles.optionText}>Notifications</Text>
            <FeatherIcon name="chevron-right" size={18} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow}>
            <FeatherIcon name="info" size={18} color={Colors.techPrimary} />
            <Text style={styles.optionText}>About App</Text>
            <FeatherIcon name="chevron-right" size={18} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.optionRow, { justifyContent: "center", backgroundColor: Colors.techPrimary, borderRadius: 8 }]} onPress={handleLogout}>
            <FeatherIcon name="log-out" size={18} color="#fff" />
            <Text style={[styles.optionText, { color: "#fff", marginLeft: 8 }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f6f6f6" },
  header: {
    height: 60,
    backgroundColor: Colors.techPrimary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  backButton: { flexDirection: "row", alignItems: "center" },
  headerBackText: { color: "#fff", marginLeft: 4 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  content: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  avatarContainer: { alignItems: "center", marginBottom: 12 },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: Colors.techPrimary },
  name: { fontSize: 18, fontWeight: "700", textAlign: "center", marginBottom: 4 },
  role: { fontSize: 14, color: "#555", textAlign: "center", marginBottom: 12 },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 12 },
  statCard: { alignItems: "center", flex: 1 },
  statNumber: { fontSize: 16, fontWeight: "700", color: Colors.techPrimary },
  statLabel: { fontSize: 12, color: "#555" },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  infoText: { marginLeft: 6, fontSize: 14, color: "#555" },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.techPrimary,
    borderRadius: 8,
    justifyContent: "center",
    paddingVertical: 10,
    marginTop: 12,
  },
  editBtnText: { color: "#fff", fontWeight: "600", marginLeft: 6 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    justifyContent: "space-between",
  },
  optionText: { fontSize: 14, marginLeft: 8, color: "#333" },
});
