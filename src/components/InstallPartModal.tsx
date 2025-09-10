import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Alert } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import FeatherIcon from "react-native-vector-icons/Feather"; 
import Colors from "../constants/colors";

export default function InstallPartModal({ visible, part, onClose, onSubmit }) {
  const [quantity, setQuantity] = useState(0);
  const [photo, setPhoto] = useState(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (part) {
      setQuantity(part.quantityUsed || 0);
      setPhoto(part.photo || null);
      setNotes(part.notes || "");
    }
  }, [part]);

  if (!part) return null;

  const handlePickPhoto = () => {
    Alert.alert("Attach Photo", "Choose method", [
      {
        text: "Camera",
        onPress: () =>
          launchCamera({ mediaType: "photo" }, (res) => {
            if (res.didCancel || res.errorCode) return;
            if (res.assets?.length > 0) {
              setPhoto({ uri: res.assets[0].uri, type: "PART" });
            }
          }),
      },
      {
        text: "Gallery",
        onPress: () =>
          launchImageLibrary({ mediaType: "photo" }, (res) => {
            if (res.didCancel || res.errorCode) return;
            if (res.assets?.length > 0) {
              setPhoto({ uri: res.assets[0].uri, type: "PART" });
            }
          }),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleIncrement = () => {
    if (quantity < part.quantity) {
      setQuantity((prev) => prev + 1);
    } else {
      Alert.alert("Limit reached", `You cannot install more than ${part.quantity} units.`);
    }
  };

  const handleDecrement = () => setQuantity((prev) => (prev > 0 ? prev - 1 : 0));

  const handleSubmit = () => {
    const updated = {
      ...part,
      quantityUsed: quantity,
      notes,
      photo,
    };

    // When submitting, mark the photo as PART so Documents section can read it
    onSubmit(updated);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Install Part: {part.name}</Text>

          {/* Quantity Selector */}
          <Text style={styles.label}>Quantity Used</Text>
          <View style={styles.quantityRow}>
            <TouchableOpacity style={styles.qtyBtn} onPress={handleDecrement}>
              <Text style={styles.qtyText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qtyDisplay}>{quantity}</Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={handleIncrement}>
              <Text style={styles.qtyText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.helperText}>Available: {part.quantity}</Text>

          {/* Notes */}
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Enter notes..."
            value={notes}
            onChangeText={setNotes}
            multiline
          />

          {/* Photo */}
<Text style={styles.label}>Photo</Text>
<TouchableOpacity style={styles.addPhotoDotted} onPress={handlePickPhoto}>
  {photo ? (
    <Image source={{ uri: photo.uri }} style={styles.photoPreview} />
  ) : (
    <>
      <FeatherIcon name="camera" size={24} color={Colors.techPrimary} />
      <Text style={styles.addPhotoText}>Add Photo</Text>
    </>
  )}
</TouchableOpacity>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitText}>Install</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modal: { width: "90%", backgroundColor: "#fff", padding: 20, borderRadius: 12 },
  title: { fontWeight: "700", fontSize: 16, marginBottom: 12 },
  label: { fontSize: 13, fontWeight: "600", marginTop: 10 },
  helperText: { fontSize: 11, color: "#666", marginTop: 2 },
  quantityRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  qtyBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#eee", borderRadius: 6 },
  qtyText: { fontSize: 16, fontWeight: "700" },
  qtyDisplay: { marginHorizontal: 12, fontSize: 16, fontWeight: "700" },
  notesInput: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 8, marginTop: 4, minHeight: 60, textAlignVertical: "top" },
  addPhotoDotted: {
    marginTop: 6,
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  addPhotoText: { fontSize: 12, color: Colors.techPrimary, marginTop: 4, textAlign: "center" },
  photoPreview: { width: "100%", height: "100%", borderRadius: 8 },
  buttonRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 16 },
  cancelBtn: { marginRight: 10 },
  cancelText: { color: "#555" },
  submitBtn: { backgroundColor: Colors.techPrimary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  submitText: { color: "#fff", fontWeight: "700" },
});
