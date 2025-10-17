// TechnicianHomeScreen.tsx
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
import {
  fetchTechnicianDetails,
  fetchTechnicianId,
  fetchTechnicianInspections,
  fetchTechnicianWorkOrders,
  fetchUserProfileId,
} from "../../api/technicianApi";
import Colors from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";
import { getToken } from "../../utils/authStorage";


export default function TechnicianHomeScreen({ navigation, userName = "John" }) {
  const { supabaseUserId } = useAuth();
  const [counts, setCounts] = useState({
    workOrders: { total: 8, completed: 4 },
    inspections: { total: 3, completed: 2 },
    hoursSpent: 12.5,
    issues: { total: 3, resolved: 1 },
    qc: { total: 5, completed: 3 },
  });

  // Load live counts from backend when we have a supabaseUserId
  useEffect(() => {
    let mounted = true;
    const loadCounts = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const supabaseId = supabaseUserId;
        if (!supabaseId) return;

        const userProfileId = await fetchUserProfileId(supabaseId, token);
        if (!userProfileId) return;

        const techId = await fetchTechnicianId(userProfileId, token);
        if (!techId) return;

        // Prefer the detailed technician endpoint which may include aggregated stats
        const details = await fetchTechnicianDetails(techId, token);
        if (mounted && details?.stats) {
          const s = details.stats;
          setCounts((c) => ({
            ...c,
            workOrders: { total: s.totalWorkOrders ?? c.workOrders.total, completed: s.completedWorkOrders ?? c.workOrders.completed },
            inspections: { total: s.totalInspections ?? c.inspections.total, completed: s.completedInspections ?? c.inspections.completed },
            hoursSpent: s.hoursSpent ?? c.hoursSpent,
            issues: { total: s.issuesTotal ?? c.issues.total, resolved: s.issuesResolved ?? c.issues.resolved },
            qc: { total: s.totalWorkOrders ?? c.qc.total, completed: s.qcCompleted ?? c.qc.completed },
          }));
          return;
        }

        // Fallback: request lists and compute simple counts
        const allWOs = await fetchTechnicianWorkOrders(techId, token);
        const completedWOs = await fetchTechnicianWorkOrders(techId, token, 'COMPLETED');
        const ins = await fetchTechnicianInspections(techId, token);

        if (!mounted) return;

        const totalWorkOrders = Array.isArray(allWOs) ? allWOs.length : 0;
        const completedWorkOrders = Array.isArray(completedWOs) ? completedWOs.length : 0;

        const totalIns = Array.isArray(ins) ? ins.length : 0;
        const completedIns = (ins || []).filter((i: any) => i.isCompleted === true || i.status === 'COMPLETED' || i.completedAt).length;

        const hours = Array.isArray(allWOs) ? allWOs.reduce((s: number, w: any) => s + (Number(w.actualTime) || 0), 0) : 0;

        if (mounted) {
          setCounts((c) => ({
            ...c,
            workOrders: { total: totalWorkOrders, completed: completedWorkOrders },
            inspections: { total: totalIns, completed: completedIns },
            hoursSpent: hours,
            // leave issues and qc as-is or basic defaults
            qc: { total: totalWorkOrders, completed: c.qc.completed },
          }));
        }
      } catch (err) {
        console.warn('loadCounts error', err);
      }
    };

    loadCounts();
    return () => { mounted = false; };
  }, [supabaseUserId]);

  const [reportedIssues, setReportedIssues] = useState([
    { id: "ISSUE-001", title: "Brake fluid leakage", status: "OPEN", workOrderId: "WO-001" },
    { id: "ISSUE-002", title: "Loose wheel nuts", status: "RESOLVED", workOrderId: "WO-002" },
    { id: "ISSUE-003", title: "AC not cooling", status: "IN_PROGRESS", workOrderId: "WO-004" },
  ]);

  const [workOrders, setWorkOrders] = useState([
    { workOrderId: "WO-001", description: "Remove front wheels", status: "PENDING", actualTime: 0.5, estimatedTime: 2 },
    { workOrderId: "WO-002", description: "Remove old brake pads", status: "IN_PROGRESS", actualTime: 1, estimatedTime: 3 },
    { workOrderId: "WO-003", description: "Install new brake pads", status: "COMPLETED", actualTime: 1.5, estimatedTime: 1.5 },
  ]);

  const [inspections, setInspections] = useState([
    { inspectionId: "INSP-1001", status: "PASSED", date: "2025-09-07" },
    { inspectionId: "INSP-1002", status: "FAILED", date: "2025-09-06" },
    { inspectionId: "INSP-1003", status: "PENDING", date: "2025-09-05" },
  ]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={Colors.techPrimary} barStyle="light-content" />

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}>
        {/* Header */}
        <View style={styles.topContainer}>
          <View style={styles.topBar}>
            <View>
              <Text style={styles.welcomeText}>Hi, {userName}!</Text>
              <Text style={styles.dateText}>Today: {new Date().toLocaleDateString()}</Text>
            </View>
            <FeatherIcon name="user" size={35} color="#fff" />
          </View>
          <Text style={styles.headerSubtitle}>Dashboard</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation?.navigate?.("WorkOrderList", { supabaseUserId })}
          >
            <FeatherIcon name="briefcase" size={20} color={Colors.techPrimary} style={{ marginRight: 10 }} />
            <View>
              <Text style={styles.statLabel}>Work Orders</Text>
              <Text style={styles.statText}>
                {counts.workOrders.completed} / {counts.workOrders.total}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation?.navigate?.("InspectionList")}
          >
            <FeatherIcon name="clipboard" size={20} color={Colors.techPrimary} style={{ marginRight: 10 }} />
            <View>
              <Text style={styles.statLabel}>Inspections</Text>
              <Text style={styles.statText}>
                {counts.inspections.completed} / {counts.inspections.total}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <FeatherIcon name="clock" size={20} color={Colors.techPrimary} />
            <Text style={styles.actionLabel}>Hours Spent</Text>
            <Text style={styles.countText}>{counts.hoursSpent}h</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation?.navigate?.("ReportIssue")}
          >
            <FeatherIcon name="alert-circle" size={20} color="#000" />
            <Text style={styles.actionLabel}>Issues</Text>
            <Text style={styles.countText}>
              {counts.issues.total}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation?.navigate?.("QC")}
          >
            <FeatherIcon name="check-circle" size={20} color="#000" />
            <Text style={styles.actionLabel}>QC Checks</Text>
            <Text style={styles.countText}>
              {counts.qc.completed}/{counts.qc.total}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Reported Issues */}
{/* Reported Issues - Vertical List */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Reported Issues</Text>
  {reportedIssues.map((issue) => (
    <TouchableOpacity
      key={issue.id}
      style={styles.issueCard}
      onPress={() =>
        navigation?.navigate?.("WorkOrderDetails", { workOrderId: issue.workOrderId })
      }
    >
      <View style={styles.issueHeader}>
        <Text style={styles.issueTitle}>{issue.title}</Text>
        <View
          style={[
            styles.issueStatusCapsule,
            issue.status === "OPEN" && { backgroundColor: "#f8d7da" },
            issue.status === "IN_PROGRESS" && { backgroundColor: "#fff3cd" },
            issue.status === "RESOLVED" && { backgroundColor: "#d4edda" },
          ]}
        >
          <Text
            style={[
              styles.issueStatusText,
              issue.status === "OPEN" && { color: "#c82333" },
              issue.status === "IN_PROGRESS" && { color: "#856404" },
              issue.status === "RESOLVED" && { color: "#155724" },
            ]}
          >
            {issue.status}
          </Text>
        </View>
      </View>
      <Text style={styles.issueWorkOrder}>WO: {issue.workOrderId}</Text>
    </TouchableOpacity>
  ))}
</View>


        {/* Recent Work Orders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Work Orders</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {workOrders.map((wo) => (
              <View key={wo.workOrderId} style={styles.card}>
                <Text style={styles.cardId}>{wo.workOrderId}</Text>
                <View style={styles.statusCapsule}>
                  <Text style={styles.statusText}>{wo.status}</Text>
                </View>
                <Text style={styles.timeText}>
                  {wo.actualTime} / {wo.estimatedTime} hrs
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Recent Inspections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Inspections</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {inspections.map((insp) => (
              <View key={insp.inspectionId} style={styles.card}>
                <Text style={styles.cardId}>{insp.inspectionId}</Text>
                <View style={styles.statusCapsule}>
                  <Text style={styles.statusText}>{insp.status}</Text>
                </View>
                <Text style={styles.timeText}>Date: {insp.date}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <FeatherIcon name="home" size={22} color={Colors.techPrimary} />
          <Text style={styles.navLabelActive}>Home</Text>
        </TouchableOpacity>

  <TouchableOpacity style={styles.navItem} onPress={() => navigation?.navigate?.("WorkOrderList", { supabaseUserId })}> 
          <FeatherIcon name="briefcase" size={22} color="#444" />
          <Text style={styles.navLabel}>Work Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation?.navigate?.("InspectionList")}>
          <FeatherIcon name="clipboard" size={22} color="#444" />
          <Text style={styles.navLabel}>Inspections</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation?.navigate?.("Profile")}>
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
    paddingBottom: 50,
    elevation: 5,
  },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  welcomeText: { fontSize: 18, color: "#fff", fontWeight: "600" },
  dateText: { fontSize: 13, color: "#fff", marginTop: 4 },
  headerSubtitle: { color: "#fff", marginTop: 10, fontSize: 14 },

  statsRow: { flexDirection: "row", justifyContent: "space-between", marginHorizontal: 18, marginTop: -40 },
  statCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 12,
    alignItems: "center",
    flex: 0.48,
    elevation: 3,
  },
  statLabel: { fontSize: 13, color: "#000" },
  statText: { fontWeight: "bold", fontSize: 20, color: Colors.techPrimary },

  actionsRow: { flexDirection: "row", justifyContent: "space-between", marginHorizontal: 18, marginTop: 20 },
  actionBtn: {
    flex: 0.32,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#fff",
    elevation: 2,
  },
  actionLabel: { marginTop: 6, fontSize: 12, color: "#000", fontWeight: "600" },
  countText: { fontSize: 13, fontWeight: "700", marginTop: 4, color: Colors.techPrimary },

  section: { marginTop: 22 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#000", marginBottom: 12, marginHorizontal: 18 },

  card: {
    width: 140,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginLeft: 18,
    marginBottom: 20,
    elevation: 2,
  },
  cardId: { fontWeight: "700", color: Colors.techPrimary, marginBottom: 6 },
  cardDesc: { color: "#000", fontSize: 13, marginBottom: 10 },

  statusCapsule: {
    alignSelf: "flex-start",
    backgroundColor: "#e1e9f9",
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  statusText: { color: Colors.techPrimary, fontSize: 12, fontWeight: "600" },
  timeText: { color: "#555", fontSize: 12 },

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
  navLabelActive: { fontSize: 11, color: Colors.techPrimary, marginTop: 4, fontWeight: "700" },
  issueCard: {
  backgroundColor: "#fff",
  marginHorizontal: 18,
  marginBottom: 12,
  borderRadius: 12,
  padding: 12,
  elevation: 2,
},
issueHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
issueTitle: { fontSize: 14, fontWeight: "700", color: "#000", flex: 1 },
issueStatusCapsule: {
  borderRadius: 12,
  paddingHorizontal: 10,
  paddingVertical: 3,
},
issueStatusText: { fontSize: 12, fontWeight: "600" },
issueWorkOrder: { marginTop: 4, fontSize: 12, color: "#555" },

});
