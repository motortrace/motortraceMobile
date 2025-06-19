import React, { useRef, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Animated, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../constants/colors';

export default function SplashScreen() {
  const navigation = useNavigation();

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start pulsating animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();

    // Navigate after 3 seconds
    const timer = setTimeout(() => {
      navigation.navigate('Home');
    }, 300000);

    return () => {
      pulse.stop();
      clearTimeout(timer);
    };
  }, [navigation, pulseAnim]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.Image
        source={require('../assets/images/Logo_black_no_bg.png')}
        style={[
          styles.logo,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
        fadeDuration={500}
      />
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
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});
