"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ImageBackground } from "react-native"
import Colors from "../constants/colors"
import Icon from 'react-native-vector-icons/Ionicons';
import Section from "../components/section"
import Button from '../components/Button'
import TabNavigator from '../components/TabNavigator'
import RatingStars from '../components/RatingStars'
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';

interface GarageProfileScreenProps {
  onBack?: () => void
  onScheduleAppointment?: () => void
  onToggleFavorite?: () => void
}

const GarageProfileScreen: React.FC<GarageProfileScreenProps> = ({
  onBack,
  onScheduleAppointment,
  onToggleFavorite,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isFavorite, setIsFavorite] = useState(false)

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite)
    onToggleFavorite?.()
  }

  const garageServices = [
    { id: 1, icon: "key", title: "Key Change" },
    { id: 2, icon: "color-palette", title: "Paint Car" },
    { id: 3, icon: "search", title: "Car Scan" },
  ]

  const tabToScreenMap = {
    About: 'GarageInfo',
    Services: 'GarageServices',
    Packages: 'GaragePackage',
    Review: 'GarageReview',
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Garage Header Card */}
        <View style={styles.profileCard}>
          <ImageBackground
            source={require('../assets/images/Garage.jpg')}
            style={styles.profileImage}
            imageStyle={styles.profileImageStyle}
          >
            {/* Overlay */}
            <View style={styles.profileOverlay} />

            {/* Header Controls */}
            <View style={styles.profileHeader}>
              <TouchableOpacity style={styles.backButton}  onPress={() => navigation.navigate('Locations')}>
                <Icon name="chevron-back" size={24} color={Colors.neutral0} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.favoriteButton} onPress={handleToggleFavorite}>
                <Icon 
                  name={isFavorite ? "heart" : "heart-outline"} 
                  size={24} 
                  color={isFavorite ? Colors.danger : Colors.neutral0} 
                />
              </TouchableOpacity>
            </View>

            {/* Garage Info */}
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Auto Fix Garage</Text>
              <Text style={styles.profileTitle}>Professional Auto Repair Shop</Text>
            </View>
          </ImageBackground>
        </View>

        <TabNavigator
          index = {0}
          tabs={["About", "Services", "Packages", "Review"]}
          onTabPress={(tab) => {
            const screen = tabToScreenMap[tab];
            if (screen) {
              navigation.navigate(screen);
            }
          }}
        />

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Rating</Text>
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>{<RatingStars rating={5} />}</View>
              <Text style={styles.ratingText}>4.8 (257)</Text>
            </View>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Distance</Text>
            <Text style={styles.feeText}>1.2 km</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Open Hours</Text>
            <Text style={styles.experienceText}>8AM - 6PM</Text>
          </View>
        </View>

        {/* About Section */}
        <Section title="About this garage">
          <Text style={styles.pitchText}>
            We are a professional auto repair shop with over 15 years of experience. We specialize in key replacement, car painting, and comprehensive diagnostic services. Our certified technicians ensure your vehicle gets the best care possible.
          </Text>
        </Section>

        {/* Services Section */}
        {/* <Section title="Our Services" >
          <View style={styles.uspContainer}>
            {garageServices.map((service) => (
              <View key={service.id} style={styles.uspItem}>
                <View style={styles.uspIcon}>
                  <Icon name={service.icon} size={20} color="#6B7280" />
                </View>
                <Text style={styles.uspTitle}>{service.title}</Text>
              </View>
            ))}
          </View>
        </Section> */}

        {/* Location Section */}
        <Section title="Location" >
          <View style={styles.locationContainer}>
            <View style={styles.locationInfo}>
              <Icon name="location" size={20} color="#6B7280" />
              <Text style={styles.locationText}>123 Main Street, Auto District, City Center</Text>
            </View>
            <View style={styles.locationInfo}>
              <Icon name="call" size={20} color="#6B7280" />
              <Text style={styles.locationText}>+1 (555) 123-4567</Text>
            </View>
          </View>
        </Section>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Book Appointment Button */}
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
  scrollView: {
    flex: 1,
  },
  profileCard: {
    margin: 12,
    marginTop: 30,
    marginBottom: 3,
    borderRadius: 12,
    overflow: "hidden",
  },
  profileImage: {
    marginTop: 25,
    width: "100%",
    height: 200,
    justifyContent: "space-between",
    shadowColor: Colors.neutral1000,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileImageStyle: {
    borderRadius: 12,
  },
  profileOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.shadowLg,
    borderRadius: 12,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    padding: 16,
    paddingTop: 8,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.neutral0,
    marginBottom: 4,
  },
  profileTitle: {
    fontSize: 14,
    color: Colors.neutral0,
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.neutral0,
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.neutral1000,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 10,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 16,
    color: Colors.neutral500,
    marginBottom: 4,
    fontWeight: "500",
  },
  ratingContainer: {
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 2,
  },
  starIcon: {
    marginHorizontal: 1,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.neutral600,
  },
  feeText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.neutral600,
  },
  experienceText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.neutral600,
  },
  pitchText: {
    fontSize: 16,
    color: Colors.neutral500,
    lineHeight: 20,
    backgroundColor: Colors.neutral0,
    padding: 16,
    borderRadius: 8,
    shadowColor: Colors.neutral1000,
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  uspContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.neutral0,
    padding: 20,
    borderRadius: 8,
    shadowColor: Colors.neutral1000,
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  uspItem: {
    alignItems: "center",
    flex: 1,
  },
  uspIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral0,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  uspTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.neutral700,
    textAlign: "center",
  },
  locationContainer: {
    backgroundColor: Colors.neutral0,
    padding: 16,
    borderRadius: 8,
    shadowColor: Colors.neutral1000,
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: Colors.neutral500,
    marginLeft: 12,
    flex: 1,
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
  scheduleButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  scheduleButtonText: {
    color: Colors.neutral0,
    fontSize: 16,
    fontWeight: "600",
  },
})

export default GarageProfileScreen