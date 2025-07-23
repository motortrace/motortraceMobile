// CarSelection.js
import React from 'react';
import {
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity, 
    StyleSheet 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';

const CarSelection = ({ cars, selectedCar, onCarSelect, onAddCar }) => (
  <View style={styles.carSection}>
    <View style={styles.carSectionHeader}>
      <Text style={styles.carSectionTitle}>My Vehicles</Text>
    </View>

    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carList}>
      {cars.map(car => (
        <TouchableOpacity 
          key={car.id}
          style={[
            styles.carCard,
            selectedCar?.id === car.id && styles.carCardSelected
          ]}
          onPress={() => onCarSelect(selectedCar?.id === car.id ? null : car)}
        >
          <View style={[
            styles.carIcon,
            selectedCar?.id === car.id && styles.carIconSelected
          ]}>
            <Icon name="car" size={35} color={selectedCar?.id === car.id ? Colors.neutral0 : Colors.primary} />
          </View>
          <Text style={[
            styles.carText,
            selectedCar?.id === car.id && styles.carTextSelected
          ]}>
            {car.year} {car.make}
          </Text>
          <Text style={[
            styles.carSubText,
            selectedCar?.id === car.id && styles.carSubTextSelected
          ]}>
            {car.model}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>

    {selectedCar && (
      <View style={styles.selectedCarIndicator}>
        <Text style={styles.selectedCarText}>
          Showing parts for: {selectedCar.year} {selectedCar.make} {selectedCar.model}
        </Text>
        <TouchableOpacity onPress={() => onCarSelect(null)}>
          <Icon name="close" size={16} color={Colors.neutral600} />
        </TouchableOpacity>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  carSection: {
    paddingVertical: 16,
    backgroundColor: Colors.neutral0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral50,
  },
  carSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  carSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  carList: {
    paddingHorizontal: 20,
  },
  carCard: {
    backgroundColor: Colors.neutral100,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 120,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  carCardSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  carIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  carIconSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  carText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral1000,
    textAlign: 'center',
  },
  carTextSelected: {
    color: Colors.neutral0,
  },
  carSubText: {
    fontSize: 12,
    color: Colors.neutral400,
    textAlign: 'center',
  },
  carSubTextSelected: {
    color: Colors.neutral50,
  },
  selectedCarIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.neutral50,
    marginHorizontal: 20,
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
  },
  selectedCarText: {
    fontSize: 14,
    color: Colors.neutral600,
    flex: 1,
  },
});

export default CarSelection;
