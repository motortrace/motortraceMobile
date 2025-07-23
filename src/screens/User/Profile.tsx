import React, { useState, useEffect } from 'react';
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
import Colors from '../../constants/colors';
import FormBox from '../../components/FormBox';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';
import ProfileField from '../../components/ProfileField';
import { useUser } from '../../store/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfileScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUser();
  const [profileData, setProfileData] = useState({
    email: '',
    fullName: '',
    phoneNumber: '',
    profileImage: '', // Empty string means no image
    joinDate: ''
  });

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

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            
            try {
              // Get token from secure storage
              const token = await AsyncStorage.getItem('token');
              
              if (token) {
                // Call backend API to invalidate the token
                await fetch('http://10.0.2.2:3000/auth/signout', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-Client-Type': 'mobile',
                  },
                });
              }
              
              // Clear token from secure storage
              await AsyncStorage.removeItem('token');
              await AsyncStorage.removeItem('user');
              setUser(null);
              
              // Navigate to login screen
              navigation.navigate('LogIn');
              
              // Optional: Show success message
              Alert.alert('Signed Out', 'You have been successfully signed out.');
              
            } catch (error: any) {
              console.error('Sign out error:', error);
              
              // Even if the API call fails, still clear local data
              try {
                await AsyncStorage.removeItem('token');
                await AsyncStorage.removeItem('user');
                setUser(null);
                navigation.navigate('LogIn');
              } catch (localError) {
                console.error('Error clearing local data:', localError);
                Alert.alert('Sign Out Error', 'There was an issue signing out. Please try again.');
              }
            } finally {
              setIsLoading(false);
            }
          }
        },
      ]
    );
  };

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get user from AsyncStorage or context
        const userStr = await AsyncStorage.getItem('user');
        if (!userStr) return;
        const user = JSON.parse(userStr);
        const token = await AsyncStorage.getItem('token');
        if (!token) return;
  
        const res = await fetch(`http://10.0.2.2:3000/profiles/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
  
        if (data.role === 'car_owner' && data.profile) {
          setProfileData({
            email: data.email,
            fullName: data.profile.name,
            phoneNumber: data.phone,
            profileImage: data.profile.imageBase64, // If you store as base64, use: `data:image/png;base64,${data.profile.imageBase64}`
            joinDate: data.profile.createdAt
              ? `Member since ${new Date(data.profile.createdAt).toLocaleDateString()}`
              : '',
          });
        }
        // You can add logic for other roles here if needed
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };
  
    fetchProfile();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        icon="back"
        name="Profile"
        onIconPress={() => navigation.navigate('Home')}
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
            onPress={() => navigation.navigate('EditProfile')}
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

          <TouchableOpacity style={styles.actionRow} onPress={()=> navigation.navigate('ResetPassword')}>
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
            onPress={() => navigation.navigate('PrivacySettings')}
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
            onPress={() => navigation.navigate('Help')}
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
          <TouchableOpacity 
            style={styles.actionRow}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            <View style={styles.actionLeft}>
              <View style={styles.actionIconContainer}>
                <Icon name="shield-checkmark-outline" size={18} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.actionText}>Privacy Policy</Text>
                <Text style={styles.actionSubtext}>Get to know how we protect your data</Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={20} color={Colors.neutral400} />
          </TouchableOpacity>
        </FormBox>

        {/* Logout Section */}
        <FormBox style={styles.logoutCard}>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleSignOut}
          disabled={isLoading}
        >
          <Icon name="log-out-outline" size={30} color={Colors.danger} />
          <Text style={styles.logoutText}>
            {isLoading ? 'Signing Out...' : 'Sign Out'}
          </Text>
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
    paddingVertical: 14, // Increased padding for better touch area
    paddingHorizontal: 24, // Added horizontal padding
    backgroundColor: Colors.neutral0, // White background for contrast
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 8,
  },
  logoutIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: `${Colors.danger}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16, // More space between icon and text
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  logoutText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.danger,
    letterSpacing: 0.5,
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