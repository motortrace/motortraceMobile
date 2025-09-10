// src/components/InspectionViewModal.tsx
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";

const STATUS_OPTIONS = {
  GREEN: { label: "Checked & OK", color: "#2ecc71" },
  YELLOW: { label: "May Require Attention", color: "#f1c40f" },
  RED: { label: "Immediate Action Needed", color: "#e74c3c" },
};

export default function InspectionViewModal({ visible, onClose, inspection }) {
  if (!inspection) return null;

  const overallStatus = inspection.completed ? "Completed" : "Pending";

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Inspection Report</Text>
            <TouchableOpacity onPress={onClose}>
              <FeatherIcon name="x" size={22} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            {/* Report Summary */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{inspection.template}</Text>
              <Text style={styles.meta}>Work Order: {inspection.workOrderId}</Text>
              <Text style={styles.meta}>
                Vehicle: {inspection.carModel} ({inspection.carPlate})
              </Text>
              <Text style={styles.meta}>Inspector: Tech-123</Text>
              <View style={[styles.statusBadge, 
                { backgroundColor: inspection.completed ? "rgba(46,204,113,0.1)" : "rgba(241,196,15,0.1)" }
              ]}>
                <Text style={{ color: inspection.completed ? "#2ecc71" : "#f39c12", fontWeight: "600" }}>
                  {overallStatus}
                </Text>
              </View>
            </View>

            {/* Checklist */}
            <Text style={styles.sectionTitle}>Checklist Items</Text>
            {inspection.checklistItems.map((item, index) => {
              const status = STATUS_OPTIONS[item.status] || null;
              return (
                <View key={index} style={styles.card}>
                  {/* Item Row */}
                  <View style={styles.row}>
                    <Text style={styles.itemTitle}>{item.item}</Text>
                    {status && (
                      <View style={styles.statusRow}>
                        <View
                          style={[styles.statusDot, { backgroundColor: status.color }]}
                        />
                        <Text style={styles.statusLabel}>{status.label}</Text>
                      </View>
                    )}
                  </View>

                  {/* Notes */}
                  {item.notes ? (
                    <View style={{ marginTop: 8 }}>
                      <Text style={styles.sectionLabel}>Notes</Text>
                      <Text style={styles.notesText}>{item.notes}</Text>
                    </View>
                  ) : null}

                  {/* Photos */}
                  {item.photos?.length > 0 && (
                    <View style={{ marginTop: 8 }}>
                      <Text style={styles.sectionLabel}>Attachments</Text>
                      <View style={styles.attachmentGrid}>
                        {item.photos.map((uri, i) => (
                          <Image key={i} source={{ uri }} style={styles.attachment} />
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              );
            })}

            {/* Report Actions */}
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.actionBtn}>
                <FeatherIcon name="printer" size={18} color="#444" />
                <Text style={styles.actionText}>Print</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <FeatherIcon name="mail" size={18} color="#444" />
                <Text style={styles.actionText}>Email</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 14,
  },
  modal: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fafafa",
  },
  title: { fontSize: 18, fontWeight: "700", color: "#111" },

  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#222", marginBottom: 6 },
  meta: { fontSize: 13, color: "#666", marginBottom: 3 },

  statusBadge: {
    alignSelf: "flex-start",
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  itemTitle: { fontSize: 14, fontWeight: "600", color: "#222", flex: 1 },

  statusRow: { flexDirection: "row", alignItems: "center" },
  statusDot: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },
  statusLabel: { fontSize: 12, color: "#444" },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
    marginBottom: 4,
  },
  notesText: { fontSize: 13, color: "#333", lineHeight: 18 },

  attachmentGrid: { flexDirection: "row", flexWrap: "wrap" },
  attachment: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  actionBtn: { alignItems: "center" },
  actionText: { fontSize: 12, marginTop: 4, color: "#444" },
});
