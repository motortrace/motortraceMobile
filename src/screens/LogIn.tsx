import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
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
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useUser } from '../store/UserContext';

interface LoginScreenProps {
  onLogin?: (email: string, password: string) => void;
  onGoogleLogin?: () => void;
  onAppleLogin?: () => void;
  onSignUp?: () => void;
  onForgotPassword?: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onGoogleLogin,
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

  const handleLogin = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    setErrors({ email: '', password: '' });
    
    try {
      // Call your backend API
      const response = await fetch('http://10.0.2.2:3000/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Client-Type': 'mobile',
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
      
      // Store the token securely (you might want to use AsyncStorage or Keychain)
      if (data.token) {
        // Store token in secure storage
        // await AsyncStorage.setItem('token', data.token);
      }
      
      // Set user in context
      if (data.user) {
        setUser(data.user);
      }
      // Handle navigation after successful login
      if(data.isRegistrationComplete){
        navigation.navigate('Home')
      }else{
        navigation.navigate('Onboarding')
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
        Alert.alert('Login Failed', error.message || 'Please check your credentials and try again.');
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
          'X-Client-Type': 'mobile',
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
      
      // Set user in context
      if (data.user) {
        setUser(data.user);
      }
      // Handle login success (store token, navigate, etc.)
      if(data.user.isRegistrationComplete){
        navigation.navigate('Home')
      }else{
        navigation.navigate('Onboarding')
      }
      
    } catch (error: any) {
      console.error('Google Login Error:', error);
      console.error('Error type:', error.name);
      console.error('Error message:', error.message);
      
      // More specific error handling
      if (error.message.includes('Network request failed')) {
        Alert.alert('Network Error', 'Cannot connect to server. Please check your internet connection and try again.');
      } else if (error.message.includes('fetch')) {
        Alert.alert('Server Error', 'Unable to reach the authentication server. Please try again later.');
      } else {
        Alert.alert('Google Login Failed', error.message || 'Please try again.');
      }
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
      Alert.alert('Apple Login Failed', 'Please try again.');
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
              <Text style={styles.welcomeTitle}>Welcome Back</Text>
              <Text style={styles.welcomeSubtitle}>Sign in to your car owner account</Text>
            </View>

            <FormBox>
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
                autoComplete="password"
              />

              {/* Remember Me & Forgot Password */}
              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={styles.rememberMeContainer}
                  onPress={() => setRememberMe(!rememberMe)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                    {rememberMe && <Icon name="checkmark" size={12} color="white" />}
                  </View>
                  <Text style={styles.rememberMeText}>Remember me</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.7}>
                  <Link link="Forgot password?" />
                </TouchableOpacity>
              </View>

              {/* Sign In Button */}
              <AnimatedButton 
                title="Sign In" 
                onPress={handleLogin} 
                style={styles.signInButton}
              />

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

              {/* Sign Up Link - moved for visibility */}
              <View style={[styles.signUpContainer, { marginTop: 32, alignItems: 'center' }]}> 
                <Text style={styles.signUpText}>Don't have an account? </Text>
                <TouchableOpacity onPress={handleSignUp} activeOpacity={0.7}>
                  <Text style={{ color: '#2563eb', textDecorationLine: 'underline', fontWeight: 'bold', fontSize: 16 }}>Sign up</Text>
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
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 4,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
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
    fontWeight: '500',
  },
  signInButton: {
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
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  signUpText: {
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

export default LoginScreen;