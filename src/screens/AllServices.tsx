import React from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from "react-native"
import Icon from 'react-native-vector-icons/Ionicons'
import Colors from "../constants/colors"
import ServiceCard from "../components/ServiceCard"
import Button from '../components/Button'

interface AllServicesScreenProps {
  onBack?: () => void,
  onScheduleAppointment?: () => void
}

const AllServicesScreen: React.FC<AllServicesScreenProps> = ({ onBack, onScheduleAppointment }) => {
  const services = [
    {
      name: "Oil Change",
      description: "Complete oil replacement and filter change with quality motor oil.",
      icon: "construct-outline",
    },
    {
      name: "Brake Inspection",
      description: "Thorough checkup of brake pads, rotors, and fluid.",
      icon: "car-sport-outline",
    },
    {
      name: "Battery Replacement",
      description: "Diagnostics and full battery replacement with warranty.",
      icon: "battery-charging-outline",
    },
    {
      name: "Tire Rotation",
      description: "Extends tire life and improves safety.",
      icon: "swap-horizontal-outline",
    },
    {
      name: "AC Repair",
      description: "Air conditioning system diagnostics and refrigerant refill.",
      icon: "snow-outline",
    },
    {
      name: "Engine Diagnostics",
      description: "Check engine lights and detailed diagnostic scan.",
      icon: "speedometer-outline",
    },
        {
      name: "Tire Rotation",
      description: "Extends tire life and improves safety.",
      icon: "swap-horizontal-outline",
    },
    {
      name: "AC Repair",
      description: "Air conditioning system diagnostics and refrigerant refill.",
      icon: "snow-outline",
    },
    {
      name: "Engine Diagnostics",
      description: "Check engine lights and detailed diagnostic scan.",
      icon: "speedometer-outline",
    },
  ]

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Icon name="chevron-back" size={30} color={Colors.neutral0} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Our Services</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Services List */}
      <ScrollView style={styles.servicesContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.servicesList}>
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.name}
              description={service.description}
            />
          ))}
        </View>
        <View style={styles.bottomSpacing} />
      </ScrollView>
      <View style={styles.scheduleContainer}>
        <Button onPress={onScheduleAppointment} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primarybg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    backgroundColor: Colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral100,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "600",
    color: Colors.neutral0,
  },
  placeholder: {
    width: 30,
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
})

export default AllServicesScreen
