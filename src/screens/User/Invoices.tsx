import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
import Colors from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';
import { invoiceService, Invoice } from '../../services/invoiceService';

const Invoices: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

  useEffect(() => {
    fetchInvoices();
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const filters = filter === 'all' ? {} : { status: filter.toUpperCase() };
      const result = await invoiceService.getInvoices(filters, 1, 50);
      setInvoices(result.invoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      Alert.alert('Error', 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchInvoices();
    setRefreshing(false);
  };

  const handleInvoicePress = (invoice: Invoice) => {
    // For now, just show an alert since InvoiceDetail screen doesn't exist yet
    Alert.alert('Invoice Details', `Invoice ${invoice.invoiceNumber}\nAmount: ${invoiceService.formatCurrency(invoice.totalAmount)}`);
  };

  const handleDownloadPDF = async (invoice: Invoice) => {
    try {
      await invoiceService.generateInvoicePDF(invoice.id);
      // In a real app, you would open the PDF URL or download it
      Alert.alert('Success', 'Invoice PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF');
    }
  };

  const getStatusColor = (status: string) => {
    return invoiceService.getInvoiceStatusColor(status);
  };

  const getStatusText = (status: string) => {
    return invoiceService.getInvoiceStatusText(status);
  };

  const filteredInvoices = invoices.filter(invoice => {
    if (filter === 'all') return true;
    if (filter === 'paid') return invoice.status === 'PAID';
    if (filter === 'pending') return ['SENT', 'CONFIRMED'].includes(invoice.status);
    if (filter === 'overdue') return invoiceService.isInvoiceOverdue(invoice);
    return true;
  });

  const renderInvoiceCard = (invoice: Invoice) => (
    <TouchableOpacity
      key={invoice.id}
      style={styles.invoiceCard}
      onPress={() => handleInvoicePress(invoice)}
    >
      <View style={styles.invoiceHeader}>
        <View style={styles.invoiceInfo}>
          <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
          <Text style={styles.workOrderNumber}>
            Work Order: {invoice.workOrder?.workOrderNumber || 'N/A'}
          </Text>
        </View>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(invoice.status) + '20' }
            ]}
          >
            <Text
              style={[styles.statusText, { color: getStatusColor(invoice.status) }]}
            >
              {getStatusText(invoice.status)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.invoiceDetails}>
        <Text style={styles.customerName}>
          {invoice.workOrder?.customer?.userProfile?.name || 'Unknown Customer'}
        </Text>
        <Text style={styles.complaint}>
          {invoice.workOrder?.complaint || 'Service'}
        </Text>
      </View>

      <View style={styles.invoiceFooter}>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Total Amount</Text>
          <Text style={styles.amountValue}>
            {invoiceService.formatCurrency(invoice.totalAmount)}
          </Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Due Date</Text>
          <Text style={styles.dateValue}>
            {invoiceService.formatDate(invoice.dueDate)}
          </Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => handleDownloadPDF(invoice)}
        >
          <Icon name="download-outline" size={16} color={Colors.primary} />
          <Text style={styles.downloadButtonText}>PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewButton}>
          <Icon name="eye-outline" size={16} color={Colors.neutral600} />
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.neutral0} />

      <Header
        icon="back"
        name="Invoices"
        image=""
      />

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {[
          { key: 'all', label: 'All' },
          { key: 'paid', label: 'Paid' },
          { key: 'pending', label: 'Pending' },
          { key: 'overdue', label: 'Overdue' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.filterTab,
              filter === tab.key && styles.filterTabActive,
            ]}
            onPress={() => setFilter(tab.key as any)}
          >
            <Text
              style={[
                styles.filterTabText,
                filter === tab.key && styles.filterTabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading invoices...</Text>
          </View>
        ) : filteredInvoices.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="document-text-outline" size={64} color={Colors.neutral400} />
            <Text style={styles.emptyTitle}>No Invoices Found</Text>
            <Text style={styles.emptySubtitle}>
              {filter === 'all'
                ? 'You don\'t have any invoices yet'
                : `No ${filter} invoices found`
              }
            </Text>
          </View>
        ) : (
          <View style={styles.invoicesContainer}>
            {filteredInvoices.map(renderInvoiceCard)}
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral0,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral100,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral600,
  },
  filterTabTextActive: {
    color: Colors.neutral0,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.neutral50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.neutral500,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.neutral700,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.neutral500,
    textAlign: 'center',
  },
  invoicesContainer: {
    padding: 16,
  },
  invoiceCard: {
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.neutral1000,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  invoiceInfo: {
    flex: 1,
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.neutral700,
    marginBottom: 4,
  },
  workOrderNumber: {
    fontSize: 12,
    color: Colors.neutral500,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  invoiceDetails: {
    marginBottom: 12,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral700,
    marginBottom: 4,
  },
  complaint: {
    fontSize: 12,
    color: Colors.neutral500,
  },
  invoiceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  amountContainer: {
    flex: 1,
  },
  amountLabel: {
    fontSize: 12,
    color: Colors.neutral500,
    marginBottom: 2,
  },
  amountValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.neutral700,
  },
  dateContainer: {
    alignItems: 'flex-end',
  },
  dateLabel: {
    fontSize: 12,
    color: Colors.neutral500,
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral700,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  downloadButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
    marginLeft: 4,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral50,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.neutral600,
    marginLeft: 4,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default Invoices;