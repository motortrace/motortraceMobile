// components/CommentItem.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';

const CommentCard = ({ comment, isReply = false }) => {
  return (
    <View style={[styles.commentContainer, isReply && styles.replyContainer]}>
      {comment.authorAvatar ? (
        <Image source={{ uri: comment.authorAvatar }} style={styles.commentAvatar} />
      ) : (
        <View style={styles.defaultAvatar}>
          <Icon name="person" size={16} color={Colors.neutral600} />
        </View>
      )}
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentAuthor}>{comment.author}</Text>
          <Text style={styles.commentTime}>{comment.timeAgo}</Text>
        </View>
        <Text style={styles.commentText}>{comment.content}</Text>

        <View style={styles.commentActions}>
          <TouchableOpacity style={styles.commentAction}>
            <Icon name="arrow-up" size={16} color={Colors.neutral400} />
            <Text style={styles.commentActionText}>{comment.upvotes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.commentAction}>
            <Icon name="arrow-down" size={16} color={Colors.neutral400} />
            <Text style={styles.commentActionText}>{comment.downvotes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.commentAction}>
            <Icon name="chatbubble-outline" size={16} color={Colors.neutral400} />
            <Text style={styles.commentActionText}>Reply</Text>
          </TouchableOpacity>
        </View>

        {/* Recursive rendering of replies */}
        {comment.replies?.map(reply => (
          <CommentCard key={reply.id} comment={reply} isReply={true} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  defaultAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.neutral100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
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
});

export default CommentCard;
