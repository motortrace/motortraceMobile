import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  FlatList,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import BottomNavigation from '../components/BottomNav';
import CarSelection from '../components/CarSelection';
import CategoryList from '../components/CategoryList';
import Colors from '../constants/colors';

const { width: screenWidth } = Dimensions.get('window');

// Product Grid Component
const ProductGrid = ({ products, onProductPress, onAddToCart, onSortPress }) => (
  <View style={styles.productGrid}>
    <View style={styles.productGridHeader}>
      <Text style={styles.resultsText}>{products.length} results</Text>
      <TouchableOpacity style={styles.sortButton} onPress={onSortPress}>
        <Text style={styles.sortText}>Sort by</Text>
        <Icon name="filter" size={16} color="#2563eb" />
      </TouchableOpacity>
    </View>
    
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <ProductCard 
          product={item} 
          onProductPress={onProductPress}
          onAddToCart={onAddToCart}
        />
      )}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={styles.productRow}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.productListContent}
    />
  </View>
);

// Main Home Screen Component
const MarketplaceHomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCar, setSelectedCar] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [activeTab, setActiveTab] = useState(0)

  // Mock data
  const userCars = [
    { id: 1, make: 'Toyota', model: 'Camry', year: 2020, color: 'Silver' },
    { id: 2, make: 'Honda', model: 'Civic', year: 2019, color: 'Black' },
    { id: 3, make: 'BMW', model: 'X3', year: 2021, color: 'White' }
  ];

  const categories = [
    { id: 'all', name: 'All Parts', icon: 'cube' },
    { id: 'engine', name: 'Engine', icon: 'settings' },
    { id: 'brakes', name: 'Brakes', icon: 'disc' },
    { id: 'suspension', name: 'Suspension', icon: 'reader' },
    { id: 'electrical', name: 'Electrical', icon: 'flash' },
    { id: 'exterior', name: 'Exterior', icon: 'car' },
    { id: 'interior', name: 'Interior', icon: 'cog' },
    { id: 'transmission', name: 'Transmission', icon: 'settings' }
  ];

  const mockProducts = [
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
      brand: 'AutoPro'
    },
    {
      id: 2,
      name: 'LED Headlight Bulb H7',
      category: 'electrical',
      price: 45.99,
      originalPrice: 65.00,
      rating: 4.8,
      reviews: 89,
      inStock: true,
      stockCount: 8,
      brand: 'BrightBeam'
    },
    {
      id: 3,
      name: 'High-Flow Air Filter',
      category: 'engine',
      price: 24.99,
      originalPrice: 35.00,
      rating: 4.3,
      reviews: 234,
      inStock: true,
      stockCount: 25,
      brand: 'FlowMax'
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
      stockCount: 0,
      brand: 'SportTech'
    }
  ];

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
  ]

  // Filter products
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleProductPress = (product) => {
    console.log('Product pressed:', product);
  };

  const handleAddToCart = (product) => {
    console.log('Add to cart:', product);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon="back"
        name="John Doe"
        image=""
        onIconPress={() => console.log('Menu Pressed')}
      />
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>

      <SearchBar
        containerStyle={{
          zIndex: 10,
          width: '100%',
          padding: 10,
        }}
        placeholder="Search products..."
      />

        <CarSelection 
          cars={userCars}
          selectedCar={selectedCar}
          onCarSelect={setSelectedCar}
          onAddCar={() => console.log('Add car pressed')}
        />
        
        <CategoryList 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
        
        <ProductGrid 
          products={filteredProducts}
          onProductPress={handleProductPress}
          onAddToCart={handleAddToCart}
          onSortPress={() => console.log('Sort pressed')}
        />
      </ScrollView>
    
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
  content: {
    flex: 1,
  },
  categorySection: {
    paddingVertical: 16,
    backgroundColor: Colors.neutral0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  categoryList: {
    paddingHorizontal: 20,
  },
  categoryCard: {
    backgroundColor: Colors.neutral50,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryCardSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.neutral1000,
    marginTop: 4,
    textAlign: 'center',
  },
  categoryTextSelected: {
    color: Colors.neutral0,
  },
  productGrid: {
    padding: 20,
    marginBottom: -30,
  },
  productGridHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral1000,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productListContent: {
    paddingBottom: 20,
  },
});

export default MarketplaceHomeScreen;