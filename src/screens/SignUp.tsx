import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import Colors from '../constants/colors';
import AnimatedButton from '../components/AnimatedButton';
import FormInput from '../components/FormInput';
import Link from '../components/Link';
import SocialLoginButtons from '../components/SocialLoginButtons';
import FormBox from '../components/FormBox';

interface SignUpScreenProps {
  onSignUp?: (name: string, username: string, password: string) => void;
  onGoogleLogin?: () => void;
  onAppleLogin?: () => void;
  onLoginRedirect?: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onSignUp,
  onGoogleLogin,
  onAppleLogin,
  onLoginRedirect,
}) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    if (!name.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    onSignUp?.(name, username, password);
  };

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
            label="Username"
            placeholder="Choose a username"
            iconName="person-outline"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            error="Username already exists"
          />

          {/* Password */}
          <FormInput
            label="Password"
            placeholder="Enter your password"
            iconName="lock-closed-outline"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            error="Wrong password"
          />

          {/* Confirm Password */}
          <FormInput
            label="Confirm Password"
            placeholder="Re-enter your password"
            iconName="lock-closed-outline"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            error="password doesn't match" 
          />

          {/* Sign Up Button */}
          <AnimatedButton title="Sign up" onPress={handleSignUp} style={{ marginBottom: 24 }} />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or sign up with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login */}
          <SocialLoginButtons
            onGoogleLogin={onGoogleLogin}
            onAppleLogin={onAppleLogin}
          />
        </FormBox>

        {/* Redirect to Login */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Already have an account? </Text>
          <TouchableOpacity onPress={onLoginRedirect}>
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

export default SignUpScreen;
