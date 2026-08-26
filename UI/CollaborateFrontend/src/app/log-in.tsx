import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { setLoggedIn, setUsername as setCurrentUsername } from '@/constants/auth';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function LogInScreen() {
  const theme = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogIn() {
    if (!username.trim() || !password) {
      setMessage('Enter your username and password to continue.');
      return;
    }

    setMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        mode: 'cors',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(`Login failed with status ${response.status}`);
      }

      setCurrentUsername(username.trim());
      setLoggedIn(true);
      router.replace({
        pathname: '/dashboard',
        params: { username: username.trim() },
      });
    } catch {
      setMessage('Unable to log in. Check your credentials and try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.content}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ThemedText type="linkPrimary">Back</ThemedText>
          </Pressable>

          <ThemedText type="subtitle">Log in</ThemedText>
          <ThemedText themeColor="textSecondary">Welcome back to Collaborate.</ThemedText>

          <ThemedView style={styles.form}>
            <ThemedView style={styles.field}>
              <ThemedText type="smallBold">Username</ThemedText>
              <TextInput
                autoCapitalize="none"
                autoComplete="username"
                onChangeText={setUsername}
                placeholder="Username"
                placeholderTextColor={theme.textSecondary}
                style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
                value={username}
              />
            </ThemedView>
            <ThemedView style={styles.field}>
              <ThemedText type="smallBold">Password</ThemedText>
              <TextInput
                autoCapitalize="none"
                autoComplete="current-password"
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor={theme.textSecondary}
                secureTextEntry
                style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
                value={password}
              />
            </ThemedView>

            {message ? <ThemedText themeColor="textSecondary" type="small">{message}</ThemedText> : null}

            <Pressable onPress={handleLogIn} style={({ pressed }) => [styles.logInButton, pressed && styles.pressed]}>
              <ThemedText style={styles.logInText}>{isSubmitting ? 'Logging in...' : 'Log in'}</ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  safeArea: { flex: 1, width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center' },
  content: { flex: 1, justifyContent: 'center', padding: Spacing.four, gap: Spacing.three },
  backButton: { alignSelf: 'flex-start', paddingVertical: Spacing.one },
  form: { gap: Spacing.three, marginTop: Spacing.two },
  field: { gap: Spacing.one },
  input: { borderWidth: 1, borderRadius: Spacing.two, fontSize: 16, padding: Spacing.three },
  logInButton: { alignItems: 'center', backgroundColor: '#208AEF', borderRadius: Spacing.two, marginTop: Spacing.two, paddingVertical: Spacing.three },
  logInText: { color: '#ffffff', fontWeight: 700 },
  pressed: { opacity: 0.75 },
});
