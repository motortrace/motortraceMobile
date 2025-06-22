"use client"

import type React from "react"
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated } from "react-native"
import { useEffect, useRef } from "react"
import Colors from "../constants/colors"
import Icon from 'react-native-vector-icons/Ionicons';

interface ConfirmationPopupProps {
  visible: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  confirmButtonColor?: string
  cancelButtonColor?: string
  iconType?: "warning" | "question" | "info"
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
  visible,
  title = "Are you sure?",
  message = "This action cannot be undone",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  confirmButtonColor = "#EF4444",
  cancelButtonColor = Colors.neutral500 || "#6B7280",
  iconType = "question",
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current
  const opacityAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      // Hide animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [visible])

  const handleConfirm = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onConfirm?.()
    })
  }

  const handleCancel = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onCancel?.()
    })
  }

const getIconConfig = () => {
  switch (iconType) {
    case "warning":
      return { icon: "alert", color: "#F59E0B" } // Just an exclamation mark
    case "info":
      return { icon: "information", color: "#3B82F6" } // Just an "i"
    case "question":
    default:
      return { icon: "help", color: "#6B7280" } // Just a "?"
  }
}


  const iconConfig = getIconConfig()

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={handleCancel}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={handleCancel}>
        <Animated.View style={[styles.container, { opacity: opacityAnim }]}>
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <Animated.View style={[styles.popup, { transform: [{ scale: scaleAnim }] }]}>

              {/* Icon */}
              <View style={styles.iconContainer}>
                <View style={[styles.iconBackground, { backgroundColor: iconConfig.color }]}>
                  <Icon name={iconConfig.icon} size={28} color="#fff" solid />
                </View>
              </View>

              {/* Content */}
              <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.message}>{message}</Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton, { borderColor: cancelButtonColor }]}
                  onPress={handleCancel}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.cancelButtonText, { color: cancelButtonColor }]}>{cancelText}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.confirmButton, { backgroundColor: confirmButtonColor }]}
                  onPress={handleConfirm}
                  activeOpacity={0.7}
                >
                  <Text style={styles.confirmButtonText}>{confirmText}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.shadowLg,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  popup: {
    backgroundColor: Colors.neutral0,
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
    minWidth: 300,
    maxWidth: 340,
    position: "relative",
  },
  decorativeContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.neutral300,
  },
  dot1: {
    top: 25,
    left: 35,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dot2: {
    top: 45,
    right: 25,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  dot3: {
    bottom: 80,
    left: 25,
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  dot4: {
    bottom: 60,
    right: 35,
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  dot5: {
    top: 65,
    left: 15,
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconBackground: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 32,
    color: Colors.neutral0,
    fontWeight: "bold",
  },
  content: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.neutral1000 || "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: Colors.neutral500,
    textAlign: "center",
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
  },
  confirmButton: {
    borderWidth: 0,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.neutral0,
  },
})

export default ConfirmationPopup
