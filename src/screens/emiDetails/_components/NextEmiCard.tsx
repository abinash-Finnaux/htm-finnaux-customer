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

export default function NextEmiCard({
  number,
  amount,
  dueDate,
  status,
  onPay,
}: Props) {
  const { theme } = useTheme();
  const themed = createStyles(theme);

  const badgeStyle =
    status === 'Paid'
      ? themed.badge_Paid
      : status === 'Late'
      ? themed.badge_Late
      : themed.badge_Upcoming;

  return (
    <View style={themed.card}>
      <View style={themed.top}>
        <Text style={themed.label}>Next EMI #{number}</Text>
        <View style={themed.badge}>
          <Text style={[themed.badgeText, badgeStyle]}>{status}</Text>
        </View>
      </View>
      <Text style={themed.amount}>{amount}</Text>
      <Text style={themed.date}>Due on {dueDate}</Text>

      <Pressable
        onPress={onPay}
        style={({ pressed }) => [themed.payBtn, pressed && themed.pressed]}
      >
        <Text style={themed.payBtnText}>Pay Now →</Text>
      </Pressable>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  const { colors, spacing, radius, dark } = theme;

  const cardBg = dark ? '#1E293B' : colors.primary;

  return StyleSheet.create({
    card: {
      padding: spacing.lg,
      marginBottom: spacing.md,
      backgroundColor: cardBg,
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
      color: 'rgba(255,255,255,0.75)',
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: radius.pill,
      backgroundColor: 'rgba(255,255,255,0.18)',
    },
    badgeText: {
      fontSize: 11,
      fontWeight: '700',
    },
    badge_Paid: {
      color: '#86EFAC',
    },
    badge_Upcoming: {
      color: '#FDE68A',
    },
    badge_Late: {
      color: '#FCA5A5',
    },
    amount: {
      fontSize: 32,
      fontWeight: '800',
      color: '#FFFFFF',
      marginTop: spacing.sm,
      letterSpacing: 0.3,
    },
    date: {
      fontSize: 13,
      fontWeight: '500',
      color: 'rgba(255,255,255,0.75)',
      marginTop: 4,
    },
    payBtn: {
      alignItems: 'center',
      paddingVertical: 14,
      marginTop: spacing.md,
      backgroundColor: '#FFFFFF',
      borderRadius: radius.pill,
    },
    pressed: {
      opacity: 0.85,
    },
    payBtnText: {
      color: '#1E293B',
      fontSize: 15,
      fontWeight: '700',
    },
  });
}
