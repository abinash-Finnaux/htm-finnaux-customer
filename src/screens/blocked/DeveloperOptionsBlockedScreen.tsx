import React, { useEffect } from 'react';
import { BackHandler, StyleSheet, Text, View } from 'react-native';
import { ShieldAlert } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import PrimaryButton from '../../components/buttons/PrimaryButton';

export default function DeveloperOptionsBlockedScreen() {
  const { theme } = useTheme();
  const { colors, spacing, radius, typography } = theme;

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => subscription.remove();
  }, []);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.border,
            borderRadius: radius.lg,
          },
        ]}
      >
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: colors.error + '15' },
          ]}
        >
          <ShieldAlert size={48} color={colors.error} />
        </View>

        <Text
          style={[
            styles.title,
            { color: colors.text, fontSize: typography.heading },
          ]}
        >
          Access Restricted
        </Text>

        <Text
          style={[
            styles.message,
            { color: colors.textSecondary, fontSize: typography.body },
          ]}
        >
          This app cannot be used while Developer Options are enabled on your
          device. Please disable Developer Options and reopen the app.
        </Text>

        <PrimaryButton
          title="Close App"
          onPress={() => BackHandler.exitApp()}
          style={{ width: '100%', marginTop: spacing.lg }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    borderWidth: 1,
    padding: 28,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontWeight: '800',
    textAlign: 'center',
  },
  message: {
    marginTop: 10,
    lineHeight: 22,
    textAlign: 'center',
  },
});