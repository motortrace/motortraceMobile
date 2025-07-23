import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput,
  Alert,
  Modal,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
import Colors from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';

const { width } = Dimensions.get('window');

// Test Drive Result Modal
const TestDriveResultModal = ({ 
  visible, 
  onClose, 
  onSubmit,
  workOrder,
  testDriveTime
}) => {
  const [result, setResult] = useState(''); // 'passed' or 'failed'
  const [comments, setComments] = useState('');

  const handleSubmit = () => {
    if (!result) {
      Alert.alert('Missing Information', 'Please select a test drive result.');
      return;
    }
    onSubmit(result, comments);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Test Drive Results</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={Colors.neutral600} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalBody}>
            <View style={styles.workOrderSummary}>
              <Text style={styles.summaryText}>Work Order: #{workOrder.id}</Text>
              <Text style={styles.summaryText}>
                Vehicle: {workOrder.vehicle.year} {workOrder.vehicle.make} {workOrder.vehicle.model}
              </Text>
              <Text style={styles.summaryText}>
                Test Drive Duration: {formatTime(testDriveTime)}
              </Text>
            </View>

            <View style={styles.resultSection}>
              <Text style={styles.sectionTitle}>Test Drive Result</Text>
              <View style={styles.resultOptions}>
                <TouchableOpacity
                  style={[
                    styles.resultOption,
                    result === 'passed' && styles.resultOptionSelected,
                    result === 'passed' && { backgroundColor: Colors.success + '20', borderColor: Colors.success }
                  ]}
                  onPress={() => setResult('passed')}
                >
                  <Icon 
                    name="checkmark-circle-outline" 
                    size={24} 
                    color={result === 'passed' ? Colors.success : Colors.neutral400} 
                  />
                  <Text style={[
                    styles.resultOptionText,
                    result === 'passed' && { color: Colors.success }
                  ]}>
                    Passed
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.resultOption,
                    result === 'failed' && styles.resultOptionSelected,
                    result === 'failed' && { backgroundColor: Colors.error + '20', borderColor: Colors.error }
                  ]}
                  onPress={() => setResult('failed')}
                >
                  <Icon 
                    name="close-circle-outline" 
                    size={24} 
                    color={result === 'failed' ? Colors.danger : Colors.neutral400} 
                  />
                  <Text style={[
                    styles.resultOptionText,
                    result === 'failed' && { color: Colors.danger }
                  ]}>
                    Failed
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.commentsSection}>
              <Text style={styles.sectionTitle}>Comments (Optional)</Text>
              <TextInput
                style={styles.commentsInput}
                placeholder="Add any observations or notes about the test drive..."
                multiline
                numberOfLines={4}
                value={comments}
                onChangeText={setComments}
              />
            </View>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit Results</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Main Test Drive Screen Component
const TestDriveScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const workOrder = {
    id: 'WO123456',
    customerName: 'John Doe',
    vehicle: {
        year: 2020,
        make: 'Toyota',
        model: 'Camry',
        plateNumber: 'XYZ-9876',
    },
    serviceType: 'Oil Change & Inspection',
    status: 'in_progress',
  };
  
  const [testDriveStarted, setTestDriveStarted] = useState(false);
  const [testDriveCompleted, setTestDriveCompleted] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [testDriveTime, setTestDriveTime] = useState(0);
  const [testDriveResult, setTestDriveResult] = useState(null);

  // Timer for test drive duration
  useEffect(() => {
    let interval;
    if (testDriveStarted && !testDriveCompleted) {
      interval = setInterval(() => {
        setTestDriveTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [testDriveStarted, testDriveCompleted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTestDrive = () => {
    setTestDriveStarted(true);
    setTestDriveTime(0);
    Alert.alert('Test Drive Started', 'Test drive has begun. Drive safely and test all necessary functions.');
  };

  const handleCompleteTestDrive = () => {
    setTestDriveCompleted(true);
    setShowResultModal(true);
  };

  const handleSubmitResults = (result, comments) => {
    setTestDriveResult({ result, comments });
    setShowResultModal(false);
    
    const resultText = result === 'passed' ? 'passed' : 'failed';
    Alert.alert(
      'Test Drive Complete',
      `Test drive ${resultText}. Work order has been updated.`,
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('AssignedWork')
        }
      ]
    );
  };

  const getStatusColor = () => {
    if (testDriveCompleted) {
      return testDriveResult?.result === 'passed' ? Colors.success : Colors.error;
    }
    if (testDriveStarted) return Colors.warning;
    return Colors.primary;
  };

  const getStatusText = () => {
    if (testDriveCompleted) {
      return testDriveResult?.result === 'passed' ? 'Test Drive Passed' : 'Test Drive Failed';
    }
    if (testDriveStarted) return 'Test Drive In Progress';
    return 'Ready for Test Drive';
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon="back"
        name="Test Drive"
        onIconPress={() => navigation.goBack()}
      />

      <View style={styles.content}>
        {/* Work Order Info */}
        <View style={styles.workOrderInfo}>
          <View style={styles.infoHeader}>
            <Text style={styles.workOrderId}>#{workOrder.id}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusText}>{getStatusText()}</Text>
            </View>
          </View>
          <Text style={styles.customerName}>{workOrder.customerName}</Text>
          <Text style={styles.vehicleInfo}>
            {workOrder.vehicle.year} {workOrder.vehicle.make} {workOrder.vehicle.model}
          </Text>
          <Text style={styles.plateNumber}>Plate: {workOrder.vehicle.plateNumber}</Text>
          <Text style={styles.serviceType}>Service: {workOrder.serviceType}</Text>
        </View>

        {/* Test Drive Timer */}
        {testDriveStarted && (
          <View style={styles.timerContainer}>
            <Icon name="time-outline" size={24} color={Colors.primary} />
            <Text style={styles.timerText}>
              {testDriveCompleted ? 'Total Duration: ' : 'Duration: '}
              {formatTime(testDriveTime)}
            </Text>
          </View>
        )}

        {/* Test Drive Instructions */}
        {testDriveStarted && !testDriveCompleted && (
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Test Drive Instructions</Text>
            <Text style={styles.instructionsText}>
              • Check engine performance and responsiveness{'\n'}
              • Test braking system functionality{'\n'}
              • Verify steering and handling{'\n'}
              • Listen for unusual noises or vibrations{'\n'}
              • Test all electrical systems (lights, indicators, etc.)
            </Text>
          </View>
        )}

        {/* Test Drive Results Display */}
        {testDriveCompleted && testDriveResult && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Test Drive Results</Text>
            <View style={styles.resultDisplay}>
              <Icon 
                name={testDriveResult.result === 'passed' ? 'checkmark-circle' : 'close-circle'} 
                size={32} 
                color={testDriveResult.result === 'passed' ? Colors.success : Colors.error} 
              />
              <Text style={[
                styles.resultText,
                { color: testDriveResult.result === 'passed' ? Colors.success : Colors.error }
              ]}>
                {testDriveResult.result === 'passed' ? 'PASSED' : 'FAILED'}
              </Text>
            </View>
            {testDriveResult.comments && (
              <View style={styles.commentsDisplay}>
                <Text style={styles.commentsTitle}>Comments:</Text>
                <Text style={styles.commentsText}>{testDriveResult.comments}</Text>
              </View>
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          {!testDriveStarted && (
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartTestDrive}
            >
              <Icon name="play-circle-outline" size={20} color={Colors.neutral0} />
              <Text style={styles.startButtonText}>Start Test Drive</Text>
            </TouchableOpacity>
          )}

          {testDriveStarted && !testDriveCompleted && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleCompleteTestDrive}
            >
              <Icon name="checkmark-circle-outline" size={20} color={Colors.neutral0} />
              <Text style={styles.completeButtonText}>Complete Test Drive</Text>
            </TouchableOpacity>
          )}

          {testDriveCompleted && (
            <TouchableOpacity
              style={styles.finishButton}
              onPress={() => navigation.navigate('AssignedWork')}
            >
              <Icon name="arrow-back-outline" size={20} color={Colors.neutral0} />
              <Text style={styles.finishButtonText}>Back to Work Orders</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Test Drive Result Modal */}
      <TestDriveResultModal
        visible={showResultModal}
        onClose={() => setShowResultModal(false)}
        onSubmit={handleSubmitResults}
        workOrder={workOrder}
        testDriveTime={testDriveTime}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral50,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  workOrderInfo: {
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workOrderId: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral1000,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.neutral0,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 4,
  },
  vehicleInfo: {
    fontSize: 14,
    color: Colors.neutral600,
    marginBottom: 2,
  },
  plateNumber: {
    fontSize: 13,
    color: Colors.neutral500,
    marginBottom: 2,
  },
  serviceType: {
    fontSize: 13,
    color: Colors.neutral500,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  timerText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
  },
  instructionsContainer: {
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: Colors.neutral600,
    lineHeight: 20,
  },
  resultsContainer: {
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 16,
  },
  resultDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  resultText: {
    fontSize: 20,
    fontWeight: '700',
  },
  commentsDisplay: {
    backgroundColor: Colors.neutral50,
    borderRadius: 8,
    padding: 12,
  },
  commentsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 4,
  },
  commentsText: {
    fontSize: 13,
    color: Colors.neutral600,
  },
  actionContainer: {
    marginTop: 'auto',
    paddingBottom: 20,
  },
  startButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  startButtonText: {
    color: Colors.neutral0,
    fontSize: 16,
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: Colors.warning,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  completeButtonText: {
    color: Colors.neutral0,
    fontSize: 16,
    fontWeight: '600',
  },
  finishButton: {
    backgroundColor: Colors.success,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  finishButtonText: {
    color: Colors.neutral0,
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.neutral0,
    borderRadius: 16,
    width: width * 0.9,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  modalBody: {
    padding: 20,
  },
  workOrderSummary: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  summaryText: {
    fontSize: 13,
    color: Colors.neutral600,
    marginBottom: 4,
  },
  resultSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 12,
  },
  resultOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  resultOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.neutral50,
    gap: 8,
  },
  resultOptionSelected: {
    borderWidth: 2,
  },
  resultOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral600,
  },
  commentsSection: {
    marginBottom: 20,
  },
  commentsInput: {
    backgroundColor: Colors.neutral50,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Colors.neutral1000,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.neutral200,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: Colors.neutral600,
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    flex: 2,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: Colors.neutral0,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default TestDriveScreen;