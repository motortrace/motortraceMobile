import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CarCardProps {
  car: {
    id: string;
    name: string;
    nickname: string;
    model: string;
    year: number;
    image: string;
    mileage: string;
    lastService: string;
    issues: string[];
    status: string;
    statusText: string;
  };
  onPress: (id: string) => void;
  onAddCar?: () => void; // For add car functionality
  isAddCard?: boolean; // To distinguish between car card and add card
  getStatusConfig: (status: string) => {
    icon: string;
    backgroundColor: string;
    color: string;
    textColor: string;
  };
}

const CarCard: React.FC<CarCardProps> = ({ 
  car, 
  onPress, 
  onAddCar, 
  isAddCard = false, 
  getStatusConfig 
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  // Add Car Card
  if (isAddCard) {
    return (
      <TouchableOpacity 
        style={[styles.carCard, styles.addCarCard]} 
        onPress={() => navigation.navigate('CarOnboarding')} 
        activeOpacity={0.7}
      >
        <View style={styles.addCarContent}>
          <View style={styles.addCarIconContainer}>
            <Icon name="add-circle-outline" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.addCarTitle}>Add New Car</Text>
          <Text style={styles.addCarSubtitle}>Register your vehicle</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // Regular Car Card
  const statusConfig = getStatusConfig(car.status);

  return (
    <TouchableOpacity
      style={styles.carCard}
      onPress={() => {
        console.log('Pressed car with id:', car.id);
        AsyncStorage.setItem('selectedCarId', car.id);
        onPress(car.id);
      }}
      activeOpacity={0.8}
    >
      {/* Car Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: car.image }} style={styles.carImage} />
        
        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.backgroundColor }]}>
          <Icon name={statusConfig.icon} size={12} color={statusConfig.color} />
          <Text style={[styles.statusText, { color: statusConfig.textColor }]}>
            {car.statusText}
          </Text>
        </View>

        {/* Issues Indicator */}
        {car.issues.length > 0 && (
          <View style={styles.issuesBadge}>
            <Icon name="warning" size={12} color={Colors.neutral0} />
            <Text style={styles.issuesCount}>{car.issues.length}</Text>
          </View>
        )}

        {/* Gradient Overlay for better text readability */}
        <View style={styles.imageOverlay} />
      </View>

      {/* Car Details */}
      <View style={styles.carDetails}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.carInfo}>
            <Text style={styles.carName} numberOfLines={1}>
              {car.name}
            </Text>
            <Text style={styles.carNickname} numberOfLines={1}>
              "{car.nickname}"
            </Text>
            <Text style={styles.carModel}>
              {car.model} • {car.year}
            </Text>
          </View>
          
          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <View style={styles.statBadge}>
              <Icon name="speedometer-outline" size={14} color={Colors.neutral600} />
              <Text style={styles.statText}>{car.mileage}</Text>
            </View>
          </View>
        </View>

        {/* Service Info */}
        <View style={styles.serviceSection}>
          <Icon name="build-outline" size={14} color={Colors.neutral500} />
          <Text style={styles.serviceText}>
            Last service: {car.lastService}
          </Text>
        </View>

        {/* Issues Preview */}
        {car.issues.length > 0 && (
          <View style={styles.issuesPreview}>
            <View style={styles.issuesHeader}>
              <Icon name="alert-circle-outline" size={14} color={Colors.warning} />
              <Text style={styles.issuesLabel}>
                {car.issues.length} issue{car.issues.length > 1 ? 's' : ''} found
              </Text>
            </View>
            <Text style={styles.issuePreviewText} numberOfLines={1}>
              {car.issues[0]}
              {car.issues.length > 1 && ` +${car.issues.length - 1} more`}
            </Text>
          </View>
        )}

        {/* Action Footer */}
        <View style={styles.actionFooter}>
          <Text style={styles.viewDetailsText}>Tap to view details</Text>
          <Icon name="chevron-forward" size={16} color={Colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  carCard: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: Colors.neutral0,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  
  // Add Car Card Styles
  addCarCard: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    backgroundColor: Colors.primary + '08', // 8% opacity
  },
  addCarContent: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
  },
  addCarIconContainer: {
    marginBottom: 12,
  },
  addCarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  addCarSubtitle: {
    fontSize: 14,
    color: Colors.neutral600,
  },

  // Regular Car Card Styles
  imageContainer: {
    position: 'relative',
    height: 140,
  },
  carImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.3))',
  },
  statusBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 6,
    gap: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  issuesBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: Colors.danger,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  issuesCount: {
    color: Colors.neutral0,
    fontSize: 11,
    fontWeight: '600',
  },
  
  carDetails: {
    padding: 16,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  carInfo: {
    flex: 1,
    marginRight: 12,
  },
  carName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral900,
    marginBottom: 2,
  },
  carNickname: {
    fontSize: 14,
    color: Colors.neutral600,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  carModel: {
    fontSize: 12,
    color: Colors.neutral500,
    fontWeight: '500',
  },
  quickStats: {
    alignItems: 'flex-end',
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral100,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.neutral700,
  },
  
  serviceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  serviceText: {
    fontSize: 12,
    color: Colors.neutral600,
  },
  
  issuesPreview: {
    backgroundColor: Colors.warning + '10', // 10% opacity
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  issuesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  issuesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.warning,
  },
  issuePreviewText: {
    fontSize: 11,
    color: Colors.neutral600,
    marginLeft: 18,
  },
  
  actionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral100,
  },
  viewDetailsText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },
});

export default CarCard;