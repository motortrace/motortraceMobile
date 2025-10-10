import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/colors';
import Header from '../../components/Header';
import BorderButton from '../../components/BorderButton';
import LoadingComponent from '../../components/Loading';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define a type for car issues
interface CarIssue {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  status: 'active' | 'resolved';
}

const CarProfilePage = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [carId, setCarId] = useState<string | null>(null);
  const [issues, setIssues] = useState<CarIssue[]>([]);
  const [showAddIssueModal, setShowAddIssueModal] = useState(false);
  const [newIssueTitle, setNewIssueTitle] = useState('');
  const [newIssueDescription, setNewIssueDescription] = useState('');
  const [newIssuePriority, setNewIssuePriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCarIdAndLoadIssues = async () => {
      const storedCarId = await AsyncStorage.getItem('selectedCarId');
      setCarId(storedCarId);
      if (storedCarId) {
        loadIssues(storedCarId);
      } else {
        setIsLoading(false);
      }
    };
    getCarIdAndLoadIssues();
  }, []);

  const loadIssues = async (vehicleId: string) => {
    try {
      setIsLoading(true);
      // For now, load from local storage. In future, this could be from backend
      const storedIssues = await AsyncStorage.getItem(`car_issues_${vehicleId}`);
      if (storedIssues) {
        setIssues(JSON.parse(storedIssues));
      }
    } catch (error) {
      console.error('Error loading issues:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveIssues = async (updatedIssues: CarIssue[]) => {
    if (!carId) return;
    try {
      await AsyncStorage.setItem(`car_issues_${carId}`, JSON.stringify(updatedIssues));
      setIssues(updatedIssues);
    } catch (error) {
      console.error('Error saving issues:', error);
      Alert.alert('Error', 'Failed to save issue');
    }
  };

  const addIssue = () => {
    if (!newIssueTitle.trim()) {
      Alert.alert('Error', 'Please enter an issue title');
      return;
    }

    const newIssue: CarIssue = {
      id: Date.now().toString(),
      title: newIssueTitle.trim(),
      description: newIssueDescription.trim(),
      priority: newIssuePriority,
      createdAt: new Date().toISOString(),
      status: 'active',
    };

    const updatedIssues = [...issues, newIssue];
    saveIssues(updatedIssues);

    // Reset form
    setNewIssueTitle('');
    setNewIssueDescription('');
    setNewIssuePriority('medium');
    setShowAddIssueModal(false);

    Alert.alert('Success', 'Issue added successfully');
  };

  const resolveIssue = (issueId: string) => {
    const updatedIssues = issues.map(issue =>
      issue.id === issueId ? { ...issue, status: 'resolved' as const } : issue
    );
    saveIssues(updatedIssues);
    Alert.alert('Success', 'Issue marked as resolved');
  };

  const deleteIssue = (issueId: string) => {
    Alert.alert(
      'Delete Issue',
      'Are you sure you want to delete this issue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedIssues = issues.filter(issue => issue.id !== issueId);
            saveIssues(updatedIssues);
          },
        },
      ]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return Colors.danger;
      case 'medium': return Colors.warning;
      case 'low': return Colors.success;
      default: return Colors.neutral600;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return 'warning';
      case 'medium': return 'alert-circle';
      case 'low': return 'information-circle';
      default: return 'help-circle';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header
          icon="back"
          name="Car Profile"
          image=""
          onIconPress={() => navigation.goBack()}
        />
        <LoadingComponent
          loadingText="Loading car profile..."
          size="medium"
          containerStyle={styles.loadingContainer}
          textStyle={styles.loadingText}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        icon="back"
        name="Car Profile"
        image=""
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Car Issues & Maintenance</Text>
          <Text style={styles.subtitle}>
            Track and manage issues for your vehicle
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <BorderButton
            label='Add Issue'
            icon='add-circle-outline'
            onPress={() => setShowAddIssueModal(true)}
            style={{width: '48%', height: 50}}
          />

          <BorderButton
            label='View Services'
            icon='construct-outline'
            onPress={() => navigation.navigate('CarServices')}
            style={{width: '48%', height: 50}}
          />
        </View>

        {/* Issues Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Issues Summary</Text>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{issues.filter(i => i.status === 'active').length}</Text>
              <Text style={styles.statLabel}>Active Issues</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{issues.filter(i => i.status === 'resolved').length}</Text>
              <Text style={styles.statLabel}>Resolved</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{issues.filter(i => i.priority === 'high' && i.status === 'active').length}</Text>
              <Text style={styles.statLabel}>High Priority</Text>
            </View>
          </View>
        </View>

        {/* Active Issues */}
        {issues.filter(issue => issue.status === 'active').length > 0 && (
          <View style={styles.issuesCard}>
            <Text style={styles.cardTitle}>Active Issues</Text>
            {issues
              .filter(issue => issue.status === 'active')
              .map((issue) => (
                <View key={issue.id} style={styles.issueItem}>
                  <View style={styles.issueHeader}>
                    <View style={styles.issueTitleRow}>
                      <Icon
                        name={getPriorityIcon(issue.priority)}
                        size={20}
                        color={getPriorityColor(issue.priority)}
                      />
                      <Text style={styles.issueTitle}>{issue.title}</Text>
                    </View>
                    <View style={styles.issueActions}>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.resolveButton]}
                        onPress={() => resolveIssue(issue.id)}
                      >
                        <Icon name="checkmark-circle" size={16} color={Colors.success} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => deleteIssue(issue.id)}
                      >
                        <Icon name="trash-outline" size={16} color={Colors.danger} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  {issue.description && (
                    <Text style={styles.issueDescription}>{issue.description}</Text>
                  )}
                  <View style={styles.issueMeta}>
                    <Text style={styles.issueDate}>
                      Added: {new Date(issue.createdAt).toLocaleDateString()}
                    </Text>
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(issue.priority) + '20' }]}>
                      <Text style={[styles.priorityText, { color: getPriorityColor(issue.priority) }]}>
                        {issue.priority.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
          </View>
        )}

        {/* Resolved Issues */}
        {issues.filter(issue => issue.status === 'resolved').length > 0 && (
          <View style={styles.issuesCard}>
            <Text style={styles.cardTitle}>Resolved Issues</Text>
            {issues
              .filter(issue => issue.status === 'resolved')
              .map((issue) => (
                <View key={issue.id} style={styles.issueItem}>
                  <View style={styles.issueHeader}>
                    <View style={styles.issueTitleRow}>
                      <Icon
                        name="checkmark-circle"
                        size={20}
                        color={Colors.success}
                      />
                      <Text style={[styles.issueTitle, styles.resolvedTitle]}>{issue.title}</Text>
                    </View>
                  </View>
                  {issue.description && (
                    <Text style={styles.issueDescription}>{issue.description}</Text>
                  )}
                  <View style={styles.issueMeta}>
                    <Text style={styles.issueDate}>
                      Resolved: {new Date(issue.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))}
          </View>
        )}

        {/* Empty State */}
        {issues.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="car-outline" size={64} color={Colors.neutral400} />
            <Text style={styles.emptyStateText}>No issues recorded yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Add issues to keep track of maintenance and problems with your vehicle
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add Issue Modal */}
      <Modal visible={showAddIssueModal} animationType="slide" presentationStyle="formSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddIssueModal(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add New Issue</Text>
            <TouchableOpacity onPress={addIssue}>
              <Text style={styles.modalSaveText}>Add</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Issue Title *</Text>
              <TextInput
                style={styles.formInput}
                value={newIssueTitle}
                onChangeText={setNewIssueTitle}
                placeholder="e.g., Engine oil leak"
                maxLength={100}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Description</Text>
              <TextInput
                style={[styles.formInput, styles.descriptionInput]}
                value={newIssueDescription}
                onChangeText={setNewIssueDescription}
                placeholder="Describe the issue in detail..."
                multiline
                numberOfLines={4}
                maxLength={500}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Priority</Text>
              <View style={styles.priorityOptions}>
                {(['low', 'medium', 'high'] as const).map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityOption,
                      newIssuePriority === priority && styles.priorityOptionSelected
                    ]}
                    onPress={() => setNewIssuePriority(priority)}
                  >
                    <Icon
                      name={getPriorityIcon(priority)}
                      size={20}
                      color={newIssuePriority === priority ? Colors.neutral0 : getPriorityColor(priority)}
                    />
                    <Text style={[
                      styles.priorityOptionText,
                      newIssuePriority === priority && styles.priorityOptionTextSelected
                    ]}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
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
  headerSection: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral900,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.neutral600,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  summaryCard: {
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
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral900,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.neutral600,
    marginTop: 4,
  },
  issuesCard: {
    backgroundColor: Colors.neutral0,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
  },
  issueItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral100,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  issueTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral900,
    marginLeft: 8,
    flex: 1,
  },
  resolvedTitle: {
    textDecorationLine: 'line-through',
    color: Colors.neutral500,
  },
  issueActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
  resolveButton: {
    backgroundColor: Colors.success + '20',
  },
  deleteButton: {
    backgroundColor: Colors.danger + '20',
  },
  issueDescription: {
    fontSize: 14,
    color: Colors.neutral700,
    marginBottom: 8,
    lineHeight: 20,
  },
  issueMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  issueDate: {
    fontSize: 12,
    color: Colors.neutral500,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
    marginHorizontal: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral600,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.neutral500,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.neutral50,
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
    backgroundColor: Colors.neutral0,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  priorityOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.neutral0,
    gap: 8,
  },
  priorityOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  priorityOptionText: {
    fontSize: 14,
    color: Colors.neutral700,
    fontWeight: '500',
  },
  priorityOptionTextSelected: {
    color: Colors.neutral0,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.neutral600,
    fontWeight: '500',
  },
});

export default CarProfilePage;