import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from "../../constants/colors";
import Button from '../../components/Button';
import Header from '../../components/Header';

interface SimpleServiceDetailScreenProps {
  onBookService?: () => void;
}

const SimpleServiceDetailScreen: React.FC<SimpleServiceDetailScreenProps> = ({  
  onBookService 
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Service Icon & Title */}
        <View style={styles.serviceHeader}>
          <View style={styles.iconContainer}>
            <Icon name="construct-outline" size={50} color={Colors.primary} />
          </View>
          <Text style={styles.serviceName}>Oil Change</Text>
          <Text style={styles.serviceTagline}>Keep your engine running smooth</Text>
        </View>

        {/* Price Card */}
        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>Starting from</Text>
          <Text style={styles.price}>$45.99</Text>
          <Text style={styles.duration}>⏱️ 30-45 minutes</Text>
        </View>

        {/* What's Included */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What's Included</Text>
          <View style={styles.includeItem}>
            <Icon name="checkmark-circle" size={20} color={Colors.primary} />
            <Text style={styles.includeText}>Up to 5 quarts of premium motor oil</Text>
          </View>
          <View style={styles.includeItem}>
            <Icon name="checkmark-circle" size={20} color={Colors.primary} />
            <Text style={styles.includeText}>Oil filter replacement</Text>
          </View>
          <View style={styles.includeItem}>
            <Icon name="checkmark-circle" size={20} color={Colors.primary} />
            <Text style={styles.includeText}>Multi-point inspection</Text>
          </View>
          <View style={styles.includeItem}>
            <Icon name="checkmark-circle" size={20} color={Colors.primary} />
            <Text style={styles.includeText}>Complimentary car wash</Text>
          </View>
        </View>

        {/* Service Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          <View style={styles.infoRow}>
            <Icon name="shield-checkmark-outline" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>3 months or 3,000 miles warranty</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="people-outline" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>Certified technicians</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="time-outline" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>Same day service available</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Service</Text>
          <Text style={styles.description}>
            Regular oil changes are essential for keeping your engine running smoothly. 
            Our certified technicians use high-quality oil and filters to ensure your 
            vehicle performs at its best. We also perform a complimentary multi-point 
            inspection to catch any potential issues early.
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Book Service Button */}
      <View style={styles.bookingContainer}>
        <Button 
          title="Book Oil Change - $45.99"
          onPress={onBookService}
        />
      </View>
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
  },
  serviceHeader: {
    alignItems: 'center',
    padding: 18,
    backgroundColor: Colors.neutral0,
    marginBottom: 12,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.neutral0,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -10,
  },
  serviceName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  serviceTagline: {
    fontSize: 16,
    color: Colors.neutral600,
    textAlign: 'center',
  },
  priceCard: {
    backgroundColor: Colors.neutral0,
    margin: 16,
    marginBottom: 0,
    marginTop: 5,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.neutral500,
    marginBottom: 4,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  duration: {
    fontSize: 16,
    color: Colors.neutral600,
  },
  section: {
    backgroundColor: Colors.neutral0,
    margin: 16,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 16,
  },
  includeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  includeText: {
    fontSize: 16,
    color: Colors.neutral700,
    marginLeft: 12,
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: Colors.neutral700,
    marginLeft: 12,
  },
  description: {
    fontSize: 16,
    color: Colors.neutral700,
    lineHeight: 24,
  },
  bottomSpacing: {
    height: 20,
  },
  bookingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral100,
    backgroundColor: Colors.neutral0,
  },
});

export default SimpleServiceDetailScreen