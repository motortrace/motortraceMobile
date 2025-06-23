import React from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from "react-native"
import Icon from 'react-native-vector-icons/Ionicons'
import Colors from "../constants/colors"
import PackageCard from "../components/PackageCard"
import Button from '../components/Button'

interface AllServicesScreenProps {
  onBack?: () => void,
  onScheduleAppointment?: () => void
}

const AllServicesScreen: React.FC<AllServicesScreenProps> = ({ onBack,   onScheduleAppointment }) => {
    const packages = [
    {
      title: "Basic Care Package",
      description: "Ideal for routine maintenance and checkups.",
      services: ["Oil Change", "Brake Inspection", "Tire Rotation"],
      price: "$89.99",
    },
    {
      title: "Premium Package",
      description: "Comprehensive service to keep your car in top condition.",
      services: ["Oil Change", "Battery Replacement", "Full Diagnostic", "Tire Rotation"],
      price: "$149.99",
    },
    {
      title: "Ultimate Package",
      description: "Everything you need for yearly service & peace of mind.",
      services: ["Oil Change", "Brake Inspection", "Tire Rotation", "Battery Check", "AC Service"],
      price: "$199.99",
    },
  ]

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Icon name="chevron-back" size={30} color={Colors.neutral0} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Packages</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Services List */}
      <ScrollView style={styles.servicesContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.servicesList}>
          {packages.map((pkg, index) => (
            <PackageCard
              key={index}
              title={pkg.title}
              description={pkg.description}
              services={pkg.services}
              price={pkg.price}
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
