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

interface TestDriveResult {
  success: boolean;
  notes: string;
  issues: string[];
  technician: string;
}

const TestDriveStatusScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [testDriveStatus, setTestDriveStatus] = useState<string>('pending'); // 'pending', 'ongoing', 'completed', 'failed'
  const [testDriveTime, setTestDriveTime] = useState<number>(0);
  const [testDriveResult, setTestDriveResult] = useState<TestDriveResult | null>(null);

  // Mock test drive data - in real app this would come from backend
  const mockTestDriveData = {
    status: 'completed', // Change this to test different states: 'pending', 'ongoing', 'completed', 'failed'
    duration: 15, // minutes
    result: {
      success: true,
      notes: 'Test drive completed successfully. All systems functioning properly.',
      issues: [],
      technician: 'Alex Martinez'
    }
  };

  useEffect(() => {
    // Simulate fetching test drive status from backend
    setTimeout(() => {
      setTestDriveStatus(mockTestDriveData.status);
      setTestDriveTime(mockTestDriveData.duration);
      setTestDriveResult(mockTestDriveData.result);
    }, 1000);
  }, []);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return Colors.warning;
      case 'ongoing': return Colors.info;
      case 'completed': return Colors.success;
      case 'failed': return Colors.danger;
      default: return Colors.neutral400;
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'pending': return 'Scheduled';
      case 'ongoing': return 'In Progress';
      case 'completed': return 'Completed';
      case 'failed': return 'Issues Found';
      default: return 'Unknown';
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'pending': return '⏰';
      case 'ongoing': return '🚗';
      case 'completed': return '✅';
      case 'failed': return '⚠️';
      default: return '❓';
    }
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const renderTestDriveResult = () => {
    if (!testDriveResult) return null;

    return (
      <View style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <Text style={styles.resultTitle}>Test Drive Results</Text>
          <View style={[styles.resultBadge, {
            backgroundColor: testDriveResult.success ? Colors.success + '20' : Colors.danger + '20'
          }]}>
            <Text style={[styles.resultBadgeText, {
              color: testDriveResult.success ? Colors.success : Colors.danger
            }]}>
              {testDriveResult.success ? 'PASSED' : 'ISSUES FOUND'}
            </Text>
          </View>
        </View>

        <Text style={styles.resultNotes}>{testDriveResult.notes}</Text>

        <View style={styles.resultDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duration:</Text>
            <Text style={styles.detailValue}>{formatDuration(testDriveTime)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Technician:</Text>
            <Text style={styles.detailValue}>{testDriveResult.technician}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>{new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        {testDriveResult.issues && testDriveResult.issues.length > 0 && (
          <View style={styles.issuesSection}>
            <Text style={styles.issuesTitle}>Issues Identified:</Text>
            {testDriveResult.issues.map((issue, index) => (
              <Text key={index} style={styles.issueText}>• {issue}</Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon="back"
        name="Test Drive Status"
        image=""
        onIconPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.scrollView}>
        {/* Status Overview */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusIcon, { backgroundColor: getStatusColor(testDriveStatus) + '20' }]}>
              <Text style={styles.statusEmoji}>{getStatusIcon(testDriveStatus)}</Text>
            </View>
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>Test Drive</Text>
              <Text style={[styles.statusSubtitle, { color: getStatusColor(testDriveStatus) }]}>
                {getStatusText(testDriveStatus)}
              </Text>
            </View>
          </View>

          {testDriveStatus === 'ongoing' && (
            <View style={styles.ongoingInfo}>
              <Text style={styles.ongoingText}>Test drive is currently in progress...</Text>
              <Text style={styles.ongoingTime}>Duration: {formatDuration(testDriveTime)}</Text>
            </View>
          )}

          {testDriveStatus === 'completed' && testDriveTime > 0 && (
            <View style={styles.completedInfo}>
              <Text style={styles.completedText}>Test drive completed in {formatDuration(testDriveTime)}</Text>
            </View>
          )}
        </View>

        {/* Test Drive Purpose */}
        <View style={styles.purposeCard}>
          <Text style={styles.sectionTitle}>What is a Test Drive?</Text>
          <Text style={styles.purposeText}>
            After completing repairs and maintenance, our technicians perform a comprehensive test drive to ensure:
          </Text>
          <View style={styles.purposeList}>
            <Text style={styles.purposeItem}>• Engine performance and responsiveness</Text>
            <Text style={styles.purposeItem}>• Brake system functionality</Text>
            <Text style={styles.purposeItem}>• Steering and handling</Text>
            <Text style={styles.purposeItem}>• Transmission operation</Text>
            <Text style={styles.purposeItem}>• Overall vehicle safety</Text>
          </View>
        </View>

        {/* Test Drive Results */}
        {testDriveStatus === 'completed' || testDriveStatus === 'failed' ? (
          renderTestDriveResult()
        ) : (
          <View style={styles.pendingCard}>
            <Text style={styles.pendingTitle}>Test Drive Not Yet Completed</Text>
            <Text style={styles.pendingText}>
              The test drive will be performed after all repairs and maintenance work is finished.
              You'll be notified once the results are available.
            </Text>
          </View>
        )}

        {/* Action Button */}
        {testDriveStatus === 'completed' && (
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.continueButtonText}>Continue to Next Step</Text>
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
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  statusEmoji: {
    fontSize: 24,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  ongoingInfo: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  ongoingText: {
    fontSize: 16,
    color: Colors.neutral700,
    marginBottom: 8,
  },
  ongoingTime: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  completedInfo: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  completedText: {
    fontSize: 16,
    color: Colors.success,
    fontWeight: '500',
  },
  purposeCard: {
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
    marginBottom: 12,
  },
  purposeText: {
    fontSize: 14,
    color: Colors.neutral600,
    marginBottom: 16,
    lineHeight: 20,
  },
  purposeList: {
    gap: 8,
  },
  purposeItem: {
    fontSize: 14,
    color: Colors.neutral700,
    lineHeight: 20,
  },
  resultCard: {
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
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral900,
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  resultBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  resultNotes: {
    fontSize: 14,
    color: Colors.neutral700,
    lineHeight: 20,
    marginBottom: 16,
  },
  resultDetails: {
    backgroundColor: Colors.neutral50,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  detailValue: {
    fontSize: 14,
    color: Colors.neutral900,
    fontWeight: '500',
  },
  issuesSection: {
    marginTop: 16,
  },
  issuesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 8,
  },
  issueText: {
    fontSize: 14,
    color: Colors.danger,
    lineHeight: 20,
    marginBottom: 4,
  },
  pendingCard: {
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
  pendingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 12,
  },
  pendingText: {
    fontSize: 14,
    color: Colors.neutral600,
    lineHeight: 20,
  },
  actionSection: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral0,
  },
});

export default TestDriveStatusScreen;