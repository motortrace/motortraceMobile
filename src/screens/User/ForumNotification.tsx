import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/colors';
import Header from '../../components/Header';
import BottomNavigation from '../../components/BottomNav';
import { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';

const Notifications = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState(3);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'upvote',
      title: 'New upvote on your post',
      message: 'AutoGuru upvoted your post "How to Fix Engine Overheating in a Honda Civic?"',
      time: '2 minutes ago',
      isRead: false,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      actionIcon: 'arrow-up-circle',
      actionColor: Colors.success,
    },
    {
      id: '2',
      type: 'comment',
      title: 'New comment on your post',
      message: 'GarageGal commented: "Check your water pump, had the same issue last year!"',
      time: '15 minutes ago',
      isRead: false,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b830?w=150&h=150&fit=crop&crop=face',
      actionIcon: 'chatbubble-ellipses',
      actionColor: Colors.primary,
    },
    {
      id: '7',
      type: 'downvote',
      title: 'Post activity',
      message: 'Your post "Best Practices for Regular Car Maintenance" received new feedback',
      time: '3 days ago',
      isRead: true,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      actionIcon: 'trending-down',
      actionColor: Colors.warning,
    },
  ]);

const navItems = [
  {
    id: "home",
    icon: "home-outline",
    label: "Home",
    onPress: () => navigation.navigate('Forum'),
  },
  { 
    id: "search",
    icon: "search-outline",
    label: "Discover",
    onPress: () => navigation.navigate('SearchPosts'),
  },
  {
    id: "create",
    icon: "add-circle-outline",
    label: "Create",
    onPress: () => navigation.navigate('CreatePost'),
  },
  {
    id: "notifications",
    icon: "notifications-outline",
    label: "Alerts",
    onPress: () => navigation.navigate('NotificationForum'),
  },
  {
    id: "profile",
    icon: "person-outline",
    label: "Profile",
    onPress: () => navigation.navigate('ForumProfile'),
  },
]

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const NotificationItem = ({ notification }) => {
    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          !notification.isRead && styles.unreadNotification
        ]}
        onPress={() => navigation.navigate('ForumNotificationDetails') }
        activeOpacity={0.7}
      >
        <View style={styles.notificationContent}>
          {/* Avatar or System Icon */}
          <View style={styles.avatarContainer}>
            {notification.avatar ? (
              <Image source={{ uri: notification.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.systemIcon, { backgroundColor: notification.actionColor + '20' }]}>
                <Icon name={notification.actionIcon} size={24} color={notification.actionColor} />
              </View>
            )}
            {/* Action indicator */}
            <View style={[styles.actionIndicator, { backgroundColor: notification.actionColor }]}>
              <Icon name={notification.actionIcon} size={12} color="white" />
            </View>
          </View>

          {/* Notification Details */}
          <View style={styles.notificationDetails}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationMessage} numberOfLines={2}>
              {notification.message}
            </Text>
            <Text style={styles.notificationTime}>{notification.time}</Text>
          </View>

          {/* Unread indicator */}
          {!notification.isRead && <View style={styles.unreadDot} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header
        icon="back"
        name="Notifications"
        image=""
        onIconPress={() => navigation.navigate('Home')}
      />

      {/* Notifications Header */}
      <View style={styles.notificationsHeader}>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Recent Activity</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{unreadCount}</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications List */}
      <ScrollView
        style={styles.notificationsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <NotificationItem key={notification.id} notification={notification} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Icon name="notifications-outline" size={64} color={Colors.neutral400} />
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptyMessage}>
              When you get notifications, they'll show up here
            </Text>
          </View>
        )}

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      <BottomNavigation
        navItems={navItems}
        activeTab={activeTab}
        onTabPress={() => {}}
      />   
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primarybg,
  },
  notificationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral900,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  markAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  notificationsList: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  notificationItem: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: Colors.neutral1000,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  systemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  notificationDetails: {
    flex: 1,
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: Colors.neutral600,
    lineHeight: 20,
    marginBottom: 6,
  },
  notificationTime: {
    fontSize: 12,
    color: Colors.neutral400,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.neutral700,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: Colors.neutral500,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomSpacing: {
    height: 80,
  },
});

export default Notifications;