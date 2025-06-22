import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from "react-native"
import Colors from "../constants/colors"
import FormBox from "../components/FormBox"
import FormInput from "../components/FormInput"
import AnimatedButton from "../components/AnimatedButton"
import Link from "../components/Link"
import CircularBackButton from "../components/Back"
import Icon from 'react-native-vector-icons/Ionicons';

interface ForgotPasswordScreenProps {
  onSendOTP?: (email: string, method: "email" | "sms") => void
  onBack?: () => void
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onSendOTP, onBack }) => {
  const [email, setEmail] = useState("")
  const [contact, setContact] = useState("")
  const [selectedMethod, setSelectedMethod] = useState<"email" | "sms">("email")

  const handleSendOTP = () => {
    const value = selectedMethod === "email" ? email : contact
    onSendOTP?.(value, selectedMethod)
  }

  const isEmailValid = email.includes("@") && email.includes(".")
  const isContactValid = contact.length >= 10
  const canProceed = selectedMethod === "email" ? isEmailValid : isContactValid

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <CircularBackButton onPress={onBack} />

        <View style={styles.iconContainer}>
          <Image source={require("../assets/images/Logo_white_no_bg.png")} style={styles.Logo} />
        </View>

        {/* Title and Description */}
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          No worries! Enter your email or phone number and we'll send you a reset code
        </Text>

        <FormBox>
          {/* Method Selection */}
          <View style={styles.methodContainer}>
            <Text style={styles.methodLabel}>Choose verification method:</Text>
            <View style={styles.methodButtons}>
              <TouchableOpacity
                style={[styles.methodButton, selectedMethod === "email" && styles.methodButtonActive]}
                onPress={() => setSelectedMethod("email")}
              >
                <Icon name="mail-outline" style={styles.Icons} />
                <Text style={[styles.methodButtonText, selectedMethod === "email" && styles.methodButtonTextActive]}>
                    Email
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.methodButton, selectedMethod === "sms" && styles.methodButtonActive]}
                onPress={() => setSelectedMethod("sms")}
              >
                <Icon name="chatbubble-outline" style={styles.Icons} />
                <Text style={[styles.methodButtonText, selectedMethod === "sms" && styles.methodButtonTextActive]}>
                SMS
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Email Input */}
          {selectedMethod === "email" && (
            <FormInput
              label="Email Address"
              placeholder="Enter your email"
              iconName="mail-outline"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          )}

          {/* Contact Input */}
          {selectedMethod === "sms" && (
            <FormInput
              label="Phone Number"
              placeholder="Enter your phone number"
              iconName="call-outline"
              value={contact}
              onChangeText={setContact}
              keyboardType="phone-pad"
            />
          )}

          {/* Send OTP Button */}
          <AnimatedButton
            title={`Send ${selectedMethod === "email" ? "Email" : "SMS"} Code`}
            onPress={handleSendOTP}
            disabled={!canProceed}
          />

          {/* Help Text */}
          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>
              {selectedMethod === "email"
                ? "We'll send a 6-digit verification code to your email address"
                : "We'll send a 6-digit verification code to your phone number"}
            </Text>
          </View>

        </FormBox>
        {/* Back to Login */}
        <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Remember your password? </Text>
            <TouchableOpacity>
                <Link link="Back to Login" />
            </TouchableOpacity>
        </View>
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
    paddingTop: 20,
    justifyContent: 'center'
  },
  header: {
    marginBottom: 20,
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.neutral1000,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.neutral500,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  methodContainer: {
    marginBottom: 24,
  },
  methodLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.neutral700,
    marginBottom: 12,
  },
  methodButtons: {
    flexDirection: "row",
    gap: 12,
  },
  methodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.neutral300 || "#D1D5DB",
    backgroundColor: Colors.neutral50 || "#F9FAFB",
    alignItems: "center",
    flexDirection: 'row',
  },
  Icons: {
    fontSize: 20,
    color: Colors.neutral500,
    marginRight: 10
  },
  methodButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "10",
  },
  methodButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.neutral700,
  },
  methodButtonTextActive: {
    color: Colors.primary,
    fontWeight: "600",
  },
  helpContainer: {
    backgroundColor: Colors.neutral50 || "#F9FAFB",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  helpText: {
    fontSize: 14,
    color: Colors.neutral700,
    textAlign: "center",
    lineHeight: 16,
  },
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  loginText: {
    fontSize: 16,
    color: Colors.neutral700,
    marginTop: 4,
  },
})

export default ForgotPasswordScreen
