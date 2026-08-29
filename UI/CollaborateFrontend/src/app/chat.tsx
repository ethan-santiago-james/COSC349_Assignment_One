
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getUsername } from '@/constants/auth';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useRouter } from 'expo-router';


type Message = {
  id: number;
  content: string;
  from_user: string;
  to_user: string;
  time_of_send: string;
};

export default function ChatScreen() {

  const { usernameOne, usernameTwo } = useLocalSearchParams<{
    usernameOne: string;
    usernameTwo: string;
  }>();
  
  const theme = useTheme();
  const router = useRouter();

  const [message, setMessage] = useState('');

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const chatUsername = usernameTwo;

  useEffect(() => {
    async function fetchChats() {
      try {
        const currentUsername = getUsername();

        const response = await fetch(
          `http://192.168.56.11:3000/chats?usernameOne=${encodeURIComponent(
            currentUsername
          )}&usernameTwo=${encodeURIComponent(chatUsername)}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        setMessages(
          data.map((message: Omit<Message, 'id'>, index: number) => ({
            ...message,
            id: index + 1,
          }))
        );
      } catch (error) {
        console.error('Failed to fetch chats:', error);
      } finally {
        setLoading(false);
      }
    }

    // Fetch immediately when screen loads
    fetchChats();

    // Then refresh every 3 seconds
    const interval = setInterval(fetchChats, 3000);

    // Stop refreshing when leaving the screen
    return () => clearInterval(interval);

  }, [chatUsername]);

async function sendMessage() {
  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    return;
  }

  const sender = getUsername();

  async function redirectToDashboard() {

    router.push("/dashboard")

  }

  try {
    const response = await fetch('http://192.168.56.11:3000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: sender,
        recipient: chatUsername,
        content: trimmedMessage,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error ${response.status}: ${errorText}`
      );
    }

    const postedChat = await response.json();

    // Add the message returned by the backend to the chat
    setMessages((previousMessages) => [
      ...previousMessages,
      postedChat,
    ]);

    setMessages((previousMessages) => {

      return previousMessages.map((message: Omit<Message, 'id'>, index: number) => ({
                ...message,
                id: index + 1,
              }))
    });

    setMessage('');

  } catch (error) {
    console.error('Failed to send message:', error);
  }
}

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>

            <Pressable
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.pressed,
              ]}
              onPress={() => router.back()}
            >
              <ThemedText style={styles.backButtonText}>
                ‹
              </ThemedText>
            </Pressable>
            <View style={styles.avatar}>
              <ThemedText style={styles.avatarText}>
                {chatUsername.slice(0, 2).toUpperCase()}
              </ThemedText>
            </View>

            <View>
              <ThemedText style={styles.username}>
                @{chatUsername}
              </ThemedText>

              <ThemedText
                themeColor="textSecondary"
                style={styles.status}
              >
                Online
              </ThemedText>
            </View>
          </View>

          <View style={styles.actions}>
            {/* Video call */}
            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                pressed && styles.pressed,
              ]}
              onPress={() => console.log('Video call')}
            >
              <ThemedText style={styles.actionIcon}>
                ▣
              </ThemedText>
            </Pressable>

            {/* Phone call */}
            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                pressed && styles.pressed,
              ]}
              onPress={() => console.log('Phone call')}
            >
              <ThemedText style={styles.actionIcon}>
                ☎
              </ThemedText>
            </Pressable>

            {/* Verify meet in person */}
            <Pressable
              style={({ pressed }) => [
                styles.verifyButton,
                pressed && styles.pressed,
              ]}
              onPress={() => console.log('Verify meet in person')}
            >
              <ThemedText style={styles.verifyIcon}>
                ✓
              </ThemedText>
            </Pressable>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
    <ThemedText
        themeColor="textSecondary"
        style={styles.loadingText}
    >
        Loading messages...
    </ThemedText>
) : messages.length === 0 ? (
    <ThemedText
        themeColor="textSecondary"
        style={styles.emptyText}
    >
        No messages yet. Start the conversation!
    </ThemedText>
) : (
        messages.map((item) => {
            const sentByMe = item.from_user === getUsername();

            return (
                <View
                    key={item.id}
                    style={[
                        styles.messageRow,
                        sentByMe
                            ? styles.myMessageRow
                            : styles.theirMessageRow,
                    ]}
                >
                    <View
                        style={[
                            styles.bubble,
                            sentByMe
                                ? styles.myBubble
                                : [
                                    styles.theirBubble,
                                    {
                                        backgroundColor: theme.background,
                                    },
                                ],
                        ]}
                    >
                        <ThemedText
                            style={[
                                styles.messageText,
                                sentByMe && styles.myMessageText,
                            ]}
                        >
                            {item.content}
                        </ThemedText>
                    </View>
                </View>
            );
        })
    )}
        </ScrollView>

        {/* Message input */}
        <View style={styles.inputContainer}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Message..."
            placeholderTextColor="#888"
            style={[
              styles.input,
              {
                backgroundColor: theme.background,
                color: theme.text,
              },
            ]}
            multiline
            maxLength={1000}
          />

          <Pressable
            onPress={sendMessage}
            disabled={!message.trim()}
            style={({ pressed }) => [
              styles.sendButton,
              !message.trim() && styles.sendButtonDisabled,
              pressed && styles.pressed,
            ]}
          >
            <ThemedText style={styles.sendText}>
              ↑
            </ThemedText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  keyboardView: {
    flex: 1,
  },

  /* Header */
  loadingText: {
      textAlign: 'center',
      marginTop: Spacing.four,
  },

  emptyText: {
      textAlign: 'center',
      marginTop: Spacing.four,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.two,
  },

  avatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },

  username: {
    fontSize: 16,
    fontWeight: '600',
  },

  status: {
    fontSize: 12,
    marginTop: 2,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },

  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionIcon: {
    fontSize: 22,
  },

  verifyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  verifyIcon: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
  },

  /* Messages */

  messagesContainer: {
    flex: 1,
  },

  messagesContent: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    gap: Spacing.one,
  },

  messageRow: {
    width: '100%',
    flexDirection: 'row',
  },

  myMessageRow: {
    justifyContent: 'flex-end',
  },

  theirMessageRow: {
    justifyContent: 'flex-start',
  },

  bubble: {
    maxWidth: '75%',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 18,
  },

  myBubble: {
    backgroundColor: '#208AEF',
    borderBottomRightRadius: 5,
  },

  theirBubble: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderBottomLeftRadius: 5,
  },

  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },

  myMessageText: {
    color: '#ffffff',
  },

  /* Input */

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderTopWidth: 1,
    borderTopColor: '#dddddd',
    gap: Spacing.two,
  },

  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderRadius: 22,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#dddddd',
  },

  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sendButtonDisabled: {
    opacity: 0.4,
  },

  sendText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
  },

  pressed: {
    opacity: 0.6,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.two,
  },

  backButtonText: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '300',
  }
});