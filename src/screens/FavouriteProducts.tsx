import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  FlatList,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import BottomNavigation from '../components/BottomNav';
import Colors from '../constants/colors';

const { width: screenWidth } = Dimensions.get('window');

const FavoritesScreen = () => {
  const [activeTab, setActiveTab] = useState(3);
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      name: 'Premium Brake Pads',
      category: 'brakes',
      price: 89.99,
      originalPrice: 120.00,
      rating: 4.5,
      reviews: 156,
      inStock: true,
      stockCount: 15,
      brand: 'AutoPro',
      isFavorite: true
    },
    {
      id: 2,
      name: 'LED Headlight Kit',
      category: 'electrical',
      price: 149.99,
      originalPrice: 200.00,
      rating: 4.8,
      reviews: 89,
      inStock: true,
      stockCount: 8,
      brand: 'BrightBeam',
      isFavorite: true
    },
    {
      id: 3,
      name: 'Performance Air Filter',
      category: 'engine',
      price: 34.99,
      originalPrice: 45.00,
      rating: 4.6,
      reviews: 123,
      inStock: true,
      stockCount: 12,
      brand: 'FlowMax',
      isFavorite: true
    },
    {
      id: 4,
      name: 'Sport Suspension Kit',
      category: 'suspension',
      price: 299.99,
      originalPrice: 450.00,
      rating: 4.7,
      reviews: 67,
      inStock: true,
      stockCount: 5,
      brand: 'SportTech',
      isFavorite: true
    },
    {
      id: 5,
      name: 'Ceramic Brake Discs',
      category: 'brakes',
      price: 189.99,
      originalPrice: 250.00,
      rating: 4.8,
      reviews: 234,
      inStock: false,
      stockCount: 0,
      brand: 'CeramicPro',
      isFavorite: true
    },
    {
      id: 6,
      name: 'Complete Brake Kit',
      category: 'brakes',
      price: 199.99,
      originalPrice: 350.00,
      rating: 4.6,
      reviews: 145,
      inStock: true,
      stockCount: 3,
      brand: 'BrakeMax',
      isFavorite: true
    }
  ]);

  const navItems = [
    {
      id: "recommended",
      icon: "flame",
      onPress: () => setActiveTab(1)
    },
    {
      id: "history",
      icon: "time",
      onPress: () => setActiveTab(2),
    },
    {
      id: "search",
      icon: "search",
      onPress: () => setActiveTab(0),
    },
    {
      id: "heart",
      icon: "heart",
      label: "Nearby",
      onPress: () => setActiveTab(3),
    },
    {
      id: "cart",
      icon: "cart",
      label: "Favourite",
      onPress: () => setActiveTab(4),
    },
  ];

  const handleProductPress = (product) => {
    console.log('Product pressed:', product);
  };

  const handleAddToCart = (product) => {
    console.log('Add to cart:', product);
  };

  const handleRemoveFromFavorites = (productId) => {
    setFavorites(prevFavorites => prevFavorites.filter(item => item.id !== productId));
  };

  const handleClearAllFavorites = () => {
    setFavorites([]);
  };

  const renderFavoriteItem = ({ item }) => (
    <View style={styles.favoriteItem}>
      <ProductCard 
        product={item} 
        onProductPress={handleProductPress}
        onAddToCart={handleAddToCart}
      />
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => handleRemoveFromFavorites(item.id)}
      >
        <Icon name="heart" size={20} color={Colors.danger} />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="heart-outline" size={80} color={Colors.neutral400} />
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptyText}>
        Start adding products to your favorites to see them here
      </Text>
      <TouchableOpacity style={styles.shopButton}>
        <Text style={styles.shopButtonText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon="back"
        name="John Doe"
        image=""
        onIconPress={() => console.log('Notifications Pressed')}
      />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Favorites</Text>
          <Text style={styles.subtitle}>
            {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
          </Text>
        </View>
        {favorites.length > 0 && (
          <TouchableOpacity onPress={handleClearAllFavorites}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {favorites.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      )}
    
      <BottomNavigation
        navItems={navItems}
        activeTab={activeTab}
        onTabPress={() => {}}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.neutral0,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral1000,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  clearAllText: {
    fontSize: 14,
    color: Colors.danger,
    fontWeight: '500',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  favoriteItem: {
    position: 'relative',
    width: (screenWidth - 60) / 2,
    marginBottom: 0,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.neutral0,
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.neutral1000,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.neutral600,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  shopButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  shopButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral0,
  },
});

export default FavoritesScreen;