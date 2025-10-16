// src/screens/Technician/WorkOrderList.tsx
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import { fetchUserProfileId, fetchTechnicianId, fetchTechnicianWorkOrders } from "../../api/technicianApi";
import { getToken } from "../../utils/authStorage";
import Colors from "../../constants/colors";

// Define WorkOrder type based on expected backend response
interface Labor {
  id: string;
  status: string;
  // ...other labor fields
}

interface WorkOrder {
  id: string;
  system?: string;
  carModel?: string;
  carPlate?: string;
  labors?: Labor[];
  // ...other work order fields
}

// Accept supabaseUserId as a prop (pass from parent or context)
import { useRoute } from '@react-navigation/native';

export default function WorkOrderListScreen({ navigation }: { navigation: any }) {
  const route = useRoute();
  const supabaseUserId = (route.params as any)?.supabaseUserId;
  const [tab, setTab] = useState<string>("All");
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchWorkOrders() {
      setLoading(true);
      try {
        console.log("supabaseUserId:", supabaseUserId);
        if (!supabaseUserId) throw new Error("No supabaseUserId provided");
        const token = await getToken();
        console.log("token:", token);
        const userProfileId = await fetchUserProfileId(supabaseUserId, token);
        console.log("userProfileId:", userProfileId);
        if (!userProfileId) throw new Error("No user profile found");
        const technicianId = await fetchTechnicianId(userProfileId, token);
        console.log("technicianId:", technicianId);
        if (!technicianId) throw new Error("No technician found");
        const workOrders = await fetchTechnicianWorkOrders(technicianId, token);
        console.log("workOrders:", workOrders);
        setWorkOrders(workOrders);
      } catch (err) {
        console.error("fetchWorkOrders error:", err);
      } finally {
        setLoading(false);
      }
    }
    if (supabaseUserId) fetchWorkOrders();
  }, [supabaseUserId]);

  const getWorkOrderProgress = (tasks: Labor[] = []) => {
    if (!tasks || !Array.isArray(tasks)) return "0/0 Tasks";
    const completed = tasks.filter((t) => t.status === "COMPLETED").length;
    return `${completed}/${tasks.length} Tasks`;
  };

  const filteredWorkOrders =
    tab === "All"
      ? workOrders
      : tab === "Completed"
      ? workOrders.filter((wo) => wo.labors && wo.labors.every((labor: Labor) => labor.status === "COMPLETED"))
      : workOrders.filter((wo) => wo.labors && wo.labors.some((labor: Labor) => labor.status !== "COMPLETED"));

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
        {loading ? (
          <Text style={{ textAlign: "center", marginTop: 40 }}>Loading...</Text>
        ) : filteredWorkOrders.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 40 }}>No work orders found.</Text>
        ) : (
          filteredWorkOrders.map((wo) => (
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
                <Text style={styles.woProgress}>{getWorkOrderProgress(wo.labors)}</Text>
              </View>
              <FeatherIcon name="chevron-right" size={22} color="#888" />
            </TouchableOpacity>
          ))
        )}
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
