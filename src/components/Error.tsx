// components/Error.tsx
import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Colors from '../constants/colors';

interface ErrorProps {
  title: string;
}

const Error: React.FC<ErrorProps> = ({ title }) => {
  if (!title) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    marginBottom: -10,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
  },
});

export default Error;
