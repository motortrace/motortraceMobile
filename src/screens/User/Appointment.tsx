import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Button from '../../components/Button';
import AppointmentBottomSheet from '../../components/AppointmentSheet';
import Colors from '../../constants/colors';
import Header from '../../components/Header';

const ExampleScreen: React.FC = () => {
  const [showAppointmentSheet, setShowAppointmentSheet] = useState(false);

  const handleScheduleAppointment = () => {
    setShowAppointmentSheet(true);
  };

  const handleCloseSheet = () => {
    setShowAppointmentSheet(false);
  };

  const handleConfirmAppointment = (appointmentData: any) => {
    console.log('Appointment confirmed:', appointmentData);
    // Handle the appointment data here
    // You can save it to state, send to API, etc.
    
    // Example of what appointmentData contains:
    // {
    //   month: "September",
    //   date: "01",
    //   time: "12:00 PM",
    //   vehicle: "Honda Civic 2020"
    // }
  };

  return (
    <SafeAreaView style={styles.container}>
        <Header 
            icon="back"
            name="Jhon"
        />
      <View style={styles.content}>
        {/* This could be your service details, etc. */}
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceTitle}>Oil Change Service</Text>
          <Text style={styles.servicePrice}>$45.99</Text>
        </View>

        {/* Button to trigger the bottom sheet */}
        <View style={styles.buttonContainer}>
          <Button
            label="Schedule Appointment"
            onPress={handleScheduleAppointment}
          />
        </View>
      </View>

      {/* Appointment Bottom Sheet */}
      <AppointmentBottomSheet
        visible={showAppointmentSheet}
        onClose={handleCloseSheet}
        onConfirm={handleConfirmAppointment}
      />
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.neutral900,
    marginBottom: 30,
  },
  serviceInfo: {
    backgroundColor: Colors.neutral0,
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 8,
  },
  servicePrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingBottom: 20,
  },
});

export default ExampleScreen;