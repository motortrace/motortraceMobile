import React, { useState } from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker"; // npm i @react-native-picker/picker
import Colors from "../constants/colors";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import FeatherIcon from "react-native-vector-icons/Feather"; // make sure to import

interface AddIssueModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (issue: { issueType: string; description: string; severity: string; photo?: any }) => void;
}

export default function AddIssueModal({ visible, onClose, onSubmit }: AddIssueModalProps) {
  const [issueType, setIssueType] = useState("");
  const [severity, setSeverity] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<any>(null);

  const pickPhoto = () => {
    Alert.alert(
      "Attach Photo",
      "Choose a method",
      [
        {
          text: "Camera",
          onPress: () => 
            launchCamera({ mediaType: "photo" }, (res) => {
              if (res.assets && res.assets.length > 0) setPhoto(res.assets[0]);
              else if (res.errorCode) Alert.alert("Error", res.errorMessage || "Camera error");
            }),
        },
        {
          text: "Gallery",
          onPress: () =>
            launchImageLibrary({ mediaType: "photo" }, (res) => {
              if (res.assets && res.assets.length > 0) setPhoto(res.assets[0]);
              else if (res.errorCode) Alert.alert("Error", res.errorMessage || "Gallery error");
            }),
        },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const handleSubmit = () => {
    if (!issueType || !severity || !description) {
      Alert.alert("Validation", "Please fill all required fields.");
      return;
    }

    onSubmit({ issueType, severity, description, photo });

    // Reset fields
    setIssueType("");
    setSeverity("");
    setDescription("");
    setPhoto(null);

    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Add New Issue</Text>

          <Text style={styles.label}>Issue Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={issueType}
              onValueChange={(val) => setIssueType(val)}
              style={styles.pickerInner}
              dropdownIconColor={Colors.techPrimary}
            >
              <Picker.Item label="Select Issue" value="" />
              <Picker.Item label="Parts Damage" value="PARTSDAMAGE" />
              <Picker.Item label="Delay" value="DELAY" />
              <Picker.Item label="Other" value="OTHER" />
            </Picker>
          </View>

          <Text style={styles.label}>Severity</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={severity}
              onValueChange={(val) => setSeverity(val)}
              style={styles.pickerInner}
              dropdownIconColor={Colors.techPrimary}
            >
              <Picker.Item label="Select Severity" value="" />
              <Picker.Item label="LOW" value="LOW" />
              <Picker.Item label="MEDIUM" value="MEDIUM" />
              <Picker.Item label="HIGH" value="HIGH" />
            </Picker>
          </View>

          <Text style={styles.label}>Description</Text>
          <TextInput
            placeholder="Describe the issue"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            multiline
          />

          {/* Photo Section */}
<Text style={styles.label}>Photo</Text>
<TouchableOpacity style={styles.addPhotoDotted} onPress={pickPhoto}>
  {photo ? (
    <Image source={{ uri: photo.uri }} style={styles.photoPreview} />
  ) : (
    <>
      <FeatherIcon name="camera" size={24} color={Colors.techPrimary} />
      <Text style={styles.addPhotoText}>Add Photo</Text>
    </>
  )}
</TouchableOpacity>

          {/* Action Buttons */}
          <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 12 }}>
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
  },
  modal: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 12,
    padding: 16,
  },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  label: { fontSize: 13, fontWeight: "600", marginTop: 8 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 6, padding: 8, marginTop: 4, minHeight: 60, textAlignVertical: "top" },
  cancelBtn: { backgroundColor: "#eee", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, marginRight: 8 },
  cancelText: { color: "#555" },
  submitBtn: { backgroundColor: Colors.techPrimary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  submitText: { color: "#fff" },
  pickerContainer: { borderWidth: 1, borderColor: "#ddd", borderRadius: 6, marginTop: 4, backgroundColor: "#fafafa", overflow: "hidden" },
  pickerInner: { height: 50, color: "#000" },
  photoBtn: { marginTop: 10 },
  photoBtnText: { color: Colors.techPrimary, fontWeight: "600" },
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
});
