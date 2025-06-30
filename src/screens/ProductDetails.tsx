import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors'; 
import Header from '../components/Header';
import Button from '../components/Button';

const { width } = Dimensions.get('window');

// Dummy product data
const productData = {
  id: 1,
  name: 'Premium Synthetic Motor Oil 5W-30',
  brand: 'TechLube Pro',
  price: 45.99,
  originalPrice: 52.99,
  discount: 13,
  rating: 4.8,
  reviewCount: 234,
  inStock: true,
  stockCount: 15,
  sku: 'TLP-5W30-001',
  images: [
    'https://via.placeholder.com/400x300/007AFF/FFFFFF?text=Oil+Bottle+1',
    'https://via.placeholder.com/400x300/34C759/FFFFFF?text=Oil+Bottle+2',
    'https://via.placeholder.com/400x300/FF9500/FFFFFF?text=Oil+Bottle+3',
  ],
  description: 'Advanced full synthetic motor oil engineered for superior engine protection and performance. Provides excellent wear protection, thermal stability, and fuel economy benefits.',
  features: [
    'Full synthetic formula for maximum protection',
    'Reduces engine wear by up to 47%',
    'Improves fuel economy up to 2%',
    'Extended drain intervals up to 10,000 miles',
    'Compatible with all gasoline engines'
  ],
  specifications: {
    'Viscosity': '5W-30',
    'API Rating': 'SN PLUS',
    'Volume': '5 Quarts (4.73L)',
    'Base Oil': 'Full Synthetic',
    'Pour Point': '-40°F (-40°C)',
    'Flash Point': '440°F (227°C)'
  },
  compatibility: [
    '2018-2024 Toyota Camry',
    '2019-2024 Honda Accord',
    '2020-2024 Nissan Altima',
    'Most gasoline engines'
  ],
  relatedProducts: [
    { id: 2, name: 'Oil Filter Premium', price: 12.99, image: 'https://via.placeholder.com/100x100/007AFF/FFFFFF?text=Filter' },
    { id: 3, name: 'Air Filter High-Flow', price: 24.99, image: 'https://via.placeholder.com/100x100/34C759/FFFFFF?text=Air' },
    { id: 4, name: 'Spark Plugs Set', price: 39.99, image: 'https://via.placeholder.com/100x100/FF9500/FFFFFF?text=Spark' }
  ]
};

