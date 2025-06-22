import type React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
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
        style,
      ]}
    >
      <Icon
        name="chevron-back"
        size={size * 0.55}
        color={iconColor}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.neutral1000,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 4, height: 4 },
    elevation: 10,
    position: 'absolute',
    top: 50,
    left: 15,
  },
  icon: {
    marginLeft: 1,
  },
});

export default CircularBackButton;
