import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App';
import Colors from '../../constants/colors';
import Header from '../../components/Header';

type WorkOrderDetailRouteProp = RouteProp<RootStackParamList, 'WorkOrderDetail'>;
type WorkOrderDetailNavigationProp = StackNavigationProp<RootStackParamList, 'WorkOrderDetail'>;

const WorkOrderDetail = () => {
  const navigation = useNavigation<WorkOrderDetailNavigationProp>();
  const route = useRoute<WorkOrderDetailRouteProp>();
  const { workOrder } = route.params;

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

  const formatCurrency = (amount: number) => {
    return amount ? `$${amount.toFixed(2)}` : '$0.00';
  };

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
            <Text style={styles.value}>{workOrder.workOrderNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{workOrder.status}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Job Type:</Text>
            <Text style={styles.value}>{workOrder.jobType}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Priority:</Text>
            <Text style={styles.value}>{workOrder.priority}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Source:</Text>
            <Text style={styles.value}>{workOrder.source}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Workflow Step:</Text>
            <Text style={styles.value}>{workOrder.workflowStep}</Text>
          </View>
        </View>

        {/* Vehicle Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Make/Model:</Text>
            <Text style={styles.value}>
              {workOrder.vehicle?.make} {workOrder.vehicle?.model} {workOrder.vehicle?.year}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>VIN:</Text>
            <Text style={styles.value}>{workOrder.vehicle?.vin || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>License Plate:</Text>
            <Text style={styles.value}>{workOrder.vehicle?.licensePlate || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Odometer Reading:</Text>
            <Text style={styles.value}>{workOrder.odometerReading || 'N/A'} miles</Text>
          </View>
        </View>

        {/* Dates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Important Dates</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Created:</Text>
            <Text style={styles.value}>{formatDate(workOrder.createdAt)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Updated:</Text>
            <Text style={styles.value}>{formatDate(workOrder.updatedAt)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Opened:</Text>
            <Text style={styles.value}>{formatDate(workOrder.openedAt)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Promised:</Text>
            <Text style={styles.value}>{formatDate(workOrder.promisedAt)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Closed:</Text>
            <Text style={styles.value}>{formatDate(workOrder.closedAt)}</Text>
          </View>
        </View>

        {/* Financial Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Subtotal Services:</Text>
            <Text style={styles.value}>{formatCurrency(workOrder.subtotalServices)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Subtotal Parts:</Text>
            <Text style={styles.value}>{formatCurrency(workOrder.subtotalParts)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Subtotal:</Text>
            <Text style={styles.value}>{formatCurrency(workOrder.subtotal)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Discount:</Text>
            <Text style={styles.value}>
              {formatCurrency(workOrder.discountAmount)} ({workOrder.discountType}: {workOrder.discountReason})
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tax:</Text>
            <Text style={styles.value}>{formatCurrency(workOrder.taxAmount)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Amount:</Text>
            <Text style={styles.value}>{formatCurrency(workOrder.totalAmount)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Paid Amount:</Text>
            <Text style={styles.value}>{formatCurrency(workOrder.paidAmount)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Status:</Text>
            <Text style={styles.value}>{workOrder.paymentStatus}</Text>
          </View>
        </View>

        {/* Service Advisor */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Advisor</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{workOrder.serviceAdvisor?.userProfile?.name || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{workOrder.serviceAdvisor?.userProfile?.phone || 'N/A'}</Text>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Complaint:</Text>
            <Text style={styles.value}>{workOrder.complaint || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Internal Notes:</Text>
            <Text style={styles.value}>{workOrder.internalNotes || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Customer Notes:</Text>
            <Text style={styles.value}>{workOrder.customerNotes || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Estimate Notes:</Text>
            <Text style={styles.value}>{workOrder.estimateNotes || 'N/A'}</Text>
          </View>
        </View>

        {/* Other Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Warranty Status:</Text>
            <Text style={styles.value}>{workOrder.warrantyStatus}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Invoice Number:</Text>
            <Text style={styles.value}>{workOrder.invoiceNumber || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Warranty Claim Number:</Text>
            <Text style={styles.value}>{workOrder.warrantyClaimNumber || 'N/A'}</Text>
          </View>
        </View>
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
});

export default WorkOrderDetail;