
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getUsername } from '@/constants/auth';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Connection = {
  username: string;
};

type ChatListProps = {
  username: string;
  onSelectChat: (username: string) => void;
};

export default function ChatsScreen() {
  const { username: usernameParam } =
    useLocalSearchParams<{ username?: string }>();

  const username = usernameParam ?? getUsername();

  function onSelectChat(usernameTwo: string) {
    router.push({
      pathname: '/chat',
      params: {
        usernameOne: username,
        usernameTwo: usernameTwo,
      },
    });
  }

  return (
    <ChatList
      username={username}
      onSelectChat={onSelectChat}
    />
  );
}

export function ChatList({
  username,
  onSelectChat,
}: ChatListProps) {
  const theme = useTheme();

  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConnections() {
      try {
        const response = await fetch(
          `http://localhost:3000/user_connections?username=${encodeURIComponent(
            username
          )}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        setConnections(data);
      } catch (error) {
        console.error('Failed to fetch connections:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchConnections();
  }, [username]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
      <Pressable
        style={({ pressed }) => [
          styles.backButton,
          pressed && styles.pressed,
        ]}
        onPress={() => router.push('/dashboard')}
      >
        <ThemedText style={styles.backButtonText}>
          ←
        </ThemedText>
      </Pressable>

      <ThemedText type="title" style={styles.title}>
        Chats
      </ThemedText>
    </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {loading ? (
          <ThemedText
            themeColor="textSecondary"
            style={styles.centerText}
          >
            Loading...
          </ThemedText>
        ) : connections.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <ThemedText style={styles.emptyIconText}>
                💬
              </ThemedText>
            </View>

            <ThemedText type="subtitle" style={styles.emptyTitle}>
              No chats yet
            </ThemedText>

            <ThemedText
              themeColor="textSecondary"
              style={styles.emptyText}
            >
              Connect with someone to start a conversation.
            </ThemedText>
          </View>
        ) : (
          connections.map((connection) => {
            const initials = connection.username
              .slice(0, 2)
              .toUpperCase();

            return (
              <Pressable
                key={connection.username}
                onPress={() => onSelectChat(connection.username)}
                style={({ pressed }) => [
                  styles.chatItem,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.avatar}>
                  <ThemedText style={styles.avatarText}>
                    {initials}
                  </ThemedText>
                </View>

                <View style={styles.details}>
                  <ThemedText
                    style={styles.name}
                    numberOfLines={1}
                  >
                    @{connection.username}
                  </ThemedText>

                  <ThemedText
                    themeColor="textSecondary"
                    style={styles.username}
                    numberOfLines={1}
                  >
                    Tap to open chat
                  </ThemedText>
                </View>

                <ThemedText
                  themeColor="textSecondary"
                  style={styles.chevron}
                >
                  ›
                </ThemedText>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
  },

  list: {
    paddingBottom: Spacing.four,
  },

  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    marginBottom: Spacing.one,
    borderRadius: 14,
  },

  header: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: Spacing.four,
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
  fontSize: 26,
  fontWeight: '400',
},

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.three,
  },

  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },

  details: {
    flex: 1,
    justifyContent: 'center',
  },

  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 3,
  },

  username: {
    fontSize: 14,
  },

  chevron: {
    fontSize: 28,
    marginLeft: Spacing.two,
    opacity: 0.5,
  },

  pressed: {
    opacity: 0.65,
    transform: [{ scale: 0.99 }],
  },

  centerText: {
    textAlign: 'center',
    marginTop: Spacing.four,
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: Spacing.four,
  },

  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.three,
  },

  emptyIconText: {
    fontSize: 32,
  },

  emptyTitle: {
    marginBottom: Spacing.one,
  },

  emptyText: {
    textAlign: 'center',
    lineHeight: 20,
  },
});