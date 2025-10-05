import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ViewStyle,
  Image,
} from 'react-native';
// API base URL - change this to your computer's IP if using real device
// For Android emulator: 10.0.2.2
// For iOS simulator: localhost
// For real device: your computer's IP (e.g., 192.168.1.100)
const API_BASE_URL = 'http://10.0.2.2:3000'; // Change this if needed
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define navigation type - adjust RootStackParamList according to your navigation structure
type RootStackParamList = {
  Notifications: undefined;
  Profile: undefined;
  // Add other screen names as needed
};

type NavigationProp = StackNavigationProp<RootStackParamList>;


// Define component props interface
interface HeaderProps {
  icon?: 'back' | 'none';
  name?: string;
  image?: string;
  showNotification?: boolean;
  style?: ViewStyle;
}

const Header: React.FC<HeaderProps> = ({
  icon = 'back',
  name: propName = '',
  image: propImage = '',
  showNotification = true,
  style,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const [headerData, setHeaderData] = useState<{
    fullname: string;
    profile_image: string | null;
  } | null>(null);

  const fetchHeaderData = async () => {
    try {
      console.log('🔍 Header: Fetching header data...');
      const token = await AsyncStorage.getItem('token');
      console.log('🔍 Header: Token exists:', !!token);
      if (!token) {
        console.log('🔍 Header: No token found');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/header`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Client-Type': 'mobile',
        },
      });

      console.log('🔍 Header: Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('🔍 Header: Response data:', data);
        if (data.success && data.user) {
          console.log('🔍 Header: Setting header data:', data.user.fullname, data.user.profile_image);
          setHeaderData({
            fullname: data.user.fullname || 'User',
            profile_image: data.user.profile_image || null,
          });
        } else {
          console.log('🔍 Header: Data not in expected format');
        }
      } else {
        const errorText = await response.text();
        console.log('🔍 Header: Response error:', errorText);
      }
    } catch (error) {
      console.error('🔍 Header: Failed to fetch header data:', error);
    }
  };

  useEffect(() => {
    fetchHeaderData();
  }, []);

  const renderLeftIcon = (): React.ReactElement | null => {
    if (icon !== 'back') return null;

    return (
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
        <Icon name="chevron-back" size={24} color={Colors.neutral1000} />
      </TouchableOpacity>
    );
  };

  const renderNotificationIcon = (): React.ReactElement | null => {
    if (!showNotification) return null;

    return (
      <TouchableOpacity 
        style={styles.iconButton}
        onPress={() => navigation.navigate('Notifications')}
      >
        <Icon name="notifications-outline" size={24} color={Colors.neutral500} />
      </TouchableOpacity>
    );
  };

  const renderProfile = (): React.ReactElement => {
    const displayName = headerData?.fullname || propName || 'User';
    const profileImage = headerData?.profile_image || propImage;

    if (profileImage) {
      return (
        <TouchableOpacity
          style={styles.profileImageContainer}
          onPress={() => navigation.navigate('Profile')}
        >
          <Image
            source={{ uri: profileImage }}
            style={styles.profileImage}
            onError={() => {
              // Fallback to initial if image fails
              setHeaderData(prev => prev ? { ...prev, profile_image: null } : null);
            }}
          />
        </TouchableOpacity>
      );
    }

    const initial = displayName ? displayName.charAt(0).toUpperCase() : 'U';
    return (
      <TouchableOpacity
        style={styles.profilePlaceholder}
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.profileInitial}>{initial}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.header, style]}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          {renderLeftIcon()}
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitleMotor}>Motor</Text>
            <Text style={styles.headerTitleTrace}>Trace</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          {renderNotificationIcon()}
          {renderProfile()}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : 30,
    paddingBottom: 10,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
    backgroundColor: Colors.neutral50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.neutral1000,
    marginLeft: 12,
  },
  iconButton: {
    padding: 4,
  },
  profileImageContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 16,
    overflow: 'hidden',
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  profilePlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  profileInitial: {
    color: Colors.neutral50,
    fontSize: 16,
    fontWeight: '600',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleMotor: {
    color: Colors.neutral1000,
    fontSize: 20,
    fontWeight: '800',
  },
  headerTitleTrace: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: '800',
  },

});

export default Header;