const ProductDetailsScreen = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = () => {
    Alert.alert(
      'Added to Cart',
      `${quantity} x ${productData.name} added to your cart!`,
      [{ text: 'OK' }]
    );
  };

  const handleBuyNow = () => {
    Alert.alert(
      'Buy Now',
      `Proceeding to checkout with ${quantity} x ${productData.name}`,
      [{ text: 'Continue' }, { text: 'Cancel', style: 'cancel' }]
    );
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      isFavorite ? 'Removed from Favorites' : 'Added to Favorites',
      isFavorite ? 'Product removed from your favorites' : 'Product added to your favorites'
    );
  };

  const incrementQuantity = () => {
    if (quantity < productData.stockCount) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Icon key={i} name="star" size={16} color={Colors.star} />);
    }

    if (hasHalfStar) {
      stars.push(<Icon key="half" name="star-half" size={16} color={Colors.star} />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Icon key={`empty-${i}`} name="star-outline" size={16} color={Colors.neutral500} />);
    }

    return stars;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.description}>{productData.description}</Text>
            <Text style={styles.featuresTitle}>Key Features:</Text>
            {productData.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Icon name="checkmark-circle" size={16} color={Colors.success} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        );
      case 'specs':
        return (
          <View style={styles.tabContent}>
            {Object.entries(productData.specifications).map(([key, value]) => (
              <View key={key} style={styles.specRow}>
                <Text style={styles.specLabel}>{key}:</Text>
                <Text style={styles.specValue}>{value}</Text>
              </View>
            ))}
          </View>
        );
      case 'compatibility':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.compatibilityTitle}>Compatible Vehicles:</Text>
            {productData.compatibility.map((vehicle, index) => (
              <View key={index} style={styles.compatibilityItem}>
                <Icon name="car" size={16} color={Colors.primary} />
                <Text style={styles.compatibilityText}>{vehicle}</Text>
              </View>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <Header
        icon="back"
        name="John Doe"
        image=""
        onIconPress={() => console.log('Notifications Pressed')}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setSelectedImageIndex(index);
            }}
          >
            {productData.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.productImage} />
            ))}
          </ScrollView>
          
          {/* Image Indicators */}
          <View style={styles.imageIndicators}>
            {productData.images.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.indicator, 
                  { backgroundColor: index === selectedImageIndex ? Colors.primary : Colors.neutral500 }
                ]} 
              />
            ))}
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.brandName}>{productData.brand}</Text>
          <Text style={styles.productName}>{productData.name}</Text>
          <Text style={styles.sku}>SKU: {productData.sku}</Text>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {renderStars(productData.rating)}
            </View>
            <Text style={styles.ratingText}>{productData.rating}</Text>
            <Text style={styles.reviewCount}>({productData.reviewCount} reviews)</Text>
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>${productData.price.toFixed(2)}</Text>
            {productData.originalPrice > productData.price && (
              <Text style={styles.originalPrice}>${productData.originalPrice.toFixed(2)}</Text>
            )}
          </View>

          {/* Stock Status */}
          <View style={styles.stockContainer}>
            <Icon 
              name={productData.inStock ? "checkmark-circle" : "close-circle"} 
              size={16} 
              color={productData.inStock ? Colors.success : Colors.danger} 
            />
            <Text style={[
              styles.stockText, 
              { color: productData.inStock ? Colors.success : Colors.danger }
            ]}>
              {productData.inStock ? `In Stock (${productData.stockCount} available)` : 'Out of Stock'}
            </Text>
          </View>

          {/* Quantity Selector */}
          {productData.inStock && (
            <View style={styles.quantityContainer}>
              <Text style={styles.quantityLabel}>Quantity:</Text>
              <View style={styles.quantitySelector}>
                <TouchableOpacity 
                  style={[styles.quantityButton, { opacity: quantity <= 1 ? 0.5 : 1 }]} 
                  onPress={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Icon name="remove" size={20} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity 
                  style={[styles.quantityButton, { opacity: quantity >= productData.stockCount ? 0.5 : 1 }]} 
                  onPress={incrementQuantity}
                  disabled={quantity >= productData.stockCount}
                >
                  <Icon name="add" size={20} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabsHeader}>
            {['description', 'specs', 'compatibility'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, { borderBottomColor: activeTab === tab ? Colors.primary : 'transparent' }]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[
                  styles.tabText, 
                  { color: activeTab === tab ? Colors.primary : Colors.neutral600 }
                ]}>
                  {tab === 'description' ? 'Description' : tab === 'specs' ? 'Specifications' : 'Compatibility'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {renderTabContent()}
        </View>

        {/* Related Products */}
        <View style={styles.relatedSection}>
          <Text style={styles.relatedTitle}>You might also like</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {productData.relatedProducts.map((product) => (
              <TouchableOpacity key={product.id} style={styles.relatedProduct}>
                <Image source={{ uri: product.image }} style={styles.relatedImage} />
                <Text style={styles.relatedName}>{product.name}</Text>
                <Text style={styles.relatedPrice}>${product.price.toFixed(2)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View> 
      </ScrollView>

      <View style={styles.actionBar}>
        <Button 
            icon="cart"
            label="Add to Card"
            onPress = {() => {}}
            style = {{width: '100%'}}
        /> 
      </View>
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
  imageContainer: {
    position: 'relative',
    backgroundColor: Colors.neutral0,
  },
  productImage: {
    width: width,
    height: 300,
    resizeMode: 'cover',
  },
  imageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  productInfo: {
    backgroundColor: Colors.neutral0,
    padding: 16,
    marginBottom: 8,
  },
  brandName: {
    fontSize: 14,
    color: Colors.neutral600,
    marginBottom: 4,
  },
  productName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral1000,
    marginBottom: 4,
  },
  sku: {
    fontSize: 12,
    color: Colors.neutral500,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 16,
    color: Colors.neutral500,
    textDecorationLine: 'line-through',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stockText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 8,
  },
  quantityButton: {
    padding: 12,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
    paddingHorizontal: 16,
  },
  tabsContainer: {
    backgroundColor: Colors.neutral0,
    marginBottom: 8,
  },
  tabsHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabContent: {
    padding: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.neutral800,
    marginBottom: 16,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: Colors.neutral800,
    marginLeft: 8,
    flex: 1,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral100,
  },
  specLabel: {
    fontSize: 14,
    color: Colors.neutral600,
    fontWeight: '500',
  },
  specValue: {
    fontSize: 14,
    color: Colors.neutral1000,
    fontWeight: '600',
  },
  compatibilityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 12,
  },
  compatibilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  compatibilityText: {
    fontSize: 14,
    color: Colors.neutral800,
    marginLeft: 8,
  },
  relatedSection: {
    backgroundColor: Colors.neutral0,
    padding: 16,
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 16,
  },
  relatedProduct: {
    width: 120,
    marginRight: 12,
  },
  relatedImage: {
    width: 120,
    height: 90,
    borderRadius: 8,
    marginBottom: 8,
  },
  relatedName: {
    fontSize: 12,
    color: Colors.neutral800,
    marginBottom: 4,
  },
  relatedPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  actionBar: {
    padding: 16,
    backgroundColor: Colors.neutral0,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
    gap: 12,
    marginBottom: 15
  },
});

export default ProductDetailsScreen;