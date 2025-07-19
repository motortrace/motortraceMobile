import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, Alert, TouchableOpacity, Image } from "react-native"
import { launchImageLibrary, launchCamera, ImagePickerResponse, MediaType } from 'react-native-image-picker'
import Colors from "../../constants/colors"
import FormBox from "../../components/FormBox"
import FormInput from "../../components/FormInput"
import AnimatedButton from "../../components/AnimatedButton"
import VerificationRow from "../../components/Verification"
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';

interface OnboardingScreenProps {
  onContinue?: (name: string, contact: string, profileImage: string | null) => void
}

interface VerificationStatus {
  contact: boolean
  loading: boolean
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onContinue }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
    contact: false,
    loading: false,
  })

  const pickImage = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
    }

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return
      }

      if (response.assets && response.assets[0]) {
        setProfileImage(response.assets[0].uri || null)
      }
    })
  }

  const takePhoto = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
    }

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return
      }

      if (response.assets && response.assets[0]) {
        setProfileImage(response.assets[0].uri || null)
      }
    })
  }

  const showImageOptions = () => {
    Alert.alert(
      "Profile Picture",
      "Choose an option",
      [
        { text: "Camera", onPress: takePhoto },
        { text: "Gallery", onPress: pickImage },
        { text: "Cancel", style: "cancel" },
      ]
    )
  }

  const handleContactVerify = () => {
    if (verificationStatus.contact) {
      setVerificationStatus((prev) => ({ ...prev, contact: false }))
      Alert.alert("Contact Reset", "You can now enter a new contact number and verify it.")
      return
    }

    if (!contact.trim()) {
      Alert.alert("Contact Required", "Please enter your contact number first.")
      return
    }

    if (contact.length < 10) {
      Alert.alert("Invalid Contact", "Please enter a valid contact number.")
      return
    }

    setTimeout(() => {
      setVerificationStatus((prev) => ({ ...prev, contact: true }))
      Alert.alert("Contact Verified", "Your contact number has been successfully verified.")
    }, 1000)
  }

  const handleContinue = () => {
    if (!name.trim() || !contact.trim()) {
      Alert.alert("Incomplete", "Please fill in all fields")
      return
    }

    if (!verificationStatus.contact) {
      Alert.alert("Verification Required", "Please verify your contact number")
      return
    }

    onContinue?.(name, contact, profileImage)
    navigation.navigate('Home')
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Image source={require("../../assets/images/Logo_white_no_bg.png")} style={styles.Logo} />
        </View>

        <Text style={styles.welcomeTitle}>Welcome Back</Text>
        <Text style={styles.welcomeSubtitle}>Sign in to your car account</Text>

        <FormBox>
          {/* Profile Image Section */}
          <View style={styles.profileImageSection}>
            <Text style={styles.profileImageLabel}>Profile Picture</Text>
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

          <VerificationRow type="contact" isVerified={verificationStatus.contact} onVerify={handleContactVerify} />

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

          <AnimatedButton title="Continue" onPress={handleContinue} />
        </FormBox>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primarybg,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    justifyContent: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
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
    marginBottom: 30,
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
})

export default OnboardingScreen