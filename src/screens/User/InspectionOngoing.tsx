import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Colors from '../../constants/colors';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InspectionOngoingScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [timeRemaining, setTimeRemaining] = useState(45 * 60); // 45 minutes in seconds
  const [isInspectionComplete, setIsInspectionComplete] = useState(false);
  const [inspectionData, setInspectionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock inspection start time
  const inspectionStartTime = new Date();
  const estimatedCompletion = new Date(inspectionStartTime.getTime() + 45 * 60 * 1000);

  useEffect(() => {
    fetchInspectionData();
  }, []);

  const fetchInspectionData = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('token');

      if (!userStr || !token) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      const user = JSON.parse(userStr);

      // Fetch current work order for this customer
      const workOrdersRes = await fetch(`http://10.0.2.2:3000/work-orders?customerId=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (workOrdersRes.ok) {
        const workOrdersData = await workOrdersRes.json();
        const currentWorkOrder = workOrdersData.data?.find((wo: any) =>
          wo.status === 'IN_PROGRESS' && wo.workflowStep === 'INSPECTION'
        );

        if (currentWorkOrder) {
          // Fetch inspection status
          const inspectionRes = await fetch(`http://10.0.2.2:3000/work-orders/${currentWorkOrder.id}/inspections`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (inspectionRes.ok) {
            const inspectionData = await inspectionRes.json();
            setInspectionData({
              workOrder: currentWorkOrder,
              inspections: inspectionData.data || []
            });
          }
        }
      }
    } catch (error) {
      console.error('Error fetching inspection data:', error);
      // Keep mock data for now
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsInspectionComplete(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  // Don't auto-navigate - wait for service adviser to provide services
  // The service adviser will trigger navigation to InspectionResults when ready

  const progressPercentage = ((45 * 60 - timeRemaining) / (45 * 60)) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon="back"
      />

      <ScrollView style={styles.scrollView}>
        {/* Inspection Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>Vehicle Inspection</Text>
            <View style={[styles.statusBadge, isInspectionComplete && styles.statusBadgeComplete]}>
              <Text style={[styles.statusText, isInspectionComplete && styles.statusTextComplete]}>
                {isInspectionComplete ? 'Complete' : 'In Progress'}
              </Text>
            </View>
          </View>

          <Text style={styles.vehicleInfo}>
            {inspectionData?.workOrder?.vehicle ?
              `${inspectionData.workOrder.vehicle.year} ${inspectionData.workOrder.vehicle.make} ${inspectionData.workOrder.vehicle.model} • ${inspectionData.workOrder.vehicle.licensePlate || 'N/A'}` :
              '2020 Toyota Camry • ABC123'
            }
          </Text>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Inspection Progress</Text>
              <Text style={styles.progressPercent}>{Math.round(progressPercentage)}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${progressPercentage}%` }]}
              />
            </View>
          </View>

          {/* Time Remaining */}
          {!isInspectionComplete && (
            <View style={styles.timeSection}>
              <Text style={styles.timeLabel}>Estimated Time Remaining</Text>
              <Text style={styles.timeValue}>{formatTime(timeRemaining)}</Text>
              <Text style={styles.timeSubtext}>
                Expected completion: {estimatedCompletion.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          )}

          {isInspectionComplete && (
            <View style={styles.completeSection}>
              <Text style={styles.completeText}>✅ Inspection completed successfully!</Text>
              <Text style={styles.completeSubtext}>Service adviser has provided recommendations.</Text>
            </View>
          )}
        </View>

        {/* Inspection Steps */}
        <View style={styles.stepsCard}>
          <Text style={styles.sectionTitle}>Current Inspection Process</Text>

          <View style={styles.step}>
            <View style={styles.stepIndicator}>
              <Text style={styles.stepCheckmark}>✓</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Visual Inspection</Text>
              <Text style={styles.stepDescription}>Exterior and interior condition check</Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepIndicator}>
              <Text style={styles.stepCheckmark}>✓</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Fluid Level Check</Text>
              <Text style={styles.stepDescription}>Oil, coolant, brake fluid levels</Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={[styles.stepIndicator, !isInspectionComplete && styles.stepIndicatorActive]}>
              <Text style={[styles.stepCheckmark, !isInspectionComplete && styles.stepCheckmarkActive]}>
                {isInspectionComplete ? '✓' : '⏳'}
              </Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, !isInspectionComplete && styles.stepTitleActive]}>
                Diagnostic Scan
              </Text>
              <Text style={styles.stepDescription}>
                {isInspectionComplete ? 'Computer diagnostic completed' : 'Running computer diagnostics...'}
              </Text>
            </View>
          </View>

          {isInspectionComplete && (
            <View style={styles.step}>
              <View style={[styles.stepIndicator, styles.stepIndicatorComplete]}>
                <Text style={styles.stepCheckmark}>✓</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Report Generation</Text>
                <Text style={styles.stepDescription}>Compiling inspection results</Text>
              </View>
            </View>
          )}
        </View>

        {/* Technician Info */}
        <View style={styles.technicianCard}>
          <Text style={styles.sectionTitle}>Assigned Technician</Text>
          <View style={styles.technicianInfo}>
            <View style={styles.technicianAvatar}>
              <Text style={styles.technicianInitials}>
                {inspectionData?.workOrder?.technician ?
                  `${inspectionData.workOrder.technician.userProfile?.name?.charAt(0) || 'T'}` :
                  'AT'
                }
              </Text>
            </View>
            <View style={styles.technicianDetails}>
              <Text style={styles.technicianName}>
                {inspectionData?.workOrder?.technician?.userProfile?.name || 'Alex Martinez'}
              </Text>
              <Text style={styles.technicianRole}>Senior Technician</Text>
              <Text style={styles.technicianSpecialty}>
                {inspectionData?.workOrder?.technician?.specialization || 'Certified Auto Mechanic'}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Button */}
        {isInspectionComplete && (
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={styles.viewResultsButton}
              onPress={() => navigation.navigate('InspectionResults')}
            >
              <Text style={styles.viewResultsButtonText}>View Service Recommendations</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
    paddingBottom: 20,
  },
  statusCard: {
    backgroundColor: Colors.neutral0,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.neutral900,
  },
  statusBadge: {
    backgroundColor: Colors.warning + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusBadgeComplete: {
    backgroundColor: Colors.success + '20',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.warning,
  },
  statusTextComplete: {
    color: Colors.success,
  },
  vehicleInfo: {
    fontSize: 14,
    color: Colors.neutral600,
    marginBottom: 20,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral900,
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.neutral200,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  timeSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  timeLabel: {
    fontSize: 14,
    color: Colors.neutral600,
    marginBottom: 8,
  },
  timeValue: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 8,
  },
  timeSubtext: {
    fontSize: 12,
    color: Colors.neutral500,
    textAlign: 'center',
  },
  completeSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  completeText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.success,
    marginBottom: 8,
  },
  completeSubtext: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  stepsCard: {
    backgroundColor: Colors.neutral0,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 16,
  },
  step: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepIndicatorActive: {
    backgroundColor: Colors.primary + '20',
  },
  stepIndicatorComplete: {
    backgroundColor: Colors.success + '20',
  },
  stepCheckmark: {
    color: Colors.success,
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepCheckmarkActive: {
    color: Colors.primary,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 4,
  },
  stepTitleActive: {
    color: Colors.primary,
  },
  stepDescription: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  technicianCard: {
    backgroundColor: Colors.neutral0,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  technicianInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  technicianAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  technicianInitials: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral0,
  },
  technicianDetails: {
    flex: 1,
  },
  technicianName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 2,
  },
  technicianRole: {
    fontSize: 14,
    color: Colors.neutral600,
    marginBottom: 2,
  },
  technicianSpecialty: {
    fontSize: 12,
    color: Colors.neutral500,
  },
  actionSection: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
  },
  viewResultsButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  viewResultsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral0,
  },
});

export default InspectionOngoingScreen;