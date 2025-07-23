import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import Colors from '../../constants/colors';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';
import ServiceProgressCard from '../../components/ServiceProgressCard'

const { width } = Dimensions.get('window');

const ServiceProgressScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Mock service progress data
  const serviceProgress = [
    {
      id: 1,
      category: 'Critical',
      categoryColor: Colors.danger,
      categoryBg: Colors.dangerLight,
      title: 'Brake Pads Replacement',
      description: 'Brake pads are severely worn and require immediate replacement for safety.',
      price: 150,
      estimatedTime: '2 hours',
      status: 'completed',
      startTime: '09:00 AM',
      endTime: '11:00 AM',
      technicianNotes: 'Brake pads were completely worn down to metal. Replaced with premium ceramic pads. Brake fluid also topped up.',
      images: [
        { id: 1, uri: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop', caption: 'Old worn brake pads' },
        { id: 2, uri: 'https://images.unsplash.com/photo-1609520778163-a16fb3b0453e?w=400&h=300&fit=crop', caption: 'New ceramic brake pads installed' },
      ],
    },
    {
      id: 2,
      category: 'Recommended',
      categoryColor: Colors.warning,
      categoryBg: Colors.warningLight,
      title: 'Engine Oil Change',
      description: 'Oil is due for replacement to maintain optimal engine performance.',
      price: 45,
      estimatedTime: '30 minutes',
      status: 'in_progress',
      startTime: '11:15 AM',
      endTime: null,
      technicianNotes: 'Draining old oil. Oil was very dark and thick, good thing we caught this.',
      images: [
        { id: 3, uri: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop', caption: 'Old oil being drained' },
      ],
    },
    {
      id: 3,
      category: 'Critical',
      categoryColor: Colors.danger,
      categoryBg: Colors.dangerLight,
      title: 'Tire Replacement (Front Left)',
      description: 'Tire tread is below safe limits and poses a safety risk.',
      price: 120,
      estimatedTime: '45 minutes',
      status: 'pending',
      startTime: null,
      endTime: null,
      technicianNotes: null,
      images: [],
    },
    {
      id: 4,
      category: 'Recommended',
      categoryColor: Colors.warning,
      categoryBg: Colors.warningLight,
      title: 'Battery Check & Clean',
      description: 'Battery terminals show corrosion and should be cleaned for better performance.',
      price: 30,
      estimatedTime: '20 minutes',
      status: 'pending',
      startTime: null,
      endTime: null,
      technicianNotes: null,
      images: [],
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return Colors.success;
      case 'in_progress':
        return Colors.warning;
      case 'pending':
        return Colors.neutral400;
      default:
        return Colors.neutral400;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'in_progress':
        return '⏳';
      case 'pending':
        return '⏸';
      default:
        return '?';
    }
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setModalVisible(false);
  };

  const getTotalProgress = () => {
    const completed = serviceProgress.filter(item => item.status === 'completed').length;
    const total = serviceProgress.length;
    return { completed, total, percentage: (completed / total) * 100 };
  };

  const progress = getTotalProgress();

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        icon="back"
        name="Service Progress"
        image=""
        onIconPress={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.scrollView}>
        {/* Overall Progress */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Overall Progress</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress.percentage}%` }]} />
          </View>
          <View style={styles.progressStats}>
            <Text style={styles.progressText}>
              {progress.completed} of {progress.total} services completed
            </Text>
            <Text style={styles.progressPercentage}>
              {Math.round(progress.percentage)}%
            </Text>
          </View>
        </View>

        {/* Service Items */}
        <View style={styles.servicesContainer}>
          <Text style={styles.sectionTitle}>Service Details</Text>
            {serviceProgress.map((service) => (
              <ServiceProgressCard
                key={service.id}
                item={service}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
                getStatusText={getStatusText}
                openImageModal={openImageModal}
              />
            ))}
        </View>
      </ScrollView>

      {/* Image Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeImageModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalBackground}
            onPress={closeImageModal}
          >
            <View style={styles.modalContent}>
              {selectedImage && (
                <>
                  <Image source={{ uri: selectedImage.uri }} style={styles.modalImage} />
                  <Text style={styles.modalCaption}>{selectedImage.caption}</Text>
                </>
              )}
              <TouchableOpacity style={styles.closeButton} onPress={closeImageModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primarybg,
  },
  scrollView: {
    flex: 1,
  },
  progressCard: {
    backgroundColor: Colors.neutral0,
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 12,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 15,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.neutral200,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  servicesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    alignItems: 'center',
  },
  modalImage: {
    width: width - 40,
    height: (width - 40) * 0.75,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalCaption: {
    fontSize: 16,
    color: Colors.neutral0,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  closeButtonText: {
    color: Colors.neutral0,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ServiceProgressScreen;