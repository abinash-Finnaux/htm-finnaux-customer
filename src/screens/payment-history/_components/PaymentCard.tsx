import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

export type Payment = {
  id: string;
  date: string;
  loan: string;
  amount: string;
  status: string;
  statusColor: string;
};

type Props = {
  payment: Payment;
};

export default function PaymentCard({ payment }: Props) {
  const { theme } = useTheme();
  const themed = createStyles(theme, payment.statusColor);

  return (
    <View style={themed.card}>
      <View style={themed.left}>
        <Text style={themed.date}>{payment.date}</Text>
        <Text style={themed.loan}>{payment.loan}</Text>
        <Text style={themed.id}>{payment.id}</Text>
      </View>
      <View style={themed.right}>
        <Text style={themed.amount}>{payment.amount}</Text>
        <View style={themed.statusBadge}>
          <Text style={themed.statusText}>{payment.status}</Text>
        </View>
      </View>
    </View>
  );
}

function createStyles(
  theme: ReturnType<typeof useTheme>['theme'],
  statusColor: string,
) {
  const { colors, radius } = theme;

  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderWidth: 1,
      marginBottom: 10,
      backgroundColor: colors.surfaceElevated,
      borderColor: colors.border,
      borderRadius: radius.md,
    },
    left: {
      flex: 1,
    },
    date: {
      fontSize: 11,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    loan: {
      fontSize: 15,
      fontWeight: '700',
      marginTop: 3,
      color: colors.text,
    },
    id: {
      fontSize: 11,
      marginTop: 2,
      color: colors.textSecondary,
    },
    right: {
      alignItems: 'flex-end',
      marginLeft: 12,
    },
    amount: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.text,
    },
    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
      marginTop: 6,
      backgroundColor: statusColor + '18',
    },
    statusText: {
      fontSize: 11,
      fontWeight: '700',
      color: statusColor,
    },
  });
}
