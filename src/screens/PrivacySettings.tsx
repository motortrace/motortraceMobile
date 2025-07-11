import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';
import FormBox from '../components/FormBox';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';
import SettingRow from '../components/SettingRow';

const PrivacySettingsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
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

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        icon="back"
        name="Privacy Settings"
        onIconPress={() => navigation.navigate('Profile')}
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
            onPress={() => navigation.navigate('DeleteAccount')}
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
            onPress={() => navigation.navigate('LoginActivity')}
          />

          <SettingRow
            title="Active Sessions"
            subtitle="Manage your active sessions"
            iconName="desktop-outline"
            showArrow={true}
            onPress={() => navigation.navigate('ActiveSession')}
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
  bottomSpacing: {
    height: 20,
  },
});

export default PrivacySettingsScreen;