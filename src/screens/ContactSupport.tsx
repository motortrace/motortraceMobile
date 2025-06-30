import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';
import FormBox from '../components/FormBox';
import Header from '../components/Header';

const ContactSupportScreen = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [priority, setPriority] = useState('Medium');

  const supportOptions = [
    {
      id: 'chat',
      title: 'Live Chat',
      subtitle: 'Get instant help from our support team',
      icon: 'chatbubbles-outline',
      color: Colors.success,
      available: true,
      responseTime: 'Usually responds in minutes',
    },
    {
      id: 'email',
      title: 'Email Support',
      subtitle: 'Send us a detailed message',
      icon: 'mail-outline',
      color: Colors.primary,
      available: true,
      responseTime: 'Usually responds within 24 hours',
    },
    {
      id: 'phone',
      title: 'Phone Support',
      subtitle: '+1-234-567-8900',
      icon: 'call-outline',
      color: Colors.warning,
      available: true,
      responseTime: 'Mon-Fri, 9AM-6PM EST',
    },
    {
      id: 'ticket',
      title: 'Submit a Ticket',
      subtitle: 'Create a support ticket for complex issues',
      icon: 'document-text-outline',
      color: Colors.info,
      available: true,
      responseTime: 'Usually responds within 2-3 business days',
    },
  ];

  const priorities = ['Low', 'Medium', 'High', 'Urgent'];

  const handleContactMethod = (option) => {
    switch (option.id) {
      case 'chat':
        // Open live chat
        Alert.alert('Live Chat', 'Opening live chat...');
        break;
      case 'phone':
        Linking.openURL('tel:+12345678900');
        break;
      case 'email':
        setSelectedOption(option);
        break;
      case 'ticket':
        setSelectedOption(option);
        break;
    }
  };

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim() || !email.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    Alert.alert(
      'Success', 
      'Your message has been sent successfully. We\'ll get back to you soon!'
    );
    
    // Reset form
    setSelectedOption(null);
    setSubject('');
    setMessage('');
    setEmail('');
    setPriority('Medium');
  };

  const SupportOption = ({ option }) => (
    <FormBox style={styles.optionCard}>
      <TouchableOpacity
        style={styles.optionContent}
        onPress={() => handleContactMethod(option)}
        activeOpacity={0.7}
      >
        <View style={styles.optionHeader}>
          <View style={[styles.optionIcon, { backgroundColor: `${option.color}15` }]}>
            <Icon name={option.icon} size={24} color={option.color} />
          </View>
          <View style={styles.optionInfo}>
            <Text style={styles.optionTitle}>{option.title}</Text>
            <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
            <Text style={styles.responseTime}>{option.responseTime}</Text>
          </View>
          <View style={styles.optionAction}>
            <Icon name="chevron-forward" size={20} color={Colors.neutral400} />
          </View>
        </View>
        
        {option.available && (
          <View style={styles.availableBadge}>
            <View style={styles.availableDot} />
            <Text style={styles.availableText}>Available now</Text>
          </View>
        )}
      </TouchableOpacity>
    </FormBox>
  );

  const PriorityChip = ({ priority: priorityOption, isSelected, onPress }) => (
    <TouchableOpacity
      style={[
        styles.priorityChip,
        isSelected && styles.priorityChipSelected,
        priorityOption === 'Urgent' && isSelected && styles.urgentChipSelected
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.priorityChipText,
        isSelected && styles.priorityChipTextSelected,
        priorityOption === 'Urgent' && isSelected && styles.urgentChipTextSelected
      ]}>
        {priorityOption}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        icon="back"
        name="Contact Support"
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!selectedOption ? (
          <>
            {/* Header Info */}
            <FormBox style={styles.headerCard}>
              <View style={styles.headerContent}>
                <Icon name="help-circle-outline" size={48} color={Colors.primary} />
                <Text style={styles.headerTitle}>How can we help you?</Text>
                <Text style={styles.headerSubtitle}>
                  Choose the best way to get in touch with our support team
                </Text>
              </View>
            </FormBox>

            {/* Support Options */}
            <View style={styles.optionsContainer}>
              {supportOptions.map((option) => (
                <SupportOption key={option.id} option={option} />
              ))}
            </View>

            {/* Quick Help */}
            <FormBox style={styles.quickHelpCard}>
              <View style={styles.quickHelpHeader}>
                <Icon name="flash-outline" size={20} color={Colors.warning} />
                <Text style={styles.quickHelpTitle}>Quick Help</Text>
              </View>
              <Text style={styles.quickHelpText}>
                Before contacting support, try checking our FAQ section for instant answers to common questions.
              </Text>
              <TouchableOpacity style={styles.faqButton} activeOpacity={0.7}>
                <Text style={styles.faqButtonText}>View FAQ</Text>
                <Icon name="arrow-forward" size={16} color={Colors.primary} />
              </TouchableOpacity>
            </FormBox>
          </>
        ) : (
          /* Contact Form */
          <>
            <FormBox style={styles.formHeader}>
              <TouchableOpacity
                style={styles.backToOptions}
                onPress={() => setSelectedOption(null)}
                activeOpacity={0.7}
              >
                <Icon name="arrow-back" size={20} color={Colors.primary} />
                <Text style={styles.backToOptionsText}>Back to options</Text>
              </TouchableOpacity>
              <View style={styles.selectedOptionInfo}>
                <Icon name={selectedOption.icon} size={24} color={selectedOption.color} />
                <Text style={styles.selectedOptionTitle}>{selectedOption.title}</Text>
              </View>
            </FormBox>

            <FormBox style={styles.formCard}>
              {/* Email Field */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Email Address *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="your.email@example.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Priority Selection */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Priority</Text>
                <View style={styles.priorityContainer}>
                  {priorities.map((priorityOption) => (
                    <PriorityChip
                      key={priorityOption}
                      priority={priorityOption}
                      isSelected={priority === priorityOption}
                      onPress={() => setPriority(priorityOption)}
                    />
                  ))}
                </View>
              </View>

              {/* Subject Field */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Subject *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Brief description of your issue"
                  value={subject}
                  onChangeText={setSubject}
                />
              </View>

              {/* Message Field */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Message *</Text>
                <TextInput
                  style={[styles.input, styles.messageInput]}
                  placeholder="Please describe your issue in detail..."
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
                <Text style={styles.charCount}>{message.length}/1000</Text>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitButton, (!subject.trim() || !message.trim() || !email.trim()) && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                activeOpacity={0.8}
                disabled={!subject.trim() || !message.trim() || !email.trim()}
              >
                <Text style={styles.submitButtonText}>
                  {selectedOption.id === 'email' ? 'Send Email' : 'Submit Ticket'}
                </Text>
              </TouchableOpacity>
            </FormBox>
          </>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primarybg,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  headerCard: {
    marginBottom: 24,
  },
  headerContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral1000,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.neutral600,
    textAlign: 'center',
    lineHeight: 22,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionCard: {
    marginBottom: 12,
  },
  optionContent: {
    paddingVertical: 4,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: Colors.neutral600,
    marginBottom: 4,
  },
  responseTime: {
    fontSize: 12,
    color: Colors.neutral500,
  },
  optionAction: {
    marginLeft: 12,
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingLeft: 64,
  },
  availableDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
    marginRight: 8,
  },
  availableText: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '500',
  },
  quickHelpCard: {
    marginBottom: 24,
  },
  quickHelpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickHelpTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginLeft: 8,
  },
  quickHelpText: {
    fontSize: 14,
    color: Colors.neutral600,
    lineHeight: 20,
    marginBottom: 16,
  },
  faqButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  faqButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginRight: 4,
  },
  formHeader: {
    marginBottom: 16,
  },
  backToOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backToOptionsText: {
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 8,
    fontWeight: '500',
  },
  selectedOptionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.neutral100,
    borderRadius: 12,
  },
  selectedOptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginLeft: 12,
  },
  formCard: {
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral1000,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.neutral300,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.neutral1000,
    backgroundColor: Colors.neutral0,
  },
  messageInput: {
    minHeight: 120,
    paddingTop: 14,
  },
  charCount: {
    fontSize: 12,
    color: Colors.neutral500,
    textAlign: 'right',
    marginTop: 4,
  },
  priorityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  priorityChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.neutral100,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  priorityChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  urgentChipSelected: {
    backgroundColor: Colors.danger,
    borderColor: Colors.danger,
  },
  priorityChipText: {
    fontSize: 14,
    color: Colors.neutral600,
    fontWeight: '500',
  },
  priorityChipTextSelected: {
    color: Colors.neutral0,
  },
  urgentChipTextSelected: {
    color: Colors.neutral0,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.neutral300,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral0,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default ContactSupportScreen;