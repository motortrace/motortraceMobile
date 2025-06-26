import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import Icon from 'react-native-vector-icons/Ionicons'
import Colors from "../constants/colors"

interface RewardCardProps {
  title: string
  description: string
  pointsRequired: number
  redeemLocation: string
  category: string
  expiryDate?: string
  isAvailable: boolean
  onRedeem?: () => void
}

const RewardCard: React.FC<RewardCardProps> = ({
  title,
  description,
  pointsRequired,
  redeemLocation,
  category,
  expiryDate,
  isAvailable,
  onRedeem
}) => {
  return (
    <View style={[styles.rewardCard, !isAvailable && styles.unavailableCard]}>
      <View style={styles.cardHeader}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
        <View style={styles.pointsBadge}>
          <Icon name="star" size={12} color={Colors.warning} />
          <Text style={styles.pointsText}>{pointsRequired} pts</Text>
        </View>
      </View>
      
      <Text style={[styles.rewardTitle, !isAvailable && styles.unavailableText]}>
        {title}
      </Text>
      <Text style={[styles.rewardDescription, !isAvailable && styles.unavailableText]}>
        {description}
      </Text>
      
      <View style={styles.rewardDetails}>
        <View style={styles.locationContainer}>
          <Icon 
            name={redeemLocation === "Anywhere" ? "location" : "business"} 
            size={14} 
            color={isAvailable ? Colors.neutral400 : Colors.neutral300} 
          />
          <Text style={[styles.locationText, !isAvailable && styles.unavailableText]}>
            {redeemLocation}
          </Text>
        </View>
        
        {expiryDate && (
          <View style={styles.expiryContainer}>
            <Icon name="time" size={14} color={isAvailable ? Colors.neutral400 : Colors.neutral300} />
            <Text style={[styles.expiryText, !isAvailable && styles.unavailableText]}>
              Expires: {expiryDate}
            </Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity 
        style={[styles.redeemButton, !isAvailable && styles.unavailableButton]}
        disabled={!isAvailable}
        onPress={onRedeem}
      >
        <Text style={[styles.redeemButtonText, !isAvailable && styles.unavailableButtonText]}>
          {isAvailable ? "Redeem Now" : "Not Available"}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  rewardCard: {
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.neutral900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unavailableCard: {
    opacity: 0.6,
    backgroundColor: Colors.neutral50,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.warning,
    marginLeft: 4,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 14,
    color: Colors.neutral600,
    marginBottom: 12,
    lineHeight: 20,
  },
  rewardDetails: {
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 13,
    color: Colors.neutral500,
    marginLeft: 6,
    fontWeight: '500',
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expiryText: {
    fontSize: 12,
    color: Colors.neutral400,
    marginLeft: 6,
  },
  unavailableText: {
    color: Colors.neutral400,
  },
  redeemButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  unavailableButton: {
    backgroundColor: Colors.neutral200,
  },
  redeemButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral0,
  },
  unavailableButtonText: {
    color: Colors.neutral500,
  },
})

export default RewardCard