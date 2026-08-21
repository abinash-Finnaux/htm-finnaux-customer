import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

type Props = {
  emoji: string;
  value: string;
  label: string;
};

export default function StatCard({ emoji, value, label }: Props) {
  const { theme, isDark } = useTheme();
  const themed = createStyles(theme, isDark);

  return (
    <View style={themed.card}>
      <Text style={themed.emoji}>{emoji}</Text>
      <Text style={themed.value}>{value}</Text>
      <Text style={themed.label}>{label}</Text>
    </View>
  );
}

function createStyles(
  theme: ReturnType<typeof useTheme>['theme'],
  isDark: boolean,
) {
  const { colors } = theme;

  return StyleSheet.create({
    card: {
      flex: 1,
      borderRadius: 16,
      paddingVertical: 14,
      paddingHorizontal: 10,
      alignItems: 'center',
      backgroundColor: isDark
        ? 'rgba(255,255,255,0.08)'
        : 'rgba(255,255,255,0.15)',
    },
    emoji: {
      fontSize: 20,
      marginBottom: 6,
    },
    value: {
      color: colors.onPrimary,
      fontSize: 16,
      fontWeight: '700',
    },
    label: {
      color: 'rgba(255,255,255,0.65)',
      fontSize: 10,
      fontWeight: '500',
      marginTop: 2,
      textAlign: 'center',
    },
  });
}
