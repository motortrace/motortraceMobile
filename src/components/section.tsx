import React from "react"
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native"
import Colors from "../constants/colors"

interface SectionProps {
  title: string
  children: React.ReactNode
  containerStyle?: ViewStyle
  titleStyle?: TextStyle
}

const Section: React.FC<SectionProps> = ({ title, children, containerStyle, titleStyle }) => {
  return (
    <View style={[styles.section, containerStyle]}>
      <Text style={[styles.sectionTitle, titleStyle]}>{title}</Text>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.neutral1000,
    marginBottom: 8,
  },
})

export default Section
