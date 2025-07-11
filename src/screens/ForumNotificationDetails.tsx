import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';
import Header from '../components/Header'
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';

const { width } = Dimensions.get('window');

interface NotificationDetailsProps {
  onBack?: () => void;
  onActionPress?: () => void;
}

interface DetailedNotification {
  id: string;
  type: 'upvote' | 'comment' | 'downvote' | 'follow' | 'mention' | 'system';
  title: string;
  message: string;
  fullContent?: string;
  time: string;
  isRead: boolean;
  avatar?: string;
  actionIcon: string;
  actionColor: string;
  userName?: string;
  postTitle?: string;
  postContent?: string;
  postImage?: string;
  relatedUsers?: string[];
  actionCount?: number;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
}

const NotificationDetailsScreen: React.FC<NotificationDetailsProps> = ({
  onBack,
  onActionPress
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Sample detailed notification data - in a real app, this would come from route params or API
  const [notificationData, setNotificationData] = useState<DetailedNotification>({
    id: '1',
    type: 'upvote',
    title: 'New upvote on your post',
    message: 'DevMaster upvoted your post "Tips for Better Mobile App Development"',
    fullContent: 'DevMaster and 23 others found your post "Tips for Better Mobile App Development" helpful and gave it an upvote. Your post is gaining traction in the Mobile Development community!',
    time: '2 minutes ago',
    isRead: false,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    actionIcon: 'arrow-up-circle',
    actionColor: Colors.success,
    userName: 'DevMaster',
    postTitle: 'Tips for Better Mobile App Development',
    postContent: 'Here are some essential tips that every mobile developer should know to create better, more efficient applications...',
    postImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop',
    relatedUsers: ['DevMaster', 'CodeNinja', 'UIExpert', 'TechGuru'],
    actionCount: 24,
    category: 'Mobile Development',
    priority: 'medium'
  });

  useEffect(() => {
    // Mark notification as read when viewed
    if (!notificationData.isRead) {
      setNotificationData(prev => ({ ...prev, isRead: true }));
    }
  }, []);

  const getActionText = (type: string, count?: number) => {
    switch (type) {
      case 'upvote':
        return count && count > 1 ? `${count} upvotes` : '1 upvote';
      case 'comment':
        return count && count > 1 ? `${count} comments` : '1 comment';
      case 'downvote':
        return 'Post activity';
      case 'follow':
        return 'New follower';
      case 'mention':
        return 'You were mentioned';
      default:
        return 'Activity';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return Colors.danger;
      case 'medium':
        return Colors.warning;
      case 'low':
        return Colors.success;
      default:
        return Colors.neutral400;
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this notification: ${notificationData.title} - ${notificationData.message}`,
        title: notificationData.title,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleViewPost = () => {
    // Navigate to the related post
    // navigation.navigate('PostDetails', { postId: notificationData.postId });
    console.log('Navigate to post details');
  };

  const handleViewProfile = () => {
    // Navigate to user profile
    // navigation.navigate('UserProfile', { userId: notificationData.userId });
    console.log('Navigate to user profile');
  };

  return (
    <SafeAreaView style={styles.container}>
            <Header
        icon="back"
        name="Community Forum"
        image=""
        onIconPress={() => navigation.navigate('NotificationForum')}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Notification Header */}
        <View style={styles.notificationHeader}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              {notificationData.avatar ? (
                <Image source={{ uri: notificationData.avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.systemIcon, { backgroundColor: notificationData.actionColor + '20' }]}>
                  <Icon name={notificationData.actionIcon} size={32} color={notificationData.actionColor} />
                </View>
              )}
              <View style={[styles.actionIndicator, { backgroundColor: notificationData.actionColor }]}>
                <Icon name={notificationData.actionIcon} size={16} color="white" />
              </View>
            </View>
          </View>

          <View style={styles.headerInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.notificationTitle}>{notificationData.title}</Text>
              {notificationData.priority && (
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(notificationData.priority) + '20' }]}>
                  <Text style={[styles.priorityText, { color: getPriorityColor(notificationData.priority) }]}>
                    {notificationData.priority.toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
            
            <Text style={styles.actionType}>
              {getActionText(notificationData.type, notificationData.actionCount)}
            </Text>
            
            <View style={styles.timeRow}>
              <Icon name="time-outline" size={16} color={Colors.neutral400} />
              <Text style={styles.timeText}>{notificationData.time}</Text>
              {notificationData.category && (
                <>
                  <View style={styles.dot} />
                  <Text style={styles.categoryText}>{notificationData.category}</Text>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Full Content */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Details</Text>
          <Text style={styles.fullContent}>
            {notificationData.fullContent || notificationData.message}
          </Text>
        </View>

        {/* Related Users */}
        {notificationData.relatedUsers && notificationData.relatedUsers.length > 0 && (
          <View style={styles.usersSection}>
            <Text style={styles.sectionTitle}>People Involved</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {notificationData.relatedUsers.map((user, index) => (
                <TouchableOpacity key={index} style={styles.userChip} onPress={handleViewProfile}>
                  <Text style={styles.userChipText}>{user}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Related Post */}
        {notificationData.postTitle && (
          <View style={styles.postSection}>
            <Text style={styles.sectionTitle}>Related Post</Text>
            <TouchableOpacity style={styles.postCard} onPress={handleViewPost}>
              {notificationData.postImage && (
                <Image source={{ uri: notificationData.postImage }} style={styles.postImage} />
              )}
              <View style={styles.postContent}>
                <Text style={styles.postTitle}>{notificationData.postTitle}</Text>
                {notificationData.postContent && (
                  <Text style={styles.postDescription} numberOfLines={3}>
                    {notificationData.postContent}
                  </Text>
                )}
                <View style={styles.postFooter}>
                  <Icon name="eye-outline" size={16} color={Colors.neutral400} />
                  <Text style={styles.postAction}>View full post</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Action Stats */}
        {notificationData.actionCount && notificationData.actionCount > 1 && (
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Activity Summary</Text>
            <View style={styles.statsCard}>
              <View style={styles.statItem}>
                <Icon name={notificationData.actionIcon} size={24} color={notificationData.actionColor} />
                <View style={styles.statText}>
                  <Text style={styles.statNumber}>{notificationData.actionCount}</Text>
                  <Text style={styles.statLabel}>
                    {notificationData.type === 'upvote' ? 'Upvotes' : 'Interactions'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          {notificationData.type === 'comment' && (
            <TouchableOpacity style={styles.actionBtn} onPress={handleViewPost}>
              <Icon name="chatbubble-outline" size={20} color={Colors.primary} />
              <Text style={styles.actionBtnText}>Reply</Text>
            </TouchableOpacity>
          )}
          
          {notificationData.type === 'upvote' && (
            <TouchableOpacity style={styles.actionBtn} onPress={()=> navigation.navigate('Forum')}>
              <Icon name="eye-outline" size={20} color={Colors.primary} />
              <Text style={styles.actionBtnText}>View Post</Text>
            </TouchableOpacity>
          )}
          
          {notificationData.userName && (
            <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]} onPress={()=> navigation.navigate('ForumViewProfile')}>
              <Icon name="person-outline" size={20} color={Colors.neutral600} />
              <Text style={[styles.actionBtnText, styles.secondaryBtnText]}>View Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primarybg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 20,
    backgroundColor: Colors.neutral0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral100,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral900,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  notificationHeader: {
    backgroundColor: Colors.neutral0,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral100,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  systemIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.neutral0,
  },
  headerInfo: {
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  notificationTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral900,
    textAlign: 'center',
    marginRight: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  actionType: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: Colors.neutral500,
    marginLeft: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.neutral400,
    marginHorizontal: 8,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.neutral500,
  },
  contentSection: {
    backgroundColor: Colors.neutral0,
    marginTop: 8,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 12,
  },
  fullContent: {
    fontSize: 16,
    color: Colors.neutral700,
    lineHeight: 24,
  },
  usersSection: {
    backgroundColor: Colors.neutral0,
    marginTop: 8,
    padding: 20,
  },
  userChip: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  userChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  postSection: {
    backgroundColor: Colors.neutral0,
    marginTop: 8,
    padding: 20,
  },
  postCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  postContent: {
    padding: 16,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 8,
  },
  postDescription: {
    fontSize: 14,
    color: Colors.neutral600,
    lineHeight: 20,
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAction: {
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  statsSection: {
    backgroundColor: Colors.neutral0,
    marginTop: 8,
    padding: 20,
  },
  statsCard: {
    backgroundColor: Colors.neutral50,
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral900,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  actionsSection: {
    backgroundColor: Colors.neutral0,
    marginTop: 8,
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 1,
    minWidth: 120,
    justifyContent: 'center',
  },
  secondaryBtn: {
    backgroundColor: Colors.neutral100,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 8,
  },
  secondaryBtnText: {
    color: Colors.neutral600,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default NotificationDetailsScreen;