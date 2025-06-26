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

interface HeaderProps {
  icon?: 'back' | 'menu';
  style?: TextStyle;
  name: string;
  image?: string;
  onIconPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ icon = 'back', style, name, image, onIconPress }) => {
  const renderProfile = () => {
    if (image) {
      return <Image source={{ uri: image }} style={styles.profileImage} />;
    } else {
      return (
        <View style={styles.profilePlaceholder}>
          <Text style={styles.profileInitial}>{name.charAt(0).toUpperCase()}</Text>
        </View>
      );
    }
  };

  return (
    <View style={[styles.header, style]}>
      <View style={styles.headerContent}>
        <TouchableOpacity onPress={onIconPress} style={styles.backButton}>
          <Icon
            name={icon === 'back' ? 'chevron-back' : 'menu'}
            size={28}
            color={Colors.neutral0}
          />
        </TouchableOpacity>

        <View style={styles.spacer} />

        {renderProfile()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 45,
    paddingBottom: 10,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
    backgroundColor: Colors.primary,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
});

export default Header;
