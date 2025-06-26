import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface ServiceQRCardProps {
  qrValue?: string;
  onPress?: () => void;
}

const ServiceQRCard: React.FC<ServiceQRCardProps> = ({ 
  qrValue = "SERVICE_CENTER_123456", 
  onPress 
}) => {
  return (
    <View style={styles.screen}>
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.95}
    >
      <View style={styles.qrContainer}>
        <QRCode
          value={qrValue}
          size={180}
          color="#FFFFFF"
          backgroundColor="#4A90FF"
        />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          Quick service check-in at our service center
        </Text>
        
        <Text style={styles.description}>
          Show this QR code at our service center for instant check-in and faster service processing
        </Text>
      </View>
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    marginHorizontal: 30,
  },
  qrContainer: {
    backgroundColor: '#4A90FF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 26,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
});

export default ServiceQRCard;