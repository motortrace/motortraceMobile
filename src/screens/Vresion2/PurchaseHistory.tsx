import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
import BottomNavigation from '../../components/BottomNav';
import Colors from '../../constants/colors';
import OrderItem from '../../components/OrderItem';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';

const { width: screenWidth } = Dimensions.get('window');

// Order Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return Colors.success;
      case 'shipped': return Colors.primary;
      case 'processing': return Colors.warning;
      case 'cancelled': return Colors.error;
      default: return Colors.neutral600;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'shipped': return 'Shipped';
      case 'processing': return 'Processing';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  return (
    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) + '15' }]}>
      <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
        {getStatusText(status)}
      </Text>
    </View>
  );
};

// Filter Tabs Component
const FilterTabs = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'All Orders' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'processing', label: 'Processing' },
  ];

  return (
    <View style={styles.filterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterTab,
              activeFilter === filter.id && styles.activeFilterTab
            ]}
            onPress={() => onFilterChange(filter.id)}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === filter.id && styles.activeFilterTabText
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Empty State Component
const EmptyState = ({ filter }) => (
  <View style={styles.emptyState}>
    <Icon name="receipt-outline" size={64} color={Colors.neutral400} />
    <Text style={styles.emptyStateTitle}>No Orders Found</Text>
    <Text style={styles.emptyStateText}>
      {filter === 'all' 
        ? "You haven't made any purchases yet"
        : `No ${filter} orders found`
      }
    </Text>
  </View>
);

