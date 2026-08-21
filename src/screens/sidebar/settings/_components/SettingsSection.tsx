import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';

type Props = {
  title: string;
  spaced?: boolean;
  children: React.ReactNode;
};

export default function SettingsSection({
  title,
  spaced = false,
  children,
}: Props) {
  const { theme } = useTheme();
  const themed = createStyles(theme);

  return (
    <>
      <Text style={[themed.sectionLabel, spaced && themed.sectionLabelTop]}>
        {title}
      </Text>
      <View style={themed.card}>{children}</View>
    </>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  const { colors, spacing, radius } = theme;

  return StyleSheet.create({
    sectionLabel: {
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: colors.textSecondary,
      marginBottom: spacing.sm,
    },
    sectionLabelTop: {
      marginTop: spacing.xl,
    },
    card: {
      borderWidth: 1,
      overflow: 'hidden',
      backgroundColor: colors.surfaceElevated,
      borderColor: colors.border,
      borderRadius: radius.lg,
    },
  });
}
