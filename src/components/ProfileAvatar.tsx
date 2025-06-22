import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/colors';

interface ProfileAvatarProps {
  color?: string;
  isOnline?: boolean;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ isOnline = false, color }) => {
  const backgroundColor = color ?? Colors.primarybg;
  const textColor = color ? Colors.neutral0 : Colors.neutral1000;

  return (
    <View style={styles.avatarContainer}>
      <View style={[styles.avatar, { backgroundColor }]}>
        <Text style={[styles.avatarText, { color: textColor }]}>T</Text>
      </View>
      {isOnline && <View style={styles.onlineIndicator} />}
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.neutral0,
  },
});

export default ProfileAvatar;
