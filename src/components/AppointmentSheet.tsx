import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from "../constants/colors";
import Button from '../components/Button';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT * 0.75;

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate?: string;
  color?: string;
}

interface AvailableSlot {
  id: string;
  startTime: string;
  endTime: string;
  availableCapacity: number;
  totalCapacity: number;
}

interface AppointmentBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (appointmentData: any) => void;
  serviceId?: string;
  serviceName?: string;
  servicePrice?: number;
}

const AppointmentBottomSheet: React.FC<AppointmentBottomSheetProps> = ({
  visible,
  onClose,
  onConfirm,
  serviceId,
  serviceName = "Service",
  servicePrice = 0,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isCreatingAppointment, setIsCreatingAppointment] = useState(false);

  const translateY = useRef(new Animated.Value(BOTTOM_SHEET_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Fetch user's vehicles
  const fetchVehicles = useCallback(async () => {
    setIsLoadingVehicles(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://10.0.2.2:3000/vehicles', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setVehicles(data.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    } finally {
      setIsLoadingVehicles(false);
    }
  }, []);

  // Fetch available appointment slots
  const fetchAvailableSlots = useCallback(async (date: Date) => {
    setIsLoadingSlots(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const dateString = date.toISOString().split('T')[0];
      const url = serviceId 
        ? `http://10.0.2.2:3000/appointments/slots/available?date=${dateString}&serviceIds=${serviceId}`
        : `http://10.0.2.2:3000/appointments/slots/available?date=${dateString}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setAvailableSlots(data.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch available slots:', error);
    } finally {
      setIsLoadingSlots(false);
    }
  }, [serviceId]);

  // Create appointment
  const createAppointment = useCallback(async (appointmentData: any) => {
    setIsCreatingAppointment(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://10.0.2.2:3000/appointments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          Alert.alert('Success', 'Appointment booked successfully!');
          onConfirm(data.data);
          return true;
        }
      }
      
      Alert.alert('Error', 'Failed to book appointment. Please try again.');
      return false;
    } catch (error) {
      console.error('Failed to create appointment:', error);
      Alert.alert('Error', 'Failed to book appointment. Please try again.');
      return false;
    } finally {
      setIsCreatingAppointment(false);
    }
  }, [onConfirm]);

  const openBottomSheet = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  const closeBottomSheet = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: BOTTOM_SHEET_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onClose) onClose();
    });
  }, [opacity, translateY, onClose]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dy > 0 && gestureState.vy > 0;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          closeBottomSheet();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      openBottomSheet();
      fetchVehicles();
      fetchAvailableSlots(selectedDate);
    } else {
      closeBottomSheet();
    }
  }, [visible, fetchVehicles, fetchAvailableSlots, selectedDate, openBottomSheet, closeBottomSheet]);

  // Fetch slots when date changes
  useEffect(() => {
    if (visible) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate, visible, fetchAvailableSlots]);

  const handleConfirm = async () => {
    if (!selectedTime) {
      Alert.alert('Error', 'Please select a time slot');
      return;
    }

    if (!selectedVehicle) {
      Alert.alert('Error', 'Please select a vehicle');
      return;
    }

    const selectedSlot = availableSlots.find(slot => slot.startTime === selectedTime);
    if (!selectedSlot) {
      Alert.alert('Error', 'Selected time slot is no longer available');
      return;
    }

    const appointmentData: any = {
      vehicleId: selectedVehicle,
      requestedAt: new Date().toISOString(),
      startTime: new Date(`${selectedDate.toISOString().split('T')[0]}T${selectedTime}`).toISOString(),
      endTime: new Date(`${selectedDate.toISOString().split('T')[0]}T${selectedSlot.endTime}`).toISOString(),
      notes: `Booking for ${serviceName || 'General Service'}`,
    };

    // Only include service data if a specific service is selected
    if (serviceId) {
      appointmentData.cannedServiceIds = [serviceId];
      appointmentData.serviceNotes = [serviceName || 'Service'];
    }

    const success = await createAppointment(appointmentData);
    if (success) {
      closeBottomSheet();
    }
  };

  // Generate next 7 days for date selection
  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate().toString().padStart(2, '0'),
        fullDate: new Date(date),
      });
    }
    return dates;
  };

  const dates = generateDates();

  // Format time for display
  const formatTime = (timeString: string) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Format vehicle display name
  const formatVehicleName = (vehicle: Vehicle) => {
    return `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.licensePlate ? ` (${vehicle.licensePlate})` : ''}`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={closeBottomSheet}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, { opacity }]}>
          <TouchableOpacity 
            style={styles.backdropTouch} 
            onPress={closeBottomSheet}
            activeOpacity={1}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [{ translateY }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          {/* Handle */}
          <View style={styles.handle} />

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Title */}
            <Text style={styles.title}>Schedule {serviceName}</Text>
            {servicePrice > 0 && (
              <Text style={styles.priceText}>${servicePrice}</Text>
            )}

            {/* Service Info */}
            <View style={styles.serviceInfo}>
              <Icon name="construct-outline" size={20} color={Colors.primary} />
              <Text style={styles.serviceInfoText}>{serviceName}</Text>
            </View>

            {/* Date Selector */}
            <Text style={styles.sectionTitle}>Select Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateContainer}>
              {dates.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateCard,
                    selectedDate.toDateString() === item.fullDate.toDateString() && styles.selectedDateCard,
                  ]}
                  onPress={() => setSelectedDate(item.fullDate)}
                >
                  <Text style={[
                    styles.dayText,
                    selectedDate.toDateString() === item.fullDate.toDateString() && styles.selectedDayText,
                  ]}>
                    {item.day}
                  </Text>
                  <Text style={[
                    styles.dateText,
                    selectedDate.toDateString() === item.fullDate.toDateString() && styles.selectedDateText,
                  ]}>
                    {item.date}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Time Selector */}
            <Text style={styles.sectionTitle}>Select a time</Text>
            {isLoadingSlots ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading available times...</Text>
              </View>
            ) : availableSlots.length > 0 ? (
              <View style={styles.timeGrid}>
                {availableSlots.map((slot, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.timeCard,
                      selectedTime === slot.startTime && styles.selectedTimeCard,
                    ]}
                    onPress={() => setSelectedTime(slot.startTime)}
                  >
                    <Text style={[
                      styles.timeText,
                      selectedTime === slot.startTime && styles.selectedTimeText,
                    ]}>
                      {formatTime(slot.startTime)}
                    </Text>
                    <Text style={[
                      styles.capacityText,
                      selectedTime === slot.startTime && styles.selectedCapacityText,
                    ]}>
                      {slot.availableCapacity} available
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.noSlotsContainer}>
                <Icon name="time-outline" size={32} color={Colors.neutral400} />
                <Text style={styles.noSlotsText}>No available times for this date</Text>
              </View>
            )}

            {/* Vehicle Selector */}
            <Text style={styles.sectionTitle}>
              Select Vehicle <Text style={styles.required}>(required)</Text>
            </Text>
            {isLoadingVehicles ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading vehicles...</Text>
              </View>
            ) : vehicles.length > 0 ? (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedVehicle}
                  onValueChange={(itemValue) => setSelectedVehicle(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select vehicle" value="" />
                  {vehicles.map((vehicle) => (
                    <Picker.Item 
                      key={vehicle.id} 
                      label={formatVehicleName(vehicle)} 
                      value={vehicle.id} 
                    />
                  ))}
                </Picker>
              </View>
            ) : (
              <View style={styles.noVehiclesContainer}>
                <Icon name="car-outline" size={32} color={Colors.neutral400} />
                <Text style={styles.noVehiclesText}>No vehicles found</Text>
                <Text style={styles.noVehiclesSubtext}>Add a vehicle in your profile first</Text>
              </View>
            )}
            <View style={styles.bottomSpacing} />
          </ScrollView>

          {/* Confirm Button */}
          <View style={styles.confirmContainer}>
            <Button
              label={isCreatingAppointment ? "Booking appointment..." : "Confirm appointment"}
              onPress={handleConfirm}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    height: BOTTOM_SHEET_HEIGHT,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouch: {
    flex: 1,
  },
  bottomSheet: {
    height: BOTTOM_SHEET_HEIGHT,
    backgroundColor: Colors.neutral0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.neutral300,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.neutral900,
    marginBottom: 8,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 20,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral50,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  serviceInfoText: {
    fontSize: 16,
    color: Colors.neutral700,
    marginLeft: 8,
    fontWeight: '500',
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral900,
  },
  dateContainer: {
    marginBottom: 24,
  },
  dateCard: {
    width: 70,
    height: 80,
    backgroundColor: Colors.neutral100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedDateCard: {
    backgroundColor: Colors.primary,
  },
  dayText: {
    fontSize: 18,
    color: Colors.neutral600,
    marginBottom: 4,
  },
  selectedDayText: {
    color: Colors.neutral0,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral600,
  },
  selectedDateText: {
    color: Colors.neutral0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 16,
  },
  optional: {
    color: Colors.neutral500,
    fontWeight: 'normal',
  },
  required: {
    color: Colors.danger,
    fontWeight: 'normal',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  timeCard: {
    width: '30%',
    height: 60,
    backgroundColor: Colors.neutral100,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    padding: 8,
  },
  selectedTimeCard: {
    backgroundColor: Colors.primary,
  },
  timeText: {
    fontSize: 16,
    color: Colors.neutral700,
    fontWeight: '600',
  },
  selectedTimeText: {
    color: Colors.neutral0,
  },
  capacityText: {
    fontSize: 12,
    color: Colors.neutral500,
    marginTop: 2,
  },
  selectedCapacityText: {
    color: Colors.neutral0,
  },
  pickerContainer: {
    backgroundColor: Colors.neutral100,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  vehicleText: {
    fontSize: 16,
    color: Colors.neutral900,
  },
  placeholderText: {
    color: Colors.neutral500,
  },
  bottomSpacing: {
    height: 20,
  },
  confirmContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral100,
  },
  loadingContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: Colors.neutral500,
    marginTop: 8,
  },
  noSlotsContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.neutral50,
    borderRadius: 12,
    marginBottom: 20,
  },
  noSlotsText: {
    fontSize: 16,
    color: Colors.neutral500,
    marginTop: 8,
    textAlign: 'center',
  },
  noVehiclesContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.neutral50,
    borderRadius: 12,
    marginBottom: 20,
  },
  noVehiclesText: {
    fontSize: 16,
    color: Colors.neutral500,
    marginTop: 8,
    textAlign: 'center',
  },
  noVehiclesSubtext: {
    fontSize: 14,
    color: Colors.neutral400,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default AppointmentBottomSheet;