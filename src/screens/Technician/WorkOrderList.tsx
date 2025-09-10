// src/screens/Technician/WorkOrderList.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import Colors from "../../constants/colors";

export default function WorkOrderListScreen({ navigation }) {
  const [tab, setTab] = useState("All");

const workOrders = [
  {
    id: "WO-20241201-001",
    system: "Brake System Inspection",
    carModel: "Toyota Corolla 2023",
    carPlate: "ABC-1234",
    date: "2025-09-05",
    technician: "John Doe",
    tasks: [
      { taskId: "task-001", description: "Remove front wheels", status: "COMPLETED", estimatedTime: 0.5, actualTime: 0.5 },
      { taskId: "task-002", description: "Remove old brake pads", status: "PENDING", estimatedTime: 0.5, actualTime: 0 },
    ],
    parts: [
      {
        inventoryItemId: "PART001",
        name: "Ceramic Brake Pads",
        quantity: 2,
        unitPrice: 45.0,
        notes: "",
        installed: false, // <-- UNINSTALLED
      },
      {
        inventoryItemId: "PART002",
        name: "Brake Rotors",
        quantity: 2,
        unitPrice: 80.0,
        notes: "Replace due to warping",
        installed: true,
        installedAt: "2024-12-01T18:00:00Z", // <-- INSTALLED
      },
      {
        inventoryItemId: "PART003",
        name: "Brake Caliper Lubricant",
        quantity: 1,
        unitPrice: 15.0,
        notes: "",
        installed: false, // <-- UNINSTALLED
      },
    ],
  },
  {
    id: "WO-20241201-002",
    system: "Brake Fluid Replacement",
    carModel: "Honda Civic 2022",
    carPlate: "XYZ-5678",
    date: "2025-09-06",
    technician: "John Doe",
    tasks: [
      { taskId: "task-003", description: "Drain brake fluid", status: "PENDING", estimatedTime: 0.3, actualTime: 0 },
    ],
    parts: [
      {
        inventoryItemId: "PART004",
        name: "Brake Fluid DOT4",
        quantity: 1,
        unitPrice: 25.0,
        notes: "High-quality brake fluid",
        installed: false, // UNINSTALLED
      },
    ],
  },
];

  const getWorkOrderProgress = (tasks) => {
    const completed = tasks.filter((t) => t.status === "COMPLETED").length;
    return `${completed}/${tasks.length} Tasks`;
  };

  const filteredWorkOrders =
    tab === "All"
      ? workOrders
      : tab === "Completed"
      ? workOrders.filter((wo) => wo.tasks.every((t) => t.status === "COMPLETED"))
      : workOrders.filter((wo) => wo.tasks.some((t) => t.status !== "COMPLETED"));

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={Colors.techPrimary} barStyle="light-content" />

      {/* Top Header */}
      <View style={styles.topContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Work Orders</Text>
          <FeatherIcon name="briefcase" size={22} color="#fff" />
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          {["All", "Pending", "Completed"].map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tabBtn, tab === t && { backgroundColor: "#fff" }]}
              onPress={() => setTab(t)}
            >
              <Text
                style={[
                  styles.tabText,
                  tab === t && { color: Colors.techPrimary, fontWeight: "600" },
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Work Order List */}
      <ScrollView style={{ flex: 1, marginTop: 12, paddingBottom: 80 }}>
        {filteredWorkOrders.map((wo) => (
          <TouchableOpacity
            key={wo.id}
            style={styles.card}
            onPress={() => navigation.navigate("WorkOrderDetails", { workOrder: wo })}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.woId}>{wo.id}</Text>
              <Text style={styles.woSystem}>{wo.system}</Text>
              <Text style={styles.woVehicle}>
                {wo.carModel} ({wo.carPlate})
              </Text>
              <Text style={styles.woProgress}>{getWorkOrderProgress(wo.tasks)}</Text>
            </View>
            <FeatherIcon name="chevron-right" size={22} color="#888" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
          <FeatherIcon name="home" size={22} color="#444" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("WorkOrderList")}>
          <FeatherIcon name="briefcase" size={22} color={Colors.techPrimary} />
          <Text style={styles.navLabelActive}>Work Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("InspectionList")}>
          <FeatherIcon name="clipboard" size={22} color="#444" />
          <Text style={styles.navLabel}>Inspections</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <FeatherIcon name="user" size={22} color="#444" />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  topContainer: {
    backgroundColor: Colors.techPrimary,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    padding: 20,
    elevation: 5,
    marginBottom: 10,
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  tabsRow: { flexDirection: "row", marginTop: 20, justifyContent: "space-around" },
  tabBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  tabText: { color: "#fff", fontSize: 13 },

  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 18,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 2,
    alignItems: "center",
  },
  woId: { fontSize: 14, fontWeight: "700", color: "#000" },
  woSystem: { fontSize: 12, color: "#555", marginTop: 2 },
  woVehicle: { fontSize: 12, color: "#555", marginTop: 2 },
  woProgress: { fontSize: 12, color: Colors.techPrimary, marginTop: 4, fontWeight: "600" },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    paddingVertical: 10,
    elevation: 8,
  },
  navItem: { alignItems: "center", flex: 1 },
  navLabel: { fontSize: 11, color: "#444", marginTop: 4 },
  navLabelActive: {
    fontSize: 11,
    color: Colors.techPrimary,
    marginTop: 4,
    fontWeight: "700",
  },
});
