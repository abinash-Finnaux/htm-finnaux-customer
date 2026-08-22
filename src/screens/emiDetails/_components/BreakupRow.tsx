import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

type Props = {
  label: string;
  value: string;
  highlight?: boolean;
};

export default function BreakupRow({ label, value, highlight }: Props) {
  const { theme } = useTheme();
  const themed = createStyles(theme);

  return (
    <View style={themed.row}>
      <Text style={highlight ? themed.labelStrong : themed.label}>{label}</Text>
      <Text style={highlight ? themed.valueStrong : themed.value}>{value}</Text>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  const { colors } = theme;

  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
    },
    label: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    value: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
    },
    labelStrong: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
    },
    valueStrong: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.primary,
    },
  });
}
