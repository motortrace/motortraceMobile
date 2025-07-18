import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/colors';
import Header from '../../components/Header';
import CommentCard from '../../components/CommontCard';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';

const ForumDetail = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownvoted, setIsDownvoted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [upvotes, setUpvotes] = useState(156);
  const [downvotes, setDownvotes] = useState(8);
  const [localSaved, setLocalSaved] = useState(true);
  const [activeTab, setActiveTab] = useState(0)

  const postData = {
    title: "Tips for Better Mobile App Development",
    content: `After 5 years of React Native development, here are my top tips for building better mobile apps: What are your thoughts on these practices? Have you encountered any other important tips in your development journey?`,
    author: "DevMaster",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    timeAgo: "6 hours ago",
    tags: ['development', 'react-native', 'tips', 'mobile'],
    images: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop',
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop'
    ],
    commentCount: 24
  };

  const sampleComments = [
    {
      id: '1',
      author: 'ReactFan',
      content: 'Great tips! I especially agree with the FlatList recommendation. Made a huge difference in my app performance.',
      timeAgo: '4 hours ago',
      upvotes: 12,
      downvotes: 0,
      replies: [
        {
          id: '1-1',
          author: 'DevMaster',
          authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          content: 'Exactly! FlatList is a game changer for performance. Glad it helped you too!',
          timeAgo: '3 hours ago',
          upvotes: 8,
          downvotes: 0,
        }
      ]
    },
    {
      id: '2',
      author: 'MobileGuru',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      content: 'Would love to add: Always test on low-end devices! What works smoothly on flagship phones might struggle on budget devices.',
      timeAgo: '3 hours ago',
      upvotes: 18,
      downvotes: 1,
      replies: []
    },
    {
      id: '3',
      author: 'UIDesigner',
      authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      content: 'The design consistency point is so important! Too many apps ignore platform guidelines and end up feeling alien to users.',
      timeAgo: '2 hours ago',
      upvotes: 15,
      downvotes: 0,
      replies: []
    },
    {
      id: '4',
      author: 'CodeNewbie',
      authorAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face',
      content: 'As someone new to React Native, this is incredibly helpful! Any recommendations for learning resources?',
      timeAgo: '1 hour ago',
      upvotes: 6,
      downvotes: 0,
      replies: []
    }
  ];

  const handleUpvote = () => {
    if (isUpvoted) {
      setIsUpvoted(false);
      setUpvotes(upvotes - 1);
    } else {
      setIsUpvoted(true);
      setUpvotes(upvotes + 1);
      if (isDownvoted) {
        setIsDownvoted(false);
        setDownvotes(downvotes - 1);
      }
    }
  };

  const handleDownvote = () => {
    if (isDownvoted) {
      setIsDownvoted(false);
      setDownvotes(downvotes - 1);
    } else {
      setIsDownvoted(true);
      setDownvotes(downvotes + 1);
      if (isUpvoted) {
        setIsUpvoted(false);
        setUpvotes(upvotes - 1);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <Header
        icon="back"
        name="Community Forum"
        image=""
        onIconPress={() => navigation.navigate('Forum')}
      />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Post Content */}
        <View style={styles.postContainer}>
          {/* Post Header */}
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 25,}}>
            <View style={styles.postHeader}>
                <Image source={{ uri: postData.authorAvatar }} style={styles.authorAvatar} />
                <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{postData.author}</Text>
                <Text style={styles.postTime}>{postData.timeAgo}</Text>
                </View>
            </View>

            <TouchableOpacity onPress={() => setIsSaved(!isSaved)} style={styles.savedButton}>
                <Icon
                    name={localSaved ? "bookmark" : "bookmark-outline"} 
                    size={20} 
                    color={localSaved ? Colors.primary : Colors.neutral400} 
                />
            </TouchableOpacity>
          </View>

          {/* Post Title */}
          <Text style={styles.postTitle}>{postData.title}</Text>

          {/* Post Tags */}
          <View style={styles.tagsContainer}>
            {postData.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>

          {/* Post Images */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesContainer}>
            {postData.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.postImage} />
            ))}
          </ScrollView>

          {/* Post Content */}
          <Text style={styles.postContent}>{postData.content}</Text>

          {/* Post Actions */}
          <View style={styles.postActions}>
            <View style={styles.votingSection}>
              <TouchableOpacity 
                style={[styles.actionButton, isUpvoted && styles.upvotedButton]} 
                onPress={handleUpvote}
              >
                <Icon name="arrow-up" size={20} color={isUpvoted ? 'white' : Colors.primary} />
                <Text style={[styles.actionText, isUpvoted && styles.upvotedText]}>{upvotes}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, isDownvoted && styles.downvotedButton]} 
                onPress={handleDownvote}
              >
                <Icon name="arrow-down" size={20} color={isDownvoted ? 'white' : Colors.primary} />
                <Text style={[styles.actionText, isDownvoted && styles.downvotedText]}>{downvotes}</Text>
              </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
                <Icon name="chatbubble-outline" size={20} color={Colors.primary} />
                <Text style={styles.actionText}>{postData.commentCount}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="share-outline" size={20} color={Colors.primary} />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <View style={styles.commentsSectionHeader}>
            <Text style={styles.commentsTitle}>Comments ({sampleComments.length})</Text>
            <TouchableOpacity style={styles.sortButton}>
              <Icon name="swap-vertical" size={16} color={Colors.primary} />
              <Text style={styles.sortText}>Best</Text>
            </TouchableOpacity>
          </View>

          {sampleComments.map(comment => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </View>
      </ScrollView>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.commentInputContainer}
      >
        <View style={styles.commentInputSection}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            placeholderTextColor={Colors.neutral400}
            value={commentText}
            onChangeText={setCommentText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.sendButton, commentText.trim() && styles.sendButtonActive]} 
            disabled={!commentText.trim()}
          >
            <Icon name="send" size={20} color={commentText.trim() ? 'white' : Colors.neutral400} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral0,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral700,
  },
  headerAction: {
    padding: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  postContainer: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: Colors.neutral1000,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral700,
  },
  postTime: {
    fontSize: 12,
    color: Colors.neutral400,
    marginTop: 2,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.neutral700,
    marginBottom: 12,
    lineHeight: 28,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: `${Colors.primary}15`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  imagesContainer: {
    marginBottom: 16,
  },
  postImage: {
    width: 300,
    height: 200,
    borderRadius: 8,
    marginRight: 12,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.neutral600,
    marginBottom: 20,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral0,
  },
  votingSection: {
    flexDirection: 'row',
  },
  otherActions: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: Colors.neutral100,
  },
  upvotedButton: {
    backgroundColor: Colors.primary,
  },
  downvotedButton: {
    backgroundColor: Colors.warning,
  },
  savedButton: {
    backgroundColor: `${Colors.primary}15`,
  },
  actionText: {
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  upvotedText: {
    color: 'white',
  },
  downvotedText: {
    color: 'white',
  },
  savedText: {
    color: Colors.primary,
  },
  commentsSection: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: Colors.neutral1000,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  commentsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral0,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral700,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: Colors.neutral100,
  },
  sortText: {
    fontSize: 12,
    color: Colors.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  replyContainer: {
    marginLeft: 32,
    marginTop: 12,
    paddingLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: Colors.neutral300,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral700,
    marginRight: 8,
  },
  commentTime: {
    fontSize: 12,
    color: Colors.neutral400,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral600,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  commentActionText: {
    fontSize: 12,
    color: Colors.neutral400,
    marginLeft: 4,
  },
  commentInputContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: Colors.neutral0,
    paddingBottom: 25,
  },
  commentInputSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 14,
    color: Colors.neutral700,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: Colors.primary,
  },
});

export default ForumDetail;