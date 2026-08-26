import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function SignUpScreen() {
  const theme = useTheme();
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async () => {
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        mode: 'cors',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, firstName, lastName, email, password }),
      });

      if (response.status === 201) {
        setSuccess('Registration successful. Welcome to Collaborate!');
        return;
      }

      if (!response.ok) {
        throw new Error(`Registration failed with status ${response.status}`);
      }

      throw new Error(`Registration returned an unexpected status: ${response.status}`);
    } catch {
      setError('Unable to register. Check that the API is running and allows this app origin.');
    }
  };

  const fields = [
    { label: 'Username', value: username, onChangeText: setUsername, autoCapitalize: 'none' as const },
    { label: 'First name', value: firstName, onChangeText: setFirstName },
    { label: 'Last name', value: lastName, onChangeText: setLastName },
    {
      label: 'Email',
      value: email,
      onChangeText: setEmail,
      autoCapitalize: 'none' as const,
      autoComplete: 'email' as const,
      keyboardType: 'email-address' as const,
    },
    {
      label: 'Password',
      value: password,
      onChangeText: setPassword,
      autoCapitalize: 'none' as const,
      autoComplete: 'new-password' as const,
      secureTextEntry: true,
    },
  ];

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ThemedText type="linkPrimary">Back</ThemedText>
          </Pressable>

          <ThemedText type="subtitle">Create your account</ThemedText>
          <ThemedText themeColor="textSecondary">Join Collaborate and get started.</ThemedText>

          <ThemedView style={styles.form}>
            {fields.map((field) => (
              <ThemedView key={field.label} style={styles.field}>
                <ThemedText type="smallBold">{field.label}</ThemedText>
                <TextInput
                  {...field}
                  placeholder={field.label}
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
                />
              </ThemedView>
            ))}
            {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
            {success ? <ThemedText style={styles.successText}>{success}</ThemedText> : null}
            <Pressable
              onPress={handleRegister}
              style={({ pressed }) => [styles.registerButton, pressed && styles.pressed]}
            >
              <ThemedText style={styles.registerText}>Register</ThemedText>
            </Pressable>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  safeArea: { flex: 1, width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center' },
  content: { padding: Spacing.four, gap: Spacing.three },
  backButton: { alignSelf: 'flex-start', paddingVertical: Spacing.one },
  form: { gap: Spacing.three, marginTop: Spacing.two },
  field: { gap: Spacing.one },
  input: { borderWidth: 1, borderRadius: Spacing.two, fontSize: 16, padding: Spacing.three },
  registerButton: {
    alignItems: 'center',
    backgroundColor: '#208AEF',
    borderRadius: Spacing.two,
    marginTop: Spacing.two,
    paddingVertical: Spacing.three,
  },
  registerText: { color: '#ffffff', fontWeight: 700 },
  errorText: { color: '#C62828' },
  successText: { color: '#18794E' },
  pressed: { opacity: 0.75 },
});
