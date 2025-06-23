import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../constants/colors'
import Icon from "react-native-vector-icons/Ionicons"

const BottomNavigation = ({ navItems, activeTab, onTabPress }) => {
  return (
    <View style={styles.bottomNavContainer}>
      <View style={styles.bottomNav}>
        {navItems.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={styles.navItem}
            onPress={() => onTabPress(index, item.onPress)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.navIconContainer,
                activeTab === index && styles.navIconContainerActive,
              ]}
            >
              <Icon
                name={item.icon}
                size={30}
                color={activeTab === index ? Colors.neutral0 : Colors.neutral600}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavContainer: {
    backgroundColor: Colors.neutral0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: Colors.shadowLg,
    shadowOffset: { width: 4, height: -20 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
    borderColor: Colors.neutral300,
    borderWidth: 5,
  },
  bottomNav: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  navIconContainerActive: {
    backgroundColor: Colors.primary,
    transform: [{ scale: 1.1 }],
    borderRadius: 10,
  },
  navLabel: {
    fontSize: 14,
    color: Colors.neutral600,
    fontWeight: '500',
    textAlign: 'center',
  },
  navLabelActive: {
    backgroundColor: Colors.primary,
    fontWeight: '600',
  },
});

export default BottomNavigation;