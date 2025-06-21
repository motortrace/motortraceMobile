import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Colors from '../constants/colors'

type BoxProps = {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
};

const Box: React.FC<BoxProps> = ({ children, style }) => {
  return <View style={[styles.box, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: Colors.neutral0,
    paddingHorizontal: 30, 
    paddingVertical: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.neutral300,
    shadowColor: Colors.neutral1000,
    shadowOffset: { width: 8, height: 10 },
    shadowOpacity: 0.6,                   
    shadowRadius: 12,
    elevation: 10,
  },
});

export default Box;
