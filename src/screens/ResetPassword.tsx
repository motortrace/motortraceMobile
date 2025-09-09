import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Alert } from "react-native"
import Colors from "../constants/colors"
import FormBox from "../components/FormBox"
import FormInput from "../components/FormInput"
import AnimatedButton from "../components/AnimatedButton"
import Link from "../components/Link"
import BackButton from "../components/Back"
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';
import emailService from '../services/emailService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ResetPasswordScreenProps {
  email?: string
  onResetSuccess?: () => void
  onBack?: () => void
}

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  email: propEmail,
  onResetSuccess: _onResetSuccess,
  onBack,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [_loading, _setLoading] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState(propEmail || "");
  // OTP-based reset flow is used for both logged-in and forgot-password cases
  
  // Get email from AsyncStorage on mount if not provided
  useEffect(() => {
    if (!propEmail) {
      emailService.getStoredResetEmail().then(storedEmail => {
        if (storedEmail) setEmail(storedEmail);
      });
    }
  }, [propEmail]);

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: "", color: "" }
    if (password.length < 6) return { strength: "Weak", color: "#EF4444" }
    if (password.length < 8) return { strength: "Fair", color: "#F59E0B" }
    if (password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { strength: "Strong", color: "#10B981" }
    }
    return { strength: "Good", color: "#3B82F6" }
  }

  const handleResetPassword = async () => {
    if (!passwordsMatch || newPassword.length < 6) return;
    _setLoading(true);
    try {
      // OTP + email flow (applies to both logged-in and not logged-in users)
      const otp = await emailService.getStoredResetToken();
      console.log('🔍 Retrieved OTP from storage:', otp);
      console.log('🔍 Email for reset:', email);

      if (!otp) {
        Alert.alert('Error', 'OTP missing. Please restart the reset process.');
        return;
      }

      const response = await fetch('http://10.0.2.2:3000/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          otp, 
          newPassword 
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.log('❌ Reset password error response:', data);
        Alert.alert('Error', data.error || 'Failed to reset password');
        return;
      }

      await emailService.clearResetData();
      Alert.alert('Success', 'Password reset successfully! Please log in.', [
        { text: 'OK', onPress: () => navigation.navigate('LogIn') }
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to reset password');
    } finally {
      _setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(newPassword)
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <BackButton onPress={() => navigation.goBack()} />

        <View style={styles.iconContainer}>
          <Image source={require("../assets/images/Logo_white_no_bg.png")} style={styles.Logo} />
        </View>

        {/* Title and Description */}
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Create a new password for your account</Text>
        <Text style={styles.emailText}>{email}</Text>

        <FormBox>
          {/* New Password Input */}
          <FormInput
            label="New Password"
            placeholder="Enter new password"
            iconName="lock-closed-outline"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={true}
          />

          {/* Password Strength Indicator */}
          {newPassword.length > 0 && (
            <View style={styles.strengthContainer}>
              <Text style={styles.strengthLabel}>Password Strength: </Text>
              <Text style={[styles.strengthText, { color: passwordStrength.color }]}>{passwordStrength.strength}</Text>
            </View>
          )}

          {/* Confirm Password Input */}
          <FormInput
            label="Confirm Password"
            placeholder="Confirm new password"
            iconName="lock-closed-outline"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
          />

          {/* Password Match Indicator */}
          {confirmPassword.length > 0 && (
            <View style={styles.matchContainer}>
              <Text style={[styles.matchText, passwordsMatch ? styles.matchTextSuccess : styles.matchTextError]}>
                {passwordsMatch ? "✓ Passwords match" : "✗ Passwords don't match"}
              </Text>
            </View>
          )}

          {/* Password Requirements */}
          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>Password must contain:</Text>
            <View style={styles.requirementsList}>
              <Text
                style={[styles.requirementItem, newPassword.length >= 6 ? styles.requirementItemSuccess : styles.requirementItemDefault]}
              >
                {newPassword.length >= 6 ? "✓" : "•"} At least 6 characters
              </Text>
              <Text
                style={[
                  styles.requirementItem,
                  /(?=.*\d)/.test(newPassword) ? styles.requirementItemSuccess : styles.requirementItemDefault,
                ]}
              >
                {/(?=.*\d)/.test(newPassword) ? "✓" : "•"} At least one number
              </Text>
            </View>
          </View>

          {/* Reset Button */}
          <AnimatedButton
            title="Reset Password"
            onPress={passwordsMatch && newPassword.length >= 6 ? handleResetPassword : () => {}}
            style={(!passwordsMatch || newPassword.length < 6) ? styles.disabledButton : undefined}
            textStyle={(!passwordsMatch || newPassword.length < 6) ? styles.disabledButtonText : undefined}
          />

        </FormBox>
        {/* Back to Login */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Remember your password? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('LogIn')}>
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
  strengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: -8,
  },
  strengthLabel: {
    fontSize: 14,
    color: Colors.neutral700,
  },
  strengthText: {
    fontSize: 14,
    fontWeight: "600",
  },
  matchContainer: {
    marginBottom: 16,
    marginTop: -8,
  },
  matchText: {
    fontSize: 14,
    fontWeight: "500",
  },
  requirementsContainer: {
    backgroundColor: Colors.neutral50 || "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.neutral700,
    marginBottom: 8,
  },
  requirementsList: {
    gap: 4,
  },
  requirementItem: {
    fontSize: 13,
    lineHeight: 18,
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
    marginTop: 4
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledButtonText: {
    color: Colors.neutral500,
  },
  matchTextSuccess: {
    color: "#10B981",
  },
  matchTextError: {
    color: "#EF4444",
  },
  requirementItemSuccess: {
    color: "#10B981",
  },
  requirementItemDefault: {
    color: Colors.neutral500,
  },
})

export default ResetPasswordScreen