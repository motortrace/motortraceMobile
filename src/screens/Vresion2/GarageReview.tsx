import React, { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ImageBackground } from "react-native"
import Icon from 'react-native-vector-icons/Ionicons'
import Colors from "../../constants/colors"
import ReviewCard from '../../components/ReviewCard'
import TabNavigator from "../../components/TabNavigator"
import Button from '../../components/Button'
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';
import AppointmentBottomSheet from '../../components/AppointmentSheet';

interface ReviewsSectionProps {
  onViewMorePress?: () => void
  onBack?: () => void
  onScheduleAppointment?: () => void
  onToggleFavorite?: () => void
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ 
  onViewMorePress, 
  onBack, 
  onScheduleAppointment, 
  onToggleFavorite 
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isFavorite, setIsFavorite] = useState(false)
  const [showAppointmentSheet, setShowAppointmentSheet] = useState(false);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite)
    onToggleFavorite?.()
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

  const tabToScreenMap = {
    About: 'GarageInfo',
    Services: 'GarageServices',
    Packages: 'GaragePackage',
    Review: 'GarageReview',
  };

  // Sample review data - replace with your actual data
  const reviews = [
    {
      name: "Jonas Sousa",
      rating: 4,
      comment: "Great service and professional staff. My car was fixed quickly and efficiently. Highly recommend this garage!",
      date: "2 days ago"
    },
    {
      name: "Isabela Silveira",
      rating: 5,
      comment: "Excellent work! They diagnosed the problem accurately and provided transparent pricing. Will definitely come back.",
      date: "1 week ago"
    },
    {
      name: "Diego Curumim",
      rating: 4,
      comment: "Good experience overall. The team was knowledgeable and the repair was done on time as promised.",
      date: "2 weeks ago"
    }
  ]

  const averageRating = 4.5
  const totalReviews = 21

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Garage Header Card */}
        <View style={styles.profileCard}>
          <ImageBackground
            source={require('../../assets/images/Garage.jpg')}
            style={styles.profileImage}
            imageStyle={styles.profileImageStyle}
          >
            {/* Overlay */}
            <View style={styles.profileOverlay} />

            {/* Header Controls */}
            <View style={styles.profileHeader}>
              <TouchableOpacity style={styles.backButton}  onPress={() => navigation.navigate('Locations')}>
                <Icon name="chevron-back" size={24} color={Colors.neutral0} onPress={() => navigation.navigate('Locations')}/>
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
          index = {3}
          tabs={["About", "Services", "Packages", "Review"]}
          onTabPress={(tab) => {
            const screen = tabToScreenMap[tab];
            if (screen) {
              navigation.navigate(screen);
            }
          }}
        />

        <View style={styles.reviewsContainer}>

          {/* Review Cards */}
          <View style={styles.reviewsList}>
            {reviews.map((review, index) => (
              <ReviewCard
                key={index}
                name={review.name}
                rating={review.rating}
                comment={review.comment}
                date={review.date}
              />
            ))}
          </View>

          {/* View More Button */}
          <TouchableOpacity style={styles.viewMoreButton} onPress={() => navigation.navigate('AllReviews')}>
            <Text style={styles.viewMoreText}>View more Reviews</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Book Appointment Button */}
      <View style={styles.scheduleContainer}>
        <Button label="Schedule Appointment" onPress={handleScheduleAppointment} />
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
  reviewsContainer: {
    padding: 16,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.neutral900,
    marginBottom: 16,
    textAlign: "center",
  },
  overallRating: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.neutral50,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.neutral600,
    marginLeft: 8,
  },
  reviewsList: {
    marginBottom: 16,
  },
  viewMoreButton: {
    backgroundColor: Colors.neutral0,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    alignSelf: "center",
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
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

export default ReviewsSection