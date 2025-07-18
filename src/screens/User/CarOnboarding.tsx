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

const CarOnboardingForm = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    year: '',
    number: '',
    image: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Car name is required';
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (!formData.year.trim()) newErrors.year = 'Year is required';
    if (!formData.number.trim()) newErrors.number = 'License plate number is required';
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', 'Car onboarded successfully!');
      onSubmit?.(formData);
    }, 1500);
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
      </ScrollView>

      <Button
        label='Register Car'
        onPress={() => {}}
        containerStyle= {{marginBottom: 30, marginHorizontal: 25}}
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
    paddingBottom: 100,
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
});

export default CarOnboardingForm;