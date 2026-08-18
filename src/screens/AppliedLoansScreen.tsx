import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'AppliedLoans'>;

const APPLIED_LOANS = [
  {
    id: 'APP-001',
    type: 'Personal Loan',
    amount: '₹5,00,000',
    tenure: '36 months',
    appliedDate: '15 Jul 2026',
    status: 'Approved',
    statusColor: '#22C55E',
  },
  {
    id: 'APP-002',
    type: 'Business Loan',
    amount: '₹10,00,000',
    tenure: '60 months',
    appliedDate: '28 Jul 2026',
    status: 'Under Review',
    statusColor: '#F59E0B',
  },
  {
    id: 'APP-003',
    type: 'Home Loan',
    amount: '₹30,00,000',
    tenure: '240 months',
    appliedDate: '05 Aug 2026',
    status: 'Applied',
    statusColor: '#3B82F6',
  },
  {
    id: 'APP-004',
    type: 'Vehicle Loan',
    amount: '₹8,00,000',
    tenure: '48 months',
    appliedDate: '12 Aug 2026',
    status: 'Rejected',
    statusColor: '#EF4444',
  },
];

export default function AppliedLoansScreen({ navigation }: Props) {
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
          <Text style={styles.topTitle}>Applied Loans</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.headerBody}>
          <Text style={styles.headerIcon}>📋</Text>
          <Text style={styles.headerLabel}>{APPLIED_LOANS.length} Applications</Text>
        </View>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.content, { padding: spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        {APPLIED_LOANS.map((loan, index) => (
          <View
            key={index}
            style={[
              styles.loanCard,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.border,
                borderRadius: radius.lg,
                padding: spacing.lg,
              },
            ]}
          >
            <View style={styles.loanHeader}>
              <View>
                <Text style={[styles.loanType, { color: colors.text }]}>{loan.type}</Text>
                <Text style={[styles.loanId, { color: colors.textSecondary }]}>{loan.id}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: loan.statusColor + '18' }]}>
                <Text style={[styles.statusText, { color: loan.statusColor }]}>{loan.status}</Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.loanGrid}>
              <View style={styles.loanField}>
                <Text style={[styles.loanFieldLabel, { color: colors.textSecondary }]}>Amount</Text>
                <Text style={[styles.loanFieldValue, { color: colors.text }]}>{loan.amount}</Text>
              </View>
              <View style={styles.loanField}>
                <Text style={[styles.loanFieldLabel, { color: colors.textSecondary }]}>Tenure</Text>
                <Text style={[styles.loanFieldValue, { color: colors.text }]}>{loan.tenure}</Text>
              </View>
              <View style={styles.loanField}>
                <Text style={[styles.loanFieldLabel, { color: colors.textSecondary }]}>Applied On</Text>
                <Text style={[styles.loanFieldValue, { color: colors.primary }]}>{loan.appliedDate}</Text>
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
  loanCard: { borderWidth: 1, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  loanHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  loanType: { fontSize: 16, fontWeight: '700' },
  loanId: { fontSize: 12, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: '700' },
  divider: { height: 1, marginVertical: 14 },
  loanGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  loanField: { width: '46%' },
  loanFieldLabel: { fontSize: 11, fontWeight: '500' },
  loanFieldValue: { fontSize: 14, fontWeight: '700', marginTop: 3 },
});
