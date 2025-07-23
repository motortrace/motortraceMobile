import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
import SearchBar from '../../components/SearchBar';
import Colors from '../../constants/colors'
import CarCard from '../../components/CarCard';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

// Local mock data for extra fields
const localCarDetails = [
  {
    id: 1,
    nickname: 'Thunder',
    mileage: '45,230 km',
    fuelLevel: 75,
    lastService: '2 weeks ago',
    status: 'perfect',
    statusText: 'Perfect Condition',
    issues: [],
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400',
  },
  {
    id: 2,
    nickname: 'Reliable',
    mileage: '78,450 km',
    fuelLevel: 40,
    lastService: '1 month ago',
    status: 'breakdown',
    statusText: 'Breakdown',
    issues: ['Engine overheating', 'Brake pads worn'],
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400',
  },
  {
    id: 3,
    nickname: 'Speedster',
    mileage: '23,100 km',
    fuelLevel: 90,
    lastService: '3 days ago',
    status: 'in_repair',
    statusText: 'In Repair',
    issues: ['Oil change in progress'],
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400',
  },
  {
    id: 4,
    nickname: 'Commuter',
    mileage: '95,230 km',
    fuelLevel: 65,
    lastService: '5 days ago',
    status: 'repaired',
    statusText: 'Recently Repaired',
    issues: [],
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400',
  },
  {
    id: 5,
    nickname: 'Zippy',
    mileage: '12,450 km',
    fuelLevel: 30,
    lastService: '1 week ago',
    status: 'warning',
    statusText: 'Needs Attention',
    issues: ['Low fuel', 'Service due soon'],
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400',
  }
];

// Type for Vehicle
interface Vehicle {
  id: number;
  vehicleName: string;
  name?: string; // for CarCard compatibility
  model: string;
  year: number;
  image?: string;
  nickname?: string;
  mileage?: string;
  fuelLevel?: number;
  lastService?: string;
  status?: string;
  statusText?: string;
  issues?: string[];
}

