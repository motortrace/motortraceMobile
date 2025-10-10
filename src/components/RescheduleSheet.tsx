import React, { useState, useEffect, useRef } from "react";
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
  ActivityIndicator,
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from "../constants/colors";
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert, { CustomAlertProps } from '../components/Alert';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT * 0.6;

interface AvailableSlot {
  id: string;
  startTime: string;
  endTime: string;
  availableCapacity: number;
  totalCapacity: number;
}

interface RescheduleSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (appointmentData: any) => void;
  existingAppointment?: any;
}

const RescheduleSheet: React.FC<RescheduleSheetProps> = ({
  visible,
  onClose,
  onConfirm,
  existingAppointment,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [alertConfig, setAlertConfig] = useState<CustomAlertProps | null>(null);

  const translateY = useRef(new Animated.Value(BOTTOM_SHEET_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Fetch available appointment slots
  const fetchAvailableSlots = async (date: Date) => {
    setIsLoadingSlots(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const dateString = date.toISOString().split('T')[0];
      const url = `http://10.0.2.2:3000/appointments/slots/available?date=${dateString}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      const slots = data.slots || data.data || [];

      if (response.ok && slots && slots.length > 0) {
        setAvailableSlots(slots);
      } else {
        setAvailableSlots([]);
      }
    } catch (error) {
      console.error('Failed to fetch available slots:', error);
      setAvailableSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const openBottomSheet = () => {
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
  };

  const closeBottomSheet = () => {
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
  };

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
    if (visible && existingAppointment) {
      // Set initial date from existing appointment (next day)
      const appointmentDate = new Date(existingAppointment.scheduledDate || existingAppointment.requestedAt);
      const nextDay = new Date(appointmentDate);
      nextDay.setDate(appointmentDate.getDate() + 1);
      setSelectedDate(nextDay);
      fetchAvailableSlots(nextDay);
      openBottomSheet();
    } else {
      closeBottomSheet();
      // Reset selections when closing
      if (!visible) {
        setSelectedTime("");
      }
    }
  }, [visible, existingAppointment]);

  // Fetch slots when date changes
  useEffect(() => {
    if (visible) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate, visible]);

  const handleConfirm = async () => {
    if (!selectedTime) {
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: 'Please select a time slot',
        type: 'error',
        onClose: () => setAlertConfig(null)
      });
      return;
    }

    if (!existingAppointment) {
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: 'No appointment selected for rescheduling',
        type: 'error',
        onClose: () => setAlertConfig(null)
      });
      return;
    }

    const selectedSlot = availableSlots.find(slot => slot.startTime === selectedTime);
    if (!selectedSlot) {
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: 'Selected time slot is no longer available',
        type: 'error',
        onClose: () => setAlertConfig(null)
      });
      return;
    }

    setIsRescheduling(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setAlertConfig({
          visible: true,
          title: 'Error',
          message: 'Authentication required',
          type: 'error',
          onClose: () => setAlertConfig(null)
        });
        return;
      }

      console.log('🔄 Rescheduling appointment:', existingAppointment.id);

      // Construct start time
      let startDateTime;
      if (selectedTime.includes('T')) {
        startDateTime = new Date(selectedTime);
      } else {
        const dateString = selectedDate.toISOString().split('T')[0];
        startDateTime = new Date(`${dateString}T${selectedTime}`);
      }

      // Construct end time
      let endDateTime;
      if (selectedSlot.endTime.includes('T')) {
        endDateTime = new Date(selectedSlot.endTime);
      } else {
        const dateString = selectedDate.toISOString().split('T')[0];
        endDateTime = new Date(`${dateString}T${selectedSlot.endTime}`);
      }

      // Call the reschedule appointment API
      const response = await fetch(`http://10.0.2.2:3000/appointments/${existingAppointment.id}/reschedule`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          notes: `Rescheduled: ${existingAppointment.serviceType || 'Service'} appointment`,
        }),
      });

      console.log('🔄 Reschedule response status:', response.status);
      const result = await response.json().catch(() => ({}));
      console.log('🔄 Reschedule response data:', result);

      if (response.ok) {
        if (result.success) {
          setAlertConfig({
            visible: true,
            title: 'Success',
            message: 'Appointment rescheduled successfully!',
            type: 'success',
            onClose: () => {
              setAlertConfig(null);
              onConfirm(result.data);
            }
          });
        } else {
          setAlertConfig({
            visible: true,
            title: 'Error',
            message: result.error || 'Failed to reschedule appointment',
            type: 'error',
            onClose: () => setAlertConfig(null)
          });
        }
      } else {
        setAlertConfig({
          visible: true,
          title: 'Error',
          message: result.message || result.error || 'Failed to reschedule appointment',
          type: 'error',
          onClose: () => setAlertConfig(null)
        });
      }
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: 'Failed to reschedule appointment',
        type: 'error',
        onClose: () => setAlertConfig(null)
      });
    } finally {
      setIsRescheduling(false);
    }
  };

  // Generate dates for selection (starting from next day for rescheduling)
  const generateDates = () => {
    const dates = [];
    const startDate = existingAppointment
      ? new Date(existingAppointment.scheduledDate || existingAppointment.requestedAt)
      : new Date();

    // For reschedule, start from the next day after appointment date
    for (let i = 1; i < 8; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
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
    if (!timeString || timeString === 'Invalid Date' || timeString.trim() === '') {
      return 'Time not available';
    }

    try {
      let time;

      if (timeString.includes('T')) {
        time = new Date(timeString);
      } else if (timeString.includes(':')) {
        time = new Date(`2000-01-01T${timeString}`);
      } else {
        return timeString;
      }

      if (isNaN(time.getTime())) {
        console.warn('Invalid time format:', timeString);
        return timeString;
      }

      return time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting time:', timeString, error);
      return 'Time not available';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={closeBottomSheet}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, { opacity }]} />
        <TouchableOpacity
          style={styles.backdropTouch}
          onPress={closeBottomSheet}
          activeOpacity={1}
        />

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
            <Text style={styles.title}>Reschedule Appointment</Text>

            {/* Service Info */}
            <View style={styles.serviceInfo}>
              <Icon name="construct-outline" size={20} color={Colors.primary} />
              <Text style={styles.serviceInfoText}>
                {existingAppointment?.serviceType || 'Service'}
              </Text>
            </View>

            {/* Date Selector */}
            <Text style={styles.sectionTitle}>Select New Date</Text>
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
            <Text style={styles.sectionTitle}>Select New Time</Text>
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
            <View style={styles.bottomSpacing} />
          </ScrollView>

          {/* Confirm Button */}
          <View style={styles.confirmContainer}>
            <Button
              label={isRescheduling ? "Rescheduling..." : "Confirm Reschedule"}
              onPress={handleConfirm}
            />
          </View>
        </Animated.View>
      </View>

      {/* Custom Alert */}
      {alertConfig && (
        <CustomAlert
          {...alertConfig}
        />
      )}
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
    marginBottom: 16,
    textAlign: 'center',
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 16,
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
});

export default RescheduleSheet;