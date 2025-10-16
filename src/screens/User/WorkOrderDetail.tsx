import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App';
import Colors from '../../constants/colors';
import Header from '../../components/Header';
import LoadingComponent from '../../components/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';

type WorkOrderDetailRouteProp = RouteProp<RootStackParamList, 'WorkOrderDetail'>;
type WorkOrderDetailNavigationProp = StackNavigationProp<RootStackParamList, 'WorkOrderDetail'>;

const WorkOrderDetail = () => {
  const navigation = useNavigation<WorkOrderDetailNavigationProp>();
  const route = useRoute<WorkOrderDetailRouteProp>();
  const { workOrder } = route.params;
  const [detailedWorkOrder, setDetailedWorkOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetailedWorkOrder = async () => {
      try {
        setIsLoading(true);
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          Alert.alert('Error', 'Authentication required');
          navigation.goBack();
          return;
        }

        const response = await fetch(`http://10.0.2.2:3000/work-orders/${workOrder.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setDetailedWorkOrder(data.data);
        } else {
          Alert.alert('Error', 'Failed to fetch work order details');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error fetching work order details:', error);
        Alert.alert('Error', 'Failed to fetch work order details');
        navigation.goBack();
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailedWorkOrder();
  }, [workOrder.id, navigation]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: any) => {
    if (amount == null || isNaN(amount)) return '$0.00';
    return `$${Number(amount).toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          icon="back"
          name="Work Order Details"
          image=""
          onIconPress={() => navigation.goBack()}
        />
        <LoadingComponent
          loadingText="Loading work order details..."
          size="medium"
          containerStyle={styles.loadingContainer}
          textStyle={styles.loadingText}
        />
      </SafeAreaView>
    );
  }

  if (!detailedWorkOrder) {
    return null;
  }

  const wo = detailedWorkOrder;

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon="back"
        name="Work Order Details"
        image=""
        onIconPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Work Order Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Order Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Work Order Number:</Text>
            <Text style={styles.value}>{wo.workOrderNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{wo.status}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Job Type:</Text>
            <Text style={styles.value}>{wo.jobType}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Priority:</Text>
            <Text style={styles.value}>{wo.priority}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Source:</Text>
            <Text style={styles.value}>{wo.source}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Workflow Step:</Text>
            <Text style={styles.value}>{wo.workflowStep}</Text>
          </View>
        </View>

        {/* Vehicle Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Make/Model:</Text>
            <Text style={styles.value}>
              {wo.vehicle?.make} {wo.vehicle?.model} {wo.vehicle?.year}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>VIN:</Text>
            <Text style={styles.value}>{wo.vehicle?.vin || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>License Plate:</Text>
            <Text style={styles.value}>{wo.vehicle?.licensePlate || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Odometer Reading:</Text>
            <Text style={styles.value}>{wo.odometerReading || 'N/A'} miles</Text>
          </View>
        </View>

        {/* Dates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Important Dates</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Created:</Text>
            <Text style={styles.value}>{formatDate(wo.createdAt)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Updated:</Text>
            <Text style={styles.value}>{formatDate(wo.updatedAt)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Opened:</Text>
            <Text style={styles.value}>{formatDate(wo.openedAt)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Promised:</Text>
            <Text style={styles.value}>{formatDate(wo.promisedAt)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Closed:</Text>
            <Text style={styles.value}>{formatDate(wo.closedAt)}</Text>
          </View>
        </View>

        {/* Financial Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Subtotal Services:</Text>
            <Text style={styles.value}>{formatCurrency(wo.subtotalServices)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Subtotal Parts:</Text>
            <Text style={styles.value}>{formatCurrency(wo.subtotalParts)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Subtotal:</Text>
            <Text style={styles.value}>{formatCurrency(wo.subtotal)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Discount:</Text>
            <Text style={styles.value}>
              {formatCurrency(wo.discountAmount)} ({wo.discountType}: {wo.discountReason})
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tax:</Text>
            <Text style={styles.value}>{formatCurrency(wo.taxAmount)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Amount:</Text>
            <Text style={styles.value}>{formatCurrency(wo.totalAmount)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Paid Amount:</Text>
            <Text style={styles.value}>{formatCurrency(wo.paidAmount)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Status:</Text>
            <Text style={styles.value}>{wo.paymentStatus}</Text>
          </View>
        </View>

        {/* Service Advisor */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Advisor</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{wo.serviceAdvisor?.userProfile?.firstName} {wo.serviceAdvisor?.userProfile?.lastName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{wo.serviceAdvisor?.userProfile?.phone || 'N/A'}</Text>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Complaint:</Text>
            <Text style={styles.value}>{wo.complaint || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Internal Notes:</Text>
            <Text style={styles.value}>{wo.internalNotes || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Customer Notes:</Text>
            <Text style={styles.value}>{wo.customerNotes || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Estimate Notes:</Text>
            <Text style={styles.value}>{wo.estimateNotes || 'N/A'}</Text>
          </View>
        </View>

        {/* Customer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>
              {wo.customer?.firstName} {wo.customer?.lastName}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{wo.customer?.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{wo.customer?.phone}</Text>
          </View>
        </View>

        {/* Appointment Info */}
        {wo.appointment && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appointment Information</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Requested:</Text>
              <Text style={styles.value}>{formatDate(wo.appointment.requestedAt)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Start Time:</Text>
              <Text style={styles.value}>{formatDate(wo.appointment.startTime)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>End Time:</Text>
              <Text style={styles.value}>{formatDate(wo.appointment.endTime)}</Text>
            </View>
          </View>
        )}

        {/* Services */}
        {wo.services && wo.services.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Services</Text>
            {wo.services.map((service: any, index: number) => (
              <View key={service.id || index} style={styles.row}>
                <Text style={styles.label}>{service.cannedService?.name || service.description}</Text>
                <Text style={styles.value}>{formatCurrency(service.subtotal)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Labor Items */}
        {wo.laborItems && wo.laborItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Labor Items</Text>
            {wo.laborItems.map((labor: any, index: number) => (
              <View key={labor.id || index} style={styles.row}>
                <Text style={styles.label}>{labor.description}</Text>
                <Text style={styles.value}>{labor.hours} hrs</Text>
              </View>
            ))}
          </View>
        )}

        {/* Parts Used */}
        {wo.partsUsed && wo.partsUsed.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Parts Used</Text>
            {wo.partsUsed.map((part: any, index: number) => (
              <View key={part.id || index} style={styles.row}>
                <Text style={styles.label}>{part.part?.name || part.part?.sku}</Text>
                <Text style={styles.value}>{formatCurrency(part.subtotal)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Payments */}
        {wo.payments && wo.payments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payments</Text>
            {wo.payments.map((payment: any, index: number) => (
              <View key={payment.id || index} style={styles.row}>
                <Text style={styles.label}>{payment.method} - {payment.reference}</Text>
                <Text style={styles.value}>{formatCurrency(payment.amount)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Attachments */}
        {wo.attachments && wo.attachments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attachments</Text>
            {wo.attachments.map((attachment: any, index: number) => (
              <View key={attachment.id || index} style={styles.row}>
                <Text style={styles.label}>{attachment.fileName}</Text>
                <Text style={styles.value}>{attachment.category}</Text>
              </View>
            ))}
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
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral600,
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: Colors.neutral900,
    flex: 2,
    textAlign: 'right',
  },
  // Loading state styles
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

export default WorkOrderDetail;