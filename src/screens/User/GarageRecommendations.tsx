import type React from 'react';
import { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Colors from '../../constants/colors';
import BottomNavigation from '../../components/BottomNav';
import GarageCard from '../../components/GarageCard';
import Header from '../../components/Header'
import SearchBar from '../../components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';

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
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(1);

    const navItems = [
    {
      id: "location",
      icon: "location",
      onPress: () => navigation.navigate('Locations'),
    },
    {
      id: "recommended",
      icon: "star",
      onPress: () => navigation.navigate('GarageRecommendations'),
    },
    {
      id: "history",
      icon: "time",
      onPress: () => navigation.navigate('GarageHistory'),
    },
    {
      id: "nearby",
      icon: "compass",
      label: "Nearby",
      onPress: () => navigation.navigate('GarageExplore'),
    },
    {
      id: "heart",
      icon: "heart",
      label: "Favourite",
      onPress: () => navigation.navigate('GarageFavourites'),
    },
  ]

  const garages = [
    {
        id: 1,
        name: 'Apex Auto Works',
        address: 'B-800 Laevin City, United...',
        distance: '7km',
        rating: '4.0',
        status: 'Open',
        image: require('../../assets/images/Garage.jpg'),
    },
    {
        id: 2,
        name: 'Precision Auto Ga...',
        address: '2464 Royal Ln Mesa, New...',
        distance: '7km',
        rating: '4.0',
        status: 'Closed',
        image: require('../../assets/images/Garage.jpg'),
    },
    {
        id: 3,
        name: 'Titan Motors',
        address: 'B-800 Laevin City, United...',
        distance: '7km',
        rating: '4.0',
        status: 'Open',
        image: require('../../assets/images/Garage.jpg'),
    },
    {
        id: 4,
        name: 'Turbo Tune-Up',
        address: 'B-800 Laevin City, United...',
        distance: '7km',
        rating: '4.0',
        status: 'Open',
        image: require('../../assets/images/Garage.jpg'),
    },
    {
        id: 5,
        name: 'Precision Auto Ga...',
        address: '2464 Royal Ln Mesa, New...',
        distance: '7km',
        rating: '4.0',
        status: 'Open',
        image: require('../../assets/images/Garage.jpg'),
    },
    {
        id: 6,
        name: 'Pit Stop Pros',
        address: '2464 Royal Ln Mesa, New...',
        distance: '7km',
        rating: '4.0',
        status: 'Open',
        image: require('../../assets/images/Garage.jpg'),
    },
    ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Enhanced Header with Search */}
      {/* <View style={styles.header}>
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
      </View> */}

      <Header
        icon="back"
        name="John Doe"
        image=""
        onIconPress={() => navigation.navigate('Home')}
      />
      <SearchBar
        containerStyle={{
          marginTop: 10,
          marginBottom: -10,
        }}
        placeholder="Search products..."
      />

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
});

export default GarageLocatorScreen;
