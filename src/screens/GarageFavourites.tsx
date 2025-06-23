import type React from 'react';
import { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import Colors from '../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import BottomNavigation from '../components/BottomNav';
import GarageCard from '../components/GarageCard';

interface GarageLocatorScreenProps {
  onBack?: () => void;
  onViewRecommended?: () => void;
  handleTabPress?: () => void;
}

const GarageLocatorScreen: React.FC<GarageLocatorScreenProps> = ({
  onBack,
  onViewRecommended,
  handleTabPress,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(4);

  const navItems = [
    {
      id: 'location',
      icon: 'location',
      onPress: () => setActiveTab(0),
    },
    {
      id: 'recommended',
      icon: 'star',
      onPress: () => {
        setActiveTab(1);
        onViewRecommended?.();
      },
    },
    {
      id: 'history',
      icon: 'time',
      onPress: () => setActiveTab(2),
    },
    {
      id: 'nearby',
      icon: 'compass',
      label: 'Nearby',
      onPress: () => setActiveTab(3),
    },
    {
      id: 'heart',
      icon: 'heart',
      label: 'Favourite',
      onPress: () => setActiveTab(4),
    },
  ];

  const garages = [
    {
        id: 1,
        name: 'Apex Auto Works',
        address: 'B-800 Laevin City, United...',
        distance: '7km',
        rating: '4.0',
        status: 'Open',
        image: require('../assets/images/Garage.jpg'),
        isFavorite: true,
    },
    {
        id: 2,
        name: 'Precision Auto Ga...',
        address: '2464 Royal Ln Mesa, New...',
        distance: '7km',
        rating: '4.0',
        status: 'Closed',
        image: require('../assets/images/Garage.jpg'),
        isFavorite: true,
    },
    {
        id: 3,
        name: 'Titan Motors',
        address: 'B-800 Laevin City, United...',
        distance: '7km',
        rating: '4.0',
        status: 'Open',
        image: require('../assets/images/Garage.jpg'),
        isFavorite: true,
    },
    {
        id: 4,
        name: 'Turbo Tune-Up',
        address: 'B-800 Laevin City, United...',
        distance: '7km',
        rating: '4.0',
        status: 'Open',
        image: require('../assets/images/Garage.jpg'),
        isFavorite: true,
    },
    {
        id: 5,
        name: 'Precision Auto Ga...',
        address: '2464 Royal Ln Mesa, New...',
        distance: '7km',
        rating: '4.0',
        status: 'Open',
        image: require('../assets/images/Garage.jpg'),
        isFavorite: true,
    },
    {
        id: 6,
        name: 'Pit Stop Pros',
        address: '2464 Royal Ln Mesa, New...',
        distance: '7km',
        rating: '4.0',
        status: 'Open',
        image: require('../assets/images/Garage.jpg'),
        isFavorite: true,
    },
    ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Enhanced Header with Search */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Icon name="chevron-back" size={30} color={Colors.neutral0} />
          </TouchableOpacity>

          <View style={styles.searchBarContainer}>
            <View style={styles.searchBar}>
              <View style={styles.searchIconContainer}>
                <Icon name="location" size={22} color={Colors.primary} />
              </View>
              <TextInput
                style={styles.searchInput}
                placeholder="Search garages, services..."
                placeholderTextColor={Colors.neutral500}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        </View>
      </View>

      <ScrollView>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 20 }}>
        {garages.map(garage => (
        <GarageCard
          key={garage.id}
          item={garage}
          onPress={() => console.log('Pressed:', garage.name)}
          onFavoritePress={() => console.log('Favorited:', garage.id)}
        />
        ))}
      </View>
      </ScrollView>

      <BottomNavigation
        navItems={navItems}
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primarybg,
  },
  header: {
    paddingTop: 55,
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
    paddingHorizontal: 20,
    gap: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadowSm,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchBarContainer: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral50,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    shadowColor: Colors.shadowSm,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIconContainer: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.neutral900,
    fontWeight: '400',
  },
});

export default GarageLocatorScreen;
