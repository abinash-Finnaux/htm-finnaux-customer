import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../../context/ThemeContext';
import type { RootStackParamList } from '../../../../App';

import { createStyles } from './styles';
import PaymentCard, { type Payment } from './_components/PaymentCard';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentHistory'>;

const PAYMENTS: Payment[] = [
  {
    id: 'PAY-001',
    date: '01 Aug 2026',
    loan: 'Personal Loan',
    amount: '₹12,500',
    status: 'Paid',
    statusColor: '#22C55E',
  },
  {
    id: 'PAY-002',
    date: '01 Jul 2026',
    loan: 'Personal Loan',
    amount: '₹12,500',
    status: 'Paid',
    statusColor: '#22C55E',
  },
  {
    id: 'PAY-003',
    date: '01 Jul 2026',
    loan: 'Home Loan',
    amount: '₹28,000',
    status: 'Paid',
    statusColor: '#22C55E',
  },
  {
    id: 'PAY-004',
    date: '01 Jun 2026',
    loan: 'Personal Loan',
    amount: '₹12,500',
    status: 'Paid',
    statusColor: '#22C55E',
  },
  {
    id: 'PAY-005',
    date: '01 Jun 2026',
    loan: 'Home Loan',
    amount: '₹28,000',
    status: 'Paid',
    statusColor: '#22C55E',
  },
  {
    id: 'PAY-006',
    date: '15 May 2026',
    loan: 'Home Loan',
    amount: '₹28,000',
    status: 'Late',
    statusColor: '#EF4444',
  },
];

export default function PaymentHistoryScreen({ navigation }: Props) {
  const { theme, isDark } = useTheme();
  const { colors, spacing, radius } = theme;

  const headerBg = isDark ? '#1E293B' : colors.primary;
  const decorBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)';

  const themed = createStyles(colors, spacing, radius, headerBg, decorBg);

  return (
    <View style={themed.root}>
      <View style={themed.header}>
        <View style={themed.decor1} />
        <View style={themed.decor2} />
        <View style={themed.topBar}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              themed.backBtn,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Text style={themed.backBtnText}>←</Text>
          </Pressable>
          <Text style={themed.topTitle}>Payment History</Text>
          <View style={themed.topSpacer} />
        </View>
        <View style={themed.headerBody}>
          <Text style={themed.headerIcon}>💳</Text>
          <Text style={themed.headerLabel}>All Transactions</Text>
        </View>
      </View>

      <ScrollView
        style={themed.flex}
        contentContainerStyle={themed.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {PAYMENTS.map((payment, index) => (
          <PaymentCard key={index} payment={payment} />
        ))}
      </ScrollView>
    </View>
  );
}
