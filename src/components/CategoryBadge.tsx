import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface CategoryBadgeProps {
  category: string;
  categoryColor: string;
  categoryBg: string;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  categoryColor,
  categoryBg,
  containerStyle,
  textStyle,
}) => {
  return (
    <View style={[styles.categoryBadge, { backgroundColor: categoryBg }, containerStyle]}>
      <Text style={[styles.categoryText, { color: categoryColor }, textStyle]}>
        {category.toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default CategoryBadge;
