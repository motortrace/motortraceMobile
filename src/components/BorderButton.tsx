import React from "react"
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
} from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import Colors from "../constants/colors"

interface BorderButtonProps {
  label: string
  onPress: () => void
  style?: ViewStyle         
  textStyle?: TextStyle      
  icon?: string  
}

const BorderButton: React.FC<BorderButtonProps> = ({
  label,
  onPress,
  style,
  textStyle,
  icon,
}) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <View style={styles.content}>
        {icon && (
          <Icon
            name={icon}
            size={18}
            color={Colors.primary}
            style={[styles.icon]}
          />
        )}
        <Text style={[styles.label, textStyle]}>{label}</Text>
      </View>
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
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 6,
  },
  label: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
})

export default BorderButton
