import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, SafeAreaView, Alert, TouchableOpacity, Image } from "react-native"
import Colors from "../constants/colors"
import FormBox from "../components/FormBox"
import FormInput from "../components/FormInput"
import AnimatedButton from "../components/AnimatedButton"
import VerificationRow from "../components/Verification"
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';

interface OnboardingScreenProps {
  onContinue?: (name: string, email: string, contact: string) => void
}

interface VerificationStatus {
  email: boolean
  contact: boolean
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onContinue }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [contact, setContact] = useState("")
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
    email: false,
    contact: false,
  })

  useEffect(() => {
    // Reset email verification if email changes
    if (verificationStatus.email) {
      setVerificationStatus((prev) => ({ ...prev, email: false }))
    }
  }, [email])

  useEffect(() => {
    // Reset contact verification if contact changes
    if (verificationStatus.contact) {
      setVerificationStatus((prev) => ({ ...prev, contact: false }))
    }
  }, [contact])

  const handleEmailVerify = () => {
    // If already verified, reset verification status to allow change
    if (verificationStatus.email) {
      setVerificationStatus((prev) => ({ ...prev, email: false }))
      Alert.alert("Email Reset", "You can now enter a new email address and verify it.")
      return
    }

    if (!email.trim()) {
      Alert.alert("Email Required", "Please enter your email address first.")
      return
    }

    if (!email.includes("@") || !email.includes(".")) {
      Alert.alert("Invalid Email", "Please enter a valid email address.")
      return
    }

    // Mock email verification process
    setTimeout(() => {
      setVerificationStatus((prev) => ({ ...prev, email: true }))
      Alert.alert("Email Verified", "Your email has been successfully verified.")
    }, 1000)
  }

  const handleContactVerify = () => {
    // If already verified, reset verification status to allow change
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

    // Mock contact verification process
    setTimeout(() => {
      setVerificationStatus((prev) => ({ ...prev, contact: true }))
      Alert.alert("Contact Verified", "Your contact number has been successfully verified.")
    }, 1000)
  }

  const handleContinue = () => {
    if (!name.trim() || !email.trim() || !contact.trim()) {
      Alert.alert("Incomplete", "Please fill in all fields")
      return
    }

    if (!verificationStatus.email || !verificationStatus.contact) {
      Alert.alert("Verification Required", "Please verify both your email and contact number")
      return
    }

    onContinue?.(name, email, contact)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Image source={require("../assets/images/Logo_white_no_bg.png")} style={styles.Logo} />
        </View>

        <Text style={styles.welcomeTitle}>Welcome Back</Text>
        <Text style={styles.welcomeSubtitle}>Sign in to your car account</Text>

        <FormBox>
          <FormInput
            label="Full Name"
            placeholder="Enter your name"
            iconName="person-outline"
            value={name}
            onChangeText={setName}
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

          <VerificationRow type="contact" isVerified={verificationStatus.contact} onVerify={handleContactVerify} />

          <View style={styles.overallStatus}>
            <Text
              style={[
                styles.overallStatusText,
                {
                  color:
                    verificationStatus.email && verificationStatus.contact
                      ? Colors.success || "#10B981"
                      : Colors.neutral500 || "#6B7280",
                },
              ]}
            >
              {verificationStatus.email && verificationStatus.contact
                ? "✅ All verifications complete"
                : `${Object.values(verificationStatus).filter(Boolean).length}/2 verifications complete`}
            </Text>
          </View>

          <AnimatedButton title="Continue" onPress={() => navigation.navigate('Home')} />
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
  verificationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    marginTop: -8,
  },
  verificationStatus: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statusIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  statusIconText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  verificationText: {
    fontSize: 14,
    fontWeight: "500",
  },
  verifyButton: {
    paddingHorizontal: 4,
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
