import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  TextInput,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
import Colors from '../../constants/colors';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';

const { width: screenWidth } = Dimensions.get('window');

// Completed Work Summary Component
const WorkSummaryCard = ({ workOrder }) => {
  const getTotalCost = () => {
    const laborCost = workOrder.laborHours * workOrder.laborRate;
    const partsCost = workOrder.partsUsed.reduce((sum, part) => sum + (part.price * part.quantity), 0);
    return laborCost + partsCost;
  };

  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryHeader}>
        <View style={styles.completionBadge}>
          <Icon name="checkmark-circle" size={20} color={Colors.success} />
          <Text style={styles.completionText}>Work Completed</Text>
        </View>
        <Text style={styles.completionTime}>{workOrder.completedAt}</Text>
      </View>
      
      <View style={styles.workOrderDetails}>
        <Text style={styles.workOrderId}>#{workOrder.id}</Text>
        <Text style={styles.customerName}>{workOrder.customerName}</Text>
        <Text style={styles.vehicleInfo}>
          {workOrder.vehicle.year} {workOrder.vehicle.make} {workOrder.vehicle.model}
        </Text>
        <Text style={styles.serviceType}>{workOrder.serviceType}</Text>
      </View>

      <View style={styles.timeAndCostInfo}>
        <View style={styles.infoRow}>
          <Icon name="time-outline" size={16} color={Colors.neutral600} />
          <Text style={styles.infoLabel}>Duration:</Text>
          <Text style={styles.infoValue}>{workOrder.totalDuration}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="cash-outline" size={16} color={Colors.neutral600} />
          <Text style={styles.infoLabel}>Total Cost:</Text>
          <Text style={styles.infoValue}>${getTotalCost().toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
};