// Ongoing Deliveries Component
const OngoingDeliveriesSection = ({ deliveries, onTrackDelivery }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Ongoing Deliveries</Text>
    </View>
    
    {deliveries.length === 0 ? (
      <View style={styles.noDeliveriesState}>
        <Icon name="cube-outline" size={32} color={Colors.neutral400} />
        <Text style={styles.noDeliveriesText}>No ongoing deliveries</Text>
      </View>
    ) : (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.deliveriesContainer}>
          {deliveries.map((delivery) => (
            <TouchableOpacity
              key={delivery.id}
              style={styles.deliveryCard}
            >
              <View style={styles.deliveryHeader}>
                <View style={styles.deliveryStatus}>
                  <View style={[styles.statusDot, { backgroundColor: delivery.statusColor }]} />
                  <Text style={styles.deliveryStatusText}>{delivery.statusText}</Text>
                </View>
                <Text style={styles.deliveryETA}>{delivery.eta}</Text>
              </View>
              
              <Text style={styles.deliveryOrderNumber}>#{delivery.orderNumber}</Text>
              <Text style={styles.deliveryVehicle}>
                {delivery.vehicle.year} {delivery.vehicle.make} {delivery.vehicle.model}
              </Text>
              
              <View style={styles.deliveryProgress}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${delivery.progress}%`, backgroundColor: delivery.statusColor }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>{delivery.progress}%</Text>
              </View>
              
              <View style={styles.deliveryItems}>
                <Text style={styles.deliveryItemsText}>
                  {delivery.itemCount} item{delivery.itemCount !== 1 ? 's' : ''} • ${delivery.total}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    )}
  </View>
);

// Main Purchase History Screen Component
const PurchaseHistoryScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState(1);
  const [activeFilter, setActiveFilter] = useState('all');

  // Mock ongoing deliveries data
  const ongoingDeliveries = [
    {
      id: 'del1',
      orderNumber: 'AUT-2024-001238',
      statusText: 'Out for Delivery',
      statusColor: Colors.primary,
      eta: 'Today 3-5 PM',
      progress: 85,
      vehicle: {
        year: 2020,
        make: 'Toyota',
        model: 'Camry'
      },
      itemCount: 2,
      total: 145.98,
      trackingNumber: 'TRK888999000'
    },
    {
      id: 'del2',
      orderNumber: 'AUT-2024-001239',
      statusText: 'In Transit',
      statusColor: Colors.warning,
      eta: 'Tomorrow',
      progress: 60,
      vehicle: {
        year: 2018,
        make: 'Honda',
        model: 'Civic'
      },
      itemCount: 1,
      total: 89.99,
      trackingNumber: 'TRK111222333'
    },
    {
      id: 'del3',
      orderNumber: 'AUT-2024-001240',
      statusText: 'Shipped',
      statusColor: Colors.info || Colors.primary,
      eta: 'Dec 28',
      progress: 25,
      vehicle: {
        year: 2019,
        make: 'Ford',
        model: 'F-150'
      },
      itemCount: 3,
      total: 234.97,
      trackingNumber: 'TRK444555666'
    }
  ];

  // Mock purchase history data
  const purchaseHistory = [
    {
      id: 1,
      orderNumber: 'AUT-2024-001234',
      date: 'Dec 15, 2024',
      time: '2:30 PM',
      status: 'delivered',
      vehicle: {
        year: 2020,
        make: 'Toyota',
        model: 'Camry',
        color: 'Silver'
      },
      products: [
        {
          name: 'Premium Brake Pads',
          brand: 'AutoPro',
          price: 89.99,
          quantity: 1
        },
        {
          name: 'Brake Fluid DOT 4',
          brand: 'Castrol',
          price: 24.99,
          quantity: 2
        }
      ],
      total: 139.97,
      trackingNumber: 'TRK123456789'
    },
    {
      id: 2,
      orderNumber: 'AUT-2024-001235',
      date: 'Dec 18, 2024',
      time: '10:15 AM',
      status: 'shipped',
      vehicle: {
        year: 2018,
        make: 'Honda',
        model: 'Civic',
        color: 'Blue'
      },
      products: [
        {
          name: 'LED Headlight Kit',
          brand: 'BrightBeam',
          price: 149.99,
          quantity: 1
        }
      ],
      total: 149.99,
      trackingNumber: 'TRK987654321'
    },
    {
      id: 3,
      orderNumber: 'AUT-2024-001236',
      date: 'Dec 20, 2024',
      time: '4:45 PM',
      status: 'processing',
      vehicle: {
        year: 2020,
        make: 'Toyota',
        model: 'Camry',
        color: 'Silver'
      },
      products: [
        {
          name: 'Performance Air Filter',
          brand: 'FlowMax',
          price: 34.99,
          quantity: 1
        },
        {
          name: 'Oil Filter',
          brand: 'OEM Toyota',
          price: 12.99,
          quantity: 2
        }
      ],
      total: 60.97
    },
    {
      id: 4,
      orderNumber: 'AUT-2024-001237',
      date: 'Dec 22, 2024',
      time: '11:20 AM',
      status: 'delivered',
      vehicle: {
        year: 2019,
        make: 'Ford',
        model: 'F-150',
        color: 'Black'
      },
      products: [
        {
          name: 'Complete Brake Kit',
          brand: 'BrakeMax',
          price: 199.99,
          quantity: 1
        },
        {
          name: 'Premium Wiper Blades',
          brand: 'ClearView',
          price: 24.99,
          quantity: 1
        }
      ],
      total: 224.98,
      trackingNumber: 'TRK555666777'
    }
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

  const filteredOrders = activeFilter === 'all' 
    ? purchaseHistory 
    : purchaseHistory.filter(order => order.status === activeFilter);

  const handleTrackDelivery = (delivery) => {
    console.log('Track delivery:', delivery);
  };

  const handleReorder = (order) => {
    console.log('Reorder:', order);
  };

  const handleViewDetails = (order) => {
    console.log('View details:', order);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon="back"
        name="John Doe"
        image=""
        onIconPress={() => navigation.navigate('Home')}
      />

      <OngoingDeliveriesSection 
        deliveries={ongoingDeliveries}
        onTrackDelivery={handleTrackDelivery}
      />

      <FilterTabs 
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {filteredOrders.length === 0 ? (
          <EmptyState filter={activeFilter} />
        ) : (
          filteredOrders.map((order) => (
            <OrderItem
              key={order.id}
              item={order}
              onReorder={handleReorder}
              onViewDetails={handleViewDetails}
            />
          ))
        )}
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
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: Colors.neutral0,
    marginBottom: 8,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  noDeliveriesState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noDeliveriesText: {
    fontSize: 14,
    color: Colors.neutral600,
    marginTop: 8,
  },
  deliveriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  deliveryCard: {
    backgroundColor: Colors.neutral50,
    borderRadius: 12,
    padding: 16,
    width: screenWidth * 0.7,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deliveryStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  deliveryStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  deliveryETA: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  deliveryOrderNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 4,
  },
  deliveryVehicle: {
    fontSize: 12,
    color: Colors.neutral600,
    marginBottom: 12,
  },
  deliveryProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.neutral200,
    borderRadius: 2,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: Colors.neutral600,
    fontWeight: '500',
  },
  deliveryItems: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  deliveryItemsText: {
    fontSize: 12,
    color: Colors.neutral600,
  },
  titleSection: {
    padding: 20,
    backgroundColor: Colors.neutral0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral1000,
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 16,
    color: Colors.neutral600,
  },
  filterContainer: {
    backgroundColor: Colors.neutral0,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: Colors.neutral100,
  },
  activeFilterTab: {
    backgroundColor: Colors.primary,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral600,
  },
  activeFilterTabText: {
    color: Colors.neutral0,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.neutral600,
    textAlign: 'center',
  },
});

export default PurchaseHistoryScreen;