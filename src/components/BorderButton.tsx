import React from "react"
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from "react-native"
import Colors from "../constants/colors"

interface BorderButtonProps {
  label: string
  onPress: () => void
  style?: ViewStyle
  textStyle?: TextStyle
}

const BorderButton: React.FC<BorderButtonProps> = ({ label, onPress, style, textStyle }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.label, textStyle]}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.neutral0,
    borderColor: Colors.primary,
    borderWidth: 1.5,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
})

export default BorderButton
