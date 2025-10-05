import React, { useState } from 'react';
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
  // Valid colors list
  const validColors = [
    'white', 'black', 'gray', 'grey', 'silver', 'red', 'blue', 'green', 
    'yellow', 'orange', 'brown', 'purple', 'pink', 'gold', 'beige', 
    'maroon', 'navy', 'teal', 'lime', 'cyan', 'magenta', 'ivory'
  ];

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev: any) => ({ ...prev, [field]: undefined }));
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
    const newErrors: any = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Car name is required';
    }
    
    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }
    
    if (!formData.year.trim()) {
      newErrors.year = 'Year is required';
    } else if (!validateYear(formData.year)) {
      newErrors.year = 'Year must be between 1940 and 2025';
    }
    
    if (!formData.number.trim()) {
      newErrors.number = 'License plate number is required';
    } else if (!validateLicensePlate(formData.number)) {
      newErrors.number = 'License plate must be in format AB-1234 or ABC-1234';
    }
    
    if (!formData.image.trim()) {
      newErrors.image = 'Car image is required';
    }
    
    if (!formData.color.trim()) {
      newErrors.color = 'Color is required';
    } else if (!validateColor(formData.color)) {
      newErrors.color = `Color must be one of: ${validColors.join(', ')}`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const uploadImageToStorage = async (uri: string): Promise<string | null> => {
    try {
      setIsLoading(true);
      // Use the car image upload service instead of profile image
      const result = await imageUploadService.uploadCarImage(uri);
      if (!result.success || !result.imageUrl) {
        throw new Error(result.error || 'Upload failed');
      }
      return result.imageUrl;
    } catch (err: any) {
      console.error('Image upload error:', err);
      showAlert({ 
        type: 'error', 
        title: 'Upload Failed', 
        message: err.message || 'Could not upload image. Please try again.', 
        buttonType: 'single', 
        confirmText: 'OK', 
        onConfirm: () => {} 
      });
      return null;
    } finally {
      setIsLoading(false);
    }
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
      const uploadedUrl = await uploadImageToStorage(uri);
      if (uploadedUrl) {
        setFormData((prev: any) => ({ ...prev, image: uploadedUrl }));
        showAlert({ 
          type: 'success', 
          title: 'Image Uploaded', 
          message: 'Your car image was uploaded successfully.', 
          buttonType: 'single', 
          confirmText: 'OK', 
          onConfirm: () => {} 
        });
      }
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
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
      saveToPhotos: true,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
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
      const uploadedUrl = await uploadImageToStorage(uri);
      if (uploadedUrl) {
        setFormData((prev: any) => ({ ...prev, image: uploadedUrl }));
        showAlert({ 
          type: 'success', 
          title: 'Image Uploaded', 
          message: 'Your car image was uploaded successfully.', 
          buttonType: 'single', 
          confirmText: 'OK', 
          onConfirm: () => {} 
        });
      }
    });
  };

  const handleRegisterCar = async () => {
    console.log('Attempting to register car with data:', formData);
    
    if (!validate()) {
      console.log('Validation failed with errors:', errors);
      showAlert({ 
        type: 'error', 
        title: 'Validation Error', 
        message: 'Please fix all errors before submitting', 
        buttonType: 'single', 
        confirmText: 'OK', 
        onConfirm: () => {} 
      });
      return;
    }

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

      // Get customer ID by email
      console.log('Fetching customer info for user:', user.email);
      const customerRes = await fetch(`http://10.0.2.2:3000/customers?email=${encodeURIComponent(user.email)}&limit=1`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const customerData = await customerRes.json();
      console.log('Customer data:', customerData);

      if (!customerRes.ok || !customerData.success || !customerData.data || customerData.data.length === 0) {
        throw new Error('Could not find customer information. Please complete your profile setup.');
      }

      const customerId = customerData.data[0].id;
      console.log('Customer ID:', customerId);

      const requestBody = {
        customerId: customerId,
        make: formData.name,
        model: formData.model,
        year: Number(formData.year),
        licensePlate: formData.number,
        color: formData.color,
        imageUrl: formData.image,
      };
      
      console.log('Sending request with body:', requestBody);
      
      const response = await fetch(`http://10.0.2.2:3000/vehicles`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
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
        disabled={isLoading}
      />

      <CustomAlert
        visible={alertVisible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        buttonType={alertConfig.buttonType}
        confirmText={alertConfig.confirmText}
        onClose={hideAlert}
        onConfirm={alertConfig.onConfirm}
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
});

export default CarOnboardingForm;