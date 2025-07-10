import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';
import Colors from '../constants/colors';

interface FooterProps {
  activeTab?: 'home' | 'map' | 'transfer' | 'settings' | 'profile';
}

const Footer: React.FC<FooterProps> = ({ activeTab = 'home' }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: 'home',
      iconOutline: 'home-outline',
      screen: 'Dashboard' as keyof RootStackParamList,
    },
    {
      id: 'map',
      label: 'Map',
      icon: 'map',
      iconOutline: 'map-outline',
      screen: 'Map' as keyof RootStackParamList, // Add this screen to your navigation
    },
    {
      id: 'garage',
      label: 'Garage',
      icon: 'car',
      iconOutline: 'car-outline',
      screen: 'Cars' as keyof RootStackParamList, // Use your vehicle/garage screen
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'settings',
      iconOutline: 'settings-outline',
      screen: 'Settings' as keyof RootStackParamList, // Add this screen to your navigation
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: 'person',
      iconOutline: 'person-outline',
      screen: 'Profile' as keyof RootStackParamList, // Add this screen to your navigation
    },
  ];

  const handleTabPress = (screen: keyof RootStackParamList) => {
    navigation.navigate({ name: screen } as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          // Custom color logic for Home tab
          const isHome = tab.id === 'home';
          const activeColor = isHome && isActive ? '#0957de' : Colors.primary;
          const activeBg = isHome && isActive ? '#e6effb' : Colors.primary + '10';
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tab}
              onPress={() => handleTabPress(tab.screen)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, isActive && { backgroundColor: activeBg }]}> 
                <Icon
                  name={isActive ? tab.icon : tab.iconOutline}
                  size={22}
                  color={isActive ? activeColor : Colors.neutral500}
                />
              </View>
              <Text style={[styles.tabLabel, isActive && { color: activeColor, fontWeight: '600' }]}> 
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral0,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
    paddingTop: 4, // reduced
    paddingBottom: 22, // reduced for less height
    // Flatter look: minimal shadow
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 0, // less horizontal padding
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2, // less vertical padding
    paddingHorizontal: 4,
    minWidth: 44, // smaller min width
  },
  iconContainer: {
    width: 32, // smaller icon container
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2, // less space between icon and label
    backgroundColor: 'transparent',
  },
  activeIconContainer: {
    backgroundColor: Colors.primary + '10', // lighter highlight
  },
  tabLabel: {
    fontSize: 11, // smaller font
    color: Colors.neutral500,
    fontFamily: 'Coinbase_Sans-Medium', // use your custom font
    textAlign: 'center',
    fontWeight: '500',
  },
  activeTabLabel: {
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default Footer;