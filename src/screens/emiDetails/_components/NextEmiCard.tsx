import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

type Props = {
  number: number;
  amount: string;
  dueDate: string;
  status: string;
  onPay: () => void;
};

const STATUS_COLORS: Record<string, string> = {
  Paid: '#22C55E',
  Upcoming: '#F59E0B',
  Late: '#EF4444',
};

export default function NextEmiCard({
  number,
  amount,
  dueDate,
  status,
  onPay,
}: Props) {
  const { theme } = useTheme();
  const themed = createStyles(theme, STATUS_COLORS[status] ?? '#F59E0B');

  return (
    <View style={themed.card}>
      <View style={themed.top}>
        <Text style={themed.label}>Next EMI #{number}</Text>
        <View style={themed.badge}>
          <Text style={themed.badgeText}>{status}</Text>
        </View>
      </View>
      <Text style={themed.amount}>{amount}</Text>
      <Text style={themed.date}>Due on {dueDate}</Text>

      <Pressable
        onPress={onPay}
        style={({ pressed }) => [themed.payBtn, pressed && themed.pressed]}
      >
        <Text style={themed.payBtnText}>Pay Now</Text>
      </Pressable>
    </View>
  );
}

function createStyles(
  theme: ReturnType<typeof useTheme>['theme'],
  statusColor: string,
) {
  const { colors, spacing, radius } = theme;

  return StyleSheet.create({
    card: {
      borderWidth: 1,
      padding: spacing.lg,
      marginBottom: spacing.md,
      backgroundColor: colors.primary + '08',
      borderColor: colors.primary + '20',
      borderRadius: radius.lg,
    },
    top: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    label: {
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: colors.textSecondary,
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: radius.pill,
      backgroundColor: statusColor + '18',
    },
    badgeText: {
      fontSize: 11,
      fontWeight: '700',
      color: statusColor,
    },
    amount: {
      fontSize: 30,
      fontWeight: '800',
      color: colors.text,
      marginTop: spacing.sm,
    },
    date: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.textSecondary,
      marginTop: 4,
    },
    payBtn: {
      alignItems: 'center',
      paddingVertical: 14,
      marginTop: spacing.md,
      backgroundColor: colors.primary,
      borderRadius: radius.pill,
    },
    pressed: {
      opacity: 0.85,
    },
    payBtnText: {
      color: colors.onPrimary,
      fontSize: 15,
      fontWeight: '700',
    },
  });
}
