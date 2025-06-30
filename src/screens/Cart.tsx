import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import Colors from '../constants/colors';
import Button from '../components/Button';
import BorderButton from '../components/BorderButton';

const initialCartData = {
  items: [
    {
      id: 1,
      name: 'Premium Oil Filter',
      brand: 'AutoMax',
      price: 29.99,
      originalPrice: 34.99,
      quantity: 2,
      sku: 'OF-2024-001',
      inStock: true,
      stockCount: 15,
      imageUrl: '',
      seller: 'AutoMax Store',
      discount: 14
    },
    {
      id: 2,
      name: 'Synthetic Motor Oil 5W-30',
      brand: 'TechLube',
      price: 45.99,
      originalPrice: null,
      quantity: 1,
      sku: 'MO-5W30-001',
      inStock: true,
      stockCount: 8,
      imageUrl: '',
      seller: 'TechLube Official',
      discount: 0
    },
    {
      id: 3,
      name: 'Air Filter Performance',
      brand: 'FlowMax',
      price: 24.99,
      originalPrice: 29.99,
      quantity: 1,
      sku: 'AF-PERF-001',
      inStock: false,
      stockCount: 0,
      imageUrl: '',
      seller: 'FlowMax Direct',
      discount: 17
    }
  ],
  promoCode: '',
  promoDiscount: 0,
  shippingFee: 8.00,
  freeShippingThreshold: 75.00
};

