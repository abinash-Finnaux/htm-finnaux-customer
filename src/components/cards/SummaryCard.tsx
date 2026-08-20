import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

type SummaryItem = {
  value: string;
  label: string;
  color?: string;
};

type Props = {
  items: SummaryItem[];
};

export default function SummaryCard({ items }: Props) {
  const { theme } = useTheme();
  const { colors, radius } = theme;

  const themed = createStyles(colors, radius);

  return (
    <View style={themed.row}>
      {items.map((item, index) => (
        <View key={index} style={themed.card}>
          <Text style={[themed.value, item.color && { color: item.color }]}>
            {item.value}
          </Text>
          <Text style={themed.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

function createStyles(
  colors: ReturnType<typeof useTheme>['theme']['colors'],
  radius: ReturnType<typeof useTheme>['theme']['radius'],
) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      gap: 12,
    },
    card: {
      flex: 1,
      borderWidth: 1,
      padding: 16,
      alignItems: 'center',
      backgroundColor: colors.surfaceElevated,
      borderColor: colors.border,
      borderRadius: radius.lg,
    },
    value: {
      fontSize: 20,
      fontWeight: '800',
      color: colors.primary,
    },
    label: {
      fontSize: 11,
      fontWeight: '500',
      marginTop: 4,
      color: colors.textSecondary,
    },
  });
}
