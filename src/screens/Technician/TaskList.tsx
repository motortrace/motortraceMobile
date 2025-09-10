// src/screens/Technician/TaskList.tsx
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

export default function TaskListScreen({ navigation }) {
  const [tab, setTab] = useState("Ongoing");

  const tasks = [
    {
      id: "task-001",
      workOrderId: "WO-20241201-001",
      description: "Remove front wheels",
      status: "ONGOING",
      progress: "0.5/2 h",
    },
    {
      id: "task-002",
      workOrderId: "WO-20241201-001",
      description: "Remove old brake pads",
      status: "PENDING",
      progress: "0/1 h",
    },
    {
      id: "task-003",
      workOrderId: "WO-20241201-002",
      description: "Install new brake pads",
      status: "COMPLETED",
      progress: "1/1 h",
    },
  ];

  const filteredTasks =
    tab === "All"
      ? tasks
      : tasks.filter((task) => task.status.toUpperCase() === tab.toUpperCase());

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={Colors.techPrimary} barStyle="light-content" />

      {/* Header */}
      <View style={styles.topContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Work Order Tasks</Text>
          <FeatherIcon name="calendar" size={22} color="#fff" />
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          {["All", "Ongoing", "Completed", "Pending"].map((t) => (
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

      {/* Task List */}
{/* Task List */}
<ScrollView style={{ flex: 1, marginTop: 12, paddingBottom: 80 }}>
  {filteredTasks.map((task) => (
    <TouchableOpacity
      key={task.id}
      style={styles.taskCard}
      onPress={() => navigation.navigate("TaskDetails", { task })}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.taskDesc}>{task.description}</Text>
        <Text style={styles.taskMeta}>WO: {task.workOrderId}</Text>
      </View>
      <View style={styles.rightCol}>
        <View style={styles.statusCapsule}>
          <Text style={styles.statusText}>{task.status}</Text>
        </View>
        <Text style={styles.progressText}>{task.progress}</Text>
      </View>
    </TouchableOpacity>
  ))}
</ScrollView>


      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Home")}
        >
          <FeatherIcon name="home" size={22} color={Colors.techPrimary} />
          <Text style={styles.navLabelActive}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <FeatherIcon name="check-square" size={22} color="#444" />
          <Text style={styles.navLabel}>Tasks</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
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
    padding: 18,
    elevation: 5,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },

  tabsRow: {
    flexDirection: "row",
    marginTop: 15,
    justifyContent: "space-between",
  },
  tabBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  tabText: { color: "#fff", fontSize: 13 },

  taskCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 14,
    marginHorizontal: 18,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    justifyContent: "space-between",
  },
  taskDesc: { fontSize: 14, fontWeight: "600", color: "#000" },
  taskMeta: { fontSize: 12, color: "#555", marginTop: 4 },

  rightCol: { alignItems: "flex-end", justifyContent: "center" },
  statusCapsule: {
    backgroundColor: "rgba(27,59,127,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: { color: Colors.techPrimary, fontSize: 12 },
  progressText: { fontSize: 12, color: "#000" },

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
