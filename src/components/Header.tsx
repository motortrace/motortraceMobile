import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';

interface HeaderProps {
  icon?: 'back' | 'menu' | 'notification' | 'search' | '';
  style?: TextStyle;
  name: string;
  image?: string;
  title?: string;
  rightText?: string;
  onIconPress?: () => void;
  onRightTextPress?: () => void;
  showLogo?: boolean;
  modern?: boolean;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  icon = 'back', 
  style, 
  name, 
  image, 
  title,
  rightText,
  onIconPress,
  onRightTextPress,
  showLogo = true,
  modern = false,
  onSearchPress,
  onNotificationPress
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Modern header layout (like screenshot)
  if (modern) {
    return (
      <View style={[styles.modernHeader, style]}>
        <Text style={{ fontFamily: 'Coinbase_Sans-Medium', fontSize: 28 }}>{title}</Text>
        <View style={styles.modernRightRow}>
          <TouchableOpacity style={styles.modernIconButton} onPress={onSearchPress}>
            <Icon name="search" size={20} color={Colors.neutral900} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.modernIconButton} onPress={onNotificationPress}>
            <Icon name="notifications-outline" size={20} color={Colors.neutral900} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.modernProfileButton} onPress={() => navigation.navigate('Profile')}>
            {image ? (
              <Image source={{ uri: image }} style={styles.modernProfileImage} />
            ) : (
              <View style={styles.modernProfilePlaceholder}>
                <Icon name="person" size={20} color={Colors.neutral0} />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const renderProfile = () => {
    if (image) {
      return (
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image source={{ uri: image }} style={styles.profileImage} />
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity style={styles.profilePlaceholder} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.profileInitial}>{name.charAt(0).toUpperCase()}</Text>
        </TouchableOpacity>
      );
    }
  };

  const renderLogo = () => {
    if (showLogo) {
      return (
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/Logo_white_no_bg.png')}
            style={styles.logoImage}
          />
          <View style={styles.logoTextContainer}>
            <Text style={styles.logoLineTop}>Motor</Text>
            <Text style={styles.logoLineBottom}>Trace</Text>
          </View>
        </View>
      );
    }
    return null;
  };

  const renderTitle = () => {
    if (title) {
      return (
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
      );
    }
    return null;
  };

  const renderRightContent = () => {
    if (rightText) {
      return (
        <View style={styles.rightContent}>
          <TouchableOpacity onPress={onRightTextPress}>
            <Text style={styles.rightText}>{rightText}</Text>
          </TouchableOpacity>
          {renderProfile()}
        </View>
      );
    }
    
    if (icon === 'notification') {
      return (
        <TouchableOpacity onPress={onIconPress} style={styles.notificationButton}>
          <Icon
            name="notifications-outline"
            size={24}
            color={Colors.neutral600}
          />
        </TouchableOpacity>
      );
    }
    
    return renderProfile();
  };

  const renderLeftIcon = () => {
    if (icon !== "" && icon !== 'notification') {
      const iconName = icon === 'back' ? 'chevron-back' : 
                      icon === 'menu' ? 'menu' : 
                      icon === 'search' ? 'search' : 'chevron-back';
      
      return (
        <TouchableOpacity onPress={onIconPress} style={styles.leftIconButton}>
          <Icon
            name={iconName}
            size={24}
            color={Colors.neutral900}
          />
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View style={[styles.header, style]}>
      <View style={styles.headerContent}>
        {renderLeftIcon()}
        
        {title ? renderTitle() : renderLogo()}

        <View style={styles.spacer} />

        {renderRightContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 45,
    paddingBottom: 15,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 10,
    backgroundColor: Colors.neutral0,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    minHeight: 44,
  },
  leftIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 18,
    color: Colors.neutral900,
    fontFamily: 'Coinbase_Sans-Medium',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rightText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral600,
    fontFamily: 'Coinbase_Sans-Medium',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
  },
  spacer: {
    flex: 1,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 20,
  },
  profilePlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 30,
    backgroundColor: Colors.neutral300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: Colors.neutral900,
    fontSize: 20,
    fontWeight: '600',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 50,
    height: 50,
    marginRight: 2,
  },
  logoTextContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  logoLineTop: {
    color: Colors.neutral0,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 18,
    fontFamily: 'Coinbase_Sans-Medium',
  },
  logoLineBottom: {
    color: Colors.neutral0,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 18,
    fontFamily: 'Coinbase_Sans-Medium',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Modern header styles
  modernHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 28,
    paddingBottom: 16,
    paddingHorizontal: 18,
    backgroundColor: '#F2F4F5',
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral100,
    minHeight: 60,
  },
  modernTitle: {
    fontSize: 26,
    // fontWeight: '700',
    color: Colors.neutral1000 || '#111827',
    letterSpacing: -0.5,
    fontFamily: 'Coinbase_Sans-Medium',
    flex: 1,
  },
  modernRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modernIconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.neutral300,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  modernProfileButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#6F47CD', // Example avatar bg color
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
    overflow: 'hidden',
  },
  modernProfileImage: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  modernProfilePlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#0C57E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Header;