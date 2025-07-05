import React, { useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import Colors from '../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header'
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  isSupport?: boolean;
  quickReplies?: string[];
}

const SupportChat = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm here to help you with any questions or issues you might have. How can I assist you today?",
      timestamp: "Just now",
      isOwn: false,
      isSupport: true,
      quickReplies: [
        "Account Issues",
        "Technical Problems", 
        "Billing Questions",
        "General Inquiry"
      ]
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  const quickReplies = [
    "Account Issues",
    "Technical Problems", 
    "Billing Questions",
    "General Inquiry"
  ];

  const sendMessage = (text?: string) => {
    const messageText = text || inputText.trim();
    if (messageText) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: messageText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isOwn: true,
      };

      setMessages((prev) => [...prev, newMessage]);
      setInputText("");
      setShowQuickReplies(false);

      // Simulate support response
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          const supportResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: getSupportResponse(messageText),
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isOwn: false,
            isSupport: true,
          };
          setMessages((prev) => [...prev, supportResponse]);
          setIsTyping(false);
        }, 2000);
      }, 500);

      // Auto scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const getSupportResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase();
    if (message.includes('account') || message.includes('login') || message.includes('password')) {
      return "I can help you with account-related issues. Are you having trouble logging in, or do you need to reset your password?";
    } else if (message.includes('technical') || message.includes('bug') || message.includes('error')) {
      return "I understand you're experiencing technical difficulties. Can you please describe the specific issue you're encountering?";
    } else if (message.includes('billing') || message.includes('payment') || message.includes('subscription')) {
      return "I can assist you with billing and payment questions. What specific billing issue can I help you with?";
    } else {
      return "Thank you for your message. I'm here to help! Could you please provide more details about your inquiry so I can assist you better?";
    }
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  const handleEscalate = () => {
    Alert.alert(
      "Escalate to Human Agent",
      "Would you like me to connect you with a human support agent?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes, Connect Me", onPress: () => {
          const escalateMessage: Message = {
            id: Date.now().toString(),
            text: "I'd like to speak with a human agent please.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isOwn: true,
          };
          setMessages((prev) => [...prev, escalateMessage]);
          
          setTimeout(() => {
            const agentMessage: Message = {
              id: (Date.now() + 1).toString(),
              text: "I'm connecting you with one of our human support agents. Please hold on for a moment...",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              isOwn: false,
              isSupport: true,
            };
            setMessages((prev) => [...prev, agentMessage]);
          }, 1000);
        }},
      ]
    );
  };

  const SupportAvatar = () => (
    <View style={styles.supportAvatar}>
      <Icon name="headset" size={20} color={Colors.neutral0} />
    </View>
  );

  const MessageBubble = ({ message }: { message: Message }) => (
    <View style={[styles.messageContainer, message.isOwn ? styles.ownMessage : styles.otherMessage]}>
      {!message.isOwn && <SupportAvatar />}
      <View style={[styles.bubble, message.isOwn ? styles.ownBubble : styles.otherBubble]}>
        <Text style={[styles.messageText, message.isOwn ? styles.ownText : styles.otherText]}>
          {message.text}
        </Text>
        <Text style={[styles.timestamp, message.isOwn ? styles.ownTimestamp : styles.otherTimestamp]}>
          {message.timestamp}
        </Text>
      </View>
    </View>
  );

  const QuickReplyButton = ({ text, onPress }: { text: string; onPress: () => void }) => (
    <TouchableOpacity style={styles.quickReplyButton} onPress={onPress}>
      <Text style={styles.quickReplyText}>{text}</Text>
    </TouchableOpacity>
  );

  const TypingIndicator = () => (
    <View style={styles.typingContainer}>
      <SupportAvatar />
      <View style={styles.typingBubble}>
        <View style={styles.typingDots}>
          <View style={[styles.typingDot, styles.typingDot1]} />
          <View style={[styles.typingDot, styles.typingDot2]} />
          <View style={[styles.typingDot, styles.typingDot3]} />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header 
         name="Jhon Doe"
         icon='back'
         onIconPress={()=>navigation.navigate('Help')}
      />

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef} 
        style={styles.messagesContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isTyping && <TypingIndicator />}

        {/* Quick Replies */}
        {showQuickReplies && (
          <View style={styles.quickRepliesContainer}>
            <Text style={styles.quickRepliesTitle}>Quick options:</Text>
            <View style={styles.quickRepliesGrid}>
              {quickReplies.map((reply, index) => (
                <QuickReplyButton 
                  key={index} 
                  text={reply} 
                  onPress={() => handleQuickReply(reply)} 
                />
              ))}
            </View>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message..."
              placeholderTextColor={Colors.neutral500}
              multiline
              maxLength={4096}
            />
          </View>

          <TouchableOpacity onPress={() => sendMessage()} style={styles.sendButton}>
            <Icon name="send" size={20} color={Colors.neutral0} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral100, // Different from service chat
  },
  supportAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  ownMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  ownBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: Colors.neutral0,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownText: {
    color: Colors.neutral0,
  },
  otherText: {
    color: Colors.neutral900,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 6,
  },
  ownTimestamp: {
    color: Colors.neutral200,
    textAlign: 'right',
  },
  otherTimestamp: {
    color: Colors.neutral500,
  },
  quickRepliesContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  quickRepliesTitle: {
    fontSize: 14,
    color: Colors.neutral600,
    marginBottom: 12,
    marginLeft: 8,
  },
  quickRepliesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickReplyButton: {
    backgroundColor: Colors.neutral0,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  quickReplyText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  typingBubble: {
    backgroundColor: Colors.neutral0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.neutral400,
    marginHorizontal: 2,
  },
  typingDot1: {
    animationDelay: '0s',
  },
  typingDot2: {
    animationDelay: '0.2s',
  },
  typingDot3: {
    animationDelay: '0.4s',
  },
  bottomSpacing: {
    height: 20,
  },
  inputContainer: {
    backgroundColor: Colors.neutral0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
    paddingBottom: Platform.OS === 'ios' ? 32 : 25,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: Colors.neutral100,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    minHeight: 48,
    maxHeight: 120,
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 16,
    color: Colors.neutral900,
    textAlignVertical: 'center',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SupportChat;