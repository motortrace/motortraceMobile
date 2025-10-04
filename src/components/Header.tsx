import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

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
  showNotification?: boolean;
  style?: ViewStyle;
}

const Header: React.FC<HeaderProps> = ({
  icon = 'back',
  showNotification = true,
  style,
}) => {
  const navigation = useNavigation<NavigationProp>();

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
    return (
      <TouchableOpacity
        style={styles.profilePlaceholder}
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.profileInitial}>U</Text>
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