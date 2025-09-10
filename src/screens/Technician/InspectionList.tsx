// src/screens/Technician/InspectionList.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import Colors from "../../constants/colors";
import InspectionFormModal from "../../components/InspectionFormModal";
import { Alert } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";



export default function InspectionListScreen({ navigation }) {
  const [tab, setTab] = useState("All");
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [currentInspection, setCurrentInspection] = useState(null);

  // ✅ useState for inspections
  const [inspections, setInspections] = useState([
    {
      id: "Inspection-001",
      workOrderId: "WO-20241201-001",
      template: "Brake System Inspection",
      carModel: "Toyota Corolla 2023",
      carPlate: "ABC-1234",
      completed: true,
      checklistItems: [
        { item: "Brake pedal feel", status: "GREEN", notes: "Firm pedal", photos: [] },
        { item: "Brake fluid level", status: "GREEN", notes: "At max line", photos: [] },
        { item: "Brake pad thickness", status: "YELLOW", notes: "Front pads 3mm", photos: [] },
        { item: "Brake rotor condition", status: "RED", notes: "Front rotors warped", photos: [require("../../assets/images/warpedRotors.png")] },
        { item: "Brake line integrity", status: "GREEN", notes: "No leaks", photos: [] },
      ],
    },
    {
      id: "Inspection-002",
      workOrderId: "WO-20241201-001",
      template: "Suspension Inspection",
      carModel: "Toyota Corolla 2023",
      carPlate: "ABC-1234",
      completed: true,
      checklistItems: [
        { item: "Shock absorber condition", status: "GREEN", notes: "Good", photos: [] },
      ],
    },
    {
      id: "Inspection-003",
      workOrderId: "WO-20241201-002",
      template: "Tire Condition Check",
      carModel: "Honda Civic 2022",
      carPlate: "XYZ-5678",
      completed: false,
      checklistItems: [
        { item: "Tire tread depth", status: "", notes: "", photos: [] },
      ],
    },
  ]);

  const filteredInspections =
    tab === "All"
      ? inspections
      : inspections.filter((insp) =>
          tab === "Completed" ? insp.completed : !insp.completed
        );

  const openFormModal = (inspection) => {
    setCurrentInspection({
      ...inspection,
      checklistItems: inspection.checklistItems.map((c) => ({
        ...c,
        photos: c.photos ?? [],
      })),
    });
    setFormModalVisible(true);
  };

  const setItemStatus = (index: number, status: string) => {
    setCurrentInspection((prev) => {
      if (!prev) return prev;
      const updated = { ...prev };
      updated.checklistItems = [...updated.checklistItems];
      updated.checklistItems[index] = {
        ...updated.checklistItems[index],
        status,
      };
      return updated;
    });
  };

  const setItemNotes = (index: number, notes: string) => {
    setCurrentInspection((prev) => {
      if (!prev) return prev;
      const updated = { ...prev };
      updated.checklistItems = [...updated.checklistItems];
      updated.checklistItems[index] = {
        ...updated.checklistItems[index],
        notes,
      };
      return updated;
    });
  };

const attachPhoto = (index: number) => {
  Alert.alert("Add Photo", "Choose an option", [
    {
      text: "Take Photo",
      onPress: () => {
        launchCamera({ mediaType: "photo", quality: 0.7 }, (response) => {
          if (response.didCancel || response.errorCode) return;
          const uri = response.assets?.[0]?.uri;
          if (uri) savePhoto(index, uri);
        });
      },
    },
    {
      text: "Choose from Gallery",
      onPress: () => {
        launchImageLibrary({ mediaType: "photo", quality: 0.7 }, (response) => {
          if (response.didCancel || response.errorCode) return;
          const uri = response.assets?.[0]?.uri;
          if (uri) savePhoto(index, uri);
        });
      },
    },
    { text: "Cancel", style: "cancel" },
  ]);
};

const savePhoto = (index: number, uri: string) => {
  setCurrentInspection((prev) => {
    if (!prev) return prev;
    const updated = { ...prev };
    updated.checklistItems = [...updated.checklistItems];
    updated.checklistItems[index] = {
      ...updated.checklistItems[index],
      photos: [...(updated.checklistItems[index].photos || []), uri],
    };
    return updated;
  });
};


  const handleSubmit = () => {
    if (!currentInspection) return;
    console.log("Final inspection data:", currentInspection);

    // ✅ update inspections array
    setInspections((prev) =>
      prev.map((insp) =>
        insp.id === currentInspection.id
          ? { ...currentInspection, completed: true }
          : insp
      )
    );

    setFormModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={Colors.techPrimary} barStyle="light-content" />

      {/* Header */}
      <View style={styles.topContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Work Order Inspections</Text>
          <FeatherIcon name="clipboard" size={22} color="#fff" />
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          {["All", "Pending", "Completed"].map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tabBtn, tab === t && { backgroundColor: "#fff" }]}
              onPress={() => setTab(t)}
            >
              <Text
                style={[
                  styles.tabText,
                  tab === t && { color: Colors.techPrimary, fontWeight: "600" },
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Inspection List */}
      <ScrollView style={{ flex: 1, marginTop: 12, paddingBottom: 80 }}>
        {filteredInspections.map((insp) => (
          <View key={insp.id} style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.templateText}>{insp.template}</Text>
              <Text style={styles.metaText}>WO: {insp.workOrderId}</Text>
              <Text style={styles.metaText}>
                {insp.carModel} • {insp.carPlate}
              </Text>
            </View>
            <View style={styles.rightCol}>
              <TouchableOpacity
                style={[
                  styles.statusCapsule,
                  {
                    backgroundColor: insp.completed
                      ? "rgba(46, 204, 113,0.15)"
                      : "rgba(241, 196, 15,0.15)",
                  },
                ]}
                onPress={() =>
                  insp.completed
                    ? navigation.navigate("InspectionReport", { inspection: insp })
                    : openFormModal(insp)
                }
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: insp.completed ? "#2ecc71" : "#f39c12" },
                  ]}
                >
                  {insp.completed ? "View" : "Start"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Form Modal */}
      <InspectionFormModal
        visible={formModalVisible}
        onClose={() => setFormModalVisible(false)}
        inspection={currentInspection}
        setItemStatus={setItemStatus}
        setItemNotes={setItemNotes}
        attachPhoto={attachPhoto}
        onSubmit={handleSubmit}
      />

      {/* Bottom Navigation */}
<View style={styles.bottomNav}>
  <TouchableOpacity
    style={styles.navItem}
    onPress={() => navigation?.navigate?.("Home")}
  >
    <FeatherIcon
      name="home"
      size={22}
      color="#444"
    />
    <Text style={styles.navLabel}>Home</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.navItem}
    onPress={() => navigation?.navigate?.("WorkOrderList")}
  >
    <FeatherIcon
      name="briefcase"
      size={22}
      color="#444"
    />
    <Text style={styles.navLabel}>Work Orders</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.navItem}
    onPress={() => navigation?.navigate?.("InspectionList")}
  >
    <FeatherIcon
      name="clipboard"
      size={22}
      color={Colors.techPrimary} // Active tab color
    />
    <Text style={styles.navLabelActive}>Inspections</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.navItem}
    onPress={() => navigation?.navigate?.("Profile")}
  >
    <FeatherIcon
      name="user"
      size={22}
      color="#444"
    />
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
    elevation: 5,
    marginBottom: 10,
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  tabsRow: { flexDirection: "row", marginTop: 20, justifyContent: "space-around" },
  tabBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  tabText: { color: "#fff", fontSize: 13 },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 14,
    marginHorizontal: 18,
    marginBottom: 20,
    borderRadius: 12,
    elevation: 2,
    justifyContent: "space-between",
  },
  templateText: { fontSize: 14, fontWeight: "600", color: "#000" },
  metaText: { fontSize: 12, color: "#555", marginTop: 4 },
  rightCol: { alignItems: "flex-end", justifyContent: "center" },
  statusCapsule: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  statusText: { fontSize: 12, fontWeight: "600" },
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
});
