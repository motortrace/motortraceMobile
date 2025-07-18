import React, { useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from "react-native"
import Icon from 'react-native-vector-icons/Ionicons'
import Colors from "../../constants/colors"
import RatingStars from '../../components/RatingStars'
import ReviewCard from '../../components/ReviewCard'
import Button from '../../components/Button'
import Header from '../../components/Header'
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';

interface AllReviewsScreenProps {
  onBack?: () => void,
  onScheduleAppointment?: () => void
}

const AllReviewsScreen: React.FC<AllReviewsScreenProps> = ({ onBack, onScheduleAppointment }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [selectedFilter, setSelectedFilter] = useState('All')

  // Extended review data - replace with your actual data
  const allReviews = [
    {
      name: "Jonas Sousa",
      rating: 4,
      comment: "Great service and professional staff. My car was fixed quickly and efficiently. Highly recommend this garage! The waiting area was comfortable and they provided regular updates.",
      date: "2 days ago"
    },
    {
      name: "Isabela Silveira",
      rating: 5,
      comment: "Excellent work! They diagnosed the problem accurately and provided transparent pricing. Will definitely come back. The mechanic explained everything clearly.",
      date: "1 week ago"
    },
    {
      name: "Diego Curumim",
      rating: 4,
      comment: "Good experience overall. The team was knowledgeable and the repair was done on time as promised. Fair pricing and quality work.",
      date: "2 weeks ago"
    },
    {
      name: "Maria Santos",
      rating: 5,
      comment: "Outstanding service! They went above and beyond to fix my car. Very professional and honest about what needed to be done. Highly recommended!",
      date: "3 weeks ago"
    },
    {
      name: "Carlos Silva",
      rating: 3,
      comment: "Decent service but took longer than expected. The quality of work was good though. Communication could be improved during the repair process.",
      date: "1 month ago"
    },
    {
      name: "Ana Costa",
      rating: 5,
      comment: "Perfect experience from start to finish. Fast, reliable, and affordable. The staff was very friendly and accommodating. Will definitely return!",
      date: "1 month ago"
    },
    {
      name: "Pedro Lima",
      rating: 4,
      comment: "Good service and fair pricing. They fixed the issue correctly the first time. The only downside was the busy schedule, had to wait a few days for an appointment.",
      date: "2 months ago"
    },
    {
      name: "Sofia Rodrigues",
      rating: 5,
      comment: "Exceptional service! They saved me a lot of money by finding a more affordable solution. Very trustworthy and skilled mechanics. Highly recommend!",
      date: "2 months ago"
    }
  ]

  const averageRating = 4.3
  const totalReviews = allReviews.length

  const filterOptions = ['All', '5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star']

  const getFilteredReviews = () => {
    if (selectedFilter === 'All') return allReviews
    const stars = parseInt(selectedFilter.split(' ')[0])
    return allReviews.filter(review => review.rating === stars)
  }

  const filteredReviews = getFilteredReviews()

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <Icon name="chevron-back" size={30} color={Colors.neutral0} />
        <Text style={styles.headerTitle}>Reviews</Text>
        <View style={styles.placeholder} />
      </View> */}

      <Header
        icon="back"
        name="John Doe"
        image=""
        onIconPress={() => navigation.navigate('GarageServices')}
      />

      {/* Overall Rating Section */}
      <View style={styles.overallSection}>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingNumber}>{averageRating}</Text>
          <View style={styles.ratingDetails}>
            <RatingStars rating={averageRating} size={20} />
            <Text style={styles.totalReviews}>Based on {totalReviews} reviews</Text>
          </View>
        </View>
      </View>

      {/* Filter Section */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {filterOptions.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === filter && styles.filterTextActive
            ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Reviews List */}
      <ScrollView style={styles.reviewsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.reviewsList}>
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review, index) => (
              <ReviewCard
                key={index}
                name={review.name}
                rating={review.rating}
                comment={review.comment}
                date={review.date}
              />
            ))
          ) : (
            <View style={styles.noReviewsContainer}>
              <Text style={styles.noReviewsText}>
                No reviews found for {selectedFilter}
              </Text>
            </View>
          )}
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
    width: 40,
  },
  overallSection: {
    backgroundColor: Colors.neutral100,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral300,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingNumber: {
    fontSize: 48,
    fontWeight: "700",
    color: Colors.neutral900,
    marginRight: 16,
  },
  ratingDetails: {
    flex: 1,
  },
  totalReviews: {
    fontSize: 14,
    color: Colors.neutral600,
    marginTop: 4,
  },
  filterContainer: {
    maxHeight: 60,
    backgroundColor: Colors.neutral0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral100,
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.neutral50,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: Colors.neutral700,
    fontWeight: "500",
  },
  filterTextActive: {
    color: Colors.neutral0,
    fontWeight: "600",
  },
  reviewsContainer: {
    flex: 1,
  },
  reviewsList: {
    padding: 16,
  },
  noReviewsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  noReviewsText: {
    fontSize: 16,
    color: Colors.neutral500,
    textAlign: "center",
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

export default AllReviewsScreen