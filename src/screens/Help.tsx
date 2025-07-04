import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';
import FormBox from '../components/FormBox';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';

const HelpSupportScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const quickHelpTopics = [
    {
      id: 2,
      title: 'Password Recovery',
      subtitle: 'Reset or recover your password',
      icon: 'key-outline',
      color: '#FF6B6B',
    },
    {
      id: 3,
      title: 'Profile Management',
      subtitle: 'Update your profile information',
      icon: 'person-outline',
      color: '#4ECDC4',
    },
    {
      id: 4,
      title: 'Technical Issues',
      subtitle: 'App crashes and bugs',
      icon: 'bug-outline',
      color: '#45B7D1',
    },
    {
      id: 5,
      title: 'Billing Support',
      subtitle: 'Payment and subscription help',
      icon: 'card-outline',
      color: '#96CEB4',
    },
    {
      id: 6,
      title: 'Privacy & Security',
      subtitle: 'Data protection and security',
      icon: 'shield-outline',
      color: '#FFEAA7',
    },
  ];

  const contactOptions = [
    {
      title: 'Live Chat',
      subtitle: 'Chat with our support team',
      icon: 'chatbubble-outline',
      availability: 'Available 24/7',
      action: () => Alert.alert('Live Chat', 'Opening chat window...'),
    },
    {
      title: 'Email Support',
      subtitle: 'Send us an email',
      icon: 'mail-outline',
      availability: 'Response within 24 hours',
      action: () => Linking.openURL('mailto:support@yourapp.com'),
    },
    {
      title: 'Phone Support',
      subtitle: 'Call our support line',
      icon: 'call-outline',
      availability: 'Mon-Fri, 9AM-6PM',
      action: () => Linking.openURL('tel:+1234567890'),
    },
  ];

  const faqItems = [
    {
      question: 'How do I reset my password?',
      category: 'Account',
    },
    {
      question: 'How to change my profile picture?',
      category: 'Profile',
    },
    {
      question: 'Why am I not receiving notifications?',
      category: 'Technical',
    },
    {
      question: 'How to delete my account?',
      category: 'Account',
    },
    {
      question: 'How to update payment information?',
      category: 'Billing',
    },
  ];

  const handleTopicPress = (topic) => {
    Alert.alert(
      topic.title,
      'This will open detailed help for ' + topic.title,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View Help', onPress: () => console.log('Opening help for:', topic.title) },
      ]
    );
  };

  const handleSubmitTicket = () => {
    Alert.alert(
      'Submit Support Ticket',
      'This will open a form to submit your support request.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => console.log('Opening ticket form') },
      ]
    );
  };

  const QuickHelpCard = ({ topic }) => (
    <TouchableOpacity
      style={styles.quickHelpCard}
      onPress={() => handleTopicPress(topic)}
      activeOpacity={0.8}
    >
      <View style={[styles.quickHelpIcon, { backgroundColor: `${topic.color}15` }]}>
        <Icon name={topic.icon} size={24} color={topic.color} />
      </View>
      <View style={styles.quickHelpContent}>
        <Text style={styles.quickHelpTitle}>{topic.title}</Text>
        <Text style={styles.quickHelpSubtitle}>{topic.subtitle}</Text>
      </View>
      <Icon name="chevron-forward" size={20} color={Colors.neutral400} />
    </TouchableOpacity>
  );

  const ContactCard = ({ option }) => (
    <TouchableOpacity
      style={styles.contactCard}
      onPress={option.action}
      activeOpacity={0.8}
    >
      <View style={styles.contactLeft}>
        <View style={styles.contactIconContainer}>
          <Icon name={option.icon} size={20} color={Colors.primary} />
        </View>
        <View style={styles.contactContent}>
          <Text style={styles.contactTitle}>{option.title}</Text>
          <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
          <Text style={styles.contactAvailability}>{option.availability}</Text>
        </View>
      </View>
      <Icon name="chevron-forward" size={20} color={Colors.neutral400} />
    </TouchableOpacity>
  );

  const FAQItem = ({ item, isLast = false }) => (
    <View>
      <TouchableOpacity
        style={styles.faqItem}
        onPress={() => Alert.alert('FAQ', 'This will show the full answer')}
        activeOpacity={0.7}
      >
        <View style={styles.faqContent}>
          <Text style={styles.faqQuestion}>{item.question}</Text>
          <View style={styles.faqCategory}>
            <Text style={styles.faqCategoryText}>{item.category}</Text>
          </View>
        </View>
        <Icon name="chevron-forward" size={18} color={Colors.neutral400} />
      </TouchableOpacity>
      {!isLast && <View style={styles.faqDivider} />}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        icon="back"
        name="Help & Support"
        onIconPress={() => navigation.navigate('Profile')}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Quick Help Topics */}
        <FormBox style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="flash-outline" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Quick Help</Text>
          </View>
          
          {quickHelpTopics.map((topic, index) => (
            <View key={topic.id}>
              <QuickHelpCard topic={topic} />
              {index < quickHelpTopics.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </FormBox>

        {/* Contact Support */}
        <FormBox style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="headset-outline" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Contact Support</Text>
          </View>
          
          {contactOptions.map((option, index) => (
            <View key={index}>
              <ContactCard option={option} />
              {index < contactOptions.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </FormBox>

        {/* FAQ Section */}
        <FormBox style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="help-circle-outline" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Frequently Asked Questions</Text>
          </View>
          
          {faqItems.map((item, index) => (
            <FAQItem 
              key={index} 
              item={item} 
              isLast={index === faqItems.length - 1}
            />
          ))}
          
          <TouchableOpacity style={styles.viewAllFAQ} activeOpacity={0.7}>
            <Text style={styles.viewAllText}>View All FAQs</Text>
            <Icon name="chevron-forward" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </FormBox>

        {/* Resources */}
        <FormBox style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="library-outline" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Resources</Text>
          </View>

          <TouchableOpacity style={styles.resourceItem} activeOpacity={0.7}>
            <View style={styles.resourceLeft}>
              <View style={styles.resourceIconContainer}>
                <Icon name="book-outline" size={18} color={Colors.primary} />
              </View>
              <Text style={styles.resourceText}>User Guide</Text>
            </View>
            <Icon name="chevron-forward" size={20} color={Colors.neutral400} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.resourceItem} activeOpacity={0.7}>
            <View style={styles.resourceLeft}>
              <View style={styles.resourceIconContainer}>
                <Icon name="play-circle-outline" size={18} color={Colors.primary} />
              </View>
              <Text style={styles.resourceText}>Video Tutorials</Text>
            </View>
            <Icon name="chevron-forward" size={20} color={Colors.neutral400} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.resourceItem} activeOpacity={0.7}>
            <View style={styles.resourceLeft}>
              <View style={styles.resourceIconContainer}>
                <Icon name="people-outline" size={18} color={Colors.primary} />
              </View>
              <Text style={styles.resourceText}>Community Forums</Text>
            </View>
            <Icon name="chevron-forward" size={20} color={Colors.neutral400} />
          </TouchableOpacity>
        </FormBox>

        {/* System Status */}
        <FormBox style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="pulse-outline" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>System Status</Text>
          </View>

          <View style={styles.statusContainer}>
            <View style={styles.statusIndicator}>
              <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.statusText}>All Systems Operational</Text>
            </View>
          </View>
        </FormBox>

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
  searchCard: {
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral100,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.neutral1000,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginLeft: 10,
  },
  quickHelpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  quickHelpIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  quickHelpContent: {
    flex: 1,
  },
  quickHelpTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral1000,
    marginBottom: 2,
  },
  quickHelpSubtitle: {
    fontSize: 14,
    color: Colors.neutral500,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${Colors.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral1000,
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 14,
    color: Colors.neutral600,
    marginBottom: 2,
  },
  contactAvailability: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  ticketButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: `${Colors.primary}05`,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: `${Colors.primary}20`,
  },
  ticketIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${Colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  ticketContent: {
    flex: 1,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 2,
  },
  ticketSubtitle: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  faqContent: {
    flex: 1,
  },
  faqQuestion: {
    fontSize: 16,
    color: Colors.neutral1000,
    fontWeight: '400',
    marginBottom: 6,
  },
  faqCategory: {
    alignSelf: 'flex-start',
  },
  faqCategoryText: {
    fontSize: 12,
    color: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: '500',
  },
  faqDivider: {
    height: 1,
    backgroundColor: Colors.neutral200,
  },
  viewAllFAQ: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
    marginRight: 4,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  }
})

export default HelpSupportScreen;