import React from 'react'
import {Text, StyleSheet, TextStyle} from 'react-native'
import Colors from '../constants/colors'

interface LinkProps {
    link: String,
    style?: TextStyle
}


const Link: React.FC<LinkProps> = ({ link, style }) => {
  return <Text style={[styles.link, style]}>{link}</Text>;
};

const styles = StyleSheet.create({
  link: {
    fontSize: 16,
    color: Colors.primaryDark,
    fontWeight: '500',
    marginTop: 5
  },
});

export default Link;