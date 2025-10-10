import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/colors';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ActiveSessionData {
  id: string;
  device: string;
  location: string;
  time: string;
  status: string;
  ip: string;
  userAgent?: string;
  lastActivity: string;
}

const ActiveSession = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [sessions, setSessions] = useState<ActiveSessionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActiveSessions = useCallback(async () => {
    try {
      setIsLoading(true);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No authentication token found. Please log in again.');
        navigation.navigate('LogIn');
        return;
      }

      const response = await fetch('http://10.0.2.2:3000/auth/active-sessions', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch active sessions');
      }

      setSessions(data.data.sessions || []);
    } catch (error) {
      console.error('Error fetching active sessions:', error);
      Alert.alert('Error', 'Failed to load active sessions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [navigation]);

  useEffect(() => {
    fetchActiveSessions();
  }, [fetchActiveSessions]);

  const handleTerminateSession = async (sessionId: string) => {
    Alert.alert(
      'Terminate Session',
      'Are you sure you want to terminate this session? You will be logged out from that device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Terminate',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              if (!token) return;

              const response = await fetch('http://10.0.2.2:3000/auth/logout-session', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessionId }),
              });

              const data = await response.json();

              if (response.ok) {
                Alert.alert('Success', 'Session terminated successfully');
                fetchActiveSessions(); // Refresh the list
              } else {
                throw new Error(data.message || 'Failed to terminate session');
              }
            } catch (error) {
              console.error('Error terminating session:', error);
              Alert.alert('Error', 'Failed to terminate session. Please try again.');
            }
          }
        }
      ]
    );
  };

  const getDeviceIcon = (device: string): string => {
    if (device.includes('iPhone') || device.includes('Android')) return 'phone-portrait-outline';
    if (device.includes('iPad')) return 'tablet-portrait-outline';
    if (device.includes('Mac') || device.includes('Chrome') || device.includes('Safari')) return 'desktop-outline';
    return 'device-desktop-outline';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'current': return Colors.primary;
      case 'success': return Colors.success;
      case 'failed': return Colors.danger;
      default: return Colors.neutral400;
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'current': return 'Current Session';
      case 'success': return 'Successful Login';
      case 'failed': return 'Failed Attempt';
      default: return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header
          icon="back"
          name="Active Sessions"
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading active sessions...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        icon="back"
        name="Active Sessions"
      />

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            Manage your active sessions and terminate suspicious activity
          </Text>
        </View>

        {/* Sessions List */}
        <View style={styles.activitiesList}>
          {sessions.map((session) => (
            <View key={session.id} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Icon
                  name={getDeviceIcon(session.device)}
                  size={20}
                  color={Colors.neutral600}
                />
              </View>

              <View style={styles.activityContent}>
                <View style={styles.activityHeader}>
                  <Text style={styles.deviceName}>{session.device}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(session.status) + '15' }]}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(session.status) }]} />
                    <Text style={[styles.statusText, { color: getStatusColor(session.status) }]}>
                      {getStatusText(session.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.activityDetails}>
                  <View style={styles.detailRow}>
                    <Icon name="location-outline" size={14} color={Colors.neutral500} />
                    <Text style={styles.detailText}>{session.location}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="time-outline" size={14} color={Colors.neutral500} />
                    <Text style={styles.detailText}>{session.time}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="globe-outline" size={14} color={Colors.neutral500} />
                    <Text style={styles.detailText}>{session.ip}</Text>
                  </View>
                </View>

                {session.status !== 'current' && (
                  <View style={styles.actionRow}>
                    <Text
                      style={styles.terminateText}
                      onPress={() => handleTerminateSession(session.id)}
                    >
                      Terminate Session
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Security Tip */}
        <View style={styles.securityTip}>
          <Icon name="shield-checkmark-outline" size={20} color={Colors.info} />
          <Text style={styles.securityTipText}>
            Terminating a session will log you out from that device. Use this feature if you suspect unauthorized access.
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

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.neutral500,
    textAlign: 'center',
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

  // Action Row
  actionRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  terminateText: {
    fontSize: 14,
    color: Colors.danger,
    fontWeight: '600',
    textAlign: 'right',
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

export default ActiveSession;