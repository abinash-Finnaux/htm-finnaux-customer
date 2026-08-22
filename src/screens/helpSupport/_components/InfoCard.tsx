import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

type Props = {
  icon: string;
  message: string;
};

export default function InfoCard({ icon, message }: Props) {
  const { theme } = useTheme();
  const themed = createStyles(theme);

  return (
    <View style={themed.card}>
      <Text style={themed.icon}>{icon}</Text>
      <Text style={themed.message}>{message}</Text>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  const { colors, spacing, radius } = theme;

  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      borderWidth: 1,
      padding: spacing.lg,
      marginTop: spacing.md,
      backgroundColor: colors.primary + '08',
      borderColor: colors.primary + '20',
      borderRadius: radius.md,
    },
    icon: {
      fontSize: 18,
    },
    message: {
      flex: 1,
      fontSize: 13,
      lineHeight: 20,
      marginTop: spacing.xs,
      color: colors.text,
    },
  });
}
