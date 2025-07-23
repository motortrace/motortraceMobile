import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Colors from '../../constants/colors';
import PostCard from '../../components/PostCard';
import Header from '../../components/Header';
import SearchBar from '../../components/SearchBar';
import BottomNavigation from '../../components/BottomNav';
import { useState } from "react"
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';

const Forum = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState(0)

  const samplePosts = [
    {
      id: '1',
      title: 'How to Fix Engine Overheating in a Honda Civic?',
      content:
        'My 2012 Honda Civic keeps overheating after short drives. I have checked the coolant and radiator. Has anyone experienced this? What was the fix?',
      author: 'CarFixerJoe',
      authorAvatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      timeAgo: '2 hours ago',
      upvotes: 24,
      downvotes: 1,
      commentCount: 12,
      isUpvoted: false,
      isDownvoted: false,
      isSaved: true,
      tags: ['engine', 'overheating', 'honda', 'repair'],
      images: [
        'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=250&fit=crop',
      ],
    },
    {
      id: '2',
      title: 'Best Practices for Regular Car Maintenance',
      content:
        'What are your go-to tips for keeping your car running smoothly? Share your maintenance routines and any must-do checks!',
      author: 'AutoGuru',
      authorAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      timeAgo: '6 hours ago',
      upvotes: 156,
      downvotes: 8,
      commentCount: 34,
      isUpvoted: true,
      isDownvoted: false,
      isSaved: false,
      tags: ['maintenance', 'tips', 'routine', 'car'],
      images: [
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop',
      ],
    },
    {
      id: '3',
      title: 'Share Your DIY Car Repair Success Stories',
      content:
        'Let’s inspire each other! What car repairs have you tackled yourself? Share your story, what tools you used, and any lessons learned.',
      author: 'DIYMechanic',
      timeAgo: '1 day ago',
      upvotes: 89,
      downvotes: 3,
      commentCount: 21,
      isUpvoted: false,
      isDownvoted: false,
      isSaved: true,
      tags: ['diy', 'repair', 'success', 'stories'],
      images: [
        'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=250&fit=crop',
        'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop',
      ],
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


  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header
        icon="back"
        name="Community Forum"
        image=""
        onIconPress={() => navigation.navigate('Home')}
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar 
          placeholder="Search discussions, topics..." 
          containerStyle= {{marginBottom: 0}}
        />
      </View>

      {/* Posts Feed */}
      <ScrollView
        style={styles.postsContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {samplePosts.map(post => (
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
        ))}

        <Text style={styles.loadMoreText}>Load More Posts</Text>

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
  searchContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: Colors.neutral1000,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  postsContainer: {
    flex: 1,
    marginTop: 16,
  },
  scrollContent: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  loadMoreText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
    marginTop: 10,
  },
  bottomSpacing: {
    height: 0,
  },
});

export default Forum;
