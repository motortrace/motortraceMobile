import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import Colors from "../constants/colors";

interface IssueDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  issue: {
    workOrderId: string;
    taskId: string;
    technicianId: string;
    issueType: string;
    description: string;
    severity: string;
    reportedAt: string;
    status: string;
    requiresApproval: boolean;
    estimatedAdditionalCost: number;
    photo?: { uri: string }; // photo optional
  } | null;
}

export default function IssueDetailsModal({ visible, onClose, issue }: IssueDetailsModalProps) {
  if (!issue) return null;

  const formatDate = (iso: string) => new Date(iso).toLocaleString();

  const severityColors = {
    LOW: "#2ecc71",
    MEDIUM: "#f1c40f",
    HIGH: "#e74c3c",
  };

  const statusColors = {
    REPORTED: "#f39c12",
    RESOLVED: "#2ecc71",
    IN_PROGRESS: "#3498db",
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Issue Details</Text>
          <ScrollView style={{ maxHeight: 350 }}>
            {[ 
              { label: "Issue Type", value: issue.issueType },
              { label: "Description", value: issue.description },
              { label: "Reported At", value: formatDate(issue.reportedAt) },
              { label: "Requires Approval", value: issue.requiresApproval ? "Yes" : "No" },
              { label: "Estimated Additional Cost", value: `LKR ${issue.estimatedAdditionalCost.toFixed(2)}` },
            ].map((item, idx) => (
              <View key={idx} style={styles.cardRow}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.value}>{item.value}</Text>
              </View>
            ))}

            {/* Severity Row */}
            <View style={[styles.cardRow, styles.badgeRow]}>
              <Text style={styles.label}>Severity</Text>
              <View style={[styles.badge, { backgroundColor: severityColors[issue.severity] || "#ccc" }]}>
                <Text style={styles.badgeText}>{issue.severity}</Text>
              </View>
            </View>

            {/* Status Row */}
            <View style={[styles.cardRow, styles.badgeRow]}>
              <Text style={styles.label}>Status</Text>
              <View style={[styles.badge, { backgroundColor: statusColors[issue.status] || "#888" }]}>
                <Text style={styles.badgeText}>{issue.status}</Text>
              </View>
            </View>

            {/* Photo Section */}
            {issue.photo && (
              <View style={{ marginTop: 12, alignItems: "center" }}>
                <Text style={{ fontSize: 13, fontWeight: "600", marginBottom: 6 }}>Attached Photo</Text>
                <Image
                  source={{ uri: issue.photo.uri }}
                  style={{ width: 200, height: 200, borderRadius: 12 }}
                  resizeMode="cover"
                />
              </View>
            )}
          </ScrollView>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 16,
    padding: 16,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  cardRow: {
    backgroundColor: "#fafafa",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000ff",
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: "400",
    color: "#797979ff",
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  closeBtn: {
    backgroundColor: Colors.techPrimary,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 12,
    alignItems: "center",
  },
  closeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