const ShoppingCartScreen = () => {
  const [cartData, setCartData] = useState(initialCartData);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [isPromoExpanded, setIsPromoExpanded] = useState(false);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }

    setCartData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.min(newQuantity, item.stockCount) }
          : item
      )
    }));
  };

  const handleRemoveItem = (itemId) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setCartData(prev => ({
              ...prev,
              items: prev.items.filter(item => item.id !== itemId)
            }));
          }
        }
      ]
    );
  };

  const handleApplyPromo = () => {
    // Mock promo code validation
    const validPromoCodes = {
      'SAVE10': 10,
      'WELCOME15': 15,
      'NEWUSER20': 20
    };

    const discount = validPromoCodes[promoCodeInput.toUpperCase()];
    if (discount) {
      setCartData(prev => ({
        ...prev,
        promoCode: promoCodeInput.toUpperCase(),
        promoDiscount: discount
      }));
      setPromoCodeInput('');
      setIsPromoExpanded(false);
      Alert.alert('Success', `Promo code applied! ${discount}% discount added.`);
    } else {
      Alert.alert('Invalid Code', 'Please enter a valid promo code.');
    }
  };

  const handleRemovePromo = () => {
    setCartData(prev => ({
      ...prev,
      promoCode: '',
      promoDiscount: 0
    }));
  };

  const handleContinueShopping = () => {
    Alert.alert('Continue Shopping', 'Navigating back to store...');
  };

  const handleCheckout = () => {
    if (cartData.items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before checkout.');
      return;
    }

    const outOfStockItems = cartData.items.filter(item => !item.inStock);
    if (outOfStockItems.length > 0) {
      Alert.alert('Out of Stock', 'Please remove out of stock items before checkout.');
      return;
    }

    Alert.alert('Checkout', 'Proceeding to checkout...');
  };

  const handleSaveForLater = (itemId) => {
    Alert.alert('Saved', 'Item moved to saved for later.');
    handleRemoveItem(itemId);
  };

  // Calculations
  const subtotal = cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const promoDiscountAmount = (subtotal * cartData.promoDiscount) / 100;
  const discountedSubtotal = subtotal - promoDiscountAmount;
  const isFreeShipping = discountedSubtotal >= cartData.freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : cartData.shippingFee;
  const tax = (discountedSubtotal + shippingFee) * 0.08; // 8% tax
  const total = discountedSubtotal + shippingFee + tax;
  const savings = cartData.items.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + ((item.originalPrice - item.price) * item.quantity);
    }
    return sum;
  }, 0) + promoDiscountAmount;

  if (cartData.items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          icon="back"
          name="Shopping Cart"
          image=""
          onIconPress={() => console.log('Back Pressed')}
        />
        
        <View style={styles.emptyCartContainer}>
          <Icon name="bag-outline" size={80} color={Colors.neutral400} />
          <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
          <Text style={styles.emptyCartSubtitle}>
            Discover amazing products and add them to your cart
          </Text>
          <Button
            label="Start Shopping"
            onPress={handleContinueShopping}
            style={styles.startShoppingButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon="back"
        name="Shopping Cart"
        image=""
        onIconPress={() => console.log('Back Pressed')}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cart Summary Header */}
        <View style={styles.section}>
          <Text style={styles.cartSummary}>
            {cartData.items.length} item{cartData.items.length !== 1 ? 's' : ''} in your cart
          </Text>
          {savings > 0 && (
            <Text style={styles.savingsText}>
              You're saving ${savings.toFixed(2)}!
            </Text>
          )}
        </View>

        {/* Free Shipping Progress */}
        {!isFreeShipping && (
          <View style={styles.section}>
            <View style={styles.freeShippingContainer}>
              <Icon name="car-outline" size={20} color={Colors.primary} />
              <View style={styles.freeShippingContent}>
                <Text style={styles.freeShippingText}>
                  Add ${(cartData.freeShippingThreshold - discountedSubtotal).toFixed(2)} more for free shipping
                </Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${Math.min((discountedSubtotal / cartData.freeShippingThreshold) * 100, 100)}%` }
                    ]} 
                  />
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Cart Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>
          {cartData.items.map((item, index) => (
            <View key={item.id} style={[styles.cartItem, !item.inStock && styles.outOfStockItem]}>
              <View style={styles.itemImage}>
                <Icon name="cube-outline" size={24} color={Colors.neutral600} />
              </View>
              
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemBrand}>{item.brand}</Text>
                <Text style={styles.itemSeller}>Sold by {item.seller}</Text>
                
                {!item.inStock ? (
                  <Text style={styles.outOfStockText}>Out of Stock</Text>
                ) : (
                  <Text style={styles.stockText}>
                    {item.stockCount < 5 ? `Only ${item.stockCount} left` : 'In Stock'}
                  </Text>
                )}
                
                <View style={styles.priceContainer}>
                  <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                  {item.originalPrice && (
                    <>
                      <Text style={styles.originalPrice}>${item.originalPrice.toFixed(2)}</Text>
                      <Text style={styles.discountBadge}>{item.discount}% off</Text>
                    </>
                  )}
                </View>
              </View>
              
              <View style={styles.itemActions}>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={!item.inStock}
                  >
                    <Icon name="remove" size={16} color={item.inStock ? Colors.neutral600 : Colors.neutral400} />
                  </TouchableOpacity>
                  
                  <Text style={[styles.quantityText, !item.inStock && styles.disabledText]}>
                    {item.quantity}
                  </Text>
                  
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={!item.inStock || item.quantity >= item.stockCount}
                  >
                    <Icon 
                      name="add" 
                      size={16} 
                      color={
                        item.inStock && item.quantity < item.stockCount 
                          ? Colors.neutral600 
                          : Colors.neutral400
                      } 
                    />
                  </TouchableOpacity>
                </View>
                
                <Text style={[styles.itemTotal, !item.inStock && styles.disabledText]}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
                
                <View style={styles.itemActionButtons}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleSaveForLater(item.id)}
                  >
                    <Icon name="bookmark-outline" size={16} color={Colors.neutral600} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleRemoveItem(item.id)}
                  >
                    <Icon name="trash-outline" size={16} color={Colors.warning} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Promo Code Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.promoHeader}
            onPress={() => setIsPromoExpanded(!isPromoExpanded)}
          >
            <View style={styles.promoHeaderContent}>
              <Icon name="pricetag-outline" size={20} color={Colors.primary} />
              <Text style={styles.promoHeaderText}>
                {cartData.promoCode ? `Promo: ${cartData.promoCode}` : 'Add Promo Code'}
              </Text>
            </View>
            <Icon
              name={isPromoExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={Colors.neutral600}
            />
          </TouchableOpacity>

          {isPromoExpanded && (
            <View style={styles.promoContent}>
              <View style={styles.promoInputContainer}>
                <TextInput
                  style={styles.promoInput}
                  placeholder="Enter promo code"
                  value={promoCodeInput}
                  onChangeText={setPromoCodeInput}
                  autoCapitalize="characters"
                />
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={handleApplyPromo}
                  disabled={!promoCodeInput.trim()}
                >
                  <Text style={[
                    styles.applyButtonText,
                    !promoCodeInput.trim() && styles.disabledText
                  ]}>
                    Apply
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {cartData.promoCode && (
            <View style={styles.appliedPromoContainer}>
              <View style={styles.appliedPromoContent}>
                <Icon name="checkmark-circle" size={16} color={Colors.success} />
                <Text style={styles.appliedPromoText}>
                  {cartData.promoCode} applied (-{cartData.promoDiscount}%)
                </Text>
              </View>
              <TouchableOpacity onPress={handleRemovePromo}>
                <Icon name="close" size={16} color={Colors.neutral600} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
          
          {promoDiscountAmount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Promo Discount</Text>
              <Text style={[styles.summaryValue, styles.discountValue]}>
                -${promoDiscountAmount.toFixed(2)}
              </Text>
            </View>
          )}
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>
              {isFreeShipping ? (
                <Text style={styles.freeText}>Free</Text>
              ) : (
                `$${shippingFee.toFixed(2)}`
              )}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
          </View>
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <BorderButton
          label="Continue Shopping"
          onPress={handleContinueShopping}
          style={styles.continueButton}
          textStyle={styles.continueButtonText}
          icon="storefront-outline"
        />
        
        <Button
          label={`Checkout • $${total.toFixed(2)}`}
          onPress={handleCheckout}
          style={styles.checkoutButton}
          disabled={cartData.items.some(item => !item.inStock)}
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
  section: {
    backgroundColor: Colors.neutral0,
    marginBottom: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 12,
  },
  cartSummary: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 4,
  },
  savingsText: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: '500',
  },
  freeShippingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.primary + '08',
    borderRadius: 8,
  },
  freeShippingContent: {
    flex: 1,
    marginLeft: 8,
  },
  freeShippingText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.neutral200,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  cartItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral100,
  },
  outOfStockItem: {
    opacity: 0.6,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.neutral100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 2,
  },
  itemBrand: {
    fontSize: 14,
    color: Colors.neutral600,
    marginBottom: 2,
  },
  itemSeller: {
    fontSize: 12,
    color: Colors.neutral500,
    marginBottom: 4,
  },
  stockText: {
    fontSize: 12,
    color: Colors.success,
    marginBottom: 4,
  },
  outOfStockText: {
    fontSize: 12,
    color: Colors.warning,
    fontWeight: '500',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: Colors.neutral500,
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  discountBadge: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '500',
    backgroundColor: Colors.success + '15',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  itemActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 6,
    marginBottom: 8,
  },
  quantityButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
    minWidth: 32,
    textAlign: 'center',
  },
  disabledText: {
    color: Colors.neutral400,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.neutral1000,
    marginBottom: 8,
  },
  itemActionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 6,
  },
  promoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promoHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoHeaderText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
    marginLeft: 8,
  },
  promoContent: {
    marginTop: 16,
  },
  promoInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  applyButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral0,
  },
  appliedPromoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    padding: 8,
    backgroundColor: Colors.success + '10',
    borderRadius: 6,
  },
  appliedPromoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appliedPromoText: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: '500',
    marginLeft: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: Colors.neutral600,
  },
  summaryValue: {
    fontSize: 16,
    color: Colors.neutral1000,
  },
  discountValue: {
    color: Colors.success,
  },
  freeText: {
    color: Colors.success,
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral1000,
  },
  actionContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.neutral0,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
    gap: 12,
    marginBottom: 15,
  },
  continueButton: {
    flex: 1,
  },
  continueButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  checkoutButton: {
    flex: 2,
  },
  emptyCartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyCartTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginTop: 24,
    marginBottom: 8,
  },
  emptyCartSubtitle: {
    fontSize: 16,
    color: Colors.neutral600,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  startShoppingButton: {
    paddingHorizontal: 32,
  },
});

export default ShoppingCartScreen;