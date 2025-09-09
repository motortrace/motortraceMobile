import React from "react"
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from "react-native"
import Colors from "../constants/colors"
import Icon from "react-native-vector-icons/Ionicons"

interface ButtonProps {
  label?: string
  onPress: () => void | Promise<void>
  containerStyle?: ViewStyle
  textStyle?: TextStyle
  icon?: string
}

const Button: React.FC<ButtonProps> = ({
  label = "Book appointment",
  onPress,
  containerStyle,
  textStyle,
  icon,
}) => {
  const handlePress = () => {
    try {
      const maybePromise = onPress?.();
      if (maybePromise && typeof (maybePromise as any).then === 'function') {
        (maybePromise as Promise<void>).catch((err) => {
          console.error('Button onPress error:', err);
        });
      }
    } catch (err) {
      console.error('Button onPress error:', err);
    }
  };

  return (
    <TouchableOpacity style={[styles.button, containerStyle]} onPress={handlePress} activeOpacity={0.8}>
      {icon && <Icon name={icon} size={20} color={Colors.neutral0} style={styles.icon} />}
      <Text style={[styles.buttonText, textStyle]}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: Colors.neutral0,
    fontSize: 16,
    fontWeight: "600",
  },
  icon: {
    marginRight: 8,
  },
})

export default Button
