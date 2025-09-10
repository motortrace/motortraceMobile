// src/screens/Technician/TaskDetails.tsx
import React, { useState } from "react";
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

export default function TaskDetailsScreen({ navigation, route }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [qcModalVisible, setQcModalVisible] = useState(false);
  const [qcData, setQcData] = useState(null); // store verification info

const task = route.params?.task || {
  id: "Task-001",
  workOrderId: "WO-20241201-001",
  description: "Remove front wheels",
  status: "COMPLETED",
  progress: "0.5/2 h",
  carModel: "Toyota Corolla 2023",
  carPlate: "ABC-1234",
  image: require("../../assets/images/car.png"),
};


  const [parts, setParts] = useState([
    { name: "Front Wheel", installed: true, date: "2025-09-06" },
    { name: "Brake Pads", installed: false, date: "" },
  ]);

  const [documents, setDocuments] = useState([
    { type: "Before", image: "https://via.placeholder.com/80" },
    { type: "After", image: "https://via.placeholder.com/80" },
  ]);

  const [issues, setIssues] = useState([
    {
      workOrderId: "WO-20241201-001",
      taskId: "Task-004",
      technicianId: "tech-789",
      issueType: "PARTSDAMAGE",
      description: "Front rotors are severely warped and need replacement",
      severity: "HIGH",
      reportedAt: "2024-12-01T17:45:00Z",
      status: "REPORTED",
      requiresApproval: true,
      estimatedAdditionalCost: 160.0,
    },
  ]);

  const handleInstall = (index: number) => {
    const updated = [...parts];
    updated[index].installed = true;
    updated[index].date = new Date().toISOString().split("T")[0];
    setParts(updated);
  };

  const handleAddIssue = (issue) => {
    const newEntry = {
      ...issue,
      workOrderId: task.workOrderId,
      taskId: task.id,
      technicianId: "tech-123",
      reportedAt: new Date().toISOString(),
      status: "REPORTED",
      requiresApproval: false,
      estimatedAdditionalCost: 0,
    };
    setIssues([...issues, newEntry]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={Colors.techPrimary} barStyle="light-content" />

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Back to List */}
        <TouchableOpacity style={styles.backRow} onPress={() => navigation.goBack()}>
          <FeatherIcon name="arrow-left" size={18} color={Colors.techPrimary} />
          <Text style={styles.backText}>Back to Tasks</Text>
        </TouchableOpacity>

        {/* Task Details */}
        <View style={styles.section}>
          <View style={styles.detailsCard}>
            <Image source={task.image} style={styles.carImage} resizeMode="contain" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.taskId}>{task.id}</Text>
              <Text style={styles.detailText}>{task.description}</Text>
              <Text style={styles.detailText}>{task.workOrderId}</Text>
              <Text style={styles.detailText}>{task.carModel}</Text>
              <Text style={styles.detailText}>{task.carPlate}</Text>
            </View>
            <View style={styles.statusTag}>
              <Text style={styles.statusText}>{task.status}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.startBtn}>
            <Text style={styles.startBtnText}>Start Now</Text>
          </TouchableOpacity>
        </View>

        {/* Part Installation */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Part Installation</Text>
            {parts.map((part, idx) => (
              <View key={idx} style={styles.partRow}>
                <Text style={styles.partName}>{part.name}</Text>
                <View style={{ alignItems: "flex-end" }}>
                  {part.installed ? (
                    <Text style={styles.installedText}>Installed: {part.date}</Text>
                  ) : (
                    <TouchableOpacity style={styles.installBtn} onPress={() => handleInstall(idx)}>
                      <Text style={styles.installBtnText}>Install Now</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Documentation */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Documentation</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {documents.map((doc, idx) => (
                <View key={idx} style={styles.docCard}>
                  <Image
                    source={{ uri: doc.image }}
                    style={{ width: 80, height: 80, borderRadius: 8 }}
                    resizeMode="cover"
                  />
                  <Text style={styles.docLabel}>{doc.type}</Text>
                </View>
              ))}
              <TouchableOpacity style={styles.addDoc}>
                <FeatherIcon name="plus" size={28} color="#888" />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>

        {/* Issues */}
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.issueHeader}>
              <Text style={styles.sectionTitle}>Issues</Text>
              <TouchableOpacity style={styles.newIssueBtn} onPress={() => setShowModal(true)}>
                <FeatherIcon name="plus" size={16} color="#fff" />
                <Text style={styles.newIssueBtnText}>New Issue</Text>
              </TouchableOpacity>
            </View>

            {issues.map((issue, idx) => (
              <TouchableOpacity
                key={idx}
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
            ))}
          </View>
        </View>

        {/* Quality Control Section */}
{task.status === "COMPLETED" && (
  <View style={styles.section}>
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Quality Control & Sign-off</Text>

      {/* Show QC Data if exists */}
      {qcData ? (
        <View style={styles.qcCard}>
          <Text style={styles.qcLabel}>Verified By:</Text>
          <Text style={styles.qcValue}>{qcData.verifiedBy}</Text>

          <Text style={styles.qcLabel}>Verification Method:</Text>
          <Text style={styles.qcValue}>{qcData.method}</Text>

          <Text style={styles.qcLabel}>Verification Notes:</Text>
          <Text style={styles.qcValue}>{qcData.notes}</Text>

          <Text style={styles.qcLabel}>Verified At:</Text>
          <Text style={styles.qcValue}>{new Date().toLocaleString()}</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.startBtn, { alignSelf: "flex-start" }]}
          onPress={() => setQcModalVisible(true)}
        >
          <Text style={styles.startBtnText}>Complete QC</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
)}
      </ScrollView>

      {/* Add Issue Modal */}
      <AddIssueModal visible={showModal} onClose={() => setShowModal(false)} onSubmit={handleAddIssue} />

      {/* Issue Details Modal */}
      <IssueDetailsModal
        visible={showIssueModal}
        onClose={() => setShowIssueModal(false)}
        issue={selectedIssue}
      />

      {/* QC Modal */}
<QCModal
  visible={qcModalVisible}
  onClose={() => setQcModalVisible(false)}
  onSubmit={(data) => setQcData({ ...data, verifiedAt: new Date() })}
/>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
          <FeatherIcon name="home" size={22} color={Colors.techPrimary} />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <FeatherIcon name="check-square" size={22} color={Colors.techPrimary} />
          <Text style={styles.navLabelActive}>Tasks</Text>
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

  backRow: { flexDirection: "row", alignItems: "center", marginTop: 15, marginLeft: 18 },
  backText: { marginLeft: 6, color: Colors.techPrimary, fontWeight: "600" },

  section: { marginTop: 20 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
    marginHorizontal: 18,
  },

  detailsCard: {
    flexDirection: "row",
    backgroundColor: Colors.techPrimary,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 18,
    alignItems: "center",
    position: "relative",
  },
  carImage: { width: 90, height: 90, borderRadius: 8 },
  taskId: { fontSize: 16, fontWeight: "700", color: "#fff" },
  detailText: { fontSize: 12, color: "#fff", marginTop: 4 },

  statusTag: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  statusText: { color: "#fff", fontSize: 11, fontWeight: "700" },

  startBtn: {
    backgroundColor: Colors.techPrimary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    marginRight: 18,
    marginTop: 10,
    alignSelf: "flex-end",
  },
  startBtnText: { color: "#fff", fontWeight: "700" },

  partRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fafafa",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
  },
  partName: { fontSize: 14, fontWeight: "600", color: "#000" },
  installedText: { fontSize: 12, color: "green", fontWeight: "600" },

  installBtn: {
    backgroundColor: Colors.techPrimary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  installBtnText: { color: "#fff", fontSize: 12, fontWeight: "600" },

  docCard: { marginLeft: 18, alignItems: "center" },
  docLabel: { fontSize: 12, marginTop: 4, color: "#000" },
  addDoc: {
    width: 80,
    height: 80,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "dashed",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  issueHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
  },
  newIssueBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.techPrimary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  newIssueBtnText: { color: "#fff", fontWeight: "600", fontSize: 12, marginLeft: 6 },

  issueForm: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 13,
    backgroundColor: "#fafafa",
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 6,
    backgroundColor: "#eee",
  },
  cancelBtnText: { color: "#555", fontWeight: "600", fontSize: 12 },
  reportBtn: {
    backgroundColor: Colors.techPrimary,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 6,
  },
  reportBtnText: { color: "#fff", fontWeight: "600", fontSize: 12 },

  issueCard: {
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    padding: 12,
    borderRadius: 8,
    elevation: 2,
    position: "relative",
  },
  issueTitle: { fontWeight: "700", fontSize: 13, color: "#000" },
  issueDesc: { fontSize: 12, color: "#333", marginTop: 4 },
  issueMeta: { fontSize: 11, color: "#666", marginTop: 6 },

  statusBadge: {
    position: "absolute",
    bottom: 8,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusBadgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },

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
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 18,
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: "#656565ff",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  qcCard: {
  backgroundColor: "#f9f9f9",
  borderRadius: 12,
  padding: 12,
  marginBottom: 12,
  elevation: 2,
},
qcLabel: {
  fontSize: 12,
  fontWeight: "600",
  color: "#555",
  marginTop: 6,
},
qcValue: {
  fontSize: 14,
  fontWeight: "500",
  color: "#000",
  marginTop: 2,
},
});
