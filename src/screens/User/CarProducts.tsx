import React, { useState, useEffect } from 'react'
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Colors from '../../constants/colors'
import Header from '../../components/Header'
import LoadingComponent from '../../components/Loading'
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CarProducts = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'engine' | 'brake' | 'electrical' | 'transmission' | 'suspension' | 'other'>('all')
  const [usedProducts, setUsedProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const filterOptions = [
    { key: 'all', label: 'All Parts', icon: 'list-outline' },
    { key: 'engine', label: 'Engine', icon: 'car-sport-outline' },
    { key: 'brake', label: 'Brake', icon: 'car-outline' },
    { key: 'electrical', label: 'Electrical', icon: 'flash-outline' },
    { key: 'transmission', label: 'Transmission', icon: 'settings-outline' },
    { key: 'suspension', label: 'Suspension', icon: 'barbell-outline' },
    { key: 'other', label: 'Other', icon: 'ellipsis-horizontal-outline' }
  ]

  const filteredProducts = usedProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.partNumber.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || product.category === selectedFilter
    return matchesSearch && matchesFilter
  })

  const totalValue = usedProducts.reduce((sum, product) => sum + (product.cost || 0), 0)
  const activeWarranties = usedProducts.filter(p => p.warrantyStatus === 'active').length
  const expiringWarranties = usedProducts.filter(p => p.warrantyStatus === 'expiring-soon').length

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatCurrency = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return '$0.00'
    }
    return `$${amount}`
  }

  const getWarrantyEndDate = (purchaseDate: string, warrantyPeriod: number) => {
    const purchase = new Date(purchaseDate)
    const endDate = new Date(purchase.setMonth(purchase.getMonth() + warrantyPeriod))
    return endDate
  }

  const getWarrantyStatusColor = (status: string) => {
    switch (status) {
      case 'active': return Colors.success || '#22C55E'
      case 'expiring-soon': return Colors.warning || '#F59E0B'
      case 'expired': return Colors.danger || '#EF4444'
      default: return Colors.neutral600
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return Colors.success || '#22C55E'
      case 'good': return Colors.primary || '#3B82F6'
      case 'fair': return Colors.warning || '#F59E0B'
      case 'poor': return Colors.danger || '#EF4444'
      default: return Colors.neutral600
    }
  }

  const getDaysUntilWarrantyExpiry = (purchaseDate: string, warrantyPeriod: number) => {
    const endDate = getWarrantyEndDate(purchaseDate, warrantyPeriod)
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Fetch parts/products from backend
  useEffect(() => {
    const fetchParts = async () => {
      // Mock data - fallback when backend is unavailable
      const mockUsedProducts = [
        {
          id: '1',
          icon: 'battery-charging-outline',
          name: 'AGM Battery',
          brand: 'Optima',
          partNumber: 'OPT-D35',
          purchaseDate: '2024-05-20',
          installationDate: '2024-05-20',
          warrantyPeriod: 36,
          warrantyStatus: 'active',
          cost: 180.00,
          supplier: 'AutoZone',
          category: 'electrical',
          condition: 'excellent',
          notes: 'High-performance battery for extreme weather'
        },
        {
          id: '2',
          icon: 'car-outline',
          name: 'Ceramic Brake Pads',
          brand: 'Brembo',
          partNumber: 'BRM-P85020',
          purchaseDate: '2024-06-05',
          installationDate: '2024-06-10',
          warrantyPeriod: 24,
          warrantyStatus: 'active',
          cost: 320.00,
          supplier: 'Brake Specialists',
          category: 'brake',
          condition: 'excellent'
        },
        {
          id: '3',
          icon: 'settings-outline',
          name: 'Transmission Filter',
          brand: 'OEM Toyota',
          partNumber: 'TOY-35330-0W040',
          purchaseDate: '2024-04-10',
          installationDate: '2024-04-10',
          warrantyPeriod: 12,
          warrantyStatus: 'active',
          cost: 45.00,
          supplier: 'Toyota Dealership',
          category: 'transmission',
          condition: 'good'
        },
        {
          id: '4',
          icon: 'car-sport-outline',
          name: 'Air Filter',
          brand: 'K&N',
          partNumber: 'KN-33-2364',
          purchaseDate: '2024-04-30',
          installationDate: '2024-04-30',
          warrantyPeriod: 60,
          warrantyStatus: 'active',
          cost: 55.00,
          supplier: 'Performance Parts Co.',
          category: 'engine',
          condition: 'excellent',
          notes: 'High-flow reusable air filter'
        },
        {
          id: '5',
          icon: 'flash-outline',
          name: 'Spark Plugs (Set of 4)',
          brand: 'NGK',
          partNumber: 'NGK-LZKAR6AP-11',
          purchaseDate: '2024-04-25',
          installationDate: '2024-04-30',
          warrantyPeriod: 24,
          warrantyStatus: 'active',
          cost: 80.00,
          supplier: 'Auto Parts Plus',
          category: 'engine',
          condition: 'excellent'
        },
        {
          id: '6',
          icon: 'thermometer-outline',
          name: 'Cabin Air Filter',
          brand: 'Fram',
          partNumber: 'FRM-CF10285',
          purchaseDate: '2024-05-15',
          installationDate: '2024-05-15',
          warrantyPeriod: 12,
          warrantyStatus: 'active',
          cost: 25.00,
          supplier: 'Walmart Auto Center',
          category: 'other',
          condition: 'good'
        },
        {
          id: '7',
          icon: 'car-outline',
          name: 'Brake Rotors (Front)',
          brand: 'Wagner',
          partNumber: 'WAG-BD125394',
          purchaseDate: '2023-08-15',
          installationDate: '2023-08-20',
          warrantyPeriod: 24,
          warrantyStatus: 'expiring-soon',
          cost: 150.00,
          supplier: 'NAPA Auto Parts',
          category: 'brake',
          condition: 'good'
        },
        {
          id: '8',
          icon: 'cog-outline',
          name: 'Alternator',
          brand: 'Bosch',
          partNumber: 'BSH-AL0834X',
          purchaseDate: '2022-12-10',
          installationDate: '2022-12-15',
          warrantyPeriod: 24,
          warrantyStatus: 'expired',
          cost: 250.00,
          supplier: 'Bosch Service Center',
          category: 'electrical',
          condition: 'fair',
          notes: 'Refurbished unit with limited warranty'
        }
      ];

      try {
        setIsLoading(true);
        const selectedCarId = await AsyncStorage.getItem('selectedCarId');
        if (!selectedCarId) {
          console.log('No car selected, using mock data');
          setUsedProducts(mockUsedProducts);
          return;
        }

        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.log('No token found, using mock data');
          setUsedProducts(mockUsedProducts);
          return;
        }

        console.log('Fetching parts for vehicle:', selectedCarId);

        // Fetch work orders for this vehicle to get parts used
        console.log('📡 Fetching work orders for vehicle:', selectedCarId);
        const res = await fetch(`http://10.0.2.2:3000/work-orders?vehicleId=${selectedCarId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Client-Type': 'mobile',
          },
        });

        const data = await res.json();
        console.log('📡 Work orders response:', data);

        if (res.ok && data.data && Array.isArray(data.data)) {
          console.log('✅ Found', data.data.length, 'work orders');
          // Get all parts from work orders
          const allParts: any[] = [];

          for (const workOrder of data.data) {
            console.log('📡 Fetching parts for work order:', workOrder.id);
            // Fetch parts for each work order - Note: This endpoint doesn't exist in the backend
            // The backend doesn't have a /work-orders/:id/parts endpoint
            // We need to get parts from the work order include or find another way
            console.log('⚠️ Parts endpoint /work-orders/${workOrder.id}/parts does not exist in backend');
            console.log('📡 Work order data structure:', workOrder);

            // Check if parts are included in the work order response
            if (workOrder.partsUsed && Array.isArray(workOrder.partsUsed)) {
              console.log('✅ Found parts in work order include:', workOrder.partsUsed.length);
              // Transform parts data into product format
              const transformedParts = workOrder.partsUsed.map((part: any) => ({
                id: part.id,
                icon: getPartIcon(part.part?.category || 'other'),
                name: part.part?.name || 'Unknown Part',
                brand: part.part?.manufacturer || 'Unknown Brand',
                partNumber: part.part?.partNumber || part.part?.sku || 'N/A',
                purchaseDate: part.createdAt ? new Date(part.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                installationDate: part.installedAt ? new Date(part.installedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                warrantyPeriod: 12, // Default warranty period
                warrantyStatus: 'active',
                cost: part.unitPrice || 0,
                supplier: part.supplierName || 'Unknown Supplier',
                category: getPartCategory(part.part?.category || 'other'),
                condition: 'excellent',
                notes: part.notes || '',
              }));
              allParts.push(...transformedParts);
            } else {
              console.log('⚠️ No parts found in work order', workOrder.id);
            }
          }

          console.log('✅ Total parts collected:', allParts.length);
          setUsedProducts(allParts.length > 0 ? allParts : mockUsedProducts);
        } else {
          console.error('❌ Failed to fetch work orders:', data);
          setUsedProducts(mockUsedProducts);
        }
      } catch (err) {
        console.error('Error fetching parts:', err);
        setUsedProducts(mockUsedProducts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParts();
  }, []);

  // Helper function to get part icon based on category
  const getPartIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'engine': return 'car-sport-outline';
      case 'brake': return 'car-outline';
      case 'electrical': return 'flash-outline';
      case 'transmission': return 'settings-outline';
      case 'suspension': return 'barbell-outline';
      case 'battery': return 'battery-charging-outline';
      case 'filter': return 'thermometer-outline';
      default: return 'cube-outline';
    }
  };

  // Helper function to get part category
  const getPartCategory = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'engine': return 'engine';
      case 'brake': return 'brake';
      case 'electrical': return 'electrical';
      case 'transmission': return 'transmission';
      case 'suspension': return 'suspension';
      default: return 'other';
    }
  };

  // Show loading component while fetching parts
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.neutral0} />
        
        <Header
          icon='back'
          name='Used Parts & Products'
        />
        
        <LoadingComponent 
          loadingText="Loading parts..." 
          size="medium"
          containerStyle={styles.loadingContainer}
          textStyle={styles.loadingText}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.neutral0} />
      
      <Header
        icon='back'
        name='Used Parts & Products'
      />

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{usedProducts.length}</Text>
          <Text style={styles.statLabel}>Total Parts</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{activeWarranties}</Text>
          <Text style={styles.statLabel}>Warranties</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{formatCurrency(Number(totalValue))}</Text>
          <Text style={styles.statLabel}>Total Value</Text>
        </View>
      </View>

      {/* Alert for expiring warranties */}
      {expiringWarranties > 0 && (
        <View style={styles.alertContainer}>
          <Icon name="warning-outline" size={20} color={Colors.warning} />
          <Text style={styles.alertText}>
            {expiringWarranties} warranty{expiringWarranties > 1 ? 'ies' : 'y'} expiring soon
          </Text>
        </View>
      )}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={Colors.neutral400} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search parts by name, brand, or part number..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={Colors.neutral400}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Icon name="close-circle" size={20} color={Colors.neutral400} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.filterTab,
              selectedFilter === option.key && styles.filterTabActive
            ]}
            onPress={() => setSelectedFilter(option.key as any)}
          >
            <Icon 
              name={option.icon} 
              size={16} 
              color={selectedFilter === option.key ? Colors.primary : Colors.neutral600} 
            />
            <Text style={[
              styles.filterTabText,
              selectedFilter === option.key && styles.filterTabTextActive
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products List */}
      <ScrollView style={styles.productsContainer} showsVerticalScrollIndicator={false}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const warrantyDays = getDaysUntilWarrantyExpiry(product.purchaseDate, product.warrantyPeriod)
            const warrantyEndDate = getWarrantyEndDate(product.purchaseDate, product.warrantyPeriod)
            
            return (
              <View key={product.id} style={styles.productCard}>
                <View style={styles.productHeader}>
                  <View style={styles.iconContainer}>
                    <Icon name={product.icon} size={24} color={Colors.neutral1000} />
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productBrand}>{product.brand} • {product.partNumber}</Text>
                  </View>
                  <Text style={styles.productCost}>{formatCurrency(product.cost)}</Text>
                </View>

                <View style={styles.productDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Purchased:</Text>
                    <Text style={styles.detailValue}>{formatDate(product.purchaseDate)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Installed:</Text>
                    <Text style={styles.detailValue}>{formatDate(product.installationDate)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Supplier:</Text>
                    <Text style={styles.detailValue}>{product.supplier}</Text>
                  </View>
                </View>

                <View style={styles.statusRow}>
                  <View style={styles.statusBadges}>
                    <View style={[styles.statusBadge, { backgroundColor: getWarrantyStatusColor(product.warrantyStatus) + '20' }]}>
                      <Text style={[styles.statusText, { color: getWarrantyStatusColor(product.warrantyStatus) }]}>
                        {product.warrantyStatus === 'active' ? 'WARRANTY ACTIVE' : 
                         product.warrantyStatus === 'expiring-soon' ? 'EXPIRING SOON' : 'WARRANTY EXPIRED'}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getConditionColor(product.condition) + '20' }]}>
                      <Text style={[styles.statusText, { color: getConditionColor(product.condition) }]}>
                        {product.condition.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.warrantyInfo}>
                  <Text style={styles.warrantyText}>
                    Warranty: {product.warrantyPeriod} months • 
                    Expires: {formatDate(warrantyEndDate.toISOString())}
                    {product.warrantyStatus === 'active' && warrantyDays > 0 && (
                      <Text style={styles.warrantyDays}> ({warrantyDays} days left)</Text>
                    )}
                  </Text>
                </View>

                {product.notes && (
                  <View style={styles.notesContainer}>
                    <Text style={styles.notesText}>{product.notes}</Text>
                  </View>
                )}
              </View>
            )
          })
        ) : (
          <View style={styles.emptyState}>
            <Icon name="cube-outline" size={48} color={Colors.neutral300} />
            <Text style={styles.emptyStateText}>No parts found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? 'Try adjusting your search terms' : 'No parts match the selected filter'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral50,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral100,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral900,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.neutral600,
    marginTop: 4,
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning + '20' || '#FEF3C7',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.warning + '40' || '#FDE68A',
  },
  alertText: {
    fontSize: 14,
    color: Colors.warning || '#F59E0B',
    marginLeft: 8,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.neutral900,
  },
  clearButton: {
    padding: 4,
  },
  filterContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.neutral0,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    marginRight: 8,
    height: 50,
    width: 150,
    justifyContent: 'center',
  },
  filterTabActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  filterTabText: {
    fontSize: 14,
    color: Colors.neutral600,
    marginLeft: 6,
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: Colors.primary,
  },
  productsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: -500,
    marginBottom: 20,
  },
  productCard: {
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.neutral100,
    shadowColor: Colors.neutral1000,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral900,
  },
  productBrand: {
    fontSize: 14,
    color: Colors.neutral600,
    marginTop: 2,
  },
  productCost: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.neutral900,
  },
  productDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.neutral600,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: Colors.neutral900,
  },
  statusRow: {
    marginBottom: 8,
  },
  statusBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  warrantyInfo: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral100,
  },
  warrantyText: {
    fontSize: 12,
    color: Colors.neutral600,
  },
  warrantyDays: {
    fontWeight: '600',
    color: Colors.primary,
  },
  notesContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: Colors.neutral50,
    borderRadius: 6,
  },
  notesText: {
    fontSize: 12,
    color: Colors.neutral700,
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral600,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.neutral400,
    marginTop: 8,
    textAlign: 'center',
  },
  // Loading state styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.neutral600,
    fontWeight: '500',
  },
})

export default CarProducts