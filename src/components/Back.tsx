import type React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
  View,
  Platform,
} from 'react-native';
import Colors from '../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';

interface CircularBackButtonProps {
  onPress?: () => void;
  size?: number;
  backgroundColor?: string;
  iconColor?: string;
  style?: ViewStyle;
}

const CircularBackButton: React.FC<CircularBackButtonProps> = ({
  onPress,
  size = 44,
  backgroundColor = Colors.primaryDark,
  iconColor = Colors.neutral0,
  style,
}) => {
  return (
    <View
      style={[
        styles.shadowWrapper,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={[
          styles.backButton,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor,
          },
        ]}
      >
        <Icon
          name="chevron-back"
          size={size * 0.55}
          color={iconColor}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowWrapper: {
    position: 'absolute',
    top: 50,
    left: 15,
    ...Platform.select({
      ios: {
        shadowColor: Colors.neutral1000,
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 6,
      },
    }),
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 1,
  },
});

export default CircularBackButton;
