import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  FlatList,
  Dimensions,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import BottomNavigation from '../components/BottomNav';
import Colors from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';

const { width: screenWidth } = Dimensions.get('window');

// Trending Products Section
const TrendingSection = ({ products, onProductPress, onAddToCart }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Trending Now</Text>
      <TouchableOpacity>
        <Text style={styles.seeAllText}>See All</Text>
      </TouchableOpacity>
    </View>
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <View style={styles.trendingCard}>
          <ProductCard 
            product={item} 
            onProductPress={onProductPress}
            onAddToCart={onAddToCart}
            compact={true}
          />
        </View>
      )}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalList}
    />
  </View>
);

// For Your Car Section
const ForYourCarSection = ({ recommendations, selectedCar, onProductPress, onAddToCart }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <View>
        <Text style={styles.sectionTitle}>For Your {selectedCar?.make} {selectedCar?.model}</Text>
        <Text style={styles.sectionSubtitle}>Based on your {selectedCar?.year} model</Text>
      </View>
      <TouchableOpacity>
        <Text style={styles.seeAllText}>See All</Text>
      </TouchableOpacity>
    </View>
    <FlatList
      data={recommendations}
      renderItem={({ item }) => (
        <View style={styles.recommendationCard}>
          <ProductCard 
            product={item} 
            onProductPress={onProductPress}
            onAddToCart={onAddToCart}
            compact={true}
          />
        </View>
      )}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalList}
    />
  </View>
);

// Recently Viewed Section
const RecentlyViewedSection = ({ products, onProductPress, onAddToCart }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Recently Viewed</Text>
      <TouchableOpacity>
        <Text style={styles.clearText}>Clear</Text>
      </TouchableOpacity>
    </View>
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <View style={styles.recentCard}>
          <ProductCard 
            product={item} 
            onProductPress={onProductPress}
            onAddToCart={onAddToCart}
            compact={true}
          />
        </View>
      )}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalList}
    />
  </View>
);

