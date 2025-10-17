// src/screens/Technician/InspectionList.tsx
import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import FeatherIcon from "react-native-vector-icons/Feather";
import { getAuthMe } from "../../api/technician";
import { fetchInspectionReport, fetchTechnicianInspections, updateChecklistItem, updateWorkOrderInspection, uploadInspectionAttachment } from "../../api/technicianApi";
import InspectionFormModal from "../../components/InspectionFormModal";
import Colors from "../../constants/colors";
import { getToken } from "../../utils/authStorage";

interface Inspection {
  id: string;
  template?: { name?: string };
  workOrderId?: string;
  carModel?: string;
  carPlate?: string;
  isCompleted?: boolean;
  checklistItems?: Array<{
    id?: string | null;
    description?: string;
    item?: string;
    name?: string;
    status?: string;
    notes?: string;
    photos?: any[];
  }>;
  notes?: string;
  // Add other fields as needed
  status?: string;
  state?: string;
}

export default function InspectionListScreen({ navigation }: { navigation: any }) {
  const [tab, setTab] = useState<string>("All");
  const [formModalVisible, setFormModalVisible] = useState<boolean>(false);
  const [currentInspection, setCurrentInspection] = useState<Inspection | null>(null);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchInspections() {
      setLoading(true);
      try {
        const meData = await getAuthMe();
        const technicianId = meData?.data?.roleDetails?.technicianId;
        const token = await getToken();
        if (!technicianId || !token) throw new Error("Missing technicianId or token");
        const inspectionsRes = await fetchTechnicianInspections(technicianId, token);
        // Normalize incoming inspections so that `isCompleted` is a boolean.
        const normalized = (Array.isArray(inspectionsRes) ? inspectionsRes : []).map((i: any) => {
          const completedFlag =
            i?.isCompleted === true ||
            (typeof i?.status === 'string' && i.status.toLowerCase() === 'completed') ||
            (typeof i?.state === 'string' && i.state.toLowerCase() === 'completed');

          return {
            ...i,
            isCompleted: !!completedFlag,
          } as Inspection;
        });

        setInspections(normalized);
      } catch (err) {
        console.error("fetchInspections error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchInspections();
  }, []);

  const filteredInspections =
    tab === "All"
      ? inspections
      : inspections.filter((insp) => {
          // Determine completed status robustly (boolean or string-based)
          const completed = !!(
            insp?.isCompleted === true ||
            (typeof insp?.status === 'string' && insp.status.toLowerCase() === 'completed') ||
            (typeof insp?.state === 'string' && insp.state.toLowerCase() === 'completed')
          );

          if (tab === 'Completed') return completed;
          // 'Pending' or other tabs show not completed
          return !completed;
        });

  const openFormModal = (inspection: Inspection) => {
    // If the inspection already contains checklistItems, use them; otherwise fetch full details
    const prepare = async () => {
      try {
        // Use existing checklist if present
        let full = inspection as any;
        if (!inspection.checklistItems || inspection.checklistItems.length === 0) {
          const token = await getToken();
          if (!inspection.id || !token) throw new Error('Missing inspection id or token');
          full = await fetchInspectionReport(inspection.id, token);
        }

        const checklist = (full.checklistItems || []).map((c: any) => ({
          id: c.id || c.itemId || null,
          item: c.description || c.item || c.name || "",
          status: c.status || c.state || "PENDING",
          notes: c.notes ?? c.comment ?? "",
          photos: c.photos ?? [],
        }));

        setCurrentInspection({
          ...inspection,
          ...full,
          checklistItems: checklist,
        });
        setFormModalVisible(true);
      } catch (err) {
        console.error('openFormModal error', err);
        Alert.alert('Error', 'Could not load inspection checklist.');
      }
    };

    prepare();
  };

  const setItemStatus = (index: number, status: string) => {
    setCurrentInspection((prev) => {
      if (!prev) return prev;
      const updated: Inspection = { ...prev };
      updated.checklistItems = [...(updated.checklistItems || [])];
      const items = updated.checklistItems as any[];
      items[index] = {
        ...items[index],
        status,
      };

      // Persist single checklist item update if it has a valid string id
      const _item = items[index];
      const _id: string | undefined = _item && typeof _item.id === 'string' && _item.id.trim().length > 0 ? _item.id.trim() : undefined;
      if (_id) {
        (async (id: string) => {
          try {
            const token = await getToken();
            await updateChecklistItem(id, { status }, token);
          } catch (err) {
            console.error('Failed to update checklist status', err);
          }
        })(_id);
      }
      return updated;
    });
  };

  const setItemNotes = (index: number, notes: string) => {
    setCurrentInspection((prev) => {
      if (!prev) return prev;
      const updated: Inspection = { ...prev };
      updated.checklistItems = [...(updated.checklistItems || [])];
      const items = updated.checklistItems as any[];
      items[index] = {
        ...items[index],
        notes,
      };

      // Persist notes change if item has a valid id
      const _itemNotes = items[index];
      const _idNotes: string | undefined = _itemNotes && typeof _itemNotes.id === 'string' && _itemNotes.id.trim().length > 0 ? _itemNotes.id.trim() : undefined;
      if (_idNotes) {
        (async (id: string) => {
          try {
            const token = await getToken();
            await updateChecklistItem(id, { notes }, token);
          } catch (err) {
            console.error('Failed to update checklist notes', err);
          }
        })(_idNotes);
      }
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
      const updated: Inspection = { ...prev };
      updated.checklistItems = [...(updated.checklistItems || [])];
      const items = updated.checklistItems as any[];
      items[index] = {
        ...items[index],
        photos: [...(items[index].photos || []), uri],
      };

      // Upload photo to inspection attachments endpoint and then persist the returned file URL
      (async () => {
        try {
          const inspectionId = updated.id;
          if (!inspectionId) return;
          const item = items[index];
          const token = await getToken();
          // determine checklistItemId param
          const checklistItemIdParam: string | undefined = item && typeof item.id === 'string' && item.id.trim().length > 0 ? item.id.trim() : undefined;
          // Call upload endpoint (server will save and return attachment metadata)
          const uploadRes = await uploadInspectionAttachment(inspectionId, { uri, fileName: 'photo.jpg', type: 'image/jpeg' }, checklistItemIdParam, token);

          // Attempt to read returned file url from common fields
          const fileUrl = uploadRes?.fileUrl || uploadRes?.url || uploadRes?.path || uploadRes?.data?.fileUrl || uploadRes?.data?.url;
          if (fileUrl) {
            // replace the local uri with returned file URL
            const newPhotos = [...(item.photos || [])];
            newPhotos[newPhotos.length - 1] = fileUrl;
            item.photos = newPhotos;
            // persist via checklist item update if it has id
            if (item && typeof item.id === 'string' && item.id.trim().length > 0) {
              await updateChecklistItem(item.id.trim(), { photos: item.photos }, token);
            }
          }
        } catch (err) {
          console.error('Failed to upload inspection photo', err);
        }
      })();
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!currentInspection) return;
    try {
      const token = await getToken();
      if (!currentInspection.id || !token) throw new Error("Missing inspectionId or token");
      await updateWorkOrderInspection(currentInspection.id, {
        isCompleted: true,
        checklistItems: currentInspection.checklistItems,
        notes: currentInspection.notes,
        // add other fields as needed
      }, token);
      setInspections((prev) =>
        prev.map((insp) =>
          insp.id === currentInspection.id
            ? { ...currentInspection, isCompleted: true }
            : insp
        )
      );
      setFormModalVisible(false);
    } catch (err) {
      Alert.alert("Error", "Failed to save inspection.");
    }
  };

  const handleViewInspection = async (inspectionId: string) => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!inspectionId || !token) throw new Error("Missing inspectionId or token");
      const report = await fetchInspectionReport(inspectionId, token);
      navigation.navigate("InspectionReport", { inspection: report });
    } catch (err) {
      Alert.alert("Error", "Could not fetch inspection report.");
    } finally {
      setLoading(false);
    }
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
        {loading ? (
          <Text style={{ textAlign: 'center', marginTop: 40 }}>Loading...</Text>
        ) : filteredInspections.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <FeatherIcon name="check" size={24} color="#6b6b6b" />
            </View>
            <Text style={styles.emptyTitle}>
              {tab === 'All'
                ? 'No inspections found.'
                : tab === 'Pending'
                ? 'No Pending Inspections.'
                : 'No Completed Inspections.'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {tab === 'All'
                ? 'There are no inspections assigned to you.'
                : tab === 'Pending'
                ? "You're all caught up — no pending inspections." 
                : 'There are no completed inspections yet.'}
            </Text>
          </View>
        ) : (
          filteredInspections.map((insp) => (
            <View key={insp.id} style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.templateText}>{insp.template?.name}</Text>
                <Text style={styles.metaText}>WO: { (insp as any).workOrder?.workOrderNumber || insp.workOrderId }</Text>
                <Text style={styles.metaText}>
                  {((insp as any).workOrder?.vehicle?.year ? `${(insp as any).workOrder.vehicle.year} ` : '') + ((insp as any).workOrder?.vehicle?.make || insp.carModel || '')} {(insp as any).workOrder?.vehicle?.model || ''}{(insp as any).workOrder?.vehicle?.licensePlate ? ` • ${ (insp as any).workOrder.vehicle.licensePlate }` : (insp.carPlate ? ` • ${insp.carPlate}` : '')}
                </Text>
              </View>
              <View style={styles.rightCol}>
                <TouchableOpacity
                  style={[
                    styles.statusCapsule,
                    {
                      backgroundColor: insp.isCompleted
                        ? 'rgba(46, 204, 113,0.15)'
                        : 'rgba(241, 196, 15,0.15)',
                    },
                  ]}
                  onPress={() =>
                    insp.isCompleted
                      ? handleViewInspection(insp.id)
                      : openFormModal(insp)
                  }
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: insp.isCompleted ? '#2ecc71' : '#f39c12' },
                    ]}
                  >
                    {insp.isCompleted ? 'View' : 'Start'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
    color: '#666'
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 16,
    color: '#444',
    fontWeight: '600'
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    maxWidth: '80%'
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e6e6e6',
    alignItems: 'center',
    justifyContent: 'center'
  },
});
