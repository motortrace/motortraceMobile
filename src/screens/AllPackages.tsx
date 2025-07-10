import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from "react-native"
import Icon from 'react-native-vector-icons/Ionicons'
import Colors from "../constants/colors"
import PackageCard from "../components/PackageCard"
import Button from '../components/Button'
import Header from '../components/Header'
import SearchBar from '../components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';
import Footer from '../components/Footer';

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
      basePrice: 89.99,
      discountPrice: 79.99,
      laborHours: 1.5,
      partsIncluded: ["Oil Filter", "Air Filter"],
      frequency: "Every 6 months",
      notes: "Recommended for vehicles under 50,000 miles.",
    },
    {
      title: "Premium Package",
      description: "Comprehensive service to keep your car in top condition.",
      services: ["Oil Change", "Battery Replacement", "Full Diagnostic", "Tire Rotation"],
      price: "$149.99",
      basePrice: 149.99,
      discountPrice: 129.99,
      laborHours: 2.5,
      partsIncluded: ["Oil Filter", "Battery"],
      frequency: "Every 12 months",
      notes: "Includes battery check and replacement if needed.",
    },
    {
      title: "Ultimate Package",
      description: "Everything you need for yearly service & peace of mind.",
      services: ["Oil Change", "Brake Inspection", "Tire Rotation", "Battery Check", "AC Service"],
      price: "$199.99",
      basePrice: 199.99,
      discountPrice: 179.99,
      laborHours: 3.5,
      partsIncluded: ["Oil Filter", "Cabin Filter", "AC Filter"],
      frequency: "Every 12 months",
      notes: "Best for high-mileage vehicles.",
    },
  ]

  // Example garage info
  const garage = {
    name: "Downtown Auto Care",
    rating: 4.7,
    location: "123 Main St, Springfield",
  };

  // Accordion state
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  // Search/filter state
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const filters = ['All', 'Routine', 'Comprehensive', 'Yearly'];

  // Filtered and searched packages
  const filteredPackages = packages.filter(pkg => {
    const matchesFilter = selectedFilter === 'All' ||
      (selectedFilter === 'Routine' && pkg.title.toLowerCase().includes('basic')) ||
      (selectedFilter === 'Comprehensive' && pkg.title.toLowerCase().includes('premium')) ||
      (selectedFilter === 'Yearly' && pkg.title.toLowerCase().includes('ultimate'));
    const matchesSearch = pkg.title.toLowerCase().includes(search.toLowerCase()) ||
      pkg.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon="back"
        name=""
        title="Packages"
        onIconPress={() => navigation.navigate('GarageServices')}
        modern={true}
      />
      {/* Garage Info Section */}
      <View style={styles.garageInfoSection}>
        <Text style={styles.garageName}>{garage.name}</Text>
        <View style={styles.garageInfoRow}>
          <Icon name="star" size={16} color="#FBBF24" style={{ marginRight: 4 }} />
          <Text style={styles.garageRating}>{garage.rating}</Text>
          <Icon name="location-outline" size={16} color={Colors.primary} style={{ marginLeft: 12, marginRight: 4 }} />
          <Text style={styles.garageLocation}>{garage.location}</Text>
        </View>
      </View>
      {/* Search Filters */}
      <View style={styles.filterRow}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterChip, selectedFilter === filter && styles.filterChipActive]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[styles.filterChipText, selectedFilter === filter && styles.filterChipTextActive]}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Improved Search Bar */}
      <View style={styles.searchBarContainer}>
        <Icon name="search" size={18} color={Colors.neutral500} style={{ marginLeft: 12, marginRight: 6 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search packages..."
          placeholderTextColor={Colors.neutral400}
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <ScrollView style={styles.servicesContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.servicesList}>
          {filteredPackages.map((pkg, index) => {
            const expanded = expandedIndex === index;
            return (
              <View key={index} style={styles.packageCardNeo}>
                <TouchableOpacity
                  style={styles.packageCardHeaderRow}
                  onPress={() => setExpandedIndex(expanded ? null : index)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.packageCardTitle}>{pkg.title}</Text>
                  <Icon name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={Colors.neutral500} style={{ marginLeft: 8 }} />
                </TouchableOpacity>
                {expanded && (
                  <>
                    <Text style={styles.packageCardPriceGreen}>
                      {pkg.discountPrice ? `LKR ${pkg.discountPrice.toLocaleString('en-LK', { maximumFractionDigits: 0 })}` : `LKR ${pkg.basePrice.toLocaleString('en-LK', { maximumFractionDigits: 0 })}`}
                    </Text>
                    <Text style={styles.packageCardDescription}>{pkg.description}</Text>
                    <View style={styles.packageCardDetailRow}>
                      <Icon name="time-outline" size={16} color={Colors.primary} style={{ marginRight: 4 }} />
                      <Text style={styles.packageCardDetailText}>{pkg.laborHours} hrs labor</Text>
                      <Icon name="repeat-outline" size={16} color={Colors.primary} style={{ marginLeft: 12, marginRight: 4 }} />
                      <Text style={styles.packageCardDetailText}>{pkg.frequency}</Text>
                    </View>
                    <View style={styles.packageCardServicesRow}>
                      {pkg.services.map((service, i) => (
                        <View key={i} style={styles.packageServiceBadge}>
                          <Text style={styles.packageServiceBadgeText}>{service}</Text>
                        </View>
                      ))}
                    </View>
                    {pkg.partsIncluded && (
                      <View style={styles.packageCardPartsRow}>
                        <Icon name="construct-outline" size={14} color={Colors.neutral600} style={{ marginRight: 4 }} />
                        <Text style={styles.packageCardPartsLabel}>Parts: </Text>
                        <Text style={styles.packageCardPartsText}>{pkg.partsIncluded.join(', ')}</Text>
                      </View>
                    )}
                    {pkg.notes && (
                      <Text style={styles.packageCardNotes}>{pkg.notes}</Text>
                    )}
                    <TouchableOpacity style={[styles.packageCardBookBtn, { backgroundColor: '#0a59de' }]}> 
                      <Text style={styles.packageCardBookBtnText}>Book Now</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            );
          })}
        </View>
        <View style={styles.bottomSpacing} />
      </ScrollView>
      <Footer />
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
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 18,
    marginBottom: 10,
  },
  sectionHeaderTitle: {
    fontSize: 20,
    fontFamily: 'Coinbase_Sans-Medium',
    color: Colors.neutral1000 || '#111827',
  },
  sectionHeaderAction: {
    fontSize: 16,
    color: '#0958DC',
    fontFamily: 'Coinbase_Sans-Medium',
  },
  garageInfoSection: {
    paddingHorizontal: 24,
    marginTop: 10,
    marginBottom: 8,
  },
  garageName: {
    fontSize: 22,
    fontFamily: 'Coinbase_Sans-Medium',
    color: Colors.neutral1000 || '#111827',
    marginBottom: 2,
  },
  garageInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  garageRating: {
    fontSize: 15,
    color: '#FBBF24',
    fontFamily: 'Coinbase_Sans-Medium',
  },
  garageLocation: {
    fontSize: 15,
    color: Colors.neutral700 || '#374151',
    fontFamily: 'Coinbase_Sans-Medium',
  },
  packageCardNeo: {
    backgroundColor: Colors.neutral0,
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  packageCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  packageCardTitle: {
    fontSize: 18,
    fontFamily: 'Coinbase_Sans-Medium',
    color: Colors.neutral1000 || '#111827',
  },
  packageCardPrice: {
    fontSize: 18,
    fontFamily: 'Coinbase_Sans-Medium',
    color: Colors.primary,
  },
  packageCardPriceGreen: {
    fontSize: 20,
    color: '#5dad32',
    fontFamily: 'Coinbase_Sans-Medium',
    marginBottom: 4,
    marginTop: 2,
  },
  packageCardDescription: {
    fontSize: 15,
    color: Colors.neutral700 || '#374151',
    marginBottom: 6,
    fontFamily: 'Coinbase_Sans-Medium',
  },
  packageCardDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  packageCardDetailText: {
    fontSize: 14,
    color: Colors.neutral600,
    fontFamily: 'Coinbase_Sans-Medium',
    marginRight: 8,
  },
  packageCardServicesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 6,
  },
  packageServiceBadge: {
    backgroundColor: Colors.primary + '10',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  packageServiceBadgeText: {
    fontSize: 13,
    color: Colors.primary,
    fontFamily: 'Coinbase_Sans-Medium',
  },
  packageCardPartsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  packageCardPartsLabel: {
    fontSize: 13,
    color: Colors.neutral600,
    fontFamily: 'Coinbase_Sans-Medium',
  },
  packageCardPartsText: {
    fontSize: 13,
    color: Colors.neutral700,
    fontFamily: 'Coinbase_Sans-Medium',
  },
  packageCardNotes: {
    fontSize: 13,
    color: Colors.neutral500,
    fontStyle: 'italic',
    marginBottom: 6,
    fontFamily: 'Coinbase_Sans-Medium',
  },
  packageCardBookBtn: {
    marginTop: 8,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  packageCardBookBtnText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Coinbase_Sans-Medium',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 8,
    marginTop: 2,
  },
  filterChip: {
    backgroundColor: Colors.neutral100,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 6,
  },
  filterChipActive: {
    backgroundColor: Colors.primary + '18',
  },
  filterChipText: {
    fontSize: 14,
    color: Colors.neutral700,
    fontFamily: 'Coinbase_Sans-Medium',
  },
  filterChipTextActive: {
    color: Colors.primary,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral0,
    borderRadius: 18,
    marginHorizontal: 18,
    marginBottom: 8,
    marginTop: 2,
    paddingVertical: 4,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.neutral900,
    fontFamily: 'Coinbase_Sans-Medium',
    paddingVertical: 6,
    paddingHorizontal: 2,
    backgroundColor: 'transparent',
  },
})

export default AllServicesScreen
