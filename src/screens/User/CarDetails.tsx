import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Colors from '../../constants/colors';
import Header from '../../components/Header';
import BorderButton from '../../components/BorderButton';
import LoadingComponent from '../../components/Loading';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert, { CustomAlertProps } from '../../components/Alert';

// Hardcoded car data
const hardcodedCarData = {
  id: 1,
  name: "Honda Civic", // add name
  model: "Honda Civic LX",
  year: 2020,
  image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400',
  status: "active",
  statusText: "Active",
  mileage: "45,230 km",
  lastService: "Mar 15, 2024",
  number: "ABC-1234",
  color: "white", // add color
  issues: [
    "Check engine light intermittent",
    "Minor oil leak under engine"
  ],
  services: [
    {
      id: 1,
      type: "Oil Change",
      description: "Regular oil change with synthetic oil and new filter",
      date: "2024-03-15",
      mileage: "44,500 km",
      cost: "85.00"
    },
    {
      id: 2,
      type: "Tire Rotation",
      description: "Rotated all four tires and checked tire pressure",
      date: "2024-01-20",
      mileage: "42,100 km",
      cost: "45.00"
    },
    {
      id: 3,
      type: "Brake Service",
      description: "Replaced front brake pads and checked brake fluid",
      date: "2023-11-10",
      mileage: "39,800 km",
      cost: "220.00"
    }
  ],
  location: null,
  isTracking: false,
};

// Define a type for car details
interface CarDetails {
  id: number;
  name: string;
  model: string;
  year: number;
  image: string;
  status: string;
  statusText: string;
  mileage: string;
  lastService: string;
  number: string;
  color?: string;
  issues: string[];
  services: any[];
  location: any;
  isTracking: boolean;
}

