// src/screens/Technician/ProfileScreen.tsx
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import {
  fetchTechnicianDetails,
  fetchTechnicianId,
  fetchTechnicianInspections,
  fetchTechnicianWorkOrders,
  fetchUserProfileId,
} from "../../api/technicianApi";
import Colors from "../../constants/colors";
import { useAuth } from "../../context/AuthContext"; // import your AuthContext
import { getToken } from "../../utils/authStorage";

export default function ProfileScreen({ navigation }: any) {
  const { logout, user } = useAuth(); // get logout and user from context

  const [loading, setLoading] = useState(true);
  const [technicianId, setTechnicianId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null); // will hold name, avatar, email, phone, joined, role
  // We only need counts and profile summary for this screen
  const [counts, setCounts] = useState({ totalWorkOrders: 0, completedTasks: 0, inspections: 0 });

  const handleEditProfile = () => navigation.navigate("EditProfile");

  const handleLogout = async () => {
    await logout(); // clear token and reset auth
    navigation.replace("Login"); // redirect to login screen
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        if (!token) throw new Error('Not authenticated');

        // Determine userProfileId from supabase user id (if available)
        const supabaseUserId = user?.supabaseUserId || user?.id;
        let userProfileId: string | null = null;
        if (supabaseUserId) {
          userProfileId = await fetchUserProfileId(supabaseUserId, token);
        }

        // Find technician id
        let techId: string | null = null;
        if (userProfileId) {
          techId = await fetchTechnicianId(userProfileId, token);
        }

        if (!techId) {
          // nothing more we can do
          if (mounted) setLoading(false);
          return;
        }
        if (mounted) setTechnicianId(techId);

  // Use the detailed technician endpoint (returns profile + stats + recentWorkOrders)
  const details = await fetchTechnicianDetails(techId, token);
  console.debug('[Profile] fetchTechnicianDetails result', { details });

  // Fetch all work orders for this technician so we can compute totals and completed labor
  const allWorkOrders = await fetchTechnicianWorkOrders(techId, token);
  console.debug('[Profile] fetchTechnicianWorkOrders result (all)', { length: Array.isArray(allWorkOrders) ? allWorkOrders.length : 'not-array', sample: Array.isArray(allWorkOrders) ? allWorkOrders[0] : allWorkOrders });

  // Fetch inspections assigned to this technician
  const ins = await fetchTechnicianInspections(techId, token);
  console.debug('[Profile] fetchTechnicianInspections result', { length: Array.isArray(ins) ? ins.length : 'not-array', sample: Array.isArray(ins) ? ins[0] : ins });

        if (mounted) {
          // Compute total work orders
          const totalWorkOrders = Array.isArray(allWorkOrders) ? allWorkOrders.length : 0;

          // Compute completed work order labor count. Prefer server stats if available.
          let completedTasks = details?.stats?.totalTasksCompleted ?? 0;
          if ((!completedTasks || completedTasks === 0) && Array.isArray(allWorkOrders)) {
            try {
              completedTasks = allWorkOrders.reduce((acc: number, wo: any) => {
                const laborItems = wo.laborItems || wo.tasks || [];
                const completed = (laborItems || []).filter((li: any) => li.status === 'COMPLETED').length;
                return acc + completed;
              }, 0);
            } catch (e) {
              completedTasks = completedTasks || 0;
            }
          }

          const inspectionsCompleted = (ins || []).filter((i: any) => i.isCompleted === true || i.status === 'COMPLETED' || i.completedAt).length || (ins || []).length;

          setCounts({ totalWorkOrders, completedTasks, inspections: inspectionsCompleted });

          // Fill profile fields from details or fallback to user
          setProfile({
            name:
              details?.userProfile?.fullName ||
              details?.userProfile?.name ||
              (details?.userProfile?.firstName ? `${details.userProfile.firstName} ${details.userProfile.lastName || ''}`.trim() : null) ||
              user?.email ||
              'Technician',
            id: details?.id || techId,
            email: details?.userProfile?.email || user?.email || '',
            phone: details?.userProfile?.phone || details?.userProfile?.mobile || '',
            avatar: details?.userProfile?.profileImage || details?.userProfile?.avatarUrl || undefined,
            joined: details?.createdAt || details?.userProfile?.createdAt || undefined,
            role: details?.userProfile?.role || 'Technician',
          });
        }
      } catch (err: any) {
        console.warn('Failed to load profile data', err);
        Alert.alert('Error', err?.message || 'Failed to load profile');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [user]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={Colors.techPrimary} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FeatherIcon name="arrow-left" size={20} color="#fff" />
          <Text style={styles.headerBackText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.techPrimary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Card */}
        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: profile?.avatar || 'https://i.pravatar.cc/150?img=12' }} style={styles.avatar} />
          </View>
          <Text style={styles.name}>{profile?.name || user?.email || 'Technician'}</Text>
          <Text style={styles.role}>{profile?.role || 'Field Technician'}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
                <Text style={styles.statNumber}>{counts.totalWorkOrders}</Text>
              <Text style={styles.statLabel}>Work Orders</Text>
            </View>
            <View style={styles.statCard}>
                <Text style={styles.statNumber}>{counts.completedTasks}</Text>
              <Text style={styles.statLabel}>Tasks Completed</Text>
            </View>
            <View style={styles.statCard}>
                <Text style={styles.statNumber}>{counts.inspections}</Text>
              <Text style={styles.statLabel}>Inspections</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <FeatherIcon name="hash" size={16} color="#555" />
              <Text style={styles.infoText}>{profile?.id || technicianId || '—'}</Text>
          </View>
          <View style={styles.infoRow}>
            <FeatherIcon name="mail" size={16} color="#555" />
              <Text style={styles.infoText}>{profile?.email || user?.email || ''}</Text>
          </View>
          <View style={styles.infoRow}>
            <FeatherIcon name="phone" size={16} color="#555" />
              <Text style={styles.infoText}>{profile?.phone || ''}</Text>
          </View>
          <View style={styles.infoRow}>
            <FeatherIcon name="calendar" size={16} color="#555" />
              <Text style={styles.infoText}>Joined: {profile?.joined ? new Date(profile.joined).toLocaleDateString() : '—'}</Text>
          </View>

          <TouchableOpacity style={styles.editBtn} onPress={handleEditProfile}>
            <FeatherIcon name="edit-2" size={16} color="#fff" />
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Card */}
        <View style={styles.card}>
          {/* <Text style={styles.sectionTitle}>Settings</Text>
          <TouchableOpacity style={styles.optionRow}>
            <FeatherIcon name="lock" size={18} color={Colors.techPrimary} />
            <Text style={styles.optionText}>Change Password</Text>
            <FeatherIcon name="chevron-right" size={18} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow}>
            <FeatherIcon name="bell" size={18} color={Colors.techPrimary} />
            <Text style={styles.optionText}>Notifications</Text>
            <FeatherIcon name="chevron-right" size={18} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow}>
            <FeatherIcon name="info" size={18} color={Colors.techPrimary} />
            <Text style={styles.optionText}>About App</Text>
            <FeatherIcon name="chevron-right" size={18} color="#999" />
          </TouchableOpacity> */}

          <TouchableOpacity
            style={[styles.logoutOptionRow]}
            onPress={handleLogout}
          >
            <FeatherIcon name="log-out" size={18} color="#fff" />
            <Text style={[styles.logoutOptionText]}>Logout</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f6f6f6" },
  header: {
    height: 60,
    backgroundColor: Colors.techPrimary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  backButton: { flexDirection: "row", alignItems: "center" },
  headerBackText: { color: "#fff", marginLeft: 4 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  content: { padding: 16, paddingBottom: 40 },
  headerSpacer: { width: 40 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  avatarContainer: { alignItems: "center", marginBottom: 12 },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: Colors.techPrimary },
  name: { fontSize: 18, fontWeight: "700", textAlign: "center", marginBottom: 4 },
  role: { fontSize: 14, color: "#555", textAlign: "center", marginBottom: 12 },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 12 },
  statCard: { alignItems: "center", flex: 1 },
  statNumber: { fontSize: 16, fontWeight: "700", color: Colors.techPrimary },
  statLabel: { fontSize: 12, color: "#555" },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  infoText: { marginLeft: 6, fontSize: 14, color: "#555" },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.techPrimary,
    borderRadius: 8,
    justifyContent: "center",
    paddingVertical: 10,
    marginTop: 12,
  },
  editBtnText: { color: "#fff", fontWeight: "600", marginLeft: 6 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    justifyContent: "space-between",
  },
  optionText: { fontSize: 14, marginLeft: 8, color: "#333" },
  logoutOptionRow: { justifyContent: "center", backgroundColor: Colors.techPrimary, borderRadius: 8, flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  logoutOptionText: { color: '#fff', marginLeft: 8, fontSize: 14 },
});
