import type React from "react"
import { View, StyleSheet, SafeAreaView, TouchableOpacity, ImageBackground } from "react-native"
import Colors from "../constants/colors"
import Icon from "react-native-vector-icons/Ionicons"
import BottomNavigation from "../components/BottomNav"
import Header from '../components/Header'
import SearchBar from '../components/SearchBar'
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';

interface GarageLocatorScreenProps {
  onViewRecommended?: () => void
  handleTabPress?: () => void
}

const GarageLocatorScreen: React.FC<GarageLocatorScreenProps> = ({handleTabPress }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const garageMarkers = [
    { id: 1, top: 180, left: 120, type: "recommended" },
    { id: 2, top: 250, left: 200, type: "nearby" },
    { id: 3, top: 320, left: 80, type: "history" },
    { id: 4, top: 280, left: 280, type: "nearby" },
    { id: 5, top: 400, left: 150, type: "recommended" },
  ]

  const MarkerPin = ({ top, left, type }: { top: number; left: number; type: string }) => {
    const getMarkerColor = () => {
      switch (type) {
        case "recommended":
          return Colors.warning || "#F59E0B"
        case "history":
          return Colors.success || "#10B981"
        case "nearby":
        default:
          return Colors.danger || "#EF4444"
      }
    }

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('GarageInfo')}
        style={[styles.markerPin, { top, left, backgroundColor: getMarkerColor() }]}>
        <Icon name="build" size={16} color={Colors.neutral0} />
        <View style={[styles.markerShadow, { backgroundColor: getMarkerColor() }]} />
      </TouchableOpacity>
    )
  }

  const navItems = [
    {
      id: "location",
      icon: "location",
      onPress: () => navigation.navigate('Locations'),
    },
    {
      id: "recommended",
      icon: "star",
      onPress: () => navigation.navigate('GarageRecommendations'),
    },
    {
      id: "history",
      icon: "time",
      onPress: () => navigation.navigate('GarageHistory'),
    },
    {
      id: "nearby",
      icon: "compass",
      label: "Nearby",
      onPress: () => navigation.navigate('GarageExplore'),
    },
    {
      id: "heart",
      icon: "heart",
      label: "Favourite",
      onPress: () => navigation.navigate('GarageFavourites'),
    },
  ]

  return (
    <SafeAreaView style={styles.container}>
      {/* Enhanced Header with Search */}
      <Header
        icon="back"
        name="John Doe"
        image=""
        onIconPress={() => navigation.navigate('Home')}
      />
      <SearchBar
        containerStyle={{
          position: 'absolute',
          marginTop: 100,
          zIndex: 10,
          padding: 10,
          width: '100%',
        }}
        placeholder="Search products..."
      />
      {/* <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Icon name="chevron-back" size={30} color={Colors.neutral0} />
          </TouchableOpacity>

          <View style={styles.searchBarContainer}>
            <View style={styles.searchBar}>
              <View style={styles.searchIconContainer}>
                <Icon name="location" size={22} color={Colors.primary} />
              </View>
              <TextInput
                style={styles.searchInput}
                placeholder="Search garages, services..."
                placeholderTextColor={Colors.neutral500}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        </View>
      </View> */}

      {/* Map with Enhanced Markers */}
      <View style={styles.mapContainer}>
        <ImageBackground source={require("../assets/images/Map.jpeg")} style={styles.mapBackground} resizeMode="cover">
          {/* Garage Markers */}
          {garageMarkers.map((marker) => (
            <MarkerPin key={marker.id} top={marker.top} left={marker.left} type={marker.type}  />
          ))}

          {/* Enhanced Current Location Marker */}
          <View style={[styles.currentLocationContainer, { top: 290, left: 170 }]}>
            <View style={styles.currentLocationPulse} />
            <View style={styles.currentLocationRing} />
            <View style={styles.currentLocationDot}>
              <View style={styles.currentLocationCenter} />
            </View>
          </View>
        </ImageBackground>

        {/* Enhanced Floating Action Button */}
        <TouchableOpacity style={styles.centerLocationButton}>
          <View style={styles.centerLocationButtonInner}>
            <Icon name="locate" size={30} color={Colors.primary} />
          </View>
        </TouchableOpacity>
      </View>

      <BottomNavigation
        navItems={navItems}
        activeTab={0}
        onTabPress={handleTabPress}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral0,
  },
  header: {
    paddingTop: 55,
    paddingBottom: 10,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
    backgroundColor: Colors.primary
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.shadowSm,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchBarContainer: {
    flex: 1,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.neutral50,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    shadowColor: Colors.shadowSm,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIconContainer: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.neutral900,
    fontWeight: "400",
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  mapBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  markerPin: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: Colors.neutral0,
    shadowColor: Colors.shadowLg,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  markerShadow: {
    position: "absolute",
    bottom: -8,
    width: 20,
    height: 8,
    borderRadius: 10,
    opacity: 0.3,
    transform: [{ scaleX: 1.2 }],
  },
  currentLocationContainer: {
    position: "absolute",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  currentLocationPulse: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    opacity: 0.15,
  },
  currentLocationRing: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: Colors.primary,
    opacity: 0.4,
  },
  currentLocationDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.neutral0,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  currentLocationCenter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  centerLocationButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.neutral0,
    shadowColor: Colors.shadowLg,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
    borderColor: Colors.primary,
    borderWidth: 3,
  },
  centerLocationButtonInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.neutral100,
  },
})

export default GarageLocatorScreen
