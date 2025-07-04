import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Adjust if using another icon set
import Colors from '../constants/colors';

interface SettingRowProps {
  title: string;
  subtitle?: string;
  iconName: string;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchToggle?: (value: boolean) => void;
  onPress?: (event: GestureResponderEvent) => void;
  showArrow?: boolean;
  isLast?: boolean;
}

const SettingRow: React.FC<SettingRowProps> = ({
  title,
  subtitle,
  iconName,
  hasSwitch = false,
  switchValue = false,
  onSwitchToggle,
  onPress,
  showArrow = false,
  isLast = false,
}) => {
  return (
    <View>
      <TouchableOpacity
        style={styles.settingRow}
        onPress={onPress}
        disabled={hasSwitch}
        activeOpacity={hasSwitch ? 1 : 0.7}
      >
        <View style={styles.settingLeft}>
          <View style={styles.settingIconContainer}>
            <Icon name={iconName} size={18} color={Colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>{title}</Text>
            {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
          </View>
        </View>

        <View style={styles.settingRight}>
          {hasSwitch ? (
            <Switch
              value={switchValue}
              onValueChange={onSwitchToggle}
              trackColor={{ false: Colors.neutral300, true: `${Colors.primary}40` }}
              thumbColor={switchValue ? Colors.primary : Colors.neutral0}
            />
          ) : showArrow && (
            <Icon name="chevron-forward" size={20} color={Colors.neutral400} />
          )}
        </View>
      </TouchableOpacity>

      {!isLast && <View style={styles.divider} />}
    </View>
  );
};

const styles = StyleSheet.create<{
  settingRow: ViewStyle;
  settingLeft: ViewStyle;
  settingIconContainer: ViewStyle;
  settingContent: ViewStyle;
  settingTitle: TextStyle;
  settingSubtitle: TextStyle;
  settingRight: ViewStyle;
  divider: ViewStyle;
}>({
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: Colors.neutral1000,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: Colors.neutral500,
  },
  settingRight: {
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutral200,
    marginLeft: 56,
  },
});

export default SettingRow;
