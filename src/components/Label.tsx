import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import Colors from '../constants/colors'

interface LabelProps {
  label: string;
  style?: TextStyle;
}

const Label: React.FC<LabelProps> = ({ label, style }) => {
  return <Text style={[styles.label, style]}>{label}</Text>;
};

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral700,
    marginBottom: 4,
  },
});

export default Label;
