import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  ViewStyle,
} from 'react-native';
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

// Define the user data structure from API
interface UserHeaderData {
  fullname: string;
  profile_image: string | null;
}

// Define API response structure
interface ApiResponse {
  success: boolean;
  user: UserHeaderData;
  message?: string;
}

// Define component props interface
interface HeaderProps {
  icon?: 'back' | 'none';
  showNotification?: boolean;
  style?: ViewStyle;
}

const Header: React.FC<HeaderProps> = ({
  icon = 'back',
  showNotification = true,
  style,
}) => {
  const [fullname, setFullname] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
      try {
        setIsLoading(true);
        
        // Get token from AsyncStorage
        const token = await AsyncStorage.getItem('token');
        
        if (!token) {
          console.log('No token found for header request');
          setFullname('User');
          setIsLoading(false);
          return;
        }

        const response = await fetch('http://10.0.2.2:3000/auth/header', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        const data: ApiResponse = await response.json();
        
        if (response.ok && data.success) {
          const user = data.user;
          console.log('User header data:', user);
          setFullname(user.fullname || 'User');
          setImage(user.profile_image);
        } else {
          console.error('Failed to fetch user header:', data.message);
          setFullname('User');
        }
      } catch (error) {
        console.error('Error fetching user header data:', error);
        setFullname('User');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
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
    if (isLoading) {
      return (
        <View style={styles.profilePlaceholder}>
          <Text style={styles.profileInitial}>...</Text>
        </View>
      );
    }

    if (image) {
      const buildImageUrl = (imagePath?: string | null): string | undefined => {
        if (!imagePath) return undefined;
        if (imagePath.startsWith('data:')) return imagePath;
        if (imagePath.startsWith('http')) return imagePath;
        const base = 'http://10.0.2.2:3000';
        return `${base}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
      };
      const finalUri = buildImageUrl(image);
      return (
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image 
            source={{ uri: finalUri }} 
            style={styles.profileImage}
            onError={(e) => {
              console.warn('Header image failed to load:', finalUri, e?.nativeEvent?.error);
              // Fallback to placeholder if image fails to load
              setImage(null);
            }}
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.profilePlaceholder}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.profileInitial}>
            {fullname?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </TouchableOpacity>
      );
    }
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
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 16,
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