import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfileRequestCard } from '@/components/profile-request-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getUsername } from '@/constants/auth';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type User = {
  username: string;
  first_name: string;
  last_name: string;
};

type MeetRequest = {
  sender: string;
  receiver: string;
  Time_Of_Send: string;
  Status: string;
};

const navigationItems = [
  { label: 'Chats', icon: { ios: 'bubble.left.and.bubble.right', android: 'chat', web: 'chat' } },
  { label: 'Leaderboard', icon: { ios: 'trophy', android: 'emoji_events', web: 'emoji_events' } },
  { label: 'Settings', icon: { ios: 'gearshape', android: 'settings', web: 'settings' } },
] as const;

  async function createUserConnection(usernameOne: string, usernameTwo: string) {
    const response = await fetch('http://localhost:3000/user_connection/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usernameOne,
        usernameTwo
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return await response.json();
  }

  async function sendMeetRequest(sender: string, receiver: string) {
    const response = await fetch('http://localhost:3000/send_meet_request', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender,
        receiver,
        timeOfSend: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return await response.json();
  }
  
export default function DashboardScreen() {
  const theme = useTheme();
  const router = useRouter();

  const username = getUsername();
  
  const [users, setUsers] = useState<User[]>([]);
  const [meetRequests, setMeetRequests] = useState<MeetRequest[]>([]);
  const meetRequestCount = meetRequests.length;

  const [showNotifications, setShowNotifications] = useState(false);

  const [requestedUsers, setRequestedUsers] = useState<Set<string>>(new Set());
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('http://localhost:3000/get_users');

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    }

  async function fetchMeetRequests() {
    try {
      const response = await fetch(
        `http://localhost:3000/meet_requests?username=${encodeURIComponent(username)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      setMeetRequests(data);
    } catch (error) {
      console.error('Failed to fetch meet requests:', error);
    }
  }

    fetchUsers();
    fetchMeetRequests();
  }, []);

  useEffect(() => {
    async function fetchRequestStatuses() {
      try {
        const statuses = await Promise.all(
          users.map(async (user) => {
            const response = await fetch(
              `http://localhost:3000/has_accepted_meet_request?sender=${encodeURIComponent(username)}&receiver=${encodeURIComponent(user.username)}`
            );

            if (!response.ok) {
              throw new Error(`HTTP error: ${response.status}`);
            }

            const data = await response.json();

            return {
              username: user.username,
              requested: data.hasAcceptedRequest,
            };
          })
        );

        const requested = new Set(
          statuses
            .filter((status) => status.requested)
            .map((status) => status.username)
        );

        setRequestedUsers(requested);
      } catch (error) {
        console.error('Failed to fetch request statuses:', error);
      }
    }

    if (users.length > 0) {
      // Fetch immediately
      fetchRequestStatuses();

      // Then fetch every 5 seconds
      const interval = setInterval(fetchRequestStatuses, 5000);

      // Clean up when component unmounts or dependencies change
      return () => clearInterval(interval);
    }
  }, [users, username]);

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>

        <ThemedView style={styles.header}>
          <ThemedText type="subtitle">Collaborate</ThemedText>

          <Pressable
            accessibilityLabel="Notifications"
            onPress={() => setShowNotifications(!showNotifications)}
            style={({ pressed }) => [
              styles.notificationButton,
              pressed && styles.pressed,
            ]}
          >
            <SymbolView
              name={{
                ios: 'bell',
                android: 'notifications',
                web: 'notifications',
              }}
              size={24}
              tintColor={theme.text}
            />

            {meetRequestCount > 0 && (
              <View style={styles.badge}>
                <ThemedText style={styles.badgeText}>
                  {meetRequestCount > 99 ? '99+' : meetRequestCount}
                </ThemedText>
              </View>
            )}
          </Pressable>
        </ThemedView>

        {showNotifications ? (
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <ThemedText type="subtitle">Meeting Requests</ThemedText>

            {meetRequests.length === 0 ? (
              <ThemedText themeColor="textSecondary">
                You have no meeting requests.
              </ThemedText>
            ) : (
              meetRequests.map((request, index) => (
                <ThemedView
                  key={`${request.sender}-${request.Time_Of_Send}-${index}`}
                  type="backgroundElement"
                  style={styles.requestCard}
                >
                  <View style={styles.requestDetails}>
                    <ThemedText type="smallBold">
                      @{request.sender}
                    </ThemedText>

                    <ThemedText themeColor="textSecondary" type="small">
                      Sent {new Date(request.Time_Of_Send).toLocaleString()}
                    </ThemedText>
                  </View>

                  <View style={styles.requestActions}>
                    <Pressable
                      style={styles.acceptButton}
                      onPress={async () => {
                        try {
                          await createUserConnection(username, request.sender);

                          
                        } catch (error) {
                          console.error(
                            'Failed to create user connection:',
                            error
                          );
                        }
                      }}
                    >
                      <ThemedText style={styles.actionText}>
                        Accept
                      </ThemedText>
                    </Pressable>

                    <Pressable
                      style={styles.declineButton}
                      onPress={() => {
                        console.log(`Decline request from ${request.sender}`);
                      }}
                    >
                      <ThemedText style={styles.actionText}>
                        Decline
                      </ThemedText>
                    </Pressable>
                  </View>
                </ThemedView>
              ))
            )}
          </ScrollView>
        ) : (
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <ThemedText type="subtitle">People to meet</ThemedText>

            {users.map((user) => (
              <ProfileRequestCard
                key={user.username}
                username={user.username}
                firstName={user.first_name}
                lastName={user.last_name}
                profilePicture={require('../../assets/images/icon.png')}
                requested={requestedUsers.has(user.username)}
                onRequestToMeet={async () => {
                  try {
                    await sendMeetRequest(username, user.username);
                    console.log(`Meeting request sent to ${user.username}`);
                  } catch (error) {
                    console.error('Failed to send meet request:', error);
                  }
                }}
              />
            ))}
          </ScrollView>
        )}

        <ThemedView type="backgroundElement" style={styles.navigation}>
          {navigationItems.map((item) => (
            <Pressable
              key={item.label}
              accessibilityLabel={item.label}
              onPress={() => {
                if (item.label === 'Chats') {
                  router.push('/chats');
                }
              }}
              style={({ pressed }) => [
                styles.navItem,
                pressed && styles.pressed,
              ]}
            >
              <SymbolView
                name={item.icon}
                size={22}
                tintColor={theme.textSecondary}
              />

              <ThemedText type="small" themeColor="textSecondary">
                {item.label}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>

      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  requestCard: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.three,
  },

  requestDetails: {
    gap: Spacing.half,
  },

  requestActions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },

  acceptButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#208AEF',
    borderRadius: Spacing.two,
    paddingVertical: Spacing.two,
  },

  declineButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#888888',
    borderRadius: Spacing.two,
    paddingVertical: Spacing.two,
  },

  actionText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  
  screen: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },

  notificationButton: {
    padding: Spacing.two,
    position: 'relative',
  },

  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },

  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },

  content: {
    flexGrow: 1,
    gap: Spacing.two,
    padding: Spacing.four,
  },

  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.two,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
  },

  navItem: {
    alignItems: 'center',
    gap: Spacing.half,
    minWidth: 80,
    paddingVertical: Spacing.one,
  },

  pressed: {
    opacity: 0.7,
  },
});
