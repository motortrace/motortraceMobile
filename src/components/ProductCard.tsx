import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';

interface Product {
  id: string;
  name: string;
  brand: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
  onProductPress: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onProductPress,
  onAddToCart,
}) => {
  return (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => onProductPress(product)}
    >
      <View style={styles.productImageContainer}>
        <View style={styles.productImage}>
          <Icon name="cube" size={40} color={Colors.neutral600} />
        </View>
        {!product.inStock && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productBrand}>{product.brand}</Text>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.productRating}>
          <Icon name="star" size={12} color={Colors.warning} />
          <Text style={styles.ratingText}>{product.rating}</Text>
          <Text style={styles.reviewText}>({product.reviews})</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>${product.price}</Text>
          {product.originalPrice && (
            <Text style={styles.originalPrice}>${product.originalPrice}</Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.addToCartButton,
            !product.inStock && styles.addToCartButtonDisabled,
          ]}
          onPress={() => product.inStock && onAddToCart(product)}
          disabled={!product.inStock}
        >
          <Text
            style={[
              styles.addToCartText,
              !product.inStock && styles.addToCartTextDisabled,
            ]}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: Colors.neutral0,
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    width: 185,
  },
  productImageContainer: {
    position: 'relative',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neutral100,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.neutral200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.danger,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  outOfStockText: {
    color: Colors.neutral0,
    fontSize: 10,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 16,
  },
  productBrand: {
    fontSize: 12,
    color: Colors.neutral500,
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 8,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: Colors.neutral800,
  },
  reviewText: {
    marginLeft: 4,
    fontSize: 12,
    color: Colors.neutral500,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  originalPrice: {
    fontSize: 14,
    color: Colors.neutral400,
    marginLeft: 8,
    textDecorationLine: 'line-through',
  },
  addToCartButton: {
    backgroundColor: Colors.primary,
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  addToCartButtonDisabled: {
    backgroundColor: Colors.neutral300,
  },
  addToCartText: {
    color: Colors.neutral0,
    fontSize: 14,
    fontWeight: '600',
  },
  addToCartTextDisabled: {
    color: Colors.neutral500,
  },
});

export default ProductCard;
