import React, { useState } from "react"
import { Text, TouchableOpacity, Image, Dimensions, View, StyleSheet } from "react-native"
import Icon from 'react-native-vector-icons/Ionicons'
import Colors from "../constants/colors"
import AutoSizeImage from "../helper/AutoSizeImage"
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';

interface PostCardProps {
  id: string
  title: string
  content: string
  author: string
  authorAvatar?: string
  timeAgo: string
  upvotes: number
  downvotes: number
  commentCount: number
  isUpvoted?: boolean
  isDownvoted?: boolean
  isSaved?: boolean
  tags?: string[]
  images?: string[]
  onPress?: () => void
  onUpvote?: (postId: string) => void
  onDownvote?: (postId: string) => void
  onComment?: (postId: string) => void
  onSave?: (postId: string) => void
  onShare?: (postId: string) => void
  onAuthorPress?: (author: string) => void
}

const PostCard: React.FC<PostCardProps> = ({
  id,
  title,
  content,
  author,
  authorAvatar,
  timeAgo,
  upvotes,
  downvotes,
  commentCount,
  isUpvoted = false,
  isDownvoted = false,
  isSaved = false,
  tags = [],
  images = [],
  onPress,
  onUpvote,
  onDownvote,
  onComment,
  onSave,
  onShare,
  onAuthorPress
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [localUpvoted, setLocalUpvoted] = useState(isUpvoted)
  const [localDownvoted, setLocalDownvoted] = useState(isDownvoted)
  const [localSaved, setLocalSaved] = useState(isSaved)

  const handleUpvote = () => {
    setLocalUpvoted(!localUpvoted)
    if (localDownvoted) setLocalDownvoted(false)
    onUpvote?.(id)
  }

  const handleDownvote = () => {
    setLocalDownvoted(!localDownvoted)
    if (localUpvoted) setLocalUpvoted(false)
    onDownvote?.(id)
  }

  const handleSave = () => {
    setLocalSaved(!localSaved)
    onSave?.(id)
  }

  const netVotes = upvotes - downvotes + (localUpvoted ? 1 : 0) - (localDownvoted ? 1 : 0)

  return (
    <TouchableOpacity style={styles.postCard} onPress={() => navigation.navigate('ForumDetail')} activeOpacity={0.9}>
      {/* Header */}
      <View style={styles.postHeader}>
        <TouchableOpacity 
          style={styles.authorContainer}
          onPress={() => onAuthorPress?.(author)}
        >
          {authorAvatar ? (
            <Image source={{ uri: authorAvatar }} style={styles.authorAvatar} />
          ) : (
            <View style={styles.defaultAvatar}>
              <Icon name="person" size={16} color={Colors.neutral600} />
            </View>
          )}
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{author}</Text>
            <Text style={styles.timeAgo}>{timeAgo}</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleSave}>
          <Icon 
            name={localSaved ? "bookmark" : "bookmark-outline"} 
            size={20} 
            color={localSaved ? Colors.primary : Colors.neutral400} 
          />
        </TouchableOpacity>
      </View>

      {/* Tags */}
      {tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Content */}
      <Text style={styles.postTitle}>{title}</Text>
      <Text style={styles.postContent} numberOfLines={3}>
        {content}
      </Text>

      {/* Images */}
      {images.length > 0 && (
        <View style={styles.imagesContainer}>
          {images.slice(0, 3).map((image, index) => (
            <View key={index} style={styles.imageWrapper}>
              <AutoSizeImage uri={image} width={Dimensions.get('window').width - 55} />
              {index === 2 && images.length > 3 && (
                <View style={styles.moreImagesOverlay}>
                  <Text style={styles.moreImagesText}>+{images.length - 3}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <View style={styles.leftActions}>
          {/* Voting */}
          <View style={styles.votingContainer}>
            <TouchableOpacity 
              style={[styles.voteButton, localUpvoted && styles.upvotedButton]}
              onPress={handleUpvote}
            >
              <Icon 
                name="arrow-up" 
                size={20} 
                color={localUpvoted ? Colors.success : Colors.neutral500} 
              />
            </TouchableOpacity>
            
            <Text style={[
              styles.voteCount,
              netVotes > 0 && styles.positiveVotes,
              netVotes < 0 && styles.negativeVotes
            ]}>
              {netVotes > 0 ? `+${netVotes}` : netVotes}
            </Text>
            
            <TouchableOpacity 
              style={[styles.voteButton, localDownvoted && styles.downvotedButton]}
              onPress={handleDownvote}
            >
              <Icon 
                name="arrow-down" 
                size={20} 
                color={localDownvoted ? Colors.warning : Colors.neutral500} 
              />
            </TouchableOpacity>
          </View>

          {/* Comments */}
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onComment?.(id)}
          >
            <Icon name="chatbubble-outline" size={20} color={Colors.neutral500} />
            <Text style={styles.actionText}>{commentCount}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rightActions}>
          {/* Share */}
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onShare?.(id)}
          >
            <Icon name="share-outline" size={20} color={Colors.neutral500} />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  postCard: {
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.neutral900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '95%'
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  defaultAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.neutral100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral900,
  },
  timeAgo: {
    fontSize: 12,
    color: Colors.neutral500,
    marginTop: 2,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.neutral900,
    marginBottom: 8,
    lineHeight: 22,
  },
  postContent: {
    fontSize: 14,
    color: Colors.neutral700,
    lineHeight: 20,
    marginBottom: 12,
  },
  imagesContainer: {
    flexDirection: 'column',
    marginBottom: 12,
    gap: 8,
  },
  imageWrapper: {
    flex: 1,
    position: 'relative',
    flexDirection: 'column',
  },
  postImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
    backgroundColor: Colors.neutral100,
  },
  moreImagesOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImagesText: {
    color: Colors.neutral0,
    fontSize: 14,
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  votingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  voteButton: {
    padding: 4,
    borderRadius: 6,
  },
  upvotedButton: {
    backgroundColor: Colors.success + '15',
  },
  downvotedButton: {
    backgroundColor: Colors.warning + '15',
  },
  voteCount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral700,
    marginHorizontal: 8,
    minWidth: 30,
    textAlign: 'center',
  },
  positiveVotes: {
    color: Colors.success,
  },
  negativeVotes: {
    color: Colors.warning,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 6,
  },
  actionText: {
    fontSize: 16,
    color: Colors.neutral600,
    marginLeft: 4,
    fontWeight: '500',
  },
})

export default PostCard