const Cars = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cars, setCars] = useState<Vehicle[]>([]);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const userStr = await AsyncStorage.getItem('user');
        if (!userStr) return;
        const user = JSON.parse(userStr);
        const token = await AsyncStorage.getItem('token');
        if (!token) return;
        console.log("Toke is", token)
        console.log("user is:", user)
        const res = await fetch(`http://10.0.2.2:3000/vehicles/${user.id}/vehicles`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        if (res.ok && data.vehicles) {
          // Merge backend and local data by id, always use local for image and extra fields
          const merged = data.vehicles.map((car: any) => {
            const local = localCarDetails.find(lc => lc.id === car.id);
            return {
              id: car.id,
              vehicleName: car.vehicleName,
              name: car.vehicleName, // for CarCard
              model: car.model,
              year: car.year,
              image: local?.image || '',
              nickname: local?.nickname || '',
              mileage: local?.mileage || '',
              fuelLevel: local?.fuelLevel || 0,
              lastService: local?.lastService || '',
              status: local?.status || '',
              statusText: local?.statusText || '',
              issues: local?.issues || [],
            };
          });
          setCars(merged);
        }
      } catch (err) {
        console.error('Failed to fetch cars:', err);
      }
    };
    fetchCars();
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'perfect':
        return {
          color: Colors.success,
          backgroundColor: Colors.neutral100,
          icon: 'checkmark-circle',
          textColor: Colors.success
        };
      case 'breakdown':
        return {
          color: Colors.danger,
          backgroundColor: Colors.neutral100,
          icon: 'warning',
          textColor: Colors.danger
        };
      case 'in_repair':
        return {
          color: Colors.info,
          backgroundColor: Colors.neutral100,
          icon: 'construct',
          textColor: Colors.primary
        };
      case 'repaired':
        return {
          color: Colors.success,
          backgroundColor: Colors.neutral100,
          icon: 'checkmark-done-circle',
          textColor: Colors.success
        };
      case 'warning':
        return {
          color: Colors.warning,
          backgroundColor: Colors.neutral100,
          icon: 'alert-circle',
          textColor: Colors.warning
        };
      default:
        return {
          color: Colors.neutral500,
          backgroundColor: Colors.neutral100,
          icon: 'car',
          textColor: Colors.neutral500
        };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header
        icon="back"
        name="John Doe"
        image=""
        onIconPress={() => navigation.navigate('Home')}
      />

      {/* Search Bar */}
      <SearchBar
        containerStyle={styles.searchBarContainer}
        placeholder="Search your cars..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{cars.length}</Text>
            <Text style={styles.statLabel}>Total Cars</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: Colors.danger }]}> 
              {cars.reduce((sum, car) => sum + (car.issues?.length || 0), 0)}
            </Text>
            <Text style={styles.statLabel}>Active Issues</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: Colors.success }]}> 
              {cars.filter(car => car.status === 'perfect' || car.status === 'repaired').length}
            </Text>
            <Text style={styles.statLabel}>Healthy</Text>
          </View>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Cars</Text>
        </View>

        {/* Car Cards */}
        <View style={styles.carsList}>
          {cars.length === 0 ? (
            <View style={styles.emptyStateCard}>
              <Icon name="car-outline" size={48} color={Colors.neutral400} style={{ marginBottom: 12 }} />
              <Text style={styles.emptyStateTitle}>No Cars Yet</Text>
              <Text style={styles.emptyStateSubtitle}>You haven't added any cars yet. Register your car to start tracking maintenance and issues.</Text>
              <TouchableOpacity style={styles.addCarButton} onPress={() => navigation.navigate('CarOnboarding')}>
                <Text style={styles.addCarButtonText}>Add Your First Car</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {cars.map(car => (
                <CarCard
                  key={car.id}
                  car={{
                    id: String(car.id),
                    name: car.name || '',
                    nickname: car.nickname || '',
                    model: car.model,
                    year: car.year,
                    image: car.image || '',
                    mileage: car.mileage || '',
                    lastService: car.lastService || '',
                    issues: car.issues || [],
                    status: car.status || '',
                    statusText: car.statusText || '',
                  }}
                  getStatusConfig={getStatusConfig}
                  onPress={async () => {
                    console.log('Pressed car with id:', car.id);
                    await AsyncStorage.setItem('selectedCarId', '1');
                    navigation.navigate('CarDetails');
                  }}
                />
              ))}
              {/* Add New Car Card */}
              <View style={styles.addCarCard}>
                <View style={styles.addCarIcon}>
                  <Icon name="add" size={32} color={Colors.primary} />
                </View>
                <Text style={styles.addCarTitle}>Add New Car</Text>
                <Text style={styles.addCarSubtitle}>
                  Register your car to start tracking maintenance and issues
                </Text>
                <TouchableOpacity style={styles.addCarButton} onPress={() => navigation.navigate('CarOnboarding')}>
                  <Text style={styles.addCarButtonText}>Get Started</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primarybg,
  },
  searchBarContainer: {
    position: 'absolute',
    marginTop: 100,
    zIndex: 10,
    padding: 16,
    width: '100%',
  },
  content: {
    flex: 1,
    marginTop: 70,
    paddingHorizontal: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  statCard: {
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: Colors.shadowLg,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 7,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.neutral900,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.neutral500,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.neutral900,
  },
  carsList: {
    paddingBottom: 100,
  },
  addCarCard: {
    backgroundColor: Colors.neutral0,
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.neutral200,
    borderStyle: 'dashed',
    marginVertical: 8,
    marginHorizontal: 16,
    marginBottom: -60,
  },
  addCarIcon: {
    width: 64,
    height: 64,
    backgroundColor: Colors.neutral100,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  addCarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.neutral900,
    marginBottom: 8,
  },
  addCarSubtitle: {
    fontSize: 14,
    color: Colors.neutral500,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  addCarButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  addCarButtonText: {
    color: Colors.neutral0,
    fontWeight: '600',
  },
  emptyStateCard: {
    backgroundColor: Colors.neutral0,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.neutral200,
    borderStyle: 'dashed',
    marginVertical: 32,
    marginHorizontal: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.neutral900,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: Colors.neutral500,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
});

export default Cars;