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
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';
import Header from '../components/Header';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';

const { width } = Dimensions.get('window');

interface UserPost {
  id: string;
  title: string;
  content: string;
  image?: string;
  upvotes: number;
  comments: number;
  timeAgo: string;
  category: string;
}

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  joinDate: string;
  totalPosts: number;
  totalUpvotes: number;
  totalComments: number;
  followers: number;
  following: number;
  reputation: number;
  badges: string[];
  isFollowing: boolean;
  location?: string;
  website?: string;
  expertise: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlockedDate: string;
}

const ForumViewProfile: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const [activeTab, setActiveTab] = useState<'posts' | 'achievements' | 'activity'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  // Sample user data - in a real app, this would come from route params or API
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'user123',
    username: 'DevMaster',
    displayName: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Senior Mobile Developer with 8+ years of experience in React Native and Flutter. Passionate about clean code and user experience.',
    joinDate: 'January 2022',
    totalPosts: 127,
    totalUpvotes: 2840,
    totalComments: 456,
    followers: 892,
    following: 234,
    reputation: 4.8,
    badges: ['Top Contributor', 'React Native Expert', 'Helpful Member'],
    isFollowing: false,
    location: 'San Francisco, CA',
    website: 'alexjohnson.dev',
    expertise: ['React Native', 'Flutter', 'JavaScript', 'TypeScript', 'UI/UX', 'Mobile Architecture']
  });

  const [userPosts, setUserPosts] = useState<UserPost[]>([
    {
      id: '1',
      title: 'Tips for Better Mobile App Development',
      content: 'Here are some essential tips that every mobile developer should know to create better, more efficient applications...',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop',
      upvotes: 124,
      comments: 23,
      timeAgo: '2 days ago',
      category: 'Mobile Development'
    },
    {
      id: '2',
      title: 'React Native vs Flutter: A Comprehensive Comparison',
      content: 'Both frameworks have their strengths and weaknesses. Let me break down the key differences...',
      upvotes: 89,
      comments: 34,
      timeAgo: '1 week ago',
      category: 'Framework Comparison'
    },
    {
      id: '3',
      title: 'Optimizing Performance in React Native Apps',
      content: 'Performance optimization is crucial for mobile apps. Here are the techniques I use...',
      upvotes: 156,
      comments: 28,
      timeAgo: '2 weeks ago',
      category: 'Performance'
    }
  ]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Top Contributor',
      description: 'Earned 1000+ upvotes on posts',
      icon: 'trophy',
      color: Colors.warning,
      unlockedDate: '2 months ago'
    },
    {
      id: '2',
      title: 'React Native Expert',
      description: 'Recognized expertise in React Native development',
      icon: 'star',
      color: Colors.primary,
      unlockedDate: '3 months ago'
    },
    {
      id: '3',
      title: 'Helpful Member',
      description: 'Provided helpful answers to 100+ questions',
      icon: 'help-circle',
      color: Colors.success,
      unlockedDate: '4 months ago'
    },
    {
      id: '4',
      title: 'Community Builder',
      description: 'Gained 500+ followers',
      icon: 'people',
      color: Colors.info,
      unlockedDate: '5 months ago'
    }
  ]);

  useEffect(() => {
    setIsFollowing(userProfile.isFollowing);
  }, [userProfile.isFollowing]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // Update user profile
    setUserProfile(prev => ({
      ...prev,
      followers: isFollowing ? prev.followers - 1 : prev.followers + 1,
      isFollowing: !isFollowing
    }));
  };

  const handleMessage = () => {
    // Navigate to messaging screen
    console.log('Navigate to messaging');
  };

  const handlePostPress = (post: UserPost) => {
    // Navigate to post details
    console.log('Navigate to post:', post.id);
  };

  const renderStatItem = (label: string, value: number | string, icon: string) => (
    <View style={styles.statItem}>
      <Icon name={icon} size={20} color={Colors.primary} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const renderPost = ({ item }: { item: UserPost }) => (
    <TouchableOpacity style={styles.postCard} onPress={() => handlePostPress(item)}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.postImage} />
      )}
      <View style={styles.postContent}>
        <View style={styles.postHeader}>
          <Text style={styles.postCategory}>{item.category}</Text>
          <Text style={styles.postTime}>{item.timeAgo}</Text>
        </View>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postDescription} numberOfLines={2}>
          {item.content}
        </Text>
        <View style={styles.postFooter}>
          <View style={styles.postStat}>
            <Icon name="arrow-up" size={16} color={Colors.success} />
            <Text style={styles.postStatText}>{item.upvotes}</Text>
          </View>
          <View style={styles.postStat}>
            <Icon name="chatbubble-outline" size={16} color={Colors.info} />
            <Text style={styles.postStatText}>{item.comments}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderAchievement = ({ item }: { item: Achievement }) => (
    <View style={styles.achievementCard}>
      <View style={[styles.achievementIcon, { backgroundColor: item.color + '20' }]}>
        <Icon name={item.icon} size={24} color={item.color} />
      </View>
      <View style={styles.achievementContent}>
        <Text style={styles.achievementTitle}>{item.title}</Text>
        <Text style={styles.achievementDescription}>{item.description}</Text>
        <Text style={styles.achievementDate}>Unlocked {item.unlockedDate}</Text>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <FlatList
            data={userPosts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        );
      case 'achievements':
        return (
          <FlatList
            data={achievements}
            renderItem={renderAchievement}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        );
      case 'activity':
        return (
          <View style={styles.activityContainer}>
            <Text style={styles.activityText}>Recent activity will be displayed here</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon="back"
        name="User Profile"
        image=""
        onIconPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarSection}>
            <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
            <View style={styles.reputationBadge}>
              <Icon name="star" size={16} color={Colors.warning} />
              <Text style={styles.reputationText}>{userProfile.reputation}</Text>
            </View>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.displayName}>{userProfile.displayName}</Text>
            <Text style={styles.username}>@{userProfile.username}</Text>
            
            {userProfile.location && (
              <View style={styles.locationRow}>
                <Icon name="location-outline" size={16} color={Colors.neutral500} />
                <Text style={styles.locationText}>{userProfile.location}</Text>
              </View>
            )}

            <Text style={styles.bio}>{userProfile.bio}</Text>

            {/* Expertise Tags */}
            <View style={styles.expertiseContainer}>
              {userProfile.expertise.slice(0, 3).map((skill, index) => (
                <View key={index} style={styles.expertiseTag}>
                  <Text style={styles.expertiseText}>{skill}</Text>
                </View>
              ))}
              {userProfile.expertise.length > 3 && (
                <View style={styles.expertiseTag}>
                  <Text style={styles.expertiseText}>+{userProfile.expertise.length - 3}</Text>
                </View>
              )}
            </View>

            <View style={styles.joinInfo}>
              <Icon name="calendar-outline" size={16} color={Colors.neutral500} />
              <Text style={styles.joinText}>Joined {userProfile.joinDate}</Text>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          {renderStatItem('Posts', userProfile.totalPosts, 'document-text-outline')}
          {renderStatItem('Upvotes', userProfile.totalUpvotes, 'arrow-up-outline')}
          {renderStatItem('Followers', userProfile.followers, 'people-outline')}
          {renderStatItem('Following', userProfile.following, 'person-add-outline')}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={[styles.actionBtn, isFollowing ? styles.followingBtn : styles.followBtn]} 
            onPress={handleFollow}
          >
            <Icon 
              name={isFollowing ? "checkmark" : "person-add"} 
              size={20} 
              color={isFollowing ? Colors.success : Colors.primary} 
            />
            <Text style={[styles.actionBtnText, isFollowing ? styles.followingText : styles.followText]}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, styles.messageBtn]} onPress={handleMessage}>
            <Icon name="chatbubble-outline" size={20} color={Colors.neutral600} />
            <Text style={[styles.actionBtnText, styles.messageBtnText]}>Message</Text>
          </TouchableOpacity>
        </View>

        {/* Badges */}
        {userProfile.badges.length > 0 && (
          <View style={styles.badgesSection}>
            <Text style={styles.sectionTitle}>Badges</Text>
            <View style={styles.badgesContainer}>
              {userProfile.badges.map((badge, index) => (
                <View key={index} style={styles.badge}>
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
            onPress={() => setActiveTab('posts')}
          >
            <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
              Posts ({userProfile.totalPosts})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
            onPress={() => setActiveTab('achievements')}
          >
            <Text style={[styles.tabText, activeTab === 'achievements' && styles.activeTabText]}>
              Achievements
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'activity' && styles.activeTab]}
            onPress={() => setActiveTab('activity')}
          >
            <Text style={[styles.tabText, activeTab === 'activity' && styles.activeTabText]}>
              Activity
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {renderTabContent()}
        </View>

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
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: Colors.neutral0,
    padding: 20,
    alignItems: 'center',
  },
  avatarSection: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  reputationBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.warning,
  },
  reputationText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.warning,
    marginLeft: 4,
  },
  profileInfo: {
    alignItems: 'center',
    width: '100%',
  },
  displayName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral900,
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: Colors.neutral600,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: Colors.neutral500,
    marginLeft: 4,
  },
  bio: {
    fontSize: 16,
    color: Colors.neutral700,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  expertiseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  expertiseTag: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
  },
  expertiseText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
  },
  joinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinText: {
    fontSize: 14,
    color: Colors.neutral500,
    marginLeft: 4,
  },
  statsSection: {
    backgroundColor: Colors.neutral0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral900,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.neutral600,
    marginTop: 2,
  },
  actionSection: {
    backgroundColor: Colors.neutral0,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 25,
  },
  followBtn: {
    backgroundColor: Colors.primaryLight,
  },
  followingBtn: {
    backgroundColor: Colors.successLight,
  },
  messageBtn: {
    backgroundColor: Colors.neutral100,
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  followText: {
    color: Colors.primary,
  },
  followingText: {
    color: Colors.success,
  },
  messageBtnText: {
    color: Colors.neutral600,
  },
  badgesSection: {
    backgroundColor: Colors.neutral0,
    padding: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 12,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: Colors.warningLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.warning,
  },
  tabsContainer: {
    backgroundColor: Colors.neutral0,
    flexDirection: 'row',
    marginTop: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral600,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  tabContent: {
    backgroundColor: Colors.neutral0,
  },
  postCard: {
    backgroundColor: Colors.neutral0,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral100,
  },
  postImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  postContent: {
    padding: 16,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  postCategory: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  postTime: {
    fontSize: 12,
    color: Colors.neutral500,
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
  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  postStatText: {
    fontSize: 14,
    color: Colors.neutral600,
    marginLeft: 4,
  },
  achievementCard: {
    backgroundColor: Colors.neutral0,
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral100,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: Colors.neutral600,
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 12,
    color: Colors.neutral500,
  },
  activityContainer: {
    padding: 40,
    alignItems: 'center',
  },
  activityText: {
    fontSize: 16,
    color: Colors.neutral500,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default ForumViewProfile;