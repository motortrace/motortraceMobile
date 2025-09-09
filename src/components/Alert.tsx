import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import Colors from '../constants/colors';

const { width } = Dimensions.get('window');

// Type definitions
export type AlertType = 'success' | 'error' | 'warning' | 'info';
export type ButtonType = 'none' | 'single' | 'double' | 'triple';

export interface CustomAlertProps {
  visible: boolean;
  title?: string;
  message?: string;
  onClose?: () => void;
  type?: AlertType;
  buttonType?: ButtonType;
  onCancel?: () => void;
  onOption1?: () => void;
  onOption2?: () => void;
  confirmText?: string;
  cancelText?: string;
  option1Text?: string;
  option2Text?: string;
  autoDismiss?: boolean;
  autoDismissDelay?: number;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ 
  visible, 
  title, 
  message, 
  onClose, 
  type = 'info',
  buttonType = 'single',
  onCancel,
  onOption1,
  onOption2,
  confirmText = 'OK',
  cancelText = 'Cancel',
  option1Text = 'Option 1',
  option2Text = 'Option 2',
  autoDismiss = false,
  autoDismissDelay = 1000
}) => {
  // Auto dismiss effect
  useEffect(() => {
    if (visible && (buttonType === 'none' || autoDismiss)) {
      const timer = setTimeout(() => {
        onClose && onClose();
      }, autoDismissDelay);

      return () => clearTimeout(timer);
    }
  }, [visible, buttonType, autoDismiss, autoDismissDelay, onClose]);

  const getAlertColor = (): string => {
    switch (type) {
      case 'success':
        return '#10B981'; // Green
      case 'error':
        return '#EF4444'; // Red
      case 'warning':
        return '#F59E0B'; // Yellow
      default:
        return Colors.primary || '#3B82F6'; // Blue
    }
  };

  const getIcon = (): string => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  const renderButtons = (): React.ReactNode => {
    if (buttonType === 'none') {
      return null;
    }

    if (buttonType === 'single') {
      return (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button, 
              styles.confirmButton,
              styles.singleButton,
              { backgroundColor: getAlertColor() }
            ]}
            onPress={onClose}
          >
            <Text style={styles.confirmButtonText}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (buttonType === 'double') {
      return (
        <View style={styles.buttonContainer}>
          <View style={styles.doubleButtonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, styles.doubleButton]}
              onPress={onCancel || onClose}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.button, 
                styles.confirmButton,
                styles.doubleButton,
                { backgroundColor: getAlertColor() }
              ]}
              onPress={onClose}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (buttonType === 'triple') {
      return (
        <View style={styles.buttonContainer}>
          {/* Cancel Button - Full width on top */}
          <TouchableOpacity
            style={[styles.button, styles.cancelButton, styles.fullWidthButton]}
            onPress={onCancel || onClose}
          >
            <Text style={styles.cancelButtonText}>{cancelText}</Text>
          </TouchableOpacity>
          
          {/* Option buttons - Side by side */}
          <View style={styles.optionButtonsRow}>
            <TouchableOpacity
              style={[
                styles.button, 
                styles.option1Button,
                { backgroundColor: getAlertColor() }
              ]}
              onPress={onOption1 || onClose}
            >
              <Text style={styles.confirmButtonText}>{option1Text}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.button, 
                styles.option2Button,
                { backgroundColor: Colors.secondary || '#6B7280' }
              ]}
              onPress={onOption2 || onClose}
            >
              <Text style={styles.confirmButtonText}>{option2Text}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[
          styles.alertContainer,
          buttonType === 'none' && styles.alertContainerNoPadding
        ]}>
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: getAlertColor() }]}>
            <Text style={styles.icon}>{getIcon()}</Text>
          </View>

          {/* Title */}
          {title && (
            <Text style={styles.title}>{title}</Text>
          )}

          {/* Message */}
          {message && (
            <Text style={[
              styles.message,
              buttonType === 'none' && styles.messageNoButtons
            ]}>
              {message}
            </Text>
          )}

          {/* Buttons */}
          {renderButtons()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  alertContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: width * 0.85,
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  alertContainerNoPadding: {
    paddingBottom: 24, // Reduce bottom padding when no buttons
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.neutral1000 || '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: Colors.neutral600 || '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  messageNoButtons: {
    marginBottom: 0, // Remove bottom margin when no buttons
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  singleButton: {
    width: '100%',
  },
  doubleButtonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  doubleButton: {
    flex: 1,
  },
  confirmButton: {
    backgroundColor: '#3B82F6',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.neutral300 || '#D1D5DB',
  },
  fullWidthButton: {
    width: '100%',
    marginBottom: 12,
  },
  optionButtonsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  option1Button: {
    flex: 1,
  },
  option2Button: {
    flex: 1,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: Colors.neutral600 || '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomAlert;