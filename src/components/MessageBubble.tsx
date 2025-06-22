import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProfileAvatar from './ProfileAvatar';
import Colors from '../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';

interface Message {
  text: string;
  timestamp: string;
  isOwn: boolean;
  status?: 'sent' | 'delivered' | 'read'; // optional
}

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  return (
    <View
      style={[
        styles.messageContainer,
        message.isOwn ? styles.ownMessageContainer : styles.otherMessageContainer,
      ]}
    >
      {!message.isOwn && <ProfileAvatar color={Colors.primary}  />}

      <View style={styles.messageContent}>
        <View
          style={[
            styles.messageBubble,
            message.isOwn ? styles.ownMessageBubble : styles.otherMessageBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              message.isOwn ? styles.ownMessageText : styles.otherMessageText,
            ]}
          >
            {message.text}
          </Text>
        </View>

        <View
          style={[
            styles.messageFooter,
            message.isOwn ? styles.ownMessageFooter : styles.otherMessageFooter,
          ]}
        >
          <Text style={styles.timestamp}>{message.timestamp}</Text>
          {message.isOwn && message.status && (
            <View style={styles.statusContainer}>
              <Icon name="checkmark-done" size={16} color={Colors.success} style={styles.statusIcon} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    alignItems: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 4,

    elevation: 6,
  },
  ownMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageContent: {
    maxWidth: '75%',
    marginHorizontal: 8,
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  ownMessageBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 6,
  },
  otherMessageBubble: {
    backgroundColor: Colors.neutral0,
    borderBottomLeftRadius: 6,
    shadowColor: Colors.shadowSm,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownMessageText: {
    color: Colors.neutral0,
  },
  otherMessageText: {
    color: Colors.neutral900,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ownMessageFooter: {
    justifyContent: 'flex-end',
  },
  otherMessageFooter: {
    justifyContent: 'flex-start',
  },
  timestamp: {
    fontSize: 12,
    color: Colors.neutral500,
  },
  statusContainer: {
    marginLeft: 6,
  },
  statusIcon: {
    fontSize: 16,
    color: Colors.success,
  },
});

export default MessageBubble;
