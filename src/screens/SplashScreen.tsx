import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  Animated,
  Platform,
  Text,
  View,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import Colors from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Check for existing authentication
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userData = await AsyncStorage.getItem('user');
        
        if (token && userData) {
          const user = JSON.parse(userData);
          
          if (user.role === 'technician') {
            navigation.navigate('TechnicianHome');
          } else if (user.role === 'customer') {
            navigation.navigate('Home');
          } else {
            navigation.navigate('Onboarding');
          }
        } else {
          // Only set timeout if no auth found
          setTimeout(() => {
            navigation.navigate('LogIn');
          }, 2000);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setTimeout(() => {
          navigation.navigate('SignUp');
        }, 2000);
      }
    };

    checkAuthStatus();

    return () => {
      // Cleanup if needed
    };
  }, [fadeAnim, navigation]);

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.2,
      useNativeDriver: true,
      friction: 5,
      tension: 40,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    navigation.navigate('SignUp');
  };

  setTimeout(() => {
    navigation.navigate('LogIn');
  }, 3000);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
        <TouchableWithoutFeedback onPressIn={onPressIn} onPressOut={onPressOut}>
          {isLandscape ? (
            // LANDSCAPE MODE
            <View style={styles.landscapeLayout}>
              <Animated.Image
                source={require('../assets/images/Logo_black_no_bg.png')}
                style={[styles.Logo, { transform: [{ scale: scaleAnim }] }]}
                fadeDuration={1000}
              />
              <View style={styles.landscapeTextContainer}>
                <Text style={[styles.text, styles.Motor, { color: Colors.neutral1000 }]}>Motor</Text>
                <Text style={[styles.text, styles.Trace, { color: Colors.neutral500 }]}>Trace</Text>
                <Text style={styles.tagline}>Track • Analyze • Optimize</Text>
              </View>
            </View>
          ) : (
            // PORTRAIT MODE
            <>
              <Animated.Image
                source={require('../assets/images/Logo_black_no_bg.png')}
                style={[styles.Logo, { transform: [{ scale: scaleAnim }] }]}
                fadeDuration={1000}
              />
              <View style={styles.titleContainer}>
                <Text style={[styles.text, styles.Motor, { color: Colors.neutral1000 }]}>Motor</Text>
                <Text style={[styles.text, styles.Trace, { color: Colors.neutral500 }]}>Trace</Text>
              </View>
              <Text style={styles.tagline}>Track • Analyze • Optimize</Text>
            </>
          )}
        </TouchableWithoutFeedback>
      </Animated.View>
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="small"
          color={Colors.neutral500}
          style={styles.loadingIndicator}
        />
        <Text style={styles.loadingText}>Loading your motor data...</Text>
        <Text style={styles.versionText}>V1.0.0</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primarybg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
  },
  text: {
    fontSize: 70,
    fontWeight: '600',
    textShadowColor: Colors.shadowLg,
    textShadowOffset: { width: 4, height: 4},
    textShadowRadius: 6,
  },
  Logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    shadowColor: Colors.neutral1000,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  Motor: {
    marginBottom: -15,
  },
  Trace: {
    fontWeight: '400',
  },
  tagline: {
    fontSize: 16,
    color: Colors.neutral500,
    marginTop: -5,
    fontWeight: '400',
    letterSpacing: 1,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.neutral500,
    fontWeight: '400',
  },
  versionText: {
    fontSize: 14,
    color: Colors.neutral1000,
    fontWeight: '400',
  },
  landscapeLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 70
  },
  landscapeTextContainer: {
    marginLeft: 40,
    alignItems: 'center',
  },
}); 