import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';
import AnimatedButton from '../components/AnimatedButton';
import FormInput from '../components/FormInput';
import Link from '../components/Link'
import SocialLoginButtons from '../components/SocialLoginButtons';
import FormBox from '../components/FormBox';
import CustomAlert from '../components/Alert';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useUser } from '../store/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginScreenProps {
  onLogin?: (email: string, password: string) => void;
  onGoogleLogin?: () => void;
  onAppleLogin?: () => void;
  onSignUp?: () => void;
  onForgotPassword?: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onAppleLogin,
  onSignUp,
  onForgotPassword,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  // Custom Alert states
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
    title: '',
    message: '',
    buttonType: 'single' as 'none' | 'single' | 'double' | 'triple',
    confirmText: 'OK',
    onConfirm: () => {},
  });

  // Keyboard visibility listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
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
      newErrors.password = 'Password must be at least 6 characters';
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

  // Show custom alert helper
  const showAlert = (config: typeof alertConfig) => {
    setAlertConfig(config);
    setAlertVisible(true);
  };

  // Hide custom alert
  const hideAlert = () => {
    setAlertVisible(false);
    // Execute the onConfirm action after hiding
    setTimeout(() => {
      alertConfig.onConfirm();
    }, 100);
  };

  const handleLogin = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    setErrors({ email: '', password: '' });
    
    try {
      // Call your backend API with correct endpoint
      const response = await fetch('http://10.0.2.2:3000/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      // Store the token securely
      if (data.data?.access_token) {
        await AsyncStorage.setItem('token', data.data.access_token);
        console.log('Token stored successfully');
      }

      console.log('User data received:', data.data.user);
      
      // Set user in context
      if (data.data?.user) {
        console.log('User data received:', data.data.user);
        await AsyncStorage.setItem('user', JSON.stringify(data.data.user));
        console.log('User data stored in AsyncStorage');
        setUser(data.data.user);
        console.log('User state updated');
      }

      // Handle navigation after successful login
      if (data.data?.user?.role === 'technician') {
        navigation.navigate('TechnicianHome');
      } else if (data.data?.user?.isRegistrationComplete) {
        navigation.navigate('Home');
      } else {
        navigation.navigate('Onboarding');
      }
      
      if (onLogin) {
        onLogin(email, password);
      }
      
    } catch (error: any) {
      setErrors({
        email: error.message.includes('email') ? error.message : '',
        password: error.message.includes('password') ? error.message : '',
      });
      
      if (!error.message.includes('email') && !error.message.includes('password')) {
        showAlert({
          type: 'error',
          title: 'Login Failed',
          message: error.message || 'Please check your credentials and try again.',
          buttonType: 'single',
          confirmText: 'OK',
          onConfirm: () => {}
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
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
  
      // Send the token to your backend
      const response = await fetch('http://10.0.2.2:3000/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Google login failed');
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

      console.log('User data received:', data.data.user);

      // Handle navigation based on user role and registration status
      if (data.data?.user?.role === 'technician') {
        navigation.navigate('TechnicianHome');
      } else if (data.data?.user?.isRegistrationComplete) {
        navigation.navigate('Home');
      } else {
        navigation.navigate('Onboarding');
      }

    } catch (error: any) {
      console.error('Google Login Error:', error);
      console.error('Error type:', error.name);
      console.error('Error message:', error.message);
      
      let alertTitle = 'Google Login Failed';
      let alertMessage = error.message || 'Please try again.';
      
      // More specific error handling
      if (error.message.includes('Network request failed')) {
        alertTitle = 'Network Error';
        alertMessage = 'Cannot connect to server. Please check your internet connection and try again.';
      } else if (error.message.includes('fetch')) {
        alertTitle = 'Server Error';
        alertMessage = 'Unable to reach the authentication server. Please try again later.';
      }
      
      showAlert({
        type: 'error',
        title: alertTitle,
        message: alertMessage,
        buttonType: 'single',
        confirmText: 'OK',
        onConfirm: () => {}
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setIsLoading(true);
    try {
      if (onAppleLogin) {
        await onAppleLogin();
      }
    } catch (error) {
      showAlert({
        type: 'error',
        title: 'Apple Login Failed',
        message: 'Please try again.',
        buttonType: 'single',
        confirmText: 'OK',
        onConfirm: () => {}
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (onForgotPassword) {
      onForgotPassword();
    } else {
      navigation.navigate('ForgotPassword');
    }
  };

  const handleSignUp = () => {
    if (onSignUp) {
      onSignUp();
    } else {
      navigation.navigate('SignUp');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Signing In...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContent,
            isKeyboardVisible ? styles.scrollContentKeyboard : undefined
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[
            styles.content,
            isKeyboardVisible ? styles.contentKeyboard : undefined
          ]}>
            {/* Logo - Hide when keyboard is visible */}
            {!isKeyboardVisible && (
              <View style={styles.iconContainer}>
                <Image source={require('../assets/images/Logo_white_no_bg.png')} style={styles.Logo} />
              </View>
            )}

            {/* Welcome Text - Hide when keyboard is visible */}
            {!isKeyboardVisible && (
              <>
                <Text style={styles.welcomeTitle}>Welcome Back</Text>
                <Text style={styles.welcomeSubtitle}>Sign in to your car account</Text>
              </>
            )}

            <FormBox style={isKeyboardVisible ? styles.formBoxKeyboard : undefined}>
              {/* Email Input */}
              <FormInput
                label="Email"
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
                placeholder="Enter your password"
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
              />

              {/* Remember Me & Forgot Password */}
              <View style={styles.optionsRow}>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    style={styles.rememberMeContainer}
                    onPress={() => setRememberMe(!rememberMe)}
                  >
                    <View
                      style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
                    >
                      {rememberMe && <Icon name="checkmark" size={12} color="white" />}
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.rememberMeText}>Remember me</Text>
                </View>

                <TouchableOpacity onPress={handleForgotPassword}>
                  <Link link="Forgot password?" />
                </TouchableOpacity>
              </View>

              {/* Sign In Button */}
              <AnimatedButton title="Sign in" onPress={handleLogin} style={styles.signInButton} />

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Login Buttons */}
              <SocialLoginButtons
                onGoogleLogin={handleGoogleLogin}
                onAppleLogin={handleAppleLogin}
              />

            </FormBox>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Link link="Sign up" style={styles.signUpLink} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Custom Alert */}
      <CustomAlert
        visible={alertVisible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        buttonType={alertConfig.buttonType}
        confirmText={alertConfig.confirmText}
        onClose={hideAlert}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primarybg,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  scrollContentKeyboard: {
    paddingTop: 35,
  },
  content: {
    flex: 1,
    paddingTop: 100,
    justifyContent: 'center',
  },
  contentKeyboard: {
    paddingTop: 20,
    justifyContent: 'flex-start',
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 15,
  },
  Logo: {
    width: 70,
    height: 70,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.neutral1000,
    textAlign: 'center',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Colors.neutral500,
    textAlign: 'center',
    marginBottom: 20,
  },
  formBoxKeyboard: {
    marginTop: 0,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: -2
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.neutral300,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  rememberMeText: {
    fontSize: 14,
    color: Colors.neutral700,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.neutral500,
  },
  dividerText: {
    marginHorizontal: 14,
    fontSize: 14,
    color: Colors.neutral500,
    marginTop: -2,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  signUpText: {
    fontSize: 16,
    color: Colors.neutral500,
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primarybg,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.neutral500,
    textAlign: 'center',
  },
  signInButton: {
    marginBottom: 24,
  },
  signUpLink: {
    marginTop: 10,
  },
});

export default LoginScreen;