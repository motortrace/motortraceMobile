import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native"
import Colors from "../constants/colors"
import ProfileAvatar from "../components/ProfileAvatar"
import MessageBubble from "../components/MessageBubble"
import TypingIndicator from "../components/TypingIndicator"
import Icon from 'react-native-vector-icons/Ionicons';

interface Message {
  id: string
  text: string
  timestamp: string
  isOwn: boolean
  status?: "sent" | "delivered" | "read"
}

interface ChatScreenProps {
  contactName?: string
  contactStatus?: string
  onBack?: () => void
  onCall?: () => void
  onVideoCall?: () => void
}

const ChatScreen: React.FC<ChatScreenProps> = ({
  contactName = "Turbo Tune-up",
  contactStatus = "Online",
  onBack,
  onCall,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "I will check-in this evening at 7:30 pm. Is it ok for you?",
      timestamp: "08:22am",
      isOwn: false,
    },
    {
      id: "2",
      text: "Sure! That works perfectly for me.",
      timestamp: "08:25am",
      isOwn: true,
      status: "read",
    },
    {
      id: "3",
      text: "Great! I'll bring all the necessary tools for the tune-up.",
      timestamp: "08:26am",
      isOwn: false,
    },
    {
      id: "4",
      text: "Perfect. Should I move the car to the driveway?",
      timestamp: "08:27am",
      isOwn: true,
      status: "read",
    },
    {
      id: "5",
      text: "Yes, that would be helpful. See you at 7:30!",
      timestamp: "08:28am",
      isOwn: false,
    },
    {
      id: "6",
      text: "Looking forward to it. Thanks!",
      timestamp: "08:29am",
      isOwn: true,
      status: "read",
    },
  ])

  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    // Simulate typing indicator
    const timer = setTimeout(() => {
      setIsTyping(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isOwn: true,
        status: "sent",
      }

      setMessages((prev) => [...prev, newMessage])
      setInputText("")

      // Auto scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 100)
    }
  }

  const handleVoicePress = () => {
    setIsRecording(!isRecording)
    // Handle voice recording logic here
  }

  const handleCameraPress = () => {
    // Handle camera logic here
    console.log("Camera pressed")
  }

  const handleEmojiPress = () => {
    // Handle emoji picker logic here
    console.log("Emoji pressed")
  }

  const handleAttachPress = () => {
    // Handle attachment logic here
    console.log("Attach pressed")
  }

  return (
    <SafeAreaView style={styles.container}>
        {/* Header - WhatsApp Style */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Icon name="chevron-back" size={28} color={Colors.neutral0} />
            </TouchableOpacity>
            <ProfileAvatar isOnline={true} />
            <View style={styles.headerInfo}>
              <Text style={styles.contactName}>{contactName}</Text>
              <Text style={styles.contactStatus}>{contactStatus}</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity onPress={onCall} style={styles.headerActionButton}>
              <Icon name="call" size={22} color={Colors.neutral0} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerActionButton}>
              <Icon name="refresh" size={30}  color={Colors.neutral0} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages - WhatsApp Background */}
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

          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Input Area - WhatsApp Style */}
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

          {/* Always show send button */}
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Icon name="send" size={20} color={Colors.neutral0} />
          </TouchableOpacity>
          </View>
        </View>
    </SafeAreaView>
  )
}

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
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "600",
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
    flexDirection: "row",
    alignItems: "flex-end",
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
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
    justifyContent: "center",
    alignItems: "center",
    
    shadowColor: Colors.neutral900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  voiceButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    
    shadowColor: Colors.neutral900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  voiceButtonActive: {
    backgroundColor: Colors.primary,
    transform: [{ scale: 1.1 }],
  },
})

export default ChatScreen