// Work Details Component
const WorkDetailsSection = ({ workOrder }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <View style={styles.detailsSection}>
      <Text style={styles.sectionTitle}>Work Details</Text>
      
      {/* Services Performed */}
      <TouchableOpacity 
        style={styles.expandableCard}
        onPress={() => toggleSection('services')}
      >
        <View style={styles.expandableHeader}>
          <View style={styles.expandableLeft}>
            <Icon name="build-outline" size={20} color={Colors.primary} />
            <Text style={styles.expandableTitle}>Services Performed</Text>
          </View>
          <Icon 
            name={expandedSection === 'services' ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color={Colors.neutral600} 
          />
        </View>
        
        {expandedSection === 'services' && (
          <View style={styles.expandableContent}>
            {workOrder.servicesPerformed.map((service, index) => (
              <View key={index} style={styles.serviceItem}>
                <Icon name="checkmark-circle-outline" size={16} color={Colors.success} />
                <Text style={styles.serviceText}>{service}</Text>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>

      {/* Parts Used */}
      <TouchableOpacity 
        style={styles.expandableCard}
        onPress={() => toggleSection('parts')}
      >
        <View style={styles.expandableHeader}>
          <View style={styles.expandableLeft}>
            <Icon name="cube-outline" size={20} color={Colors.primary} />
            <Text style={styles.expandableTitle}>Parts Used</Text>
          </View>
          <Icon 
            name={expandedSection === 'parts' ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color={Colors.neutral600} 
          />
        </View>
        
        {expandedSection === 'parts' && (
          <View style={styles.expandableContent}>
            {workOrder.partsUsed.map((part, index) => (
              <View key={index} style={styles.partItem}>
                <View style={styles.partInfo}>
                  <Text style={styles.partName}>{part.name}</Text>
                  <Text style={styles.partNumber}>Part #: {part.partNumber}</Text>
                </View>
                <View style={styles.partCost}>
                  <Text style={styles.partQuantity}>Qty: {part.quantity}</Text>
                  <Text style={styles.partPrice}>${(part.price * part.quantity).toFixed(2)}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>

      {/* Technician Notes */}
      <TouchableOpacity 
        style={styles.expandableCard}
        onPress={() => toggleSection('notes')}
      >
        <View style={styles.expandableHeader}>
          <View style={styles.expandableLeft}>
            <Icon name="document-text-outline" size={20} color={Colors.primary} />
            <Text style={styles.expandableTitle}>Technician Notes</Text>
          </View>
          <Icon 
            name={expandedSection === 'notes' ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color={Colors.neutral600} 
          />
        </View>
        
        {expandedSection === 'notes' && (
          <View style={styles.expandableContent}>
            <Text style={styles.notesText}>{workOrder.technicianNotes}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

// Notification Options Component
const NotificationOptions = ({ onNotify }) => {
  const [selectedMethods, setSelectedMethods] = useState(['sms', 'email']);
  const [customMessage, setCustomMessage] = useState('');

  const notificationMethods = [
    { id: 'sms', icon: 'chatbubble-outline', label: 'SMS Text' },
    { id: 'email', icon: 'mail-outline', label: 'Email' },
    { id: 'call', icon: 'call-outline', label: 'Phone Call' },
    { id: 'push', icon: 'notifications-outline', label: 'App Notification' }
  ];

  const toggleMethod = (methodId) => {
    setSelectedMethods(prev => 
      prev.includes(methodId) 
        ? prev.filter(id => id !== methodId)
        : [...prev, methodId]
    );
  };

  const handleSendNotification = () => {
    if (selectedMethods.length === 0) {
      Alert.alert('Error', 'Please select at least one notification method.');
      return;
    }
    
    onNotify(selectedMethods, customMessage);
  };

  return (
    <View style={styles.notificationSection}>
      <Text style={styles.sectionTitle}>Notify Customer</Text>
      
      <View style={styles.notificationCard}>
        <Text style={styles.notificationSubtitle}>Select notification methods:</Text>
        
        <View style={styles.methodsContainer}>
          {notificationMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodButton,
                selectedMethods.includes(method.id) && styles.methodButtonSelected
              ]}
              onPress={() => toggleMethod(method.id)}
            >
              <Icon 
                name={method.icon} 
                size={20} 
                color={selectedMethods.includes(method.id) ? Colors.neutral0 : Colors.neutral600} 
              />
              <Text style={[
                styles.methodLabel,
                selectedMethods.includes(method.id) && styles.methodLabelSelected
              ]}>
                {method.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.messageContainer}>
          <Text style={styles.messageLabel}>Custom Message (Optional):</Text>
          <TextInput
            style={styles.messageInput}
            placeholder="Add a personal message for the customer..."
            multiline
            numberOfLines={3}
            value={customMessage}
            onChangeText={setCustomMessage}
          />
        </View>

        <Button 
          label = "Send Notification"
          onPress={handleSendNotification}
        />
      </View>
    </View>
  );
};

// Main Completed Work Screen
const CompletedWorkScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState(1);
  const [notificationSent, setNotificationSent] = useState(false);

  // Mock completed work data
  const completedWorkOrder = {
    id: 'WO002',
    customerName: 'Sarah Johnson',
    customerPhone: '+1 (555) 123-4567',
    customerEmail: 'sarah.johnson@email.com',
    vehicle: {
      year: 2019,
      make: 'Honda',
      model: 'Civic',
      vin: '1HGBH41JXMN109186',
      mileage: 45280
    },
    serviceType: 'Brake Inspection & Replacement',
    completedAt: 'Today, 2:45 PM',
    totalDuration: '3h 15m',
    laborHours: 3.25,
    laborRate: 95,
    servicesPerformed: [
      'Brake pad replacement (front)',
      'Brake rotor resurfacing',
      'Brake fluid flush',
      'Brake system inspection',
      'Test drive and quality check'
    ],
    partsUsed: [
      { name: 'Brake Pads - Front Set', partNumber: 'BP-001', quantity: 1, price: 89.99 },
      { name: 'Brake Fluid DOT 3', partNumber: 'BF-003', quantity: 1, price: 12.99 },
      { name: 'Brake Cleaner', partNumber: 'BC-005', quantity: 1, price: 8.99 }
    ],
    technicianNotes: 'Brake pads were worn to 15% remaining. Rotors showed minor scoring but were successfully resurfaced. Brake fluid was dark and due for replacement. All brake components are now within specification. Vehicle test drive completed successfully with proper braking performance.',
    technicianName: 'Mike Rodriguez',
    nextRecommendedService: 'Next brake inspection recommended in 12 months or 15,000 miles'
  };

  const handleNotification = (methods, customMessage) => {
    // Simulate notification sending
    setNotificationSent(true);
    
    const methodsText = methods.map(method => {
      switch(method) {
        case 'sms': return 'SMS';
        case 'email': return 'Email';
        case 'call': return 'Phone Call';
        case 'push': return 'App Notification';
        default: return method;
      }
    }).join(', ');

    Alert.alert(
      'Notification Sent!',
      `Customer has been notified via ${methodsText}. They will receive details about the completed work and can pick up their vehicle.`,
      [{ text: 'OK' }]
    );
  };

  const handleGenerateReceipt = () => {
    Alert.alert(
      'Generate Receipt',
      'This will generate a detailed receipt for the customer including all work performed, parts used, and costs.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Generate PDF', onPress: () => console.log('Generating PDF receipt') },
        { text: 'Send to Customer', onPress: () => console.log('Sending receipt to customer') }
      ]
    );
  };

  const handleCompleteWorkOrder = () => {
    Alert.alert(
      'Complete Work Order',
      'Are you sure you want to mark this work order as complete? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Complete', onPress: () => {
          // Navigate back to work orders or home
          navigation.navigate('Work');
        }}
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon="back"
        name="Work Complete"
        onIconPress={() => navigation.goBack()}
      />
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <WorkSummaryCard workOrder={completedWorkOrder} />
        
        <WorkDetailsSection workOrder={completedWorkOrder} />
        
        <NotificationOptions onNotify={handleNotification} />

        <Button 
          containerStyle = {{marginBottom: 30, marginHorizontal: 30}}
          label="Complete Work"
          onPress={() => navigation.goBack()}
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
  },
  summaryCard: {
    backgroundColor: Colors.neutral0,
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  completionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  completionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.success,
    marginLeft: 6,
  },
  completionTime: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  workOrderDetails: {
    marginBottom: 16,
  },
  workOrderId: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 4,
  },
  customerName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral1000,
    marginBottom: 4,
  },
  vehicleInfo: {
    fontSize: 16,
    color: Colors.neutral600,
    marginBottom: 8,
  },
  serviceType: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral1000,
  },
  timeAndCostInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  detailsSection: {
    backgroundColor: Colors.neutral0,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 16,
  },
  expandableCard: {
    backgroundColor: Colors.neutral50,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  expandableLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  expandableTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  expandableContent: {
    padding: 16,
    paddingTop: 0,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 14,
    color: Colors.neutral1000,
  },
  partItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  partInfo: {
    flex: 1,
  },
  partName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral1000,
  },
  partNumber: {
    fontSize: 12,
    color: Colors.neutral600,
  },
  partCost: {
    alignItems: 'flex-end',
  },
  partQuantity: {
    fontSize: 12,
    color: Colors.neutral600,
  },
  partPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  notesText: {
    fontSize: 14,
    color: Colors.neutral1000,
    lineHeight: 20,
  },
  notificationSection: {
    backgroundColor: Colors.neutral0,
    marginTop: 8,
    padding: 16,
  },
  notificationCard: {
    backgroundColor: Colors.neutral50,
    borderRadius: 12,
    padding: 16,
  },
  notificationSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral1000,
    marginBottom: 16,
  },
  methodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  methodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.neutral0,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  methodButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  methodLabel: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  methodLabelSelected: {
    color: Colors.neutral0,
  },
  messageContainer: {
    marginBottom: 16,
  },
  messageLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral1000,
    marginBottom: 8,
  },
  messageInput: {
    backgroundColor: Colors.neutral0,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
  },
  sendButtonText: {
    color: Colors.neutral0,
    fontSize: 16,
    fontWeight: '600',
  },
  receiptSection: {
    backgroundColor: Colors.neutral0,
    marginTop: 8,
    padding: 16,
  },
  receiptCard: {
    backgroundColor: Colors.neutral50,
    borderRadius: 12,
    padding: 16,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  receiptDate: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  receiptDetails: {
    marginBottom: 16,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  receiptLabel: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  receiptValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral1000,
  },
  costBreakdown: {
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  costLabel: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  costValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral1000,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  generateReceiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.neutral0,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  generateReceiptText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  actionSection: {
    backgroundColor: Colors.neutral0,
    marginTop: 8,
    padding: 16,
    gap: 12,
  },
  completeButton: {
    backgroundColor: Colors.success,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
  },
  completeButtonText: {
    color: Colors.neutral0,
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: Colors.neutral0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  backButtonText: {
    color: Colors.neutral600,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CompletedWorkScreen;