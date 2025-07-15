import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';

// Enhanced Search History Item Component
const HistoryItem = ({ item, onPress, onDelete, onToggleFavorite }) => {
  const [fadeAnim] = useState(new Animated.Value(1));

  const handleDelete = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onDelete(item.id);
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'customer': return 'person-outline';
      case 'vehicle': return 'car-outline';
      case 'service': return 'construct-outline';
      case 'workorder': return 'document-text-outline';
      default: return 'search-outline';
    }
  };

  return (
    <Animated.View style={[styles.historyItem, { opacity: fadeAnim }]}>
      <TouchableOpacity 
        style={styles.historyItemContent} 
        onPress={() => onPress(item.query)}
        activeOpacity={0.7}
      >
        <View style={styles.historyItemLeft}>
          <Icon name={getTypeIcon(item.type)} size={16} color={Colors.neutral400} />
          <View style={styles.historyTextContainer}>
            <Text style={styles.historyText}>{item.query}</Text>
            <Text style={styles.historyCategory}>{item.category}</Text>
          </View>
        </View>
        
        <View style={styles.historyItemRight}>
          <Text style={styles.historyTime}>{item.timestamp}</Text>
          <View style={styles.historyActions}>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => onToggleFavorite(item.id)}
            >
              <Icon 
                name={item.isFavorite ? "heart" : "heart-outline"} 
                size={14} 
                color={item.isFavorite ? Colors.danger : Colors.neutral400} 
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Icon name="trash-outline" size={14} color={Colors.neutral400} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Category Filter Component
const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.categoryFilter}
      contentContainerStyle={styles.categoryFilterContent}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.key}
          style={[
            styles.categoryChip,
            selectedCategory === category.key && styles.categoryChipSelected
          ]}
          onPress={() => onCategoryChange(category.key)}
        >
          <Icon 
            name={category.icon} 
            size={14} 
            color={selectedCategory === category.key ? Colors.neutral0 : Colors.neutral400} 
          />
          <Text style={[
            styles.categoryText,
            selectedCategory === category.key && styles.categoryTextSelected
          ]}>
            {category.label}
          </Text>
          {category.count > 0 && (
            <View style={[
              styles.categoryCount,
              selectedCategory === category.key && styles.categoryCountSelected
            ]}>
              <Text style={[
                styles.categoryCountText,
                selectedCategory === category.key && styles.categoryCountTextSelected
              ]}>
                {category.count}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// Main Bottom History Section Component
const BottomHistorySection = ({ 
  searchHistory, 
  onHistoryPress, 
  onDeleteHistory, 
  onClearHistory,
  onToggleFavorite 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Sample categories with counts
  const categories = [
    { key: 'all', label: 'All', icon: 'apps-outline', count: searchHistory.length },
    { key: 'customer', label: 'Customers', icon: 'person-outline', count: 3 },
    { key: 'vehicle', label: 'Vehicles', icon: 'car-outline', count: 2 },
    { key: 'service', label: 'Services', icon: 'construct-outline', count: 4 },
    { key: 'workorder', label: 'Work Orders', icon: 'document-text-outline', count: 1 }
  ];

  // Filter history based on selected category and favorites
  const filteredHistory = searchHistory.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory;
    const matchesFavorites = !showFavoritesOnly || item.isFavorite;
    return matchesCategory && matchesFavorites;
  });

  const handleClearHistory = () => {
    Alert.alert(
      'Clear Search History',
      'Are you sure you want to clear all search history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive', 
          onPress: onClearHistory
        }
      ]
    );
  };

  const favoriteCount = searchHistory.filter(item => item.isFavorite).length;

  return (
    <View style={styles.bottomHistoryContainer}>
      {/* Header */}
      <View style={styles.historyHeader}>
        <View style={styles.historyTitleContainer}>
          <Text style={styles.historyTitle}>Search History</Text>
          <View style={styles.historyStats}>
            <Text style={styles.historyCount}>
              {filteredHistory.length} {filteredHistory.length === 1 ? 'item' : 'items'}
            </Text>
            {favoriteCount > 0 && (
              <Text style={styles.favoriteCount}>
                {favoriteCount} ♥
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.historyActions}>
          <TouchableOpacity
            style={[
              styles.favoritesToggle,
              showFavoritesOnly && styles.favoritesToggleActive
            ]}
            onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
          >
            <Icon 
              name="heart" 
              size={16} 
              color={showFavoritesOnly ? Colors.neutral0 : Colors.neutral400} 
            />
          </TouchableOpacity>
          
          {searchHistory.length > 0 && (
            <TouchableOpacity onPress={handleClearHistory}>
              <Text style={styles.clearHistoryText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* History List */}
      <View style={styles.historyContent}>
        {filteredHistory.length === 0 ? (
          <View style={styles.emptyHistory}>
            <Icon 
              name={showFavoritesOnly ? "heart-outline" : "time-outline"} 
              size={48} 
              color={Colors.neutral300} 
            />
            <Text style={styles.emptyHistoryText}>
              {showFavoritesOnly ? 'No favorite searches' : 'No search history'}
            </Text>
            <Text style={styles.emptyHistorySubtext}>
              {showFavoritesOnly 
                ? 'Mark searches as favorites to see them here' 
                : 'Your recent searches will appear here'
              }
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredHistory}
            renderItem={({ item }) => (
              <HistoryItem
                item={item}
                onPress={onHistoryPress}
                onDelete={onDeleteHistory}
                onToggleFavorite={onToggleFavorite}
              />
            )}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.historyList}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomHistoryContainer: {
    display: 'flex',
    flex: 1,
    backgroundColor: Colors.neutral0,
    borderTopLeftRadius: 20,
    borderRadius: 20,
    paddingTop: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    maxHeight: 600,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  historyTitleContainer: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 4,
  },
  historyStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyCount: {
    fontSize: 12,
    color: Colors.neutral400,
  },
  favoriteCount: {
    fontSize: 12,
    color: Colors.danger,
    fontWeight: '500',
  },
  historyActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  favoritesToggle: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.neutral100,
  },
  favoritesToggleActive: {
    backgroundColor: Colors.danger,
  },
  clearHistoryText: {
    fontSize: 14,
    color: Colors.danger,
    fontWeight: '500',
  },
  categoryFilter: {
    marginBottom: 16,
    maxHeight: 50,
  },
  categoryFilterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.neutral100,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    gap: 6,
  },
  categoryChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: 12,
    color: Colors.neutral600,
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: Colors.neutral0,
  },
  categoryCount: {
    backgroundColor: Colors.neutral200,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 18,
    alignItems: 'center',
  },
  categoryCountSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  categoryCountText: {
    fontSize: 10,
    color: Colors.neutral600,
    fontWeight: '600',
  },
  categoryCountTextSelected: {
    color: Colors.neutral0,
  },
  historyContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  historyList: {
    paddingBottom: 20,
  },
  historyItem: {
    backgroundColor: Colors.neutral50,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  historyItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  historyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  historyTextContainer: {
    flex: 1,
  },
  historyText: {
    fontSize: 14,
    color: Colors.neutral1000,
    fontWeight: '500',
    marginBottom: 2,
  },
  historyCategory: {
    fontSize: 12,
    color: Colors.neutral400,
    textTransform: 'capitalize',
  },
  historyItemRight: {
    alignItems: 'flex-end',
  },
  historyTime: {
    fontSize: 11,
    color: Colors.neutral400,
    marginBottom: 6,
  },
  historyActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  favoriteButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 4,
  },
  emptyHistory: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyHistoryText: {
    fontSize: 16,
    color: Colors.neutral400,
    marginTop: 16,
    fontWeight: '500',
  },
  emptyHistorySubtext: {
    fontSize: 14,
    color: Colors.neutral300,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
});

export default BottomHistorySection;