import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Colors from "../../constants/colors";
import FormBox from "../../components/FormBox";
import Header from "../../components/Header";
import FormInput from "../../components/FormInput";
import VerificationRow from "../../components/Verification";
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary, launchCamera, ImagePickerResponse, MediaType, PhotoQuality } from 'react-native-image-picker';
import { imageUploadService } from '../../services/imageUpload.service';
import CustomAlert from '../../components/Alert';

interface VerificationStatus {
  email: boolean;
  contact: boolean;
}

const EditProfileScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [profileData, setProfileData] = useState({
    fullName: "",
    phoneNumber: "",
    profileImage: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  // Using profileData state directly for form fields
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
    email: true,
    contact: true,
  });

  // Custom Alert states
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

  const hideAlert = () => {
    setAlertVisible(false);
    // Execute the onConfirm action after hiding
    setTimeout(() => {
      alertConfig.onConfirm();
    }, 100);
  };

  // Fetch profile data on mount (use new /auth/profile)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const res = await fetch(`http://10.0.2.2:3000/auth/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        if (res.ok && data?.profile) {
          setProfileData({
            fullName: data.profile.fullName || "",
            phoneNumber: data.profile.phoneNumber || "",
            profileImage: data.profile.profileImageUrl || "",
            email: (await AsyncStorage.getItem('user') ? JSON.parse((await AsyncStorage.getItem('user')) as string).email : "") || "",
          });
        }
      } catch (err) {
        showAlert({
          type: 'error',
          title: 'Error',
          message: 'Failed to fetch profile data.',
          buttonType: 'single',
          confirmText: 'OK',
          onConfirm: () => {}
        });
      }
    };
    fetchProfile();
  }, [showAlert]);

  // Removed redundant effects for verification flags


  const handleContactVerify = () => {
    if (verificationStatus.contact) {
      setVerificationStatus((prev) => ({ ...prev, contact: false }));
      showAlert({
        type: 'info',
        title: 'Contact Reset',
        message: 'You can now enter a new contact number and verify it.',
        buttonType: 'single',
        confirmText: 'OK',
        onConfirm: () => {}
      });
      return;
    }

    const phone = profileData.phoneNumber || '';

    if (!phone.trim()) {
      showAlert({
        type: 'warning',
        title: 'Contact Required',
        message: 'Please enter your contact number first.',
        buttonType: 'single',
        confirmText: 'OK',
        onConfirm: () => {}
      });
      return;
    }

    if (phone.length < 10) {
      showAlert({
        type: 'warning',
        title: 'Invalid Contact',
        message: 'Please enter a valid contact number.',
        buttonType: 'single',
        confirmText: 'OK',
        onConfirm: () => {}
      });
      return;
    }

    setTimeout(() => {
      setVerificationStatus((prev) => ({ ...prev, contact: true }));
      showAlert({
        type: 'success',
        title: 'Contact Verified',
        message: 'Your contact number has been successfully verified.',
        buttonType: 'single',
        confirmText: 'OK',
        onConfirm: () => {}
      });
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
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
        console.log('📱 Image file size:', response.assets[0].fileSize);
        console.log('📱 Image type:', response.assets[0].type);
        handleInputChange("profileImage", response.assets[0].uri || "");
        console.log('📱 Profile image state updated');
      }
    })
  }

  const takePhotoWithCamera = async () => {
    console.log('📷 Opening camera...');

    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 1 as PhotoQuality,
    }

    console.log('📷 Camera options:', options);

    try {
      launchCamera(options, (response: ImagePickerResponse) => {
        console.log('📷 Camera response:', response);

        if (response.errorCode) {
          console.error('📷 Camera error code:', response.errorCode);
          console.error('📷 Camera error message:', response.errorMessage);

          showAlert({
            type: 'error',
            title: 'Camera Error',
            message: response.errorMessage || 'Failed to open camera',
            buttonType: 'single',
            confirmText: 'OK',
            onConfirm: () => {}
          });
          return;
        }

        if (response.didCancel) {
          console.log('📷 Camera cancelled by user');
          return;
        }

        if (response.assets && response.assets[0]) {
          console.log('📷 Photo taken:', response.assets[0].uri);
          console.log('📷 Photo file size:', response.assets[0].fileSize);
          console.log('📷 Photo type:', response.assets[0].type);
          handleInputChange("profileImage", response.assets[0].uri || "");
          console.log('📷 Profile image state updated');
        } else {
          console.error('📷 No photo assets in response');
        }
      });
    } catch (error) {
      console.error('📷 Camera launch error:', error);
      showAlert({
        type: 'error',
        title: 'Camera Error',
        message: 'Failed to open camera. Please check permissions.',
        buttonType: 'single',
        confirmText: 'OK',
        onConfirm: () => {}
      });
    }
  }

  const handleChangeProfilePicture = () => {
    showAlert({
      type: 'info',
      title: 'Change Profile Picture',
      message: 'Choose an option',
      buttonType: 'triple',
      cancelText: 'Cancel',
      option1Text: 'Camera',
      option2Text: 'Gallery',
      onCancel: () => {},
      onOption1: takePhotoWithCamera,
      onOption2: pickImageFromGallery,
    });
  };

  const handleSave = async () => {
    if (!hasChanges) {
      showAlert({
        type: 'info',
        title: 'No Changes',
        message: 'No changes were made to save.',
        buttonType: 'single',
        confirmText: 'OK',
        onConfirm: () => {}
      });
      return;
    }
    if (!profileData.fullName.trim()) {
      showAlert({
        type: 'error',
        title: 'Error',
        message: 'Full name is required.',
        buttonType: 'single',
        confirmText: 'OK',
        onConfirm: () => {}
      });
      return;
    }
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      let finalImageUrl = profileData.profileImage;

      // If profileImage is a local URI (starts with file:// or content://), upload it first
      if (profileData.profileImage && (profileData.profileImage.startsWith('file://') || profileData.profileImage.startsWith('content://'))) {
        console.log('📤 Uploading new profile image...');
        const uploadResult = await imageUploadService.uploadProfileImage(profileData.profileImage);
        
        if (!uploadResult.success) {
          showAlert({
            type: 'error',
            title: 'Upload Failed',
            message: uploadResult.error || "Failed to upload profile image. Please try again.",
            buttonType: 'single',
            confirmText: 'OK',
            onConfirm: () => {}
          });
          return;
        }
        
        finalImageUrl = uploadResult.imageUrl || '';
        console.log('✅ Profile image uploaded successfully:', finalImageUrl);
      }

      // Send fields expected by backend
      const payload = {
        name: profileData.fullName,
        phone: profileData.phoneNumber,
        profileImageUrl: finalImageUrl || null,
      };

      const res = await fetch(`http://10.0.2.2:3000/auth/profile`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      showAlert({
        type: 'success',
        title: 'Success',
        message: 'Profile updated successfully!',
        buttonType: 'single',
        confirmText: 'OK',
        onConfirm: () => {
          setHasChanges(false);
          navigation.navigate("Profile");
        }
      });
    } catch (error) {
      showAlert({
        type: 'error',
        title: 'Error',
        message: 'Failed to update profile. Please try again.',
        buttonType: 'single',
        confirmText: 'OK',
        onConfirm: () => {}
      });
    } finally {
      setIsLoading(false);
    }
  };

  // removed unused handleCancel

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

  return (
    <SafeAreaView style={styles.container}>
      <Header icon="back" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.imageSection}>
          <TouchableOpacity style={styles.imageContainer} onPress={handleChangeProfilePicture} activeOpacity={0.8}>
            {profileData.profileImage ? (
              <Image source={{ uri: buildImageUrl(profileData.profileImage) }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Icon name="person" size={50} color={Colors.primary} />
              </View>
            )}
            <View style={styles.changeImageOverlay}>
              <Icon name="camera" size={20} color={Colors.neutral0} />
            </View>
          </TouchableOpacity>
          <Text style={styles.imageHint}>Tap to change profile picture</Text>
        </View>
        <FormBox style={styles.formCard}>
          <View style={styles.cardHeader}>
            <Icon name="person-outline" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Personal Information</Text>
          </View>
          <FormInput
            label="Full Name"
            placeholder="Enter your full name"
            iconName="person-outline"
            value={profileData.fullName}
            onChangeText={(text) => handleInputChange("fullName", text)}
          />
          <FormInput
            label="Contact Number"
            placeholder="Enter your contact"
            iconName="call-outline"
            value={profileData.phoneNumber}
            onChangeText={(text) => handleInputChange("phoneNumber", text)}
            keyboardType="phone-pad"
          />
          <VerificationRow 
            type="contact" 
            isVerified={verificationStatus.contact} 
            onVerify={handleContactVerify} 
            style={{ marginBottom: -10 }}
          />
        </FormBox>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.saveButton, (!hasChanges || isLoading) && styles.disabledButton]}
            onPress={handleSave}
            disabled={!hasChanges || isLoading}
          >
            <Text style={styles.saveButtonText}>{isLoading ? "Saving..." : "Save Changes"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Custom Alert Component */}
      <CustomAlert
        visible={alertVisible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        buttonType={alertConfig.buttonType}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        option1Text={alertConfig.option1Text}
        option2Text={alertConfig.option2Text}
        onClose={hideAlert}
        onCancel={alertConfig.onCancel}
        onOption1={alertConfig.onOption1}
        onOption2={alertConfig.onOption2}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primarybg,
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  imageSection: {
    alignItems: "center",
    paddingVertical: 32,
    paddingBottom: 24,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 12,
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
    alignItems: "center",
    justifyContent: "center",
  },
  changeImageOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.neutral0,
    elevation: 3,
  },
  imageHint: {
    fontSize: 14,
    color: Colors.neutral500,
    fontStyle: "italic",
  },
  formCard: {
    marginBottom: 40,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.neutral1000,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: Colors.neutral100,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.neutral600,
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  disabledButton: {
    backgroundColor: Colors.neutral200,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.neutral0,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default EditProfileScreen;
