import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
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
import { launchImageLibrary, launchCamera, ImagePickerResponse, MediaType, PhotoQuality } from 'react-native-image-picker';
import { imageUploadService } from '../../services/imageUpload.service';
import CustomAlert from '../../components/Alert';
import LoadingComponent from '../../components/Loading';

const UserProfileScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const { setUser } = useUser();
  const [profileData, setProfileData] = useState({
    email: '',
    fullName: '',
    phoneNumber: '',
    profileImage: '', // Empty string means no image
    joinDate: '',
    role: '',
    emailConfirmed: false,
    createdAt: '',
    lastSignIn: ''
  });

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
    title: '',
    message: '',
    buttonType: 'single' as 'none' | 'single' | 'double' | 'triple',
    confirmText: 'OK',
    cancelText: 'Cancel',
    option1Text: 'Camera',
    option2Text: 'Gallery',
    onConfirm: () => {},
    onCancel: () => {},
    onOption1: () => {},
    onOption2: () => {},
  });

  const showAlert = useCallback((config: Partial<typeof alertConfig>) => {
    const alertType = config.buttonType || 'single';

    setAlertConfig({
      type: config.type || 'info',
      title: config.title || '',
      message: config.message || '',
      buttonType: alertType,
      confirmText: config.confirmText || 'OK',
      cancelText: config.cancelText || 'Cancel',
      option1Text: config.option1Text || 'Camera',
      option2Text: config.option2Text || 'Gallery',
      onConfirm: config.onConfirm || (() => {}),
      onCancel: config.onCancel || (() => {}),
      onOption1: config.onOption1 || (() => {}),
      onOption2: config.onOption2 || (() => {}),
    });
    setAlertVisible(true);
  }, []);


  // Hide custom alert
  const hideAlert = () => {
    setAlertVisible(false);
    // Execute the onConfirm action after hiding
    setTimeout(() => {
      alertConfig.onConfirm();
    }, 100);
  };

  const pickImageFromGallery = () => {
    console.log('📱 Opening gallery...');
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 1 as PhotoQuality,
    }

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      console.log('📱 Gallery response:', response);
      if (response.didCancel || response.errorMessage) {
        console.log('📱 Gallery cancelled or error:', response.errorMessage);
        return
      }

      if (response.assets && response.assets[0]) {
        console.log('📱 Image selected from gallery:', response.assets[0].uri);
        uploadProfileImage(response.assets[0].uri || '');
      }
    })
  }

  const takePhotoWithCamera = () => {
    console.log('📷 Opening camera...');
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 1 as PhotoQuality,
      saveToPhotos: true,
    }

    launchCamera(options, (response: ImagePickerResponse) => {
      console.log('📷 Camera response:', response);
      if (response.didCancel || response.errorMessage) {
        console.log('📷 Camera cancelled or error:', response.errorMessage);
        return
      }

      if (response.assets && response.assets[0]) {
        console.log('📷 Photo taken:', response.assets[0].uri);
        uploadProfileImage(response.assets[0].uri || '');
      }
    })
  }

  const uploadProfileImage = async (imageUri: string) => {
    try {
      setIsLoading(true);
      console.log('📤 Uploading profile image...');
      
      const uploadResult = await imageUploadService.uploadProfileImage(imageUri);
      
      if (!uploadResult.success) {
        showAlert({
          type: 'error',
          title: 'Upload Failed',
          message: uploadResult.error || 'Failed to upload profile image. Please try again.',
          buttonType: 'single',
          confirmText: 'OK',
          onConfirm: () => {}
        });
        return;
      }
      
      console.log('✅ Profile image uploaded successfully:', uploadResult.imageUrl);

      // Update the user's profile in the backend with the new image URL
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const updateResponse = await fetch('http://10.0.2.2:3000/auth/profile', {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              profileImageUrl: uploadResult.imageUrl
            }),
          });

          if (updateResponse.ok) {
            console.log('✅ Profile updated in database with new image URL');
          } else {
            console.warn('⚠️ Profile image uploaded but database update failed');
          }
        }
      } catch (updateError) {
        console.warn('⚠️ Profile image uploaded but database update failed:', updateError);
      }

      // Update the profile data with new image URL
      setProfileData(prev => ({
        ...prev,
        profileImage: uploadResult.imageUrl || ''
      }));

      showAlert({
        type: 'success',
        title: 'Success',
        message: 'Profile picture updated successfully!',
        buttonType: 'single',
        confirmText: 'OK',
        onConfirm: () => {}
      });
      
    } catch (error: any) {
      console.error('❌ Profile image upload error:', error);
      showAlert({
        type: 'error',
        title: 'Upload Error',
        message: error.message || 'Failed to upload profile image. Please try again.',
        buttonType: 'single',
        confirmText: 'OK',
        onConfirm: () => {}
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeProfilePicture = () => {
    showAlert({
      type: 'info',
      title: 'Change Profile Picture',
      message: 'Choose how you want to update your profile picture',
      buttonType: 'triple',
      cancelText: 'Cancel',
      option1Text: 'Camera',
      option2Text: 'Gallery',
      onCancel: () => {},
      onOption1: takePhotoWithCamera,
      onOption2: pickImageFromGallery,
    });
  };

  const handleSignOut = async () => {
    showAlert({
      type: 'warning',
      title: 'Sign Out',
      message: 'Are you sure you want to sign out?',
      buttonType: 'double',
      confirmText: 'Sign Out',
      cancelText: 'Cancel',
      onConfirm: async () => {
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

          showAlert({
            type: 'success',
            title: 'Signed Out',
            message: 'You have been successfully signed out.',
            buttonType: 'single',
            confirmText: 'OK',
            onConfirm: () => {}
          });

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
            showAlert({
              type: 'error',
              title: 'Sign Out Error',
              message: 'There was an issue signing out. Please try again.',
              buttonType: 'single',
              confirmText: 'OK',
              onConfirm: () => {}
            });
          }
        } finally {
          setIsLoading(false);
        }
      },
      onCancel: () => {}
    });
  };

  const buildImageUrl = (imagePath?: string | null): string | undefined => {
    if (!imagePath) return undefined;
    // If it's already a full URL (Supabase or data URL), return as is
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
      return imagePath;
    }
    // For relative paths, prepend the API base URL
    const base = 'http://10.0.2.2:3000';
    return `${base}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  const renderProfileImage = () => {
    if (profileData.profileImage) {
      return (
        <Image 
          source={{ uri: buildImageUrl(profileData.profileImage) }} 
          style={styles.profileImage}
          onError={() => {
            console.warn('Profile image failed to load:', profileData.profileImage);
            // Clear the image if it fails to load
            setProfileData(prev => ({
              ...prev,
              profileImage: ''
            }));
          }}
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

  // Sequential API fetching - First auth/me, then auth/header
  const fetchAuthMeData = async (token: string) => {
    try {
      console.log('📡 Step 1: Calling auth/me endpoint...');
      const response = await fetch('http://10.0.2.2:3000/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Client-Type': 'mobile',
        },
      });

      if (!response.ok) {
        throw new Error(`Auth/me failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Auth/me data received:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to fetch auth/me data:', error);
      throw error;
    }
  };

  const fetchAuthHeaderData = async (token: string) => {
    try {
      console.log('📡 Step 2: Calling auth/header endpoint...');
      const response = await fetch('http://10.0.2.2:3000/auth/header', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Client-Type': 'mobile',
        },
      });

      if (!response.ok) {
        throw new Error(`Auth/header failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Auth/header data received:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to fetch auth/header data:', error);
      throw error;
    }
  };

  const fetchProfile = useCallback(async () => {
    try {
      console.log('🔍 Starting sequential profile data fetch...');
      
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('❌ No token found');
        showAlert({
          type: 'warning',
          title: 'Session Expired',
          message: 'Please log in again to continue.',
          buttonType: 'single',
          confirmText: 'Login',
          onConfirm: () => navigation.navigate('LogIn')
        });
        return;
      }

      // Initialize data containers
      let authData = null;
      let headerData = null;

      // Step 1: Fetch auth/me data first
      try {
        authData = await fetchAuthMeData(token);
      } catch (error) {
        console.warn('⚠️ Auth/me endpoint failed, continuing with header data...');
      }

      // Step 2: Fetch auth/header data second
      try {
        headerData = await fetchAuthHeaderData(token);
      } catch (error) {
        console.warn('⚠️ Auth/header endpoint failed...');
      }

      // Check if we got any data at all
      if (!authData && !headerData) {
        throw new Error('Both API endpoints failed to return data');
      }

      // Combine and prioritize data from both endpoints
      const combinedData = {
        // Primary data from auth/me endpoint
        email: authData?.user?.email || authData?.email || '',
        role: authData?.user?.role || authData?.role || '',
        emailConfirmed: authData?.user?.emailConfirmed ?? authData?.emailConfirmed ?? false,
        createdAt: authData?.user?.createdAt || authData?.createdAt || '',
        lastSignIn: authData?.user?.lastSignIn || authData?.lastSignIn || '',
        phoneNumber: authData?.user?.phone || authData?.user?.phoneNumber || authData?.phone || '0779991124',
        
        // Display data from auth/header endpoint (fallback to auth/me if not available)
        fullName: headerData?.user?.fullname || 
                  headerData?.user?.fullName || 
                  headerData?.fullname ||
                  authData?.user?.fullName || 
                  authData?.user?.name || 
                  authData?.fullName ||
                  'User',
        
        profileImage: headerData?.user?.profile_image || 
                     headerData?.user?.profileImage || 
                     headerData?.profile_image ||
                     authData?.user?.profileImage || 
                     authData?.profileImage ||
                     '',
        
        // Additional flags
        isRegistrationComplete: headerData?.user?.isRegistrationComplete ?? 
                               authData?.user?.isRegistrationComplete ?? 
                               true,
        
        // Formatted join date
        joinDate: authData?.user?.createdAt || authData?.createdAt
          ? `Member since ${new Date(authData.user?.createdAt || authData.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}`
          : '',
      };

      console.log('📥 Combined profile data:', combinedData);

      // Validate that we have essential data
      if (!combinedData.email && !combinedData.fullName) {
        throw new Error('Unable to retrieve essential profile data from either endpoint');
      }

      setProfileData(combinedData);
      console.log('✅ Profile data updated successfully');

    } catch (error) {
      console.error('❌ Failed to fetch profile:', error);
      showAlert({
        type: 'error',
        title: 'Profile Load Error',
        message: 'Unable to load your profile data. Please check your connection and try again.',
        buttonType: 'double',
        confirmText: 'Retry',
        onConfirm: () => {
          setIsLoadingProfile(true);
          fetchProfile();
        }
      });
    } finally {
      setIsLoadingProfile(false);
    }
  }, [navigation, showAlert]);


  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Show loading component while profile is loading
  if (isLoadingProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <Header 
          icon="back"
        />
        <LoadingComponent 
          loadingText="Loading profile..." 
          containerStyle={{}}
          textStyle={{}}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        icon="back"
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
            <View style={styles.changeImageOverlay}>
              <Icon name="camera" size={20} color={Colors.neutral0} />
            </View>
          </TouchableOpacity>
          <Text style={styles.imageHint}>Tap to change profile picture</Text>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{profileData.fullName}</Text>
            <Text style={styles.userEmail}>{profileData.email}</Text>
            {profileData.role && (
              <Text style={styles.userRole}>{profileData.role.toUpperCase()}</Text>
            )}
            <Text style={styles.joinDate}>{profileData.joinDate}</Text>
            {profileData.emailConfirmed && (
              <View style={styles.emailVerifiedContainer}>
                <Icon name="checkmark-circle" size={16} color={Colors.success} />
                <Text style={styles.emailVerifiedText}>Email Verified</Text>
              </View>
            )}
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

          <View style={styles.divider} />

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

      {/* Custom Alert Component */}
      <CustomAlert
        visible={alertVisible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        buttonType={alertConfig.buttonType}
        confirmText={alertConfig.confirmText}
        onClose={hideAlert}
        onCancel={() => setAlertVisible(false)}
      />

      {/* Loading overlay for image upload */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <LoadingComponent 
            loadingText="Uploading image..." 
            containerStyle={{}}
            textStyle={{}}
          />
        </View>
      )}
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
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 8,
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
  userRole: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  emailVerifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  emailVerifiedText: {
    fontSize: 14,
    color: Colors.success,
    marginLeft: 4,
    fontWeight: '500',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeImageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.neutral0,
    elevation: 3,
  },
  imageHint: {
    fontSize: 14,
    color: Colors.neutral500,
    fontStyle: 'italic',
    marginBottom: 20,
  },
});

export default UserProfileScreen;