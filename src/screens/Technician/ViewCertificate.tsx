import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Alert,
  Modal,
  FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';

// Certification Card Component
const CertificationCard = ({ certification, onDelete, onEdit }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return Colors.success;
      case 'expiring': return Colors.warning;
      case 'expired': return Colors.error;
      default: return Colors.neutral500;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'expiring': return 'Expiring Soon';
      case 'expired': return 'Expired';
      default: return 'Unknown';
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Certification',
      `Are you sure you want to delete "${certification.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(certification.id) }
      ]
    );
  };

  return (
    <View style={styles.certificationCard}>
      <View style={styles.certificationHeader}>
        <View style={styles.certificationIcon}>
          <Icon name="ribbon" size={20} color={Colors.primary} />
        </View>
        <View style={styles.certificationInfo}>
          <Text style={styles.certificationName}>{certification.name}</Text>
          <Text style={styles.certificationIssuer}>
            Issued by: {certification.issuer}
          </Text>
          <Text style={styles.certificationDate}>
            Issued: {certification.issueDate} • Expires: {certification.expiryDate}
          </Text>
        </View>
        <View style={styles.certificationActions}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(certification.status) }]}>
            <Text style={styles.statusText}>{getStatusText(certification.status)}</Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => onEdit(certification)}
            >
              <Icon name="create-outline" size={18} color={Colors.neutral600} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleDelete}
            >
              <Icon name="trash-outline" size={18} color={Colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      {certification.description && (
        <Text style={styles.certificationDescription}>
          {certification.description}
        </Text>
      )}
    </View>
  );
};

// Add/Edit Certification Modal Component
const CertificationModal = ({ visible, certification, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: certification?.name || '',
    issuer: certification?.issuer || '',
    issueDate: certification?.issueDate || '',
    expiryDate: certification?.expiryDate || '',
    description: certification?.description || '',
    credentialId: certification?.credentialId || '',
  });

  const isEditing = !!certification;

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.issuer || !formData.issueDate || !formData.expiryDate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const certificationData = {
      ...formData,
      id: certification?.id || Date.now(),
      status: getStatus(formData.expiryDate),
    };

    onSave(certificationData);
    onClose();
  };

  const getStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const monthsUntilExpiry = (expiry - today) / (1000 * 60 * 60 * 24 * 30);
    
    if (monthsUntilExpiry < 0) return 'expired';
    if (monthsUntilExpiry < 3) return 'expiring';
    return 'active';
  };

  const handleClose = () => {
    setFormData({
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      description: '',
      credentialId: '',
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.modalCancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {isEditing ? 'Edit Certification' : 'Add Certification'}
          </Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.modalSaveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Certification Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => updateField('name', value)}
              placeholder="e.g., ASE Master Technician"
              placeholderTextColor={Colors.neutral500}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Issuing Organization *</Text>
            <TextInput
              style={styles.input}
              value={formData.issuer}
              onChangeText={(value) => updateField('issuer', value)}
              placeholder="e.g., National Institute for Automotive Service Excellence"
              placeholderTextColor={Colors.neutral500}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.inputLabel}>Issue Date *</Text>
              <TextInput
                style={styles.input}
                value={formData.issueDate}
                onChangeText={(value) => updateField('issueDate', value)}
                placeholder="MM/DD/YYYY"
                placeholderTextColor={Colors.neutral500}
              />
            </View>
            <View style={styles.halfWidth}>
              <Text style={styles.inputLabel}>Expiry Date *</Text>
              <TextInput
                style={styles.input}
                value={formData.expiryDate}
                onChangeText={(value) => updateField('expiryDate', value)}
                placeholder="MM/DD/YYYY"
                placeholderTextColor={Colors.neutral500}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Credential ID</Text>
            <TextInput
              style={styles.input}
              value={formData.credentialId}
              onChangeText={(value) => updateField('credentialId', value)}
              placeholder="Enter credential ID (optional)"
              placeholderTextColor={Colors.neutral500}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(value) => updateField('description', value)}
              placeholder="Brief description of the certification..."
              placeholderTextColor={Colors.neutral500}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

// Main Certifications Screen Component
const CertificationsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCertification, setEditingCertification] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [certifications, setCertifications] = useState([
    {
      id: 1,
      name: 'ASE Master Technician',
      issuer: 'National Institute for Automotive Service Excellence',
      issueDate: '01/15/2020',
      expiryDate: '12/31/2025',
      status: 'active',
      description: 'Comprehensive certification covering all automotive systems including engine repair, brakes, suspension, and electrical systems.',
      credentialId: 'ASE-MT-2020-001'
    },
    {
      id: 2,
      name: 'Hybrid Vehicle Specialist',
      issuer: 'Toyota Technical Education Network',
      issueDate: '06/10/2021',
      expiryDate: '03/15/2024',
      status: 'expiring',
      description: 'Specialized training in hybrid vehicle systems, battery technology, and high-voltage safety procedures.',
      credentialId: 'TTEN-HV-2021-456'
    },
    {
      id: 3,
      name: 'Brake System Certification',
      issuer: 'Brake Manufacturers Council',
      issueDate: '09/20/2019',
      expiryDate: '09/20/2025',
      status: 'active',
      description: 'Advanced certification in brake system diagnosis, repair, and maintenance for all vehicle types.',
      credentialId: 'BMC-BRAKE-2019-789'
    },
    {
      id: 4,
      name: 'Air Conditioning Systems',
      issuer: 'Mobile Air Conditioning Society',
      issueDate: '04/12/2018',
      expiryDate: '04/12/2023',
      status: 'expired',
      description: 'Certification in automotive air conditioning and refrigeration systems.',
      credentialId: 'MACS-AC-2018-123'
    },
    {
      id: 5,
      name: 'Diesel Engine Specialist',
      issuer: 'Diesel Technology Forum',
      issueDate: '11/05/2020',
      expiryDate: '11/05/2026',
      status: 'active',
      description: 'Comprehensive training in diesel engine systems, emissions control, and fuel injection technology.',
      credentialId: 'DTF-DIESEL-2020-567'
    }
  ]);

  const filteredCertifications = certifications.filter(cert =>
    cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.issuer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCertification = () => {
    setEditingCertification(null);
    setModalVisible(true);
  };

  const handleEditCertification = (certification) => {
    setEditingCertification(certification);
    setModalVisible(true);
  };

  const handleSaveCertification = (certificationData) => {
    if (editingCertification) {
      // Update existing certification
      setCertifications(prev => 
        prev.map(cert => 
          cert.id === editingCertification.id ? certificationData : cert
        )
      );
    } else {
      // Add new certification
      setCertifications(prev => [...prev, certificationData]);
    }
    setEditingCertification(null);
  };

  const handleDeleteCertification = (id) => {
    setCertifications(prev => prev.filter(cert => cert.id !== id));
  };

  const getStatusStats = () => {
    const stats = certifications.reduce((acc, cert) => {
      acc[cert.status] = (acc[cert.status] || 0) + 1;
      return acc;
    }, {});

    return {
      active: stats.active || 0,
      expiring: stats.expiring || 0,
      expired: stats.expired || 0,
      total: certifications.length
    };
  };

  const stats = getStatusStats();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.neutral1000} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Certifications</Text>
        <TouchableOpacity onPress={handleAddCertification}>
          <Icon name="add" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: Colors.success }]}>{stats.active}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: Colors.warning }]}>{stats.expiring}</Text>
          <Text style={styles.statLabel}>Expiring</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: Colors.error }]}>{stats.expired}</Text>
          <Text style={styles.statLabel}>Expired</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={Colors.neutral500} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search certifications..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={Colors.neutral500}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close-circle" size={20} color={Colors.neutral500} />
          </TouchableOpacity>
        )}
      </View>

      {/* Certifications List */}
      <FlatList
        data={filteredCertifications}
        renderItem={({ item }) => (
          <CertificationCard
            certification={item}
            onDelete={handleDeleteCertification}
            onEdit={handleEditCertification}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="ribbon-outline" size={48} color={Colors.neutral400} />
            <Text style={styles.emptyStateText}>
              {searchQuery ? 'No certifications found' : 'No certifications added yet'}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? 'Try a different search term' : 'Tap the + button to add your first certification'}
            </Text>
          </View>
        }
      />

      {/* Add/Edit Modal */}
      <CertificationModal
        visible={modalVisible}
        certification={editingCertification}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveCertification}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.neutral0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.neutral0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral1000,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.neutral600,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral0,
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.neutral1000,
    marginLeft: 12,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  certificationCard: {
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    shadowColor: Colors.neutral1000,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  certificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  certificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  certificationInfo: {
    flex: 1,
    marginRight: 12,
  },
  certificationName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 4,
  },
  certificationIssuer: {
    fontSize: 14,
    color: Colors.neutral600,
    marginBottom: 4,
  },
  certificationDate: {
    fontSize: 12,
    color: Colors.neutral500,
  },
  certificationActions: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.neutral0,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.neutral100,
  },
  certificationDescription: {
    fontSize: 14,
    color: Colors.neutral700,
    marginTop: 12,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral600,
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.neutral500,
    marginTop: 8,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.neutral50,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.neutral0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
  },
  modalCancelButton: {
    fontSize: 16,
    color: Colors.neutral600,
  },
  modalSaveButton: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral800,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.neutral0,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.neutral1000,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  halfWidth: {
    width: '48%',
  },
});