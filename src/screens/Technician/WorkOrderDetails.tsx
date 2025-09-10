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
  Alert,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import Colors from "../../constants/colors";
import AddIssueModal from "../../components/AddIssueModal";
import IssueDetailsModal from "../../components/IssueDetailsModal";
import QCModal from "../../components/QCModal";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import InstallPartModal from "../../components/InstallPartModal";

export default function WorkOrderDetailsScreen({ route, navigation }) {
  const workOrder = route.params?.workOrder;

  const [orderStatus, setOrderStatus] = useState(workOrder.status || "INPROGRESS");
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [addIssueModalVisible, setAddIssueModalVisible] = useState(false);
  const [qcModalVisible, setQcModalVisible] = useState(false);
  const [qcData, setQcData] = useState({});
  const [issues, setIssues] = useState(workOrder.issues || []);
  const [documentation, setDocumentation] = useState(
    Object.fromEntries(workOrder.tasks.map((t) => [t.id, { photos: [] }]))
  );

  // Photo modal state
const [photoModalVisible, setPhotoModalVisible] = useState(false);
const [selectedPhoto, setSelectedPhoto] = useState<{ uri: string; taskId: string; index: number } | null>(null);
const [installPartModalVisible, setInstallPartModalVisible] = useState(false);
const [selectedPart, setSelectedPart] = useState(null);

// Parts state
const [partsUsage, setPartsUsage] = useState(
  Object.fromEntries(
    workOrder.parts?.map((part) => [
      part.inventoryItemId,
      { ...part, installed: !!part.installedAt, quantityUsed: 0, photo: null },
    ]) || []
  )
);



  // Timer state per task
  const [taskTimers, setTaskTimers] = useState(
    Object.fromEntries(
      workOrder.tasks.map((t) => [
        t.id,
        { running: false, start: null, elapsed: (t.actualTime || 0) * 3600000 },
      ])
    )
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTaskTimers((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((id) => {
          if (updated[id].running && updated[id].start) {
            updated[id].elapsed = Date.now() - updated[id].start + updated[id].elapsedBase;
          }
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = (taskId) => {
    setTaskTimers((prev) => ({
      ...prev,
      [taskId]: { ...prev[taskId], running: true, start: Date.now(), elapsedBase: prev[taskId].elapsed },
    }));
  };

  const handleStop = (taskId) => {
    setTaskTimers((prev) => ({
      ...prev,
      [taskId]: { ...prev[taskId], running: false, start: null, elapsed: prev[taskId].elapsed },
    }));
  };

  const handleResume = (taskId) => {
    setTaskTimers((prev) => ({
      ...prev,
      [taskId]: { ...prev[taskId], running: true, start: Date.now(), elapsedBase: prev[taskId].elapsed },
    }));
  };

  const handleComplete = (task) => {
    task.status = "QC PENDING";
    handleStop(task.id);
  };
  const handleQCSubmit = (taskId, qcData) => {
  setWorkOrder((prev) => {
    const updatedTasks = prev.tasks.map((t) =>
      t.id === taskId
        ? { ...t, status: "COMPLETED", qc: qcData }
        : t
    );
    return { ...prev, tasks: updatedTasks };
  });
};


  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    return `${h}h ${m}m`;
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

  // Add issue to issues array
  setIssues((prev) => [...prev, newEntry]);

  // If issue has photo, add it to documentation
  if (issue.photo) {
    setDocumentation((prev) => {
      const taskDocs = prev[taskId]?.photos || [];
      return {
        ...prev,
        [taskId]: {
          photos: [
            ...taskDocs,
            {
              uri: issue.photo.uri,
              type: "Issue", // Mark this as an Issue photo
            },
          ],
        },
      };
    });
  }
};


  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "#E6F4EA";
      case "PENDING":
        return "#FFF8E1";
      case "INPROGRESS":
        return "#E0F0FF";
      default:
        return "#eee";
    }
  };

  const getTextColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "#2E7D32";
      case "PENDING":
        return "#FF8F00";
      case "INPROGRESS":
        return "#0277BD";
      default:
        return "#555";
    }
  };

  useEffect(() => {
  const allCompleted = workOrder.tasks.every((t) => t.status === "COMPLETED");
  if (allCompleted && orderStatus !== "READY") {
    setOrderStatus("COMPLETED"); // show as completed but waiting for Ready
  }
}, [workOrder.tasks]);



const handlePickPhoto = (task) => {
  Alert.alert(
    "Attach Photo",
    "Choose a method",
    [
      {
        text: "Camera",
        onPress: () =>
          launchCamera({ mediaType: "photo" }, (res) => {
            if (res.didCancel) return;
            if (res.errorCode) {
              Alert.alert("Error", res.errorMessage || "Camera error");
              return;
            }
            if (res.assets && res.assets.length > 0) {
              const type = task.status === "COMPLETED" ? "After" : "Before";
              savePhoto(task.id, res.assets[0].uri, type);
            }
          }),
      },
      {
        text: "Gallery",
        onPress: () =>
          launchImageLibrary({ mediaType: "photo" }, (res) => {
            if (res.didCancel) return;
            if (res.errorCode) {
              Alert.alert("Error", res.errorMessage || "Gallery error");
              return;
            }
            if (res.assets && res.assets.length > 0) {
              const type = task.status === "COMPLETED" ? "After" : "Before";
              savePhoto(task.id, res.assets[0].uri, type);
            }
          }),
      },
      { text: "Cancel", style: "cancel" },
    ],
    { cancelable: true }
  );
};

const openPhotoModal = (taskId: string, uri: string, index: number) => {
  setSelectedPhoto({ uri, taskId, index });
  setPhotoModalVisible(true);
};

const removePhoto = (taskId: string, index: number) => {
  setDocumentation((prev) => {
    const taskDocs = prev[taskId]?.photos || [];
    const updatedDocs = [...taskDocs];
    updatedDocs.splice(index, 1);
    return { ...prev, [taskId]: { photos: updatedDocs } };
  });
  setPhotoModalVisible(false);
};


  const savePhoto = (taskId, uri, type) => {
    setDocumentation((prev) => {
      const taskDocs = prev[taskId]?.photos || [];
      return { ...prev, [taskId]: { photos: [...taskDocs, { uri, type }] } };
    });
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
          <Text style={styles.headerText}>
            Vehicle: {workOrder.carModel} ({workOrder.carPlate})
          </Text>
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
            const elapsedHrs = (taskTimers[task.id]?.elapsed || 0) / 3600000;
            const progress = Math.min(elapsedHrs / task.estimatedTime, 1);

            return (
              <View key={task.id} style={styles.card}>
                {/* Task Header */}
                <View style={styles.taskHeader}>
                  <Text style={styles.taskDesc}>{task.description}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
                    <Text style={[styles.statusText, { color: getTextColor(task.status) }]}>{task.status}</Text>
                  </View>
                </View>

                {/* Time */}
                <View style={styles.timeRow}>
                  <Text style={styles.taskMeta}>Estimated: {task.estimatedTime}h</Text>
                  <Text style={styles.taskMeta}>Actual: {elapsedHrs.toFixed(1)}h</Text>
                </View>
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
                </View>

                {/* Timer */}
                {task.status !== "COMPLETED" && (
                  <View style={styles.timerRow}>
                    <FeatherIcon name="clock" size={16} color={Colors.techPrimary} />
                    <Text style={styles.timerText}>{formatTime(taskTimers[task.id]?.elapsed || 0)}</Text>
                  </View>
                )}

                {/* Buttons */}
                <View style={styles.actionRow}>
                  {task.status === "PENDING" && (
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => {
                        task.status = "INPROGRESS";
                        handleStart(task.id);
                      }}
                    >
                      <FeatherIcon name="play" size={18} color="#000" />
                      <Text style={styles.actionLabel}>Start</Text>
                    </TouchableOpacity>
                  )}

                  {task.status === "INPROGRESS" && (
                    <>
                      {taskTimers[task.id]?.running ? (
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

                      <TouchableOpacity style={styles.completeBtn} onPress={() => handleComplete(task)}>
                        <FeatherIcon name="check" size={18} color="#fff" />
                        <Text style={styles.completeLabel}>Complete</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>

                
{/* Documentation Section */}
<View style={{ marginTop: 12 }}>
  <Text style={styles.sectionTitle}>Documentation</Text>
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={{ marginTop: 6 }}
  >
    {/* Add Task Photo Button FIRST */}
    <TouchableOpacity
      style={[styles.addPhotoDotted, { marginRight: 8 }]}
      onPress={() => handlePickPhoto(task)}
    >
      <FeatherIcon name="camera" size={20} color={Colors.techPrimary} />
      <Text style={styles.addPhotoText}>Add Photo</Text>
    </TouchableOpacity>

    {/* Task Photos */}
    {documentation[task.id]?.photos?.map((photo, i) => (
      <TouchableOpacity
        key={`task-${i}`}
        onPress={() => openPhotoModal(task.id, photo.uri, i)}
        style={{ alignItems: "center", marginRight: 8 }}
      >
        <Image source={{ uri: photo.uri }} style={styles.docPhoto} />
        <Text style={{ fontSize: 10, color: "#555", marginTop: 2 }}>
          {photo.type || "Photo"}
        </Text>
      </TouchableOpacity>
    ))}

    {/* Part Photos */}
    {documentation.parts?.photos?.map((photo, i) => (
      <TouchableOpacity
        key={`part-${i}`}
        onPress={() => openPhotoModal("parts", photo.uri, i)}
        style={{ alignItems: "center", marginRight: 8 }}
      >
        <Image source={{ uri: photo.uri }} style={styles.docPhoto} />
        <Text style={{ fontSize: 10, color: "#555", marginTop: 2 }}>
          {photo.type}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
</View>




{/* ------------------- Parts Section ------------------- */}
<View style={{ marginTop: 12 }}>
  <Text style={styles.sectionTitle}>Parts</Text>
  {workOrder.parts?.map((part) => {
    const installedPart = partsUsage[part.inventoryItemId] || {};
    return (
      <View key={part.inventoryItemId} style={styles.partCard}>
        {/* Part Info */}
        <View style={{ flex: 1 }}>
          <Text style={styles.partName}>
            {part.name} ({part.quantity})
          </Text>
          <Text style={styles.partNotes}>
            {installedPart.notes || part.notes || "No notes"}
          </Text>
          {installedPart.installedAt && (
            <Text style={styles.installedText}>
              Installed at: {new Date(installedPart.installedAt).toLocaleString()}
            </Text>
          )}
        </View>

        {/* Part Actions */}
        {!installedPart.installedAt && (
          <TouchableOpacity
            style={styles.installBtn}
            onPress={() => {
              setSelectedPart({ ...part, quantityUsed: part.quantity });
              setInstallPartModalVisible(true);
            }}
          >
            <Text style={styles.installBtnText}>Mark as Installed</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  })}
</View>



                {/* Issues Section */}
                <View style={{ marginTop: 12 }}>
                  <View style={styles.issueHeader}>
                    <Text style={styles.sectionTitle}>Issues</Text>
                    <TouchableOpacity
                      style={styles.newIssueBtn}
                      onPress={() => setAddIssueModalVisible({ visible: true, taskId: task.id })}
                    >
                      <FeatherIcon name="plus" size={16} color="#fff" />
                      <Text style={styles.newIssueBtnText}>New Issue</Text>
                    </TouchableOpacity>
                  </View>
                  {taskIssues.length === 0 ? (
                    <Text style={styles.noIssuesText}>No issues reported.</Text>
                  ) : (
                    taskIssues.map((issue, i) => (
                      <TouchableOpacity
                        key={i}
                        style={styles.issueCard}
                        onPress={() => {
                          setSelectedIssue(issue);
                          setShowIssueModal(true);
                        }}
                      >
                        <Text style={styles.issueTitle}>
                          {issue.issueType} ({issue.severity})
                        </Text>
                        <Text style={styles.issueDesc}>{issue.description}</Text>
                        <Text style={styles.issueMeta}>Cost: LKR {issue.estimatedAdditionalCost}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </View>

                                {/* QC after completion */}
{(task.status === "QC PENDING" || task.status === "COMPLETED") && (
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
      task.status === "QC PENDING" && (
        <TouchableOpacity
          style={[styles.startBtn, { alignSelf: "flex-start" }]}
          onPress={() => setQcModalVisible({ visible: true, taskId: task.id })}
        >
          <Text style={styles.startBtnText}>Complete QC</Text>
        </TouchableOpacity>
      )
    )}
  </View>
)}

              </View>
            );
          })}
        </View>
        {orderStatus === "COMPLETED" && (
  <View style={{ margin: 20 }}>
    <TouchableOpacity
      style={styles.readyBtn}
      onPress={() => setOrderStatus("READY")}
    >
      <Text style={styles.readyBtnText}>Mark Order as Ready</Text>
    </TouchableOpacity>
  </View>
)}


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
  onSubmit={(data) => {
    const taskId = qcModalVisible.taskId;

    // 1️⃣ Save QC data
    setQcData((prev) => ({
      ...prev,
      [taskId]: { ...data, verifiedAt: new Date() },
    }));

    // 2️⃣ Update task status → COMPLETED
    const updatedTasks = workOrder.tasks.map((t) =>
      t.id === taskId ? { ...t, status: "COMPLETED" } : t
    );

    workOrder.tasks = updatedTasks; // mutate for now (or use a state setter if you keep workOrder in state)

    setQcModalVisible(false);
  }}
/>


<InstallPartModal
  visible={installPartModalVisible}
  part={selectedPart}
  onClose={() => setInstallPartModalVisible(false)}
onSubmit={(installedPart) => {
  const { inventoryItemId, photo, quantityUsed, notes } = installedPart;
  const now = new Date().toISOString();

  // Update partsUsage
  setPartsUsage((prev) => ({
    ...prev,
    [inventoryItemId]: {
      ...prev[inventoryItemId],
      installed: true,
      installedAt: now,
      quantityUsed,
      notes,
      photo: photo ? { uri: photo.uri, type: "Part" } : null,
    },
  }));

  // Save to documentation → always under "parts"
  if (photo) {
    setDocumentation((prev) => {
      const partDocs = prev["parts"]?.photos || [];
      return {
        ...prev,
        parts: {
          photos: [...partDocs, { uri: photo.uri, type: "Part" }],
        },
      };
    });
  }

  setInstallPartModalVisible(false);
}}

/>



      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
          <FeatherIcon name="home" size={22} color={Colors.techPrimary} />
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
  header: { backgroundColor: Colors.techPrimary, paddingVertical: 12, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backButton: { flexDirection: "row", alignItems: "center" },
  headerBackText: { color: "#fff", fontWeight: "600", marginLeft: 6 },
  headerTitle: { color: "#fff", fontWeight: "700", fontSize: 16 },
  card: { backgroundColor: "#fff", marginHorizontal: 18, borderRadius: 12, padding: 16, marginBottom: 16, elevation: 3, shadowColor: "#656565ff", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#000", marginBottom: 8 },
  headerTitle2: { fontSize: 16, fontWeight: "700", color: "#000" },
  headerText: { fontSize: 12, color: "#555", marginTop: 2 },
  taskHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  taskDesc: { fontSize: 14, fontWeight: "600", color: "#000", marginBottom: 4 },
  taskMeta: { fontSize: 12, color: "#555" },
  timeRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 6 },
  progressPill: { marginTop: 12, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, alignSelf: "flex-start" },
  progressBarBackground: { height: 6, backgroundColor: "#eee", borderRadius: 3, marginTop: 4 },
  progressBarFill: { height: 6, backgroundColor: Colors.techPrimary, borderRadius: 3 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: "700" },
  timerRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  timerText: { marginLeft: 6, fontSize: 13, fontWeight: "600", color: "#000" },
  actionRow: { flexDirection: "row", marginTop: 10 },
  actionBtn: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ccc", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, marginRight: 10 },
  actionLabel: { marginLeft: 6, fontSize: 13, fontWeight: "500" },
  completeBtn: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.techPrimary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  completeLabel: { marginLeft: 6, fontSize: 13, fontWeight: "600", color: "#fff" },
  addPhotoDotted: { width: 80, height: 80, borderRadius: 12, borderWidth: 2, borderStyle: "dashed", borderColor: "#ccc", justifyContent: "center", alignItems: "center", marginRight: 8, backgroundColor: "#fafafa" },
  addPhotoText: { fontSize: 10, color: "#8c8a8aff", marginTop: 6, textAlign: "center" },
  docPhoto: { width: 80, height: 80, borderRadius: 12 },
  issueHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  newIssueBtn: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.techPrimary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  newIssueBtnText: { color: "#fff", fontWeight: "600", fontSize: 12, marginLeft: 6 },
  noIssuesText: { fontSize: 12, color: "#666", marginTop: 6 },
  qcCard: { backgroundColor: "#f9f9f9", borderRadius: 12, padding: 12, marginTop: 8 },
  qcLabel: { fontSize: 12, fontWeight: "600", color: "#555", marginTop: 6 },
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
  partCard: {
  backgroundColor: "#fff",
  borderRadius: 12,
  padding: 12,
  marginBottom: 10,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  elevation: 2,
  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
},
partCard: { backgroundColor: "#f9f9f9", padding: 12, borderRadius: 8, marginBottom: 8 },
partName: { fontWeight: "700", fontSize: 13, color: "#000" },
partNotes: { fontSize: 12, color: "#555", marginTop: 2 },
installedText: { fontSize: 12, color: "#2E7D32", marginTop: 4 },
installBtn: { marginTop: 4, backgroundColor: Colors.techPrimary, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, alignSelf: "flex-start" },
installBtnText: { color: "#fff", fontWeight: "600", fontSize: 12 },

readyBtn: {
  backgroundColor: Colors.techPrimary,
  paddingVertical: 12,
  borderRadius: 8,
  alignItems: "center",
},
readyBtnText: {
  color: "#fff",
  fontWeight: "700",
  fontSize: 16,
},

});
