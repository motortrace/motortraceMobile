import type React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image
} from 'react-native';
import Colors from '../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';

export interface VisitHistory {
  id: number;
  garageName: string;
  garageAddress: string;
  visitDate: string;
  visitTime: string;
  distance: string;
  services: string[];
  totalCost: string;
  rating: number;
  status: 'completed' | 'cancelled' | 'in-progress';
  image: any;
  duration: string;
  paymentMethod: string;
}

interface HistoryCardProps {
  item: VisitHistory;
  onPress?: (item: VisitHistory) => void;
  onRatePress?: (item: VisitHistory) => void;
  showRateAgain?: boolean;
  compact?: boolean; // For smaller card version
}

const HistoryCard: React.FC<HistoryCardProps> = ({
  item,
  onPress,
  onRatePress,
  compact = false,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return Colors.success;
      case 'cancelled':
        return Colors.danger;
      case 'in-progress':
        return Colors.warning;
      default:
        return Colors.neutral500;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
      case 'cancelled':
        return 'close-circle';
      case 'in-progress':
        return 'time';
      default:
        return 'help-circle';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={compact ? 12 : 14}
            color={star <= rating ? Colors.warning : Colors.neutral300}
          />
        ))}
      </View>
    );
  };

  const handlePress = () => {
    onPress?.(item);
  };

  const handleRatePress = () => {
    onRatePress?.(item);
  };

  return (
    <TouchableOpacity 
      style={[styles.historyCard, compact && styles.historyCardCompact]} 
      activeOpacity={0.7}
      onPress={handlePress}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Image 
            source={item.image} 
            style={[styles.garageImage, compact && styles.garageImageCompact]} 
          />
          <View style={styles.garageInfo}>
            <Text style={[styles.garageName, compact && styles.garageNameCompact]} numberOfLines={1}>
              {item.garageName}
            </Text>
            <Text style={[styles.garageAddress, compact && styles.garageAddressCompact]} numberOfLines={1}>
              {item.garageAddress}
            </Text>
            <View style={styles.dateTimeContainer}>
              <Text style={[styles.visitDate, compact && styles.visitDateCompact]}>
                {formatDate(item.visitDate)}
              </Text>
              <Text style={[styles.visitTime, compact && styles.visitTimeCompact]}>
                • {item.visitTime}
              </Text>
              <Text style={[styles.distance, compact && styles.distanceCompact]}>
                • {item.distance}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <Icon
            name={getStatusIcon(item.status)}
            size={compact ? 16 : 20}
            color={getStatusColor(item.status)}
          />
        </View>
      </View>

      {!compact && (
        <View style={styles.servicesContainer}>
          <Text style={styles.servicesLabel}>Services:</Text>
          <View style={styles.servicesTags}>
            {item.services.map((service, index) => (
              <View key={index} style={styles.serviceTag}>
                <Text style={styles.serviceTagText}>{service}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {compact && (
        <View style={styles.servicesContainerCompact}>
          <Text style={styles.servicesCompact} numberOfLines={1}>
            {item.services.join(', ')}
          </Text>
        </View>
      )}

      <View style={styles.cardFooter}>
        <View style={styles.costDurationContainer}>
          <View style={styles.costContainer}>
            <Text style={[styles.totalCost, compact && styles.totalCostCompact]}>
              {item.totalCost}
            </Text>
            {!compact && (
              <Text style={styles.paymentMethod}>{item.paymentMethod}</Text>
            )}
          </View>
          <View style={styles.durationContainer}>
            <Icon 
              name="time-outline" 
              size={compact ? 12 : 14} 
              color={Colors.neutral500} 
            />
            <Text style={[styles.duration, compact && styles.durationCompact]}>
              {item.duration}
            </Text>
          </View>
        </View>
        
        {item.status === 'completed' && (
          <View style={styles.ratingContainer}>
            {renderStars(item.rating)}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  historyCard: {
    backgroundColor: Colors.neutral0,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.shadowSm,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  historyCardCompact: {
    padding: 12,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  garageImage: {
    width: 120,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  garageImageCompact: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 10,
  },
  garageInfo: {
    flex: 1,
  },
  garageName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 2,
  },
  garageNameCompact: {
    fontSize: 15,
    marginBottom: 1,
  },
  garageAddress: {
    fontSize: 15,
    color: Colors.neutral600,
    marginBottom: 4,
  },
  garageAddressCompact: {
    fontSize: 14,
    marginBottom: 3,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  visitDate: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral700,
  },
  visitDateCompact: {
    fontSize: 14,
  },
  visitTime: {
    fontSize: 12,
    color: Colors.neutral500,
    marginLeft: 2,
  },
  visitTimeCompact: {
    fontSize: 12,
  },
  distance: {
    fontSize: 14,
    color: Colors.neutral500,
    marginLeft: 2,
  },
  distanceCompact: {
    fontSize: 12,
  },
  statusContainer: {
    alignItems: 'center',
  },
  servicesContainer: {
    marginBottom: 12,
  },
  servicesContainerCompact: {
    marginBottom: 8,
  },
  servicesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral700,
    marginBottom: 6,
  },
  servicesCompact: {
    fontSize: 11,
    color: Colors.neutral600,
    fontStyle: 'italic',
  },
  servicesTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  serviceTag: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  serviceTagText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  costDurationContainer: {
    flex: 1,
  },
  costContainer: {
    marginBottom: 4,
  },
  totalCost: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.neutral900,
  },
  totalCostCompact: {
    fontSize: 14,
  },
  paymentMethod: {
    fontSize: 14,
    color: Colors.neutral500,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  duration: {
    fontSize: 14,
    color: Colors.neutral500,
  },
  durationCompact: {
    fontSize: 11,
  },
  ratingContainer: {
    alignItems: 'flex-end',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 4,
  },
  rateAgainButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  rateAgainText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
  },
});

export default HistoryCard;