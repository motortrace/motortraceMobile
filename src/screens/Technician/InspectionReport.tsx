// src/screens/Technician/InspectionReportDetails.tsx
import React from "react";
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
import RNPrint from "react-native-print";
import Mailer from "react-native-mail";

export default function InspectionReportScreen({ navigation, route }) {
  const inspection = route.params?.inspection || {
    id: "INS-001",
    workOrderId: "WO-20241201-001",
    system: "Brake System Inspection",
    carModel: "Toyota Corolla 2023",
    carPlate: "ABC-1234",
    date: "2025-09-05",
    technician: "John Doe",
    checklistItems: [
      { item: "Brake pedal feel", status: "GREEN", notes: "Firm pedal", photos: [] },
      { item: "Brake fluid level", status: "GREEN", notes: "At max line", photos: [] },
      { item: "Brake pad thickness", status: "YELLOW", notes: "Front pads 3mm", photos: [] },
      { item: "Brake rotor condition", status: "RED", notes: "Front rotors warped", photos: [require("../../assets/images/warpedRotors.png")] },
      { item: "Brake line integrity", status: "GREEN", notes: "No leaks", photos: [] },
    ],
  };

  /** Map status codes to friendly labels */
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "GREEN":
        return "Checked & OK";
      case "YELLOW":
        return "Needs Monitoring";
      case "RED":
        return "Requires Attention";
      default:
        return status;
    }
  };

  /** Generate HTML for printing/email */
  const generateReportHTML = () => {
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            h1 { text-align: center; color: #0a3d62; }
            .header { margin-bottom: 20px; }
            .info { font-size: 14px; margin: 4px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 13px; }
            th { background-color: #0a3d62; color: #fff; }
            .status-green { color: green; font-weight: bold; }
            .status-yellow { color: #f5a623; font-weight: bold; }
            .status-red { color: red; font-weight: bold; }
            .photos { margin-top: 10px; }
            .photos img { height: 80px; margin-right: 6px; border-radius: 4px; }
          </style>
        </head>
        <body>
          <h1>Inspection Report</h1>
          <div class="header">
            <p class="info"><b>Inspection ID:</b> ${inspection.id}</p>
            <p class="info"><b>System:</b> ${inspection.system}</p>
            <pa class="info"><b>Work Order:</b> ${inspection.workOrderId}</p>
            <p class="info"><b>Vehicle:</b> ${inspection.carModel} (${inspection.carPlate})</p>
            <p class="info"><b>Technician:</b> ${inspection.technician}</p>
            <p class="info"><b>Date:</b> ${inspection.date}</p>
          </div>

          <table>
            <tr>
              <th>Item</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Photos</th>
            </tr>
            ${inspection.checklistItems
              .map(
                (item) => `
              <tr>
                <td>${item.item}</td>
                <td class="status-${item.status.toLowerCase()}">${getStatusLabel(item.status)}</td>
                <td>${item.notes}</td>
                <td>
                  ${item.photos
                    .map(
                      (photo) =>
                        `<img src="${photo}" style="height:50px;width:50px;" />`
                    )
                    .join("")}
                </td>
              </tr>
            `
              )
              .join("")}
          </table>
        </body>
      </html>
    `;
  };

  /** Print function */
  const handlePrint = async () => {
    try {
      await RNPrint.print({ html: generateReportHTML() });
    } catch (e) {
      Alert.alert("Print Error", e.message);
    }
  };

  /** Email function */
  const handleEmail = () => {
    Mailer.mail(
      {
        subject: `Inspection Report - ${inspection.system}`,
        recipients: [], // you can prefill recipient here
        body: generateReportHTML(),
        isHTML: true,
      },
      (error, event) => {
        if (error) {
          Alert.alert("Email Error", "Could not send email. Please try again.");
        }
      }
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={Colors.techPrimary} barStyle="light-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Back */}
        <TouchableOpacity style={styles.backRow} onPress={() => navigation.goBack()}>
          <FeatherIcon name="arrow-left" size={18} color={Colors.techPrimary} />
          <Text style={styles.backText}>Back to Inspections</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.section}>
          <View style={styles.detailsCard}>
            <Image source={require("../../assets/images/car.png")} style={styles.carImage} resizeMode="contain" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.taskId}>{inspection.id}</Text>
              <Text style={styles.detailText}>{inspection.system}</Text>
              <Text style={styles.detailText}>{inspection.workOrderId}</Text>
              <Text style={styles.detailText}>{inspection.carModel}</Text>
              <Text style={styles.detailText}>{inspection.carPlate}</Text>
              <Text style={styles.detailText}>By: {inspection.technician}</Text>
            </View>
            <View style={styles.statusTag}>
              <Text style={styles.statusText}>Completed</Text>
            </View>
          </View>
        </View>

        {/* Checklist */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Inspection Checklist</Text>
            {inspection.checklistItems.map((item, idx) => (
              <View key={idx} style={styles.itemCard}>
                <View style={styles.itemRow}>
                  <Text style={styles.itemName}>{item.item}</Text>
<View
  style={[
    styles.statusBadge,
    { backgroundColor: getStatusColor(item.status) },
  ]}
>
  <Text style={[styles.statusBadgeText, { color: getStatusTextColor(item.status) }]}>
    {getStatusLabel(item.status)}
  </Text>
</View>
                </View>
                <Text style={styles.itemNotes}>{item.notes}</Text>
                {item.photos.length > 0 && (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginTop: 8 }}
                  >
                    {item.photos.map((photo, pIdx) => (
                      <Image
                        key={pIdx}
                        source={photo}
                        style={styles.photo}
                        resizeMode="cover"
                      />
                    ))}
                  </ScrollView>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Actions</Text>
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: Colors.techPrimary }]}
                onPress={handlePrint}
              >
                <FeatherIcon name="printer" size={16} color="#fff" />
                <Text style={styles.actionBtnText}>Print</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "#555" }]}
                onPress={handleEmail}
              >
                <FeatherIcon name="mail" size={16} color="#fff" />
                <Text style={styles.actionBtnText}>Email</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "GREEN":
      return "#E6F4EA"; // very light green
    case "YELLOW":
      return "#FFF8E1"; // light amber
    case "RED":
      return "#FDECEA"; // light red/pinkish
    default:
      return "#eee";
  }
};

const getStatusTextColor = (status: string) => {
  switch (status) {
    case "GREEN": return "#2E7D32"; // dark green
    case "YELLOW": return "#FF8F00"; // dark amber
    case "RED": return "#C62828"; // dark red
    default: return "#555";
  }
};


const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff"
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    marginLeft: 18
  },
  backText: {
    marginLeft: 6,
    color: Colors.techPrimary,
    fontWeight: "600"
  },
  section: {
    marginTop: 20
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
    marginHorizontal: 18
  },
  detailsCard: {
    flexDirection: "row",
    backgroundColor: Colors.techPrimary,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 18,
    alignItems: "center",
    position: "relative"
  },
  carImage: {
    width: 90,
    height: 90,
    borderRadius: 8
  },
  taskId: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff"
  },
  detailText: {
    fontSize: 12,
    color: "#fff",
    marginTop: 4
  },
  statusTag: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 6
  },
  statusText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  card: { backgroundColor: "#fff", marginHorizontal: 18, borderRadius: 12, padding: 16, elevation: 3, shadowColor: "#656565ff", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6 },
  itemCard: { backgroundColor: "#fafafa", borderRadius: 12, padding: 12, marginBottom: 12, elevation: 1 },
  itemRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  itemName: { fontSize: 14, fontWeight: "600", color: "#000" },
  itemNotes: { fontSize: 12, color: "#333", marginTop: 6 },
statusBadge: {
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 6,
  alignSelf: "flex-start"
},
statusBadgeText: { 
  fontSize: 11, 
  fontWeight: "600", 
  color: "#fff" 
},
  photo: { width: 80, height: 80, borderRadius: 8, marginRight: 8 },
  actionBtn: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, marginRight: 10 },
  actionBtnText: { color: "#fff", fontWeight: "600", fontSize: 13, marginLeft: 6 },
});
