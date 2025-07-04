import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';

const LoginActivitiesPage = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const activities = [
    {
      id: 1,
      device: 'iPhone 15 Pro',
      location: 'New York, NY',
      time: '2 hours ago',
      status: 'current',
      ip: '192.168.1.1'
    },
    {
      id: 2,
      device: 'MacBook Pro',
      location: 'New York, NY',
      time: '1 day ago',
      status: 'success',
      ip: '192.168.1.2'
    },
    {
      id: 3,
      device: 'Chrome Browser',
      location: 'Los Angeles, CA',
      time: '3 days ago',
      status: 'success',
      ip: '203.0.113.1'
    },
    {
      id: 4,
      device: 'Android Phone',
      location: 'Miami, FL',
      time: '1 week ago',
      status: 'success',
      ip: '198.51.100.1'
    },
    {
      id: 5,
      device: 'iPad',
      location: 'Chicago, IL',
      time: '2 weeks ago',
      status: 'failed',
      ip: '203.0.113.2'
    },
    {
      id: 6,
      device: 'Safari Browser',
      location: 'Seattle, WA',
      time: '3 weeks ago',
      status: 'success',
      ip: '198.51.100.2'
    }
  ];

  const getDeviceIcon = (device) => {
    if (device.includes('iPhone') || device.includes('Android')) return 'phone-portrait-outline';
    if (device.includes('iPad')) return 'tablet-portrait-outline';
    if (device.includes('Mac') || device.includes('Chrome') || device.includes('Safari')) return 'desktop-outline';
    return 'device-desktop-outline';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'current': return Colors.primary;
      case 'success': return Colors.success;
      case 'failed': return Colors.danger;
      default: return Colors.neutral400;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'current': return 'Current Session';
      case 'success': return 'Successful Login';
      case 'failed': return 'Failed Attempt';
      default: return 'Unknown';
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        icon="back"
        name="Privacy Policy"
        onIconPress={() => navigation.navigate('PrivacyPolicy')}
      />

      {/* Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            Review your recent login activities and manage your account security
          </Text>
        </View>

        {/* Activities List */}
        <View style={styles.activitiesList}>
          {activities.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Icon 
                  name={getDeviceIcon(activity.device)} 
                  size={20} 
                  color={Colors.neutral600} 
                />
              </View>
              
              <View style={styles.activityContent}>
                <View style={styles.activityHeader}>
                  <Text style={styles.deviceName}>{activity.device}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(activity.status) + '15' }]}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(activity.status) }]} />
                    <Text style={[styles.statusText, { color: getStatusColor(activity.status) }]}>
                      {getStatusText(activity.status)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.activityDetails}>
                  <View style={styles.detailRow}>
                    <Icon name="location-outline" size={14} color={Colors.neutral500} />
                    <Text style={styles.detailText}>{activity.location}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="time-outline" size={14} color={Colors.neutral500} />
                    <Text style={styles.detailText}>{activity.time}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="globe-outline" size={14} color={Colors.neutral500} />
                    <Text style={styles.detailText}>{activity.ip}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Security Tip */}
        <View style={styles.securityTip}>
          <Icon name="shield-checkmark-outline" size={20} color={Colors.info} />
          <Text style={styles.securityTipText}>
            If you notice any suspicious activity, please change your password immediately
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral0,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Info Section
  infoSection: {
    paddingVertical: 20,
  },
  infoText: {
    fontSize: 14,
    color: Colors.neutral600,
    lineHeight: 20,
    textAlign: 'center',
  },

  // Activities List
  activitiesList: {
    marginBottom: 20,
  },
  activityItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: Colors.neutral50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral100,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral900,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  activityDetails: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 13,
    color: Colors.neutral600,
    marginLeft: 6,
  },

  // Security Tip
  securityTip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.info + '08',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  securityTipText: {
    fontSize: 14,
    color: Colors.neutral700,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});

export default LoginActivitiesPage;