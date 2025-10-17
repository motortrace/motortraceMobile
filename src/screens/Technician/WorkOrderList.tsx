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
import { getAuthMe, getTechnicianWorkOrders } from "../../api/technician";
import Colors from "../../constants/colors";
// Types for work orders and labors
interface Labor {
  id: string;
  status?: string;
  state?: string;
  // ...other fields
}

interface WorkOrder {
  id: string;
  workOrderNumber?: string;
  jobType?: string;
  vehicle?: {
    make?: string;
    model?: string;
    licensePlate?: string;
  };
  labors?: Labor[];
  laborItems?: Labor[]; // server may return laborItems instead of labors
  isCompleted?: boolean;
  // ...other fields
}


export default function WorkOrderListScreen({ navigation }: { navigation: any }) {
  const [tab, setTab] = useState<string>("All");
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchWorkOrders() {
      setLoading(true);
      try {
        const meData = await getAuthMe();
        console.log('Response from /auth/me:', meData);
        const userProfileId = meData?.userProfileId || meData?.user?.userProfileId;
        console.log('Extracted userProfileId:', userProfileId);
        const technicianId = meData?.data?.roleDetails?.technicianId;
        console.log('Extracted technicianId:', technicianId);
        if (!technicianId) throw new Error("No technician id found for user");
        const workOrdersRes = await getTechnicianWorkOrders(technicianId);
        const raw = workOrdersRes?.data || workOrdersRes?.workOrders || [];
        // API sometimes returns a single object in `data` instead of an array. Normalize to array.
        const rawArray = Array.isArray(raw) ? raw : raw ? [raw] : [];
        // Normalize each work order to have a boolean isCompleted flag and ensure labors array exists
        const normalized = rawArray.map((wo: any) => {
          const laborsArray = Array.isArray(wo.labors)
            ? wo.labors
            : Array.isArray(wo.laborItems)
            ? wo.laborItems
            : [];

          const laborCompletionFlag = laborsArray.length > 0 && laborsArray.every((l: any) => {
            const s = (l?.status || l?.state || '').toString().toLowerCase();
            return s === 'completed' || s === 'complete' || s === 'done';
          });

          // Also consider work order-level fields: status or closedAt as indicators of completion
          const workOrderStatusFlag = typeof wo.status === 'string' && wo.status.toLowerCase() === 'completed';
          const closedAtFlag = !!wo.closedAt;

          const completed = !!(laborCompletionFlag || workOrderStatusFlag || closedAtFlag);

          return {
            ...wo,
            labors: laborsArray,
            laborItems: wo.laborItems || wo.labors || [],
            isCompleted: !!completed,
          } as WorkOrder;
        });
        setWorkOrders(normalized);
      } catch (err) {
        console.error("fetchWorkOrders error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchWorkOrders();
  }, []);

  const getWorkOrderProgress = (labors: Labor[] = []) => {
    // Defensive: ensure labors is an array
    if (!labors || !Array.isArray(labors)) return '0/0 Tasks';

    const total = labors.filter(Boolean).length; // ignore null/undefined entries

    const completed = labors.reduce((acc, l) => {
      if (!l) return acc;
      const s = (l.status || l.state || '').toString().toLowerCase();
      if (s === 'completed' || s === 'complete' || s === 'done') return acc + 1;
      return acc;
    }, 0);

    return `${completed}/${total} Tasks`;
  };

  const filteredWorkOrders =
    tab === "All"
      ? workOrders
      : tab === "Completed"
      ? workOrders.filter((wo) => !!wo.isCompleted)
      : workOrders.filter((wo) => !wo.isCompleted);

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
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <FeatherIcon name="briefcase" size={24} color="#6b6b6b" />
            </View>
            <Text style={styles.emptyTitle}>
              {tab === 'All'
                ? 'No work orders found.'
                : tab === 'Pending'
                ? 'No Pending Work Orders.'
                : 'No Completed Work Orders.'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {tab === 'All'
                ? 'There are no work orders assigned to you.'
                : tab === 'Pending'
                ? "You're all caught up — no pending work orders."
                : 'There are no completed work orders yet.'}
            </Text>
          </View>
        ) : (
          filteredWorkOrders.map((wo) => (
            <TouchableOpacity
              key={wo.id}
              style={styles.card}
              onPress={() => navigation.navigate("WorkOrderDetails", { workOrderId: wo.id, workOrder: wo })}
            >
              <View style={{ flex: 1 }}>
                {/* Display Work Order Number */}
                <Text style={styles.woId}>{wo.workOrderNumber ?? "No Number"}</Text>
                {/* Display Job Type */}
                <Text style={styles.woSystem}>{wo.jobType ?? "No Job Type"}</Text>
                {/* Display Vehicle Details */}
                <Text style={styles.woVehicle}>
                  {wo.vehicle?.make ?? ""} {wo.vehicle?.model ?? ""} ({wo.vehicle?.licensePlate ?? "No Plate"})
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
    color: '#666'
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 16,
    color: '#444',
    fontWeight: '600'
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    maxWidth: '80%'
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e6e6e6',
    alignItems: 'center',
    justifyContent: 'center'
  },
});