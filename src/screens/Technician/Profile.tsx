import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  Switch,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
import BottomNavigation from '../../components/BottomNav';
import Colors from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';

// Profile Stats Component
const ProfileStats = ({ stats }) => (
  <View style={styles.statsContainer}>
    <View style={styles.statsRow}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{stats.totalCompleted}</Text>
        <Text style={styles.statLabel}>Completed</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{stats.avgRating}</Text>
        <Text style={styles.statLabel}>Rating</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{stats.yearsExperience}</Text>
        <Text style={styles.statLabel}>Years Exp.</Text>
      </View>
    </View>
  </View>
);

// Settings Item Component
const SettingsItem = ({ icon, title, subtitle, onPress, showSwitch = false, switchValue = false, onSwitchChange }) => (
  <TouchableOpacity 
    style={styles.settingsItem} 
    onPress={onPress}
    disabled={showSwitch}
  >
    <View style={styles.settingsLeft}>
      <View style={styles.settingsIcon}>
        <Icon name={icon} size={20} color={Colors.primary} />
      </View>
      <View style={styles.settingsText}>
        <Text style={styles.settingsTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    {showSwitch ? (
      <Switch
        value={switchValue}
        onValueChange={onSwitchChange}
        trackColor={{ false: Colors.neutral300, true: Colors.primary }}
        thumbColor={switchValue ? Colors.neutral0 : Colors.neutral500}
      />
    ) : (
      <Icon name="chevron-forward" size={16} color={Colors.neutral500} />
    )}
  </TouchableOpacity>
);

// Certification Badge Component
const CertificationBadge = ({ certification }) => (
  <View style={styles.certificationBadge}>
    <View style={styles.certificationIcon}>
      <Icon name="ribbon" size={16} color={Colors.primary} />
    </View>
    <View style={styles.certificationText}>
      <Text style={styles.certificationTitle}>{certification.name}</Text>
      <Text style={styles.certificationDate}>Expires: {certification.expiry}</Text>
    </View>
    <View style={[styles.certificationStatus, { 
      backgroundColor: certification.status === 'active' ? Colors.success : Colors.warning 
    }]}>
      <Text style={styles.certificationStatusText}>
        {certification.status === 'active' ? 'Active' : 'Expiring'}
      </Text>
    </View>
  </View>
);

// Main Profile Screen Component
const TechnicianProfileScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState(4);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoAcceptWork, setAutoAcceptWork] = useState(false);
  const [locationTracking, setLocationTracking] = useState(true);

  // Mock data
  const technicianData = {
    name: 'Mike Rodriguez',
    employeeId: 'EMP001',
    department: 'Automotive Service',
    level: 'Senior Technician',
    email: 'mike.rodriguez@autoservice.com',
    phone: '+1 (555) 123-4567',
    joinDate: 'March 2019',
    profileImage: null, // In real app, this would be a URI
  };

  const profileStats = {
    totalCompleted: 1247,
    avgRating: '4.8',
    yearsExperience: 8
  };

  const certifications = [
    {
      id: 1,
      name: 'ASE Master Technician',
      expiry: 'Dec 2025',
      status: 'active'
    },
    {
      id: 2,
      name: 'Hybrid Vehicle Specialist',
      expiry: 'Mar 2024',
      status: 'expiring'
    },
    {
      id: 3,
      name: 'Brake System Certification',
      expiry: 'Sep 2025',
      status: 'active'
    }
  ];

