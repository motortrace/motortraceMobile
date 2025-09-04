import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import FormInput from '../../components/FormInput';
import Colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header'
import Button from '../../components/Button'
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev: any) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const newErrors: any = {};
    if (!formData.name.trim()) newErrors.name = 'Car name is required';
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (!formData.year.trim()) newErrors.year = 'Year is required';
    if (!formData.number.trim()) newErrors.number = 'License plate number is required';
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';
    if (!formData.color.trim()) newErrors.color = 'Color is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegisterCar = async () => {
    if (!validate()) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }
    setIsLoading(true);
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (!userStr) throw new Error('User not found');
      const user = JSON.parse(userStr);
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const response = await fetch(`http://10.0.2.2:3000/vehicles/${user.id}/vehicles`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicleName: formData.name,
          model: formData.model,
          year: formData.year,
          licensePlate: formData.number,
          color: formData.color,
          image: formData.image,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add car');
      Alert.alert('Success', 'Car onboarded successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Cars') }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add car');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <Header 
        icon = 'back'
        name = 'Jhon Doe'
        onIconPress={() => navigation.navigate('Cars')}
      />

               <View style={styles.imageSection}>
          {formData.image ? (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: formData.image }}
                style={styles.imagePreview}
                resizeMode="cover"
                onError={() =>
                  setErrors(prev => ({ ...prev, image: 'Invalid image URL' }))
                }
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
            </View>
          )}
        </View>

      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >

          <FormInput
            label="Car Image URL"
            placeholder="https://example.com/car-image.jpg"
            iconName="image-outline"
            value={formData.image}
            onChangeText={text => updateField('image', text)}
            containerStyle={{marginTop: 0}}
          />

              <FormInput
                label="Car Name"
                placeholder="Toyota Camry"
                iconName="car-outline"
                value={formData.name}
                onChangeText={text => updateField('name', text)}
              />

              <FormInput
                label="Model"
                placeholder="XLE Premium"
                iconName="build-outline"
                value={formData.model}
                onChangeText={text => updateField('model', text)}
              />
              <FormInput
                label="Year"
                placeholder="2024"
                keyboardType="numeric"
                iconName="calendar-outline"
                value={formData.year}
                onChangeText={text => updateField('year', text)}
              />

          <FormInput
            label="License Plate"
            placeholder="ABC-1234"
            iconName="card-outline"
            value={formData.number}
            onChangeText={text => updateField('number', text.toUpperCase())}
            autoCapitalize="characters"
          />
          <FormInput
            label="Color"
            placeholder="e.g. White, Black, Red..."
            iconName="color-palette-outline"
            value={formData.color}
            onChangeText={text => updateField('color', text)}
            containerStyle={{marginBottom: -140}}
          />
        </ScrollView>
        <View style={{ height: 20 }} /> {/* Spacer for button */}
      <Button
        label={isLoading ? 'Registering...' : 'Register Car'}
        onPress={handleRegisterCar}
        containerStyle= {{marginBottom: 30, marginHorizontal: 25}}
        disabled={isLoading}
      />

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

  // Image Section
  imageSection: {
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

  // Form Section
  formSection: {
    gap: 0,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  formColumn: {
    flex: 1,
  },
  formSpacer: {
    width: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral900,
    marginTop: 16,
    marginBottom: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: Colors.neutral50,
  },
  picker: {
    height: 44,
    width: '100%',
  },
});

export default CarOnboardingForm;