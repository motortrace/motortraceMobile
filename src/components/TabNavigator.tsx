import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import Colors from "../constants/colors"

interface TabNavigatorProps {
  tabs: string[]
  onTabPress?: (tab: string, index: number) => void
}

const TabNavigator: React.FC<TabNavigatorProps> = ({ tabs, onTabPress }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  const handleTabPress = (index: number) => {
    setActiveIndex(index)
    onTabPress?.(tabs[index], index)
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.tabRow}>
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => handleTabPress(index)}
              style={styles.tabButton}
            >
              <View style={styles.tabInner}>
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab}
                </Text>
                {/* Underline with absolute positioning to prevent layout shifts */}
                <View style={[
                  styles.underline, 
                  { opacity: isActive ? 1 : 0 }
                ]} />
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: Colors.neutral300,
    marginBottom: 15,
  },
  scrollContent: {
    flexGrow: 1,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    paddingHorizontal: 12,
  },
  tabButton: {
    paddingVertical: 8,
    flex: 1,
    alignItems: "center",
    minHeight: 30,
  },
  tabInner: {
    alignItems: "center",
    position: "relative",
    // Fixed height to prevent layout shifts
    height: 32,
    justifyContent: "center",
    width: "100%",
  },
  tabText: {
    fontSize: 14,
    color: Colors.neutral600,
    fontWeight: "500",
  },
  tabTextActive: {
    color: Colors.neutral1000,
    fontWeight: "600",
  },
  underline: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.neutral1000,
    borderRadius: 1,
  },
})

export default TabNavigator