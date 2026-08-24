import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

type Props = {
  paidLabel: string;
  paidValue: string;
  paidSub?: string;
  dueLabel: string;
  dueValue: string;
  dueSub?: string;
};

export default function DuoStatPanel({
  paidLabel,
  paidValue,
  paidSub,
  dueLabel,
  dueValue,
  dueSub,
}: Props) {
  const { theme } = useTheme();
  const themed = createStyles(theme);

  return (
    <View style={themed.panel}>
      <View style={themed.colPaid}>
        <Text style={themed.label}>{paidLabel}</Text>
        <Text style={themed.value}>{paidValue}</Text>
        {paidSub ? <Text style={themed.sub}>{paidSub}</Text> : null}
      </View>
      <View style={themed.divider} />
      <View style={themed.colDue}>
        <Text style={themed.label}>{dueLabel}</Text>
        <Text style={[themed.value, themed.valueDue]}>{dueValue}</Text>
        {dueSub ? <Text style={themed.sub}>{dueSub}</Text> : null}
      </View>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  const { colors, spacing, radius } = theme;

  return StyleSheet.create({
    panel: {
      flexDirection: 'row',
      marginTop: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.lg,
      overflow: 'hidden',
      backgroundColor: colors.surfaceElevated,
    },
    colPaid: {
      flex: 1,
      padding: spacing.md,
      backgroundColor: colors.success + '0A',
      gap: 3,
    },
    colDue: {
      flex: 1,
      padding: spacing.md,
      backgroundColor: colors.primary + '0A',
      alignItems: 'flex-end',
      gap: 3,
    },
    divider: {
      width: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
    },
    label: {
      fontSize: 10,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: colors.textSecondary,
    },
    value: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.text,
    },
    valueDue: {
      color: colors.primary,
    },
    sub: {
      fontSize: 11,
      fontWeight: '500',
      color: colors.textSecondary,
    },
  });
}
