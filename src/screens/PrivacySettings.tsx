import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';
import FormBox from '../components/FormBox';
import Header from '../components/Header';

const PrivacySettingsScreen = () => {
  const [settings, setSettings] = useState({
    profileVisibility: 'public', // public, friends, private
    allowSearch: true,
    allowContact: true,
    locationData: false,
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    twoFactorAuth: false,
    activityNotifications: true,
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleProfileVisibilityChange = () => {
    const options = [
      { text: 'Public', onPress: () => setSettings(prev => ({ ...prev, profileVisibility: 'public' })) },
      { text: 'Friends Only', onPress: () => setSettings(prev => ({ ...prev, profileVisibility: 'friends' })) },
      { text: 'Private', onPress: () => setSettings(prev => ({ ...prev, profileVisibility: 'private' })) },
      { text: 'Cancel', style: 'cancel' },
    ];

    Alert.alert('Profile Visibility', 'Choose who can see your profile', options);
  };

  const handleDataDownload = () => {
    Alert.alert(
      'Download Your Data',
      'We\'ll prepare your data and send a download link to your email within 24 hours.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Request Download', onPress: () => console.log('Data download requested') },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => console.log('Account deletion requested') },
      ]
    );
  };

  const SettingRow = ({ 
    title, 
    subtitle, 
    iconName, 
    hasSwitch = false, 
    switchValue = false, 
    onSwitchToggle, 
    onPress,
    showArrow = false,
    isLast = false 
  }) => (
    <View>
      <TouchableOpacity 
        style={styles.settingRow}
        onPress={onPress}
        disabled={hasSwitch}
        activeOpacity={hasSwitch ? 1 : 0.7}
      >
        <View style={styles.settingLeft}>
          <View style={styles.settingIconContainer}>
            <Icon name={iconName} size={18} color={Colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>{title}</Text>
            {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
          </View>
        </View>
        <View style={styles.settingRight}>
          {hasSwitch ? (
            <Switch
              value={switchValue}
              onValueChange={onSwitchToggle}
              trackColor={{ false: Colors.neutral300, true: `${Colors.primary}40` }}
              thumbColor={switchValue ? Colors.primary : Colors.neutral0}
            />
          ) : showArrow && (
            <Icon name="chevron-forward" size={20} color={Colors.neutral400} />
          )}
        </View>
      </TouchableOpacity>
      {!isLast && <View style={styles.divider} />}
    </View>
  );

  const getVisibilityText = () => {
    switch (settings.profileVisibility) {
      case 'public': return 'Public';
      case 'friends': return 'Friends Only';
      case 'private': return 'Private';
      default: return 'Public';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        icon="back"
        name="Privacy Settings"
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Data & Information */}
        <FormBox style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="shield-outline" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Data & Information</Text>
          </View>

          <SettingRow
            title="Location Data"
            subtitle="Share your location for better experience"
            iconName="location-outline"
            hasSwitch={true}
            switchValue={settings.locationData}
            onSwitchToggle={() => toggleSetting('locationData')}
          />

          <SettingRow
            title="Download Your Data"
            subtitle="Get a copy of your data"
            iconName="download-outline"
            showArrow={true}
            onPress={handleDataDownload}
          />

          <SettingRow
            title="Delete Account"
            subtitle="Permanently delete your account"
            iconName="trash-outline"
            showArrow={true}
            onPress={handleDeleteAccount}
            isLast={true}
          />
        </FormBox>

        {/* Communication Preferences */}
        <FormBox style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="notifications-outline" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Communication Preferences</Text>
          </View>

          <SettingRow
            title="Email Notifications"
            subtitle="Receive important updates via email"
            iconName="mail-outline"
            hasSwitch={true}
            switchValue={settings.emailNotifications}
            onSwitchToggle={() => toggleSetting('emailNotifications')}
          />

          <SettingRow
            title="Push Notifications"
            subtitle="Get notifications on your device"
            iconName="phone-portrait-outline"
            hasSwitch={true}
            switchValue={settings.pushNotifications}
            onSwitchToggle={() => toggleSetting('pushNotifications')}
          />

          <SettingRow
            title="Marketing Emails"
            subtitle="Receive promotional content"
            iconName="megaphone-outline"
            hasSwitch={true}
            switchValue={settings.marketingEmails}
            onSwitchToggle={() => toggleSetting('marketingEmails')}
          />

          <SettingRow
            title="Activity Notifications"
            subtitle="Get notified about your activity"
            iconName="pulse-outline"
            hasSwitch={true}
            switchValue={settings.activityNotifications}
            onSwitchToggle={() => toggleSetting('activityNotifications')}
            isLast={true}
          />
        </FormBox>

        {/* Security & Authentication */}
        <FormBox style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="lock-closed-outline" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Security & Authentication</Text>
          </View>

          <SettingRow
            title="Login Activity"
            subtitle="View your recent login history"
            iconName="time-outline"
            showArrow={true}
            onPress={() => Alert.alert('Login Activity', 'Feature coming soon')}
          />

          <SettingRow
            title="Active Sessions"
            subtitle="Manage your active sessions"
            iconName="desktop-outline"
            showArrow={true}
            onPress={() => Alert.alert('Active Sessions', 'Feature coming soon')}
            isLast={true}
          />
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
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: Colors.neutral1000,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: Colors.neutral500,
  },
  settingRight: {
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutral200,
    marginLeft: 56,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default PrivacySettingsScreen;