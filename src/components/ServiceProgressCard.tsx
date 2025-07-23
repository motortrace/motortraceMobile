import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Colors from '../constants/colors';
import CategoryBadge from '../components/CategoryBadge';

interface ImageItem {
  id: string | number;
  uri: string;
  caption: string;
}

interface ServiceItem {
  id: string | number;
  title: string;
  description: string;
  price: number;
  estimatedTime: string;
  startTime?: string;
  endTime?: string;
  technicianNotes?: string;
  images: ImageItem[];
  status: string;
  category: string;
  categoryColor: string;
  categoryBg: string;
}

interface ServiceCardProps {
  item: ServiceItem;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => string;
  getStatusText: (status: string) => string;
  openImageModal: (image: ImageItem) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  item,
  getStatusColor,
  getStatusIcon,
  getStatusText,
  openImageModal,
}) => {
  return (
    <View style={styles.serviceCard}>
      <View style={styles.serviceHeader}>
        <View style={styles.serviceInfo}>
          <CategoryBadge
            category={item.category}
            categoryColor={item.categoryColor}
            categoryBg={item.categoryBg}
          />
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusIcon}>{getStatusIcon(item.status)}</Text>
              <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>${item.price}</Text>
          <Text style={styles.timeText}>{item.estimatedTime}</Text>
        </View>
      </View>

      <Text style={styles.serviceTitle}>{item.title}</Text>
      <Text style={styles.serviceDescription}>{item.description}</Text>

      {/* Time Tracking */}
      <View style={styles.timeTracking}>
        <View style={styles.timeItem}>
          <Text style={styles.timeLabel}>Start Time:</Text>
          <Text style={styles.timeValue}>{item.startTime || 'Not started'}</Text>
        </View>
        {item.endTime && (
          <View style={styles.timeItem}>
            <Text style={styles.timeLabel}>End Time:</Text>
            <Text style={styles.timeValue}>{item.endTime}</Text>
          </View>
        )}
      </View>

      {/* Technician Notes */}
      {item.technicianNotes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Technician Notes:</Text>
          <Text style={styles.notesText}>{item.technicianNotes}</Text>
        </View>
      )}

      {/* Image Gallery */}
      {item.images.length > 0 && (
        <View style={styles.imageGallery}>
          <Text style={styles.imageLabel}>Progress Photos:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
            {item.images.map((image) => (
              <TouchableOpacity
                key={image.id}
                style={styles.imageContainer}
                onPress={() => openImageModal(image)}
              >
                <Image source={{ uri: image.uri }} style={styles.progressImage} />
                <Text style={styles.imageCaption}>{image.caption}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  serviceCard: {
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
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  statusContainer: {
    marginTop: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusIcon: {
    color: Colors.neutral0,
    fontSize: 12,
    marginRight: 4,
  },
  statusText: {
    color: Colors.neutral0,
    fontSize: 12,
    fontWeight: '600',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral900,
  },
  timeText: {
    fontSize: 12,
    color: Colors.neutral600,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 6,
  },
  serviceDescription: {
    fontSize: 14,
    color: Colors.neutral600,
    lineHeight: 20,
    marginBottom: 12,
  },
  timeTracking: {
    backgroundColor: Colors.neutral50,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  timeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  timeLabel: {
    fontSize: 14,
    color: Colors.neutral700,
    fontWeight: '500',
  },
  timeValue: {
    fontSize: 14,
    color: Colors.neutral900,
  },
  notesContainer: {
    backgroundColor: Colors.infoLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: Colors.neutral700,
    lineHeight: 20,
  },
  imageGallery: {
    marginTop: 12,
  },
  imageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 8,
  },
  imageScroll: {
    marginHorizontal: -4,
  },
  imageContainer: {
    marginHorizontal: 4,
    width: 120,
  },
  progressImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.neutral200,
  },
  imageCaption: {
    fontSize: 12,
    color: Colors.neutral600,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
});

export default ServiceCard;
