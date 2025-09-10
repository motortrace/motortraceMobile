// src/screens/Technician/WorkOrderDetails.tsx
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import Colors from "../../constants/colors";
import AddIssueModal from "../../components/AddIssueModal";
import IssueDetailsModal from "../../components/IssueDetailsModal";
import QCModal from "../../components/QCModal";

export default function WorkOrderDetailsScreen({ route, navigation }) {
  const workOrder = route.params?.workOrder;

  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [addIssueModalVisible, setAddIssueModalVisible] = useState(false);
  const [qcModalVisible, setQcModalVisible] = useState(false);
  const [qcData, setQcData] = useState({});
  const [issues, setIssues] = useState(workOrder.issues || []);

  // Task states: { startedAt, elapsed, running }
  const [taskTimers, setTaskTimers] = useState({});

  // tick every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTaskTimers((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((taskId) => {
          if (updated[taskId].running) {
            updated[taskId].elapsed = Date.now() - updated[taskId].startedAt + updated[taskId].previousElapsed;
          }
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs > 0 ? hrs + "h " : ""}${mins}m ${secs}s`;
  };

  const handleStart = (taskId) => {
    setTaskTimers((prev) => ({
      ...prev,
      [taskId]: { startedAt: Date.now(), elapsed: 0, previousElapsed: prev[taskId]?.elapsed || 0, running: true },
    }));
  };

  const handleStop = (taskId) => {
    setTaskTimers((prev) => ({
      ...prev,
      [taskId]: { ...prev[taskId], running: false, previousElapsed: prev[taskId].elapsed },
    }));
  };

  const handleComplete = (task) => {
    task.status = "COMPLETED";
    handleStop(task.id);
  };

  const handleResume = (taskId) => {
    setTaskTimers((prev) => ({
      ...prev,
      [taskId]: { ...prev[taskId], startedAt: Date.now(), running: true },
    }));
  };

  const handleAddIssue = (taskId, issue) => {
    const newEntry = {
      ...issue,
      workOrderId: workOrder.id,
      taskId,
      technicianId: "tech-123",
      reportedAt: new Date().toISOString(),
      status: "REPORTED",
      requiresApproval: false,
      estimatedAdditionalCost: 0,
    };
    setIssues([...issues, newEntry]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED": return "#E6F4EA";
      case "PENDING": return "#FFF8E1";
      case "INPROGRESS": return "#E0F0FF";
      default: return "#eee";
    }
  };
  const getTextColor = (status) => {
    switch (status) {
      case "COMPLETED": return "#2E7D32";
      case "PENDING": return "#FF8F00";
      case "INPROGRESS": return "#0277BD";
      default: return "#555";
    }
  };

  const totalTasks = workOrder.tasks.length;
  const completedTasks = workOrder.tasks.filter((t) => t.status === "COMPLETED").length;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={Colors.techPrimary} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FeatherIcon name="arrow-left" size={20} color="#fff" />
          <Text style={styles.headerBackText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Work Order Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Work Order Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Work Order Info</Text>
          <Text style={styles.headerTitle2}>{workOrder.system}</Text>
          <Text style={styles.headerText}>WO ID: {workOrder.id}</Text>
          <Text style={styles.headerText}>Vehicle: {workOrder.carModel} ({workOrder.carPlate})</Text>
          <Text style={styles.headerText}>Technician: {workOrder.technician}</Text>

          <View style={[styles.progressPill, { backgroundColor: "#E0F0FF" }]}>
            <Text style={{ color: "#0277BD", fontWeight: "700" }}>{progressPercent}% Complete</Text>
          </View>
        </View>

        {/* Tasks */}
        <View style={{ marginTop: 20 }}>
          <Text style={[styles.sectionTitle, { marginHorizontal: 18 }]}>Tasks</Text>
          {workOrder.tasks.map((task) => {
            const taskIssues = issues.filter((i) => i.taskId === task.id);
            const timer = taskTimers[task.id] || { elapsed: 0, running: false };
            return (
              <View key={task.id} style={styles.card}>
                {/* Task Header */}
                <View style={styles.taskHeader}>
                  <Text style={styles.taskDesc}>{task.description}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
                    <Text style={[styles.statusText, { color: getTextColor(task.status) }]}>{task.status}</Text>
                  </View>
                </View>

                {/* Time tracking */}
                {task.status !== "COMPLETED" && (
                  <View style={styles.timerRow}>
                    <FeatherIcon name="clock" size={16} color={Colors.techPrimary} />
                    <Text style={styles.timerText}>{formatTime(timer.elapsed)}</Text>
                  </View>
                )}

                {/* Action buttons */}
                <View style={styles.actionRow}>
                  {task.status === "PENDING" && (
                    <TouchableOpacity style={styles.actionBtn} onPress={() => { task.status = "INPROGRESS"; handleStart(task.id); }}>
                      <FeatherIcon name="play" size={18} color="#000" />
                      <Text style={styles.actionLabel}>Start</Text>
                    </TouchableOpacity>
                  )}
                  {task.status === "INPROGRESS" && (
                    <>
                      {timer.running ? (
                        <TouchableOpacity style={styles.actionBtn} onPress={() => handleStop(task.id)}>
                          <FeatherIcon name="pause" size={18} color="#000" />
                          <Text style={styles.actionLabel}>Stop</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity style={styles.actionBtn} onPress={() => handleResume(task.id)}>
                          <FeatherIcon name="play" size={18} color="#000" />
                          <Text style={styles.actionLabel}>Resume</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity style={styles.actionBtn} onPress={() => handleComplete(task)}>
                        <FeatherIcon name="check" size={18} color="#000" />
                        <Text style={styles.actionLabel}>Complete</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {/* Report Issue button (always visible) */}
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => setAddIssueModalVisible({ visible: true, taskId: task.id })}
                  >
                    <FeatherIcon name="alert-circle" size={18} color="#000" />
                    <Text style={styles.actionLabel}>Report</Text>
                  </TouchableOpacity>
                </View>

                {/* QC after completion */}
                {task.status === "COMPLETED" && (
                  <View style={{ marginTop: 12 }}>
                    <Text style={styles.sectionTitle}>Quality Control</Text>
                    {qcData[task.id] ? (
                      <View style={styles.qcCard}>
                        <Text style={styles.qcLabel}>Verified By: {qcData[task.id].verifiedBy}</Text>
                        <Text style={styles.qcLabel}>Method: {qcData[task.id].method}</Text>
                        <Text style={styles.qcLabel}>Notes: {qcData[task.id].notes}</Text>
                        <Text style={styles.qcLabel}>At: {new Date(qcData[task.id].verifiedAt).toLocaleString()}</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={[styles.startBtn, { alignSelf: "flex-start" }]}
                        onPress={() => setQcModalVisible({ visible: true, taskId: task.id })}
                      >
                        <Text style={styles.startBtnText}>Complete QC</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}

                {/* Issues */}
                {taskIssues.length > 0 && (
                  <View style={{ marginTop: 12 }}>
                    <Text style={styles.sectionTitle}>Issues</Text>
                    {taskIssues.map((issue, i) => (
                      <TouchableOpacity
                        key={i}
                        style={styles.issueCard}
                        onPress={() => { setSelectedIssue(issue); setShowIssueModal(true); }}
                      >
                        <Text style={styles.issueTitle}>{issue.issueType} ({issue.severity})</Text>
                        <Text style={styles.issueDesc}>{issue.description}</Text>
                        <Text style={styles.issueMeta}>Cost: LKR {issue.estimatedAdditionalCost}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Modals */}
      <AddIssueModal
        visible={!!addIssueModalVisible}
        onClose={() => setAddIssueModalVisible(false)}
        onSubmit={(issue) => handleAddIssue(addIssueModalVisible.taskId, issue)}
      />
      <IssueDetailsModal visible={showIssueModal} issue={selectedIssue} onClose={() => setShowIssueModal(false)} />
      <QCModal
        visible={!!qcModalVisible}
        onClose={() => setQcModalVisible(false)}
        onSubmit={(data) =>
          setQcData((prev) => ({
            ...prev,
            [qcModalVisible.taskId]: { ...data, verifiedAt: new Date() },
          }))
        }
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
          <FeatherIcon name="home" size={22} color="#444" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <FeatherIcon name="check-square" size={22} color={Colors.techPrimary} />
          <Text style={styles.navLabelActive}>Work Orders</Text>
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

// ------------------- STYLES -------------------
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  header: {
    backgroundColor: Colors.techPrimary,
    paddingVertical: 12,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: { flexDirection: "row", alignItems: "center" },
  headerBackText: { color: "#fff", fontWeight: "600", marginLeft: 6 },
  headerTitle: { color: "#fff", fontWeight: "700", fontSize: 16 },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 18,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
  },

  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#000", marginBottom: 8 },
  headerTitle2: { fontSize: 16, fontWeight: "700", color: "#000" },
  headerText: { fontSize: 12, color: "#555", marginTop: 2 },

  taskHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  taskDesc: { fontSize: 14, fontWeight: "600", color: "#000", marginBottom: 4 },

  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: "700" },

  progressPill: { marginTop: 12, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, alignSelf: "flex-start" },

  timerRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  timerText: { marginLeft: 6, fontSize: 13, fontWeight: "600", color: Colors.techPrimary },

  actionRow: { flexDirection: "row", marginTop: 10, flexWrap: "wrap" },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
    marginTop: 6,
  },
  actionLabel: { marginLeft: 6, fontSize: 13, fontWeight: "600", color: "#000" },

  qcCard: { backgroundColor: "#f9f9f9", borderRadius: 12, padding: 12, marginTop: 8 },
  qcLabel: { fontSize: 12, fontWeight: "600", color: "#555", marginTop: 4 },
  startBtn: { backgroundColor: Colors.techPrimary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 6, marginTop: 6 },
  startBtnText: { color: "#fff", fontWeight: "700" },

  issueCard: { backgroundColor: "#f9f9f9", marginBottom: 10, padding: 12, borderRadius: 8, elevation: 2 },
  issueTitle: { fontWeight: "700", fontSize: 13, color: "#000" },
  issueDesc: { fontSize: 12, color: "#333", marginTop: 4 },
  issueMeta: { fontSize: 11, color: "#666", marginTop: 6 },

  bottomNav: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", borderTopWidth: 1, borderColor: "#eee", backgroundColor: "#fff", paddingVertical: 10, elevation: 8 },
  navItem: { alignItems: "center", flex: 1 },
  navLabel: { fontSize: 11, color: "#444", marginTop: 4 },
  navLabelActive: { fontSize: 11, color: Colors.techPrimary, marginTop: 4, fontWeight: "700" },
});