const navItems = [
    {
      id: "home",
      icon: "home",
      label: "Home",
      onPress: () => navigation.navigate('TechnicianHome')
    },
    {
      id: "work",
      icon: "clipboard",
      label: "Work Orders",
      onPress: () => navigation.navigate('Work')
    },
    {
      id: "inspection",
      icon: "search",
      label: "Inspect",
      onPress: () => navigation.navigate('Search')
    },
    {
      id: "inventory",
      icon: "cube",
      label: "Inventory",
      onPress: () => navigation.navigate('Inventory')
    },
    {
      id: "profile",
      icon: "person",
      label: "Profile",
      onPress: () => navigation.navigate('TechnicianPofile')
    }
  ];
  
  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => navigation.navigate('Login') }
      ]
    );
  };

  const handleEditProfile = () => {
    navigation.navigate('TechnicianEditPofile');
  };

  const handleChangePassword = () => {
    navigation.navigate('ResetPassword');
  };

  const handleViewCertifications = () => {
    navigation.navigate('Certifications');
  };

  const handleWorkHistory = () => {
    navigation.navigate('WorkHistory');
  };

  const handleHelp = () => {
    navigation.navigate('Help');
  };

  const handleAbout = () => {
    navigation.navigate('About');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon=""
        name="Profile"
      />
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            {technicianData.profileImage ? (
              <Image 
                source={{ uri: technicianData.profileImage }} 
                style={styles.profileImage} 
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Icon name="person" size={40} color={Colors.neutral500} />
              </View>
            )}
            <TouchableOpacity style={styles.editImageButton}>
              <Icon name="camera" size={16} color={Colors.neutral0} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.profileName}>{technicianData.name}</Text>
          <Text style={styles.profileLevel}>{technicianData.level}</Text>
          <Text style={styles.profileDepartment}>{technicianData.department}</Text>
          
          <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
            <Icon name="create-outline" size={16} color={Colors.primary} />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Stats */}
        <ProfileStats stats={profileStats} />

        {/* Certifications Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            <TouchableOpacity onPress={handleViewCertifications}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {certifications.slice(0, 2).map((cert) => (
            <CertificationBadge key={cert.id} certification={cert} />
          ))}
        </View>

        {/* Work Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Settings</Text>
          
          <SettingsItem
            icon="notifications-outline"
            title="Notifications"
            subtitle="Work order updates and reminders"
            showSwitch={true}
            switchValue={notificationsEnabled}
            onSwitchChange={setNotificationsEnabled}
          />
          
          <SettingsItem
            icon="checkmark-circle-outline"
            title="Auto Accept Work"
            subtitle="Automatically accept assigned work orders"
            showSwitch={true}
            switchValue={autoAcceptWork}
            onSwitchChange={setAutoAcceptWork}
          />
          
          <SettingsItem
            icon="location-outline"
            title="Location Tracking"
            subtitle="Allow location tracking for service calls"
            showSwitch={true}
            switchValue={locationTracking}
            onSwitchChange={setLocationTracking}
          />
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <SettingsItem
            icon="person-outline"
            title="Personal Information"
            subtitle="Update your personal details"
            onPress={handleEditProfile}
          />
          
          <SettingsItem
            icon="lock-closed-outline"
            title="Change Password"
            subtitle="Update your login password"
            onPress={handleChangePassword}
          />
          
          <SettingsItem
            icon="time-outline"
            title="Work History"
            subtitle="View completed work orders"
            onPress={handleWorkHistory}
          />
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <SettingsItem
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="Get help with the app"
            onPress={handleHelp}
          />
          
          <SettingsItem
            icon="information-circle-outline"
            title="About"
            subtitle="App version and legal information"
            onPress={handleAbout}
          />
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    
      <BottomNavigation
        navItems={navItems}
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral50,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: Colors.neutral0,
    padding: 20,
    alignItems: 'center',
    marginBottom: 8,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.neutral200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editImageButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.neutral0,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral1000,
    marginBottom: 4,
  },
  profileLevel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 2,
  },
  profileDepartment: {
    fontSize: 14,
    color: Colors.neutral600,
    marginBottom: 16,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  editProfileText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginLeft: 6,
  },
  statsContainer: {
    backgroundColor: Colors.neutral0,
    padding: 20,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral1000,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.neutral600,
    fontWeight: '500',
  },
  section: {
    backgroundColor: Colors.neutral0,
    padding: 20,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral100,
  },
  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingsText: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral1000,
    marginBottom: 2,
  },
  settingsSubtitle: {
    fontSize: 12,
    color: Colors.neutral600,
  },
  certificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral50,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  certificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.neutral0,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  certificationText: {
    flex: 1,
  },
  certificationTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral1000,
    marginBottom: 2,
  },
  certificationDate: {
    fontSize: 12,
    color: Colors.neutral600,
  },
  certificationStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  certificationStatusText: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.neutral0,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neutral0,
    marginHorizontal: 20,
    marginVertical: 20,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.danger,
    marginLeft: 8,
  },
});

export default TechnicianProfileScreen;