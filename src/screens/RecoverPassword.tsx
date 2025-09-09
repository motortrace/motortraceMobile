import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import CircularBackButton from '../components/Back';
import AnimatedButton from '../components/AnimatedButton';
import OtpInputBox from '../components/OtpBox';
import Colors from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';
import emailService from '../services/emailService';

const RecoverPasswordScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Get email from AsyncStorage on mount
  useEffect(() => {
    emailService.getStoredResetEmail().then(storedEmail => {
      if (storedEmail) {
        setEmail(storedEmail);
      }
    });
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);
  };

  const otpCode = otpDigits.join('');
  const isOtpValid = otpCode.length === 6;

  const handleVerifyPress = async () => {
    if (!isOtpValid) return;
    
    setIsLoading(true);
    try {
      // For now, we'll simulate OTP verification
      // In a real implementation, you'd verify the OTP with your backend
      const isValidOtp = await verifyOtpWithBackend(otpCode);
      
      if (isValidOtp) {
        // Store the OTP as a token for password reset
        await emailService.storeResetData(email, otpCode);
        
        Alert.alert(
          'Success', 
          'OTP verified successfully! You can now reset your password.',
          [
            { 
              text: 'Continue', 
              onPress: () => navigation.navigate('ResetPassword')
            }
          ]
        );
      } else {
        Alert.alert('Error', 'Invalid OTP. Please try again.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('http://10.0.2.2:3000/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setResendCooldown(60); // 60 seconds cooldown
        Alert.alert('Success', 'New OTP sent to your email');
      } else {
        Alert.alert('Error', data.error || 'Failed to resend OTP');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate OTP verification with backend
  const verifyOtpWithBackend = async (otp: string): Promise<boolean> => {
    try {
      const response = await fetch('http://10.0.2.2:3000/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        return true;
      } else {
        throw new Error(data.error || 'OTP verification failed');
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      throw error;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <CircularBackButton onPress={() => navigation.goBack()} />

        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to your email:
        </Text>
        <Text style={styles.contact}>{email || 'your email'}</Text>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          <OtpInputBox
            value={otpDigits}
            onChange={handleOtpChange}
            length={6}
          />
        </View>

        <AnimatedButton
          title={isLoading ? "Verifying..." : "Verify Code"}
          onPress={isOtpValid && !isLoading ? handleVerifyPress : () => {}}
          style={(!isOtpValid || isLoading) ? styles.disabledButton : undefined}
          textStyle={(!isOtpValid || isLoading) ? styles.disabledButtonText : undefined}
        />

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code?</Text>
          <TouchableOpacity 
            onPress={handleResend}
            disabled={resendCooldown > 0 || isLoading}
          >
            <Text style={[
              styles.resendLink,
              (resendCooldown > 0 || isLoading) && styles.resendLinkDisabled
            ]}>
              {resendCooldown > 0 ? ` Resend (${resendCooldown}s)` : ' Resend'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primarybg,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.neutral1000,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.neutral500,
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 22,
  },
  contact: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 24,
  },
  otpContainer: {
    marginBottom: 30,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  resendText: {
    fontSize: 15,
    color: Colors.neutral600,
  },
  resendLink: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
  },
  resendLinkDisabled: {
    color: Colors.neutral400,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledButtonText: {
    color: Colors.neutral500,
  },
});

export default RecoverPasswordScreen;
