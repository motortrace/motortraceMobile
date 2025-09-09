import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import Colors from "../constants/colors"
import Icon from 'react-native-vector-icons/Ionicons'
import BorderButton from '../components/BorderButton'

interface PackageCardProps {
  title: string
  description: string
  services: string[]
  price: number
  onPress?: () => void | Promise<void>
  onPurchase?: () => void | Promise<void>
}

const PackageCard: React.FC<PackageCardProps> = ({ title, description, services, price, onPress, onPurchase }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      <View style={styles.servicesList}>
        {services.map((service, index) => (
          <View key={index} style={styles.serviceItem}>
            <Icon name="checkmark-circle-outline" size={16} color={Colors.primary} />
            <Text style={styles.serviceText}>{service}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.price}>{price}</Text>
        <View style={styles.buttonWrapper}>
          <BorderButton label="Purchase" onPress={onPurchase} style={styles.purchaseButton} />
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.neutral0,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: Colors.neutral900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.neutral900,
    marginBottom: 4,
  },
  description: {
    fontSize: 15,
    color: Colors.neutral600,
    marginBottom: 8,
  },
  servicesList: {
    marginBottom: 10,
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  serviceText: {
    fontSize: 15,
    color: Colors.neutral800,
    marginLeft: 6,
  },
  footer: {
    marginTop: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral100,
    paddingTop: 8,
    flexDirection: 'row',
  },
  price: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.primary,
    marginLeft: 2,
  },
  buttonWrapper: {
    marginLeft: 12,
    flex: 1,
    alignItems: "flex-end",
    marginRight: 0,
    marginTop: -10,
  },
})

export default PackageCard
