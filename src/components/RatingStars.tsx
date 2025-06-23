import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // or your Icon lib
import Colors from '../constants/colors';

interface RatingStarsProps {
  rating: number;
  style?: ViewStyle;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, style }) => {
  const fullStars = Math.floor(rating);

  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon
          key={i}
          name="star"
          size={15}
          color={i < fullStars ? Colors.Star : Colors.neutral200}
          style={styles.starIcon}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  starIcon: {
    marginRight: 4,
  },
});

export default RatingStars;
