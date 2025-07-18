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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header
        icon="back"
        name="Edit Car Details"
        image=""
        onIconPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.imagePreviewSection}>
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => Alert.alert('Change Car Image', 'Image picker coming soon!')}
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
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.formLabel}>Car Name</Text>
                <Text style={styles.readOnlyText}>{formData.name || 'N/A'}</Text>
            </View>

            <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.formLabel}>Model</Text>
                <Text style={styles.readOnlyText}>{formData.model || 'N/A'}</Text>
            </View>
          </View>
                    
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.formLabel}>Year</Text>
                <Text style={styles.readOnlyText}>{formData.year || 'N/A'}</Text>
            </View>

            <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.formLabel}>License plate</Text>
                <Text style={styles.readOnlyText}>{formData.number || 'N/A'}</Text>
            </View>
          </View>


          <FormInput 
            label='Nickname'
            value={formData.nickname}
            inputWrapperStyle={{marginTop: 10, marginBottom: -15}}
          />

        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Car Status</Text>
          <View style={styles.statusGrid}>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.statusOption,
                  formData.status === option.value && styles.statusOptionActive,
                ]}
                onPress={() => updateFormData('status', option.value)}
              >
                <Icon
                  name={option.icon}
                  size={20}
                  color={formData.status === option.value ? Colors.neutral0 : option.color}
                />
                <Text
                  style={[
                    styles.statusOptionText,
                    formData.status === option.value && styles.statusOptionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
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
