import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';

interface GarageCardProps {
  item: {
    id: string | number;
    name: string;
    address: string;
    distance: string;
    rating: string;
    status: string;
    image: string;
    isFavorite?: boolean;
  };
  onPress?: (item: any) => void;
  onFavoritePress?: (item: any) => void;
  style?: ViewStyle;
}

const GarageCard: React.FC<GarageCardProps> = ({ 
  item, 
  onPress, 
  onFavoritePress, 
  style 
}) => {
  const getStatusBackgroundColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return Colors.success;
      case 'closed':
        return Colors.danger;
      case 'busy':
        return Colors.warning;
      default:
        return Colors.neutral500;
    }
  };

  const handleFavoritePress = () => {
    if (onFavoritePress) {
      onFavoritePress(item);
    }
  };

  const handleCardPress = () => {
    if (onPress) {
      onPress(item);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.garageCard, style]} 
      onPress={handleCardPress} 
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        {/* Garage Image */}
        <View style={styles.imageContainer}>
          <Image
            source={typeof item.image === 'string' ? { uri: item.image } : item.image}
            style={styles.garageImage}
          />
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={handleFavoritePress}
            activeOpacity={0.7}
          >
            <Icon 
              name={item.isFavorite ? "heart" : "heart-outline"} 
              size={16} 
              color={item.isFavorite ? 'red' : Colors.neutral600}
            />
          </TouchableOpacity>
        </View>

        {/* Garage Info */}
        <View style={styles.garageInfo}>
          <View style={styles.garageHeader}>
            <Text style={styles.garageName}>{item.name}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>{item.rating}</Text>
              <Icon name="star" size={14} color={Colors.Star} />
            </View>
          </View>
          
          <View style={styles.locationContainer}>
            <Icon name="location-outline" size={14} color={Colors.neutral500} />
            <Text style={styles.address}>{item.address}</Text>
          </View>
          
          <View style={styles.distanceContainer}>
            <Icon name="navigate-outline" size={14} color="#8B5CF6" />
            <Text style={styles.distance}>{item.distance}</Text>
          </View>
        </View>

        {/* Status Button */}
        <View style={styles.statusContainer}>
          <TouchableOpacity 
            style={[
              styles.statusButton, 
              { backgroundColor: getStatusBackgroundColor(item.status) }
            ]}
            onPress={handleCardPress}
            activeOpacity={0.8}
          >
            <Text style={styles.statusText}>{item.status}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  garageCard: {
    backgroundColor: Colors.neutral0,
    borderRadius: 16, // increased from 12
    shadowColor: Colors.shadowLg,
    shadowOffset: {
      width: 0,
      height: 4, // increased
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 16, // optional spacing between cards
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16, // increased from 12
  },
  imageContainer: {
    position: 'relative',
    marginRight: 16, // increased
  },
  garageImage: {
    width: 100, // increased from 80
    height: 100, // increased
    borderRadius: 12,
    backgroundColor: Colors.neutral200,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8, // increased
    left: 8, // increased
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  garageInfo: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  garageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  garageName: {
    fontSize: 18, // increased from 16
    fontWeight: '600',
    color: Colors.neutral900,
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral100,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  rating: {
    fontSize: 14, // was 12
    fontWeight: '500',
    color: Colors.neutral700,
    marginRight: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  address: {
    fontSize: 14, // was 13
    color: Colors.neutral500,
    marginLeft: 6,
    flex: 1,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    fontSize: 14,
    color: '#8B5CF6',
    marginLeft: 6,
    fontWeight: '500',
  },
  statusContainer: {
    justifyContent: 'center',
    marginLeft: 12, // more spacing from content
  },
  statusButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    minWidth: 70,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14, // was 12
    fontWeight: '600',
    color: Colors.neutral0,
    textTransform: 'capitalize',
  },
});

export default GarageCard;