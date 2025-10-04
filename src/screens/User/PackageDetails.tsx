import React, { useState, useEffect, useCallback } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from "../../constants/colors";
import Button from '../../components/Button';
import Header from '../../components/Header';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomAlert from "../../components/Alert";
import LoadingComponent from "../../components/Loading";
import AppointmentBottomSheet from "../../components/AppointmentSheet";
import { useRoute } from '@react-navigation/native';

interface CannedServiceDetails {
  id: string;
  code: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
  laborOperations: Array<{
    id: string;
    sequence: number;
    notes?: string;
    labor: {
      id: string;
      code: string;
      name: string;
      description?: string;
      estimatedHours: number;
      hourlyRate: number;
      category?: string;
      isActive: boolean;
    };
  }>;
  partsCategories: Array<{
    id: string;
    isRequired: boolean;
    notes?: string;
    category: {
      id: string;
      name: string;
    };
  }>;
}

interface PackageDetailsScreenProps {
  onBookService?: () => void;
}

const PackageDetailsScreen: React.FC<PackageDetailsScreenProps> = ({  
  onBookService: _onBookService 
}) => {
  const route = useRoute();
  const packageId = (route.params as any)?.packageId;

  const [packageDetails, setPackageDetails] = useState<CannedServiceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [appointmentSheetVisible, setAppointmentSheetVisible] = useState(false);
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

  const handleBookService = useCallback(() => {
    if (packageDetails) {
      setAppointmentSheetVisible(true);
    }
  }, [packageDetails]);

  const handleAppointmentConfirm = useCallback((appointmentData: any) => {
    console.log('Appointment booked:', appointmentData);
    setAppointmentSheetVisible(false);
    showAlert({
      type: 'success',
      title: 'Appointment Booked',
      message: `Your appointment for ${packageDetails?.name} has been successfully booked!`,
      buttonType: 'single',
      confirmText: 'OK',
      onConfirm: () => {}
    });
  }, [packageDetails, showAlert]);

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

  const fetchPackageDetails = useCallback(async () => { 
    if (!packageId) {
      console.log('❌ No package ID provided');
      showAlert({
        type: 'error',
        title: 'Invalid Package',
        message: 'Package ID is required to load details.',
        buttonType: 'single',
        confirmText: 'OK',
        onConfirm: () => {}
      });
      return;
    }

    setIsLoading(true);
    console.log('🔍 Fetching package details for ID:', packageId);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('❌ No token found');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`http://10.0.2.2:3000/canned-services/${packageId}/details`, {
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
      console.log('📥 Package details received:', data);
      
      if (data.success && data.data) {
        setPackageDetails(data.data);
        console.log('✅ Package details loaded:', data.data.name);
      }
    } catch (error) {
      console.error('❌ Failed to fetch package details:', error);
      showAlert({
        type: 'error',
        title: 'Loading Package Failed',
        message: error instanceof Error ? error.message : 'Failed to load package details, Please try again later.',
        buttonType: 'single',
        confirmText: 'OK',
        onConfirm: () => {}
      });
    } finally {
      setIsLoading(false);
    }
  }, [packageId, showAlert]);

  useEffect(() => {
    fetchPackageDetails();
  }, [fetchPackageDetails]);

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      {isLoading ? (
        <LoadingComponent 
          textStyle={styles.loadingText}
          size="medium"
          loadingText="Loading package details"
          containerStyle={styles.loadingContainer}
        />
      ) : packageDetails ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Service Icon & Title */}
          <View style={styles.serviceHeader}>
            <View style={styles.iconContainer}>
              <Icon name={getCategoryIcon('General')} size={50} color={Colors.primary} />
            </View>
            <Text style={styles.serviceName}>{packageDetails.name}</Text>
            <Text style={styles.serviceTagline}>{packageDetails.description || 'Professional service package'}</Text>
          </View>

          {/* Price Card */}
          <View style={styles.priceCard}>
            <Text style={styles.priceLabel}>Starting from</Text>
            <Text style={styles.price}>${packageDetails.price}</Text>
            <Text style={styles.duration}>⏱️ {Math.ceil(packageDetails.duration / 60)} minutes</Text>
          </View>

          {/* Labor Operations */}
          {packageDetails.laborOperations.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Labor Operations</Text>
              {packageDetails.laborOperations.map((operation) => (
                <View key={operation.id} style={styles.includeItem}>
                  <Icon name="checkmark-circle" size={20} color={Colors.primary} />
                  <View style={styles.operationDetails}>
                    <Text style={styles.includeText}>{operation.labor.name}</Text>
                    <Text style={styles.operationSubtext}>
                      {operation.labor.estimatedHours}h @ ${operation.labor.hourlyRate}/hr
                      {operation.notes && ` - ${operation.notes}`}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Parts Categories */}
          {packageDetails.partsCategories.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Parts Required</Text>
              {packageDetails.partsCategories.map((partCategory) => (
                <View key={partCategory.id} style={styles.includeItem}>
                  <Icon name="construct-outline" size={20} color={Colors.primary} />
                  <View style={styles.operationDetails}>
                    <Text style={styles.includeText}>{partCategory.category.name}</Text>
                    <Text style={styles.operationSubtext}>
                      {partCategory.isRequired ? 'Required' : 'Optional'}
                      {partCategory.notes && ` - ${partCategory.notes}`}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Service Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Details</Text>
            <View style={styles.infoRow}>
              <Icon name="shield-checkmark-outline" size={20} color={Colors.primary} />
              <Text style={styles.infoText}>Professional service guarantee</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="people-outline" size={20} color={Colors.primary} />
              <Text style={styles.infoText}>Certified technicians</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="time-outline" size={20} color={Colors.primary} />
              <Text style={styles.infoText}>Estimated completion time: {Math.ceil(packageDetails.duration / 60)} minutes</Text>
            </View>
          </View>

          {/* Description */}
          {packageDetails.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About This Service</Text>
              <Text style={styles.description}>{packageDetails.description}</Text>
            </View>
          )}

          <View style={styles.bottomSpacing} />
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="construct-outline" size={64} color={Colors.neutral400} />
          <Text style={styles.emptyTitle}>Package Not Found</Text>
          <Text style={styles.emptySubtitle}>The requested package could not be loaded.</Text>
        </View>
      )}

      {/* Book Service Button */}
      {packageDetails && (
        <View style={styles.bookingContainer}>
          <Button 
            label={`Book ${packageDetails.name} - $${packageDetails.price}`}
            onPress={handleBookService}
          />
        </View>
      )}

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
      {packageDetails && (
        <AppointmentBottomSheet
          visible={appointmentSheetVisible}
          onClose={() => setAppointmentSheetVisible(false)}
          onConfirm={handleAppointmentConfirm}
          serviceId={packageDetails.id}
          serviceName={packageDetails.name}
          servicePrice={packageDetails.price}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primarybg,
  },
  content: {
    flex: 1,
  },
  serviceHeader: {
    alignItems: 'center',
    padding: 18,
    backgroundColor: Colors.neutral0,
    marginBottom: 12,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.neutral0,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -10,
  },
  serviceName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  serviceTagline: {
    fontSize: 16,
    color: Colors.neutral600,
    textAlign: 'center',
  },
  priceCard: {
    backgroundColor: Colors.neutral0,
    margin: 16,
    marginBottom: 0,
    marginTop: 5,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.neutral500,
    marginBottom: 4,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  duration: {
    fontSize: 16,
    color: Colors.neutral600,
  },
  section: {
    backgroundColor: Colors.neutral0,
    margin: 16,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 16,
  },
  includeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  includeText: {
    fontSize: 16,
    color: Colors.neutral700,
    marginLeft: 12,
    flex: 1,
  },
  operationDetails: {
    flex: 1,
    marginLeft: 12,
  },
  operationSubtext: {
    fontSize: 14,
    color: Colors.neutral500,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: Colors.neutral700,
    marginLeft: 12,
  },
  description: {
    fontSize: 16,
    color: Colors.neutral700,
    lineHeight: 24,
  },
  bottomSpacing: {
    height: 20,
  },
  bookingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral100,
    backgroundColor: Colors.neutral0,
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
});

export default PackageDetailsScreen;