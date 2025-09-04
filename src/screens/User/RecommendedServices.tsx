import type React from 'react';
import { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../constants/colors';
import BottomNavigation from '../../components/BottomNav';
import ServiceCard from '../../components/ServiceCard';
import Header from '../../components/Header'
import SearchBar from '../../components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';
import AppointmentBottomSheet from '../../components/AppointmentSheet';
import Button from '../../components/Button';
import Icon from 'react-native-vector-icons/Ionicons';

interface RecommendedServicesScreenProps {
  onBack?: () => void;
  onViewRecommended?: () => void;
  handleTabPress?: () => void;
}

const RecommendedServicesScreen: React.FC<RecommendedServicesScreenProps> = ({
  onBack,
  onViewRecommended,
  handleTabPress,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(1);
  const [showAppointmentSheet, setShowAppointmentSheet] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleScheduleAppointment = () => {
    setShowAppointmentSheet(true);
  };
  const handleCloseSheet = () => {
    setShowAppointmentSheet(false);
  };
  const handleConfirmAppointment = (appointmentData: any) => {
    console.log('Appointment confirmed:', appointmentData);
    setShowAppointmentSheet(false);
  };

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

  const categories = ['All', 'Maintenance', 'Repair', 'Inspection', 'Emergency', 'Custom'];

  const recommendedServices = [
    {
      id: 1,
      icon: "construct",
      title: "Oil Change & Filter",
      description: "Based on your Toyota Camry's mileage (45,000 km) - Due in 2 weeks",
      category: "Maintenance",
      priority: "high",
      estimatedCost: "$45-65",
      duration: "30-45 min"
    },
    {
      id: 2,
      icon: "car-sport",
      title: "Brake System Inspection",
      description: "Recommended every 6 months for your vehicle's safety",
      category: "Inspection",
      priority: "medium",
      estimatedCost: "$25-40",
      duration: "20-30 min"
    },
    {
      id: 3,
      icon: "settings",
      title: "Tire Rotation & Balance",
      description: "Due based on your driving pattern and tire wear",
      category: "Maintenance",
      priority: "medium",
      estimatedCost: "$35-55",
      duration: "45-60 min"
    },
    {
      id: 4,
      icon: "thermometer",
      title: "Engine Coolant Check",
      description: "Preventive maintenance for optimal engine performance",
      category: "Maintenance",
      priority: "low",
      estimatedCost: "$15-25",
      duration: "15-20 min"
    },
    {
      id: 5,
      icon: "flash",
      title: "Battery Health Check",
      description: "Your battery is 2 years old - recommended check",
      category: "Inspection",
      priority: "medium",
      estimatedCost: "$10-20",
      duration: "10-15 min"
    },
    {
      id: 6,
      icon: "shield-checkmark",
      title: "Safety System Diagnostic",
      description: "Comprehensive check of ABS, airbags, and safety features",
      category: "Inspection",
      priority: "low",
      estimatedCost: "$30-50",
      duration: "30-45 min"
    }
  ];

  const filteredServices = selectedCategory === 'All' 
    ? recommendedServices 
    : recommendedServices.filter(service => service.category === selectedCategory);

  const CategoryChip = ({ title, isSelected, onPress }: { title: string; isSelected: boolean; onPress: () => void }) => (
    <TouchableOpacity
      style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
      onPress={onPress}
    >
      <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextSelected]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return Colors.danger;
      case 'medium': return Colors.warning;
      case 'low': return Colors.success;
      default: return Colors.neutral500;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      case 'low': return 'Low Priority';
      default: return 'Standard';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon="back"
        name="John Doe"
        image=""
        onIconPress={() => navigation.navigate('Home')}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Recommended Services</Text>
          <Text style={styles.headerSubtitle}>
            Personalized recommendations based on your Toyota Camry and service history
          </Text>
        </View>

        {/* Search Bar */}
        <SearchBar
          containerStyle={styles.searchBar}
          placeholder="Search services..."
        />

        {/* Category Filters */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Filter by Category</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
          >
            {categories.map((category) => (
              <CategoryChip
                key={category}
                title={category}
                isSelected={selectedCategory === category}
                onPress={() => setSelectedCategory(category)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Services List */}
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          {filteredServices.map((service) => (
            <View key={service.id} style={styles.serviceCard}>
              <View style={styles.serviceHeader}>
                <View style={styles.serviceIconContainer}>
                  <Icon name={service.icon} size={24} color={Colors.primary} />
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                  <Text style={styles.serviceDescription}>{service.description}</Text>
                </View>
                <View style={styles.priorityBadge}>
                  <Text style={[styles.priorityText, { color: getPriorityColor(service.priority) }]}>
                    {getPriorityText(service.priority)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.serviceDetails}>
                <View style={styles.detailItem}>
                  <Icon name="time-outline" size={16} color={Colors.neutral600} />
                  <Text style={styles.detailText}>{service.duration}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Icon name="card-outline" size={16} color={Colors.neutral600} />
                  <Text style={styles.detailText}>{service.estimatedCost}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Icon name="construct-outline" size={16} color={Colors.neutral600} />
                  <Text style={styles.detailText}>{service.category}</Text>
                </View>
              </View>

              <View style={styles.serviceActions}>
                <TouchableOpacity 
                  style={styles.bookButton}
                  onPress={() => navigation.navigate('Appointment')}
                >
                  <Text style={styles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.infoButton}>
                  <Icon name="information-circle-outline" size={20} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <BottomNavigation
        navItems={navItems}
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primarybg,
  },
  scrollView: {
    flex: 1,
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral900,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.neutral600,
    lineHeight: 20,
  },
  searchBar: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  categorySection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 12,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.neutral100,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  categoryChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    color: Colors.neutral700,
    fontWeight: '500',
  },
  categoryChipTextSelected: {
    color: Colors.neutral0,
  },
  servicesSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  serviceCard: {
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.neutral1000,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.neutral100,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: Colors.neutral600,
    lineHeight: 20,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.neutral100,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  serviceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral100,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: Colors.neutral600,
    marginLeft: 4,
  },
  serviceActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 12,
  },
  bookButtonText: {
    color: Colors.neutral0,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  infoButton: {
    padding: 8,
  },
  bottomButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral100,
  },
});

export default RecommendedServicesScreen; 