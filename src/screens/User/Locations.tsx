import type React from "react"
import { View, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native"
import MapView, { Marker } from 'react-native-maps';
import Colors from "../../constants/colors"
import Icon from "react-native-vector-icons/Ionicons"
import BottomNavigation from "../../components/BottomNav"
import Header from '../../components/Header'
import SearchBar from '../../components/SearchBar'
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';

interface GarageLocatorScreenProps {
  onViewRecommended?: () => void
  handleTabPress?: () => void
}

const GarageLocatorScreen: React.FC<GarageLocatorScreenProps> = ({handleTabPress }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Example coordinates (Colombo area)
  const garageMarkers = [
    { id: 1, lat: 6.9271, lng: 79.8612, type: "recommended" },
    { id: 2, lat: 6.9300, lng: 79.8600, type: "nearby" },
    { id: 3, lat: 6.9250, lng: 79.8650, type: "history" },
    { id: 4, lat: 6.9285, lng: 79.8700, type: "nearby" },
    { id: 5, lat: 6.9320, lng: 79.8620, type: "recommended" },
    { id: 6, lat: 6.9340, lng: 79.8680, type: "history" },
    { id: 7, lat: 6.9290, lng: 79.8580, type: "nearby" },
    { id: 8, lat: 6.9265, lng: 79.8640, type: "recommended" },
    { id: 9, lat: 6.9310, lng: 79.8660, type: "history" },
    { id: 10, lat: 6.9330, lng: 79.8605, type: "nearby" },
  ];

  const MarkerPin = ({ type }: { type: string }) => {
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
      <View style={[styles.markerPin, { backgroundColor: getMarkerColor() }]}> 
        <Icon name="build" size={16} color={Colors.neutral0} />
        <View style={[styles.markerShadow, { backgroundColor: getMarkerColor() }]} />
      </View>
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
      onPress: () => navigation.navigate('RecommendedServices'),
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

      {/* Map with Google Maps and Markers */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.mapBackground}
          initialRegion={{
            latitude: 6.9271,
            longitude: 79.8612,
            latitudeDelta: 0.025,
            longitudeDelta: 0.025,
          }}
          showsUserLocation
        >
          {garageMarkers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{ latitude: marker.lat, longitude: marker.lng }}
              onPress={() => navigation.navigate('GarageInfo')}
            >
              <MarkerPin type={marker.type} />
            </Marker>
          ))}
        </MapView>
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