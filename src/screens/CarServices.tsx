import React, { useState } from 'react'
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
import ServiceCard from '../components/ServiceCard'
import Colors from '../constants/colors'
import Header from '../components/Header'

interface Service {
  id: string
  icon: string
  title: string
  description: string
  date: string
  cost: number
  status: 'completed' | 'pending' | 'in-progress'
  category: 'maintenance' | 'repair' | 'inspection' | 'upgrade'
}

interface CarServicesPageProps {
  carId: string
  carModel: string
  carYear: number
  licensePlate: string
  onNavigateBack?: () => void
}

const CarServicesPage: React.FC<CarServicesPageProps> = ({
  carId,
  carModel = "Toyota Camry",
  carYear = 2020,
  licensePlate = "ABC-1234",
  onNavigateBack
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'maintenance' | 'repair' | 'inspection' | 'upgrade'>('all')

  // Mock data - replace with actual API call
  const services: Service[] = [
    {
      id: '1',
      icon: 'build-outline',
      title: 'Oil Change & Filter',
      description: 'Full synthetic oil change with new filter. Next due: 15,000 km',
      date: '2024-06-15',
      cost: 85.00,
      status: 'completed',
      category: 'maintenance'
    },
    {
      id: '2',
      icon: 'car-outline',
      title: 'Brake Pad Replacement',
      description: 'Front brake pads replaced. Rotors inspected and cleaned',
      date: '2024-06-10',
      cost: 320.00,
      status: 'completed',
      category: 'repair'
    },
    {
      id: '3',
      icon: 'speedometer-outline',
      title: 'Annual Safety Inspection',
      description: 'Comprehensive safety inspection. Valid until June 2025',
      date: '2024-06-01',
      cost: 45.00,
      status: 'completed',
      category: 'inspection'
    },
    {
      id: '4',
      icon: 'battery-charging-outline',
      title: 'Battery Replacement',
      description: 'New AGM battery installed. 3-year warranty included',
      date: '2024-05-20',
      cost: 180.00,
      status: 'completed',
      category: 'repair'
    },
    {
      id: '5',
      icon: 'thermometer-outline',
      title: 'A/C System Service',
      description: 'A/C system recharged and leak tested. Cabin filter replaced',
      date: '2024-05-15',
      cost: 125.00,
      status: 'completed',
      category: 'maintenance'
    },
    {
      id: '6',
      icon: 'car-sport-outline',
      title: 'Performance Tune-Up',
      description: 'Spark plugs, air filter, and fuel system cleaning',
      date: '2024-04-30',
      cost: 280.00,
      status: 'completed',
      category: 'maintenance'
    },
    {
      id: '7',
      icon: 'checkmark-circle-outline',
      title: 'Scheduled Maintenance',
      description: 'Upcoming 60,000 km service appointment',
      date: '2024-07-15',
      cost: 450.00,
      status: 'pending',
      category: 'maintenance'
    },
    {
      id: '8',
      icon: 'settings-outline',
      title: 'Transmission Service',
      description: 'Transmission fluid change and filter replacement',
      date: '2024-04-10',
      cost: 195.00,
      status: 'completed',
      category: 'maintenance'
    }
  ]

  const filterOptions = [
    { key: 'all', label: 'All Services', icon: 'list-outline' },
    { key: 'maintenance', label: 'Maintenance', icon: 'build-outline' },
    { key: 'repair', label: 'Repairs', icon: 'hammer-outline' },
    { key: 'inspection', label: 'Inspections', icon: 'checkmark-circle-outline' },
    { key: 'upgrade', label: 'Upgrades', icon: 'trending-up-outline' }
  ]

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || service.category === selectedFilter
    return matchesSearch && matchesFilter
  })

  const totalCost = services
    .filter(service => service.status === 'completed')
    .reduce((sum, service) => sum + service.cost, 0)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`
  }

  const getStatusColor = (status: Service['status']) => {
    switch (status) {
      case 'completed': return Colors.success || '#22C55E'
      case 'pending': return Colors.warning || '#F59E0B'
      case 'in-progress': return Colors.primary || '#3B82F6'
      default: return Colors.neutral600
    }
  }

  const handleServicePress = (service: Service) => {
    // Navigate to service details page
    console.log('Navigate to service details:', service.id)
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.neutral0} />
      
      <Header 
        icon = 'back'
        image = ''
        name='Jhon Doe'
      />

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{services.filter(s => s.status === 'completed').length}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{services.filter(s => s.status === 'pending').length}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{formatCurrency(totalCost)}</Text>
          <Text style={styles.statLabel}>Total Spent</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={Colors.neutral400} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search services..."
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

      {/* Services List */}
      <ScrollView style={styles.servicesContainer} showsVerticalScrollIndicator={false}>
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <View key={service.id} style={styles.serviceWrapper}>
              <ServiceCard
                icon={service.icon}
                title={service.title}
                description={`${service.description} • ${formatDate(service.date)}`}
                onPress={() => handleServicePress(service)}
              />
              <View style={styles.serviceFooter}>
                <View style={styles.serviceDetails}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(service.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(service.status) }]}>
                      {service.status.replace('-', ' ').toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.costText}>{formatCurrency(service.cost)}</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Icon name="document-outline" size={48} color={Colors.neutral300} />
            <Text style={styles.emptyStateText}>No services found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? 'Try adjusting your search terms' : 'No services match the selected filter'}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.neutral0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral100,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral900,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.neutral600,
    marginTop: 2,
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
    height: 60,
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
  servicesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: -600,
    marginBottom: 20,
  },
  serviceWrapper: {
    marginBottom: 8,
  },
  serviceFooter: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  serviceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  costText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral900,
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
})

export default CarServicesPage