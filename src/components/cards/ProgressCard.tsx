import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

type Props = {
  title: string;
  percent: number;
  paidLabel: string;
  remainingLabel: string;
};

export default function ProgressCard({
  title,
  percent,
  paidLabel,
  remainingLabel,
}: Props) {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;

  const themed = createStyles(colors, spacing, radius);

  return (
    <View style={themed.container}>
      <View style={themed.header}>
        <Text style={themed.title}>{title}</Text>
        <Text style={themed.percent}>{percent}%</Text>
      </View>
      <View style={themed.track}>
        <View style={[themed.fill, { width: `${Math.min(Math.max(percent, 0), 100)}%` }]} />
      </View>
      <View style={themed.footer}>
        <Text style={themed.footerText}>{paidLabel}</Text>
        <Text style={themed.footerText}>{remainingLabel}</Text>
      </View>
    </View>
  );
}

function createStyles(
  colors: ReturnType<typeof useTheme>['theme']['colors'],
  spacing: ReturnType<typeof useTheme>['theme']['spacing'],
  radius: ReturnType<typeof useTheme>['theme']['radius'],
) {
  return StyleSheet.create({
    container: {
      borderWidth: 1,
      backgroundColor: colors.surfaceElevated,
      borderColor: colors.border,
      borderRadius: radius.lg,
      padding: spacing.lg,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    title: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
    },
    percent: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.primary,
    },
    track: {
      height: 8,
      borderRadius: 4,
      overflow: 'hidden',
      backgroundColor: colors.border,
    },
    fill: {
      height: '100%',
      borderRadius: 4,
      backgroundColor: colors.primary,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    footerText: {
      fontSize: 11,
      fontWeight: '500',
      color: colors.textSecondary,
    },
  });
}
