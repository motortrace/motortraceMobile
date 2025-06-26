import React from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from "react-native"
import Icon from 'react-native-vector-icons/Ionicons'
import Colors from "../constants/colors"
import Button from '../components/Button'
import Header from '../components/Header'
import SearchBar from '../components/SearchBar'
import RewardCard from '../components/RewardCard'

interface RewardsScreenProps {
  onBack?: () => void
  userPoints?: number
  onEarnMorePoints?: () => void
  onViewHistory?: () => void
}

const RewardsScreen: React.FC<RewardsScreenProps> = ({ 
  onBack,
  userPoints = 850,
  onEarnMorePoints,
  onViewHistory
}) => {
  const rewards = [
    {
      title: "Free Oil Change",
      description: "Get a complimentary standard oil change service",
      pointsRequired: 500,
      redeemLocation: "Any Partner Garage",
      category: "Service",
      expiryDate: "Dec 31, 2024",
      isAvailable: true
    },
    {
      title: "20% Off Premium Package",
      description: "Save 20% on our comprehensive premium service package",
      pointsRequired: 300,
      redeemLocation: "Downtown Auto Center",
      category: "Discount",
      expiryDate: "Jan 15, 2025",
      isAvailable: true
    },
    {
      title: "$50 Service Credit",
      description: "Apply $50 credit toward any automotive service",
      pointsRequired: 750,
      redeemLocation: "Anywhere",
      category: "Credit",
      isAvailable: true
    },
    {
      title: "Free Car Wash & Detailing",
      description: "Complete exterior wash and interior detailing service",
      pointsRequired: 400,
      redeemLocation: "Metro Car Care",
      category: "Service",
      expiryDate: "Nov 30, 2024",
      isAvailable: true
    },
    {
      title: "Premium Tire Rotation",
      description: "Professional tire rotation and balancing service",
      pointsRequired: 250,
      redeemLocation: "Any Partner Garage",
      category: "Service",
      isAvailable: true
    },
    {
      title: "VIP Service Package",
      description: "Priority booking and premium service treatment",
      pointsRequired: 1200,
      redeemLocation: "Elite Auto Services",
      category: "Premium",
      expiryDate: "Dec 31, 2024",
      isAvailable: false // User doesn't have enough points
    }
  ]

  const handleRewardRedeem = (rewardTitle: string, pointsRequired: number) => {
    console.log(`Redeeming: ${rewardTitle} for ${pointsRequired} points`)
    // Handle reward redemption logic here
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon="back"
        name="John Doe"
        image=""
        onIconPress={onBack}
      />
      
      {/* Points Balance */}
      <View style={styles.pointsHeader}>
        <View style={styles.pointsContainer}>
          <Icon name="star" size={24} color={Colors.warning} />
          <Text style={styles.pointsBalance}>{userPoints} Points Available</Text>
        </View>
        <TouchableOpacity 
          style={styles.historyButton}
          onPress={onViewHistory}
        >
          <Icon name="time-outline" size={18} color={Colors.primary} />
          <Text style={styles.historyText}>History</Text>
        </TouchableOpacity>
      </View>
      
      <SearchBar
        containerStyle={styles.searchBar}
        placeholder="Search rewards..."
      />

      {/* Rewards List */}
      <ScrollView style={styles.rewardsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.rewardsList}>
          <Text style={styles.sectionTitle}>Available Rewards</Text>
          {rewards.map((reward, index) => (
            <RewardCard
              key={index}
              title={reward.title}
              description={reward.description}
              pointsRequired={reward.pointsRequired}
              redeemLocation={reward.redeemLocation}
              category={reward.category}
              expiryDate={reward.expiryDate}
              isAvailable={reward.isAvailable && userPoints >= reward.pointsRequired}
              onRedeem={() => handleRewardRedeem(reward.title, reward.pointsRequired)}
            />
          ))}
        </View>
        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      <View style={styles.earnMoreContainer}>
        <Button 
          onPress={onEarnMorePoints}
          title="Earn More Points"
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primarybg,
  },
  pointsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.neutral0,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 12,
    shadowColor: Colors.neutral900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsBalance: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral900,
    marginLeft: 8,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.primary + '15',
    borderRadius: 8,
  },
  historyText: {
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  searchBar: {
    marginTop: 16,
    marginBottom: 0,
  },
  rewardsContainer: {
    flex: 1,
    marginTop: 10,
  },
  rewardsList: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral900,
    marginBottom: 16,
  },
  bottomSpacing: {
    height: 20,
  },
  earnMoreContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral100,
  },
})

export default RewardsScreen