import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentHistory'>;

const PAYMENTS = [
  { id: 'PAY-001', date: '01 Aug 2026', loan: 'Personal Loan', amount: '₹12,500', status: 'Paid', statusColor: '#22C55E' },
  { id: 'PAY-002', date: '01 Jul 2026', loan: 'Personal Loan', amount: '₹12,500', status: 'Paid', statusColor: '#22C55E' },
  { id: 'PAY-003', date: '01 Jul 2026', loan: 'Home Loan', amount: '₹28,000', status: 'Paid', statusColor: '#22C55E' },
  { id: 'PAY-004', date: '01 Jun 2026', loan: 'Personal Loan', amount: '₹12,500', status: 'Paid', statusColor: '#22C55E' },
  { id: 'PAY-005', date: '01 Jun 2026', loan: 'Home Loan', amount: '₹28,000', status: 'Paid', statusColor: '#22C55E' },
  { id: 'PAY-006', date: '15 May 2026', loan: 'Home Loan', amount: '₹28,000', status: 'Late', statusColor: '#EF4444' },
];

export default function PaymentHistoryScreen({ navigation }: Props) {
  const { theme, isDark } = useTheme();
  const { colors, spacing, radius } = theme;

  const headerBg = isDark ? '#1E293B' : colors.primary;
  const decorBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)';

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: headerBg }]}>
        <View style={[styles.decor1, { backgroundColor: decorBg }]} />
        <View style={[styles.decor2, { backgroundColor: decorBg }]} />
        <View style={styles.topBar}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
          >
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
          <Text style={styles.topTitle}>Payment History</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.headerBody}>
          <Text style={styles.headerIcon}>💳</Text>
          <Text style={styles.headerLabel}>All Transactions</Text>
        </View>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.content, { padding: spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        {PAYMENTS.map((payment, index) => (
          <View
            key={index}
            style={[
              styles.paymentCard,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.border,
                borderRadius: radius.md,
              },
            ]}
          >
            <View style={styles.paymentLeft}>
              <Text style={[styles.paymentDate, { color: colors.textSecondary }]}>{payment.date}</Text>
              <Text style={[styles.paymentLoan, { color: colors.text }]}>{payment.loan}</Text>
              <Text style={[styles.paymentId, { color: colors.textSecondary }]}>{payment.id}</Text>
            </View>
            <View style={styles.paymentRight}>
              <Text style={[styles.paymentAmount, { color: colors.text }]}>{payment.amount}</Text>
              <View style={[styles.statusBadge, { backgroundColor: payment.statusColor + '18' }]}>
                <Text style={[styles.statusText, { color: payment.statusColor }]}>{payment.status}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingTop: 56, paddingBottom: 28, paddingHorizontal: 24,
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: 'hidden',
  },
  decor1: { position: 'absolute', top: -40, right: -30, width: 140, height: 140, borderRadius: 70 },
  decor2: { position: 'absolute', bottom: 10, left: -40, width: 100, height: 100, borderRadius: 50 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  backBtnText: { color: '#FFFFFF', fontSize: 20, fontWeight: '600' },
  topTitle: { color: 'rgba(255,255,255,0.8)', fontSize: 16, fontWeight: '600' },
  headerBody: { alignItems: 'center', marginTop: 20 },
  headerIcon: { fontSize: 36 },
  headerLabel: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginTop: 10 },
  flex: { flex: 1 },
  content: { paddingBottom: 40 },
  paymentCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, borderWidth: 1, marginBottom: 10,
  },
  paymentLeft: { flex: 1 },
  paymentDate: { fontSize: 11, fontWeight: '500' },
  paymentLoan: { fontSize: 15, fontWeight: '700', marginTop: 3 },
  paymentId: { fontSize: 11, marginTop: 2 },
  paymentRight: { alignItems: 'flex-end', marginLeft: 12 },
  paymentAmount: { fontSize: 15, fontWeight: '700' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginTop: 6 },
  statusText: { fontSize: 11, fontWeight: '700' },
});
