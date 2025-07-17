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
import Colors from "../constants/colors";
import FormBox from "../components/FormBox";
import Header from "../components/Header";
import FormInput from "../components/FormInput";
import VerificationRow from "../components/Verification";
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';

interface VerificationStatus {
  email: boolean;
  contact: boolean;
}

const EditProfileScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [profileData, setProfileData] = useState({
    username: "john_doe",
    email: "johndoe@email.com",
    fullName: "John Doe",
    phoneNumber: "+94 71 481 0928",
    profileImage: "",
    bio: "Software developer passionate about mobile apps and user experience.",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [email, setEmail] = useState(profileData.email);
  const [contact, setContact] = useState(profileData.phoneNumber);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
    email: true,
    contact: true,
  });

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

  const handleEmailVerify = () => {
    if (verificationStatus.email) {
      setVerificationStatus((prev) => ({ ...prev, email: false }));
      Alert.alert("Email Reset", "You can now enter a new email address and verify it.");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Email Required", "Please enter your email address first.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    setTimeout(() => {
      setVerificationStatus((prev) => ({ ...prev, email: true }));
      Alert.alert("Email Verified", "Your email has been successfully verified.");
    }, 1000);
  };

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
          console.log("Camera selected");
          handleInputChange("profileImage", "https://via.placeholder.com/150");
        },
      },
      {
        text: "Gallery",
        onPress: () => {
          console.log("Gallery selected");
          handleInputChange("profileImage", "https://via.placeholder.com/150/0000FF/FFFFFF");
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

    if (!email.trim()) {
      Alert.alert("Error", "Email is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    if (!verificationStatus.email || !verificationStatus.contact) {
      Alert.alert("Verification Required", "Please verify both email and contact before saving.");
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert("Success", "Profile updated successfully!", [
        {
          text: "OK",
          onPress: () => {
            setHasChanges(false);
            console.log("Navigate back to profile");
          },
        },
      ]);
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
      <Header icon="back" name="Edit Profile" onIconPress={() => navigation.navigate('Profile')} />

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.imageSection}>
            <TouchableOpacity style={styles.imageContainer} onPress={handleChangeProfilePicture} activeOpacity={0.8}>
              {renderProfileImage()}
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
              label="Username"
              value={profileData.username}
              onChangeText={(text) =>
                handleInputChange("username", text.toLowerCase().replace(/[^a-z0-9_]/g, ""))
              }
              placeholder="Enter your username"
              iconName="at-outline"
              maxLength={30}
            />

            <FormInput
              label="Email"
              placeholder="Enter your email"
              iconName="mail-outline"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <VerificationRow type="email" isVerified={verificationStatus.email} onVerify={handleEmailVerify} />

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

              style = {{marginBottom: -10}}
            />
          </FormBox>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel} disabled={isLoading}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

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
