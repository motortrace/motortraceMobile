import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import Colors from "../constants/colors"
import Link from "./Link"

interface VerificationRowProps {
  type: "email" | "contact"
  isVerified: boolean
  onVerify: () => void
}

const VerificationRow: React.FC<VerificationRowProps> = ({ type, isVerified, onVerify }) => {
  return (
    <View style={styles.verificationRow}>
      <View style={styles.verificationStatus}>
        <View
          style={[
            styles.statusIcon,
            {
              backgroundColor: isVerified
                ? Colors.success || "#10B981"
                : Colors.neutral300 || "#E5E7EB",
            },
          ]}
        >
          <Text
            style={[
              styles.statusIconText,
              {
                color: isVerified ? "#FFFFFF" : Colors.neutral500 || "#6B7280",
              },
            ]}
          >
            {isVerified ? "✓" : "?"}
          </Text>
        </View>
        <Text
          style={[
            styles.verificationText,
            {
              color: isVerified
                ? Colors.success || "#10B981"
                : Colors.neutral700 || "#374151",
            },
          ]}
        >
          {isVerified
            ? `${type.charAt(0).toUpperCase() + type.slice(1)} Verified`
            : `Verify ${type}`}
        </Text>
      </View>

      <TouchableOpacity onPress={onVerify} style={styles.verifyButton}>
        <Link link={isVerified ? "Change" : "Verify"} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  verificationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    marginTop: -8,
  },
  verificationStatus: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statusIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  statusIconText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  verificationText: {
    fontSize: 14,
    fontWeight: "500",
  },
  verifyButton: {
    paddingHorizontal: 4,
  },
})

export default VerificationRow
