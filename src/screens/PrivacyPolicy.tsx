import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';
import FormBox from '../components/FormBox';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';

const PrivacyPolicyScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [expandedSections, setExpandedSections] = useState({});

  const lastUpdated = "January 15, 2025";

  const privacySections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: 'information-circle-outline',
      content: `We collect information you provide directly to us, such as when you create an account, update your profile, or contact us for support.

**Personal Information:**
• Name and email address
• Profile photo and bio
• Phone number (optional)
• Date of birth (for age verification)

**Usage Information:**
• App interactions and preferences
• Device information (OS, model, version)
• IP address and general location
• Crash reports and performance data

**Communication Data:**
• Messages and content you create
• Support conversations
• Feedback and survey responses

We do not collect sensitive personal information such as financial data, health records, or government identification numbers without explicit consent.`,
    },
    {
      id: 'information-use',
      title: 'How We Use Your Information',
      icon: 'settings-outline',
      content: `We use the information we collect to provide, maintain, and improve our services.

**Primary Uses:**
• Create and manage your account
• Provide customer support
• Send important notifications
• Improve app functionality and performance

**Communication:**
• Respond to your inquiries
• Send service-related announcements
• Provide promotional content (with consent)
• Conduct user research and surveys

**Safety and Security:**
• Detect and prevent fraud
• Monitor for suspicious activity
• Enforce our Terms of Service
• Protect user safety and privacy

We will never sell your personal information to third parties or use it for purposes other than those described in this policy.`,
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing and Disclosure',
      icon: 'share-outline',
      content: `We are committed to protecting your privacy and do not share your personal information except in the following circumstances:

**With Your Consent:**
• When you explicitly authorize us to share information
• For features that require third-party integration

**Service Providers:**
• Cloud hosting and storage services
• Analytics and crash reporting tools
• Customer support platforms
• Payment processors (for paid features)

**Legal Requirements:**
• To comply with legal obligations
• To protect our rights and property
• To ensure user safety
• In response to lawful government requests

**Business Transfers:**
• In case of merger, acquisition, or sale of assets
• Users will be notified of any ownership changes

We require all third parties to maintain the confidentiality and security of your information and to use it only for specified purposes.`,
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: 'shield-checkmark-outline',
      content: `We implement industry-standard security measures to protect your personal information.

**Technical Safeguards:**
• End-to-end encryption for sensitive data
• Secure data transmission (HTTPS/TLS)
• Regular security audits and updates
• Access controls and authentication

**Physical Safeguards:**
• Secure data centers with 24/7 monitoring
• Restricted access to servers and equipment
• Environmental controls and backup systems

**Administrative Safeguards:**
• Employee training on data protection
• Regular policy reviews and updates
• Incident response procedures
• Vendor security assessments

**Your Role:**
• Use strong, unique passwords
• Enable two-factor authentication
• Keep your app updated
• Report suspicious activity immediately

While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security but are committed to protecting your data.`,
    },
    {
      id: 'data-retention',
      title: 'Data Retention',
      icon: 'time-outline',
      content: `We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy.

**Account Information:**
• Retained while your account is active
• Deleted within 30 days of account closure
• Some information may be retained for legal compliance

**Usage Data:**
• Aggregated analytics: Retained indefinitely
• Individual usage logs: Deleted after 2 years
• Crash reports: Deleted after 1 year

**Communication Data:**
• Support conversations: Retained for 3 years
• User feedback: Retained for 2 years
• Marketing communications: Until you unsubscribe

**Legal Retention:**
• Information subject to legal holds
• Data required for ongoing legal proceedings
• Records required by applicable laws

You can request deletion of your personal information at any time by contacting our support team. We will process your request within 30 days, subject to legal requirements.`,
    },
    {
      id: 'your-rights',
      title: 'Your Privacy Rights',
      icon: 'person-outline',
      content: `You have several rights regarding your personal information, subject to applicable laws.

**Access and Portability:**
• Request a copy of your personal information
• Export your data in a readable format
• Access your account activity and settings

**Correction and Updates:**
• Update your profile information anytime
• Correct inaccurate personal information
• Request verification of data accuracy

**Deletion and Erasure:**
• Delete your account and associated data
• Request removal of specific information
• Right to be forgotten (where applicable)

**Control and Consent:**
• Opt out of marketing communications
• Manage notification preferences
• Withdraw consent for data processing

**Additional Rights (Regional):**
• GDPR rights for EU residents
• CCPA rights for California residents
• Other regional privacy law protections

To exercise these rights, contact our privacy team at privacy@yourapp.com or through the app's privacy settings.`,
    },
    {
      id: 'children-privacy',
      title: "Children's Privacy",
      icon: 'people-outline',
      content: `We are committed to protecting the privacy of children and comply with applicable laws regarding minors.

**Age Restrictions:**
• Our service is not intended for children under 13
• Users between 13-17 require parental consent
• Age verification is required during registration

**Parental Rights:**
• Parents can review their child's information
• Request deletion of their child's account
• Control privacy settings and data sharing

**Limited Data Collection:**
• Minimal information collection for minors
• No behavioral advertising to children
• Enhanced privacy protections

**Educational Use:**
• Special provisions for school-sponsored accounts
• Compliance with COPPA and FERPA
• Enhanced security for educational environments

If you believe a child under 13 has provided personal information without parental consent, please contact us immediately at privacy@yourapp.com and we will delete the information.`,
    },
    {
      id: 'international-transfers',
      title: 'International Data Transfers',
      icon: 'globe-outline',
      content: `Your information may be transferred to and processed in countries other than your own.

**Data Processing Locations:**
• Primary servers located in the United States
• Backup systems in the European Union
• CDN services in multiple regions

**Transfer Safeguards:**
• Standard Contractual Clauses (SCCs)
• Adequacy decisions where available
• Privacy Shield principles (where applicable)
• Regular compliance assessments

**Regional Protections:**
• GDPR compliance for EU data subjects
• Adequate level of protection maintained
• Right to object to international transfers

**Your Rights:**
• Information about where your data is processed
• Ability to request local data processing
• Right to file complaints with supervisory authorities

We ensure that all international transfers maintain the same level of privacy protection as required by your local jurisdiction.`,
    },
    {
      id: 'cookies-tracking',
      title: 'Cookies and Tracking',
      icon: 'analytics-outline',
      content: `We use cookies and similar technologies to improve your experience and understand how our service is used.

**Types of Cookies:**
• Essential cookies for basic functionality
• Performance cookies for analytics
• Functional cookies for preferences
• Targeting cookies for personalization (with consent)

**Third-Party Services:**
• Google Analytics for usage statistics
• Crash reporting services
• Performance monitoring tools
• Customer support platforms

**Your Choices:**
• Manage cookie preferences in settings
• Opt out of non-essential cookies
• Use browser controls to block cookies
• Clear cookies and tracking data

**Mobile App Tracking:**
• Device identifiers for analytics
• App usage statistics
• Crash and error reporting
• Push notification tokens

You can control most tracking through your device settings and our privacy preferences. Some features may not work properly if you disable certain tracking technologies.`,
    },
    {
      id: 'policy-changes',
      title: 'Changes to This Policy',
      icon: 'document-text-outline',
      content: `We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws.

**Notification of Changes:**
• Email notification for significant changes
• In-app notifications for policy updates
• Updated "Last Modified" date on this page
• 30-day notice period for material changes

**Types of Changes:**
• Clarifications of existing practices
• New features or services
• Legal or regulatory requirements
• Business model changes

**Your Options:**
• Review changes before they take effect
• Contact us with questions or concerns
• Opt out of new data uses
• Close your account if you disagree

**Version History:**
• Previous versions available upon request
• Summary of changes provided
• Effective dates clearly marked

We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information. Continued use of our service after changes constitutes acceptance of the updated policy.`,
    },
  ];

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const PolicySection = ({ section }) => {
    const isExpanded = expandedSections[section.id];
    
    return (
      <FormBox style={styles.sectionCard}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection(section.id)}
          activeOpacity={0.7}
        >
          <View style={styles.sectionHeaderContent}>
            <View style={styles.sectionIcon}>
              <Icon name={section.icon} size={20} color={Colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
          <Icon 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color={Colors.neutral600} 
          />
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionText}>{section.content}</Text>
          </View>
        )}
      </FormBox>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        icon="back"
        name="Privacy Policy"
        onIconPress={() => navigation.navigate('PrivacySettings')}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <FormBox style={styles.headerCard}>
          <View style={styles.headerContent}>
            <Icon name="shield-checkmark-outline" size={48} color={Colors.success} />
            <Text style={styles.headerTitle}>Your Privacy Matters</Text>
            <Text style={styles.headerSubtitle}>
              We're committed to protecting your personal information and being transparent about our data practices.
            </Text>
            <View style={styles.lastUpdated}>
              <Icon name="calendar-outline" size={16} color={Colors.neutral500} />
              <Text style={styles.lastUpdatedText}>Last updated: {lastUpdated}</Text>
            </View>
          </View>
        </FormBox>

        {/* Quick Summary */}
        <FormBox style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Icon name="flash-outline" size={20} color={Colors.warning} />
            <Text style={styles.summaryTitle}>Privacy at a Glance</Text>
          </View>
          <View style={styles.summaryPoints}>
            <View style={styles.summaryPoint}>
              <Icon name="checkmark-circle" size={16} color={Colors.success} />
              <Text style={styles.summaryPointText}>We never sell your personal information</Text>
            </View>
            <View style={styles.summaryPoint}>
              <Icon name="checkmark-circle" size={16} color={Colors.success} />
              <Text style={styles.summaryPointText}>You control your data and privacy settings</Text>
            </View>
            <View style={styles.summaryPoint}>
              <Icon name="checkmark-circle" size={16} color={Colors.success} />
              <Text style={styles.summaryPointText}>Industry-standard security protections</Text>
            </View>
            <View style={styles.summaryPoint}>
              <Icon name="checkmark-circle" size={16} color={Colors.success} />
              <Text style={styles.summaryPointText}>Transparent about data collection and use</Text>
            </View>
          </View>
        </FormBox>

        {/* Privacy Sections */}
        <View style={styles.sectionsContainer}>
          {privacySections.map((section) => (
            <PolicySection key={section.id} section={section} />
          ))}
        </View>

        {/* Contact Information */}
        <FormBox style={styles.contactCard}>
          <View style={styles.contactHeader}>
            <Icon name="mail-outline" size={20} color={Colors.primary} />
            <Text style={styles.contactTitle}>Questions About Privacy?</Text>
          </View>
          <Text style={styles.contactText}>
            If you have any questions about this Privacy Policy or our data practices, please don't hesitate to contact us.
          </Text>
          <View style={styles.contactMethods}>
            <TouchableOpacity style={styles.contactMethod} activeOpacity={0.7}>
              <Icon name="mail" size={16} color={Colors.primary} />
              <Text style={styles.contactMethodText}>privacy@yourapp.com</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactMethod} activeOpacity={0.7}>
              <Icon name="chatbubble" size={16} color={Colors.primary} />
              <Text style={styles.contactMethodText}>In-app support chat</Text>
            </TouchableOpacity>
          </View>
        </FormBox>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  // Header Card
  headerCard: {
    marginTop: 20,
    marginBottom: 16,
  },
  headerContent: {
    alignItems: 'center',
    paddingVertical: 8,
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
    marginBottom: 16,
  },
  lastUpdated: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  lastUpdatedText: {
    fontSize: 14,
    color: Colors.neutral600,
    marginLeft: 6,
    fontWeight: '500',
  },

  // Summary Card
  summaryCard: {
    marginBottom: 24,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginLeft: 8,
  },
  summaryPoints: {
    gap: 12,
  },
  summaryPoint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryPointText: {
    fontSize: 15,
    color: Colors.neutral700,
    marginLeft: 10,
    flex: 1,
  },

  // Sections Container
  sectionsContainer: {
    gap: 12,
    marginBottom: 24,
  },

  // Section Card
  sectionCard: {
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007bff15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
    flex: 1,
  },
  sectionContent: {
    paddingTop: 16,
    paddingLeft: 48,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.neutral600,
  },

  // Contact Card
  contactCard: {
    marginBottom: 16,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginLeft: 8,
  },
  contactText: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.neutral600,
    marginBottom: 16,
  },
  contactMethods: {
    gap: 12,
  },
  contactMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor:  '#007bff10',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007bff20',
  },
  contactMethodText: {
    fontSize: 15,
    color: Colors.primary,
    marginLeft: 8,
    fontWeight: '500',
  },

  // Bottom Spacer
  bottomSpacer: {
    height: 24,
  },
});

export default PrivacyPolicyScreen;