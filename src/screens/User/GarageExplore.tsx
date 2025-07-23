import type React from 'react';
import { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Text,
  FlatList
} from 'react-native';
import Colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import BottomNavigation from '../../components/BottomNav';
import GarageCard from '../../components/GarageCard';
import Header from '../../components/Header'
import SearchBar from '../../components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';

interface NearbyGaragesScreenProps {
  onBack?: () => void;
  onViewRecommended?: () => void;
  handleTabPress?: () => void;
}

const NearbyGaragesScreen: React.FC<NearbyGaragesScreenProps> = ({
  onBack,
  onViewRecommended,
  handleTabPress,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(3);
  const [selectedDistance, setSelectedDistance] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedService, setSelectedService] = useState('All');

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

  const distanceFilters = ['All', '< 2km', '< 5km', '< 10km', '< 20km'];
  const statusFilters = ['All', 'Open', 'Closed', 'Busy'];
  const serviceFilters = ['All', 'Oil Change', 'Brake Service', 'Engine Repair', 'Tire Service', 'Car Wash'];

  const garages = [
    {
      id: 1,
      name: 'Quick Fix Auto',
      address: 'Main Street, Colombo 03',
      distance: '1.2km',
      rating: '4.5',
      status: 'Open',
      image: require('../../assets/images/Garage.jpg'),
      services: ['Oil Change', 'Brake Service'],
    },
    {
      id: 2,
      name: 'Metro Motors',
      address: 'Galle Road, Colombo 04',
      distance: '2.8km',
      rating: '4.2',
      status: 'Busy',
      image: require('../../assets/images/Garage.jpg'),
      services: ['Engine Repair', 'Tire Service'],
    },
    {
      id: 3,
      name: 'City Auto Care',
      address: 'Baseline Road, Colombo 09',
      distance: '3.5km',
      rating: '4.7',
      status: 'Open',
      image: require('../../assets/images/Garage.jpg'),
      services: ['Car Wash', 'Oil Change'],
    },
    {
      id: 4,
      name: 'Express Service',
      address: 'High Level Road, Nugegoda',
      distance: '4.1km',
      rating: '4.1',
      status: 'Closed',
      image: require('../../assets/images/Garage.jpg'),
      services: ['Brake Service', 'Engine Repair'],
    },
    {
      id: 5,
      name: 'Pro Garage Solutions',
      address: 'Kandy Road, Maharagama',
      distance: '6.2km',
      rating: '4.8',
      status: 'Open',
      image: require('../../assets/images/Garage.jpg'),
      services: ['Tire Service', 'Oil Change'],
    },
    {
      id: 6,
      name: 'Elite Auto Workshop',
      address: 'Kotte Road, Sri Jayawardenepura',
      distance: '7.5km',
      rating: '4.3',
      status: 'Open',
      image: require('../../assets/images/Garage.jpg'),
      services: ['Engine Repair', 'Car Wash'],
    },
  ];

  const FilterChip = ({ title, isSelected, onPress }) => (
    <TouchableOpacity
      style={[styles.filterChip, isSelected && styles.filterChipSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.filterChipText, isSelected && styles.filterChipTextSelected]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderFilterSection = (title: string, items: string[], selectedItem: string, onSelect: (item: string) => void) => (
    <View style={styles.filterSection}>
      <Text style={styles.filterSectionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.filterChipsContainer}>
          {items.map((item) => (
            <FilterChip
              key={item}
              title={item}
              isSelected={selectedItem === item}
              onPress={() => onSelect(item)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const filteredGarages = garages.filter(garage => {
    // Filter by search query
    if (searchQuery && !garage.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !garage.address.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by distance
    if (selectedDistance !== 'All') {
      const garageDistance = parseFloat(garage.distance);
      const filterDistance = parseFloat(selectedDistance.replace('< ', '').replace('km', ''));
      if (garageDistance >= filterDistance) return false;
    }
    
    // Filter by status
    if (selectedStatus !== 'All' && garage.status !== selectedStatus) {
      return false;
    }
    
    // Filter by service
    if (selectedService !== 'All' && !garage.services.includes(selectedService)) {
      return false;
    }
    
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
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

      {/* Filters */}
      <View style={styles.filtersContainer}>
        {renderFilterSection('Distance', distanceFilters, selectedDistance, setSelectedDistance)}
        {renderFilterSection('Status', statusFilters, selectedStatus, setSelectedStatus)}
      </View>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredGarages.length} garages found nearby
        </Text>
        <TouchableOpacity style={styles.sortButton}>
          <Icon name="funnel" size={16} color={Colors.primary} />
          <Text style={styles.sortText}>Sort</Text>
        </TouchableOpacity>
      </View>

      {/* Garage List */}
      <FlatList
        data={filteredGarages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <GarageCard
              item={item}
              onPress={() => console.log('Pressed:', item.name)}
              onFavoritePress={() => console.log('Favorited:', item.id)}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

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
    backgroundColor: Colors.neutral50,
  },
  filtersContainer: {
    backgroundColor: Colors.neutral0,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  filterSection: {
    marginBottom: 12,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral700,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  filterChipsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.neutral100,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  filterChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.neutral600,
  },
  filterChipTextSelected: {
    color: Colors.neutral0,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.neutral0,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral600,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  listContainer: {
    paddingBottom: 20,
  },
  cardContainer: {
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
});

export default NearbyGaragesScreen;