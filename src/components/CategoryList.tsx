import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategoryListProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (id: string) => void;
  containerStyle?: ViewStyle;
  categoryTextStyle?: TextStyle;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  containerStyle,
  categoryTextStyle,
}) => {
  return (
    <View style={[styles.categorySection, containerStyle]}>
      <Text style={styles.sectionTitle}>Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryList}>
        {categories.map(category => {
          const isSelected = selectedCategory === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, isSelected && styles.categoryCardSelected]}
              onPress={() => onCategorySelect(category.id)}
            >
              <Icon
                name={category.icon}
                size={25}
                color={isSelected ? Colors.neutral0 : Colors.primary}
              />
              <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected, categoryTextStyle]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  categorySection: {
    paddingVertical: 16,
    backgroundColor: Colors.neutral0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  categoryList: {
    paddingHorizontal: 20,
  },
  categoryCard: {
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryCardSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.neutral1000,
    marginTop: 4,
    textAlign: 'center',
  },
  categoryTextSelected: {
    color: Colors.neutral0,
  },
});

export default CategoryList;
