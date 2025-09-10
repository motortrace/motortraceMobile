// src/components/InspectionFormModal.tsx
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import Colors from "../constants/colors";

const STATUS_OPTIONS = [
  { key: "GREEN", label: "Checked & OK", color: "#2ecc71" },
  { key: "YELLOW", label: "May Require Attention", color: "#f1c40f" },
  { key: "RED", label: "Immediate Action Needed", color: "#e74c3c" },
];

export default function InspectionFormModal({
  visible,
  onClose,
  inspection,
  setItemStatus,
  setItemNotes,
  attachPhoto,
  onSubmit,
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!inspection) return null;

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const getStatusColor = (status: string) => {
    const opt = STATUS_OPTIONS.find((o) => o.key === status);
    return opt ? opt.color : "#ccc";
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{inspection.template}</Text>
            <TouchableOpacity onPress={onClose}>
              <FeatherIcon name="x" size={22} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1, padding: 16 }}>
            {/* Checklist Items */}
            {inspection.checklistItems.map((item, index) => {
              const expanded = expandedIndex === index;
              return (
                <View key={index} style={styles.checkCard}>
                  {/* Compact Row */}
                  <TouchableOpacity
                    style={styles.row}
                    onPress={() => toggleExpand(index)}
                  >
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: getStatusColor(item.status) },
                      ]}
                    />
                    <Text style={styles.itemTitle}>{item.item}</Text>
                    <FeatherIcon
                      name={expanded ? "chevron-up" : "chevron-down"}
                      size={18}
                      color="#666"
                    />
                  </TouchableOpacity>

                  {/* Expanded Content */}
                  {expanded && (
                    <View style={styles.expanded}>
                      {/* Status */}
                      <Text style={styles.sectionLabel}>Status</Text>
                      {STATUS_OPTIONS.map((opt) => {
                        const selected = item.status === opt.key;
                        return (
                          <TouchableOpacity
                            key={opt.key}
                            style={styles.radioRow}
                            onPress={() => setItemStatus(index, opt.key)}
                          >
                            <View
                              style={[
                                styles.radioOuter,
                                selected && { borderColor: opt.color },
                              ]}
                            >
                              {selected && (
                                <View
                                  style={[
                                    styles.radioInner,
                                    { backgroundColor: opt.color },
                                  ]}
                                />
                              )}
                            </View>
                            <Text style={styles.radioLabel}>{opt.label}</Text>
                          </TouchableOpacity>
                        );
                      })}

                      {/* Notes */}
                      <Text style={styles.sectionLabel}>Notes</Text>
                      <TextInput
                        style={styles.notesInput}
                        value={item.notes}
                        placeholder="Add notes..."
                        placeholderTextColor="#aaa"
                        multiline
                        onChangeText={(text) => setItemNotes(index, text)}
                      />

                      {/* Attachments */}
{/* Attachments */}
<Text style={styles.sectionLabel}>Attachments</Text>
<ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
  {/* Add Photo Button first */}
  <TouchableOpacity
    style={styles.addPhotoDotted}
    onPress={() => attachPhoto(index)}
  >
    <FeatherIcon name="camera" size={20} color={Colors.techPrimary} />
    <Text style={styles.addPhotoText}>Add Photo</Text>
  </TouchableOpacity>

  {/* Existing Photos */}
  {item.photos?.map((uri, i) => (
    <Image key={i} source={{ uri }} style={styles.attachment} />
  ))}
</ScrollView>

                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>

          {/* Submit */}
          <TouchableOpacity style={styles.submitBtn} onPress={onSubmit}>
            <Text style={styles.submitText}>Submit Inspection</Text>
          </TouchableOpacity>
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
  },
  title: { fontSize: 16, fontWeight: "700", color: "#111" },
  checkCard: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    justifyContent: "space-between",
  },
  statusDot: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
  itemTitle: { flex: 1, fontSize: 14, fontWeight: "600", color: "#222" },
  expanded: { paddingHorizontal: 14, paddingBottom: 14 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
    marginBottom: 6,
    marginTop: 10,
  },
  radioRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#bbb",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  radioInner: { width: 10, height: 10, borderRadius: 5 },
  radioLabel: { fontSize: 13, color: "#333" },
  notesInput: {
    backgroundColor: "#fafafa",
    borderRadius: 8,
    padding: 8,
    fontSize: 13,
    minHeight: 60,
    textAlignVertical: "top",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  attachBox: {
    borderWidth: 1,
    borderColor: "#bbb",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 10,
    flexDirection: "row",
    marginBottom: 6,
  },
  attachment: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
  },
  addAttachBtn: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  addAttachText: { fontSize: 10, color: "#666", marginTop: 2 },
  submitBtn: {
    backgroundColor: Colors.techPrimary,
    padding: 14,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  addPhotoDotted: {
  width: 80,
  height: 80,
  borderRadius: 8,
  borderWidth: 1,
  borderStyle: "dashed",
  borderColor: "#ccc",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 8,
  backgroundColor: "#fafafa",
},
addPhotoText: {
  fontSize: 10,
  color: Colors.techPrimary,
  marginTop: 2,
  textAlign: "center",
},
attachment: {
  width: 80,
  height: 80,
  borderRadius: 8,
  marginRight: 8,
},

});
