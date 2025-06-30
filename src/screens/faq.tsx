import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';
import FormBox from '../components/FormBox';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';

const FAQScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedItems, setExpandedItems] = useState({});

  const categories = ['All', 'Account', 'Profile', 'Privacy', 'Billing', 'Technical', 'General'];

  const faqData = [
    {
      id: 1,
      category: 'Account',
      question: 'How do I reset my password?',
      answer: 'To reset your password:\n\n1. Go to the login screen\n2. Tap "Forgot Password?"\n3. Enter your email address\n4. Check your email for reset instructions\n5. Follow the link to create a new password\n\nIf you don\'t receive the email, check your spam folder or contact support.',
      popular: true,
    },
    {
      id: 2,
      category: 'Account',
      question: 'How can I delete my account?',
      answer: 'To delete your account permanently:\n\n1. Go to Profile → Privacy Settings\n2. Scroll to "Data & Information"\n3. Tap "Delete Account"\n4. Confirm your decision\n\nWarning: This action cannot be undone. All your data will be permanently deleted within 30 days.',
      popular: false,
    },
    {
      id: 3,
      category: 'Profile',
      question: 'How do I change my profile picture?',
      answer: 'To update your profile picture:\n\n1. Go to your Profile screen\n2. Tap on your current profile image\n3. Choose "Camera" to take a new photo or "Gallery" to select from existing photos\n4. Crop and adjust as needed\n5. Save your changes\n\nSupported formats: JPG, PNG (max 5MB)',
      popular: true,
    },
    {
      id: 4,
      category: 'Profile',
      question: 'Can I change my username?',
      answer: 'Yes, you can change your username:\n\n1. Go to Profile → Edit Profile\n2. Tap on the username field\n3. Enter your new username\n4. Tap "Save"\n\nNote: Usernames must be unique and can only contain letters, numbers, and underscores. You can change it once every 30 days.',
      popular: false,
    },
    {
      id: 5,
      category: 'Privacy',
      question: 'How do I make my profile private?',
      answer: 'To make your profile private:\n\n1. Go to Profile → Privacy Settings\n2. Under "Account Privacy", tap "Profile Visibility"\n3. Select "Private"\n4. Your profile will only be visible to approved followers\n\nYou can also choose "Friends Only" for a middle-ground option.',
      popular: true,
    },
    {
      id: 6,
      category: 'Privacy',
      question: 'What data do you collect?',
      answer: 'We collect the following data to provide our services:\n\n• Profile information (name, email, photo)\n• Usage data (app interactions, preferences)\n• Device information (OS, device type)\n• Location data (if enabled)\n\nYou can download or delete your data anytime from Privacy Settings. Read our full Privacy Policy for detailed information.',
      popular: false,
    },
    {
      id: 7,
      category: 'Technical',
      question: 'Why am I not receiving notifications?',
      answer: 'If you\'re not receiving notifications, try these steps:\n\n1. Check app notification settings in your device Settings\n2. Ensure notifications are enabled in the app (Profile → Privacy Settings)\n3. Check if "Do Not Disturb" is enabled\n4. Restart the app\n5. Update to the latest version\n6. Restart your device\n\nIf the issue persists, contact our support team.',
      popular: true,
    },
    {
      id: 8,
      category: 'Technical',
      question: 'The app keeps crashing, what should I do?',
      answer: 'If the app is crashing frequently:\n\n1. Force close and restart the app\n2. Update to the latest version from the app store\n3. Restart your device\n4. Clear the app cache (Android) or reinstall (iOS)\n5. Ensure you have enough storage space\n6. Check your internet connection\n\nIf crashes continue, report the issue through our support system with details about when it happens.',
      popular: false,
    },
    {
      id: 9,
      category: 'Billing',
      question: 'How do I update my payment information?',
      answer: 'To update your payment details:\n\n1. Go to Profile → Settings\n2. Tap "Billing & Payments"\n3. Select "Payment Methods"\n4. Add a new card or update existing one\n5. Set as default if needed\n\nWe support Visa, Mastercard, American Express, and PayPal. All payments are processed securely.',
      popular: true,
    },
    {
      id: 10,
      category: 'Billing',
      question: 'Can I get a refund?',
      answer: 'Refund eligibility depends on several factors:\n\n• Subscription refunds: Available within 14 days of purchase\n• In-app purchases: Case-by-case basis\n• Technical issues: Full refund available\n\nTo request a refund:\n1. Contact our support team\n2. Provide your order details\n3. Explain the reason for refund\n\nWe\'ll review and respond within 2-3 business days.',
      popular: false,
    },
    {
      id: 11,
      category: 'General',
      question: 'Is my data secure?',
      answer: 'Yes, we take data security seriously:\n\n• End-to-end encryption for sensitive data\n• Regular security audits and updates\n• Secure servers with 24/7 monitoring\n• Compliance with GDPR and other regulations\n• No data sharing with third parties without consent\n\nYour privacy and security are our top priorities.',
      popular: true,
    },
    {
      id: 12,
      category: 'General',
      question: 'How do I contact customer support?',
      answer: 'You can reach our support team through:\n\n• Live Chat: Available 24/7 in the app\n• Email: support@yourapp.com\n• Phone: +1-234-567-8900 (Mon-Fri, 9AM-6PM)\n• Support Ticket: Through Help & Support section\n\nFor faster assistance, use live chat or include detailed information in your email.',
      popular: false,
    },
  ];

  const filteredFAQs = faqData.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const popularFAQs = faqData.filter(item => item.popular);

  const toggleExpanded = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const CategoryChip = ({ category, isSelected, onPress }) => (
    <TouchableOpacity
      style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextSelected]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  const FAQItem = ({ item, isExpanded, onToggle }) => (
    <FormBox style={styles.faqCard}>
      <TouchableOpacity
        style={styles.faqHeader}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <View style={styles.faqHeaderContent}>
          <View style={styles.faqTitleContainer}>
            <Text style={styles.faqQuestion}>{item.question}</Text>
            {item.popular && (
              <View style={styles.popularBadge}>
                <Icon name="star" size={12} color={Colors.warning} />
                <Text style={styles.popularText}>Popular</Text>
              </View>
            )}
          </View>
          <View style={styles.faqCategory}>
            <Text style={styles.faqCategoryText}>{item.category}</Text>
          </View>
        </View>
        <Icon 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={Colors.neutral600} 
        />
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.faqAnswer}>
          <Text style={styles.faqAnswerText}>{item.answer}</Text>
          <View style={styles.faqActions}>
            <TouchableOpacity style={styles.helpfulButton} activeOpacity={0.7}>
              <Icon name="thumbs-up-outline" size={16} color={Colors.primary} />
              <Text style={styles.helpfulText}>Helpful</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.helpfulButton} activeOpacity={0.7}>
              <Icon name="thumbs-down-outline" size={16} color={Colors.neutral400} />
              <Text style={styles.notHelpfulText}>Not Helpful</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </FormBox>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        icon="back"
        name="Frequently Asked Questions"
      />

      <SearchBar 
        placeholder="Search FAQs..."
        value={searchQuery}
        onChangeText={() => {}}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {!searchQuery && (
          <FormBox style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="star-outline" size={20} color={Colors.warning} />
              <Text style={styles.cardTitle}>Popular Questions</Text>
            </View>
            
            {popularFAQs.slice(0, 3).map((item) => (
              <View key={item.id}>
                <TouchableOpacity
                  style={styles.popularFAQItem}
                  onPress={() => toggleExpanded(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.popularFAQContent}>
                    <Text style={styles.popularFAQQuestion}>{item.question}</Text>
                    <Text style={styles.popularFAQCategory}>{item.category}</Text>
                  </View>
                  <Icon name="chevron-forward" size={18} color={Colors.neutral400} />
                </TouchableOpacity>
                {popularFAQs.indexOf(item) < 2 && <View style={styles.divider} />}
              </View>
            ))}
          </FormBox>
        )}

        {/* Category Filter */}
        <View style={styles.categoryContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScrollContent}
          >
            {categories.map((category) => (
              <CategoryChip
                key={category}
                category={category}
                isSelected={selectedCategory === category}
                onPress={() => setSelectedCategory(category)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Results Count */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {filteredFAQs.length} {filteredFAQs.length === 1 ? 'result' : 'results'}
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </Text>
        </View>

        {/* FAQ List */}
        {filteredFAQs.length > 0 ? (
          <View style={styles.faqList}>
            {filteredFAQs.map((item) => (
              <FAQItem
                key={item.id}
                item={item}
                isExpanded={expandedItems[item.id]}
                onToggle={() => toggleExpanded(item.id)}
              />
            ))}
          </View>
        ) : (
          <FormBox style={styles.noResultsCard}>
            <View style={styles.noResults}>
              <Icon name="search-outline" size={48} color={Colors.neutral300} />
              <Text style={styles.noResultsTitle}>No FAQs Found</Text>
              <Text style={styles.noResultsText}>
                Try adjusting your search terms or browse different categories
              </Text>
              <TouchableOpacity 
                style={styles.clearFiltersButton}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.clearFiltersText}>Clear Filters</Text>
              </TouchableOpacity>
            </View>
          </FormBox>
        )}

        {/* Still Need Help */}
        <FormBox style={styles.helpCard}>
          <View style={styles.helpContent}>
            <Icon name="help-circle-outline" size={32} color={Colors.primary} />
            <Text style={styles.helpTitle}>Still need help?</Text>
            <Text style={styles.helpText}>
              Can't find what you're looking for? Our support team is here to help.
            </Text>
            <TouchableOpacity style={styles.contactButton} activeOpacity={0.8}>
              <Text style={styles.contactButtonText}>Contact Support</Text>
            </TouchableOpacity>
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
    marginRight: 8,
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
  popularFAQItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  popularFAQContent: {
    flex: 1,
  },
  popularFAQQuestion: {
    fontSize: 16,
    color: Colors.neutral1000,
    fontWeight: '500',
    marginBottom: 4,
  },
  popularFAQCategory: {
    fontSize: 12,
    color: Colors.warning,
    backgroundColor: `${Colors.warning}10`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    fontWeight: '500',
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryScrollContent: {
    paddingHorizontal: 4,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.neutral100,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  categoryChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    color: Colors.neutral600,
    fontWeight: '500',
  },
  categoryChipTextSelected: {
    color: Colors.neutral0,
  },
  resultsContainer: {
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 14,
    color: Colors.neutral500,
    textAlign: 'center',
  },
  faqList: {
    marginBottom: 16,
  },
  faqCard: {
    marginBottom: 12,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  faqHeaderContent: {
    flex: 1,
    marginRight: 12,
  },
  faqTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  faqQuestion: {
    fontSize: 16,
    color: Colors.neutral1000,
    fontWeight: '500',
    flex: 1,
    lineHeight: 22,
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.warning}15`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  popularText: {
    fontSize: 10,
    color: Colors.warning,
    fontWeight: '600',
    marginLeft: 2,
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
  faqAnswer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  faqAnswerText: {
    fontSize: 15,
    color: Colors.neutral700,
    lineHeight: 22,
    marginBottom: 16,
  },
  faqActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.neutral100,
    marginRight: 12,
  },
  helpfulText: {
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  notHelpfulText: {
    fontSize: 14,
    color: Colors.neutral500,
    marginLeft: 4,
  },
  noResultsCard: {
    marginBottom: 16,
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    color: Colors.neutral500,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  clearFiltersButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  clearFiltersText: {
    fontSize: 14,
    color: Colors.neutral0,
    fontWeight: '600',
  },
  helpCard: {
    marginBottom: 16,
  },
  helpContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginTop: 12,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: Colors.neutral600,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  contactButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  contactButtonText: {
    fontSize: 16,
    color: Colors.neutral0,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutral200,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default FAQScreen;