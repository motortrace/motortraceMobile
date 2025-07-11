import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
import Colors from '../../constants/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';

// Status Badge Component
const StatusBadge = ({ status, onStatusChange }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#EAB308';
      case 'in_progress': return '#3B82F6';
      case 'completed': return '#10B981';
      case 'urgent': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'urgent': return 'Urgent';
      default: return 'Unknown';
    }
  };

  return (
    <TouchableOpacity 
      style={styles.statusContainer}
      onPress={onStatusChange}
    >
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
        <Text style={styles.statusText}>{getStatusText(status)}</Text>
      </View>
      <Icon name="create-outline" size={16} color={Colors.primary} />
    </TouchableOpacity>
  );
};

// Service Progress Timeline Component
const ServiceProgressTimeline = ({ currentPhase, phases, onPhaseClick }) => {
  const getPhaseIcon = (phase) => {
    switch (phase.id) {
      case 'status_update': return 'play-circle';
      case 'problem_review': return 'document-text';
      case 'inspection': return 'search';
      case 'parts_request': return 'cube';
      case 'authorization': return 'checkmark-circle';
      case 'execution': return 'construct';
      case 'final_inspection': return 'eye';
      case 'completion': return 'trophy';
      default: return 'ellipse';
    }
  };

  const getPhaseStatus = (phase) => {
    if (phase.status === 'completed') return 'completed';
    if (phase.status === 'current') return 'current';
    if (phase.status === 'pending') return 'pending';
    return 'locked';
  };

  return (
    <View style={styles.timelineContainer}>
      <Text style={styles.timelineTitle}>Service Progress</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timelineScroll}>
        {phases.map((phase, index) => {
          const status = getPhaseStatus(phase);
          const isClickable = status === 'current' || status === 'completed';
          
          return (
            <TouchableOpacity
              key={phase.id}
              style={[
                styles.timelineItem,
                status === 'current' && styles.timelineItemCurrent,
                status === 'completed' && styles.timelineItemCompleted,
              ]}
              onPress={() => isClickable && onPhaseClick(phase)}
              disabled={!isClickable}
            >
              <View style={[
                styles.timelineIcon,
                status === 'current' && styles.timelineIconCurrent,
                status === 'completed' && styles.timelineIconCompleted,
                status === 'pending' && styles.timelineIconPending,
                status === 'locked' && styles.timelineIconLocked,
              ]}>
                <Icon 
                  name={getPhaseIcon(phase)} 
                  size={16} 
                  color={
                    status === 'completed' ? Colors.success :
                    status === 'current' ? Colors.primary :
                    status === 'pending' ? Colors.warning :
                    Colors.neutral400
                  } 
                />
              </View>
              <Text style={[
                styles.timelineText,
                status === 'current' && styles.timelineTextCurrent,
                status === 'completed' && styles.timelineTextCompleted,
                status === 'locked' && styles.timelineTextLocked,
              ]}>
                {phase.name}
              </Text>
              {phase.timestamp && (
                <Text style={styles.timelineTimestamp}>{phase.timestamp}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

// Vehicle and Service Info Component
const VehicleServiceInfo = ({ customer, vehicle, service, workOrder }) => (
  <View style={styles.infoCard}>
    <View style={styles.cardHeader}>
      <Icon name="car-outline" size={20} color={Colors.primary} />
      <Text style={styles.cardTitle}>Service Details</Text>
    </View>
    <View style={styles.cardContent}>
      <View style={styles.serviceHeader}>
        <Text style={styles.serviceType}>{service.type}</Text>
        <Text style={styles.bookingId}>Booking ID: {workOrder.id}</Text>
      </View>
      
      <View style={styles.vehicleSection}>
        <Text style={styles.vehicleInfo}>
          {vehicle.year} {vehicle.make} {vehicle.model}
        </Text>
        <Text style={styles.customerInfo}>{customer.name}</Text>
        <Text style={styles.scheduleInfo}>
          {service.scheduledDate} • {service.estimatedTime}
        </Text>
      </View>
      
      <View style={styles.serviceMetrics}>
        <View style={styles.metricItem}>
          <Icon name="time-outline" size={16} color={Colors.neutral600} />
          <Text style={styles.metricText}>Est. Completion: {service.estimatedCompletion}</Text>
        </View>
      </View>
    </View>
  </View>
);

// Problem Description Component
const ProblemDescription = ({ problems, isVisible }) => {
  if (!isVisible) return null;

  return (
    <View style={styles.infoCard}>
      <View style={styles.cardHeader}>
        <Icon name="alert-circle-outline" size={20} color={Colors.warning} />
        <Text style={styles.cardTitle}>Reported Problems</Text>
      </View>
      <View style={styles.cardContent}>
        {problems.map((problem, index) => (
          <View key={index} style={styles.problemItem}>
            <View style={styles.problemHeader}>
              <Text style={styles.problemTitle}>{problem.title}</Text>
              <View style={[styles.priorityBadge, { backgroundColor: 
                problem.priority === 'High' ? Colors.error : 
                problem.priority === 'Medium' ? Colors.warning : Colors.success 
              }]}>
                <Text style={styles.priorityText}>{problem.priority}</Text>
              </View>
            </View>
            <Text style={styles.problemDescription}>{problem.description}</Text>
            {problem.customerNote && (
              <Text style={styles.customerNote}>Customer Note: {problem.customerNote}</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

// Current Phase Action Component
const CurrentPhaseAction = ({ currentPhase, onAction }) => {
  const getActionButton = (phase) => {
    switch (phase.id) {
      case 'status_update':
        return {
          text: 'Start Service',
          icon: 'play-circle',
          action: () => onAction('start_service')
        };
      case 'problem_review':
        return {
          text: 'Review Complete',
          icon: 'checkmark-circle',
          action: () => onAction('review_complete')
        };
      case 'inspection':
        return {
          text: 'Start Inspection',
          icon: 'search',
          action: () => onAction('start_inspection')
        };
      case 'parts_request':
        return {
          text: 'Request Parts',
          icon: 'cube',
          action: () => onAction('request_parts')
        };
      case 'authorization':
        return {
          text: 'View Authorization',
          icon: 'document-text',
          action: () => onAction('view_authorization')
        };
      case 'execution':
        return {
          text: 'Begin Work',
          icon: 'construct',
          action: () => onAction('begin_work')
        };
      case 'final_inspection':
        return {
          text: 'Final Check',
          icon: 'eye',
          action: () => onAction('final_check')
        };
      default:
        return null;
    }
  };

  const actionButton = getActionButton(currentPhase);
  
  if (!actionButton) return null;

  return (
    <View style={styles.actionContainer}>
      <TouchableOpacity style={styles.primaryButton} onPress={actionButton.action}>
        <Icon name={actionButton.icon} size={20} color={Colors.neutral0} />
        <Text style={styles.primaryButtonText}>{actionButton.text}</Text>
      </TouchableOpacity>
    </View>
  );
};

// Quick Actions Component
const QuickActions = ({ onPhotoUpload, onAddNote, onViewHistory }) => (
  <View style={styles.quickActionsContainer}>
    <Text style={styles.quickActionsTitle}>Quick Actions</Text>
    <View style={styles.quickActionsGrid}>
      <TouchableOpacity style={styles.quickActionButton} onPress={onPhotoUpload}>
        <Icon name="camera-outline" size={24} color={Colors.primary} />
        <Text style={styles.quickActionText}>Photos</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.quickActionButton} onPress={onAddNote}>
        <Icon name="document-text-outline" size={24} color={Colors.primary} />
        <Text style={styles.quickActionText}>Add Note</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.quickActionButton} onPress={onViewHistory}>
        <Icon name="time-outline" size={24} color={Colors.primary} />
        <Text style={styles.quickActionText}>History</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// Main Work Order Details Screen Component
const WorkOrderDetailsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { workOrder } = route.params || {};

  const [currentStatus, setCurrentStatus] = useState(workOrder?.status || 'pending');
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

  // Service phases workflow
  const servicePhases = [
    {
      id: 'status_update',
      name: 'Start Service',
      status: currentPhaseIndex >= 0 ? (currentPhaseIndex > 0 ? 'completed' : 'current') : 'pending',
      timestamp: currentPhaseIndex > 0 ? '21st Sept, 2021 | 15:00' : null
    },
    {
      id: 'problem_review',
      name: 'Review Problems',
      status: currentPhaseIndex >= 1 ? (currentPhaseIndex > 1 ? 'completed' : 'current') : 'pending',
      timestamp: currentPhaseIndex > 1 ? '21st Sept, 2021 | 15:10' : null
    },
    {
      id: 'inspection',
      name: 'Inspection',
      status: currentPhaseIndex >= 2 ? (currentPhaseIndex > 2 ? 'completed' : 'current') : 'pending',
      timestamp: currentPhaseIndex > 2 ? '21st Sept, 2021 | 15:30' : null
    },
    {
      id: 'parts_request',
      name: 'Parts Request',
      status: currentPhaseIndex >= 3 ? (currentPhaseIndex > 3 ? 'completed' : 'current') : 'pending',
      timestamp: currentPhaseIndex > 3 ? '21st Sept, 2021 | 18:02' : null
    },
    {
      id: 'authorization',
      name: 'Authorization',
      status: currentPhaseIndex >= 4 ? (currentPhaseIndex > 4 ? 'completed' : 'current') : 'pending',
      timestamp: currentPhaseIndex > 4 ? '22nd Sept, 2021 | 08:00' : null
    },
    {
      id: 'execution',
      name: 'Work Execution',
      status: currentPhaseIndex >= 5 ? (currentPhaseIndex > 5 ? 'completed' : 'current') : 'pending',
      timestamp: currentPhaseIndex > 5 ? '22nd Sept, 2021 | 09:02' : null
    },
    {
      id: 'final_inspection',
      name: 'Final Inspection',
      status: currentPhaseIndex >= 6 ? (currentPhaseIndex > 6 ? 'completed' : 'current') : 'pending',
      timestamp: currentPhaseIndex > 6 ? '22nd Sept, 2021 | 11:30' : null
    },
    {
      id: 'completion',
      name: 'Completion',
      status: currentPhaseIndex >= 7 ? 'completed' : 'pending',
      timestamp: currentPhaseIndex >= 7 ? '22nd Sept, 2021 | 12:00' : null
    }
  ];

  // Mock data
  const customerData = {
    name: workOrder?.customerName || 'John Smith',
    phone: '(555) 123-4567',
    email: 'john.smith@email.com'
  };

  const vehicleData = {
    year: workOrder?.vehicle?.year || 2020,
    make: workOrder?.vehicle?.make || 'Toyota',
    model: workOrder?.vehicle?.model || 'Camry',
    plateNumber: workOrder?.vehicle?.plateNumber || 'ABC-123',
    vin: 'JTDKARFU4L1234567',
    mileage: '45,230'
  };

  const serviceData = {
    type: workOrder?.serviceType || 'Basic Service',
    scheduledDate: '21st Sept 2021, Monday',
    estimatedTime: '9:00-9:30am',
    estimatedCompletion: 'Tomorrow, 12:30pm'
  };

  const problemsData = [
    {
      title: 'Engine Noise',
      description: 'Customer reported strange grinding noise from engine during acceleration',
      priority: 'High',
      customerNote: 'Noise started 3 days ago, gets worse during morning starts'
    },
    {
      title: 'Brake Performance',
      description: 'Brake pedal feels spongy according to customer',
      priority: 'Medium',
      customerNote: 'Noticed during city driving, seems fine on highway'
    }
  ];

  const currentPhase = servicePhases[currentPhaseIndex];

  const handlePhaseClick = (phase) => {
    const phaseIndex = servicePhases.findIndex(p => p.id === phase.id);
    if (phaseIndex >= 0) {
      setCurrentPhaseIndex(phaseIndex);
    }
  };

  const handleStatusChange = () => {
    if (currentStatus === 'pending') {
      setCurrentStatus('in_progress');
      setCurrentPhaseIndex(0);
    }
  };

  const handlePhaseAction = (action) => {
    switch (action) {
      case 'start_service':
        setCurrentStatus('in_progress');
        setCurrentPhaseIndex(1);
        break;
      case 'review_complete':
        setCurrentPhaseIndex(2);
        break;
      case 'start_inspection':
        navigation.navigate('TechnicianInspection', { workOrder });
        break;
      case 'request_parts':
        navigation.navigate('TechnicianPartsSelection', { workOrder });
        break;
      case 'view_authorization':
        navigation.navigate('AuthorizationScreen', { workOrder });
        break;
      case 'begin_work':
        navigation.navigate('ServiceExecutionScreen', { workOrder });
        break;
      case 'final_check':
        navigation.navigate('FinalInspectionScreen', { workOrder });
        break;
      default:
        break;
    }
  };

  const handlePhotoUpload = () => {
    navigation.navigate('PhotoUploadScreen', { workOrder });
  };

  const handleAddNote = () => {
    Alert.alert(
      'Add Note',
      'This would open a note-taking interface',
      [{ text: 'OK' }]
    );
  };

  const handleViewHistory = () => {
    navigation.navigate('ServiceHistoryScreen', { workOrder });
  };

  const workOrderData = {
    ...workOrder,
    id: workOrder?.id || '123456789'
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon="back"
        name="T"
        onIconPress={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <StatusBadge 
            status={currentStatus} 
            onStatusChange={handleStatusChange}
          />
        </View>

        <VehicleServiceInfo 
          customer={customerData} 
          vehicle={vehicleData} 
          service={serviceData}
          workOrder={workOrderData}
        />

        <ServiceProgressTimeline 
          currentPhase={currentPhase}
          phases={servicePhases}
          onPhaseClick={handlePhaseClick}
        />

        <ProblemDescription 
          problems={problemsData} 
          isVisible={currentPhaseIndex >= 1}
        />

        <CurrentPhaseAction 
          currentPhase={currentPhase}
          onAction={handlePhaseAction}
        />

        <QuickActions 
          onPhotoUpload={handlePhotoUpload}
          onAddNote={handleAddNote}
          onViewHistory={handleViewHistory}
        />
      </ScrollView>
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
  },
  headerSection: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.neutral0,
    textTransform: 'uppercase',
  },
  infoCard: {
    backgroundColor: Colors.neutral0,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
    flex: 1,
  },
  cardContent: {
    gap: 8,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serviceType: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral1000,
  },
  bookingId: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  vehicleSection: {
    marginBottom: 12,
  },
  vehicleInfo: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 4,
  },
  customerInfo: {
    fontSize: 14,
    color: Colors.neutral600,
    marginBottom: 4,
  },
  scheduleInfo: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  serviceMetrics: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricText: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  timelineContainer: {
    backgroundColor: Colors.neutral0,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 16,
  },
  timelineScroll: {
    flexDirection: 'row',
  },
  timelineItem: {
    alignItems: 'center',
    marginRight: 24,
    minWidth: 80,
  },
  timelineItemCurrent: {
    opacity: 1,
  },
  timelineItemCompleted: {
    opacity: 1,
  },
  timelineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  timelineIconCurrent: {
    backgroundColor: Colors.primary,
  },
  timelineIconCompleted: {
    backgroundColor: Colors.success,
  },
  timelineIconPending: {
    backgroundColor: Colors.warning,
  },
  timelineIconLocked: {
    backgroundColor: Colors.neutral200,
  },
  timelineText: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.neutral600,
    marginBottom: 4,
  },
  timelineTextCurrent: {
    color: Colors.primary,
    fontWeight: '600',
  },
  timelineTextCompleted: {
    color: Colors.success,
    fontWeight: '600',
  },
  timelineTextLocked: {
    color: Colors.neutral400,
  },
  timelineTimestamp: {
    fontSize: 10,
    color: Colors.neutral400,
    textAlign: 'center',
  },
  problemItem: {
    padding: 12,
    backgroundColor: Colors.neutral50,
    borderRadius: 12,
    marginBottom: 8,
  },
  problemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  problemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.neutral0,
  },
  problemDescription: {
    fontSize: 14,
    color: Colors.neutral700,
    marginBottom: 8,
  },
  customerNote: {
    fontSize: 14,
    color: Colors.neutral600,
    fontStyle: 'italic',
  },
  actionContainer: {
    marginVertical: 16,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral0,
  },
  quickActionsContainer: {
    backgroundColor: Colors.neutral0,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    backgroundColor: Colors.neutral50,
    borderRadius: 12,
  },
  quickActionText: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default WorkOrderDetailsScreen;