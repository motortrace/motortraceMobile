import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // or the correct icon package you're using
import Colors from '../constants/colors';

interface ProfileFieldProps {
  label: string;
  value: string;
  iconName: string;
  isLast?: boolean;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ label, value, iconName, isLast = false }) => {
  return (
    <View style={[styles.fieldContainer, isLast && styles.lastField]}>
      <View style={styles.fieldContent}>
        <View style={styles.fieldHeader}>
          <View style={styles.iconContainer}>
            <Icon name={iconName} size={18} color={Colors.primary} />
          </View>
          <Text style={styles.fieldLabel}>{label}</Text>
        </View>
        <Text style={styles.fieldValue}>{value}</Text>
      </View>
      {!isLast && <View style={styles.fieldDivider} />}
    </View>
  );
};

const styles = StyleSheet.create<{
  fieldContainer: ViewStyle;
  lastField: ViewStyle;
  fieldContent: ViewStyle;
  fieldHeader: ViewStyle;
  iconContainer: ViewStyle;
  fieldLabel: TextStyle;
  fieldValue: TextStyle;
  fieldDivider: ViewStyle;
}>({
fieldContainer: {
    paddingVertical: 12,
  },
  lastField: {
    paddingBottom: 0,
  },
  fieldContent: {
    flex: 1,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${Colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral600,
  },
  fieldValue: {
    fontSize: 16,
    color: Colors.neutral1000,
    fontWeight: '400',
    marginLeft: 44,
  },
  fieldDivider: {
    height: 1,
    backgroundColor: Colors.neutral200,
    marginTop: 12,
  },
});

export default ProfileField;
