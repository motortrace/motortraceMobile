import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Colors from '../constants/colors';
import CategoryBadge from './CategoryBadge'; // adjust path as needed

interface Part {
  id: string;
  category: string;
  categoryColor: string;
  categoryBg: string;
  garagePrice: number;
  estimatedTime: string;
  partName: string;
  partNumber: string;
  oem: string;
  repairName: string;
  marketPrice: string;
  warrantyGarage: string;
  warrantyOwnParts: string;
}

interface PartCardProps {
  part: Part;
  selection: 'garage' | 'customer' | null;
  onSelect: (partId: string, option: 'garage' | 'customer') => void;
}

const PartCard: React.FC<PartCardProps> = ({ part, selection, onSelect }) => {
  return (
    <View style={styles.partCard}>
      <View style={styles.partHeader}>
        <CategoryBadge 
          category={part.category}
          categoryColor={part.categoryColor}
          categoryBg={part.categoryBg}
        />
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>${part.garagePrice}</Text>
          <Text style={styles.timeText}>{part.estimatedTime}</Text>
        </View>
      </View>

      <Text style={styles.partName}>{part.partName}</Text>
      <Text style={styles.partDetails}>Part #: {part.partNumber} • OEM: {part.oem}</Text>
      <Text style={styles.repairName}>For: {part.repairName}</Text>

      <View style={styles.selectionContainer}>
        <Text style={styles.selectionTitle}>Who will provide this part?</Text>

        {/* Garage Option */}
        <TouchableOpacity
          style={[
            styles.selectionOption,
            selection === 'garage' && styles.selectionOptionSelected
          ]}
          onPress={() => onSelect(part.id, 'garage')}
        >
          <View style={styles.selectionOptionLeft}>
            <View style={[
              styles.radioButton,
              selection === 'garage' && styles.radioButtonSelected
            ]}>
              {selection === 'garage' && <View style={styles.radioButtonInner} />}
            </View>
            <View>
              <Text style={styles.selectionOptionTitle}>Garage Provides</Text>
              <Text style={styles.selectionOptionSubtitle}>
                ${part.garagePrice} • {part.warrantyGarage} warranty
              </Text>
            </View>
          </View>
          <View style={styles.recommendedBadge}>
            <Text style={styles.recommendedText}>RECOMMENDED</Text>
          </View>
        </TouchableOpacity>

        {/* Customer Option */}
        <TouchableOpacity
          style={[
            styles.selectionOption,
            selection === 'customer' && styles.selectionOptionSelected
          ]}
          onPress={() => onSelect(part.id, 'customer')}
        >
          <View style={styles.selectionOptionLeft}>
            <View style={[
              styles.radioButton,
              selection === 'customer' && styles.radioButtonSelected
            ]}>
              {selection === 'customer' && <View style={styles.radioButtonInner} />}
            </View>
            <View>
              <Text style={styles.selectionOptionTitle}>I'll Provide</Text>
              <Text style={styles.selectionOptionSubtitle}>
                Market: ${part.marketPrice} • {part.warrantyOwnParts}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Warning Message */}
      {selection === 'customer' && (
        <View style={styles.warningContainer}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText}>
            Please bring this part on your service date. Quality and compatibility are your responsibility.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  partCard: {
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  partHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  partName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 4,
  },
  partDetails: {
    fontSize: 13,
    color: Colors.neutral600,
    marginBottom: 4,
  },
  repairName: {
    fontSize: 13,
    color: Colors.neutral600,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  selectionContainer: {
    marginBottom: 8,
  },
  selectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral800,
    marginBottom: 12,
  },
  selectionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.neutral0,
    marginBottom: 8,
  },
  selectionOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarybg,
  },
  selectionOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.neutral400,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioButtonSelected: {
    borderColor: Colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  selectionOptionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral800,
  },
  selectionOptionSubtitle: {
    fontSize: 12,
    color: Colors.neutral600,
    marginTop: 2,
  },
  recommendedBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.neutral0,
    letterSpacing: 0.3,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.warningLight,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  warningIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  warningText: {
    fontSize: 12,
    color: Colors.warning,
    flex: 1,
    lineHeight: 16,
  },
});

export default PartCard;
