import { Image, Pressable, StyleSheet, View, type ImageSourcePropType } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ProfileRequestCardProps = {
  username: string;
  firstName: string;
  lastName: string;
  profilePicture: ImageSourcePropType;
  onRequestToMeet: () => void;
  requested: boolean;
};

export function ProfileRequestCard({
  username,
  firstName,
  lastName,
  profilePicture,
  onRequestToMeet,
  requested,
}: ProfileRequestCardProps) {
  const theme = useTheme();
  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <Image
        accessibilityLabel={`${fullName}'s profile picture`}
        source={profilePicture}
        style={[styles.profilePicture, { borderColor: theme.backgroundSelected }]}
      />
      <View style={styles.details}>
        <ThemedText type="smallBold" numberOfLines={1}>
          {fullName}
        </ThemedText>
        <ThemedText themeColor="textSecondary" type="small" numberOfLines={1}>
          @{username}
        </ThemedText>
      </View>
      <Pressable
        accessibilityLabel={`Request to meet ${fullName}`}
        accessibilityRole="button"
        onPress={onRequestToMeet}
        disabled={requested}
        style={({ pressed }) => [
          styles.requestButton,
          requested && styles.requestedButton,
          pressed && !requested && styles.pressed,
        ]}
      >
        <ThemedText
          style={[
            styles.requestButtonText,
            requested && styles.requestedButtonText,
          ]}
        >
          {requested ? 'Requested' : 'Request To Meet'}
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  requestedButton: {
    backgroundColor: '#888888',
  },

  requestedButtonText: {
    color: '#ffffff',
  },

  card: {
    alignItems: 'center',
    borderRadius: Spacing.two,
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  profilePicture: {
    aspectRatio: 1,
    borderRadius: 32,
    borderWidth: 2,
    height: 64,
    width: 64,
  },
  details: {
    flex: 1,
    gap: Spacing.half,
    minWidth: 0,
  },
  requestButton: {
    alignItems: 'center',
    backgroundColor: '#208AEF',
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  requestButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 700,
  },
  pressed: {
    opacity: 0.75,
  },
});