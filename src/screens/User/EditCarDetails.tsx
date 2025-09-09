import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/colors';
import Header from '../../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '../../components/Alert';
import LoadingComponent from '../../components/Loading';
import { launchImageLibrary, launchCamera, ImagePickerResponse, MediaType, PhotoQuality } from 'react-native-image-picker';
import FormInput from '../../components/FormInput';

const EditCarDetailsPage = ({ route, navigation }) => {
  const { carData } = route?.params || {};

  const [formData, setFormData] = useState({
    name: 'Toyota Camry',
    nickname: 'Speedster',
    model: 'XSE',
    year: '2021',
    number: 'MH 12 AB 1234',
    image: '',
    status: 'active',
  });

  const [errors, setErrors] = useState({});
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

  const statusOptions = [
    { value: 'active', label: 'Active', icon: 'checkmark-circle', color: Colors.success },
    { value: 'maintenance', label: 'Maintenance', icon: 'build', color: Colors.warning },
    { value: 'inactive', label: 'Inactive', icon: 'pause-circle', color: Colors.Purple },
    { value: 'issues', label: 'Has Issues', icon: 'warning', color: Colors.danger },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.image.trim()) {
      newErrors.image = 'Car image URL is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showAlert = (c: typeof alertConfig) => { setAlertConfig(c); setAlertVisible(true); };
  const hideAlert = () => setAlertVisible(false);

  const uploadImageToStorage = async (uri: string): Promise<string | null> => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const form = new FormData();
      const name = uri.split('/').pop() || `image_${Date.now()}.jpg`;
      const type = name.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
      form.append('profileImage', { uri, name, type } as any);
      const res = await fetch('http://10.0.2.2:3000/storage/profile-image', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        body: form,
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.error || 'Upload failed');
      return data.data?.imageUrl || null;
    } catch (e: any) {
      showAlert({ type: 'error', title: 'Upload Failed', message: e.message || 'Try again', buttonType: 'single', confirmText: 'OK', onConfirm: () => {} });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = () => {
    const options = { mediaType: 'photo' as MediaType, includeBase64: false, quality: 1 as PhotoQuality };
    launchImageLibrary(options, async (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) return;
      const uri = response.assets?.[0]?.uri; if (!uri) return;
      const uploaded = await uploadImageToStorage(uri);
      if (uploaded) setFormData(prev => ({ ...prev, image: uploaded }));
    });
  };

  const takePhoto = () => {
    const options = { mediaType: 'photo' as MediaType, includeBase64: false, quality: 1 as PhotoQuality, saveToPhotos: true };
    launchCamera(options, async (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) return;
      const uri = response.assets?.[0]?.uri; if (!uri) return;
      const uploaded = await uploadImageToStorage(uri);
      if (uploaded) setFormData(prev => ({ ...prev, image: uploaded }));
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header
        icon="back"
        onPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.imagePreviewSection}>
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => Alert.alert('Change Car Image', 'Choose source', [
              { text: 'Gallery', onPress: pickImage },
              { text: 'Camera', onPress: takePhoto },
              { text: 'Cancel', style: 'cancel' },
            ])}
            style={styles.imageWrapper}
        >
            {formData.image ? (
            <Image
                source={{ uri: formData.image }}
                style={styles.carImagePreview}
                onError={() => {
                setErrors(prev => ({
                    ...prev,
                    image: 'Invalid image URL',
                }));
                }}
            />
            ) : (
            <View style={styles.imagePlaceholder}>
                <Icon name="car-outline" size={40} color={Colors.neutral400} />
                <Text style={styles.imagePlaceholderText}>Car Image Preview</Text>
            </View>
            )}

            {/* Edit icon overlay */}
            <View style={styles.editImageIcon}>
            <Icon name="pencil" size={20} color={Colors.neutral0} />
            </View>
        </TouchableOpacity>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Edit Car</Text>
          <FormInput 
            label='Nickname'
            value={formData.nickname}
            onChangeText={(text: string) => setFormData(prev => ({ ...prev, nickname: text }))}
            inputWrapperStyle={{marginTop: 10, marginBottom: -15}}
          />
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Car Status</Text>
          <View style={styles.statusGrid}>
            <Text style={{ color: Colors.neutral500 }}>Status cannot be edited here.</Text>
          </View>
        </View>

        <View style={styles.saveButtonContainer}>
          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            onPress={() => {}}
            disabled={isLoading}
          >
            {isLoading ? (
              <Text style={styles.saveButtonText}>Saving...</Text>
            ) : (
              <>
                <Icon name="checkmark" size={20} color={Colors.neutral0} />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      {isLoading && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <LoadingComponent loadingText="Uploading image" containerStyle={{}} textStyle={{}} />
        </View>
      )}
      <CustomAlert
        visible={alertVisible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        buttonType={alertConfig.buttonType}
        confirmText={alertConfig.confirmText}
        onClose={hideAlert}
      />
    </KeyboardAvoidingView>
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
  imageWrapper: {
  position: 'relative',
  borderRadius: 16,
  overflow: 'hidden',
},

editImageIcon: {
  position: 'absolute',
  top: 10,
  right: 10,
  backgroundColor: Colors.primary,
  padding: 6,
  borderRadius: 20,
  elevation: 4,
  shadowColor: '#000',
  shadowOpacity: 0.2,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 3,
  zIndex: 10,
},
  imagePreviewSection: {
    margin: 16,
    marginBottom: 8,
  },
  carImagePreview: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    backgroundColor: Colors.neutral100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.neutral200,
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: Colors.neutral400,
    marginTop: 8,
  },
  formCard: {
    backgroundColor: Colors.neutral0,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral900,
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral700,
    marginBottom: 8,
  },
  required: {
    color: Colors.danger,
  },
  formInput: {
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.neutral900,
    backgroundColor: Colors.neutral0,
  },
  formInputError: {
    borderColor: Colors.danger,
  },
  errorText: {
    fontSize: 12,
    color: Colors.danger,
    marginTop: 4,
  },
  readOnlyField: {
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.neutral50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  readOnlyText: {
    fontSize: 16,
    color: Colors.neutral600,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusOption: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.neutral0,
    gap: 8,
  },
  statusOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  statusOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral700,
  },
  statusOptionTextActive: {
    color: Colors.neutral0,
    fontWeight: '600',
  },
  saveButtonContainer: {
    marginHorizontal: 16,
    marginBottom: 32,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.neutral300,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral0,
  },
});

export default EditCarDetailsPage;
