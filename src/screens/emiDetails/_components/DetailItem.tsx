import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

type Props = {
  label: string;
  value: string;
};

export default function DetailItem({ label, value }: Props) {
  const { theme } = useTheme();
  const themed = createStyles(theme);

  return (
    <View style={themed.item}>
      <Text style={themed.label}>{label}</Text>
      <Text style={themed.value}>{value}</Text>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  const { colors } = theme;

  return StyleSheet.create({
    item: {
      width: '47%',
      gap: 2,
    },
    label: {
      fontSize: 11,
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
      color: colors.textSecondary,
    },
    value: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
    },
  });
}
