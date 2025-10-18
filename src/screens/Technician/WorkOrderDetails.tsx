// src/screens/Technician/WorkOrderDetails.tsx
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import FeatherIcon from "react-native-vector-icons/Feather";
import { completePartInstallation, createWorkOrderQC, fetchWorkOrderAttachments, fetchWorkOrderDetails, getWorkOrderQC, startPartInstallation, updateLaborTask, updateWorkOrderPart, uploadWorkOrderAttachment } from "../../api/technicianApi";
import AddIssueModal from "../../components/AddIssueModal";
import InstallPartModal from "../../components/InstallPartModal";
import IssueDetailsModal from "../../components/IssueDetailsModal";
import QCModal from "../../components/QCModal";
import Colors from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";
import { getSupabaseUserId, getToken, setSupabaseUserId } from "../../utils/authStorage";

export default function WorkOrderDetailsScreen({ route, navigation }: { route: any; navigation: any }) {
  const routeWorkOrder = route.params?.workOrder;
  const routeWorkOrderId = route.params?.workOrderId || routeWorkOrder?.id;

  const [fetchedWorkOrder, setFetchedWorkOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(!!routeWorkOrderId && !routeWorkOrder);
  const [error, setError] = useState<string | null>(null);

  const workOrder = fetchedWorkOrder || routeWorkOrder || {
    id: routeWorkOrderId,
    tasks: [],
    parts: [],
  };

  const [orderStatus, setOrderStatus] = useState((routeWorkOrder && routeWorkOrder.status) || "IN_PROGRESS");
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<any | null>(null);
  const [addIssueModalVisible, setAddIssueModalVisible] = useState<{ visible: boolean; taskId?: string | null }>({ visible: false, taskId: null });
  const [qcModalVisible, setQcModalVisible] = useState<{ visible: boolean; taskId?: string | null }>({ visible: false, taskId: null });
  const [qcData, setQcData] = useState<any>({});
  const [qcRecords, setQcRecords] = useState<any[]>([]);
  const [qcRecorded, setQcRecorded] = useState<boolean>(false);
  const [issues, setIssues] = useState<any[]>(workOrder.issues || []);
  const [documentation, setDocumentation] = useState(
    Object.fromEntries(((workOrder.tasks as any[]) || []).map((t: any) => [t.id, { photos: [] }]))
  );

  // Photo modal state
const [photoModalVisible, setPhotoModalVisible] = useState(false);
const [selectedPhoto, setSelectedPhoto] = useState<{ uri: string; taskId: string; index: number } | null>(null);
const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [workOrderAttachments, setWorkOrderAttachments] = useState<any[]>([]);
const [installPartModalVisible, setInstallPartModalVisible] = useState(false);
const [selectedPart, setSelectedPart] = useState(null);
const [startingPartId, setStartingPartId] = useState<string | null>(null);

// Parts state
const [partsUsage, setPartsUsage] = useState(
  Object.fromEntries(
    (workOrder.parts || []).map((part: any) => [
      part.inventoryItemId,
      { ...part, installed: !!part.installedAt, quantityUsed: 0, photo: null },
    ])
  )
);



  // Timer state per task
  const [taskTimers, setTaskTimers] = useState(
    Object.fromEntries(
      ((workOrder.tasks as any[]) || []).map((t: any) => [
        t.id,
        { running: false, start: null, elapsed: (t.actualTime || 0) * 3600000 },
      ])
    )
  );
  const [savingTasks, setSavingTasks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setTaskTimers((prev) => {
        const updated = { ...(prev as any) };
        Object.keys(updated).forEach((id) => {
          const entry = updated[id];
          if (entry && entry.running && entry.start) {
            const base = entry.elapsedBase || 0;
            entry.elapsed = Date.now() - entry.start + base;
          }
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = (taskId: string) => {
    setTaskTimers((prev: any) => ({
      ...prev,
      [taskId]: { ...prev[taskId], running: true, start: Date.now(), elapsedBase: prev[taskId].elapsed },
    }));
  };

  // Persist start to backend and refresh
  const persistStart = async (taskId: string) => {
    try {
      // start local timer immediately
      handleStart(taskId);
      setSavingTasks((s) => ({ ...s, [taskId]: true }));
      const token = await getToken();
      if (!token) {
        throw new Error('Missing authentication token. Please log in again.');
      }
      // Debug: show which labor id and payload are being sent (do not print the token)
      console.log('[persistStart] calling updateLaborTask', { laborId: taskId, payload: { startTime: new Date().toISOString(), status: 'IN_PROGRESS' }, tokenPresent: !!token });
      await updateLaborTask(taskId, { startTime: new Date().toISOString(), status: 'IN_PROGRESS' }, token || '');
      const refreshed = await fetchWorkOrderDetails(workOrder.id, token || '');
      if (refreshed) setFetchedWorkOrder(mapWorkOrderApiToUi(refreshed));
    } catch (err: any) {
      console.error('Failed to persist start', err);
      // revert local timer
      handleStop(taskId);
      Alert.alert('Error starting task', err?.message || 'Failed to start task');
    } finally {
      setSavingTasks((s) => ({ ...s, [taskId]: false }));
    }
  };

  const handleStop = (taskId: string) => {
    setTaskTimers((prev: any) => ({
      ...prev,
      [taskId]: { ...prev[taskId], running: false, start: null, elapsed: prev[taskId]?.elapsed || 0, elapsedBase: prev[taskId]?.elapsed || 0 },
    }));
  };

  // Persist completion to backend (send endTime+status only) and refresh
  // NOTE: completion is handled via a confirmation modal (confirmComplete)

  // New modal flow for confirming completion with optional notes
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [completeNotes, setCompleteNotes] = useState('');
  const [taskToComplete, setTaskToComplete] = useState<any | null>(null);
  const [previewActualMinutes, setPreviewActualMinutes] = useState<number | null>(null);

  const openCompleteModal = (task: any) => {
    setTaskToComplete(task);
    setCompleteNotes('');
    // compute preview actual minutes using server startTime if provided else local timer
    try {
      let startTs: number | null = null;
      if (task?.startTime) {
        const parsed = new Date(task.startTime).getTime();
        if (!isNaN(parsed)) startTs = parsed;
      }
      const localTimerStart = taskTimers[task.id]?.start;
      if (!startTs && localTimerStart) startTs = localTimerStart;
      if (startTs) {
        const now = Date.now();
        const diffMin = Math.max(1, Math.round((now - startTs) / 60000));
        setPreviewActualMinutes(diffMin);
      } else {
        setPreviewActualMinutes(null);
      }
    } catch (e) {
      setPreviewActualMinutes(null);
    }
    setCompleteModalVisible(true);
  };

  const confirmComplete = async () => {
    if (!taskToComplete) return;
    const taskId = taskToComplete.id;
    try {
      // Stop local timer immediately
      handleStop(taskId);
      setSavingTasks((s) => ({ ...s, [taskId]: true }));
      const token = await getToken();
      if (!token) throw new Error('Missing authentication token.');

      // Determine start timestamp: prefer server-provided startTime, else local timer start
      let startTs: number | null = null;
      if (taskToComplete.startTime) {
        const parsed = new Date(taskToComplete.startTime).getTime();
        if (!isNaN(parsed)) startTs = parsed;
      }

      // If no start time on the task object, try to fetch the latest work order details
      // to obtain the authoritative startTime from the server (helps when UI is stale)
      if (!startTs) {
        try {
          const fresh = await fetchWorkOrderDetails(workOrder.id, token || '');
          const found = (fresh?.laborItems || []).find((li: any) => li.id === taskId);
          if (found && found.startTime) {
            const parsed = new Date(found.startTime).getTime();
            if (!isNaN(parsed)) startTs = parsed;
          }
        } catch (e) {
          // ignore - we'll fallback to local timer if available
        }
      }

      const localTimerStart = taskTimers[taskId]?.start;
      if (!startTs && localTimerStart) startTs = localTimerStart;

      const endTs = Date.now();
      const endIso = new Date(endTs).toISOString();

      let actualMinutes: number | undefined = undefined;
      if (startTs) {
        const diffMin = Math.max(1, Math.round((endTs - startTs) / 60000));
        actualMinutes = diffMin;
      }

      const payload: any = { endTime: endIso, status: 'COMPLETED' };
      if (actualMinutes !== undefined) payload.actualMinutes = actualMinutes;
      if (completeNotes && completeNotes.trim().length > 0) payload.notes = completeNotes.trim();

  // Debug: log the payload being sent so we can verify actualMinutes is present
  console.log('[confirmComplete] sending payload for laborId', taskId, payload);
  const res = await updateLaborTask(taskId, payload, token || '');
      const refreshed = await fetchWorkOrderDetails(workOrder.id, token || '');
      if (refreshed) setFetchedWorkOrder(mapWorkOrderApiToUi(refreshed));

      // Show confirmation including recorded minutes if returned or computed
      let recordedText = '';
      if (res && res.actualMinutes !== undefined && res.actualMinutes !== null) recordedText = `${res.actualMinutes} minute(s)`;
      else if (actualMinutes !== undefined) recordedText = `${actualMinutes} minute(s)`;
      Alert.alert('Task completed', recordedText ? `Time recorded: ${recordedText}` : 'Task completed');
    } catch (err: any) {
      console.error('Failed to persist completion', err);
      Alert.alert('Error', err?.message || 'Failed to complete task');
    } finally {
      setSavingTasks((s) => ({ ...s, [taskId]: false }));
      setCompleteModalVisible(false);
      setTaskToComplete(null);
      setCompleteNotes('');
      setPreviewActualMinutes(null);
    }
  };

  // Ensure timers are initialized for tasks when workOrder changes so elapsed is never undefined
  useEffect(() => {
    setTaskTimers((prev: any) => {
      const updated = { ...(prev || {}) };
      ((workOrder.tasks as any[]) || []).forEach((t: any) => {
        if (!updated[t.id]) {
          const elapsedMs = (t.actualTime || 0) * 3600000;
          updated[t.id] = { running: false, start: null, elapsed: elapsedMs, elapsedBase: elapsedMs };
        }
      });
      return updated;
    });
  }, [workOrder.tasks]);

  // removed unused placeholder. Completion is handled by openCompleteModal/confirmComplete
  


  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

const handleAddIssue = (taskId: string, issue: any) => {
  const newEntry = {
    ...issue,
    workOrderId: workOrder.id,
    taskId,
    technicianId: "tech-123",
    reportedAt: new Date().toISOString(),
    status: "REPORTED",
    requiresApproval: false,
    estimatedAdditionalCost: 0,
  };

  // Add issue to issues array
  setIssues((prev: any[]) => [...prev, newEntry]);

  // If issue has photo, add it to documentation
  if (issue.photo) {
    setDocumentation((prev: any) => {
      const taskDocs = prev[taskId]?.photos || [];
      return { ...prev, [taskId]: { photos: [...taskDocs, { uri: issue.photo.uri, type: 'Issue' }] } };
    });
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "#E6F4EA";
    case "PENDING":
      return "#FFF8E1";
    case "IN_PROGRESS":
      return "#E0F0FF";
    default:
      return "#eee";
  }
};

const getTextColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "#2E7D32";
    case "PENDING":
      return "#FF8F00";
    case "IN_PROGRESS":
      return "#0277BD";
    default:
      return "#555";
  }
};

  useEffect(() => {
  const allCompleted = workOrder.tasks && workOrder.tasks.length > 0 && (workOrder.tasks as any[]).every((t: any) => t.status === "COMPLETED");
  if (allCompleted && orderStatus !== "READY") {
    setOrderStatus("COMPLETED"); // show as completed but waiting for Ready
  }
}, [workOrder.tasks]);

  // Auto-open QC modal when all tasks are COMPLETED and current user is a technician
  const { user } = useAuth();
  useEffect(() => {
    // Instead of auto-opening the QC modal when all tasks are completed,
    // simply fetch any existing QC records and show them in the UI.
    // The modal should only open when the user intentionally taps "Complete QC".
    let mounted = true;
    const fetchQcRecords = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const fetchedQc = await getWorkOrderQC(workOrder.id, token || '');
        if (!mounted) return;
        setQcRecords(fetchedQc || []);
        if (fetchedQc && fetchedQc.length > 0) {
          setQcRecorded(true);
          const first = fetchedQc[0];
          if (first) setQcData((prev: any) => ({ ...prev, workOrder: first }));
        } else {
          setQcRecorded(false);
        }
      } catch (err) {
        console.warn('Failed to fetch QC records', err);
      }
    };

    fetchQcRecords();
    return () => { mounted = false; };
  }, [workOrder.id]);

  // Fetch latest work order when id present
  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!routeWorkOrderId) return;
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        const data = await fetchWorkOrderDetails(routeWorkOrderId, token || "");
        if (!mounted) return;
        if (!data) {
          setError("No data returned from server");
        } else {
          // Map API shape to UI shape used in this screen
          const mapped = mapWorkOrderApiToUi(data);
          setFetchedWorkOrder(mapped);
          setOrderStatus(mapped.status || orderStatus);
          // If the backend returned QC checks for this work order, mark qcRecorded so modal doesn't auto-open again
          if (data.qcChecks && Array.isArray(data.qcChecks) && data.qcChecks.length > 0) {
            setQcRecorded(true);
              setQcRecords(data.qcChecks || []);
            // Optionally populate qcData with server-side QC details
            // Here we just store the first QC for overview
            const firstQc = data.qcChecks[0];
            if (firstQc && firstQc.qcDate) {
              setQcData((prev: any) => ({ ...prev, workOrder: { ...firstQc } }));
            }
          }
          // fetch attachments for this work order if available
          try {
            const atts = await fetchWorkOrderAttachments(routeWorkOrderId, token || "");
            if (mounted) setWorkOrderAttachments(atts || []);
          } catch (attErr) {
            console.warn('Failed to fetch work order attachments', attErr);
          }
        }
      } catch (err: any) {
        console.error('Failed to fetch work order details', err);
        setError(err?.message || 'Failed to fetch work order');
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [routeWorkOrderId]);

  // Ensure supabaseUserId is stored locally so uploads can include it.
  useEffect(() => {
    (async () => {
      try {
        const stored = await getSupabaseUserId();
        if (!stored && user?.id) {
          // Persist the supabase user id for upload operations
          await setSupabaseUserId(user.id);
          console.log('[WorkOrderDetails] persisted supabaseUserId from auth context');
        }
      } catch (e) {
        console.warn('Failed to persist supabaseUserId', e);
      }
    })();
  }, [user?.id]);

  // Minimal adapter: map backend fields to the UI's expected fields
  function mapWorkOrderApiToUi(api: any) {
    if (!api) return api;
    return {
      id: api.id,
      status: api.status,
      system: api.jobType || api.system || api.job_type,
      carModel: api.vehicle ? `${api.vehicle.make || ''} ${api.vehicle.model || ''} ${api.vehicle.year || ''}`.trim() : undefined,
      carPlate: api.vehicle?.licensePlate || api.vehicle?.license_plate || '',
      technician:
        api.laborItems && api.laborItems.length > 0
          ? (api.laborItems[0].technician?.userProfile?.firstName || '') +
            ' ' +
            (api.laborItems[0].technician?.userProfile?.lastName || '')
          : api.serviceAdvisor?.userProfile?.firstName || '',
      tasks: (api.laborItems || []).map((li: any) => ({
        id: li.id,
        description: li.description || li.laborCatalog?.name || li.serviceId || 'Task',
        status: li.status || 'PENDING',
        estimatedTime: li.estimatedMinutes || li.laborCatalog?.estimatedMinutes || 0,
        actualTime: li.actualMinutes || li.actual_minutes || li.actualMinutes || 0,
        // map possible start time fields from various backend shapes
        startTime: li.startTime || li.start_time || li.startedAt || li.started_at || li.start || null,
        // map any returned actual minutes field if present
        actualMinutes: li.actualMinutes || li.actual_minutes || li.actual_minutes || undefined,
      })),
      parts: api.partsUsed || api.parts || [],
      services: api.services || [],
      inspections: api.inspections || [],
      notes: api.internalNotes || api.estimateNotes || '',
      payments: api.payments || [],
    };
  }



const handlePickPhoto = (task: any) => {
  Alert.alert(
    "Attach Photo",
    "Choose a method",
    [
      {
        text: "Camera",
        onPress: () =>
          launchCamera({ mediaType: "photo" }, async (res) => {
            if (res.didCancel) return;
            if (res.errorCode) {
              Alert.alert("Error", res.errorMessage || "Camera error");
              return;
            }
            if (res.assets && res.assets.length > 0) {
                  const asset = res.assets[0];
                  const uri = asset.uri;
                  if (uri) {
                    const type = task.status === "COMPLETED" ? "After" : "Before";
                    // Save locally and upload
                    savePhoto(task.id, asset, type);
                  }
            }
          }),
      },
      {
        text: "Gallery",
        onPress: () =>
          launchImageLibrary({ mediaType: "photo" }, async (res) => {
            if (res.didCancel) return;
            if (res.errorCode) {
              Alert.alert("Error", res.errorMessage || "Gallery error");
              return;
            }
            if (res.assets && res.assets.length > 0) {
              const asset = res.assets[0];
              const uri = asset.uri;
              if (uri) {
                const type = task.status === "COMPLETED" ? "After" : "Before";
                savePhoto(task.id, asset, type);
              }
            }
          }),
      },
      { text: "Cancel", style: "cancel" },
    ],
    { cancelable: true }
  );
};

const openPhotoModal = (taskId: string, uri: string, index: number) => {
  setSelectedPhoto({ uri, taskId, index });
  setPhotoModalVisible(true);
};

const openAttachment = (url: string) => {
  if (!url) return;
  Linking.openURL(url).catch((err) => console.warn('Failed to open attachment', err));
};

const removePhoto = (taskId: string, index: number) => {
  setDocumentation((prev: any) => {
    const taskDocs = prev[taskId]?.photos || [];
    const updatedDocs = [...taskDocs];
    updatedDocs.splice(index, 1);
    return { ...prev, [taskId]: { photos: updatedDocs } };
  });
  setPhotoModalVisible(false);
};


  const savePhoto = async (taskId: string, asset: any, type: string) => {
      // Optimistically add the photo to UI
      setDocumentation((prev: any) => {
        const taskDocs = prev[taskId]?.photos || [];
        return { ...prev, [taskId]: { photos: [...taskDocs, { uri: asset.uri, type }] } };
      });

      // Validate size (Multer limit is 10MB on the server)
      const maxBytes = 10 * 1024 * 1024;
      if (asset.fileSize && asset.fileSize > maxBytes) {
        Alert.alert('File too large', 'Please select a file smaller than 10 MB');
        // remove optimistic
        setDocumentation((prev: any) => {
          const taskDocs = prev[taskId]?.photos || [];
          taskDocs.pop();
          return { ...prev, [taskId]: { photos: [...taskDocs] } };
        });
        return;
      }

      setUploadingAttachment(true);
      try {
        const token = await getToken();
        const supabaseUserId = await getSupabaseUserId();
        // Use backend category expected for before/after photos
        await uploadWorkOrderAttachment(
          workOrder.id,
          { uri: asset.uri, fileName: asset.fileName, type: asset.type },
          '',
          'BEFORE_AFTER',
          token || '',
          supabaseUserId || null
        );

        // Refresh work order details from server to pick up the new attachment
        const refreshed = await fetchWorkOrderDetails(workOrder.id, token || '');
        if (refreshed) setFetchedWorkOrder(mapWorkOrderApiToUi(refreshed));
        Alert.alert('Success', 'Photo uploaded');
      } catch (err: any) {
        console.error('Upload failed', err);
        Alert.alert('Upload failed', err?.message || 'Failed to upload photo');
        // remove optimistic
        setDocumentation((prev: any) => {
          const taskDocs = prev[taskId]?.photos || [];
          taskDocs.pop();
          return { ...prev, [taskId]: { photos: [...taskDocs] } };
        });
      } finally {
        setUploadingAttachment(false);
      }
    };

  const totalTasks = (workOrder.tasks || []).length;
  const completedTasks = (workOrder.tasks || []).filter((t: any) => t.status === "COMPLETED").length;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={Colors.techPrimary} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FeatherIcon name="arrow-left" size={20} color="#fff" />
          <Text style={styles.headerBackText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Work Order Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Work Order Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Work Order Info</Text>
          <Text style={styles.headerTitle2}>{workOrder.system}</Text>
          <Text style={styles.headerText}>WO ID: {workOrder.id}</Text>
          <Text style={styles.headerText}>
            Vehicle: {workOrder.carModel} ({workOrder.carPlate})
          </Text>
          <Text style={styles.headerText}>Technician: {workOrder.technician}</Text>

          <View style={[styles.progressPill, { backgroundColor: "#E0F0FF" }]}>
            <Text style={{ color: "#0277BD", fontWeight: "700" }}>{progressPercent}% Complete</Text>
          </View>

          {/* (QC summary moved into each task's QC area) */}
        </View>

        {/* Tasks */}
        <View style={{ marginTop: 20 }}>
          <Text style={[styles.sectionTitle, { marginHorizontal: 18 }]}>Tasks</Text>
          {((workOrder.tasks || []) as any[]).map((task: any) => {
            const taskIssues = issues.filter((i: any) => i.taskId === task.id);
            const elapsedHrs = (taskTimers[task.id]?.elapsed || 0) / 3600000;
            const progress = Math.min(elapsedHrs / task.estimatedTime, 1);

            return (
              <View key={task.id} style={styles.card}>
                {/* Task Header */}
                <View style={styles.taskHeader}>
                  <Text style={styles.taskDesc}>{task.description}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
                    <Text style={[styles.statusText, { color: getTextColor(task.status) }]}>{task.status}</Text>
                  </View>
                </View>

                {/* Time */}
                <View style={styles.timeRow}>
                  <Text style={styles.taskMeta}>Estimated: {task.estimatedTime}h</Text>
                  <Text style={styles.taskMeta}>Actual: {elapsedHrs.toFixed(1)}h</Text>
                </View>
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
                </View>

                {/* Timer */}
                {task.status !== "COMPLETED" && (
                  <View style={styles.timerRow}>
                    <FeatherIcon name="clock" size={16} color={Colors.techPrimary} />
                    <Text style={styles.timerText}>{formatTime(taskTimers[task.id]?.elapsed || 0)}</Text>
                  </View>
                )}

                {/* Buttons */}
                <View style={styles.actionRow}>
                  {task.status === "PENDING" && (
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => persistStart(task.id)}
                      disabled={Boolean(savingTasks[task.id])}
                    >
                      {savingTasks[task.id] ? (
                        <ActivityIndicator />
                      ) : (
                        <>
                          <FeatherIcon name="play" size={18} color="#000" />
                          <Text style={styles.actionLabel}>Start</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  )}

                  {task.status === "IN_PROGRESS" && (
                    <TouchableOpacity
                      style={styles.completeBtn}
                      onPress={() => openCompleteModal(task)}
                      disabled={Boolean(savingTasks[task.id])}
                    >
                      {savingTasks[task.id] ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <>
                          <FeatherIcon name="check" size={18} color="#fff" />
                          <Text style={styles.completeLabel}>Complete</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  )}
                </View>

                
{/* Documentation Section */}
<View style={{ marginTop: 12 }}>
  <Text style={styles.sectionTitle}>Documentation</Text>
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={{ marginTop: 6 }}
  >
    {/* Add Task Photo Button FIRST */}
    <TouchableOpacity
      style={[styles.addPhotoDotted, { marginRight: 8 }]}
      onPress={() => handlePickPhoto(task)}
      disabled={uploadingAttachment}
    >
      {uploadingAttachment ? (
        <View style={{ alignItems: 'center' }}>
          <ActivityIndicator color={Colors.techPrimary} />
          <Text style={styles.addPhotoText}>Uploading...</Text>
        </View>
      ) : (
        <>
          <FeatherIcon name="camera" size={20} color={Colors.techPrimary} />
          <Text style={styles.addPhotoText}>Add Photo</Text>
        </>
      )}
    </TouchableOpacity>

    {/* Task Photos */}
  {documentation[task.id]?.photos?.map((photo: any, i: number) => (
      <TouchableOpacity
        key={`task-${i}`}
        onPress={() => openPhotoModal(task.id, photo.uri, i)}
        style={{ alignItems: "center", marginRight: 8 }}
      >
        <Image source={{ uri: photo.uri }} style={styles.docPhoto} />
        <Text style={{ fontSize: 10, color: "#555", marginTop: 2 }}>
          {photo.type || "Photo"}
        </Text>
      </TouchableOpacity>
    ))}

    {/* Work Order Attachments (documents, invoices, etc.) */}
    {workOrderAttachments && workOrderAttachments.length > 0 && (
      <View style={styles.attachmentsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {workOrderAttachments.map((att: any, idx: number) => (
            <TouchableOpacity
              key={`att-${idx}`}
              style={styles.attachmentItem}
              onPress={() => openAttachment(att?.fileUrl || att?.url || att?.path || att?.data?.fileUrl)}
            >
              {att?.fileUrl || att?.url || (att?.path) ? (
                <Image source={{ uri: att.fileUrl || att.url || att.path }} style={styles.attachmentThumb} />
              ) : (
                <View style={[styles.attachmentThumb, { justifyContent: 'center', alignItems: 'center' }]}>
                  <FeatherIcon name="file" size={24} color="#666" />
                </View>
              )}
              
              <Text style={styles.attachmentCategory}>{att?.category || att?.type || ''}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    )}

    {/* Part Photos */}
  {documentation.parts?.photos?.map((photo: any, i: number) => (
      <TouchableOpacity
        key={`part-${i}`}
        onPress={() => openPhotoModal("parts", photo.uri, i)}
        style={{ alignItems: "center", marginRight: 8 }}
      >
        <Image source={{ uri: photo.uri }} style={styles.docPhoto} />
        <Text style={{ fontSize: 10, color: "#555", marginTop: 2 }}>
          {photo.type}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
</View>




{/* ------------------- Parts Section ------------------- */}
<View style={{ marginTop: 12 }}>
  <Text style={styles.sectionTitle}>Parts</Text>
          {(workOrder.parts || []).map((part: any) => {
    const installedPart = partsUsage[part.inventoryItemId] || {};
    // Determine installed state from server (part.installedAt) or optimistic local state
    const isInstalled = Boolean(part.installedAt || installedPart.installedAt);
    return (
      <View key={part.inventoryItemId || part.id} style={styles.partCard}>
        {/* Part Info */}
        <View style={{ flex: 1 }}>
          <Text style={styles.partName}>
            {part.part?.name || part.name || 'Part'} (Qty Allocated: {part.quantity || 1})
          </Text>
          <Text style={styles.partNotes}><Text style={styles.partLabel}>Notes:</Text> {installedPart.notes || part.notes || 'No notes'}</Text>

          {/* Show installation details when installed (server or optimistic) */}
          {isInstalled && (
            <View style={{ marginTop: 6 }}>
              <Text style={styles.installedText}>Installed at: {new Date(part.installedAt || installedPart.installedAt).toLocaleString()}</Text>
              <Text style={styles.partMeta}>Quantity used: {installedPart.quantityUsed ?? part.quantity}</Text>
              {part.warrantyInfo || installedPart.warrantyInfo ? (
                <Text style={styles.partMeta}>Warranty: {part.warrantyInfo || installedPart.warrantyInfo}</Text>
              ) : null}
              {/* Show attachments uploaded for this part installation */}
              {workOrderAttachments && workOrderAttachments.length > 0 && (
                (() => {
                  // Look for attachments with category PART_INSTALLATION and matching partId in metadata
                  const partIdKey = part.id || part.inventoryItemId;
                  const matches = (workOrderAttachments || []).filter((att: any) => {
                    const cat = (att.category || att.type || '').toUpperCase();
                    if (cat !== 'PART_INSTALLATION') return false;
                    // Try metadata/descriptions
                    try {
                      const meta = att.description ? JSON.parse(att.description) : att.metadata ? JSON.parse(att.metadata) : null;
                      if (meta && (meta.partId === partIdKey || meta.partId === String(partIdKey))) return true;
                    } catch (e) {
                      // ignore parse errors
                    }
                    // fallback: check if filename or url contains the inventory id
                    const url = att.fileUrl || att.url || att.path || '';
                    if (url && String(url).includes(String(partIdKey))) return true;
                    return false;
                  });

                  if (matches.length === 0) return null;

                  return (
                    <View style={{ marginTop: 8 }}>
                      <Text style={{ fontSize: 12, fontWeight: '700', marginBottom: 6 }}>Installation Photos</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {matches.map((att: any, idx: number) => (
                          <TouchableOpacity key={`part-att-${idx}`} onPress={() => openAttachment(att.fileUrl || att.url || att.path)} style={{ marginRight: 8 }}>
                            {att.fileUrl || att.url || att.path ? (
                              <Image source={{ uri: att.fileUrl || att.url || att.path }} style={styles.docPhoto} />
                            ) : (
                              <View style={styles.attachmentThumb}><FeatherIcon name="file" size={20} color="#666" /></View>
                            )}
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  );
                })()
              )}
            </View>
          )}
        </View>

        {/* Part Actions */}
        {!isInstalled && (
          <TouchableOpacity
            style={styles.installBtn}
            onPress={async () => {
              try {
                // Mark start of installation first (technician action)
                setStartingPartId(part.id || part.inventoryItemId);
                const token = await getToken();
                // call start endpoint
                await startPartInstallation(part.id || part.inventoryItemId, token || "");
                // open modal to collect completion details
                setSelectedPart({ ...part, quantityUsed: part.quantity });
                setInstallPartModalVisible(true);
              } catch (err: any) {
                console.error('Failed to start part installation', err);
                Alert.alert('Error', err?.message || 'Failed to start part installation');
              } finally {
                setStartingPartId(null);
              }
            }}
            disabled={startingPartId === (part.id || part.inventoryItemId)}
          >
            <Text style={styles.installBtnText}>{startingPartId === (part.id || part.inventoryItemId) ? 'Starting...' : 'Mark as Installed'}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  })}
</View>



                {/* Issues Section */}
                <View style={{ marginTop: 12 }}>
                  <View style={styles.issueHeader}>
                    <Text style={styles.sectionTitle}>Issues</Text>
                    <TouchableOpacity
                      style={styles.newIssueBtn}
                      onPress={() => setAddIssueModalVisible({ visible: true, taskId: task.id })}
                    >
                      <FeatherIcon name="plus" size={16} color="#fff" />
                      <Text style={styles.newIssueBtnText}>New Issue</Text>
                    </TouchableOpacity>
                  </View>
                  {taskIssues.length === 0 ? (
                    <Text style={styles.noIssuesText}>No issues reported.</Text>
                  ) : (
                    taskIssues.map((issue: any, i: number) => (
                      <TouchableOpacity
                        key={i}
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
                    ))
                  )}
                </View>

                                {/* QC after completion */}
<View style={{ marginTop: 12 }}>
  <Text style={styles.sectionTitle}>Quality Control</Text>

  {(() => {
    // prefer task-level qcData, otherwise use latest work-order QC
    const taskQc = qcData[task.id] || (qcRecords && qcRecords.length > 0 ? qcRecords[0] : null);

    if (taskQc) {
      return (
        <View style={styles.qcCard}>
          <Text style={styles.qcLabel}>Notes: {taskQc.notes || '—'}</Text>
          <Text style={styles.qcLabel}>Passed: {taskQc.passed ? 'Yes' : 'No'}</Text>
          <Text style={styles.qcLabel}>At: {taskQc.qcDate ? new Date(taskQc.qcDate).toLocaleString() : taskQc.createdAt ? new Date(taskQc.createdAt).toLocaleString() : '—'}</Text>
        </View>
      );
    }

    // If there is no QC record for this task, show guidance.
    // QC should be done only after all work order labors are completed.
    const allCompleted = workOrder.tasks && workOrder.tasks.length > 0 && (workOrder.tasks as any[]).every((t: any) => t.status === 'COMPLETED');
    if (!allCompleted) {
      return (
        <View style={styles.qcCard}>
          <Text style={styles.qcLabel}>Complete all work order labor assigned to this work order before performing Quality Control.</Text>
        </View>
      );
    }

    // All tasks completed and no QC record yet -> show a button to allow the technician to open the QC modal
    return (
      <TouchableOpacity
        style={[styles.startBtn, styles.alignSelfFlexStart]}
        onPress={() => setQcModalVisible({ visible: true, taskId: null })}
      >
        <Text style={styles.startBtnText}>Complete QC</Text>
      </TouchableOpacity>
    );
  })()}
</View>

              </View>
            );
          })}
        </View>
        {/* {orderStatus === "COMPLETED" && (
          <View style={styles.margin20}>
    <TouchableOpacity
      style={styles.readyBtn}
      onPress={() => setOrderStatus("READY")}
    >
      <Text style={styles.readyBtnText}>Mark Order as Ready</Text>
    </TouchableOpacity>
  </View>
)} */}


      </ScrollView>

      {/* Modals */}
      <AddIssueModal
        visible={!!addIssueModalVisible.visible}
        onClose={() => setAddIssueModalVisible({ visible: false, taskId: null })}
        onSubmit={(issue) => {
          if (addIssueModalVisible.taskId) handleAddIssue(addIssueModalVisible.taskId, issue);
          setAddIssueModalVisible({ visible: false, taskId: null });
        }}
      />

      {/* Complete Task Confirmation Modal */}
      <Modal visible={completeModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Complete Task</Text>
            <Text style={styles.modalSubtitle}>Confirm completing this task and optionally add notes.</Text>
            {previewActualMinutes !== null && (
              <Text style={styles.modalPreview}>Time to be recorded: {previewActualMinutes} minute(s)</Text>
            )}
            <TextInput
              style={styles.modalInput}
              placeholder="Add notes (optional)"
              multiline
              numberOfLines={3}
              value={completeNotes}
              onChangeText={setCompleteNotes}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => {
                  setCompleteModalVisible(false);
                  setTaskToComplete(null);
                  setCompleteNotes('');
                  setPreviewActualMinutes(null);
                }}
              >
                <Text style={[styles.modalBtnText, styles.modalBtnCancelText]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.modalBtnConfirm]} onPress={confirmComplete}>
                <Text style={[styles.modalBtnText, styles.modalBtnConfirmText]}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <IssueDetailsModal visible={showIssueModal} issue={selectedIssue} onClose={() => setShowIssueModal(false)} />
      <QCModal
        visible={!!qcModalVisible.visible}
        onClose={() => setQcModalVisible({ visible: false, taskId: null })}
        onSubmit={(data) => {
          // When QC modal submits, save QC locally and call backend to persist a work-order QC record
          const taskId = qcModalVisible.taskId;

          // 1️⃣ Save QC data locally for UI
          const recordedAt = new Date().toISOString();
          if (taskId) {
            setQcData((prev: any) => ({
              ...prev,
              [taskId]: { ...data, verifiedAt: recordedAt },
            }));

            // mark that single task as QC'd
            const updatedTasks = ((workOrder.tasks || []) as any[]).map((t: any) => (t.id === taskId ? { ...t, status: "COMPLETED" } : t));
            if (fetchedWorkOrder) setFetchedWorkOrder((prev: any) => ({ ...prev, tasks: updatedTasks }));
          }

          (async () => {
            try {
              const token = await getToken();
              if (!token) throw new Error('Missing auth token');

              // Backend QC expects: { passed: boolean, inspectorId?, notes?, reworkRequired?, reworkNotes? }
              // We'll infer 'passed' from the presence of a method/notes or default to true for now.
              const payload: any = {
                passed: true,
                notes: data.notes || '',
                // inspectorId intentionally omitted; server will use authenticated technician
              };

              await createWorkOrderQC(workOrder.id, payload, token || '');

              // Refresh QC records from server and update UI
              try {
                const freshQc = await getWorkOrderQC(workOrder.id, token || '');
                setQcRecords(freshQc || []);
                if (freshQc && freshQc.length > 0) {
                  setQcRecorded(true);
                  setQcData((prev: any) => ({ ...prev, workOrder: freshQc[0] }));
                }
              } catch (err) {
                // ignore - we already refreshed the work order below
                console.warn('Failed to refresh QC records after create', err);
              }

              // Refresh the work order to pick up any server-side changes
              const refreshed = await fetchWorkOrderDetails(workOrder.id, token || '');
              if (refreshed) setFetchedWorkOrder(mapWorkOrderApiToUi(refreshed));
              Alert.alert('QC saved', 'Quality control record saved');
            } catch (err: any) {
              console.error('Failed to save QC', err);
              Alert.alert('QC failed', err?.message || 'Failed to save QC');
            } finally {
              setQcModalVisible({ visible: false, taskId: null });
            }
          })();
        }}
      />


<InstallPartModal
  visible={installPartModalVisible}
  part={selectedPart}
  onClose={() => setInstallPartModalVisible(false)}
  onSubmit={(installedPart: any) => {
  const { id: partId, inventoryItemId, photo, quantityUsed, notes } = installedPart;
  const now = new Date().toISOString();

  // Update partsUsage (optimistic UI)
  setPartsUsage((prev) => ({
    ...prev,
    [inventoryItemId]: {
      ...prev[inventoryItemId],
      installed: true,
      installedAt: now,
      quantityUsed,
      notes,
      photo: photo ? { uri: photo.uri, type: "Part" } : null,
    },
  }));

  // Save to documentation → always under "parts"
  if (photo) {
    setDocumentation((prev: any) => {
      const partDocs = prev.parts?.photos || [];
      return { ...prev, parts: { photos: [...partDocs, { uri: photo.uri, type: "Part" }] } };
    });
  }

  // Persist via the correct backend endpoint: PUT /parts/:partId/complete
  (async () => {
    try {
      const token = await getToken();
      const payload = { notes, warrantyInfo: installedPart.warrantyInfo, quantityUsed };
      // If the part record has an id (part id), call completePartInstallation; otherwise fallback to old update
      if (partId) {
        await completePartInstallation(partId, payload, token || "");
      } else {
        // Fallback (legacy) - attempt to use work-order parts endpoint if it exists on the API
        await updateWorkOrderPart(workOrder.id, inventoryItemId, { installedAt: now, quantityUsed, notes }, token || "");
      }

      // If the installer included a photo, upload it as a WORK ORDER attachment
      // with category PART_INSTALLATION. Include some metadata in the description so
      // we can associate the attachment to the specific part when rendering.
      if (photo && photo.uri) {
        try {
          const supabaseUserId = await getSupabaseUserId();
          const attachmentMeta = {
            type: 'PART_INSTALLATION',
            partId: partId || inventoryItemId,
            notes: notes || '',
          };
          await uploadWorkOrderAttachment(
            workOrder.id,
            { uri: photo.uri, fileName: photo.fileName, type: photo.type },
            JSON.stringify(attachmentMeta),
            'PART_INSTALLATION',
            token || '',
            supabaseUserId || null
          );
        } catch (attErr: any) {
          console.warn('Failed to upload part installation attachment', attErr);
          // don't block the success of part installation; notify user
          Alert.alert('Attachment upload failed', attErr?.message || 'Failed to upload part photo');
        }
      }

      // Refresh work order and attachments from server
      const refreshed = await fetchWorkOrderDetails(workOrder.id, token || '');
      if (refreshed) setFetchedWorkOrder(mapWorkOrderApiToUi(refreshed));
      try {
        const atts = await fetchWorkOrderAttachments(workOrder.id, token || '');
        setWorkOrderAttachments(atts || []);
      } catch (attErr) {
        console.warn('Failed to refresh attachments after part install', attErr);
      }

      Alert.alert("Success", "Part marked as installed");
    } catch (err: any) {
      console.error('Failed to mark part installed', err);
      Alert.alert('Error', err?.message || 'Failed to mark part installed');
    } finally {
      setInstallPartModalVisible(false);
    }
  })();
}}

/>



      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
          <FeatherIcon name="home" size={22} color={Colors.techPrimary} />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <FeatherIcon name="check-square" size={22} color={Colors.techPrimary} />
          <Text style={styles.navLabelActive}>Work Orders</Text>
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

// ------------------- STYLES -------------------
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  header: { backgroundColor: Colors.techPrimary, paddingVertical: 12, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backButton: { flexDirection: "row", alignItems: "center" },
  headerBackText: { color: "#fff", fontWeight: "600", marginLeft: 6 },
  headerTitle: { color: "#fff", fontWeight: "700", fontSize: 16 },
  card: { backgroundColor: "#fff", marginHorizontal: 18, borderRadius: 12, padding: 16, marginBottom: 16, elevation: 3, shadowColor: "#656565ff", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#000", marginBottom: 8 },
  headerTitle2: { fontSize: 16, fontWeight: "700", color: "#000" },
  headerText: { fontSize: 12, color: "#555", marginTop: 2 },
  taskHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  taskDesc: { fontSize: 14, fontWeight: "600", color: "#000", marginBottom: 4 },
  taskMeta: { fontSize: 12, color: "#555" },
  timeRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 6 },
  progressPill: { marginTop: 12, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, alignSelf: "flex-start" },
  progressBarBackground: { height: 6, backgroundColor: "#eee", borderRadius: 3, marginTop: 4 },
  progressBarFill: { height: 6, backgroundColor: Colors.techPrimary, borderRadius: 3 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: "700" },
  timerRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  timerText: { marginLeft: 6, fontSize: 13, fontWeight: "600", color: "#000" },
  actionRow: { flexDirection: "row", marginTop: 10 },
  actionBtn: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ccc", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, marginRight: 10 },
  actionLabel: { marginLeft: 6, fontSize: 13, fontWeight: "500" },
  completeBtn: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.techPrimary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  completeLabel: { marginLeft: 6, fontSize: 13, fontWeight: "600", color: "#fff" },
  addPhotoDotted: { width: 80, height: 80, borderRadius: 12, borderWidth: 2, borderStyle: "dashed", borderColor: "#ccc", justifyContent: "center", alignItems: "center", marginRight: 8, backgroundColor: "#fafafa" },
  addPhotoText: { fontSize: 10, color: "#8c8a8aff", marginTop: 6, textAlign: "center" },
  docPhoto: { width: 80, height: 80, borderRadius: 12 },
  attachmentThumb: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#fafafa' },
  attachmentsContainer: { marginLeft: 6, marginRight: 8 },
  documentsTitle: { fontSize: 13, fontWeight: '700', marginBottom: 8 },
  attachmentItem: { alignItems: 'center', marginRight: 12 },
  attachmentLabel: { fontSize: 11, color: '#444', marginTop: 6, maxWidth: 80, textAlign: 'center' },
  attachmentCategory: { fontSize: 11, color: '#777', marginTop: 2, maxWidth: 80, textAlign: 'center' },
  issueHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  newIssueBtn: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.techPrimary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  newIssueBtnText: { color: "#fff", fontWeight: "600", fontSize: 12, marginLeft: 6 },
  noIssuesText: { fontSize: 12, color: "#666", marginTop: 6 },
  qcCard: { backgroundColor: "#f9f9f9", borderRadius: 12, padding: 12, marginTop: 8 },
  qcLabel: { fontSize: 12, fontWeight: "600", color: "#555", marginTop: 6 },
  startBtn: { backgroundColor: Colors.techPrimary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 6, marginTop: 6 },
  startBtnText: { color: "#fff", fontWeight: "700" },
  alignSelfFlexStart: { alignSelf: 'flex-start' },
  margin20: { margin: 20 },
  issueCard: { backgroundColor: "#f9f9f9", marginBottom: 10, padding: 12, borderRadius: 8, elevation: 2 },
  issueTitle: { fontWeight: "700", fontSize: 13, color: "#000" },
  issueDesc: { fontSize: 12, color: "#333", marginTop: 4 },
  issueMeta: { fontSize: 11, color: "#666", marginTop: 6 },
  bottomNav: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", borderTopWidth: 1, borderColor: "#eee", backgroundColor: "#fff", paddingVertical: 10, elevation: 8 },
  navItem: { alignItems: "center", flex: 1 },
  navLabel: { fontSize: 11, color: "#444", marginTop: 4 },
  navLabelActive: { fontSize: 11, color: Colors.techPrimary, marginTop: 4, fontWeight: "700" },
  partCard: {
  backgroundColor: "#fff",
  borderRadius: 12,
  padding: 12,
  marginBottom: 10,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  elevation: 2,
  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
},

partName: { fontWeight: "700", fontSize: 13, color: "#000" },
partNotes: { fontSize: 12, color: "#555", marginTop: 2 },
partLabel: { fontSize: 12, fontWeight: "700", color: "#333", marginRight: 6 },
installedText: { fontSize: 12, color: "#2E7D32", marginTop: 4 },
  partMeta: { fontSize: 12, color: "#555", marginTop: 4 },
installBtn: { marginTop: 4, backgroundColor: Colors.techPrimary, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, alignSelf: "flex-start" },
installBtnText: { color: "#fff", fontWeight: "600", fontSize: 12 },

readyBtn: {
  backgroundColor: Colors.techPrimary,
  paddingVertical: 12,
  borderRadius: 8,
  alignItems: "center",
},
readyBtnText: {
  color: "#fff",
  fontWeight: "700",
  fontSize: 16,
},
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: '#fff', padding: 16, borderTopLeftRadius: 12, borderTopRightRadius: 12, minHeight: 180 },
  modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  modalSubtitle: { color: '#555', marginBottom: 10, fontSize: 13 },
  modalPreview: { marginBottom: 8, fontWeight: '600', color: '#222' },
  modalInput: { borderWidth: 1, borderColor: '#e6e6e6', borderRadius: 8, padding: 8, textAlignVertical: 'top', minHeight: 70, backgroundColor: '#fafafa' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
  modalBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, marginLeft: 8, minWidth: 90, alignItems: 'center' },
  modalBtnText: { fontWeight: '700' },
  modalBtnCancel: { backgroundColor: '#eee' },
  modalBtnCancelText: { color: '#333' },
  modalBtnConfirm: { backgroundColor: Colors.techPrimary },
  modalBtnConfirmText: { color: '#fff' },

});