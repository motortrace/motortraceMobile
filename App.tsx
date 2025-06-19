import React from 'react';
import { Text, StyleSheet, SafeAreaView } from 'react-native';
import Colors from './src/constants/colors';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>🚀 Main App Screen</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primarybg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
});
