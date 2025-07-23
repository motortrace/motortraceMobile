import React from "react"
import { View, TextInput, StyleSheet } from "react-native"
import Colors from "../constants/colors"

interface OtpInputBoxProps {
  value: string[]
  onChange: (value: string, index: number) => void
  length?: number
}

const OtpInputBox: React.FC<OtpInputBoxProps> = ({
  value,
  onChange,
  length = 6,
}) => {
  return (
    <View style={styles.otpInputContainer}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          style={[
            styles.otpInput,
            {
              borderColor: value[index] ? Colors.primary : Colors.neutral300,
              backgroundColor: value[index]
                ? Colors.primary + "10"
                : Colors.neutral50,
            },
          ]}
          value={value[index]}
          onChangeText={(val) => {
            const digit = val.replace(/[^0-9]/g, "")
            onChange(digit, index)
          }}
          keyboardType="numeric"
          maxLength={1}
          textAlign="center"
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  otpInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  otpInput: {
    flex: 1,
    height: 56,
    borderWidth: 2,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.neutral1000,
  },
})

export default OtpInputBox