// Popular Categories Section
const PopularCategoriesSection = ({ categories, onCategoryPress }) => (
  <View style={styles.section}>
    <Text style={[styles.sectionTitle, {marginLeft: 25}]}>Popular Categories</Text>
    <View style={styles.categoriesGrid}>
      {categories.map((category) => (
        <TouchableOpacity 
          key={category.id}
          style={styles.categoryItem}
          onPress={() => onCategoryPress(category)}
        >
          <View style={styles.categoryIcon}>
            <Icon name={category.icon} size={24} color={Colors.primary} />
          </View>
          <Text style={styles.categoryName}>{category.name}</Text>
          <Text style={styles.categoryCount}>{category.count} items</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

// Daily Deals Section
const DailyDealsSection = ({ deals, onProductPress, onAddToCart }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <View>
        <Text style={styles.sectionTitle}>Daily Deals</Text>
        <Text style={styles.sectionSubtitle}>Limited time offers</Text>
      </View>
      <View style={styles.timerContainer}>
        <Icon name="time" size={16} color={Colors.error} />
        <Text style={styles.timerText}>12h 34m left</Text>
      </View>
    </View>
    <FlatList
      data={deals}
      renderItem={({ item }) => (
        <View style={styles.dealCard}>
          <ProductCard 
            product={item} 
            onProductPress={onProductPress}
            onAddToCart={onAddToCart}
            compact={true}
            showDiscount={true}
          />
        </View>
      )}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalList}
    />
  </View>
);

// Main Recommended Screen Component
const MarketplaceRecommendedScreen = () => {
  const [selectedCar, setSelectedCar] = useState({
    id: 1, 
    make: 'Toyota', 
    model: 'Camry', 
    year: 2020, 
    color: 'Silver'
  });
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState(0);

  // Mock data for recommendations
  const trendingProducts = [
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
      trending: true
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
      trending: true
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
      trending: true
    }
  ];

  const carRecommendations = [
    {
      id: 4,
      name: 'Toyota Camry Oil Filter',
      category: 'engine',
      price: 12.99,
      originalPrice: 18.00,
      rating: 4.7,
      reviews: 234,
      inStock: true,
      stockCount: 25,
      brand: 'OEM Toyota',
      compatible: true
    },
    {
      id: 5,
      name: 'Camry Floor Mats Set',
      category: 'interior',
      price: 45.99,
      originalPrice: 65.00,
      rating: 4.4,
      reviews: 87,
      inStock: true,
      stockCount: 15,
      brand: 'WeatherTech',
      compatible: true
    },
    {
      id: 6,
      name: 'Camry Cabin Air Filter',
      category: 'engine',
      price: 19.99,
      originalPrice: 28.00,
      rating: 4.5,
      reviews: 156,
      inStock: true,
      stockCount: 20,
      brand: 'FilterMax',
      compatible: true
    }
  ];

  const recentlyViewed = [
    {
      id: 7,
      name: 'Sport Suspension Kit',
      category: 'suspension',
      price: 299.99,
      originalPrice: 450.00,
      rating: 4.7,
      reviews: 67,
      inStock: true,
      stockCount: 5,
      brand: 'SportTech'
    },
    {
      id: 8,
      name: 'Ceramic Brake Discs',
      category: 'brakes',
      price: 189.99,
      originalPrice: 250.00,
      rating: 4.8,
      reviews: 234,
      inStock: true,
      stockCount: 8,
      brand: 'CeramicPro'
    }
  ];

  const dailyDeals = [
    {
      id: 9,
      name: 'Complete Brake Kit',
      category: 'brakes',
      price: 199.99,
      originalPrice: 350.00,
      rating: 4.6,
      reviews: 145,
      inStock: true,
      stockCount: 3,
      brand: 'BrakeMax',
      discount: 43
    },
    {
      id: 10,
      name: 'Premium Wiper Blades',
      category: 'exterior',
      price: 24.99,
      originalPrice: 40.00,
      rating: 4.3,
      reviews: 89,
      inStock: true,
      stockCount: 12,
      brand: 'ClearView',
      discount: 38
    }
  ];

  const popularCategories = [
    { id: 'brakes', name: 'Brakes', icon: 'disc', count: 1250 },
    { id: 'engine', name: 'Engine', icon: 'settings', count: 2100 },
    { id: 'electrical', name: 'Electrical', icon: 'flash', count: 850 },
    { id: 'suspension', name: 'Suspension', icon: 'reader', count: 650 }
  ];

    const navItems = [
    {
      id: "recommended",
      icon: "flame",
      onPress: () => navigation.navigate('RecommendedProduct')
    },
    {
      id: "history",
      icon: "time",
      onPress: () => navigation.navigate('PurchaseHistory')
    },
    {
      id: "search",
      icon: "search",
      onPress: () => navigation.navigate('MarketPlace')
    },
    {
      id: "heart",
      icon: "heart",
      label: "Nearby",
      onPress: () => navigation.navigate('FavouriteProducts')
    },
    {
      id: "cart",
      icon: "cart",
      label: "Favourite",
      onPress: () => navigation.navigate('Carts')
    },
  ]

  const handleProductPress = (product) => {
    console.log('Product pressed:', product);
  };

  const handleAddToCart = (product) => {
    console.log('Add to cart:', product);
  };

  const handleCategoryPress = (category) => {
    console.log('Category pressed:', category);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon="back"
        name="John Doe"
        image=""
        onIconPress={() => navigation.navigate('Home')}
      />
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Good Morning, John!</Text>
          <Text style={styles.welcomeSubtitle}>Discover parts perfect for your vehicles</Text>
        </View>

        <TrendingSection 
          products={trendingProducts}
          onProductPress={handleProductPress}
          onAddToCart={handleAddToCart}
        />

        <ForYourCarSection 
          recommendations={carRecommendations}
          selectedCar={selectedCar}
          onProductPress={handleProductPress}
          onAddToCart={handleAddToCart}
        />

        <DailyDealsSection 
          deals={dailyDeals}
          onProductPress={handleProductPress}
          onAddToCart={handleAddToCart}
        />

        <PopularCategoriesSection 
          categories={popularCategories}
          onCategoryPress={handleCategoryPress}
        />

        <RecentlyViewedSection 
          products={recentlyViewed}
          onProductPress={handleProductPress}
          onAddToCart={handleAddToCart}
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
  welcomeSection: {
    padding: 20,
    backgroundColor: Colors.neutral0,
    marginBottom: 8,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral1000,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Colors.neutral600,
  },
  section: {
    backgroundColor: Colors.neutral0,
    marginBottom: 8,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.neutral600,
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  clearText: {
    fontSize: 14,
    color: Colors.danger,
    fontWeight: '500',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.danger + '10',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timerText: {
    fontSize: 12,
    color: Colors.danger,
    fontWeight: '500',
  },
  horizontalList: {
    paddingHorizontal: 20,
  },
  trendingCard: {
    marginRight: 30,
    width: screenWidth * 0.4,
  },
  recommendationCard: {
    marginRight: 30,
    width: screenWidth * 0.4,
  },
  recentCard: {
    marginRight: 30,
    width: screenWidth * 0.4,
  },
  dealCard: {
    marginRight: 30,
    width: screenWidth * 0.4,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 18,
    marginTop: 16,
  },
  categoryItem: {
    backgroundColor: Colors.neutral50,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (screenWidth - 64) / 2,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: Colors.neutral600,
  },
});

export default MarketplaceRecommendedScreen;