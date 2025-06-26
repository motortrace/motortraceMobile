import React, { useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from "react-native"
import Icon from 'react-native-vector-icons/Ionicons'
import Colors from "../constants/colors"
import Header from '../components/Header'

interface HistoryItemProps {
  id: string
  type: 'redeemed' | 'earned' | 'expired'
  title: string
  description: string
  points: number
  date: string
  location?: string
  status: 'completed' | 'pending' | 'expired' | 'cancelled'
  transactionId?: string
}

const HistoryItem: React.FC<HistoryItemProps> = ({
  type,
  title,
  description,
  points,
  date,
  location,
  status,
  transactionId
}) => {
  const getTypeIcon = () => {
    switch (type) {
      case 'redeemed':
        return { name: 'gift-outline', color: Colors.error }
      case 'earned':
        return { name: 'add-circle-outline', color: Colors.success }
      case 'expired':
        return { name: 'time-outline', color: Colors.neutral400 }
      default:
        return { name: 'star-outline', color: Colors.warning }
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return Colors.success
      case 'pending':
        return Colors.warning
      case 'expired':
        return Colors.neutral400
      case 'cancelled':
        return Colors.error
      default:
        return Colors.neutral400
    }
  }

  const typeIcon = getTypeIcon()

  return (
    <View style={styles.historyItem}>
      <View style={styles.itemHeader}>
        <View style={styles.iconContainer}>
          <Icon name={typeIcon.name} size={24} color={typeIcon.color} />
        </View>
        <View style={styles.itemContent}>
          <View style={styles.titleRow}>
            <Text style={styles.itemTitle}>{title}</Text>
            <Text style={[
              styles.pointsText,
              { color: type === 'earned' ? Colors.success : Colors.error }
            ]}>
              {type === 'earned' ? '+' : '-'}{points} pts
            </Text>
          </View>
          <Text style={styles.itemDescription}>{description}</Text>
          
          <View style={styles.itemDetails}>
            <Text style={styles.dateText}>{date}</Text>
            {location && (
              <View style={styles.locationRow}>
                <Icon name="location-outline" size={14} color={Colors.neutral400} />
                <Text style={styles.locationText}>{location}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.statusRow}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '15' }]}>
              <Text style={[styles.statusText, { color: getStatusColor() }]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </View>
            {transactionId && (
              <Text style={styles.transactionId}>ID: {transactionId}</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  )
}

interface RewardHistoryScreenProps {
  onBack?: () => void
}

const RewardHistoryScreen: React.FC<RewardHistoryScreenProps> = ({ onBack }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'redeemed' | 'earned' | 'expired'>('all')

  const historyData = [
    {
      id: '1',
      type: 'redeemed' as const,
      title: 'Free Oil Change',
      description: 'Standard oil change service redeemed',
      points: 500,
      date: 'Jun 20, 2025',
      location: 'Downtown Auto Center',
      status: 'completed' as const,
      transactionId: 'TXN001234'
    },
    {
      id: '2',
      type: 'earned' as const,
      title: 'Service Completion Bonus',
      description: 'Points earned from Premium Package service',
      points: 150,
      date: 'Jun 18, 2025',
      location: 'Metro Car Care',
      status: 'completed' as const,
      transactionId: 'TXN001235'
    },
    {
      id: '3',
      type: 'redeemed' as const,
      title: '20% Off Premium Package',
      description: 'Discount coupon redeemed',
      points: 300,
      date: 'Jun 15, 2025',
      location: 'Elite Auto Services',
      status: 'completed' as const,
      transactionId: 'TXN001236'
    },
    {
      id: '4',
      type: 'earned' as const,
      title: 'Referral Bonus',
      description: 'Points earned from referring a friend',
      points: 200,
      date: 'Jun 12, 2025',
      status: 'completed' as const,
      transactionId: 'TXN001237'
    },
    {
      id: '5',
      type: 'expired' as const,
      title: 'Free Car Wash',
      description: 'Reward expired without redemption',
      points: 250,
      date: 'Jun 10, 2025',
      status: 'expired' as const,
      transactionId: 'TXN001238'
    },
    {
      id: '6',
      type: 'redeemed' as const,
      title: '$50 Service Credit',
      description: 'Service credit applied to tire rotation',
      points: 750,
      date: 'Jun 8, 2025',
      location: 'Any Partner Garage',
      status: 'pending' as const,
      transactionId: 'TXN001239'
    },
    {
      id: '7',
      type: 'earned' as const,
      title: 'Monthly Login Bonus',
      description: 'Points earned for consistent app usage',
      points: 50,
      date: 'Jun 1, 2025',
      status: 'completed' as const,
      transactionId: 'TXN001240'
    }
  ]

  const filteredHistory = historyData.filter(item => 
    selectedFilter === 'all' || item.type === selectedFilter
  )

  const totalPointsEarned = historyData
    .filter(item => item.type === 'earned')
    .reduce((sum, item) => sum + item.points, 0)

  const totalPointsRedeemed = historyData
    .filter(item => item.type === 'redeemed')
    .reduce((sum, item) => sum + item.points, 0)

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon="back"
        name="Reward History"
        image=""
        onIconPress={onBack}
      />

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Icon name="trending-up" size={20} color={Colors.success} />
          <Text style={styles.summaryValue}>{totalPointsEarned}</Text>
          <Text style={styles.summaryLabel}>Total Earned</Text>
        </View>
        <View style={styles.summaryCard}>
          <Icon name="trending-down" size={20} color={Colors.error} />
          <Text style={styles.summaryValue}>{totalPointsRedeemed}</Text>
          <Text style={styles.summaryLabel}>Total Redeemed</Text>
        </View>
        <View style={styles.summaryCard}>
          <Icon name="star" size={20} color={Colors.warning} />
          <Text style={styles.summaryValue}>{totalPointsEarned - totalPointsRedeemed}</Text>
          <Text style={styles.summaryLabel}>Net Balance</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { key: 'all', label: 'All' },
            { key: 'earned', label: 'Earned' },
            { key: 'redeemed', label: 'Redeemed' },
            { key: 'expired', label: 'Expired' }
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterTab,
                selectedFilter === filter.key && styles.activeFilterTab
              ]}
              onPress={() => setSelectedFilter(filter.key as any)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter.key && styles.activeFilterText
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* History List */}
      <ScrollView style={styles.historyContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.historyList}>
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item) => (
              <HistoryItem
                key={item.id}
                id={item.id}
                type={item.type}
                title={item.title}
                description={item.description}
                points={item.points}
                date={item.date}
                location={item.location}
                status={item.status}
                transactionId={item.transactionId}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="document-text-outline" size={48} color={Colors.neutral300} />
              <Text style={styles.emptyTitle}>No History Found</Text>
              <Text style={styles.emptyDescription}>
                No {selectedFilter === 'all' ? '' : selectedFilter} transactions found
              </Text>
            </View>
          )}
        </View>
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primarybg,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: Colors.neutral900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral900,
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.neutral500,
    marginTop: 4,
    textAlign: 'center',
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.neutral100,
    marginRight: 8,
  },
  activeFilterTab: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: Colors.neutral600,
    fontWeight: '500',
  },
  activeFilterText: {
    color: Colors.neutral0,
  },
  historyContainer: {
    flex: 1,
  },
  historyList: {
    paddingHorizontal: 16,
  },
  historyItem: {
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
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral900,
    flex: 1,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '700',
  },
  itemDescription: {
    fontSize: 14,
    color: Colors.neutral600,
    marginBottom: 8,
    lineHeight: 20,
  },
  itemDetails: {
    marginBottom: 8,
  },
  dateText: {
    fontSize: 13,
    color: Colors.neutral500,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 13,
    color: Colors.neutral500,
    marginLeft: 4,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  transactionId: {
    fontSize: 11,
    color: Colors.neutral400,
    fontFamily: 'monospace',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral600,
    marginTop: 16,
  },
  emptyDescription: {
    fontSize: 14,
    color: Colors.neutral400,
    textAlign: 'center',
    marginTop: 8,
  },
  bottomSpacing: {
    height: 20,
  },
})

export default RewardHistoryScreen