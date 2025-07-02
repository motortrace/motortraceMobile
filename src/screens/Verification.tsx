import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Image } from "react-native"
import Colors from "../constants/colors"
import FormBox from "../components/FormBox"
import AnimatedButton from "../components/AnimatedButton"
import Link from "../components/Link"
import Back from '../components/Back'
import OtpBox from '../components/OtpBox'
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';

interface OTPVerificationScreenProps {
  contact?: string
  onVerificationSuccess?: () => void
  onBack?: () => void
}

const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = ({
  contact = "0714810928",
  onVerificationSuccess,
  onBack,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [otp, setOtp] = useState(["", "", "", "", "", ""])

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Back />

        <View style={styles.iconContainer}>
          <Image source={require("../assets/images/Logo_white_no_bg.png")} style={styles.Logo} />
        </View>

        {/* Title and Description */}
        <Text style={styles.title}>Verify Your Contact</Text>
        <Text style={styles.subtitle}>We've sent a 6-digit verification code to</Text>
        <Text style={styles.emailText}>{contact}</Text>

        <FormBox>
          <View style={styles.otpContainer}>
            <Text style={styles.otpLabel}>Enter Verification Code</Text>
            <OtpBox length={6} value={otp} onChange={handleOtpChange} />
          </View>

          {/* Resend Section */}
          <View style={styles.resendContainer}>
            <View style={styles.resendRow}>
              <Text style={styles.resendText}>Didn't receive the code? </Text>
              <TouchableOpacity>
                <Link link="Resend" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Verify Button */}
          <AnimatedButton title="Verify Contact" onPress={ ()=> navigation.navigate('Onboarding')} />

          {/* Help Text */}
          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>Check your inbox and enter the 6-digit code</Text>
          </View>
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
    paddingTop: 20,
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
    marginBottom: 4,
  },
  emailText: {
    fontSize: 16,
    color: Colors.primary,
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 30,
  },
  otpContainer: {
    marginBottom: 24,
  },
  otpLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.neutral700,
    marginBottom: 12,
    textAlign: "center",
  },
  resendContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  resendRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  resendText: {
    fontSize: 16,
    color: Colors.neutral700,
    marginTop: 4,
  },
  helpContainer: {
    backgroundColor: Colors.neutral50,
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  helpText: {
    fontSize: 14,
    color: Colors.neutral500,
    textAlign: "center",
  },
})

export default OTPVerificationScreen
