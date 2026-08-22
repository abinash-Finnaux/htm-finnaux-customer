import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

type Props = {
  label: string;
  value: string;
};

export default function StatBox({ label, value }: Props) {
  const { theme } = useTheme();
  const themed = createStyles(theme);

  return (
    <View style={themed.box}>
      <Text style={themed.label}>{label}</Text>
      <Text style={themed.value}>{value}</Text>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  const { colors, spacing, radius } = theme;

  return StyleSheet.create({
    box: {
      flex: 1,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      backgroundColor: colors.surface,
    },
    label: {
      fontSize: 11,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    value: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.text,
      marginTop: 4,
    },
  });
}
