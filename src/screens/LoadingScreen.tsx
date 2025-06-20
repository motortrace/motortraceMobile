import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function HomeScreen() {
  const cog1Rotation = useRef(new Animated.Value(0)).current;
  const cog2Rotation = useRef(new Animated.Value(0)).current;
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    // Create continuous rotation animations
    const cog1Animation = Animated.loop(
      Animated.timing(cog1Rotation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    const cog2Animation = Animated.loop(
      Animated.timing(cog2Rotation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    // Start animations
    cog1Animation.start();
    cog2Animation.start();

    // Cleanup function to stop animations
    return () => {
      cog1Animation.stop();
      cog2Animation.stop();
    };
  }, [cog1Rotation, cog2Rotation]);

  useEffect(() => {
    // Animate the dots
    const dotInterval = setInterval(() => {
      setDotCount(prevCount => (prevCount + 1) % 6); // 0 to 5, then reset
    }, 500); // Change dots every 500ms

    return () => clearInterval(dotInterval);
  }, []);

  // Convert animated values to rotation degrees
  const cog1RotationDegrees = cog1Rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const cog2RotationDegrees = cog2Rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'], // Counter-clockwise rotation
  });

  // Generate dots based on current count
  const generateDots = () => {
    return '.'.repeat(dotCount);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.icons}>
        <Animated.View
          style={[
            styles.cogContainer,
            {
              transform: [{ rotate: cog1RotationDegrees }],
            },
          ]}
        >
          <Icon name="cog" style={styles.cog1} size={100} />
        </Animated.View>
                
        <Animated.View
          style={[
            styles.cogContainer,
            styles.cog2Container,
            {
              transform: [{ rotate: cog2RotationDegrees }],
            },
          ]}
        >
          <Icon name="cog" style={styles.cog2} size={100} />
        </Animated.View>
      </View>
      <View style={styles.loadingContainer}>
        <View style={styles.loadingTextContainer}>
          <Text style={styles.loading}>Loading</Text>
          <Text style={styles.dots}>{generateDots()}</Text>
        </View>
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
    padding: 20,
  },
  icons: {
    marginTop: -100,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cogContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cog2Container: {
    marginTop: 87,
    marginLeft: -18, // Overlap the cogs slightly for a meshing effect
  },
  cog1: {
    color: Colors.primary,
  },
  cog2: {
    color: Colors.neutral500,
  },
  loadingContainer: {
    minHeight: 40, // Prevents layout shift
    justifyContent: 'center',
  },
  loadingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    fontWeight: '500',
    fontSize: 28,
    color: Colors.neutral1000,
  },
  dots: {
    fontWeight: '500',
    fontSize: 28,
    color: Colors.neutral1000,
    width: 45,
    textAlign: 'left',
  }
});