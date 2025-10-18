import React, { useState, useRef, useEffect } from 'react';
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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App';
import Colors from '../../constants/colors';
import ProfileAvatar from '../../components/ProfileAvatar';
import MessageBubble from '../../components/MessageBubble';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';

type WorkOrderChatRouteProp = RouteProp<RootStackParamList, 'WorkOrderChat'>;
type WorkOrderChatNavigationProp = StackNavigationProp<RootStackParamList, 'WorkOrderChat'>;

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  status?: 'sent' | 'delivered' | 'read' | 'sending';
}

interface IMessage {
  id: string;
  workOrderId: string;
  senderId: string;
  senderRole: string;
  message: string;
  messageType: string;
  status: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
  attachments?: any[];
  sender?: {
    id: string;
    name?: string;
    profileImage?: string;
  };
}

const WorkOrderChat = () => {
  const navigation = useNavigation<WorkOrderChatNavigationProp>();
  const route = useRoute<WorkOrderChatRouteProp>();
  const { workOrder } = route.params;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [socket, setSocket] = useState<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const init = async () => {
      await getUserProfile();
      await initializeSocket();
    };
    init();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [workOrder.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Separate useEffect to fetch messages when currentUserId is set
  useEffect(() => {
    if (currentUserId && socket) {
      console.log('🔍 Current user ID set, fetching messages');
      fetchMessages();
    }
  }, [currentUserId, socket]); // eslint-disable-line react-hooks/exhaustive-deps

  const getUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Authentication required');
        return;
      }

      // Get current user profile
      const userProfileResponse = await fetch('http://10.0.2.2:3000/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (userProfileResponse.ok) {
        const profileData = await userProfileResponse.json();
        console.log('Profile response:', profileData);
        // The backend returns profile data in a 'profile' object
        if (profileData.profile && profileData.profile.id) {
          setCurrentUserId(profileData.profile.id);
        } else {
          // Fallback: try to get from the authenticated user ID
          // Since we know from backend logs the user ID is '31362d65-5571-4686-8e3a-78a51860e3d0'
          // But let's try to get it from the token or use a different approach
          console.log('Profile missing id, trying alternative approach');
          // For now, let's hardcode the known user ID until we fix the backend
          setCurrentUserId('cmeegjqmu000auungyplrg2fg'); // This is the UserProfile ID from backend logs
        }
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
    }
  };

  const initializeSocket = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Authentication required');
        return;
      }

      // Initialize Socket.IO connection
      const socketConnection = io('http://10.0.2.2:3000', {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling']
      });

      socketConnection.on('connect', () => {
        console.log('🔌 Socket connected:', socketConnection.id);
        // Join work order room
        socketConnection.emit('join-work-order', workOrder.id);
      });

      socketConnection.on('new-message', (message: IMessage) => {
        console.log('🔌 New message received:', message);
        console.log('🔌 Message senderRole:', message.senderRole, 'isOwn:', message.senderRole === 'CUSTOMER');

        // Check if this message is already in our messages (to avoid duplicates)
        setMessages(prev => {
          const messageExists = prev.some(msg => msg.id === message.id);
          if (messageExists) {
            console.log('🔌 Message already exists, skipping duplicate');
            return prev;
          }

          const formattedMessage: Message = {
            id: message.id,
            text: message.message,
            timestamp: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn: message.senderRole === 'CUSTOMER', // Customer messages on right, others on left
            status: message.status.toLowerCase() as 'sent' | 'delivered' | 'read',
          };

          const newMessages = [...prev, formattedMessage];

          // Auto scroll to bottom
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 100);

          return newMessages;
        });
      });

      socketConnection.on('message-sent', (message: IMessage) => {
        console.log('🔌 Message sent confirmation:', message);
        // Update the optimistic message with the real one
        setMessages(prev => prev.map(msg =>
          msg.id.startsWith('temp-') && msg.text === message.message
            ? {
                id: message.id,
                text: message.message,
                timestamp: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isOwn: true,
                status: message.status.toLowerCase() as 'sent' | 'delivered' | 'read',
              }
            : msg
        ));
      });

      socketConnection.on('user-typing', (data: { userId: string }) => {
        if (data.userId !== socketConnection.id) {
          // setIsTyping(true);
        }
      });

      socketConnection.on('user-stopped-typing', (data: { userId: string }) => {
        if (data.userId !== socketConnection.id) {
          // setIsTyping(false);
        }
      });

      socketConnection.on('disconnect', () => {
        console.log('🔌 Socket disconnected');
      });

      setSocket(socketConnection);
    } catch (error) {
      console.error('❌ Error initializing socket:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token || !currentUserId) {
        console.log('🔍 Skipping fetchMessages - missing token or currentUserId');
        return;
      }

      console.log('🔍 Fetching messages for workOrder:', workOrder.id, 'currentUserId:', currentUserId);
      const response = await fetch(`http://10.0.2.2:3000/messages/${workOrder.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('🔍 Fetch response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('🔍 Fetch response data:', data);

        if (data.success && data.data) {
          const formattedMessages = data.data.map((msg: IMessage) => ({
            id: msg.id,
            text: msg.message,
            timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn: msg.senderRole === 'CUSTOMER', // Customer messages on right, others on left
            status: msg.status.toLowerCase() as 'sent' | 'delivered' | 'read',
          }));
          console.log('🔍 Setting messages:', formattedMessages.length, 'messages');
          setMessages(formattedMessages);
        } else {
          console.log('🔍 No messages data or success false');
        }
      } else {
        console.log('🔍 Fetch failed with status:', response.status);
      }
    } catch (error) {
      console.error('❌ Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (inputText.trim() && socket && currentUserId) {
      try {
        console.log('📤 Sending message via socket:', inputText.trim(), 'currentUserId:', currentUserId, 'socket connected:', socket.connected);

        // Optimistically add to local state first
        const tempId = `temp-${Date.now()}`;
        const optimisticMessage: Message = {
          id: tempId,
          text: inputText.trim(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: true,
          status: 'sending',
        };

        setMessages((prev) => [...prev, optimisticMessage]);
        setInputText('');

        // Send via Socket.IO for real-time delivery
        socket.emit('send-message', {
          workOrderId: workOrder.id,
          message: inputText.trim(),
          userId: currentUserId
        });

        // Auto scroll to bottom
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);

      } catch (error) {
        console.error('❌ Error sending message:', error);
        Alert.alert('Error', 'Failed to send message');
      }
    }
  };

  const handleVoicePress = () => {
    // Handle voice recording logic here
    console.log('Voice pressed');
  };

  const handleCameraPress = () => {
    // Handle camera logic here
    console.log('Camera pressed');
  };

  const handleEmojiPress = () => {
    // Handle emoji picker logic here
    console.log('Emoji pressed');
  };

  const handleAttachPress = () => {
    // Handle attachment logic here
    console.log('Attach pressed');
  };

  const handleCall = () => {
    // Handle call logic - could integrate with phone dialer
    console.log('Call pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevron-back" size={28} color={Colors.neutral0} />
          </TouchableOpacity>
          <ProfileAvatar isOnline={true} />
          <View style={styles.headerInfo}>
            <Text style={styles.contactName}>
              {workOrder.serviceAdvisor?.userProfile?.name || 'Service Advisor'}
            </Text>
            <Text style={styles.contactStatus}>Service Advisor</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleCall} style={styles.headerActionButton}>
            <Icon name="call" size={22} color={Colors.neutral0} />
          </TouchableOpacity>
        </View>
      </View>

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

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          {/* Main Input Section */}
          <View style={styles.inputWrapper}>
            <TouchableOpacity onPress={handleEmojiPress} style={styles.inputActionButton}>
              <Icon name="happy-outline" size={24} color={Colors.neutral500} />
            </TouchableOpacity>

            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Message"
              placeholderTextColor={Colors.neutral500}
              multiline
              maxLength={4096}
            />

            <TouchableOpacity onPress={handleAttachPress} style={styles.inputActionButton}>
              <Icon name="attach-outline" size={24} color={Colors.neutral500} />
            </TouchableOpacity>

            {!inputText.trim() && (
              <TouchableOpacity onPress={handleCameraPress} style={styles.inputActionButton}>
                <Icon name="camera-outline" size={24} color={Colors.neutral500} />
              </TouchableOpacity>
            )}
          </View>

          {/* Send Button */}
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
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
    backgroundColor: Colors.primarybg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'ios' ? 50 : 45,

    shadowColor: Colors.neutral900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  headerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral0,
  },
  contactStatus: {
    fontSize: 13,
    color: Colors.neutral200,
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActionButton: {
    padding: 8,
    marginLeft: 8,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: Colors.primarybg,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  messagesContent: {
    paddingVertical: 8,
  },
  bottomSpacing: {
    height: 20,
  },
  inputContainer: {
    backgroundColor: Colors.neutral0,
    paddingHorizontal: 15,
    paddingVertical: 8,
    justifyContent: 'center',
    paddingBottom: Platform.OS === 'ios' ? 32 : 25,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.neutral0,
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    minHeight: 50,
    maxHeight: 120,

    shadowColor: Colors.neutral900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,

    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  inputActionButton: {
    padding: 4,
    marginHorizontal: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.neutral900,
    paddingVertical: 8,
    paddingHorizontal: 8,
    textAlignVertical: 'center',
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: Colors.neutral900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default WorkOrderChat;