// Main Car Details Page
const CarDetailsPage = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [car, setCar] = useState<CarDetails | null>(null);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [showMileageModal, setShowMileageModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [alertConfig, setAlertConfig] = useState<CustomAlertProps | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCarIdAndFetch = async () => {
      const storedCarId = await AsyncStorage.getItem('selectedCarId');
      setSelectedCarId(storedCarId);
      if (storedCarId) {
        fetchCar(storedCarId);
      }
    };
    getCarIdAndFetch();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Refresh car data when returning from EditCarDetails
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (selectedCarId) {
        fetchCar(selectedCarId);
      }
    });
    return unsubscribe;
  }, [navigation, selectedCarId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCar = useCallback(async (carId: string) => {
    try {
      setIsLoading(true);
      const userStr = await AsyncStorage.getItem('user');
      if (!userStr) {
        setIsLoading(false);
        return;
      }
      const user = JSON.parse(userStr);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      console.log('Fetching vehicle details for ID:', carId);
      
      // Fetch vehicle details
      const vehicleRes = await fetch(`http://10.0.2.2:3000/vehicles/${carId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'x-client-type': 'mobile',
        },
      });
      
      const vehicleData = await vehicleRes.json();
      console.log('Vehicle data:', vehicleData);
      
      // Fetch work orders for this vehicle to get service history
      const workOrdersRes = await fetch(`http://10.0.2.2:3000/work-orders?vehicleId=${carId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'x-client-type': 'mobile',
        },
      });
      
      const workOrdersData = await workOrdersRes.json();
      console.log('Work orders data:', workOrdersData);

      // Fetch current mileage from VehicleMileage
      let currentMileage = '0 km';
      try {
        const mileageRes = await fetch(`http://10.0.2.2:3000/vehicles/${carId}/mileage`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'x-client-type': 'mobile',
          },
        });
        if (mileageRes.ok) {
          const mileageData = await mileageRes.json();
          if (mileageData.currentMileage) {
            currentMileage = `${mileageData.currentMileage} km`;
          }
        }
      } catch (mileageErr) {
        console.warn('Could not fetch mileage:', mileageErr);
      }

      // Fetch service recommendations for active issues
      let systemIssues = [];
      try {
        const recommendationsRes = await fetch(`http://10.0.2.2:3000/vehicles/${carId}/recommendations?status=PENDING`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'x-client-type': 'mobile',
          },
        });
        if (recommendationsRes.ok) {
          const recommendationsData = await recommendationsRes.json();
          systemIssues = recommendationsData.data?.map((rec: any) => ({
            id: `system_${rec.id}`,
            title: rec.reason,
            description: `Priority: ${rec.priority} | Severity: ${rec.severity}`,
            priority: rec.priority === 'CRITICAL' ? 'high' : rec.priority === 'HIGH' ? 'high' : 'medium',
            createdAt: rec.triggeredAt,
            status: 'active',
            type: 'system'
          })) || [];
        }
      } catch (issuesErr) {
        console.warn('Could not fetch service recommendations:', issuesErr);
      }

      // Load user-added issues
      let userIssues = [];
      try {
        const storedIssues = await AsyncStorage.getItem(`car_issues_${carId}`);
        if (storedIssues) {
          userIssues = JSON.parse(storedIssues).filter((issue: any) => issue.status === 'active');
        }
      } catch (userIssuesErr) {
        console.warn('Could not load user issues:', userIssuesErr);
      }

      // Combine system and user issues
      const activeIssues = [...systemIssues, ...userIssues];

      if (vehicleRes.ok && (vehicleData.vehicle || vehicleData.data)) {
        const vehicle = vehicleData.vehicle || vehicleData.data;
        const workOrders = workOrdersData.data || workOrdersData.workOrders || [];
        
        // Process work orders into service history
        const serviceHistory = workOrders.map((wo: any) => ({
          id: wo.id,
          type: wo.jobType || 'Service',
          description: wo.complaint || wo.internalNotes || 'Vehicle service',
          date: wo.createdAt ? new Date(wo.createdAt).toLocaleDateString() : 'Unknown',
          mileage: wo.odometerReading ? `${wo.odometerReading} km` : 'N/A',
          cost: wo.totalAmount ? `$${wo.totalAmount}` : 'N/A',
          status: wo.status || 'completed',
        }));

        // Find the most recent service date
        const lastServiceDate = workOrders.length > 0
          ? workOrders
              .filter((wo: any) => wo.status === 'COMPLETED')
              .sort((a: any, b: any) => new Date(b.closedAt || b.updatedAt).getTime() - new Date(a.closedAt || a.updatedAt).getTime())[0]
          : null;

        const lastService = lastServiceDate
          ? new Date(lastServiceDate.closedAt || lastServiceDate.updatedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })
          : 'No service history';

        setCar({
          id: vehicle.id,
          name: vehicle.make || vehicle.vehicleName || 'Unknown Vehicle',
          model: vehicle.model || 'Unknown Model',
          year: vehicle.year || new Date().getFullYear(),
          // Use backend imageUrl if available, otherwise fallback to mock
          image: vehicle.imageUrl || hardcodedCarData.image,
          status: vehicle.status || 'ACTIVE', // Use real status from backend
          statusText: getStatusText(vehicle.status || 'ACTIVE'), // Get status text from status
          mileage: currentMileage, // Use real mileage from backend
          lastService: lastService, // Use real last service date
          number: vehicle.licensePlate || hardcodedCarData.number,
          color: vehicle.color || hardcodedCarData.color,
          issues: activeIssues, // Use real issues from recommendations and user-added issues
          services: serviceHistory, // Use real service history from work orders
          location: hardcodedCarData.location,
          isTracking: hardcodedCarData.isTracking,
        });
      } else {
        console.error('Failed to fetch vehicle:', vehicleData);
        // fallback to hardcoded data if backend fails
        setCar({ ...hardcodedCarData });
      }
    } catch (err) {
      console.error('Failed to fetch car details:', err);
      setCar({ ...hardcodedCarData });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Request location permission on component mount
  useEffect(() => {
    requestLocationPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestLocationPermission = async () => {
    try {
      const permission = Platform.OS === 'ios' 
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE 
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      
      const result = await request(permission);
      const granted = result === RESULTS.GRANTED;
      setLocationPermission(granted);
      
      if (granted) {
        getCurrentLocation();
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation(position.coords);
      },
      (error) => {
        console.error('Error getting current location:', error);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 10000 
      }
    );
  };

  const handleTrackLocation = async () => {
    if (!locationPermission) {
      Alert.alert(
        'Location Permission Required',
        'Please enable location services to track your car\'s location.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: () => Linking.openSettings() },
        ]
      );
      return;
    }

    Geolocation.getCurrentPosition(
      async (position) => {
        try {
          // For reverse geocoding, you can use a service like Google Maps API
          // For now, we'll use a simple address format
          const addressString = `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`;

          setCar({
            ...car!,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timestamp: new Date().toISOString(),
              address: addressString,
            },
            isTracking: true,
          });

          Alert.alert('Success', 'Car location has been saved successfully!');
        } catch (error) {
          console.error('Error processing location:', error);
          Alert.alert('Error', 'Failed to save location. Please try again.');
        }
      },
      (error) => {
        console.error('Error tracking location:', error);
        Alert.alert('Error', 'Failed to get current location. Please try again.');
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 10000 
      }
    );
  };

  const handleUntrackLocation = () => {
    Alert.alert(
      'Stop Tracking',
      'Are you sure you want to stop tracking this car\'s location?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Stop',
          style: 'destructive',
          onPress: () => {
            setCar({
              ...car!,
              location: null,
              isTracking: false,
            });
          },
        },
      ]
    );
  };

  const openInMaps = () => {
    if (!car?.location) return;
    const { latitude, longitude } = car.location;
    const label = `${car.name} Location`;
    const url = Platform.select({
      ios: `maps:${latitude},${longitude}?q=${label}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`,
    }) || '';
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          // Fallback to Google Maps web
          const webUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
          Linking.openURL(webUrl);
        }
      })
      .catch((err) => {
        console.error('Error opening maps:', err);
        Alert.alert('Error', 'Unable to open maps application.');
      });
  };

  const getDirections = () => {
    if (!car?.location || !currentLocation) {
      Alert.alert('Error', 'Unable to get directions. Please ensure location services are enabled.');
      return;
    }
    const { latitude, longitude } = car.location;
    const url = Platform.select({
      ios: `maps:?saddr=${currentLocation.latitude},${currentLocation.longitude}&daddr=${latitude},${longitude}&dirflg=d`,
      android: `google.navigation:q=${latitude},${longitude}`,
    }) || '';
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          // Fallback to Google Maps web directions
          const webUrl = `https://www.google.com/maps/dir/${currentLocation.latitude},${currentLocation.longitude}/${latitude},${longitude}`;
          Linking.openURL(webUrl);
        }
      })
      .catch((err) => {
        console.error('Error opening directions:', err);
        Alert.alert('Error', 'Unable to open directions.');
      });
  };

  // Add type to status param
  const getStatusConfig = (status: string) => {
    const configs: { [key: string]: { icon: string; backgroundColor: string; color: string; textColor: string } } = {
      ACTIVE: { icon: 'checkmark-circle', backgroundColor: Colors.neutral100, color: Colors.success, textColor: Colors.success },
      MAINTENANCE: { icon: 'build', backgroundColor: Colors.neutral100, color: Colors.warning, textColor: Colors.danger },
      INACTIVE: { icon: 'pause-circle', backgroundColor: Colors.neutral100 , color: Colors.Purple, textColor: '#4A148C' },
      ISSUES: { icon: 'warning', backgroundColor: Colors.neutral100, color: Colors.danger, textColor: Colors.danger },
    };
    return configs[status] || configs.ACTIVE;
  };

  const getStatusText = (status: string) => {
    const statusTexts: { [key: string]: string } = {
      ACTIVE: 'Active',
      MAINTENANCE: 'Maintenance',
      INACTIVE: 'Inactive',
      ISSUES: 'Has Issues',
    };
    return statusTexts[status] || 'Active';
  };

  const statusConfig = getStatusConfig(car?.status || '');

  // Delete car handler
  const handleDeleteCar = async () => {
    if (!car) return;
    setIsDeleting(true);
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (!userStr) throw new Error('User not found');
      const user = JSON.parse(userStr);
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const res = await fetch(`http://10.0.2.2:3000/vehicles/${car.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'x-client-type': 'mobile',
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete car');
      setAlertConfig(null);
      setAlertConfig({
        visible: true,
        title: 'Success',
        message: 'Car deleted successfully!',
        type: 'success',
        buttonType: 'single',
        onClose: () => {
          setAlertConfig(null);
          navigation.navigate('Cars');
        }
      });
    } catch (error: any) {
      setAlertConfig(null);
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: error.message || 'Failed to delete car',
        type: 'error',
        buttonType: 'single',
        onClose: () => setAlertConfig(null)
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Show loading component while fetching car details
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header
          icon="back"
          name="John Doe"
          image=""
        />
        <LoadingComponent 
          loadingText="Loading car details..." 
          size="medium"
          containerStyle={styles.loadingContainer}
          textStyle={styles.loadingText}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <Header
        icon="back"
        name="John Doe"
        image=""
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Car Image & Basic Info */}
        <View style={styles.carImageSection}>
          <Image source={{ uri: car?.image || hardcodedCarData.image }} style={styles.carImage} />
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.backgroundColor }]}>
            <Icon name={statusConfig.icon} size={16} color={statusConfig.color} />
            <Text style={[styles.statusText, { color: statusConfig.textColor }]}>
              {car?.statusText}
            </Text>
          </View>
        </View>

        {/* Car Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.carName}>{car?.name}</Text>
          <Text style={styles.carModel}>{car?.model} • {car?.year}</Text>
          <Text style={styles.carNumber}>{car?.number}</Text>
          {/* Add Car Name and Color */}
          <Text style={styles.carDetail}>Car Name: {car?.name}</Text>
          <Text style={styles.carDetail}>Color: {car?.color || 'white'}</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>

          <BorderButton 
            label='Mileage Tracking'
            icon = 'speedometer-outline'
            onPress={() => navigation.navigate('MileageTracking')}
            style={{width: '48%', height: 50}}
          />

          <BorderButton
            label='Edit Details'
            icon = 'create-outline'
            onPress={() => navigation.navigate('EditCarDetails', { carData: { id: car?.id, image: car?.image || '', status: car?.status || 'ACTIVE' } })}
            style={{width: '48%', height: 50}}
          />

          <BorderButton 
            label='View Services'
            icon = 'construct-outline'
            onPress={() => navigation.navigate('CarServices')}
            style={{width: '48%', height: 50}}
          />

          <BorderButton
            label='View Products'
            icon = 'cube-outline'
            onPress={() => navigation.navigate('CarProducts')}
            style={{width: '48%', height: 50}}
          />

          <BorderButton
            label='Car Profile'
            icon = 'person-outline'
            onPress={() => navigation.navigate('CarProfile')}
            style={{width: '48%', height: 50}}
          />

          <BorderButton
            label='Expense Manager'
            icon = 'cash-outline'
            onPress={() => navigation.navigate('CarExpenses')}
            style={{width: '48%', height: 50}}
          />

        </View>

        {/* Current Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>Current Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Icon name="speedometer-outline" size={24} color={Colors.neutral600} />
              <Text style={styles.statLabel}>Current Mileage</Text>
              <Text style={styles.statValue}>{car?.mileage}</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="calendar-outline" size={24} color={Colors.neutral600} />
              <Text style={styles.statLabel}>Last Service</Text>
              <Text style={styles.statValue}>{car?.lastService}</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="car-outline" size={24} color={Colors.neutral600} />
              <Text style={styles.statLabel}>Total Services</Text>
              <Text style={styles.statValue}>{car?.services?.length || 0}</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="alert-circle-outline" size={24} color={Colors.neutral600} />
              <Text style={styles.statLabel}>Active Issues</Text>
              <Text style={styles.statValue}>{car?.issues.length || 0}</Text>
            </View>
          </View>
        </View>

        {/* Location Tracking Card */}
        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <Text style={styles.cardTitle}>Location Tracking</Text>
            <View style={styles.trackingStatus}>
              <View style={[
                styles.trackingIndicator,
                { backgroundColor: car?.isTracking ? Colors.success : Colors.neutral300 }
              ]} />
              <Text style={styles.trackingStatusText}>
                {car?.isTracking ? 'Tracking' : 'Not Tracking'}
              </Text>
            </View>
          </View>

          {car?.location && (
            <View style={styles.locationInfo}>
              <View style={styles.locationDetails}>
                <Icon name="location-outline" size={20} color={Colors.neutral600} />
                <View style={styles.locationText}>
                  <Text style={styles.locationAddress} numberOfLines={2}>
                    {car.location.address}
                  </Text>
                  <Text style={styles.locationTime}>
                    Saved on {new Date(car.location.timestamp).toLocaleString()}
                  </Text>
                </View>
              </View>

              {/* Mini Map */}
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.miniMap}
                  initialRegion={{
                    latitude: car.location.latitude,
                    longitude: car.location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                  rotateEnabled={false}
                  pitchEnabled={false}
                >
                  <Marker
                    coordinate={{
                      latitude: car.location.latitude,
                      longitude: car.location.longitude,
                    }}
                    title={car.name}
                    description="Car Location"
                  >
                    <View style={styles.customMarker}>
                      <Icon name="car" size={20} color={Colors.primary} />
                    </View>
                  </Marker>
                </MapView>
                <TouchableOpacity style={styles.mapOverlay} onPress={openInMaps}>
                  <Icon name="expand-outline" size={20} color={Colors.neutral600} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Location Actions */}
          <View style={styles.locationActions}>
            {!car?.isTracking ? (
              <TouchableOpacity
                style={[styles.locationButton, styles.trackButton]}
                onPress={handleTrackLocation}
              >
                <Icon name="location" size={20} color={Colors.neutral0} />
                <Text style={styles.trackButtonText}>Track Location</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.trackingActions}>
                <TouchableOpacity
                  style={[styles.locationButton, styles.directionsButton]}
                  onPress={getDirections}
                >
                  <Icon name="navigate" size={18} color={Colors.primary} />
                  <Text style={styles.directionsButtonText}>Get Directions</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.locationButton, styles.untrackButton]}
                  onPress={handleUntrackLocation}
                >
                  <Icon name="close-circle-outline" size={18} color={Colors.danger} />
                  <Text style={styles.untrackButtonText}>Stop Tracking</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Active Issues */}
        {car && car.issues && car.issues.length > 0 && (
          <View style={styles.issuesCard}>
            <Text style={styles.cardTitle}>Active Issues</Text>
            {car.issues?.map((issue: any, index: number) => (
              <View key={issue.id || index} style={styles.issueItem}>
                <View style={styles.issueHeader}>
                  <View style={styles.issueTitleRow}>
                    <Icon
                      name={issue.type === 'system' ? 'cog' : 'warning'}
                      size={16}
                      color={issue.priority === 'high' ? Colors.danger : issue.priority === 'medium' ? Colors.warning : Colors.success}
                    />
                    <Text style={styles.issueTitle}>{issue.title}</Text>
                  </View>
                  {issue.type === 'user' && (
                    <TouchableOpacity
                      style={styles.resolveButton}
                      onPress={() => {
                        // Mark user issue as resolved
                        const updatedIssues = car.issues.map((i: any) =>
                          i.id === issue.id ? { ...i, status: 'resolved' } : i
                        );
                        // Save back to storage and update state
                        AsyncStorage.setItem(`car_issues_${car.id}`, JSON.stringify(updatedIssues));
                        setCar({ ...car, issues: updatedIssues.filter((i: any) => i.status === 'active') });
                      }}
                    >
                      <Icon name="checkmark-circle" size={16} color={Colors.success} />
                    </TouchableOpacity>
                  )}
                </View>
                {issue.description && (
                  <Text style={styles.issueDescription}>{issue.description}</Text>
                )}
                <View style={styles.issueMeta}>
                  <Text style={styles.issueDate}>
                    {issue.type === 'system' ? 'System detected' : 'User reported'} • {new Date(issue.createdAt).toLocaleDateString()}
                  </Text>
                  {issue.priority && (
                    <View style={[styles.priorityBadge, {
                      backgroundColor: issue.priority === 'high' ? Colors.danger + '20' :
                                     issue.priority === 'medium' ? Colors.warning + '20' :
                                     Colors.success + '20'
                    }]}>
                      <Text style={[styles.priorityText, {
                        color: issue.priority === 'high' ? Colors.danger :
                               issue.priority === 'medium' ? Colors.warning :
                               Colors.success
                      }]}>
                        {issue.priority.toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

          <View style={styles.issuesCard}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                setAlertConfig({
                  visible: true,
                  title: "Delete Car",
                  message: "Are you sure you want to delete this car? This action cannot be undone.",
                  type: 'warning',
                  buttonType: 'double',
                  confirmText: 'Delete',
                  cancelText: 'Cancel',
                  onCancel: () => setAlertConfig(null),
                  onClose: handleDeleteCar
                });
              }}
              disabled={isDeleting}
            >
              <Icon name="trash-outline" size={18} color="#fff" />
              <Text style={styles.deleteButtonText}>{isDeleting ? 'Deleting...' : 'Delete Car'}</Text>
            </TouchableOpacity>
          </View>
      </ScrollView>

      {/* Update Mileage Modal */}
      <UpdateMileageModal
        visible={showMileageModal}
        currentMileage={car?.mileage || ''}
        onClose={() => setShowMileageModal(false)}
        onSave={(newMileage) => {
          setCar({
            ...car!,
            mileage: newMileage
          });
          setShowMileageModal(false);
        }}
      />
      {alertConfig && (
        <CustomAlert
          {...alertConfig}
        />
      )}
    </View>
  );
};

// Update Mileage Modal Component
type UpdateMileageModalProps = {
  visible: boolean;
  currentMileage: string;
  onClose: () => void;
  onSave: (newMileage: string) => void;
};
const UpdateMileageModal = ({ visible, currentMileage, onClose, onSave }: UpdateMileageModalProps) => {
  const [newMileage, setNewMileage] = useState('');
  const handleSave = () => {
    if (!newMileage.trim()) {
      Alert.alert('Error', 'Please enter the current mileage');
      return;
    }
    onSave(newMileage);
    setNewMileage('');
  };
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="formSheet">
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Update Mileage</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.modalSaveText}>Save</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.modalContent}>
          <View style={styles.mileageUpdateContainer}>
            <Text style={styles.currentMileageLabel}>Current Mileage</Text>
            <Text style={styles.currentMileageValue}>{currentMileage}</Text>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>New Mileage *</Text>
              <TextInput
                style={[styles.formInput, styles.mileageInput]}
                value={newMileage}
                onChangeText={setNewMileage}
                placeholder="Enter current mileage"
                keyboardType="numeric"
                autoFocus
              />
            </View>
            <Text style={styles.mileageNote}>
              Please enter the current odometer reading of your vehicle
            </Text>
          </View>
        </View>
      </View>
    </Modal>
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
  carImageSection: {
    position: 'relative',
    height: 200,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  carImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: Colors.neutral0,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  carName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral900,
    marginBottom: 4,
  },
  carModel: {
    fontSize: 14,
    color: Colors.neutral500,
    fontWeight: '500',
  },
  carNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral800,
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary + '10',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  statsCard: {
    backgroundColor: Colors.neutral0,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral900,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.neutral50,
    borderRadius: 12,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.neutral600,
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.neutral900,
  },
  
  // Location Tracking Styles
  locationCard: {
    backgroundColor: Colors.neutral0,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  trackingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trackingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  trackingStatusText: {
    fontSize: 12,
    color: Colors.neutral600,
    fontWeight: '500',
  },
  locationInfo: {
    marginBottom: 16,
  },
  locationDetails: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  locationText: {
    flex: 1,
  },
  locationAddress: {
    fontSize: 14,
    color: Colors.neutral800,
    fontWeight: '500',
    lineHeight: 20,
  },
  locationTime: {
    fontSize: 12,
    color: Colors.neutral500,
    marginTop: 4,
  },
  mapContainer: {
    position: 'relative',
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.neutral100,
  },
  miniMap: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.neutral0,
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  customMarker: {
    backgroundColor: Colors.neutral0,
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  locationActions: {
    marginTop: 4,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  trackButton: {
    backgroundColor: Colors.primary,
  },
  trackButtonText: {
    color: Colors.neutral0,
    fontSize: 16,
    fontWeight: '600',
  },
  trackingActions: {
    flexDirection: 'row',
    gap: 12,
  },
  directionsButton: {
    flex: 1,
    backgroundColor: Colors.primary + '10',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  directionsButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  untrackButton: {
    flex: 1,
    backgroundColor: Colors.danger + '10',
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  untrackButtonText: {
    color: Colors.danger,
    fontSize: 14,
    fontWeight: '600',
  },
  
  issuesCard: {
    backgroundColor: Colors.neutral0,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
  },
  issueItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral100,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  issueTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral900,
    marginLeft: 8,
    flex: 1,
  },
  resolveButton: {
    padding: 8,
    backgroundColor: Colors.success + '20',
    borderRadius: 8,
  },
  issueDescription: {
    fontSize: 14,
    color: Colors.neutral700,
    marginBottom: 8,
    lineHeight: 20,
  },
  issueMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  issueDate: {
    fontSize: 12,
    color: Colors.neutral500,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral600,
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.neutral500,
    marginTop: 4,
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral100,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral900,
  },
  modalCancelText: {
    fontSize: 16,
    color: Colors.neutral600,
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral700,
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.neutral900,
  },
  serviceTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.neutral0,
  },
  serviceTypeButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  serviceTypeButtonText: {
    fontSize: 14,
    color: Colors.neutral700,
    fontWeight: '500',
  },
  serviceTypeButtonTextActive: {
    color: Colors.neutral0,
    fontWeight: '600',
  },
  mileageUpdateContainer: {
    alignItems: 'center',
    paddingTop: 32,
  },
  currentMileageLabel: {
    fontSize: 14,
    color: Colors.neutral600,
    marginBottom: 4,
  },
  currentMileageValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral900,
    marginBottom: 32,
  },
  mileageInput: {
    textAlign: 'center',
    fontSize: 18,
  },
  mileageNote: {
    fontSize: 12,
    color: Colors.neutral500,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 32,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.danger,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  deleteButtonText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
  },
  carDetail: {
    fontSize: 14,
    color: Colors.neutral700,
    marginTop: 2,
    marginBottom: 2,
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
});

export default CarDetailsPage;