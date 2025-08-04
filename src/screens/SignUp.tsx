import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Colors from '../constants/colors';
import AnimatedButton from '../components/AnimatedButton';
import FormInput from '../components/FormInput';
import Link from '../components/Link';
import SocialLoginButtons from '../components/SocialLoginButtons';
import FormBox from '../components/FormBox';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useUser } from '../store/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RegisterScreenProps {
  onRegister?: (email: string, password: string) => void;
  onGoogleRegister?: () => void;
  onLoginRedirect?: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegister,
  onGoogleRegister,
  onLoginRedirect,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  // Handle input validation
  const validateInputs = (): boolean => {
    const newErrors = {
      email: '',
      password: '',
    };

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  // Configure Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '1023909066743-cn45jd8tj8ovoul1hmipinncg938d2ge.apps.googleusercontent.com',
    });
  }, []);

  const handleRegister = async () => {
    if (!validateInputs()) {
      return;
    }

    if (!agree) {
      Alert.alert('Error', 'Please agree to the Terms & Privacy');
      return;
    }

    setLoading(true);
    setErrors({ email: '', password: '' });

    try {
      // Use the correct endpoint for Supabase auth
      const response = await fetch('http://10.0.2.2:3000/auth/signup', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
          role: 'customer' // Set customer role for mobile app users
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Store the token securely
      if (data.data?.access_token) {
        await AsyncStorage.setItem('token', data.data.access_token);
        console.log('Token stored successfully');
      }

      // Set user in context
      if (data.data?.user) {
        await AsyncStorage.setItem('user', JSON.stringify(data.data.user));
        setUser(data.data.user);
        console.log('User data stored and context updated');
      }

      // Navigate to login after successful registration
      navigation.navigate('LogIn');
      
      if (onRegister) {
        onRegister(email, password);
      }
      
    } catch (error: any) {
      setErrors({
        email: error.message.includes('email') ? error.message : '',
        password: error.message.includes('password') ? error.message : '',
      });
      
      if (!error.message.includes('email') && !error.message.includes('password')) {
        Alert.alert('Registration Failed', error.message || 'Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();
      console.log('Google signIn result:', result);
      
      // Access idToken from the data object
      const idToken = result.data?.idToken;
      
      if (!idToken) {
        throw new Error('No idToken returned from Google');
      }
  
      console.log('Sending idToken to backend:', idToken.substring(0, 50) + '...');
  
      // Send the token to your backend for registration
      const response = await fetch('http://10.0.2.2:3000/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          idToken,
          role: 'customer' // Set customer role for Google signup
        }),
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Google registration failed');
      }
      
      // Store token and user data
      if (data.data?.access_token) {
        await AsyncStorage.setItem('token', data.data.access_token);
      }
      
      // Set user in context
      if (data.data?.user) {
        await AsyncStorage.setItem('user', JSON.stringify(data.data.user));
        setUser(data.data.user);
      }
      
      // Navigate based on registration completion
      if (data.data?.user?.isRegistrationComplete) {
        navigation.navigate('Home');
      } else {
        navigation.navigate('Onboarding');
      }
      
      if (onGoogleRegister) {
        onGoogleRegister();
      }
      
    } catch (error: any) {
      console.error('Google Registration Error:', error);
      console.error('Error type:', error.name);
      console.error('Error message:', error.message);
      
      // More specific error handling
      if (error.message.includes('Network request failed')) {
        Alert.alert('Network Error', 'Cannot connect to server. Please check your internet connection and try again.');
      } else if (error.message.includes('fetch')) {
        Alert.alert('Server Error', 'Unable to reach the authentication server. Please try again later.');
      } else {
        Alert.alert('Google Sign Up Failed', error.message || 'Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleAgree = () => {
    setAgree(!agree);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Creating Account...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image 
                source={require('../assets/images/Logo_white_no_bg.png')} 
                style={styles.logo} 
                resizeMode="contain"
              />
            </View>

            {/* Welcome Text */}
            <View style={styles.headerContainer}>
              <Text style={styles.welcomeTitle}>Create your account</Text>
              <Text style={styles.welcomeSubtitle}>Sign up to get started with MotorTrace</Text>
            </View>

            <FormBox>
              {/* Email Input */}
              <FormInput
                label="Email address"
                placeholder="Enter your email"
                iconName="mail-outline"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: '' }));
                  }
                }}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                error={errors.email}
                autoComplete="email"
              />

              {/* Password Input */}
              <FormInput
                label="Password"
                placeholder="Min 8 characters"
                iconName="lock-closed-outline"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors(prev => ({ ...prev, password: '' }));
                  }
                }}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.password}
                autoComplete="password"
              />

              {/* Terms & Privacy Checkbox */}
              <TouchableOpacity style={styles.checkboxContainer} onPress={toggleAgree}>
                <View style={[styles.checkbox, agree && styles.checkboxChecked]}>
                  {agree && <Text style={styles.checkboxTick}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>
                  I agree to the <Text style={styles.linkText}>Terms & Privacy</Text>
                </Text>
              </TouchableOpacity>

              {/* Register Button */}
              <AnimatedButton 
                title="Create Account" 
                onPress={handleRegister}
                style={[
                  styles.registerButton,
                  { opacity: (!agree || loading) ? 0.6 : 1 }
                ]}
                disabled={!agree || loading}
              />

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Login Buttons */}
              <SocialLoginButtons
                onGoogleLogin={handleGoogleRegister}
                onAppleLogin={handleGoogleRegister} // You can implement Apple login separately
              />

              {/* Sign In Link */}
              <View style={[styles.signInContainer, { marginTop: 32, alignItems: 'center' }]}>
                <Text style={styles.signInText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('LogIn')} activeOpacity={0.7}>
                  <Text style={{ color: '#2563eb', textDecorationLine: 'underline', fontWeight: 'bold', fontSize: 16 }}>Sign in</Text>
                </TouchableOpacity>
              </View>
            </FormBox>

            {/* Footer */}
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>2024 MotorTrace, All rights reserved</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primarybg,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
    justifyContent: 'center',
    minHeight: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.neutral500,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.neutral1000,
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Colors.neutral500,
    textAlign: 'center',
    lineHeight: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.neutral300,
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxTick: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: Colors.neutral700,
    fontWeight: '500',
  },
  linkText: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  registerButton: {
    marginBottom: 24,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.neutral300,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: Colors.neutral500,
    fontWeight: '500',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  signInText: {
    fontSize: 16,
    color: Colors.neutral500,
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 32,
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: Colors.neutral400,
    textAlign: 'center',
  },
});

export default RegisterScreen; 