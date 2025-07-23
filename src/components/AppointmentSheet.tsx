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
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from "../constants/colors";
import Button from '../components/Button';
import { Picker } from '@react-native-picker/picker';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT * 0.75;

interface AppointmentBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (appointmentData: any) => void;
}

const AppointmentBottomSheet: React.FC<AppointmentBottomSheetProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const [selectedMonth, setSelectedMonth] = useState("September");
  const [selectedDate, setSelectedDate] = useState("01");
  const [selectedTime, setSelectedTime] = useState("12:00 PM");
  const [selectedVehicle, setSelectedVehicle] = useState("");

  const translateY = useRef(new Animated.Value(BOTTOM_SHEET_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;

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
    } else {
      closeBottomSheet();
    }
  }, [visible]);

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

  const handleConfirm = () => {
    const appointmentData = {
      month: selectedMonth,
      date: selectedDate,
      time: selectedTime,
      vehicle: selectedVehicle,
    };
    onConfirm(appointmentData);
    closeBottomSheet();
  };

  const dates = [
    { day: "Thu", date: "31" },
    { day: "Fri", date: "01" },
    { day: "Sat", date: "02" },
    { day: "Sun", date: "03" },
    { day: "Mon", date: "04" },
  ];

  const times = [
    "9:00 AM", "12:00 PM", "2:00 PM",
    "3:00 PM", "5:00 PM", "6:00 PM"
  ];

  const vehicles = [
    "Select vehicle",
    "Honda Civic 2020",
    "Toyota Camry 2019",
    "Ford F-150 2021",
    "BMW X3 2022"
  ];

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
            <Text style={styles.title}>Schedule Appointment</Text>

            {/* Month Selector */}
            <View style={styles.monthSelector}>
              <Text style={styles.monthText}>{selectedMonth}</Text>
              <TouchableOpacity>
                <Icon name="chevron-down" size={20} color={Colors.neutral700} />
              </TouchableOpacity>
            </View>

            {/* Date Selector */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateContainer}>
              {dates.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateCard,
                    selectedDate === item.date && styles.selectedDateCard,
                  ]}
                  onPress={() => setSelectedDate(item.date)}
                >
                  <Text style={[
                    styles.dayText,
                    selectedDate === item.date && styles.selectedDayText,
                  ]}>
                    {item.day}
                  </Text>
                  <Text style={[
                    styles.dateText,
                    selectedDate === item.date && styles.selectedDateText,
                  ]}>
                    {item.date}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Time Selector */}
            <Text style={styles.sectionTitle}>Select a time</Text>
            <View style={styles.timeGrid}>
              {times.map((time, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.timeCard,
                    selectedTime === time && styles.selectedTimeCard,
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={[
                    styles.timeText,
                    selectedTime === time && styles.selectedTimeText,
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Vehicle Selector */}
            <Text style={styles.sectionTitle}>
              What car needs a check up? <Text style={styles.optional}>(optional)</Text>
            </Text>
                <Picker
                    selectedValue={selectedVehicle}
                    onValueChange={(itemValue) => setSelectedVehicle(itemValue)}
                    style={styles.Picker}
                >
                    <Picker.Item label="Select vehicle" value="" />
                    <Picker.Item label="Toyota Camry 2019" value="Toyota Camry 2019" />
                    <Picker.Item label="Honda Civic 2020" value="Honda Civic 2020" />
                    <Picker.Item label="Ford F-150 2021" value="Ford F-150 2021" />
                    <Picker.Item label="BMW X3 2022" value="BMW X3 2022" />
                </Picker>
            <View style={styles.bottomSpacing} />
          </ScrollView>

          {/* Confirm Button */}
          <View style={styles.confirmContainer}>
            <Button
              label="Confirm appointment"
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
    marginBottom: 20,
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
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  timeCard: {
    width: '30%',
    height: 44,
    backgroundColor: Colors.neutral100,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedTimeCard: {
    backgroundColor: Colors.primary,
  },
  timeText: {
    fontSize: 16,
    color: Colors.neutral700,
  },
  selectedTimeText: {
    color: Colors.neutral0,
  },
  Picker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.neutral100,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 20,
    marginBottom: 20,
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
});

export default AppointmentBottomSheet;