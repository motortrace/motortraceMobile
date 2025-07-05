import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';
import Header from '../components/Header';
import BorderButton from '../components/BorderButton';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';

// Hardcoded car data
const hardcodedCarData = {
  id: 1,
  name: "Honda Civic",
  nickname: "Reliable Runner",
  model: "Honda Civic LX",
  year: 2020,
  image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop",
  status: "active",
  statusText: "Active",
  mileage: "45,230 km",
  lastService: "Mar 15, 2024",
  number: "ABC-1234",
  issues: [
    "Check engine light intermittent",
    "Minor oil leak under engine"
  ],
  services: [
    {
      id: 1,
      type: "Oil Change",
      description: "Regular oil change with synthetic oil and new filter",
      date: "2024-03-15",
      mileage: "44,500 km",
      cost: "85.00"
    },
    {
      id: 2,
      type: "Tire Rotation",
      description: "Rotated all four tires and checked tire pressure",
      date: "2024-01-20",
      mileage: "42,100 km",
      cost: "45.00"
    },
    {
      id: 3,
      type: "Brake Service",
      description: "Replaced front brake pads and checked brake fluid",
      date: "2023-11-10",
      mileage: "39,800 km",
      cost: "220.00"
    }
  ]
};

// Main Car Details Page
const CarDetailsPage = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [car, setCar] = useState(hardcodedCarData);
  const [showMileageModal, setShowMileageModal] = useState(false);

  const getStatusConfig = (status) => {
    const configs = {
      active: { icon: 'checkmark-circle', backgroundColor: Colors.neutral100, color: Colors.success, textColor: Colors.success },
      maintenance: { icon: 'build', backgroundColor: Colors.neutral100, color: Colors.warning, textColor: Colors.danger },
      inactive: { icon: 'pause-circle', backgroundColor: Colors.neutral100 , color: Colors.Purple, textColor: '#4A148C' },
      issues: { icon: 'warning', backgroundColor: Colors.neutral100, color: Colors.danger, textColor: Colors.dan },
    };
    return configs[status] || configs.active;
  };

  const statusConfig = getStatusConfig(car.status);

  return (
    <View style={styles.container}>

      <Header
        icon="back"
        name="John Doe"
        image=""
        onIconPress={() => navigation.navigate('Cars')}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Car Image & Basic Info */}
        <View style={styles.carImageSection}>
          <Image source={{ uri: car.image }} style={styles.carImage} />
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.backgroundColor }]}>
            <Icon name={statusConfig.icon} size={16} color={statusConfig.color} />
            <Text style={[styles.statusText, { color: statusConfig.textColor }]}>
              {car.statusText}
            </Text>
          </View>
        </View>

        {/* Car Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.carName}>{car.name}</Text>
          <Text style={styles.carNickname}>"{car.nickname}"</Text>
          <Text style={styles.carModel}>{car.model} • {car.year}</Text>
          <Text style={styles.carNumber}>{car.number}</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>

          <BorderButton 
            label='Update Mileage'
            icon = 'speedometer-outline'
            onPress={() => setShowMileageModal(true)}
            style={{width: '48%', height: 50}}
          />

          <BorderButton 
            label='Edit Details'
            icon = 'create-outline'
            onPress={() => navigation.navigate('EditCarDetails')}
            style={{width: '48%', height: 50}}
          />

          <BorderButton 
            label='View Services'
            icon = 'construct-outline'
            onPress={() => navigation.navigate('CarServices')}
            style={{width: '48%', height: 50}}
          />

          <BorderButton 
            label='View Products'
            icon = 'cube-outline'
            onPress={() => navigation.navigate('CarProducts')}
            style={{width: '48%', height: 50}}
          />

        </View>

        {/* Current Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>Current Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Icon name="speedometer-outline" size={24} color={Colors.neutral600} />
              <Text style={styles.statLabel}>Current Mileage</Text>
              <Text style={styles.statValue}>{car.mileage}</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="calendar-outline" size={24} color={Colors.neutral600} />
              <Text style={styles.statLabel}>Last Service</Text>
              <Text style={styles.statValue}>{car.lastService}</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="car-outline" size={24} color={Colors.neutral600} />
              <Text style={styles.statLabel}>Total Services</Text>
              <Text style={styles.statValue}>{car.services?.length || 0}</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="alert-circle-outline" size={24} color={Colors.neutral600} />
              <Text style={styles.statLabel}>Active Issues</Text>
              <Text style={styles.statValue}>{car.issues.length}</Text>
            </View>
          </View>
        </View>

        {/* Active Issues */}
        {car.issues.length > 0 && (
          <View style={styles.issuesCard}>
            <Text style={styles.cardTitle}>Active Issues</Text>
            {car.issues.map((issue, index) => (
              <View key={index} style={styles.issueItem}>
                <Icon name="warning" size={16} color={Colors.danger} />
                <Text style={styles.issueText}>{issue}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Service History */}
        <View style={styles.serviceHistoryCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Recent Service History</Text>
          </View>
          
          {car.services && car.services.length > 0 ? (
            car.services.map((service, index) => (
              <View key={index} style={styles.serviceItem}>
                <View style={styles.serviceHeader}>
                  <Text style={styles.serviceDate}>{service.date}</Text>
                  <Text style={styles.serviceMileage}>{service.mileage}</Text>
                </View>
                <Text style={styles.serviceType}>{service.type}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
                <Text style={styles.serviceCost}>${service.cost}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="build-outline" size={32} color={Colors.neutral400} />
              <Text style={styles.emptyStateText}>No service records yet</Text>
              <Text style={styles.emptyStateSubtext}>Add your first service record</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Update Mileage Modal */}
      <UpdateMileageModal
        visible={showMileageModal}
        currentMileage={car.mileage}
        onClose={() => setShowMileageModal(false)}
        onSave={(newMileage) => {
          setCar({
            ...car,
            mileage: newMileage
          });
          setShowMileageModal(false);
        }}
      />
    </View>
  );
};

// Update Mileage Modal Component
const UpdateMileageModal = ({ visible, currentMileage, onClose, onSave }) => {
  const [newMileage, setNewMileage] = useState('');

  const handleSave = () => {
    if (!newMileage.trim()) {
      Alert.alert('Error', 'Please enter the current mileage');
      return;
    }
    onSave(newMileage);
    setNewMileage('');
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="formSheet">
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Update Mileage</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.modalSaveText}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.modalContent}>
          <View style={styles.mileageUpdateContainer}>
            <Text style={styles.currentMileageLabel}>Current Mileage</Text>
            <Text style={styles.currentMileageValue}>{currentMileage}</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>New Mileage *</Text>
              <TextInput
                style={[styles.formInput, styles.mileageInput]}
                value={newMileage}
                onChangeText={setNewMileage}
                placeholder="Enter current mileage"
                keyboardType="numeric"
                autoFocus
              />
            </View>

            <Text style={styles.mileageNote}>
              Please enter the current odometer reading of your vehicle
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral50,
  },
  content: {
    flex: 1,
  },
  carImageSection: {
    position: 'relative',
    height: 200,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  carImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: Colors.neutral0,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  carName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral900,
    marginBottom: 4,
  },
  carNickname: {
    fontSize: 16,
    color: Colors.neutral600,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  carModel: {
    fontSize: 14,
    color: Colors.neutral500,
    fontWeight: '500',
  },
  carNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral800,
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary + '10',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  statsCard: {
    backgroundColor: Colors.neutral0,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral900,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.neutral50,
    borderRadius: 12,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.neutral600,
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.neutral900,
  },
  issuesCard: {
    backgroundColor: Colors.neutral0,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
  },
  issueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  issueText: {
    flex: 1,
    fontSize: 14,
    color: Colors.neutral700,
  },
  serviceHistoryCard: {
    backgroundColor: Colors.neutral0,
    marginHorizontal: 16,
    marginBottom: 32,
    padding: 20,
    borderRadius: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  serviceItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral100,
    paddingBottom: 16,
    marginBottom: 16,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  serviceDate: {
    fontSize: 12,
    color: Colors.neutral600,
    fontWeight: '500',
  },
  serviceMileage: {
    fontSize: 12,
    color: Colors.neutral600,
  },
  serviceType: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: Colors.neutral700,
    marginBottom: 8,
  },
  serviceCost: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral600,
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.neutral500,
    marginTop: 4,
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral100,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral900,
  },
  modalCancelText: {
    fontSize: 16,
    color: Colors.neutral600,
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral700,
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.neutral900,
  },
  serviceTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.neutral0,
  },
  serviceTypeButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  serviceTypeButtonText: {
    fontSize: 14,
    color: Colors.neutral700,
    fontWeight: '500',
  },
  serviceTypeButtonTextActive: {
    color: Colors.neutral0,
    fontWeight: '600',
  },
  mileageUpdateContainer: {
    alignItems: 'center',
    paddingTop: 32,
  },
  currentMileageLabel: {
    fontSize: 14,
    color: Colors.neutral600,
    marginBottom: 4,
  },
  currentMileageValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral900,
    marginBottom: 32,
  },
  mileageInput: {
    textAlign: 'center',
    fontSize: 18,
  },
  mileageNote: {
    fontSize: 12,
    color: Colors.neutral500,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 32,
  },
});

export default CarDetailsPage;