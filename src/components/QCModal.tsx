// src/components/QCModal.tsx
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../constants/colors";

interface QCModalProps {
  visible: boolean;
  onClose: () => void;
  // Technician is derived server-side from the authenticated user; modal does not collect verifiedBy
  onSubmit: (data: { method: string; notes: string }) => void;
}

export default function QCModal({ visible, onClose, onSubmit }: QCModalProps) {
  const [method, setMethod] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    onSubmit({ method, notes });
    setMethod("");
    setNotes("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Quality Control</Text>
          <ScrollView>
            {/* Verified By removed: backend uses authenticated technician as inspector */}

            {/* Method */}
            <Text style={styles.label}>Verification Method</Text>
            <View style={styles.dropdownWrapper}>
              <Picker
                selectedValue={method}
                onValueChange={(val) => setMethod(val)}
              >
                <Picker.Item label="Select Method" value="" />
                <Picker.Item label="Visual Inspection" value="Visual Inspection" />
                <Picker.Item label="Road Test" value="Road Test" />
                <Picker.Item label="Diagnostic Scan" value="Diagnostic Scan" />
                <Picker.Item label="Torque Check" value="Torque Check" />
              </Picker>
            </View>

            {/* Notes */}
            <Text style={styles.label}>Verification Notes</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Enter notes"
              value={notes}
              onChangeText={setNotes}
              multiline
            />
          </ScrollView>

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: 16,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    maxHeight: "80%",
  },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 12, textAlign: "center" },
  label: { fontSize: 13, fontWeight: "600", marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
    fontSize: 13,
    backgroundColor: "#fafafa",
  },
  dropdownWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginTop: 4,
    backgroundColor: "#fafafa",
  },
  btnRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 12 },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#eee",
    borderRadius: 6,
    marginRight: 8,
  },
  cancelText: { color: "#555", fontWeight: "600" },
  submitBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: Colors.techPrimary,
    borderRadius: 6,
  },
  submitText: { color: "#fff", fontWeight: "600" },
});
