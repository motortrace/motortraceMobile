import React, { useState, useEffect, useCallback } from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView} from "react-native"
import Icon from 'react-native-vector-icons/Ionicons'
import Colors from "../../constants/colors"
import ServiceCard from "../../components/ServiceCard"
import Button from '../../components/Button'
import Header from '../../components/Header'
import SearchBar from '../../components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingComponent from '../../components/Loading';
import CustomAlert from '../../components/Alert';

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  estimatedHours: number;
  hourlyRate: number;
  isActive: boolean;
}

interface AllServicesScreenProps {
  onBack?: () => void,
  onScheduleAppointment?: () => void
}

const AllServicesScreen: React.FC<AllServicesScreenProps> = ({ onBack: _onBack, onScheduleAppointment: _onScheduleAppointment }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
    title: '',
    message: '',
    buttonType: 'single' as 'none' | 'single' | 'double' | 'triple',
    confirmText: 'OK',
    onConfirm: () => {},
  });

  const showAlert = useCallback((config: typeof alertConfig) => {
    setAlertConfig(config);
    setAlertVisible(true);
  }, []);

  const hideAlert = useCallback(() => {
    setAlertVisible(false);
    // Execute the onConfirm action after hiding
    setTimeout(() => {
      alertConfig.onConfirm();
    }, 100);
  }, [alertConfig]);

  // Map category to icon
  const getCategoryIcon = (category: string): string => {
    const iconMap: { [key: string]: string } = {
      'Engine': 'speedometer-outline',
      'Brake': 'car-sport-outline',
      'Electrical': 'battery-charging-outline',
      'Transmission': 'swap-horizontal-outline',
      'AC': 'snow-outline',
      'Oil': 'construct-outline',
      'Tire': 'swap-horizontal-outline',
      'General': 'settings-outline',
    };
    return iconMap[category] || 'construct-outline';
  };

  // Fetch services from labor catalog
  const fetchServices = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Fetching services from labor catalog...');
      
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('❌ No token found');
        setIsLoading(false);
        return;
      }

      const response = await fetch('http://10.0.2.2:3000/labor/catalog?isActive=true', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📥 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📥 Services data received:', data);

      if (data.success && data.data) {
        const servicesData: Service[] = data.data.map((service: any) => ({
          id: service.id,
          name: service.name,
          description: service.description || `Professional ${service.name.toLowerCase()} service`,
          icon: getCategoryIcon(service.category),
          category: service.category,
          estimatedHours: service.estimatedHours || 1,
          hourlyRate: service.hourlyRate || 50,
          isActive: service.isActive,
        }));

        setServices(servicesData);
        setFilteredServices(servicesData);
        console.log('✅ Services updated:', servicesData.length, 'services loaded');
      }
    } catch (error: unknown) {
      console.error('❌ Failed to fetch services:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load Services, Please try again later.';
      showAlert({
        type: 'error',
        title: 'Loading Services Failed',
        message: errorMessage,
        buttonType: 'none',
        confirmText: 'OK',
        onConfirm: () => {}
      });
    } finally {
      setIsLoading(false);
    }
  }, [showAlert]);

  // Filter services based on search query
  const filterServices = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredServices(services);
    } else {
      const filtered = services.filter(service =>
        service.name.toLowerCase().includes(query.toLowerCase()) ||
        service.description.toLowerCase().includes(query.toLowerCase()) ||
        service.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredServices(filtered);
    }
  };

  // Handle schedule appointment button press
  const handleScheduleAppointment = () => {
    if (_onScheduleAppointment) {
      _onScheduleAppointment();
    } else {
      // Default behavior - navigate to appointment scheduling
      navigation.navigate('Appointment');
    }
  };

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Icon name="chevron-back" size={30} color={Colors.neutral0} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Our Services</Text>
        <View style={styles.placeholder} />
      </View> */}

      <Header
        icon="back"
        onIconPress={() => navigation.navigate('GarageServices')}
      />
      <SearchBar
        containerStyle={styles.searchBarContainer}
        placeholder="Search services..."
        onChangeText={filterServices}
        value={searchQuery}
      />

      {/* Services List */}
      <ScrollView style={styles.servicesContainer} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <LoadingComponent 
            textStyle={styles.loadingText}
            size="medium"
            loadingText="Loading services"
            containerStyle={styles.loadingContainer}
          />
        ) : filteredServices.length > 0 ? (
          <View style={styles.servicesList}>
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                icon={service.icon}
                title={service.name}
                description={service.description}
                onPress={() => navigation.navigate('ServiceDetails', { serviceId: service.id })}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="construct-outline" size={64} color={Colors.neutral400} />
            <Text style={styles.emptyTitle}>No Services Found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Try adjusting your search terms' : 'No services are currently available'}
            </Text>
          </View>
        )}
        <View style={styles.bottomSpacing} />
      </ScrollView>
      <View style={styles.scheduleContainer}>
        <Button label="Schedule Appointment" onPress={handleScheduleAppointment} />
      </View>

      <CustomAlert
        visible={alertVisible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        buttonType={alertConfig.buttonType}
        confirmText={alertConfig.confirmText}
        onClose={hideAlert}
      />

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primarybg,
  },
  placeholder: {
    width: 30,
  },
  searchBarContainer: {
    marginTop: 10,
    marginBottom: -10,
  },
  servicesContainer: {
    flex: 1,
  },
  servicesList: {
    padding: 16,
  },
  bottomSpacing: {
    height: 20,
  },
  scheduleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.neutral800,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.neutral500,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.neutral500,
    marginTop: 10,
  },
})

export default AllServicesScreen