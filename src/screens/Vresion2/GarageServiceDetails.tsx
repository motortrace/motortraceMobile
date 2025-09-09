import React, { useState } from "react"
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  ImageBackground,
  Image,
  Dimensions
} from "react-native"
import Icon from 'react-native-vector-icons/Ionicons'
import Colors from "../../constants/colors"
import Button from '../../components/Button'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { RootStackParamList } from '../../../App'
import Header from '../../components/Header'
import AppointmentBottomSheet from '../../components/AppointmentSheet';

const { width } = Dimensions.get('window')

interface ServiceDetailsProps {
  onBack?: () => void
  onBookAppointment?: () => void
}

interface ServiceDetail {
  id: string
  name: string
  description: string
  detailedDescription: string
  icon: string
  price: string
  duration: string
  rating: number
  reviewCount: number
  features: string[]
  images: string[]
  warranty: string
  whatIncluded: string[]
  whyChoose: string[]
}

const ServiceDetailsPage: React.FC<ServiceDetailsProps> = ({ 
  onBack, 
  onBookAppointment 
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const route = useRoute()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showAppointmentSheet, setShowAppointmentSheet] = useState(false);

  // Sample service data - in a real app, this would come from props or API
  const serviceData: ServiceDetail = {
    id: "oil-change-001",
    name: "Premium Oil Change Service",
    description: "Complete oil replacement and filter change with quality motor oil.",
    detailedDescription: "Our premium oil change service includes a comprehensive inspection of your vehicle's engine oil system. We use only high-quality motor oil and genuine filters to ensure optimal engine performance and longevity.",
    icon: "construct-outline",
    price: "$45.99",
    duration: "30-45 mins",
    rating: 4.8,
    reviewCount: 142,
    warranty: "6 months / 6,000 miles",
    features: [
      "High-quality synthetic or conventional oil",
      "Premium oil filter replacement",
      "Multi-point inspection",
      "Fluid level check",
      "Battery test",
      "Visual brake inspection"
    ],
    whatIncluded: [
      "Up to 5 quarts of motor oil",
      "New oil filter",
      "Disposal of old oil and filter",
      "Windshield washer fluid top-off",
      "Tire pressure check",
      "Complete vehicle inspection report"
    ],
    whyChoose: [
      "Certified technicians with 10+ years experience",
      "Quick service without appointment",
      "Competitive pricing with quality guarantee",
      "Comfortable waiting area with Wi-Fi",
      "Digital inspection report sent to your phone"
    ],
    images: [
      require('../../assets/images/Garage.jpg'),
      require('../../assets/images/Google.png'),
      require('../../assets/images/car.png')
    ]
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon key={i} name="star" size={16} color={Colors.warning} />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <Icon key="half" name="star-half" size={16} color={Colors.warning} />
      )
    }

    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Icon key={`empty-${i}`} name="star-outline" size={16} color={Colors.neutral300} />
      )
    }

    return stars
  }

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

  const handleBookAppointment = () => {
    handleScheduleAppointment();
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon="back"
        name="John Doe"
        image=""
        onIconPress={() => navigation.navigate('GarageServices')}
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Service Images */}
        <View style={styles.imageContainer}>
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width)
              setSelectedImageIndex(index)
            }}
          >
            {serviceData.images.map((image, index) => (
              <ImageBackground
                key={index}
                source={image}
                style={styles.serviceImage}
                imageStyle={styles.serviceImageStyle}
              >
                <View style={styles.imageOverlay} />
              </ImageBackground>
            ))}
          </ScrollView>
          
          {/* Image Indicators */}
          <View style={styles.imageIndicators}>
            {serviceData.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  selectedImageIndex === index && styles.activeIndicator
                ]}
              />
            ))}
          </View>
        </View>

        {/* Service Info */}
        <View style={styles.serviceInfo}>
          <View style={styles.serviceHeader}>
            <View style={styles.iconContainer}>
              <Icon name={serviceData.icon} size={24} color={Colors.primary} />
            </View>
            <View style={styles.serviceHeaderText}>
              <Text style={styles.serviceName}>{serviceData.name}</Text>
              <View style={styles.ratingContainer}>
                <View style={styles.stars}>
                  {renderStars(serviceData.rating)}
                </View>
                <Text style={styles.ratingText}>
                  {serviceData.rating} ({serviceData.reviewCount} reviews)
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>{serviceData.price}</Text>
            <Text style={styles.duration}>{serviceData.duration}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Service</Text>
          <Text style={styles.description}>{serviceData.detailedDescription}</Text>
        </View>

        {/* Key Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          {serviceData.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Icon name="checkmark-circle" size={20} color={Colors.success} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* What's Included */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What's Included</Text>
          {serviceData.whatIncluded.map((item, index) => (
            <View key={index} style={styles.includedItem}>
              <Icon name="chevron-forward" size={16} color={Colors.primary} />
              <Text style={styles.includedText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Why Choose Us */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose Our Service</Text>
          {serviceData.whyChoose.map((reason, index) => (
            <View key={index} style={styles.reasonItem}>
              <Icon name="star" size={16} color={Colors.warning} />
              <Text style={styles.reasonText}>{reason}</Text>
            </View>
          ))}
        </View>

        {/* Warranty Info */}
        <View style={styles.section}>
          <View style={styles.warrantyCard}>
            <Icon name="shield-checkmark" size={24} color={Colors.primary} />
            <View style={styles.warrantyInfo}>
              <Text style={styles.warrantyTitle}>Service Warranty</Text>
              <Text style={styles.warrantyText}>{serviceData.warranty}</Text>
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Book Appointment Button */}
      <View style={styles.bookingContainer}>
        <View style={styles.priceRow}>
          <Text style={styles.totalLabel}>Total Price:</Text>
          <Text style={styles.totalPrice}>{serviceData.price}</Text>
        </View>
        <Button 
          title="Book Appointment"
          onPress={handleBookAppointment}
        />
      </View>
      <AppointmentBottomSheet
        visible={showAppointmentSheet}
        onClose={handleCloseSheet}
        onConfirm={handleConfirmAppointment}
      />
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 20,
    backgroundColor: Colors.neutral0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral100,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral50,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.neutral900,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral50,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
  },
  serviceImage: {
    width: width,
    height: 250,
    justifyContent: "flex-end",
  },
  serviceImageStyle: {
    resizeMode: "cover",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  imageIndicators: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: Colors.neutral0,
    width: 24,
  },
  serviceInfo: {
    backgroundColor: Colors.neutral0,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral100,
  },
  serviceHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  serviceHeaderText: {
    flex: 1,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.neutral900,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stars: {
    flexDirection: "row",
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.primary,
  },
  duration: {
    fontSize: 14,
    color: Colors.neutral600,
    backgroundColor: Colors.neutral50,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  section: {
    backgroundColor: Colors.neutral0,
    marginTop: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.neutral900,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: Colors.neutral700,
    lineHeight: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: Colors.neutral700,
    marginLeft: 8,
    flex: 1,
  },
  includedItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  includedText: {
    fontSize: 14,
    color: Colors.neutral700,
    marginLeft: 8,
    flex: 1,
  },
  reasonItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  reasonText: {
    fontSize: 14,
    color: Colors.neutral700,
    marginLeft: 8,
    flex: 1,
  },
  warrantyCard: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  warrantyInfo: {
    marginLeft: 12,
  },
  warrantyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 4,
  },
  warrantyText: {
    fontSize: 14,
    color: Colors.neutral700,
  },
  bottomSpacing: {
    height: 20,
  },
  bookingContainer: {
    backgroundColor: Colors.neutral0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral100,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.neutral700,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
  },
})

export default ServiceDetailsPage