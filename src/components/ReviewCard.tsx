import React from "react"
import { View, Text, StyleSheet } from "react-native"
import Colors from "../constants/colors"
import RatingStars from './RatingStars'

interface ReviewCardProps {
  name: string
  rating: number
  comment: string
  date: string
}

const ReviewCard = ({ name, rating, comment, date }: ReviewCardProps) => {
  const getInitials = (fullName: string) => {
    return fullName.split(' ').map(n => n[0]).join('')
  }

  return (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewerInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(name)}
            </Text>
          </View>
          <View style={styles.reviewerDetails}>
            <Text style={styles.reviewerName}>{name}</Text>
            <Text style={styles.reviewDate}>{date}</Text>
          </View>
        </View>
        <RatingStars rating={rating} size={16} />
      </View>
      <Text style={styles.reviewComment}>{comment}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  reviewItem: {
    backgroundColor: Colors.neutral0,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: Colors.neutral1000,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.neutral0,
  },
  reviewerDetails: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.neutral900,
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: Colors.neutral500,
  },
  reviewComment: {
    fontSize: 14,
    color: Colors.neutral700,
    lineHeight: 20,
  },
})

export default ReviewCard