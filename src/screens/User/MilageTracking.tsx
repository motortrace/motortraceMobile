import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Colors from '../constants/colors';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';

const { width } = Dimensions.get('window');

const MileageTrackingScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [currentMileage, setCurrentMileage] = useState(45678);
  const [isEditing, setIsEditing] = useState(false);
  const [editMileage, setEditMileage] = useState('45678');
  const [locationTracking, setLocationTracking] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [currentGraphIndex, setCurrentGraphIndex] = useState(0);
  const [isTrackingActive, setIsTrackingActive] = useState(false);
  
  // Calculator states
  const [calculatorVisible, setCalculatorVisible] = useState(false);
  const [calcDistance, setCalcDistance] = useState('');
  const [calcFuel, setCalcFuel] = useState('');
  const [calcResult, setCalcResult] = useState('');

  // Current location (mock data - replace with actual location)
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 6.9271,
    longitude: 79.8612,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Mock data for mileage tracking
  const allData = {
    day: [
      { day: 'Mon', distance: 45, fuel: 3.2, efficiency: 14.1 },
      { day: 'Tue', distance: 62, fuel: 4.1, efficiency: 15.1 },
      { day: 'Wed', distance: 38, fuel: 2.8, efficiency: 13.6 },
      { day: 'Thu', distance: 55, fuel: 3.7, efficiency: 14.9 },
      { day: 'Fri', distance: 71, fuel: 4.9, efficiency: 14.5 },
      { day: 'Sat', distance: 28, fuel: 2.1, efficiency: 13.3 },
      { day: 'Sun', distance: 42, fuel: 3.0, efficiency: 14.0 },
    ],
    week: [
      { period: 'W1', distance: 341, fuel: 23.8, efficiency: 14.3 },
      { period: 'W2', distance: 298, fuel: 21.2, efficiency: 14.1 },
      { period: 'W3', distance: 387, fuel: 26.9, efficiency: 14.4 },
      { period: 'W4', distance: 356, fuel: 25.1, efficiency: 14.2 },
    ],
    month: [
      { period: 'Jan', distance: 1456, fuel: 102.3, efficiency: 14.2 },
      { period: 'Feb', distance: 1289, fuel: 91.8, efficiency: 14.0 },
      { period: 'Mar', distance: 1534, fuel: 106.7, efficiency: 14.4 },
      { period: 'Apr', distance: 1387, fuel: 97.2, efficiency: 14.3 },
      { period: 'May', distance: 1623, fuel: 112.4, efficiency: 14.4 },
      { period: 'Jun', distance: 1445, fuel: 101.8, efficiency: 14.2 },
    ],
  };

  const getCurrentData = () => {
    const data = allData[selectedPeriod];
    const start = currentGraphIndex * 4;
    const end = Math.min(start + 4, data.length);
    return data.slice(start, end);
  };

  const getMaxPages = () => {
    const data = allData[selectedPeriod];
    return Math.ceil(data.length / 4);
  };

  const getMaxDistance = () => {
    const data = getCurrentData();
    return Math.max(...data.map(item => item.distance));
  };

  const getTotalStats = () => {
    const data = allData[selectedPeriod];
    const totalDistance = data.reduce((sum, item) => sum + item.distance, 0);
    const totalFuel = data.reduce((sum, item) => sum + item.fuel, 0);
    const avgEfficiency = data.reduce((sum, item) => sum + item.efficiency, 0) / data.length;
    
    return {
      totalDistance: totalDistance.toFixed(0),
      totalFuel: totalFuel.toFixed(1),
      avgEfficiency: avgEfficiency.toFixed(1),
    };
  };

  const handleMileageEdit = () => {
    if (isEditing) {
      const newMileage = parseInt(editMileage);
      if (isNaN(newMileage) || newMileage < 0) {
        Alert.alert('Invalid Mileage', 'Please enter a valid mileage number.');
        return;
      }
      setCurrentMileage(newMileage);
      setIsEditing(false);
    } else {
      setEditMileage(currentMileage.toString());
      setIsEditing(true);
    }
  };

  const handleTrackingToggle = () => {
    setIsTrackingActive(!isTrackingActive);
    Alert.alert(
      'Tracking Status',
      `Vehicle tracking is now ${!isTrackingActive ? 'active' : 'inactive'}`,
      [{ text: 'OK', onPress: () => {} }]
    );
  };

  const calculateEfficiency = () => {
    if (!calcDistance || !calcFuel) {
      Alert.alert('Error', 'Please enter both distance and fuel amount');
      return;
    }
    
    const distance = parseFloat(calcDistance);
    const fuel = parseFloat(calcFuel);
    
    if (isNaN(distance) || isNaN(fuel) || fuel === 0) {
      Alert.alert('Error', 'Please enter valid numbers');
      return;
    }
    
    const efficiency = (distance / fuel).toFixed(2);
    setCalcResult(`${efficiency} km/L`);
  };

  const navigateGraph = (direction) => {
    const maxPages = getMaxPages();
    if (direction === 'prev' && currentGraphIndex > 0) {
      setCurrentGraphIndex(currentGraphIndex - 1);
    } else if (direction === 'next' && currentGraphIndex < maxPages - 1) {
      setCurrentGraphIndex(currentGraphIndex + 1);
    }
  };

  const renderMapView = () => {
    return (
      <View style={styles.mapContainer}>
        <Text style={styles.mapTitle}>Current Location</Text>
        <View style={styles.mapWrapper}>
          <MapView
            style={styles.map}
            region={currentLocation}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              title="Your Vehicle"
              description="Current location"
            />
          </MapView>
          
          <View style={styles.mapOverlay}>
            <TouchableOpacity
              style={[
                styles.trackButton,
                { backgroundColor: isTrackingActive ? Colors.error : Colors.success }
              ]}
              onPress={handleTrackingToggle}
            >
              <Text style={styles.trackButtonText}>
                {isTrackingActive ? 'Stop Tracking' : 'Start Tracking'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderBarChart = () => {
    const data = getCurrentData();
    const maxDistance = getMaxDistance();
    const maxPages = getMaxPages();

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <TouchableOpacity
            style={[styles.navButton, currentGraphIndex === 0 && styles.navButtonDisabled]}
            onPress={() => navigateGraph('prev')}
            disabled={currentGraphIndex === 0}
          >
            <Text style={styles.navButtonText}>{'<'}</Text>
          </TouchableOpacity>
          
          <View style={styles.chartTitleContainer}>
            <Text style={styles.chartTitle}>Distance Traveled</Text>
            <Text style={styles.chartSubtitle}>
              {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} - Page {currentGraphIndex + 1} of {maxPages}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[styles.navButton, currentGraphIndex === maxPages - 1 && styles.navButtonDisabled]}
            onPress={() => navigateGraph('next')}
            disabled={currentGraphIndex === maxPages - 1}
          >
            <Text style={styles.navButtonText}>{'>'}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.barChart}>
          {data.map((item, index) => {
            const barHeight = (item.distance / maxDistance) * 120;
            return (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View style={[styles.bar, { height: barHeight }]} />
                  <Text style={styles.barValue}>{item.distance}km</Text>
                </View>
                <Text style={styles.barLabel}>{item.day || item.period}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderCalculatorModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={calculatorVisible}
        onRequestClose={() => setCalculatorVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calculatorModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Fuel Efficiency Calculator</Text>
              <TouchableOpacity onPress={() => setCalculatorVisible(false)}>
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Distance (km)</Text>
              <TextInput
                style={styles.calculatorInput}
                value={calcDistance}
                onChangeText={setCalcDistance}
                keyboardType="numeric"
                placeholder="Enter distance"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Fuel Used (L)</Text>
              <TextInput
                style={styles.calculatorInput}
                value={calcFuel}
                onChangeText={setCalcFuel}
                keyboardType="numeric"
                placeholder="Enter fuel amount"
              />
            </View>
            
            <TouchableOpacity
              style={styles.calculateButton}
              onPress={calculateEfficiency}
            >
              <Text style={styles.calculateButtonText}>Calculate</Text>
            </TouchableOpacity>
            
            {calcResult !== '' && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultLabel}>Fuel Efficiency:</Text>
                <Text style={styles.resultValue}>{calcResult}</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  const stats = getTotalStats();

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        icon="back"
        name="Mileage Tracking"
        image=""
        onIconPress={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.scrollView}>
        {/* Current Mileage Card */}
        <View style={styles.mileageCard}>
          <View style={styles.mileageHeader}>
            <Text style={styles.mileageTitle}>Current Mileage</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleMileageEdit}
            >
              <Text style={styles.editButtonText}>
                {isEditing ? 'Save' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.mileageDisplay}>
            {isEditing ? (
              <TextInput
                style={styles.mileageInput}
                value={editMileage}
                onChangeText={setEditMileage}
                keyboardType="numeric"
                placeholder="Enter mileage"
                autoFocus={true}
              />
            ) : (
              <Text style={styles.mileageValue}>{currentMileage.toLocaleString()}</Text>
            )}
            <Text style={styles.mileageUnit}>km</Text>
          </View>
        </View>

        {/* Map View */}
        {renderMapView()}

        {/* Calculator Button */}
        <View style={styles.calculatorContainer}>
          <TouchableOpacity
            style={styles.calculatorButton}
            onPress={() => setCalculatorVisible(true)}
          >
            <Text style={styles.calculatorButtonText}>Fuel Efficiency Calculator</Text>
          </TouchableOpacity>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Distance</Text>
            <Text style={styles.statValue}>{stats.totalDistance}</Text>
            <Text style={styles.statUnit}>km</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Fuel Consumed</Text>
            <Text style={styles.statValue}>{stats.totalFuel}</Text>
            <Text style={styles.statUnit}>L</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Avg Efficiency</Text>
            <Text style={styles.statValue}>{stats.avgEfficiency}</Text>
            <Text style={styles.statUnit}>km/L</Text>
          </View>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <Text style={styles.sectionTitle}>Analytics Period</Text>
          <View style={styles.periodButtons}>
            {['day', 'week', 'month'].map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.periodButtonActive
                ]}
                onPress={() => {
                  setSelectedPeriod(period);
                  setCurrentGraphIndex(0);
                }}
              >
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.periodButtonTextActive
                ]}>
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Distance Bar Chart */}
        {renderBarChart()}

        {/* Detailed Data Table */}
        <View style={styles.dataTable}>
          <Text style={styles.sectionTitle}>Detailed Data</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Period</Text>
            <Text style={styles.tableHeaderText}>Distance</Text>
            <Text style={styles.tableHeaderText}>Fuel</Text>
            <Text style={styles.tableHeaderText}>Efficiency</Text>
          </View>
          
          {getCurrentData().map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.day || item.period}</Text>
              <Text style={styles.tableCell}>{item.distance} km</Text>
              <Text style={styles.tableCell}>{item.fuel} L</Text>
              <Text style={styles.tableCell}>{item.efficiency} km/L</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {renderCalculatorModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primarybg,
  },
  scrollView: {
    flex: 1,
  },
  mileageCard: {
    backgroundColor: Colors.neutral0,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 15,
  },
  mileageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mileageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral900,
  },
  editButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  editButtonText: {
    color: Colors.neutral0,
    fontSize: 14,
    fontWeight: '600',
  },
  mileageDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  mileageValue: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.primary,
  },
  mileageUnit: {
    fontSize: 18,
    color: Colors.neutral600,
    marginLeft: 8,
  },
  mileageInput: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.primary,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
    paddingVertical: 4,
    minWidth: 200,
  },
  mapContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 12,
  },
  mapWrapper: {
    position: 'relative',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  mapOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  trackButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  trackButtonText: {
    color: Colors.neutral0,
    fontSize: 14,
    fontWeight: '600',
  },
  calculatorContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  calculatorButton: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  calculatorButtonText: {
    color: Colors.neutral0,
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.neutral0,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.neutral600,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral900,
  },
  statUnit: {
    fontSize: 12,
    color: Colors.neutral600,
  },
  periodSelector: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 12,
  },
  periodButtons: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral100,
    borderRadius: 8,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: Colors.primary,
  },
  periodButtonText: {
    fontSize: 14,
    color: Colors.neutral600,
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: Colors.neutral0,
    fontWeight: '600',
  },
  chartContainer: {
    backgroundColor: Colors.neutral0,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  chartTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral900,
  },
  chartSubtitle: {
    fontSize: 12,
    color: Colors.neutral600,
    marginTop: 2,
  },
  navButton: {
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    backgroundColor: Colors.neutral300,
  },
  navButtonText: {
    color: Colors.neutral0,
    fontSize: 18,
    fontWeight: '600',
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 160,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 140,
  },
  bar: {
    width: 20,
    backgroundColor: Colors.primary,
    borderRadius: 4,
    marginBottom: 4,
  },
  barValue: {
    fontSize: 10,
    color: Colors.neutral600,
    fontWeight: '600',
  },
  barLabel: {
    fontSize: 12,
    color: Colors.neutral700,
    marginTop: 8,
  },
  dataTable: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral100,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral900,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral0,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: Colors.neutral700,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calculatorModal: {
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    padding: 20,
    width: width - 40,
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral900,
  },
  closeButton: {
    fontSize: 24,
    color: Colors.neutral600,
    fontWeight: '300',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: Colors.neutral700,
    marginBottom: 8,
    fontWeight: '500',
  },
  calculatorInput: {
    borderWidth: 1,
    borderColor: Colors.neutral300,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: Colors.neutral0,
  },
  calculateButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  calculateButtonText: {
    color: Colors.neutral0,
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: Colors.success,
    borderRadius: 8,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
    color: Colors.success,
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.success,
  },
});

export default MileageTrackingScreen;