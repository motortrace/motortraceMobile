import type React from 'react';
import { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Text,
  FlatList
} from 'react-native';
import Colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import BottomNavigation from '../../components/BottomNav';
import HistoryCard, { VisitHistory } from '../../components/GarageHistoryCard';
import Header from '../../components/Header'
import SearchBar from '../../components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';

interface HistoryScreenProps {
  onBack?: () => void;
  onViewNearby?: () => void;
  handleTabPress?: () => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({
  onBack,
  onViewNearby,
  handleTabPress,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(2);
  const [selectedFilter, setSelectedFilter] = useState('All');

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

  const filters = ['All', 'This Week', 'This Month', 'This Year'];

  const visitHistory: VisitHistory[] = [
    {
      id: 1,
      garageName: 'Quick Fix Auto',
      garageAddress: 'Main Street, Colombo 03',
      visitDate: '2024-06-20',
      visitTime: '10:30 AM',
      distance: '1.2km',
      services: ['Oil Change', 'Brake Inspection'],
      totalCost: 'LKR 4,500',
      rating: 5,
      status: 'completed',
      image: require('../../assets/images/Garage.jpg'),
      duration: '45 min',
      paymentMethod: 'Card'
    },
    {
      id: 2,
      garageName: 'Metro Motors',
      garageAddress: 'Galle Road, Colombo 04',
      visitDate: '2024-06-15',
      visitTime: '2:15 PM',
      distance: '2.8km',
      services: ['Engine Diagnostic', 'Tire Rotation'],
      totalCost: 'LKR 7,200',
      rating: 4,
      status: 'completed',
      image: require('../../assets/images/Garage.jpg'),
      duration: '1h 20min',
      paymentMethod: 'Cash'
    },
    {
      id: 3,
      garageName: 'City Auto Care',
      garageAddress: 'Baseline Road, Colombo 09',
      visitDate: '2024-06-10',
      visitTime: '9:00 AM',
      distance: '3.5km',
      services: ['Full Service', 'Car Wash'],
      totalCost: 'LKR 12,800',
      rating: 5,
      status: 'completed',
      image: require('../../assets/images/Garage.jpg'),
      duration: '2h 15min',
      paymentMethod: 'Card'
    },
    {
      id: 4,
      garageName: 'Express Service',
      garageAddress: 'High Level Road, Nugegoda',
      visitDate: '2024-06-08',
      visitTime: '11:45 AM',
      distance: '4.1km',
      services: ['Brake Service'],
      totalCost: 'LKR 3,600',
      rating: 3,
      status: 'cancelled',
      image: require('../../assets/images/Garage.jpg'),
      duration: '30 min',
      paymentMethod: 'N/A'
    },
    {
      id: 5,
      garageName: 'Pro Garage Solutions',
      garageAddress: 'Kandy Road, Maharagama',
      visitDate: '2024-05-28',
      visitTime: '3:30 PM',
      distance: '6.2km',
      services: ['Tire Replacement', 'Wheel Alignment'],
      totalCost: 'LKR 18,500',
      rating: 5,
      status: 'completed',
      image: require('../../assets/images/Garage.jpg'),
      duration: '1h 45min',
      paymentMethod: 'Card'
    },
    {
      id: 6,
      garageName: 'Elite Auto Workshop',
      garageAddress: 'Kotte Road, Sri Jayawardenepura',
      visitDate: '2024-05-22',
      visitTime: '8:15 AM',
      distance: '7.5km',
      services: ['Engine Repair', 'Oil Change'],
      totalCost: 'LKR 15,400',
      rating: 4,
      status: 'completed',
      image: require('../../assets/images/Garage.jpg'),
      duration: '3h 10min',
      paymentMethod: 'Bank Transfer'
    }
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

  const handleCardPress = (item: VisitHistory) => {
    console.log('Pressed history card:', item.garageName);
    // Navigate to detail view or perform action
  };

  const handleRatePress = (item: VisitHistory) => {
    console.log('Rate again pressed for:', item.garageName);
    // Open rating modal or navigate to rating screen
  };

  const filteredHistory = visitHistory.filter(visit => {
    if (searchQuery && !visit.garageName.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !visit.services.some(service => service.toLowerCase().includes(searchQuery.toLowerCase()))) {
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
                <Icon name="search" size={22} color={Colors.primary} />
              </View>
              <TextInput
                style={styles.searchInput}
                placeholder="Search history..."
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
        <Text style={styles.filterSectionTitle}>Filter by Period</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterChipsContainer}>
            {filters.map((filter) => (
              <FilterChip
                key={filter}
                title={filter}
                isSelected={selectedFilter === filter}
                onPress={() => setSelectedFilter(filter)}
              />
            ))}
          </View>
        </ScrollView>
      </View>

      {/* History List */}
      <FlatList
        data={filteredHistory}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <HistoryCard
              item={item}
              onPress={handleCardPress}
              onRatePress={handleRatePress}
              showRateAgain={true}
              compact={false}
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
    backgroundColor: Colors.primarybg,
  },
  filtersContainer: {
    backgroundColor: Colors.neutral0,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
    marginTop: 10,
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
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral0,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral900,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.neutral600,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.neutral200,
    marginHorizontal: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  cardContainer: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    marginTop: 5
  },
});

export default HistoryScreen;