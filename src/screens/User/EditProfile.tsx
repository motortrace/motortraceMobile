import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
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
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

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
  const [email, setEmail] = useState(profileData.email);
  const [contact, setContact] = useState(profileData.phoneNumber);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
    email: true,
    contact: true,
  });

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userStr = await AsyncStorage.getItem('user');
        if (!userStr) return;
        const user = JSON.parse(userStr);
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const res = await fetch(`http://10.0.2.2:3000/profiles/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        if (data.role === 'car_owner' && data.profile) {
          setProfileData({
            fullName: data.profile.name || "",
            phoneNumber: data.phone || "",
            profileImage: data.profile.imageBase64 || "",
            email: data.email || "",
          });
        }
      } catch (err) {
        Alert.alert("Error", "Failed to fetch profile data.");
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (verificationStatus.email) {
      setVerificationStatus((prev) => ({ ...prev, email: true }));
    }
  }, [email]);

  useEffect(() => {
    if (verificationStatus.contact) {
      setVerificationStatus((prev) => ({ ...prev, contact: true }));
    }
  }, [contact]);

  const handleContactVerify = () => {
    if (verificationStatus.contact) {
      setVerificationStatus((prev) => ({ ...prev, contact: false }));
      Alert.alert("Contact Reset", "You can now enter a new contact number and verify it.");
      return;
    }

    if (!contact.trim()) {
      Alert.alert("Contact Required", "Please enter your contact number first.");
      return;
    }

    if (contact.length < 10) {
      Alert.alert("Invalid Contact", "Please enter a valid contact number.");
      return;
    }

    setTimeout(() => {
      setVerificationStatus((prev) => ({ ...prev, contact: true }));
      Alert.alert("Contact Verified", "Your contact number has been successfully verified.");
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleChangeProfilePicture = () => {
    Alert.alert("Change Profile Picture", "Choose an option", [
      {
        text: "Camera",
        onPress: () => {
          launchCamera(
            { mediaType: 'photo', quality: 1 },
            (response) => {
              if (response.didCancel || response.errorMessage) return;
              if (response.assets && response.assets[0]) {
                handleInputChange("profileImage", response.assets[0].uri);
              }
            }
          );
        },
      },
      {
        text: "Gallery",
        onPress: () => {
          launchImageLibrary(
            { mediaType: 'photo', quality: 1 },
            (response) => {
              if (response.didCancel || response.errorMessage) return;
              if (response.assets && response.assets[0]) {
                handleInputChange("profileImage", response.assets[0].uri);
              }
            }
          );
        },
      },
      {
        text: "Remove Photo",
        style: "destructive",
        onPress: () => handleInputChange("profileImage", ""),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleSave = async () => {
    if (!hasChanges) {
      Alert.alert("No Changes", "No changes were made to save.");
      return;
    }
    if (!profileData.fullName.trim()) {
      Alert.alert("Error", "Full name is required.");
      return;
    }
    setIsLoading(true);
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (!userStr) return;
      const user = JSON.parse(userStr);
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      // Only send allowed fields
      const payload = {
        name: profileData.fullName,
        phone: profileData.phoneNumber,
        image: profileData.profileImage,
      };

      const res = await fetch(`http://10.0.2.2:3000/profiles/${user.id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      Alert.alert("Success", "Profile updated successfully!");
      setHasChanges(false);
      navigation.navigate("Profile");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert("Discard Changes", "You have unsaved changes. Are you sure you want to go back?", [
        { text: "Stay", style: "cancel" },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => console.log("Navigate back without saving"),
        },
      ]);
    } else {
      console.log("Navigate back");
    }
  };

  const renderProfileImage = () => {
    if (profileData.profileImage) {
      return <Image source={{ uri: profileData.profileImage }} style={styles.profileImage} />;
    } else {
      return (
        <View style={styles.profileImagePlaceholder}>
          <Icon name="person" size={50} color={Colors.primary} />
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header icon="back" name="Edit Profile" onIconPress={() => navigation.goBack()} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.imageSection}>
          <TouchableOpacity style={styles.imageContainer} onPress={handleChangeProfilePicture} activeOpacity={0.8}>
            {profileData.profileImage ? (
              <Image source={{ uri: profileData.profileImage }} style={styles.profileImage} />
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
            label="Email"
            placeholder="Email"
            iconName="mail-outline"
            value={profileData.email}
            editable={false} // Make email read-only
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

            style = {{marginBottom: -10}}
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
