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
import PostCard from '../../components/PostCard';
import Header from '../../components/Header';
import BottomNavigation from '../../components/BottomNav';
import { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';

const Profile = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState(4);
  const [profileTab, setProfileTab] = useState('posts'); // 'posts' or 'comments'

  // User profile data
  const userProfile = {
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    stats: {
      posts: 12,
      comments: 47,
      upvotes: 328,
      followers: 156,
      following: 89,
    }
  };

  // User's posts
  const myPosts = [
    {
      id: '1',
      title: 'Tips for Better Mobile App Development',
      content: 'After 5 years of React Native development, here are my top tips for building better mobile apps. Performance optimization is key, and user experience should always come first...',
      author: 'John Doe',
      authorAvatar: userProfile.avatar,
      timeAgo: '6 hours ago',
      upvotes: 156,
      downvotes: 8,
      commentCount: 34,
      isUpvoted: false,
      isDownvoted: false,
      isSaved: false,
      tags: ['development', 'react-native', 'tips'],
      images: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop'],
    },
    {
      id: '2',
      title: 'My Journey Learning React Native',
      content: 'Started my React Native journey 2 years ago. Here are the challenges I faced and how I overcame them. Hope this helps other beginners...',
      author: 'John Doe',
      authorAvatar: userProfile.avatar,
      timeAgo: '2 days ago',
      upvotes: 89,
      downvotes: 3,
      commentCount: 21,
      isUpvoted: false,
      isDownvoted: false,
      isSaved: false,
      tags: ['learning', 'experience', 'beginner'],
      images: [],
    },
    {
      id: '3',
      title: 'Best VS Code Extensions for React Development',
      content: 'Here are my favorite VS Code extensions that boost productivity when working with React and React Native projects...',
      author: 'John Doe',
      authorAvatar: userProfile.avatar,
      timeAgo: '1 week ago',
      upvotes: 203,
      downvotes: 5,
      commentCount: 18,
      isUpvoted: false,
      isDownvoted: false,
      isSaved: false,
      tags: ['tools', 'productivity', 'vscode'],
      images: ['https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop'],
    },
  ];

  // User's comments on other posts
  const myComments = [
    {
      id: '1',
      postTitle: 'Beautiful UI Design Inspiration',
      postAuthor: 'DesignGuru',
      postAuthorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b830?w=150&h=150&fit=crop&crop=face',
      myComment: 'Amazing designs! The gradient usage is really well done. I especially love the micro-interactions in the second example. Do you have any tutorials on how to implement similar effects?',
      timeAgo: '3 hours ago',
      upvotes: 12,
      isUpvoted: true,
    },
    {
      id: '2',
      postTitle: 'React Native Performance Optimization',
      postAuthor: 'TechLead',
      postAuthorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      myComment: 'Great article! I would also add that using FlatList instead of ScrollView for large datasets can significantly improve performance. Also, consider using React.memo for components that don\'t need frequent re-renders.',
      timeAgo: '1 day ago',
      upvotes: 24,
      isUpvoted: false,
    },
    {
      id: '3',
      postTitle: 'State Management in Large Apps',
      postAuthor: 'CodeMaster',
      postAuthorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      myComment: 'I\'ve been using Redux Toolkit for state management and it\'s been great. The slice pattern really simplifies the boilerplate code.',
      timeAgo: '3 days ago',
      upvotes: 8,
      isUpvoted: false,
    },
    {
      id: '4',
      postTitle: 'Best Practices for API Integration',
      postAuthor: 'DevExpert',
      postAuthorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      myComment: 'Don\'t forget about proper error handling and loading states. Users appreciate good feedback when things are processing or when something goes wrong.',
      timeAgo: '1 week ago',
      upvotes: 15,
      isUpvoted: true,
    },
  ];

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

  const CommentCard = ({ comment }) => {
    return (
      <View style={styles.commentCard}>
        {/* Original Post Info */}
        <View style={styles.originalPost}>
          <Image source={{ uri: comment.postAuthorAvatar }} style={styles.originalAuthorAvatar} />
          <View style={styles.originalPostInfo}>
            <Text style={styles.originalPostTitle} numberOfLines={1}>
              {comment.postTitle}
            </Text>
            <Text style={styles.originalAuthor}>by {comment.postAuthor}</Text>
          </View>
        </View>

        {/* My Comment */}
        <View style={styles.myCommentSection}>
          <View style={styles.commentHeader}>
            <Image source={{ uri: userProfile.avatar }} style={styles.commentAvatar} />
            <View style={styles.commentInfo}>
              <Text style={styles.commentAuthor}>You commented</Text>
              <Text style={styles.commentTime}>{comment.timeAgo}</Text>
            </View>
          </View>
          <Text style={styles.commentText}>{comment.myComment}</Text>
          
          {/* Comment Actions */}
          <View style={styles.commentActions}>
            <TouchableOpacity style={styles.commentAction}>
              <Icon 
                name={comment.isUpvoted ? "arrow-up-circle" : "arrow-up-circle-outline"} 
                size={18} 
                color={comment.isUpvoted ? Colors.success : Colors.neutral500} 
              />
              <Text style={[styles.commentActionText, comment.isUpvoted && { color: Colors.success }]}>
                {comment.upvotes}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.commentAction}>
              <Icon name="chatbubble-outline" size={18} color={Colors.neutral500} />
              <Text style={styles.commentActionText}>Reply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header
        icon="settings"
        name="Profile"
        image=""
        onIconPress={() => navigation.navigate('Home')}
      />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image source={{ uri: userProfile.avatar }} style={styles.profileAvatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userProfile.name}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userProfile.stats.posts}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userProfile.stats.comments}</Text>
            <Text style={styles.statLabel}>Comments</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userProfile.stats.upvotes}</Text>
            <Text style={styles.statLabel}>Upvotes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userProfile.stats.followers}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userProfile.stats.following}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        {/* Profile Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, profileTab === 'posts' && styles.activeTab]}
            onPress={() => setProfileTab('posts')}
          >
            <Icon 
              name="document-text-outline" 
              size={20} 
              color={profileTab === 'posts' ? Colors.primary : Colors.neutral500} 
            />
            <Text style={[styles.tabText, profileTab === 'posts' && styles.activeTabText]}>
              My Posts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, profileTab === 'comments' && styles.activeTab]}
            onPress={() => setProfileTab('comments')}
          >
            <Icon 
              name="chatbubbles-outline" 
              size={20} 
              color={profileTab === 'comments' ? Colors.primary : Colors.neutral500} 
            />
            <Text style={[styles.tabText, profileTab === 'comments' && styles.activeTabText]}>
              My Comments
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content based on active tab */}
        <View style={styles.contentContainer}>
          {profileTab === 'posts' ? (
            // My Posts
            myPosts.length > 0 ? (
              myPosts.map(post => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  content={post.content}
                  author={post.author}
                  authorAvatar={post.authorAvatar}
                  timeAgo={post.timeAgo}
                  upvotes={post.upvotes}
                  downvotes={post.downvotes}
                  commentCount={post.commentCount}
                  isUpvoted={post.isUpvoted}
                  isDownvoted={post.isDownvoted}
                  isSaved={post.isSaved}
                  tags={post.tags}
                  images={post.images}
                  onPress={() => console.log(`Post ${post.id} pressed`)}
                  onUpvote={postId => console.log(`Upvoted post ${postId}`)}
                  onDownvote={postId => console.log(`Downvoted post ${postId}`)}
                  onComment={postId => console.log(`Commented on post ${postId}`)}
                  onSave={postId => console.log(`Saved post ${postId}`)}
                  onShare={postId => console.log(`Shared post ${postId}`)}
                  onAuthorPress={author => console.log(`Author pressed: ${author}`)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Icon name="document-outline" size={64} color={Colors.neutral400} />
                <Text style={styles.emptyTitle}>No posts yet</Text>
                <Text style={styles.emptyMessage}>Share your thoughts with the community</Text>
              </View>
            )
          ) : (
            // My Comments
            myComments.length > 0 ? (
              myComments.map(comment => (
                <CommentCard key={comment.id} comment={comment} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Icon name="chatbubbles-outline" size={64} color={Colors.neutral400} />
                <Text style={styles.emptyTitle}>No comments yet</Text>
                <Text style={styles.emptyMessage}>Start engaging with the community</Text>
              </View>
            )
          )}
        </View>

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
  scrollContainer: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: 'white',
    padding: 15,
    alignItems: 'center',
    marginBottom: 4,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 5,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral900,
    marginBottom: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 20,
    marginBottom: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral900,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.neutral600,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral500,
    marginLeft: 8,
  },
  activeTabText: {
    color: Colors.primary,
  },
  contentContainer: {
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentCard: {
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
  originalPost: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
    marginBottom: 12,
  },
  originalAuthorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  originalPostInfo: {
    flex: 1,
  },
  originalPostTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral800,
    marginBottom: 2,
  },
  originalAuthor: {
    fontSize: 12,
    color: Colors.neutral500,
  },
  myCommentSection: {
    marginTop: 4,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  commentAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  commentInfo: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  commentTime: {
    fontSize: 11,
    color: Colors.neutral400,
  },
  commentText: {
    fontSize: 14,
    color: Colors.neutral700,
    lineHeight: 20,
    marginBottom: 12,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  commentActionText: {
    fontSize: 12,
    color: Colors.neutral500,
    marginLeft: 4,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral700,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: Colors.neutral500,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 10,
  },
});

export default Profile;