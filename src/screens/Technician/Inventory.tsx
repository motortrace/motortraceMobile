import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  FlatList,
  TextInput,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
import BottomNavigation from '../../components/BottomNav';
import Colors from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';
import SearchBar from '../../components/SearchBar';

// Quick Search Component
const QuickSearchBar = ({ searchQuery, onSearchChange, onBarcodePress }) => (
  <View style={styles.searchContainer}>
    <View style={styles.searchBar}>
      <Icon name="search" size={20} color={Colors.neutral600} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search parts by name, code, or vehicle..."
        value={searchQuery}
        onChangeText={onSearchChange}
        placeholderTextColor={Colors.neutral600}
      />
      <TouchableOpacity style={styles.barcodeButton} onPress={onBarcodePress}>
        <Icon name="barcode" size={20} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  </View>
);

// Inventory Item Card Component
const InventoryItemCard = ({ item, onRequestPart, onViewDetails }) => {
  const getAvailabilityStatus = () => {
    if (item.stockCount > 10) return { status: 'in_stock', color: '#10B981', text: 'In Stock' };
    if (item.stockCount > 0) return { status: 'low_stock', color: '#F59E0B', text: 'Low Stock' };
    return { status: 'out_of_stock', color: '#EF4444', text: 'Out of Stock' };
  };

  const availability = getAvailabilityStatus();

  return (
    <View style={styles.inventoryCard}>
      <View style={styles.cardHeader}>
        <View style={styles.partInfo}>
          <Text style={styles.partCode}>{item.partCode}</Text>
          <Text style={styles.partName}>{item.name}</Text>
          <Text style={styles.partBrand}>{item.brand}</Text>
        </View>
        
        <View style={styles.statusContainer}>
          <View style={[styles.statusIndicator, { backgroundColor: availability.color }]} />
          <Text style={[styles.statusText, { color: availability.color }]}>
            {availability.text}
          </Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.stockInfo}>
          <Text style={styles.stockLabel}>Stock Count:</Text>
          <Text style={styles.stockCount}>{item.stockCount}</Text>
        </View>
        
        <View style={styles.locationInfo}>
          <Icon name="location-outline" size={16} color={Colors.neutral600} />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
      </View>
      
      <View style={styles.priceSection}>
        <Text style={styles.priceLabel}>Unit Price:</Text>
        <Text style={styles.price}>${item.price}</Text>
      </View>
      
      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={styles.detailsButton}
          onPress={() => {}}
        >
          <Icon name="information-circle-outline" size={16} color={Colors.neutral600} />
          <Text style={styles.detailsButtonText}>Details</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.requestButton,
            item.stockCount === 0 && styles.requestButtonDisabled
          ]}
          onPress={() => {}}
          disabled={item.stockCount === 0}
        >
          <Icon 
            name={item.stockCount === 0 ? "ban-outline" : "add-circle-outline"} 
            size={16} 
            color={item.stockCount === 0 ? Colors.neutral400 : Colors.neutral0} 
          />
          <Text style={[
            styles.requestButtonText,
            item.stockCount === 0 && styles.requestButtonTextDisabled
          ]}>
            {item.stockCount === 0 ? 'Unavailable' : 'Request Part'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Quick Filter Component
const QuickFilters = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'All Parts', icon: 'cube-outline' },
    { id: 'in_stock', label: 'In Stock', icon: 'checkmark-circle-outline' },
    { id: 'low_stock', label: 'Low Stock', icon: 'warning-outline' },
    { id: 'out_of_stock', label: 'Out of Stock', icon: 'close-circle-outline' }
  ];

  return (
    <View style={styles.filtersContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              activeFilter === filter.id && styles.filterButtonActive
            ]}
            onPress={() => onFilterChange(filter.id)}
          >
            <Icon 
              name={filter.icon} 
              size={18} 
              color={activeFilter === filter.id ? Colors.neutral0 : Colors.neutral600} 
            />
            <Text style={[
              styles.filterButtonText,
              activeFilter === filter.id && styles.filterButtonTextActive
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Main Technician Inventory Screen Component
const TechnicianInventoryScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeTab, setActiveTab] = useState(3);

  // Mock inventory data
  const inventoryItems = [
    {
      id: 1,
      partCode: 'BP-001',
      name: 'Premium Brake Pads (Front)',
      brand: 'AutoPro',
      price: 89.99,
      stockCount: 15,
      location: 'A-12-3',
      category: 'brakes',
      compatibility: ['Toyota Camry 2018-2022', 'Honda Accord 2019-2021']
    },
    {
      id: 2,
      partCode: 'LED-H7',
      name: 'LED Headlight Bulb H7',
      brand: 'BrightBeam',
      price: 45.99,
      stockCount: 3,
      location: 'B-05-1',
      category: 'electrical',
      compatibility: ['Universal H7 Socket']
    },
    {
      id: 3,
      partCode: 'AF-200',
      name: 'High-Flow Air Filter',
      brand: 'FlowMax',
      price: 24.99,
      stockCount: 0,
      location: 'C-08-2',
      category: 'engine',
      compatibility: ['Toyota Camry 2015-2020', 'Honda Civic 2016-2021']
    },
    {
      id: 4,
      partCode: 'SP-KIT',
      name: 'Sport Suspension Kit',
      brand: 'SportTech',
      price: 299.99,
      stockCount: 8,
      location: 'D-15-1',
      category: 'suspension',
      compatibility: ['BMW X3 2018-2022']
    },
    {
      id: 5,
      partCode: 'OIL-5W30',
      name: 'Synthetic Motor Oil 5W-30',
      brand: 'ProLube',
      price: 32.99,
      stockCount: 25,
      location: 'E-02-4',
      category: 'engine',
      compatibility: ['Most Vehicles']
    },
    {
      id: 6,
      partCode: 'BR-DISC',
      name: 'Brake Disc Rotor (Rear)',
      brand: 'StopMax',
      price: 65.99,
      stockCount: 2,
      location: 'A-10-2',
      category: 'brakes',
      compatibility: ['Honda Civic 2018-2022']
    }
  ];

  const navItems = [
    {
      id: "home",
      icon: "home",
      label: "Home",
      onPress: () => navigation.navigate('TechnicianHome')
    },
    {
      id: "work",
      icon: "clipboard",
      label: "Work Orders",
      onPress: () => navigation.navigate('Work')
    },
    {
      id: "inspection",
      icon: "search",
      label: "Inspect",
      onPress: () => navigation.navigate('Search')
    },
    {
      id: "inventory",
      icon: "cube",
      label: "Inventory",
      onPress: () => navigation.navigate('Inventory')
    },
    {
      id: "profile",
      icon: "person",
      label: "Profile",
      onPress: () => navigation.navigate('TechnicianPofile')
    }
  ];

  // Filter inventory items
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.partCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (activeFilter === 'in_stock') {
      matchesFilter = item.stockCount > 10;
    } else if (activeFilter === 'low_stock') {
      matchesFilter = item.stockCount > 0 && item.stockCount <= 10;
    } else if (activeFilter === 'out_of_stock') {
      matchesFilter = item.stockCount === 0;
    }
    
    return matchesSearch && matchesFilter;
  });

  const handleBarcodePress = () => {
    Alert.alert(
      'Barcode Scanner',
      'Would you like to scan a barcode to search for parts?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Scanner', onPress: () => console.log('Open barcode scanner') }
      ]
    );
  };

  const handleRequestPart = (item) => {
    Alert.alert(
      'Request Part',
      `Request ${item.name} (${item.partCode}) for current work order?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Request', 
          onPress: () => {
            Alert.alert('Success', 'Part request submitted successfully');
          }
        }
      ]
    );
  };

  const handleViewDetails = (item) => {
    Alert.alert(
      'Part Details',
      `${item.name}\n\nPart Code: ${item.partCode}\nBrand: ${item.brand}\nPrice: $${item.price}\nStock: ${item.stockCount}\nLocation: ${item.location}\n\nCompatibility:\n${item.compatibility.join('\n')}`,
      [{ text: 'Close', style: 'cancel' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon=""
        name="T"
        onIconPress={() => navigation.goBack()}
      />
      
      <SearchBar
        placeholder='Search item by name and vehicle'
      />
      
      <QuickFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredItems.length} {filteredItems.length === 1 ? 'part' : 'parts'} found
        </Text>
        <TouchableOpacity style={styles.sortButton}>
          <Icon name="swap-vertical" size={16} color={Colors.primary} />
          <Text style={styles.sortText}>Sort</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <FlatList
          data={filteredItems}
          renderItem={({ item }) => (
            <InventoryItemCard
              item={item}
              onRequestPart={handleRequestPart}
              onViewDetails={handleViewDetails}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerStyle={styles.inventoryList}
        />
      </ScrollView>
    
      <BottomNavigation
        navItems={navItems}
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral50,
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    backgroundColor: Colors.neutral0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral100,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.neutral1000,
    marginLeft: 12,
  },
  barcodeButton: {
    padding: 8,
  },
  filtersContainer: {
    backgroundColor: Colors.neutral0,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.neutral100,
    borderRadius: 20,
    marginRight: 12,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: Colors.neutral600,
    marginLeft: 6,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: Colors.neutral0,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.neutral0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  resultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  inventoryList: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  inventoryCard: {
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  partInfo: {
    flex: 1,
  },
  partCode: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 4,
  },
  partName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 4,
  },
  partBrand: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockLabel: {
    fontSize: 14,
    color: Colors.neutral600,
    marginRight: 4,
  },
  stockCount: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: Colors.neutral600,
    marginLeft: 4,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral1000,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.neutral100,
    borderRadius: 8,
  },
  detailsButtonText: {
    fontSize: 14,
    color: Colors.neutral600,
    marginLeft: 4,
    fontWeight: '500',
  },
  requestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  requestButtonDisabled: {
    backgroundColor: Colors.neutral300,
  },
  requestButtonText: {
    fontSize: 14,
    color: Colors.neutral0,
    marginLeft: 4,
    fontWeight: '600',
  },
  requestButtonTextDisabled: {
    color: Colors.neutral600,
  },
});

export default TechnicianInventoryScreen;