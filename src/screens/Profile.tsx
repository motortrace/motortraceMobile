import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';
import FormBox from '../components/FormBox';
import Header from '../components/Header';

const UserProfileScreen = () => {
  const [profileData, setProfileData] = useState({
    username: 'john_doe',
    email: 'johndoe@email.com',
    fullName: 'John Doe',
    phoneNumber: '+94 71 481 0928',
    profileImage: '', // Empty string means no image
    joinDate: 'Member since March 2024'
  });

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive' },
      ]
    );
  };

  const handleChangeProfilePicture = () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Camera selected') },
        { text: 'Gallery', onPress: () => console.log('Gallery selected') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const ProfileField = ({ label, value, iconName, isLast = false }) => (
    <View style={[styles.fieldContainer, isLast && styles.lastField]}>
      <View style={styles.fieldContent}>
        <View style={styles.fieldHeader}>
          <View style={styles.iconContainer}>
            <Icon name={iconName} size={18} color={Colors.primary} />
          </View>
          <Text style={styles.fieldLabel}>{label}</Text>
        </View>
        <Text style={styles.fieldValue}>{value}</Text>
      </View>
      {!isLast && <View style={styles.fieldDivider} />}
    </View>
  );

  const renderProfileImage = () => {
    if (profileData.profileImage) {
      return (
        <Image 
          source={{ uri: profileData.profileImage }} 
          style={styles.profileImage} 
        />
      );
    } else {
      // Render icon when no image
      return (
        <View style={styles.profileImagePlaceholder}>
          <Icon 
            name="person" 
            size={50} 
            color={Colors.primary} 
          />
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        icon="back"
        name="Profile"
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Image Section */}
        <View style={styles.imageSection}>
          <TouchableOpacity 
            style={styles.imageContainer}
            onPress={handleChangeProfilePicture}
            activeOpacity={0.8}
          >
            {renderProfileImage()}
          </TouchableOpacity>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{profileData.fullName}</Text>
            <Text style={styles.userEmail}>{profileData.email}</Text>
            <Text style={styles.joinDate}>{profileData.joinDate}</Text>
          </View>
        </View>

        {/* Profile Information Card */}
        <FormBox style={styles.profileCard}>
          <View style={styles.cardHeader}>
            <Icon name="information-circle-outline" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Personal Information</Text>
          </View>

          <ProfileField
            label="Full Name"
            value={profileData.fullName}
            iconName="person-outline"
          />

          <ProfileField
            label="Username"
            value={`@${profileData.username}`}
            iconName="at-outline"
          />

          <ProfileField
            label="Email Address"
            value={profileData.email}
            iconName="mail-outline"
          />

          <ProfileField
            label="Phone Number"
            value={profileData.phoneNumber}
            iconName="call-outline"
            isLast={true}
          />

          <TouchableOpacity 
            onPress={() => Alert.alert('Edit Profile', 'Navigate to Edit Profile screen')}
            style={styles.editButtonContainer}
            activeOpacity={0.7}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>

        </FormBox>

        {/* Account Settings Card */}
        <FormBox style={styles.settingsCard}>
          <View style={styles.cardHeader}>
            <Icon name="settings-outline" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Account Settings</Text>
          </View>

          <TouchableOpacity style={styles.actionRow}>
            <View style={styles.actionLeft}>
              <View style={styles.actionIconContainer}>
                <Icon name="lock-closed-outline" size={18} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.actionText}>Change Password</Text>
                <Text style={styles.actionSubtext}>Update your password</Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={20} color={Colors.neutral400} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.actionRow}
            onPress={() => Alert.alert('Privacy', 'Privacy settings coming soon')}
          >
            <View style={styles.actionLeft}>
              <View style={styles.actionIconContainer}>
                <Icon name="shield-outline" size={18} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.actionText}>Privacy Settings</Text>
                <Text style={styles.actionSubtext}>Manage your privacy</Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={20} color={Colors.neutral400} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.actionRow}
            onPress={() => Alert.alert('Help', 'Help & Support coming soon')}
          >
            <View style={styles.actionLeft}>
              <View style={styles.actionIconContainer}>
                <Icon name="help-circle-outline" size={18} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.actionText}>Help & Support</Text>
                <Text style={styles.actionSubtext}>Get help when you need it</Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={20} color={Colors.neutral400} />
          </TouchableOpacity>
        </FormBox>

        {/* Logout Section */}
        <FormBox style={styles.logoutCard}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <View style={styles.logoutIconContainer}>
              <Icon name="log-out-outline" size={30} color={Colors.danger} />
            </View>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </FormBox>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primarybg,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  imageSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingBottom: 40,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: Colors.neutral0,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.neutral100,
    borderWidth: 4,
    borderColor: Colors.neutral0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.neutral0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.neutral1000,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: Colors.neutral600,
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    color: Colors.neutral500,
    fontStyle: 'italic',
  },
  profileCard: {
    marginBottom: 16,
  },
  settingsCard: {
    marginBottom: 16,
  },
  logoutCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginLeft: 10,
  },
  fieldContainer: {
    paddingVertical: 12,
  },
  lastField: {
    paddingBottom: 0,
  },
  fieldContent: {
    flex: 1,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${Colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral600,
  },
  fieldValue: {
    fontSize: 16,
    color: Colors.neutral1000,
    fontWeight: '400',
    marginLeft: 44,
  },
  fieldDivider: {
    height: 1,
    backgroundColor: Colors.neutral200,
    marginTop: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 16,
    color: Colors.neutral1000,
    fontWeight: '500',
    marginBottom: 2,
  },
  actionSubtext: {
    fontSize: 13,
    color: Colors.neutral500,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutral200,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
  },
  logoutIconContainer: {
    width: 10,
    height: 10,
    borderRadius: 16,
    backgroundColor: `${Colors.danger}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoutText: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.danger,
  },
  bottomSpacing: {
    height: 10,
  },
  editButtonContainer: {
    marginTop: 20,
    alignSelf: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.primary,
    borderRadius: 6,
    marginBottom: -10,
  },

  editButtonText: {
    color: Colors.neutral0,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UserProfileScreen;