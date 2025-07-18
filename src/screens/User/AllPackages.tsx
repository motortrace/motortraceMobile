import React from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from "react-native"
import Colors from "../../constants/colors"
import PackageCard from "../../components/PackageCard"
import Button from '../../components/Button'
import Header from '../../components/Header'
import SearchBar from '../../components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';

interface AllServicesScreenProps {
  onBack?: () => void,
  onScheduleAppointment?: () => void
}

const AllServicesScreen: React.FC<AllServicesScreenProps> = ({ onBack,   onScheduleAppointment }) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
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
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Icon name="chevron-back" size={30} color={Colors.neutral0} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Packages</Text>
        <View style={styles.placeholder} />
      </View> */}

      <Header
        icon="back"
        name="John Doe"
        image=""
        onIconPress={() => navigation.navigate('GarageServices')}
      />
      <SearchBar
        containerStyle={{
          marginTop: 10,
          marginBottom: -10,
        }}
        placeholder="Search products..."
      />

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
