import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from "../../constants/colors";
import Button from '../../components/Button';
import Header from '../../components/Header';
import AppointmentBottomSheet from '../../components/AppointmentSheet';
import CustomAlert from '../../components/Alert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

interface LaborServiceDetails {
  id: string;
  code: string;
  name: string;
  description?: string;
  estimatedHours: number;
  hourlyRate: number;
  category?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface SimpleServiceDetailScreenProps {
  onBookService?: () => void;
}

const SimpleServiceDetailScreen: React.FC<SimpleServiceDetailScreenProps> = ({
  onBookService: _onBookService
}) => {
  const route = useRoute();
  const serviceId = (route.params as any)?.serviceId;

  const [serviceDetails, setServiceDetails] = useState<LaborServiceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const showAlert = useCallback((config: typeof alertConfig) => {
    setAlertConfig(config);
    setAlertVisible(true);
  }, []);

  const hideAlert = useCallback(() => {
    setAlertVisible(false);
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

  // Fetch service details
  const fetchServiceDetails = useCallback(async () => {
    if (!serviceId) {
      console.log('❌ No service ID provided');
      showAlert({
        type: 'error',
        title: 'Invalid Service',
        message: 'Service ID is required to load details.',
        buttonType: 'single',
        confirmText: 'OK',
        onConfirm: () => {}
      });
      return;
    }

    setIsLoading(true);
    console.log('🔍 Fetching service details for ID:', serviceId);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('❌ No token found');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`http://10.0.2.2:3000/labor/catalog/${serviceId}`, {
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
      console.log('📥 Service details received:', data);

      if (data.success && data.data) {
        setServiceDetails(data.data);
        console.log('✅ Service details loaded:', data.data.name);
      }
    } catch (error: any) {
      console.error('❌ Failed to fetch service details:', error);
      showAlert({
        type: 'error',
        title: 'Loading Service Failed',
        message: error instanceof Error ? error.message : 'Failed to load service details, Please try again later.',
        buttonType: 'single',
        confirmText: 'OK',
        onConfirm: () => {}
      });
    } finally {
      setIsLoading(false);
    }
  }, [serviceId, showAlert]);

  const handleBookService = useCallback(() => {
    setAppointmentSheetVisible(true);
  }, []);

  const handleAppointmentConfirm = useCallback((appointmentData: any) => {
    console.log('Appointment booked:', appointmentData);
    setAppointmentSheetVisible(false);
    showAlert({
      type: 'success',
      title: 'Appointment Booked',
      message: `Your appointment for ${serviceDetails?.name || 'Service'} has been successfully booked!`,
      buttonType: 'single',
      confirmText: 'OK',
      onConfirm: () => {}
    });
  }, [serviceDetails, showAlert]);

  useEffect(() => {
    fetchServiceDetails();
  }, [fetchServiceDetails]);

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading service details...</Text>
        </View>
      ) : serviceDetails ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Service Icon & Title */}
          <View style={styles.serviceHeader}>
            <View style={styles.iconContainer}>
              <Icon name={getCategoryIcon(serviceDetails.category || 'General')} size={50} color={Colors.primary} />
            </View>
            <Text style={styles.serviceName}>{serviceDetails.name}</Text>
            <Text style={styles.serviceTagline}>{serviceDetails.description || 'Professional service'}</Text>
          </View>

          {/* Price Card */}
          <View style={styles.priceCard}>
            <Text style={styles.priceLabel}>Starting from</Text>
            <Text style={styles.price}>${serviceDetails.hourlyRate * serviceDetails.estimatedHours}</Text>
            <Text style={styles.duration}>⏱️ {Math.ceil(serviceDetails.estimatedHours * 60)} minutes</Text>
          </View>

          {/* Service Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Details</Text>
            <View style={styles.infoRow}>
              <Icon name="code-outline" size={20} color={Colors.primary} />
              <Text style={styles.infoText}>Service Code: {serviceDetails.code}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="pricetag-outline" size={20} color={Colors.primary} />
              <Text style={styles.infoText}>${serviceDetails.hourlyRate} per hour</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="time-outline" size={20} color={Colors.primary} />
              <Text style={styles.infoText}>Estimated time: {serviceDetails.estimatedHours} hours</Text>
            </View>
            {serviceDetails.category && (
              <View style={styles.infoRow}>
                <Icon name="folder-outline" size={20} color={Colors.primary} />
                <Text style={styles.infoText}>Category: {serviceDetails.category}</Text>
              </View>
            )}
          </View>

          {/* Description */}
          {serviceDetails.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About This Service</Text>
              <Text style={styles.description}>{serviceDetails.description}</Text>
            </View>
          )}

          <View style={styles.bottomSpacing} />
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="construct-outline" size={64} color={Colors.neutral400} />
          <Text style={styles.emptyTitle}>Service Not Found</Text>
          <Text style={styles.emptySubtitle}>The requested service could not be loaded.</Text>
        </View>
      )}

      {/* Book Service Button */}
      {serviceDetails && (
        <View style={styles.bookingContainer}>
          <Button
            label={`Book ${serviceDetails.name} - $${serviceDetails.hourlyRate * serviceDetails.estimatedHours}`}
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
      {serviceDetails && (
        <AppointmentBottomSheet
          visible={appointmentSheetVisible}
          onClose={() => setAppointmentSheetVisible(false)}
          onConfirm={handleAppointmentConfirm}
          serviceId={serviceDetails.id}
          serviceName={serviceDetails.name}
          servicePrice={serviceDetails.hourlyRate * serviceDetails.estimatedHours}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.neutral500,
    marginTop: 10,
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
});

export default SimpleServiceDetailScreen