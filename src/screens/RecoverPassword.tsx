import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import CircularBackButton from '../components/Back';
import AnimatedButton from '../components/AnimatedButton';
import OTPInputView from '../components/OtpBox'; // Optional
import Colors from '../constants/colors';
import { useNavigation } from '@react-navigation/native';

const RecoverPasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const [otp, setOtp] = useState('');

  // Dummy values for demonstration
  const selectedMethod: 'email' | 'sms' = 'email';
  const contactValue = selectedMethod === 'email' ? 'john.doe@example.com' : '+91 98765 43210';

  const isOtpValid = otp.length === 6;

  const handleVerifyPress = () => {
    // Dummy action
    console.log('OTP Verified:', otp);
  };

  const handleResend = () => {
    console.log('Resend OTP');
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
          We've sent a 6-digit code to your {selectedMethod === 'email' ? 'email' : 'phone'}:
        </Text>
        <Text style={styles.contact}>{contactValue}</Text>

        {/* OTP Input */}
        <OTPInputView
          style={styles.otpContainer}
          pinCount={6}
          autoFocusOnLoad
          codeInputFieldStyle={styles.otpBox}
          codeInputHighlightStyle={styles.otpBoxFocused}
          onCodeChanged={setOtp}
          code={otp}
        />

        <AnimatedButton
          title="Verify Code"
          onPress={handleVerifyPress}
          disabled={!isOtpValid}
        />

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code?</Text>
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendLink}> Resend</Text>
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
    width: '100%',
    height: 60,
    alignSelf: 'center',
    marginBottom: 30,
  },
  otpBox: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: Colors.neutral300,
    color: Colors.neutral1000,
    fontSize: 20,
    textAlign: 'center',
  },
  otpBoxFocused: {
    borderColor: Colors.primary,
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
});

export default RecoverPasswordScreen;
