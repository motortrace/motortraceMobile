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
import { getAuthMe, getTechnicianWorkOrders } from "../../api/technician";
import { fetchInspectionReport, fetchTechnicianInspections, updateChecklistItem, updateWorkOrderInspection, uploadInspectionAttachment } from "../../api/technicianApi";
import InspectionFormModal from "../../components/InspectionFormModal";
import Colors from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";
import { getToken } from "../../utils/authStorage";

export default function TechnicianHomeScreen({ navigation, userName = "John" }: { navigation: any; userName?: string }) {
  const { supabaseUserId } = useAuth();
  const [counts, setCounts] = useState({
    workOrders: { total: 0, completed: 0 },
    inspections: { total: 0, completed: 0 },
    hoursSpent: 0,
    issues: { total: 0, resolved: 0 },
    qc: { total: 0, completed: 0 },
  });
  const [recentWorkOrders, setRecentWorkOrders] = useState<any[]>([]);
  const [recentInspections, setRecentInspections] = useState<any[]>([]);
  const [formModalVisible, setFormModalVisible] = useState<boolean>(false);
  const [currentInspection, setCurrentInspection] = useState<any | null>(null);

  // Load live counts from backend when screen mounts
  useEffect(() => {
    let mounted = true;
    const loadCounts = async () => {
      try {
        const meData = await getAuthMe();
        const technicianId = meData?.data?.roleDetails?.technicianId;
        if (!technicianId) return;

        // --- Work orders ---
        const woRes = await getTechnicianWorkOrders(technicianId);
        const woArray = Array.isArray((woRes as any)?.data)
          ? (woRes as any).data
          : Array.isArray(woRes)
          ? woRes
          : Array.isArray((woRes as any)?.workOrders)
          ? (woRes as any).workOrders
          : [];

  const totalWorkOrders = woArray.length;
        const completedWorkOrders = woArray.filter((w: any) => {
          const status = (w?.status || "").toString().toLowerCase();
          const closed = !!w?.closedAt;
          const laborList = Array.isArray(w.labors) ? w.labors : Array.isArray(w.laborItems) ? w.laborItems : [];
          const laborDone = laborList.length > 0 && laborList.every((l: any) => {
            const s = (l?.status || l?.state || "").toString().toLowerCase();
            return s === "completed" || s === "complete" || s === "done";
          });
          return status === "completed" || closed || laborDone;
        }).length;

        // --- Inspections ---
        const token = await getToken();
        const insRes = token ? await fetchTechnicianInspections(technicianId, token) : [];
        const insArray = Array.isArray((insRes as any)?.data)
          ? (insRes as any).data
          : Array.isArray(insRes)
          ? insRes
          : Array.isArray((insRes as any)?.inspections)
          ? (insRes as any).inspections
          : [];

        const totalIns = insArray.length;
        const completedIns = insArray.filter((i: any) => {
          return i?.isCompleted === true || (typeof i?.status === "string" && i.status.toLowerCase() === "completed") || (typeof i?.state === "string" && i.state.toLowerCase() === "completed");
        }).length;

        // normalize and save the most recent inspections for the home screen
        const sortedIns = (insArray || []).slice().sort((a: any, b: any) => {
          const ta = new Date(a.updatedAt || a.createdAt || 0).getTime();
          const tb = new Date(b.updatedAt || b.createdAt || 0).getTime();
          return tb - ta;
        });
        setRecentInspections(sortedIns.slice(0, 5).map((i: any) => ({
          ...i,
          isCompleted: !!(
            i?.isCompleted === true ||
            (typeof i?.status === 'string' && i.status.toLowerCase() === 'completed') ||
            (typeof i?.state === 'string' && i.state.toLowerCase() === 'completed')
          ),
        })));

        if (!mounted) return;

        // Prepare recent work orders (limit 5) and compute labor counts assigned to this technician
        const countAssignedLabors = (wo: any, techId: string) => {
          const labors = Array.isArray(wo.labors) ? wo.labors : Array.isArray(wo.laborItems) ? wo.laborItems : [];
          return labors.filter((l: any) => {
            if (!l) return false;
            // possible labor-assignment fields
            let tid: any = l.technicianId || l.assignedTo || l.assignedTechnicianId || l.assigneeId || l.assigned_to || (l.technician && l.technician.id) || (l.assignedTo && l.assignedTo.id) || (l.assigned && l.assigned.id);
            if (typeof tid === 'object' && tid !== null) tid = tid.id || tid.userId || tid.uuid;
            return tid === techId;
          }).length;
        };

        const recent = (woArray || [])
          .slice()
          .sort((a: any, b: any) => {
            const ta = new Date(a.updatedAt || a.createdAt || 0).getTime();
            const tb = new Date(b.updatedAt || b.createdAt || 0).getTime();
            return tb - ta;
          })
          .slice(0, 5)
          .map((w: any) => ({
            ...w,
            laborCountForTech: technicianId ? countAssignedLabors(w, technicianId) : 0,
          }));

        setRecentWorkOrders(recent);

        setCounts((c) => ({
          ...c,
          workOrders: { total: totalWorkOrders, completed: completedWorkOrders },
          inspections: { total: totalIns, completed: completedIns },
          hoursSpent: Array.isArray(woArray) ? woArray.reduce((s: number, w: any) => s + (Number(w.actualTime) || 0), 0) : c.hoursSpent,
        }));
      } catch (err) {
        console.warn("loadCounts error", err);
      }
    };

    loadCounts();
    return () => { mounted = false; };
  }, [supabaseUserId]);

  // Inspection modal & helpers (similar to InspectionList)
  const openInspectionModal = (inspection: any) => {
    const prepare = async () => {
      try {
        let full: any = inspection;
        if (!inspection.checklistItems || inspection.checklistItems.length === 0) {
          const token = await getToken();
          if (!inspection.id || !token) throw new Error('Missing inspection id or token');
          full = await fetchInspectionReport(inspection.id, token);
        }

        const checklist = (full.checklistItems || []).map((c: any) => ({
          id: c.id || c.itemId || null,
          item: c.description || c.item || c.name || "",
          status: c.status || c.state || "PENDING",
          notes: c.notes ?? c.comment ?? "",
          photos: c.photos ?? [],
        }));

        setCurrentInspection({ ...inspection, ...full, checklistItems: checklist });
        setFormModalVisible(true);
      } catch (err) {
        console.error('openInspectionModal error', err);
      }
    };

    prepare();
  };

  const setItemStatus = (index: number, status: string) => {
    setCurrentInspection((prev: any) => {
      if (!prev) return prev;
      const updated: any = { ...prev };
      updated.checklistItems = [...(updated.checklistItems || [])];
      const items = updated.checklistItems as any[];
      items[index] = { ...items[index], status };

      const _item = items[index];
      const _id: string | undefined = _item && typeof _item.id === 'string' && _item.id.trim().length > 0 ? _item.id.trim() : undefined;
      if (typeof _id === 'string') {
        (async () => {
          try {
            const token = await getToken();
            const idStr = _id as string;
            await updateChecklistItem(idStr as any, { status }, token);
          } catch (err) {
            console.error('Failed to update checklist status', err);
          }
        })();
      }
      return updated;
    });
  };

  const setItemNotes = (index: number, notes: string) => {
    setCurrentInspection((prev: any) => {
      if (!prev) return prev;
      const updated: any = { ...prev };
      updated.checklistItems = [...(updated.checklistItems || [])];
      const items = updated.checklistItems as any[];
      items[index] = { ...items[index], notes };

      const _itemNotes = items[index];
      const _idNotes: string | undefined = _itemNotes && typeof _itemNotes.id === 'string' && _itemNotes.id.trim().length > 0 ? _itemNotes.id.trim() : undefined;
      if (typeof _idNotes === 'string') {
        (async () => {
          try {
            const token = await getToken();
            const idStr = _idNotes as string;
            await updateChecklistItem(idStr as any, { notes }, token);
          } catch (err) {
            console.error('Failed to update checklist notes', err);
          }
        })();
      }
      return updated;
    });
  };

  const attachPhoto = (index: number) => {
    setCurrentInspection((prev: any) => {
      if (!prev) return prev;
      const updated: any = { ...prev };
      updated.checklistItems = [...(updated.checklistItems || [])];
      const items = updated.checklistItems as any[];
      items[index] = { ...items[index], photos: [...(items[index].photos || []), ''] };

      (async () => {
        try {
          const inspectionId = updated.id;
          if (!inspectionId) return;
          const item = items[index];
          const token = await getToken();
          const checklistItemIdParam: string | undefined = item && typeof item.id === 'string' && item.id.trim().length > 0 ? item.id.trim() : undefined;
          // Note: actual uri should come from image-picker; here we just stub to keep UI flow working.
          const uploadRes = await uploadInspectionAttachment(inspectionId, { uri: 'file://stub.jpg', fileName: 'photo.jpg', type: 'image/jpeg' }, checklistItemIdParam as any, token);

          const fileUrl = uploadRes?.fileUrl || uploadRes?.url || uploadRes?.path || uploadRes?.data?.fileUrl || uploadRes?.data?.url;
          if (fileUrl) {
            const newPhotos = [...(item.photos || [])];
            newPhotos[newPhotos.length - 1] = fileUrl;
            item.photos = newPhotos;
            if (item && typeof item.id === 'string' && item.id.trim().length > 0) {
              const idStr = item.id.trim();
              await updateChecklistItem(idStr as any, { photos: item.photos }, token);
            }
          }
        } catch (err) {
          console.error('Failed to upload inspection photo', err);
        }
      })();

      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!currentInspection) return;
    try {
      const token = await getToken();
      if (!currentInspection.id || !token) throw new Error('Missing inspectionId or token');
      await updateWorkOrderInspection(currentInspection.id, {
        isCompleted: true,
        checklistItems: currentInspection.checklistItems,
        notes: currentInspection.notes,
      }, token);
      setFormModalVisible(false);
    } catch (err) {
      console.error('Failed to save inspection', err);
    }
  };

  const viewInspectionReport = async (inspection: any) => {
    try {
      const token = await getToken();
      if (!inspection?.id || !token) return;
      const report = await fetchInspectionReport(inspection.id, token);
      navigation.navigate("InspectionReport", { inspection: report });
    } catch (err) {
      console.error('Failed to fetch inspection report', err);
    }
  };

  // Local UI-only data (kept as read-only placeholders)
  const [reportedIssues] = useState([
    { id: "ISSUE-001", title: "Brake fluid leakage", status: "OPEN", workOrderId: "WO-001" },
    { id: "ISSUE-002", title: "Loose wheel nuts", status: "RESOLVED", workOrderId: "WO-002" },
    { id: "ISSUE-003", title: "AC not cooling", status: "IN_PROGRESS", workOrderId: "WO-004" },
  ]);

  // placeholder workOrders removed — recentWorkOrders is used instead

  // placeholder inspections removed; recentInspections will be used

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


        {/* Recent Work Orders (live) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Work Orders</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentWorkOrders.map((wo) => (
              <TouchableOpacity
                key={wo.id}
                style={styles.card}
                onPress={() => navigation?.navigate?.("WorkOrderDetails", { workOrderId: wo.id, workOrder: wo })}
              >
                <Text style={styles.cardId}>{wo.workOrderNumber ?? wo.workOrderId ?? wo.id}</Text>
                <View style={styles.statusCapsule}>
                  <Text style={styles.statusText}>{wo.status ?? wo.workflowStep ?? "UNKNOWN"}</Text>
                </View>
                <Text style={styles.timeText}>{(wo.laborCountForTech ?? 0) + " Tasks"}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recent Inspections (live) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Inspections</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentInspections.map((insp) => (
              <View key={insp.id ?? insp.inspectionId} style={styles.card}>
                <Text style={styles.cardId}>{`INSP-${(insp.id || '').toString().slice(0, 5)}...`}</Text>
                <View style={styles.statusCapsule}>
                  <Text style={styles.statusText}>{insp.isCompleted ? 'Completed' : 'Not Complete'}</Text>
                </View>
                {/* Actions (right aligned) */}
                <View style={styles.inspectionActionsRow}>
                  <TouchableOpacity
                    style={styles.inspectionActionBtn}
                    onPress={() => (insp.isCompleted ? viewInspectionReport(insp) : openInspectionModal(insp))}
                  >
                    <FeatherIcon name={insp.isCompleted ? 'eye' : 'play'} size={14} color={Colors.techPrimary} />
                    <Text style={styles.inspectionActionText}>{insp.isCompleted ? 'View' : 'Start'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Inspection Form Modal (used for starting inspections) */}
        <InspectionFormModal
          visible={formModalVisible}
          onClose={() => setFormModalVisible(false)}
          inspection={currentInspection}
          setItemStatus={setItemStatus}
          setItemNotes={setItemNotes}
          attachPhoto={attachPhoto}
          onSubmit={handleSubmit}
        />
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

  inspectionActionsRow: { marginTop: 8, alignItems: 'flex-end', justifyContent: 'flex-end' },
  inspectionActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  inspectionActionText: { marginLeft: 6, fontSize: 12, color: Colors.techPrimary, fontWeight: '600' },

});
