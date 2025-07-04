import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';
import SettingRow from '../components/SettingRow';

const AccountDelegationPage = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setEmail] = useState('Abdullaaurad@gmail.com')

  const handleDelegateAccount = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmDelegation = () => {
    if (confirmationText.toLowerCase() !== 'delegate my account') {
      Alert.alert('Error', 'Please type the exact confirmation phrase to proceed.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowConfirmModal(false);
      Alert.alert('Success', 'Account delegation process initiated successfully!');
    }, 2000);
  };

  const consequences = [
    {
      icon: 'person-remove-outline',
      title: 'Account Access',
      description: 'You will lose immediate access to your account and all associated services.',
      severity: 'high'
    },
    {
      icon: 'card-outline',
      title: 'Payment Methods',
      description: 'All saved payment methods and billing information will be transferred.',
      severity: 'medium'
    },
    {
      icon: 'document-text-outline',
      title: 'Data & History',
      description: 'Complete account history, preferences, and personal data will be transferred.',
      severity: 'high'
    },
    {
      icon: 'notifications-outline',
      title: 'Communications',
      description: 'All future notifications and communications will go to the new account holder.',
      severity: 'medium'
    },
    {
      icon: 'time-outline',
      title: 'Recovery Process',
      description: 'Account recovery will require verification from the new account holder.',
      severity: 'high'
    },
    {
      icon: 'shield-outline',
      title: 'Security Settings',
      description: 'All security settings, 2FA, and recovery methods will be reset.',
      severity: 'high'
    }
  ];

  const requirements = [
    'Valid government-issued ID verification',
    'Email verification for both parties',
    'Legal documentation (if required by jurisdiction)',
    'Confirmation from the receiving party',
    '48-hour cooling-off period before finalization'
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.warningIcon}>
            <Icon name="warning" size={32} color={Colors.warning} />
          </View>
          <Text style={styles.title}>Account Delegation</Text>
          <Text style={styles.subtitle}>
            Transfer complete ownership and control of your account to another person
          </Text>
        </View>

        {/* Current Account Info */}
        <View style={styles.accountInfo}>
          <View style={styles.accountHeader}>
            <Icon name="person-circle-outline" size={24} color={Colors.primary} />
            <Text style={styles.accountTitle}>Current Account</Text>
          </View>
          <Text style={styles.accountEmail}>{userEmail || 'user@example.com'}</Text>
        </View>

        {/* What Happens Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What Will Happen</Text>
          <View style={styles.consequencesList}>
            {consequences.map((item, index) => (
              <View key={index} style={styles.consequenceItem}>
                <View style={[
                  styles.consequenceIcon, 
                  { backgroundColor: item.severity === 'high' ? '#FEE2E2' : '#FEF3C7' }
                ]}>
                  <Icon 
                    name={item.icon} 
                    size={20} 
                    color={item.severity === 'high' ? Colors.danger : Colors.warning} 
                  />
                </View>
                <View style={styles.consequenceContent}>
                  <Text style={styles.consequenceTitle}>{item.title}</Text>
                  <Text style={styles.consequenceDesc}>{item.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Requirements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          <View style={styles.requirementsList}>
            {requirements.map((requirement, index) => (
              <View key={index} style={styles.requirementItem}>
                <Icon name="checkmark-circle-outline" size={16} color={Colors.success} />
                <Text style={styles.requirementText}>{requirement}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Important Notice */}
        <View style={styles.noticeBox}>
          <View style={styles.noticeHeader}>
            <Icon name="information-circle" size={20} color={Colors.info} />
            <Text style={styles.noticeTitle}>Important Notice</Text>
          </View>
          <Text style={styles.noticeText}>
            Account delegation is a permanent action that cannot be easily reversed. 
            Please ensure you understand all consequences before proceeding. 
            You will have 48 hours to cancel this request after confirmation.
          </Text>
        </View>

        {/* Legal Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            By proceeding with account delegation, you acknowledge that you have read, 
            understood, and agree to transfer all rights, data, and responsibilities 
            associated with this account. This action may have legal implications 
            depending on your jurisdiction.
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.cancelButton}
          activeOpacity={0.8}
          onPress={()=>navigation.navigate('PrivacySettings')}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.delegateButton}
          onPress={handleDelegateAccount}
          activeOpacity={0.8}
        >
          <Icon name="trash" size={18} color={Colors.neutral0} />
          <Text style={styles.delegateButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Icon name="warning" size={32} color={Colors.danger} />
              <Text style={styles.modalTitle}>Final Confirmation</Text>
              <Text style={styles.modalSubtitle}>
                This action is irreversible and will immediately transfer your account.
              </Text>
            </View>

            <View style={styles.confirmationInput}>
              <Text style={styles.confirmationLabel}>
                Type "delegate my account" to confirm:
              </Text>
              <TextInput
                style={styles.confirmationTextInput}
                value={confirmationText}
                onChangeText={setConfirmationText}
                placeholder="Type here..."
                placeholderTextColor={Colors.neutral400}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowConfirmModal(false);
                  setConfirmationText('');
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.modalConfirmButton,
                  isLoading && styles.modalConfirmButtonDisabled
                ]}
                onPress={handleConfirmDelegation}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Text style={styles.modalConfirmText}>Processing...</Text>
                ) : (
                  <Text style={styles.modalConfirmText}>Confirm Delegation</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 120,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  warningIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.warning + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.neutral900,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.neutral600,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Account Info
  accountInfo: {
    backgroundColor: Colors.neutral50,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  accountTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral900,
    marginLeft: 8,
  },
  accountEmail: {
    fontSize: 14,
    color: Colors.neutral600,
    marginLeft: 32,
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 16,
  },

  // Consequences
  consequencesList: {
    gap: 16,
  },
  consequenceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  consequenceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  consequenceContent: {
    flex: 1,
  },
  consequenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 4,
  },
  consequenceDesc: {
    fontSize: 14,
    color: Colors.neutral600,
    lineHeight: 20,
  },

  // Requirements
  requirementsList: {
    gap: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requirementText: {
    fontSize: 14,
    color: Colors.neutral700,
    marginLeft: 12,
    flex: 1,
  },

  // Notice Box
  noticeBox: {
    backgroundColor: Colors.info + '08',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.info + '20',
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.info,
    marginLeft: 8,
  },
  noticeText: {
    fontSize: 14,
    color: Colors.neutral700,
    lineHeight: 20,
  },

  // Disclaimer
  disclaimer: {
    backgroundColor: Colors.neutral50,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  disclaimerText: {
    fontSize: 12,
    color: Colors.neutral600,
    lineHeight: 18,
    textAlign: 'center',
  },

  // Action Buttons
  actionButtons: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: Colors.neutral0,
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral100,
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral300,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral700,
  },
  delegateButton: {
    flex: 1,
    backgroundColor: Colors.danger,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  delegateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral0,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: Colors.neutral0,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral900,
    marginTop: 12,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.neutral600,
    textAlign: 'center',
    lineHeight: 20,
  },
  confirmationInput: {
    marginBottom: 24,
  },
  confirmationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 8,
  },
  confirmationTextInput: {
    borderWidth: 1,
    borderColor: Colors.neutral300,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.neutral900,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral300,
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral700,
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: Colors.danger,
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalConfirmButtonDisabled: {
    opacity: 0.6,
  },
  modalConfirmText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral0,
  },
});

export default AccountDelegationPage;