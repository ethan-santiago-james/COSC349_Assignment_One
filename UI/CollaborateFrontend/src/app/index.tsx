import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.content}>
          <ThemedText type="title" style={styles.title}>
            Welcome to Collaborate!
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            Connect, create, and work better together.
          </ThemedText>

          <ThemedView style={styles.actions}>
            <Pressable
              onPress={() => router.push('/sign-up')}
              style={({ pressed }) => [styles.signUpButton, pressed && styles.pressed]}>
              <ThemedText style={styles.signUpText}>Sign up</ThemedText>
            </Pressable>
            <Pressable
              onPress={() => router.push('/log-in')}
              style={({ pressed }) => [styles.logInButton, pressed && styles.pressed]}>
              <ThemedText style={styles.logInText}>Log in</ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  actions: {
    marginTop: Spacing.four,
    gap: Spacing.two,
  },
  signUpButton: {
    alignItems: 'center',
    backgroundColor: '#208AEF',
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
  },
  logInButton: {
    alignItems: 'center',
    borderColor: '#208AEF',
    borderRadius: Spacing.two,
    borderWidth: 1,
    paddingVertical: Spacing.three,
  },
  signUpText: {
    color: '#ffffff',
    fontWeight: 700,
  },
  logInText: {
    color: '#208AEF',
    fontWeight: 700,
  },
  pressed: {
    opacity: 0.75,
  },
});
