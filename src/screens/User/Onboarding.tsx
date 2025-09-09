import type React from "react"
import { useState, useEffect } from "react"
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { launchImageLibrary, launchCamera, ImagePickerResponse, MediaType, PhotoQuality } from 'react-native-image-picker'
import { check, request, PERMISSIONS, RESULTS, Permission } from 'react-native-permissions'
import Colors from "../../constants/colors"
import FormBox from "../../components/FormBox"
import FormInput from "../../components/FormInput"
import AnimatedButton from "../../components/AnimatedButton"
import VerificationRow from "../../components/Verification"
import CustomAlert from "../../components/Alert"
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { imageUploadService } from '../../services/imageUpload.service';

interface VerificationStatus {
  contact: boolean
  loading: boolean
}

interface OnboardingRequest {
  name: string;
  contact: string;
  profileImageUrl: string;
}

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
    contact: false,
    loading: false,
  })

  // Custom Alert states
  const [alertVisible, setAlertVisible] = useState(false)
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
  })

  // Keyboard visibility listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  // Monitor profile image changes
  useEffect(() => {
    console.log('🖼️ Profile image state changed:', profileImage);
  }, [profileImage]);

  // Check camera permission
  const checkCameraPermission = async (): Promise<boolean> => {
    try {
      const cameraPermission: Permission = Platform.OS === 'ios' 
        ? PERMISSIONS.IOS.CAMERA 
        : PERMISSIONS.ANDROID.CAMERA;
      
      const result = await check(cameraPermission);
      console.log('📷 Camera permission result:', result);
      
      if (result === RESULTS.GRANTED) {
        return true;
      } else if (result === RESULTS.DENIED) {
        const requestResult = await request(cameraPermission);
        console.log('📷 Camera permission request result:', requestResult);
        return requestResult === RESULTS.GRANTED;
      } else {
        console.log('📷 Camera permission denied permanently');
        return false;
      }
    } catch (error) {
      console.error('📷 Permission check error:', error);
      return false;
    }
  };

  // Show custom alert helper
  const showAlert = (config: Partial<typeof alertConfig>) => {
    const alertType = config.buttonType || 'single';
    
    setAlertConfig({
      type: config.type || 'info',
      title: config.title || '',
      message: config.message || '',
      buttonType: alertType,
      confirmText: config.confirmText || 'OK',
      cancelText: config.cancelText || 'Cancel',
      option1Text: config.option1Text || 'Option 1',
      option2Text: config.option2Text || 'Option 2',
      onConfirm: config.onConfirm || (() => {}),
      onCancel: config.onCancel || (() => {}),
      onOption1: config.onOption1 || (() => {}),
      onOption2: config.onOption2 || (() => {}),
    });
    setAlertVisible(true);
  };

  // Hide custom alert and execute callback
  const hideAlert = () => {
    setAlertVisible(false);
    // Execute the onConfirm callback for single button alerts
    setTimeout(() => {
      if (alertConfig.buttonType === 'single' && alertConfig.onConfirm) {
        alertConfig.onConfirm();
      }
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
        console.log('📱 Image file size:', response.assets[0].fileSize);
        console.log('📱 Image type:', response.assets[0].type);
        setProfileImage(response.assets[0].uri || null);
        console.log('📱 Profile image state updated');
      }
    })
  }

  const takePhotoWithCamera = async () => {
    console.log('📷 Opening camera...');
    
    // Check camera permission first
    const hasPermission = await checkCameraPermission();
    if (!hasPermission) {
      showAlert({
        type: 'error',
        title: 'Camera Permission Required',
        message: 'Please allow camera access in your device settings to take photos.',
        buttonType: 'single',
        confirmText: 'OK',
        onConfirm: () => {}
      });
      return;
    }
    
    // Check if camera is available
    if (!launchCamera) {
      console.error('📷 launchCamera function not available');
      showAlert({
        type: 'error',
        title: 'Camera Error',
        message: 'Camera function is not available on this device',
        buttonType: 'single',
        confirmText: 'OK',
        onConfirm: () => {}
      });
      return;
    }

    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 1 as PhotoQuality,
      saveToPhotos: true,
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
          setProfileImage(response.assets[0].uri || null);
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

  const handleContinue = async () => {
    if (!name.trim() || !contact.trim()) {
      showAlert({
        type: 'warning',
        title: 'Incomplete Information',
        message: 'Please fill in all fields',
        buttonType: 'single',
        confirmText: 'OK',
        onConfirm: () => {}
      });
      return;
    }
  
    if (!verificationStatus.contact) {
      showAlert({
        type: 'warning',
        title: 'Verification Required',
        message: 'Please verify your contact number',
        buttonType: 'single',
        confirmText: 'OK',
        onConfirm: () => {}
      });
      return;
    }
  
    setIsLoading(true);
    
    try {
      console.log('🔍 Debugging onboarding...');
      
      const token = await AsyncStorage.getItem('token');
      const user = await AsyncStorage.getItem('user');
      
      console.log('🔑 Token from storage:', token ? 'Present' : 'Missing');
      console.log('👤 User from storage:', user ? 'Present' : 'Missing');
      
      if (!token) {
        showAlert({
          type: 'error',
          title: 'Authentication Error',
          message: 'No authentication token found. Please log in again.',
          buttonType: 'single',
          confirmText: 'OK',
          onConfirm: () => navigation.navigate('LogIn')
        });
        return;
      }

      let profileImageUrl = '';

      if (profileImage) {
        console.log('📤 Uploading profile image...');
        const uploadResult = await imageUploadService.uploadProfileImage(profileImage);
        
        if (!uploadResult.success) {
          showAlert({
            type: 'error',
            title: 'Image Upload Failed',
            message: uploadResult.error || 'Failed to upload profile image. Please try again.',
            buttonType: 'single',
            confirmText: 'OK',
            onConfirm: () => {}
          });
          return;
        }
        
        profileImageUrl = uploadResult.imageUrl || '';
        console.log('✅ Profile image uploaded successfully:', profileImageUrl);
      }

      const payload: OnboardingRequest = {
        name,
        contact,
        profileImageUrl,
      };

      console.log('📤 Sending payload:', payload);

      const response = await fetch('http://10.0.2.2:3000/auth/onboarding', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('📥 Response status:', response.status);

      const contentType = response.headers.get('content-type');
      
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.log('📥 Non-JSON response:', textResponse);
        throw new Error(`Server returned non-JSON response: ${textResponse}`);
      }

      const data = await response.json();
      console.log('📥 JSON response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Onboarding failed');
      }

      showAlert({
        type: 'success',
        title: 'Success!',
        message: 'Onboarding completed successfully!',
        buttonType: 'single',
        confirmText: 'Continue',
        onConfirm: () => navigation.navigate('Home')
      });
      
    } catch (error: any) {
      console.error('❌ Onboarding error:', error);
      showAlert({
        type: 'error',
        title: 'Onboarding Failed',
        message: error.message || 'Failed to complete onboarding. Please try again.',
        buttonType: 'single',
        confirmText: 'OK',
        onConfirm: () => {}
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test camera directly (for debugging)
  const testCameraDirect = () => {
    console.log('🧪 Testing camera directly...');
    takePhotoWithCamera();
  };

  // Fixed image options alert
  const showImageOptions = () => {
    console.log('🖼️ Showing image options...');
    showAlert({
      type: 'info',
      title: 'Profile Picture',
      message: 'Choose how you want to add your profile picture',
      buttonType: 'triple',
      cancelText: 'Cancel',
      option1Text: 'Camera',
      option2Text: 'Gallery',
      onCancel: () => {
        console.log('🖼️ User cancelled image selection');
        hideAlert();
      },
      onOption1: () => {
        console.log('🖼️ User selected camera');
        hideAlert();
        // Small delay to let alert close before opening camera
        setTimeout(() => {
          takePhotoWithCamera();
        }, 300);
      },
      onOption2: () => {
        console.log('🖼️ User selected gallery');
        hideAlert();
        // Small delay to let alert close before opening gallery
        setTimeout(() => {
          pickImageFromGallery();
        }, 300);
      }
    });
  }

  const handleContactVerify = () => {
    if (verificationStatus.contact) {
      setVerificationStatus((prev) => ({ ...prev, contact: false }))
      showAlert({
        type: 'info',
        title: 'Contact Reset',
        message: 'You can now enter a new contact number and verify it.',
        buttonType: 'single',
        confirmText: 'OK',
        onConfirm: () => {}
      });
      return
    }

    if (!contact.trim()) {
      showAlert({
        type: 'warning',
        title: 'Contact Required',
        message: 'Please enter your contact number first.',
        buttonType: 'single',
        confirmText: 'OK',
        onConfirm: () => {}
      });
      return
    }

    if (contact.length < 10) {
      showAlert({
        type: 'warning',
        title: 'Invalid Contact',
        message: 'Please enter a valid contact number.',
        buttonType: 'single',
        confirmText: 'OK',
        onConfirm: () => {}
      });
      return
    }

    setVerificationStatus((prev) => ({ ...prev, loading: true }))
    
    setTimeout(() => {
      setVerificationStatus((prev) => ({ ...prev, contact: true, loading: false }))
      showAlert({
        type: 'success',
        title: 'Contact Verified',
        message: 'Your contact number has been successfully verified.',
        buttonType: 'single',
        confirmText: 'OK',
        onConfirm: () => {}
      });
    }, 1000)
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Completing Onboarding...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContent,
            isKeyboardVisible ? styles.scrollContentKeyboard : undefined
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[
            styles.content,
            isKeyboardVisible ? styles.contentKeyboard : undefined
          ]}>
            {!isKeyboardVisible && (
              <View style={styles.iconContainer}>
                <Image source={require("../../assets/images/Logo_white_no_bg.png")} style={styles.Logo} />
              </View>
            )}

            {!isKeyboardVisible && (
              <>
                <Text style={styles.welcomeTitle}>Complete Your Profile</Text>
                <Text style={styles.welcomeSubtitle}>Finish setting up your account</Text>
              </>
            )}

            <FormBox style={isKeyboardVisible ? styles.formBoxKeyboard : undefined}>
              {!isKeyboardVisible && (
                <View style={styles.profileImageSection}>
                  <Text style={styles.profileImageLabel}>Profile Picture (Optional)</Text>
                  <TouchableOpacity onPress={showImageOptions} style={styles.profileImageContainer}>
                    {profileImage ? (
                      <Image source={{ uri: profileImage }} style={styles.profileImage} />
                    ) : (
                      <View style={styles.profileImagePlaceholder}>
                        <Text style={styles.profileImagePlaceholderText}>+</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={showImageOptions}>
                    <Text style={styles.changeImageText}>
                      {profileImage ? "Change Image" : "Add Profile Picture"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              <FormInput
                label="Full Name"
                placeholder="Enter your name"
                iconName="person-outline"
                value={name}
                onChangeText={setName}
              />

              <FormInput
                label="Contact Number"
                placeholder="Enter your contact"
                iconName="call-outline"
                value={contact}
                onChangeText={setContact}
                keyboardType="phone-pad"
              />

              <VerificationRow 
                type="contact" 
                isVerified={verificationStatus.contact} 
                onVerify={handleContactVerify}
              />

              <View style={styles.overallStatus}>
                <Text
                  style={[
                    styles.overallStatusText,
                    {
                      color: verificationStatus.contact
                        ? Colors.success || "#10B981"
                        : Colors.neutral500 || "#6B7280",
                    },
                  ]}
                >
                  {verificationStatus.contact
                    ? "✅ Contact verified"
                    : "0/1 verifications complete"}
                </Text>
              </View>

              <AnimatedButton title="Continue" onPress={handleContinue} style={styles.continueButton} />
            </FormBox>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Custom Alert */}
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primarybg,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  scrollContentKeyboard: {
    paddingTop: 35,
  },
  content: {
    flex: 1,
    paddingTop: 100,
    justifyContent: "center",
  },
  contentKeyboard: {
    paddingTop: 20,
    justifyContent: 'flex-start',
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 15,
  },
  Logo: {
    width: 70,
    height: 70,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.neutral1000,
    textAlign: "center",
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Colors.neutral500,
    textAlign: "center",
    marginBottom: 20,
  },
  formBoxKeyboard: {
    marginTop: 0,
  },
  profileImageSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImageLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.neutral1000,
    marginBottom: 12,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    marginBottom: 8,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  profileImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.neutral200 || "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.neutral300 || "#D1D5DB",
    borderStyle: "dashed",
  },
  profileImagePlaceholderText: {
    fontSize: 24,
    color: Colors.neutral500 || "#6B7280",
    fontWeight: "300",
  },
  changeImageText: {
    fontSize: 14,
    color: Colors.primary,
    textDecorationLine: "underline",
  },
  overallStatus: {
    backgroundColor: Colors.neutral50 || "#F9FAFB",
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    marginTop: 8,
  },
  overallStatusText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primarybg,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.neutral500,
    textAlign: 'center',
  },
  continueButton: {
    marginBottom: 24,
    marginTop: 8,
  },
})

export default OnboardingScreen