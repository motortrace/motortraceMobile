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
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.iconContainer}>
          <Image source={require('../assets/images/Logo_white_no_bg.png')} style={styles.Logo} />
        </View>

        {/* Welcome Text */}
        <Text style={styles.welcomeTitle}>Create Account</Text>
        <Text style={styles.welcomeSubtitle}>Sign up for a new car account</Text>

        <FormBox>
          {/* Username */}
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

          {/* Sign Up Button */}
          <AnimatedButton title="Sign up" onPress={handleRegister} style={{ marginBottom: 24 }} />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or sign up with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login */}
          <SocialLoginButtons
            onGoogleLogin={handleGoogleRegister}
            onAppleLogin={handleGoogleRegister}
          />
        </FormBox>

        {/* Redirect to Login */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('LogIn')}>
            <Link link="Sign in" style={{ marginTop: 10 }} />
          </TouchableOpacity>
        </View>
      </View>
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
    paddingTop: 60,
    justifyContent: 'center',
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
  },
  signUpText: {
    fontSize: 16,
    color: Colors.neutral500,
    marginTop: 10,
  },
});

<<<<<<< HEAD

export default RegisterScreen;
=======
export default RegisterScreen; 
>>>>>>> bd3d1bdaaefcbc06891fa469985abd6d6f27c9f1
