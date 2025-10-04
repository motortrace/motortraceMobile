import React, { useCallback, useState, useEffect } from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView} from "react-native"
import Colors from "../../constants/colors"
import PackageCard from "../../components/PackageCard"
import Header from '../../components/Header'
import SearchBar from '../../components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '../../components/Alert';
import LoadingComponent from "../../components/Loading"
import Icon from 'react-native-vector-icons/Ionicons'
import AppointmentBottomSheet from '../../components/AppointmentSheet';
import Button from '../../components/Button';

interface Package {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  estimatedHours: number;
  hourlyRate: number;
  isActive: boolean;
  title?: string;  // Added for PackageCard compatibility
  services?: string[];  // Added for PackageCard compatibility
  price?: number;  // Added for PackageCard compatibility
}

interface AllPackagesScreenProps {
  onBack?: () => void,
  onScheduleAppointment?: () => void
}

const AllPackagesScreen: React.FC<AllPackagesScreenProps> = ({ onBack: _onBack, onScheduleAppointment: _onScheduleAppointment }) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [packages, setPackages] = useState<Package[]>([]);
    const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [appointmentSheetVisible, setAppointmentSheetVisible] = useState(false);

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
      type: 'info' as 'success' | 'error' | 'warning' | 'info',
      title: '',
      message: '',
      buttonType: 'single' as 'none' | 'single' | 'double' | 'triple',
      confirmText: 'OK',
      onConfirm: () => {},
    });
    
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

    const fetchPackages = useCallback(async () => {
      try {
        setIsLoading(true);
        console.log('🔍 Fetching packages from canned services...');
        
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.log('❌ No token found');
          setIsLoading(false);
          return;
        }

        const response = await fetch('http://10.0.2.2:3000/canned-services/available', {
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
        console.log('📥 Packages data received:', data);

        if (data.success && data.data) {
          const packagesData: Package[] = data.data.map((packageItem: any) => ({
            id: packageItem.id,
            name: packageItem.name,
            description: packageItem.description || `Professional ${packageItem.name.toLowerCase()} package`,
            icon: getCategoryIcon('General'), // Default icon since canned services don't have categories
            category: 'General', // Default category
            estimatedHours: packageItem.duration ? Math.ceil(packageItem.duration / 60) : 1, // Convert minutes to hours
            hourlyRate: packageItem.price ? Math.round(packageItem.price / (packageItem.duration ? packageItem.duration / 60 : 1)) : 50,
            isActive: packageItem.isAvailable,
            title: packageItem.name, // Use name as title
            services: [`${packageItem.name} Service`], // Create service array from name
            price: packageItem.price || 0,
          }));

          setPackages(packagesData);
          setFilteredPackages(packagesData);
          console.log('✅ Packages updated:', packagesData.length, 'packages loaded');
        }
      } catch (error) {
        console.error('❌ Failed to fetch packages:', error);
        showAlert({
          type: 'error',
          title: 'Loading Packages Failed',
          message: error instanceof Error ? error.message : 'Failed to load Packages, Please try again later.',
          buttonType: 'none',
          confirmText: 'OK',
          onConfirm: () => {}
        });
      } finally {
        setIsLoading(false);
      }
    }, [showAlert]);

    // Filter packages based on search query
    const filterPackages = (query: string) => {
      setSearchQuery(query);
      if (!query.trim()) {
        setFilteredPackages(packages);
      } else {
        const filtered = packages.filter(packageItem =>
          packageItem.name.toLowerCase().includes(query.toLowerCase()) ||
          packageItem.description.toLowerCase().includes(query.toLowerCase()) ||
          packageItem.category.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredPackages(filtered);
      }
    };

    // Handle schedule appointment button press
    const handleScheduleAppointment = () => {
      if (_onScheduleAppointment) {
        _onScheduleAppointment();
      } else {
        // Default behavior - open appointment sheet for general service
        setAppointmentSheetVisible(true);
      }
    };

    const handleAppointmentConfirm = useCallback((appointmentData: any) => {
      console.log('Appointment booked:', appointmentData);
      setAppointmentSheetVisible(false);
      showAlert({
        type: 'success',
        title: 'Appointment Booked',
        message: 'Your general service appointment has been successfully booked!',
        buttonType: 'single',
        confirmText: 'OK',
        onConfirm: () => {}
      });
    }, [showAlert]);

    useEffect(() => {
      fetchPackages();
    }, [fetchPackages]);

    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <Header
          onIconPress={() => navigation.goBack()}
        />
        <SearchBar
          containerStyle={styles.searchBarContainer}
          onChangeText={filterPackages}
          value={searchQuery}
          placeholder="Search packages..."
        />

        {/* Packages List */}
        <ScrollView style={styles.servicesContainer} showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <LoadingComponent 
              textStyle={styles.loadingText}
              size="medium"
              loadingText="Loading packages"
              containerStyle={styles.loadingContainer}
            />
          ) : filteredPackages.length > 0 ? (
            <View style={styles.servicesList}>
              {filteredPackages.map((pkg) => (
                <PackageCard
                  key={pkg.id} // Use unique id instead of index
                  title={pkg.title || pkg.name}
                  description={pkg.description}
                  services={pkg.services || []}
                  price={pkg.price || 0}
                  onPress={() => navigation.navigate('PackageDetails', { packageId: pkg.id })}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="construct-outline" size={64} color={Colors.neutral400} />
              <Text style={styles.emptyTitle}>No Packages Found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery ? 'Try adjusting your search terms' : 'No packages are currently available'}
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

        {/* Appointment Booking Sheet */}
        <AppointmentBottomSheet
          visible={appointmentSheetVisible}
          onClose={() => setAppointmentSheetVisible(false)}
          onConfirm={handleAppointmentConfirm}
          serviceName="General Service"
          servicePrice={0}
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

export default AllPackagesScreen