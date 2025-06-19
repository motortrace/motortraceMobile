import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome to Motor Trace</Text>
      <Text style={styles.subtitle}>Your motor tracking dashboard</Text>
      {/* Add your main app content here */}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.neutral1000,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.neutral500,
    textAlign: 'center',
  },
});
