import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Modal,
  Dimensions,
  Alert,
  FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
import Colors from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App'
import BottomHistorySectin from '../../components/BottomHistory'; // Import the new component
import BottomNavigation from '../../components/BottomNav';

const { width, height } = Dimensions.get('window');

// Search Result Item Component (same as before)
const SearchResultItem = ({ item, onPress }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return Colors.success;
      case 'in_progress': return Colors.warning;
      case 'pending': return Colors.primary;
      case 'cancelled': return Colors.danger;
      default: return Colors.neutral400;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  return (
    <TouchableOpacity style={styles.resultItem} onPress={() => onPress(item)}>
      <View style={styles.resultHeader}>
        <Text style={styles.resultId}>#{item.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      
      <Text style={styles.customerName}>{item.customerName}</Text>
      <Text style={styles.vehicleInfo}>
        {item.vehicle.year} {item.vehicle.make} {item.vehicle.model}
      </Text>
      <Text style={styles.serviceType}>Service: {item.serviceType}</Text>
      
      <View style={styles.resultFooter}>
        <View style={styles.dateInfo}>
          <Icon name="calendar-outline" size={14} color={Colors.neutral400} />
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
        <View style={styles.timeInfo}>
          <Icon name="time-outline" size={14} color={Colors.neutral400} />
          <Text style={styles.timeText}>{item.duration}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Filter Modal Component (same as before)
const FilterModal = ({ visible, onClose, onApply, currentFilters }) => {
  const [filters, setFilters] = useState(currentFilters);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const statusOptions = [
    { key: 'all', label: 'All Status' },
    { key: 'completed', label: 'Completed' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'pending', label: 'Pending' },
    { key: 'cancelled', label: 'Cancelled' }
  ];

  const serviceOptions = [
    { key: 'all', label: 'All Services' },
    { key: 'oil_change', label: 'Oil Change' },
    { key: 'brake_service', label: 'Brake Service' },
    { key: 'tire_rotation', label: 'Tire Rotation' },
    { key: 'inspection', label: 'Inspection' },
    { key: 'engine_repair', label: 'Engine Repair' }
  ];

  const dateOptions = [
    { key: 'all', label: 'All Time' },
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'quarter', label: 'This Quarter' }
  ];

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      status: 'all',
      service: 'all',
      date: 'all'
    };
    setFilters(resetFilters);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.filterModalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Search Results</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={Colors.neutral600} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.filterBody}>
            {/* Status Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Status</Text>
              <View style={styles.filterOptions}>
                {statusOptions.map(option => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.filterOption,
                      filters.status === option.key && styles.filterOptionSelected
                    ]}
                    onPress={() => setFilters(prev => ({ ...prev, status: option.key }))}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      filters.status === option.key && styles.filterOptionTextSelected
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Service Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Service Type</Text>
              <View style={styles.filterOptions}>
                {serviceOptions.map(option => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.filterOption,
                      filters.service === option.key && styles.filterOptionSelected
                    ]}
                    onPress={() => setFilters(prev => ({ ...prev, service: option.key }))}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      filters.service === option.key && styles.filterOptionTextSelected
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Date Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Date Range</Text>
              <View style={styles.filterOptions}>
                {dateOptions.map(option => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.filterOption,
                      filters.date === option.key && styles.filterOptionSelected
                    ]}
                    onPress={() => setFilters(prev => ({ ...prev, date: option.key }))}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      filters.date === option.key && styles.filterOptionTextSelected
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const TechnicianSearchScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState(2);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([
    { 
      id: 1, 
      query: 'Oil Change', 
      timestamp: '2 hours ago', 
      type: 'service',
      category: 'Service Type',
      isFavorite: true
    },
    { 
      id: 2, 
      query: 'John Doe', 
      timestamp: '1 day ago', 
      type: 'customer',
      category: 'Customer Name',
      isFavorite: false
    },
    { 
      id: 3, 
      query: 'Toyota Camry', 
      timestamp: '3 days ago', 
      type: 'vehicle',
      category: 'Vehicle Model',
      isFavorite: true
    },
    { 
      id: 4, 
      query: 'Brake Service', 
      timestamp: '1 week ago', 
      type: 'service',
      category: 'Service Type',
      isFavorite: false
    },
    { 
      id: 5, 
      query: 'WO123456', 
      timestamp: '2 weeks ago', 
      type: 'workorder',
      category: 'Work Order ID',
      isFavorite: true
    }
  ]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    service: 'all',
    date: 'all'
  });

  // Mock search results
  const mockResults = [
    {
      id: 'WO123456',
      customerName: 'John Doe',
      vehicle: { year: 2020, make: 'Toyota', model: 'Camry' },
      serviceType: 'Oil Change & Inspection',
      status: 'completed',
      date: '2024-01-15',
      duration: '2h 30m'
    },
    {
      id: 'WO123457',
      customerName: 'Jane Smith',
      vehicle: { year: 2019, make: 'Honda', model: 'Civic' },
      serviceType: 'Brake Service',
      status: 'in_progress',
      date: '2024-01-14',
      duration: '1h 45m'
    },
    {
      id: 'WO123458',
      customerName: 'Mike Johnson',
      vehicle: { year: 2021, make: 'Ford', model: 'F-150' },
      serviceType: 'Tire Rotation',
      status: 'pending',
      date: '2024-01-13',
      duration: '45m'
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

  const handleSearch = (query = searchQuery) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setShowResults(true);
    
    // Determine search type based on query
    let searchType = 'general';
    let category = 'General Search';
    
    if (query.toLowerCase().includes('oil') || query.toLowerCase().includes('brake') || query.toLowerCase().includes('tire')) {
      searchType = 'service';
      category = 'Service Type';
    } else if (query.startsWith('WO') || query.startsWith('wo')) {
      searchType = 'workorder';
      category = 'Work Order ID';
    } else if (query.includes(' ')) {
      const words = query.split(' ');
      if (words.length >= 2 && words[0].charAt(0).toUpperCase() === words[0].charAt(0)) {
        searchType = 'customer';
        category = 'Customer Name';
      } else {
        searchType = 'vehicle';
        category = 'Vehicle Model';
      }
    }
    
    // Add to search history
    const newHistoryItem = {
      id: Date.now(),
      query: query.trim(),
      timestamp: 'Just now',
      type: searchType,
      category: category,
      isFavorite: false
    };
    
    setSearchHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);
    
    // Simulate search delay
    setTimeout(() => {
      // Filter results based on query and filters
      let filteredResults = mockResults.filter(item => {
        const matchesQuery = 
          item.customerName.toLowerCase().includes(query.toLowerCase()) ||
          item.id.toLowerCase().includes(query.toLowerCase()) ||
          item.vehicle.make.toLowerCase().includes(query.toLowerCase()) ||
          item.vehicle.model.toLowerCase().includes(query.toLowerCase()) ||
          item.serviceType.toLowerCase().includes(query.toLowerCase());
        
        const matchesStatus = filters.status === 'all' || item.status === filters.status;
        const matchesService = filters.service === 'all' || item.serviceType.toLowerCase().includes(filters.service.replace('_', ' '));
        
        return matchesQuery && matchesStatus && matchesService;
      });
      
      setSearchResults(filteredResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleHistoryPress = (query) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleDeleteHistory = (id) => {
    setSearchHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
  };

  const handleToggleFavorite = (id) => {
    setSearchHistory(prev => 
      prev.map(item => 
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleResultPress = (item) => {
    Alert.alert(
      'Work Order Details',
      `Work Order: ${item.id}\nCustomer: ${item.customerName}\nVehicle: ${item.vehicle.year} ${item.vehicle.make} ${item.vehicle.model}\nService: ${item.serviceType}\nStatus: ${item.status}`,
      [
        { text: 'OK' }
      ]
    );
  };

  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.status !== 'all') count++;
    if (filters.service !== 'all') count++;
    if (filters.date !== 'all') count++;
    return count;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon="back"
        name="Search"
        onIconPress={() => navigation.goBack()}
      />

      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Icon name="search-outline" size={20} color={Colors.neutral400} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search work orders ...."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => handleSearch()}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="close-circle" size={20} color={Colors.neutral400} />
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Icon name="options-outline" size={20} color={Colors.neutral600} />
            {getActiveFilterCount() > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{getActiveFilterCount()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search Results */}
        {showResults && (
          <View style={styles.resultsContainer}>
            {isSearching ? (
              <View style={styles.loadingContainer}>
                <Icon name="search-outline" size={48} color={Colors.neutral300} />
                <Text style={styles.loadingText}>Searching...</Text>
              </View>
            ) : (
              <>
                <View style={styles.resultsHeader}>
                  <Text style={styles.resultsTitle}>
                    Search Results ({searchResults.length})
                  </Text>
                  <TouchableOpacity 
                    style={styles.sortButton}
                    onPress={() => Alert.alert('Sort Options', 'Sort functionality would be implemented here')}
                  >
                    <Icon name="swap-vertical-outline" size={16} color={Colors.neutral400} />
                    <Text style={styles.sortText}>Sort</Text>
                  </TouchableOpacity>
                </View>
                
                {searchResults.length === 0 ? (
                  <View style={styles.emptyResults}>
                    <Icon name="search-outline" size={48} color={Colors.neutral300} />
                    <Text style={styles.emptyResultsText}>No results found</Text>
                    <Text style={styles.emptyResultsSubtext}>
                      Try adjusting your search terms or filters
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={searchResults}
                    renderItem={({ item }) => (
                      <SearchResultItem
                        item={item}
                        onPress={handleResultPress}
                      />
                    )}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.resultsList}
                  />
                )}
              </>
            )}
          </View>
        )}

        {/* Bottom History Section */}
        {!showResults && (
          <BottomHistorySectin
            searchHistory={searchHistory}
            onHistoryPress={handleHistoryPress}
            onDeleteHistory={handleDeleteHistory}
            onClearHistory={handleClearHistory}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </View>

      <BottomNavigation
        navItems={navItems}
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleFilterApply}
        currentFilters={filters}
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 5,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.neutral1000,
  },
  filterButton: {
    position: 'relative',
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: Colors.neutral0,
    fontSize: 12,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.neutral400,
    marginTop: 16,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    fontSize: 14,
    color: Colors.neutral400,
  },
  resultsList: {
    paddingBottom: 20,
  },
  resultItem: {
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultId: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.neutral1000,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.neutral0,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 4,
  },
  vehicleInfo: {
    fontSize: 13,
    color: Colors.neutral600,
    marginBottom: 2,
  },
  serviceType: {
    fontSize: 13,
    color: Colors.neutral600,
    marginBottom: 12,
  },
  resultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: Colors.neutral400,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: Colors.neutral400,
  },
  emptyResults: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyResultsText: {
    fontSize: 16,
    color: Colors.neutral400,
    marginTop: 16,
  },
  emptyResultsSubtext: {
    fontSize: 14,
    color: Colors.neutral300,
    textAlign: 'center',
    marginTop: 8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filterModalContent: {
    backgroundColor: Colors.neutral0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  filterBody: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.neutral100,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  filterOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterOptionText: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  filterOptionTextSelected: {
    color: Colors.neutral0,
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    backgroundColor: Colors.neutral200,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    color: Colors.neutral600,
    fontSize: 14,
    fontWeight: '600',
  },
  applyButton: {
    flex: 2,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: Colors.neutral0,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default TechnicianSearchScreen;