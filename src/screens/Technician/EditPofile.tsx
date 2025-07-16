import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';
import AnimatedButton from '../../components/AnimatedButton';
import BorderButton from '../../components/BorderButton';
import FormInput from '../../components/FormInput';

// Main Edit Profile Screen Component
const EditProfileScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: 'Mike',
    lastName: 'Rodriguez',
    email: 'mike.rodriguez@autoservice.com',
    phone: '+1 (555) 123-4567',
    employeeId: 'EMP001',
    department: 'Automotive Service',
    level: 'Senior Technician',
    address: '123 Main Street, Apt 4B',
    city: 'Springfield',
    state: 'CA',
    zipCode: '90210',
    emergencyContact: 'Maria Rodriguez',
    emergencyPhone: '+1 (555) 987-6543',
    bio: 'Experienced automotive technician with 8 years of expertise in engine diagnostics, brake systems, and hybrid vehicle maintenance.',
  });

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Success', 
        'Profile updated successfully!',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.goBack() 
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to discard your changes?',
      [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() }
      ]
    );
  };

  const handleChangeProfilePicture = () => {
    Alert.alert(
      'Change Profile Picture',
      'Select an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: () => console.log('Take photo') },
        { text: 'Choose from Library', onPress: () => console.log('Choose from library') }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
          {/* Profile Picture Section */}
          <View style={styles.profilePictureSection}>
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImagePlaceholder}>
                <Icon name="person" size={40} color={Colors.neutral500} />
              </View>
              <TouchableOpacity 
                style={styles.changePhotoButton}
                onPress={handleChangeProfilePicture}
              >
                <Icon name="camera" size={16} color={Colors.neutral0} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleChangeProfilePicture}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <FormInput
                  label="First Name"
                  value={formData.firstName}
                  onChangeText={(value) => updateField('firstName', value)}
                  placeholder="Enter first name"
                />
              </View>
              <View style={styles.halfWidth}>
                <FormInput
                  label="Last Name"
                  value={formData.lastName}
                  onChangeText={(value) => updateField('lastName', value)}
                  placeholder="Enter last name"
                />
              </View>
            </View>

            <FormInput
              label="Email"
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              placeholder="Enter email address"
              keyboardType="email-address"
            />

            <FormInput
              label="Phone Number"
              value={formData.phone}
              onChangeText={(value) => updateField('phone', value)}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />

            <FormInput
              label="Bio"
              value={formData.bio}
              onChangeText={(value) => updateField('bio', value)}
              placeholder="Tell us about yourself..."
              multiline={true}
            />
          </View>

          {/* Work Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Information</Text>
            
            <FormInput
              label="Employee ID"
              value={formData.employeeId}
              onChangeText={(value) => updateField('employeeId', value)}
              placeholder="Employee ID"
              editable={false}
            />

            <FormInput
              label="Department"
              value={formData.department}
              onChangeText={(value) => updateField('department', value)}
              placeholder="Department"
              editable={false}
            />

            <FormInput
              label="Level"
              value={formData.level}
              onChangeText={(value) => updateField('level', value)}
              placeholder="Job level"
              editable={false}
            />
          </View>

          {/* Address Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address</Text>
            
            <FormInput
              label="Street Address"
              value={formData.address}
              onChangeText={(value) => updateField('address', value)}
              placeholder="Enter street address"
            />

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <FormInput
                  label="City"
                  value={formData.city}
                  onChangeText={(value) => updateField('city', value)}
                  placeholder="Enter city"
                />
              </View>
              <View style={styles.quarterWidth}>
                <FormInput
                  label="State"
                  value={formData.state}
                  onChangeText={(value) => updateField('state', value)}
                  placeholder="State"
                />
              </View>
              <View style={styles.quarterWidth}>
                <FormInput
                  label="ZIP Code"
                  value={formData.zipCode}
                  onChangeText={(value) => updateField('zipCode', value)}
                  placeholder="ZIP"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Emergency Contact */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Emergency Contact</Text>
            
            <FormInput
              label="Contact Name"
              value={formData.emergencyContact}
              onChangeText={(value) => updateField('emergencyContact', value)}
              placeholder="Enter contact name"
            />

            <FormInput
              label="Contact Phone"
              value={formData.emergencyPhone}
              onChangeText={(value) => updateField('emergencyPhone', value)}
              placeholder="Enter contact phone"
              keyboardType="phone-pad"
            />
          </View>

          <View style={{flexDirection: 'row', flex: 1, gap: '5%', paddingHorizontal: 20,}}>

            <BorderButton 
              label="Cancel"
              onPress={() => navigation.navigate('TechnicianPofile')}
              style = {{width: '45%'}}
            />
            <AnimatedButton 
              title = "Save"
              onPress={() => navigation.navigate('TechnicianPofile')}
              style = {{width: 190}}
            />

          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral0,
    marginTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.neutral0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  headerButton: {
    minWidth: 60,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    textAlign: 'right',
  },
  disabledText: {
    color: Colors.neutral500,
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  profilePictureSection: {
    backgroundColor: Colors.neutral0,
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 8,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.neutral200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhotoButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.neutral0,
  },
  changePhotoText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  section: {
    backgroundColor: Colors.neutral0,
    padding: 20,
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral700,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.neutral300,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.neutral1000,
    backgroundColor: Colors.neutral0,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  disabledInput: {
    backgroundColor: Colors.neutral100,
    color: Colors.neutral600,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  quarterWidth: {
    width: '23%',
  },
  bottomPadding: {
    height: 40,
  },
});

export default EditProfileScreen;