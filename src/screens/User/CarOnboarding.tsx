import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import FormInput from '../../components/FormInput';
import Colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header'
import Button from '../../components/Button'
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary, launchCamera, ImagePickerResponse, MediaType, PhotoQuality } from 'react-native-image-picker';
import { imageUploadService } from '../../services/imageUpload.service';
import CustomAlert from '../../components/Alert';
import LoadingComponent from '../../components/Loading';

const CarOnboardingForm = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    year: '',
    number: '',
    image: '',
    color: '',
  });

  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
    title: '',
    message: '',
    buttonType: 'single' as 'none' | 'single' | 'double' | 'triple',
    confirmText: 'OK',
    onConfirm: () => {},
  });

  // Debug state for displaying stored user data
  const [debugUserData, setDebugUserData] = useState<any>(null);
  const [debugToken, setDebugToken] = useState<string>('');

  // Use debug variables to avoid linter warnings
  console.log('🔍 Debug state loaded:', { debugUserData, debugToken });

  // Load debug data on component mount
  useEffect(() => {
    const loadDebugData = async () => {
      try {
        const userStr = await AsyncStorage.getItem('user');
        const token = await AsyncStorage.getItem('token');

        if (userStr) {
          const user = JSON.parse(userStr);
          setDebugUserData(user);
          console.log('🔍 Debug - Stored User Data:', user);
        } else {
          console.log('🔍 Debug - No user data in AsyncStorage');
        }

        if (token) {
          setDebugToken(token.substring(0, 20) + '...');
          console.log('🔍 Debug - Token exists (first 20 chars):', token.substring(0, 20));
        } else {
          console.log('🔍 Debug - No token in AsyncStorage');
        }
      } catch (error) {
        console.error('🔍 Debug - Error loading debug data:', error);
      }
    };

    loadDebugData();
  }, []);
  // Valid colors list
  const validColors = [
    'white', 'black', 'gray', 'grey', 'silver', 'red', 'blue', 'green', 
    'yellow', 'orange', 'brown', 'purple', 'pink', 'gold', 'beige', 
    'maroon', 'navy', 'teal', 'lime', 'cyan', 'magenta', 'ivory'
  ];

  const updateField = (field: keyof typeof formData, value: string) => {
    console.log(`📝 Updating field '${field}' from '${formData[field]}' to '${value}'`);
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      console.log(`🧹 Clearing error for field '${field}':`, errors[field]);
      setErrors((prev: any) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateLicensePlate = (plate: string): boolean => {
    // AB-1234 or ABC-1234 pattern
    const pattern = /^[A-Z]{2,3}-\d{4}$/;
    return pattern.test(plate);
  };

  const validateYear = (year: string): boolean => {
    const yearNum = parseInt(year);
    return !isNaN(yearNum) && yearNum >= 1940 && yearNum <= 2025;
  };

  const validateColor = (color: string): boolean => {
    return validColors.includes(color.toLowerCase().trim());
  };

  const validate = () => {
    console.log('🔍 Starting validation with formData:', formData);
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Car name is required';
      console.log('❌ Name validation failed: empty');
    } else {
      console.log('✅ Name validation passed:', formData.name);
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
      console.log('❌ Model validation failed: empty');
    } else {
      console.log('✅ Model validation passed:', formData.model);
    }

    if (!formData.year.trim()) {
      newErrors.year = 'Year is required';
      console.log('❌ Year validation failed: empty');
    } else if (!validateYear(formData.year)) {
      newErrors.year = 'Year must be between 1940 and 2025';
      console.log('❌ Year validation failed: invalid year', formData.year);
    } else {
      console.log('✅ Year validation passed:', formData.year);
    }

    if (!formData.number.trim()) {
      newErrors.number = 'License plate number is required';
      console.log('❌ License plate validation failed: empty');
    } else if (!validateLicensePlate(formData.number)) {
      newErrors.number = 'License plate must be in format AB-1234 or ABC-1234';
      console.log('❌ License plate validation failed: invalid format', formData.number);
    } else {
      console.log('✅ License plate validation passed:', formData.number);
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Car image is required';
    }

    if (!formData.color.trim()) {
      newErrors.color = 'Color is required';
      console.log('❌ Color validation failed: empty');
    } else if (!validateColor(formData.color)) {
      newErrors.color = `Color must be one of: ${validColors.join(', ')}`;
      console.log('❌ Color validation failed: invalid color', formData.color);
    } else {
      console.log('✅ Color validation passed:', formData.color);
    }

    console.log('🔍 Validation result - newErrors:', newErrors);
    console.log('🔍 Validation result - error count:', Object.keys(newErrors).length);

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('🔍 Final validation result:', isValid ? 'VALID' : 'INVALID');

    return isValid;
  };

  const showAlert = (config: typeof alertConfig) => {
    setAlertConfig(config);
    setAlertVisible(true);
  };

  const hideAlert = () => setAlertVisible(false);

  const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to camera to take photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };


  const pickImageFromGallery = () => {
    console.log('Opening gallery...');
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      quality: 0.8 as PhotoQuality,
      maxWidth: 1024,
      maxHeight: 1024,
    };
    
    launchImageLibrary(options, async (response: ImagePickerResponse) => {
      console.log('Gallery response:', response);
      
      if (response.didCancel) {
        console.log('User cancelled gallery');
        return;
      }
      
      if (response.errorMessage) {
        console.error('Gallery error:', response.errorMessage);
        showAlert({ 
          type: 'error', 
          title: 'Gallery Error', 
          message: response.errorMessage, 
          buttonType: 'single', 
          confirmText: 'OK', 
          onConfirm: () => {} 
        });
        return;
      }
      
      const uri = response.assets?.[0]?.uri;
      if (!uri) {
        console.error('No image URI received');
        showAlert({ 
          type: 'error', 
          title: 'Error', 
          message: 'No image selected', 
          buttonType: 'single', 
          confirmText: 'OK', 
          onConfirm: () => {} 
        });
        return;
      }
      
      console.log('Selected image URI:', uri);
      setFormData((prev: any) => ({ ...prev, image: uri }));
      console.log('📝 Updated formData with local URI:', uri);
    });
  };

  const takePhotoWithCamera = async () => {
    console.log('Opening camera...');
    const hasPermission = await requestCameraPermission();
    
    if (!hasPermission) {
      showAlert({ 
        type: 'error', 
        title: 'Permission Denied', 
        message: 'Camera permission is required to take photos', 
        buttonType: 'single', 
        confirmText: 'OK', 
        onConfirm: () => {} 
      });
      return;
    }

    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxWidth: 1024,
      maxHeight: 1024,
      saveToPhotos: true,
    };
    
    launchCamera(options, async (response: ImagePickerResponse) => {
      console.log('Camera response:', response);
      
      if (response.didCancel) {
        console.log('User cancelled camera');
        return;
      }
      
      if (response.errorCode) {
        console.error('Camera error code:', response.errorCode);
        console.error('Camera error message:', response.errorMessage);
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
      
      if (response.errorMessage) {
        console.error('Camera error:', response.errorMessage);
        showAlert({ 
          type: 'error', 
          title: 'Camera Error', 
          message: response.errorMessage, 
          buttonType: 'single', 
          confirmText: 'OK', 
          onConfirm: () => {} 
        });
        return;
      }
      
      const uri = response.assets?.[0]?.uri;
      if (!uri) {
        console.error('No image URI received from camera');
        showAlert({ 
          type: 'error', 
          title: 'Error', 
          message: 'Failed to capture image', 
          buttonType: 'single', 
          confirmText: 'OK', 
          onConfirm: () => {} 
        });
        return;
      }
      
      console.log('Captured image URI:', uri);
      setFormData((prev: any) => ({ ...prev, image: uri }));
      console.log('📝 Updated formData with camera URI:', uri);
    });
  };

  const handleRegisterCar = async () => {
    console.log('🚗 ===== CAR REGISTRATION ATTEMPT =====');
    console.log('🚗 Current formData:', JSON.stringify(formData, null, 2));
    console.log('🚗 Current errors state:', JSON.stringify(errors, null, 2));
    console.log('🚗 Form data keys and values:');
    Object.entries(formData).forEach(([key, value]) => {
      console.log(`   ${key}: "${value}" (${typeof value})`);
    });

    if (!validate()) {
      console.log('❌ Validation failed with errors:', errors);
      console.log('❌ Form data at validation failure:', formData);

      // Show specific error details
      const errorMessages = Object.values(errors).filter((msg: any) => msg && typeof msg === 'string' && msg.trim() !== '');
      console.log('❌ Filtered error messages:', errorMessages);

      showAlert({
        type: 'error',
        title: 'Validation Error',
        message: errorMessages.length > 0
          ? `Please fix the following errors:\n${errorMessages.join('\n')}`
          : 'Please fix all errors before submitting',
        buttonType: 'single',
        confirmText: 'OK',
        onConfirm: () => {}
      });
      return;
    }

    console.log('✅ Validation passed, proceeding with submission');

    showAlert({
      type: 'info',
      title: 'Registering Car',
      message: 'Please wait while we register your car...',
      buttonType: 'single',
      confirmText: 'OK',
      onConfirm: () => {}
    })
    
    setIsLoading(true);
    try {
      const userStr = await AsyncStorage.getItem('user');
      console.log('Retrieved user from storage:', userStr);

      if (!userStr) {
        throw new Error('User not found. Please login again.');
      }

      const user = JSON.parse(userStr);
      const token = await AsyncStorage.getItem('token');
      console.log('Retrieved token:', token ? 'Token exists' : 'No token');

      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      // Get customer ID from stored user data
      const customerId = user.customerId;
      console.log('Customer ID from stored user:', customerId);

      if (!customerId) {
        throw new Error('Customer ID not found. Please complete your profile setup.');
      }

      let imageUrl = '';

      if (formData.image) {
        console.log('📤 Uploading car image...');
        // TEMPORARY: Try using profile image upload to see if it works
        const uploadResult = await imageUploadService.uploadProfileImage(formData.image);

        if (!uploadResult.success) {
          showAlert({
            type: 'error',
            title: 'Image Upload Failed',
            message: uploadResult.error || 'Failed to upload car image. Please try again.',
            buttonType: 'single',
            confirmText: 'OK',
            onConfirm: () => {}
          });
          return;
        }

        // Store the full Supabase URL directly
        imageUrl = uploadResult.imageUrl || '';
        console.log('✅ Car image uploaded successfully:', imageUrl);
      }

      const requestBody = {
        customerId: customerId,
        make: formData.name,
        model: formData.model,
        year: Number(formData.year),
        licensePlate: formData.number,
        imageUrl: imageUrl,
      };


      console.log('📤 Sending request to backend:');
      console.log('📤 URL: http://10.0.2.2:3000/vehicles');
      console.log('📤 Method: POST');
      console.log('📤 Headers:', {
        'Authorization': `Bearer ${token.substring(0, 20)}...`,
        'Content-Type': 'application/json',
      });
      console.log('📤 Request Body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(`http://10.0.2.2:3000/vehicles`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📥 Backend Response:');
      console.log('📥 Status:', response.status);
      console.log('📥 Status Text:', response.statusText);
      console.log('📥 Headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('📥 Response Data:', JSON.stringify(data, null, 2));
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to register car');
      }
      
      showAlert({ 
        type: 'success', 
        title: 'Success', 
        message: 'Car registered successfully!', 
        buttonType: 'single', 
        confirmText: 'OK', 
        onConfirm: () => navigation.navigate('Cars') 
      });
      
    } catch (error: any) {
      console.error('Car registration failed:', error);
      showAlert({ 
        type: 'error', 
        title: 'Registration Failed', 
        message: error.message || 'Failed to register car. Please try again.', 
        buttonType: 'single', 
        confirmText: 'OK', 
        onConfirm: () => {} 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <Header
        icon='back'
      />

      {/* Debug Panel - Remove this in production */}
        {/* <View style={styles.debugPanel}>
          <Text style={styles.debugTitle}>🔍 Debug Info</Text>
          <Text style={styles.debugText}>
            User ID: {debugUserData?.id || 'Not found'}
          </Text>
          <Text style={styles.debugText}>
            Email: {debugUserData?.email || 'Not found'}
          </Text>
          <Text style={styles.debugText}>
            Role: {debugUserData?.role || 'Not found'}
          </Text>
          <Text style={styles.debugText}>
            Customer ID: {debugUserData?.customerId || 'Not found'}
          </Text>
          <Text style={styles.debugText}>
            Token: {debugToken || 'Not found'}
          </Text>
          <Text style={styles.debugText}>
            Registration Complete: {debugUserData?.isRegistrationComplete ? 'Yes' : 'No'}
          </Text>
        </View> */}

      <View style={styles.imageSection}>
        {formData.image ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: formData.image }}
              style={styles.imagePreview}
              resizeMode="cover"
              onError={(error) => {
                console.error('Image load error:', error);
                setErrors((prev: any) => ({ ...prev, image: 'Invalid image URL' }));
              }}
            />
            <View style={styles.imageOverlay}>
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => updateField('image', '')}
              >
                <Icon name="trash-outline" size={16} color={Colors.neutral0} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.imagePlaceholder}>
            <Icon name="camera-outline" size={32} color={Colors.neutral400} />
            <Text style={styles.imagePlaceholderText}>Add Car Photo</Text>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
              <TouchableOpacity 
                onPress={pickImageFromGallery}
                style={styles.imageButton}
              >
                <Text style={styles.imageButtonText}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={takePhotoWithCamera}
                style={styles.imageButton}
              >
                <Text style={styles.imageButtonText}>Camera</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >

        <FormInput
          label="Car Name"
          placeholder="Toyota Camry"
          iconName="car-outline"
          value={formData.name}
          onChangeText={text => updateField('name', text)}
          error={errors.name}
        />

        <FormInput
          label="Model"
          placeholder="XLE Premium"
          iconName="build-outline"
          value={formData.model}
          onChangeText={text => updateField('model', text)}
          error={errors.model}
        />

        <FormInput
          label="Year"
          placeholder="2024 (1940-2025)"
          keyboardType="numeric"
          iconName="calendar-outline"
          value={formData.year}
          onChangeText={text => updateField('year', text)}
          error={errors.year}
        />

        <FormInput
          label="License Plate"
          placeholder="AB-1234 or ABC-1234"
          iconName="card-outline"
          value={formData.number}
          onChangeText={text => updateField('number', text.toUpperCase())}
          autoCapitalize="characters"
          error={errors.number}
        />

        <FormInput
          label="Color"
          placeholder={`e.g. ${validColors.slice(0, 5).join(', ')}...`}
          iconName="color-palette-outline"
          value={formData.color}
          onChangeText={text => updateField('color', text)}
          containerStyle={{marginBottom: -140}}
          error={errors.color}
        />
      </ScrollView>
      
      <View style={{ height: 20 }} />
      
      <Button
        label={isLoading ? 'Registering...' : 'Register Car'}
        onPress={handleRegisterCar}
        containerStyle={{marginBottom: 30, marginHorizontal: 25}}
      />

      <CustomAlert
        visible={alertVisible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        buttonType={alertConfig.buttonType}
        confirmText={alertConfig.confirmText}
        onClose={hideAlert}
      />
      
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <LoadingComponent 
            loadingText="Processing..." 
            containerStyle={{}} 
            textStyle={{}} 
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.neutral0,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 150,
  },
  imageSection: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: Colors.neutral900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.neutral100,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 12,
  },
  removeImageButton: {
    backgroundColor: Colors.danger,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    height: 200,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.neutral200,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.neutral50,
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: Colors.neutral400,
    marginTop: 8,
    fontWeight: '500',
  },
  imageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  imageButtonText: {
    color: Colors.neutral0,
    fontWeight: '500',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  debugPanel: {
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#0ea5e9',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#374151',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
});

export default CarOnboardingForm;