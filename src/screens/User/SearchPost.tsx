import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';
import PostCard from '../components/PostCard';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import BottomNavigation from '../components/BottomNav';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';

const SearchDiscover = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState(1)

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

  // Sample data
  const trendingTags = [
    { id: '1', name: 'react-native', count: 245 },
    { id: '2', name: 'ui-design', count: 189 },
    { id: '3', name: 'javascript', count: 156 },
    { id: '4', name: 'mobile-dev', count: 134 },
    { id: '5', name: 'flutter', count: 98 },
    { id: '6', name: 'ios', count: 87 },
  ];

  const categories = [
    { id: 'all', name: 'All', icon: 'apps-outline' },
    { id: 'development', name: 'Development', icon: 'code-outline' },
    { id: 'design', name: 'Design', icon: 'color-palette-outline' },
    { id: 'discussion', name: 'Discussion', icon: 'chatbubbles-outline' },
    { id: 'help', name: 'Help', icon: 'help-circle-outline' },
  ];

  const popularPosts = [
    {
      id: '1',
      title: 'Advanced React Native Performance Tips',
      content: 'Deep dive into optimization techniques that can dramatically improve your app performance...',
      author: 'TechExpert',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      timeAgo: '3 hours ago',
      upvotes: 342,
      downvotes: 12,
      commentCount: 67,
      tags: ['react-native', 'performance', 'optimization'],
    },
    {
      id: '2',
      title: 'Modern UI Design Principles 2024',
      content: 'Latest trends in mobile UI design that every developer should know about...',
      author: 'DesignPro',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      timeAgo: '5 hours ago',
      upvotes: 278,
      downvotes: 8,
      commentCount: 45,
      tags: ['ui-design', 'trends', 'mobile'],
    },
  ];

  const recentSearches = ['react hooks', 'flutter vs react native', 'ui animation', 'state management'];

  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsSearching(query.length > 0);
  };

  const renderTrendingTag = ({ item }) => (
    <TouchableOpacity style={styles.tagItem}>
      <Text style={styles.tagName}>#{item.name}</Text>
      <Text style={styles.tagCount}>{item.count} posts</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon="back"
        name="Discover"
        image=""
        onIconPress={() => navigation.navigate('Home')}
      />

      <SearchBar 
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search posts, users, or topics..."
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!isSearching ? (
          // Discovery Content
          <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { marginBottom: 15 }]}>Recent Searches</Text>
                <View style={styles.recentSearches}>
                  {recentSearches.map((search, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={styles.recentSearchItem}
                      onPress={() => handleSearch(search)}
                    >
                      <Icon name="time-outline" size={16} color={Colors.neutral600} />
                      <Text style={styles.recentSearchText}>{search}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Trending Tags */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Trending Topics</Text>
              </View>
              <FlatList
                data={trendingTags}
                renderItem={renderTrendingTag}
                keyExtractor={(item) => item.id}
                numColumns={2}
                scrollEnabled={false}
              />
            </View>

            {/* Popular Posts */}
            <View style={[styles.section, { marginBottom: 35 }]}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle,{ marginTop: 15 }]}>Popular This Week</Text>
              </View>
              {popularPosts.map((post) => (
                <PostCard
                  key={post.id}
                  {...post}
                  onPress={() => console.log(`Post ${post.id} pressed`)}
                  onUpvote={() => console.log(`Upvoted post ${post.id}`)}
                  onDownvote={() => console.log(`Downvoted post ${post.id}`)}
                  onComment={() => console.log(`Commented on post ${post.id}`)}
                  onSave={() => console.log(`Saved post ${post.id}`)}
                  onShare={() => console.log(`Shared post ${post.id}`)}
                  onAuthorPress={() => console.log(`Author pressed: ${post.author}`)}
                />
              ))}
            </View>
          </>
        ) : (
          // Search Results
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Search Results for "{searchQuery}"</Text>
            <View style={styles.searchResults}>
              <Text style={styles.noResultsText}>
                Start typing to see search results...
              </Text>
            </View>
          </View>
        )}
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
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: Colors.neutral1000,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral100,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.neutral800,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.neutral100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: Colors.neutral100,
  },
  activeCategoryButton: {
    backgroundColor: Colors.primary,
  },
  categoryText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  activeCategoryText: {
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral800,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  recentSearches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  recentSearchText: {
    marginLeft: 4,
    fontSize: 14,
    color: Colors.neutral700,
  },
  tagItem: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    margin: 4,
    borderRadius: 12,
    elevation: 2,
    shadowColor: Colors.neutral1000,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tagName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 4,
  },
  tagCount: {
    fontSize: 12,
    color: Colors.neutral600,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: Colors.neutral1000,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInitial: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral800,
  },
  userUsername: {
    fontSize: 14,
    color: Colors.neutral600,
    marginBottom: 2,
  },
  userSpecialty: {
    fontSize: 12,
    color: Colors.primary,
    marginBottom: 2,
  },
  userFollowers: {
    fontSize: 12,
    color: Colors.neutral600,
  },
  followButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  searchResults: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: Colors.neutral600,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 100,
  },
});

export default SearchDiscover;