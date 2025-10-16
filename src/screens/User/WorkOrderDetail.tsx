import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Linking,
  Platform,
} from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App';
import Colors from '../../constants/colors';
import Header from '../../components/Header';
import LoadingComponent from '../../components/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

type WorkOrderDetailRouteProp = RouteProp<RootStackParamList, 'WorkOrderDetail'>;
type WorkOrderDetailNavigationProp = StackNavigationProp<RootStackParamList, 'WorkOrderDetail'>;

const WorkOrderDetail = () => {
  const navigation = useNavigation<WorkOrderDetailNavigationProp>();
  const route = useRoute<WorkOrderDetailRouteProp>();
  const { workOrder } = route.params;
  const [detailedWorkOrder, setDetailedWorkOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

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
    if (amount == null || isNaN(amount)) return 'රු0.00';
    return `රු${Number(amount).toFixed(2)}`;
  };

  const downloadInspectionPdf = async (pdfUrl: string) => {
    try {
      console.log('🔍 Original PDF URL:', pdfUrl);

      // Convert localhost URLs for mobile devices
      let adjustedUrl = pdfUrl;
      if (Platform.OS === 'android' && pdfUrl.includes('127.0.0.1')) {
        adjustedUrl = pdfUrl.replace('127.0.0.1', '10.0.2.2');
        console.log('🔍 Adjusted URL for Android:', adjustedUrl);
      }

      console.log('🔍 Platform:', Platform.OS);
      console.log('🔍 Final URL to open:', adjustedUrl);

      // Try to open in InAppBrowser first (better UX)
      if (await InAppBrowser.isAvailable()) {
        console.log('🔍 Opening PDF in InAppBrowser...');
        await InAppBrowser.open(adjustedUrl, {
          showTitle: true,
          toolbarColor: Colors.primary,
          secondaryToolbarColor: Colors.neutral900,
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
        });
        console.log('🔍 PDF opened successfully in InAppBrowser');
      } else {
        console.log('🔍 InAppBrowser not available, falling back to Linking');
        const supported = await Linking.canOpenURL(adjustedUrl);
        console.log('🔍 Linking.canOpenURL result:', supported);

        if (supported) {
          console.log('🔍 Opening URL with Linking...');
          await Linking.openURL(adjustedUrl);
          console.log('🔍 URL opened successfully with Linking');
        } else {
          console.log('🔍 URL not supported by Linking');
          Alert.alert('Error', 'Cannot open PDF. Please check your browser settings.');
        }
      }
    } catch (error) {
      console.error('❌ Error opening PDF:', error);
      Alert.alert('Error', 'Failed to open PDF');
    }
  };

  const renderTabButton = (tabName: string, iconName: string) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tabName && styles.activeTab]}
      onPress={() => setActiveTab(tabName)}
    >
      <Icon
        name={iconName}
        size={20}
        color={activeTab === tabName ? Colors.neutral0 : Colors.neutral600}
      />
    </TouchableOpacity>
  );

  const renderOverviewTab = () => (
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
      </View>

      {/* Vehicle Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vehicle Information</Text>
        {wo.vehicle?.imageUrl && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: wo.vehicle.imageUrl }} style={styles.vehicleImage} />
          </View>
        )}
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

      {/* Important Dates */}
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
      </View>

      {/* Financial Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Summary</Text>
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
        <View style={styles.advisorCard}>
          {wo.serviceAdvisor?.userProfile?.profileImage ? (
            <Image source={{ uri: wo.serviceAdvisor.userProfile.profileImage }} style={styles.advisorImage} />
          ) : (
            <View style={styles.advisorPlaceholder}>
              <Text style={styles.advisorInitial}>
                {wo.serviceAdvisor?.userProfile?.firstName?.charAt(0)?.toUpperCase() || 'A'}
              </Text>
            </View>
          )}
          <View style={styles.advisorDetails}>
            <Text style={styles.advisorName}>
              {wo.serviceAdvisor?.userProfile?.firstName} {wo.serviceAdvisor?.userProfile?.lastName}
            </Text>
            <Text style={styles.advisorPhone}>
              {wo.serviceAdvisor?.userProfile?.phone || 'N/A'}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderInspectionsTab = () => (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inspection Information</Text>
        
        {/* Download PDF Button */}
        {wo.inspectionPdfUrl && (
          <TouchableOpacity 
            style={styles.downloadButton}
            onPress={() => downloadInspectionPdf(wo.inspectionPdfUrl)}
          >
            <Icon name="download-outline" size={20} color={Colors.neutral0} />
            <Text style={styles.downloadButtonText}>Download Inspection Report</Text>
          </TouchableOpacity>
        )}
        
        {wo.inspections && wo.inspections.length > 0 ? (
          wo.inspections.map((inspection: any, index: number) => (
            <View key={inspection.id || index} style={styles.serviceItem}>
              <View style={styles.inspectorCard}>
                {inspection.inspector?.userProfile?.profileImage ? (
                  <Image source={{ uri: inspection.inspector.userProfile.profileImage }} style={styles.inspectorImage} />
                ) : (
                  <View style={styles.inspectorPlaceholder}>
                    <Text style={styles.inspectorInitial}>
                      {inspection.inspector?.userProfile?.firstName?.charAt(0)?.toUpperCase() || 'I'}
                    </Text>
                  </View>
                )}
                <View style={styles.inspectorDetails}>
                  <Text style={styles.advisorName}>
                    {inspection.inspector?.userProfile?.firstName} {inspection.inspector?.userProfile?.lastName}
                  </Text>
                  <Text style={styles.advisorPhone}>
                    Inspector
                  </Text>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Template:</Text>
                <Text style={styles.value}>{inspection.templateId}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Date:</Text>
                <Text style={styles.value}>{formatDate(inspection.date)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Status:</Text>
                <Text style={styles.value}>{inspection.isCompleted ? 'Completed' : 'Pending'}</Text>
              </View>
              <View style={styles.notesContainer}>
                <Text style={styles.notesLabel}>Notes:</Text>
                <Text style={styles.notesText}>{inspection.notes || 'No notes'}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No inspection data available</Text>
        )}
      </View>
    </ScrollView>
  );

  const renderServicesTab = () => (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services</Text>
        {wo.services && wo.services.length > 0 ? (
          wo.services.map((service: any, index: number) => (
            <View key={service.id || index} style={styles.serviceItem}>
              <View style={styles.row}>
                <Text style={styles.label}>{service.cannedService?.name || service.description}</Text>
                <Text style={styles.value}>{formatCurrency(service.subtotal)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Quantity:</Text>
                <Text style={styles.value}>{service.quantity}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Unit Price:</Text>
                <Text style={styles.value}>{formatCurrency(service.unitPrice)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Status:</Text>
                <Text style={styles.value}>{service.status}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No services found</Text>
        )}
      </View>

      {/* Labor Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Labor Items</Text>
        {wo.laborItems && wo.laborItems.length > 0 ? (
          wo.laborItems.map((labor: any, index: number) => (
            <View key={labor.id || index} style={styles.serviceItem}>
              <View style={styles.row}>
                <Text style={styles.label}>{labor.description}</Text>
                <Text style={styles.value}>{labor.hours} hrs</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Rate:</Text>
                <Text style={styles.value}>{formatCurrency(labor.rate)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Technician:</Text>
                <Text style={styles.value}>{labor.technician?.userProfile?.firstName} {labor.technician?.userProfile?.lastName}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No labor items found</Text>
        )}
      </View>
    </ScrollView>
  );

  const renderEstimatesTab = () => (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estimate Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Estimated Total:</Text>
          <Text style={styles.value}>{formatCurrency(wo.estimatedTotal)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Estimate Approved:</Text>
          <Text style={styles.value}>{wo.estimateApproved ? 'Yes' : 'No'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Estimate Notes:</Text>
          <Text style={styles.value}>{wo.estimateNotes || 'N/A'}</Text>
        </View>
      </View>

      {/* Parts Used */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Parts Used</Text>
        {wo.partsUsed && wo.partsUsed.length > 0 ? (
          wo.partsUsed.map((part: any, index: number) => (
            <View key={part.id || index} style={styles.serviceItem}>
              <View style={styles.row}>
                <Text style={styles.label}>{part.part?.name || part.part?.sku}</Text>
                <Text style={styles.value}>{formatCurrency(part.subtotal)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Quantity:</Text>
                <Text style={styles.value}>{part.quantity}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Unit Price:</Text>
                <Text style={styles.value}>{formatCurrency(part.unitPrice)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Source:</Text>
                <Text style={styles.value}>{part.source}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No parts used</Text>
        )}
      </View>
    </ScrollView>
  );

  const renderPaymentsTab = () => (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment History</Text>
        {wo.payments && wo.payments.length > 0 ? (
          wo.payments.map((payment: any, index: number) => (
            <View key={payment.id || index} style={styles.serviceItem}>
              <View style={styles.row}>
                <Text style={styles.label}>{payment.method} - {payment.reference}</Text>
                <Text style={styles.value}>{formatCurrency(payment.amount)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Status:</Text>
                <Text style={styles.value}>{payment.status}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Paid At:</Text>
                <Text style={styles.value}>{formatDate(payment.paidAt)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Processed By:</Text>
                <Text style={styles.value}>{payment.processedBy?.userProfile?.firstName} {payment.processedBy?.userProfile?.lastName}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No payment history found</Text>
        )}
      </View>
    </ScrollView>
  );

  const renderNotesTab = () => (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Complaint</Text>
        <Text style={styles.noteText}>{wo.complaint || 'No complaint recorded'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Internal Notes</Text>
        <Text style={styles.noteText}>{wo.internalNotes || 'No internal notes'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Notes</Text>
        <Text style={styles.noteText}>{wo.customerNotes || 'No customer notes'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estimate Notes</Text>
        <Text style={styles.noteText}>{wo.estimateNotes || 'No estimate notes'}</Text>
      </View>

      {/* Attachments */}
      {wo.attachments && wo.attachments.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attachments</Text>
          {wo.attachments.map((attachment: any, index: number) => (
            <View key={attachment.id || index} style={styles.serviceItem}>
              <View style={styles.row}>
                <Text style={styles.label}>{attachment.fileName}</Text>
                <Text style={styles.value}>{attachment.category}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Uploaded:</Text>
                <Text style={styles.value}>{formatDate(attachment.uploadedAt)}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );

  const renderCurrentTab = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'inspections':
        return renderInspectionsTab();
      case 'services':
        return renderServicesTab();
      case 'estimates':
        return renderEstimatesTab();
      case 'payments':
        return renderPaymentsTab();
      case 'notes':
        return renderNotesTab();
      default:
        return renderOverviewTab();
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          icon="back"
          name="Work Order Details"
          image=""
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
      />

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {renderTabButton('overview', 'information-circle-outline')}
        {renderTabButton('inspections', 'search-outline')}
        {renderTabButton('services', 'construct-outline')}
        {renderTabButton('estimates', 'calculator-outline')}
        {renderTabButton('payments', 'card-outline')}
        {renderTabButton('notes', 'document-text-outline')}
      </View>

      {/* Tab Content */}
      {renderCurrentTab()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primarybg,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral0,
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: Colors.primary,
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
  serviceItem: {
    backgroundColor: Colors.neutral50,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.neutral500,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  noteText: {
    fontSize: 14,
    color: Colors.neutral700,
    lineHeight: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  vehicleImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  advisorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: 'cover',
  },
  inspectorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'cover',
  },
  inspectorPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inspectorInitial: {
    color: Colors.neutral50,
    fontSize: 20,
    fontWeight: '600',
  },
  advisorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral50,
    borderRadius: 12,
    padding: 16,
  },
  inspectorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral50,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  advisorPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  advisorInitial: {
    color: Colors.neutral50,
    fontSize: 32,
    fontWeight: '600',
  },
  advisorDetails: {
    flex: 1,
    marginLeft: 16,
  },
  inspectorDetails: {
    flex: 1,
    marginLeft: 12,
  },
  advisorName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 4,
  },
  advisorPhone: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  notesContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral600,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: Colors.neutral700,
    lineHeight: 20,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  downloadButtonText: {
    color: Colors.neutral0,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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