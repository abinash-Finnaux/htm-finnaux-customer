import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'RepaymentSchedule'>;

const SCHEDULE = [
  {
    month: 1,
    date: '15 Sep 2026',
    emi: 12500,
    principal: 8750,
    interest: 3750,
    balance: 491250,
    status: 'Paid' as const,
  },
  {
    month: 2,
    date: '15 Oct 2026',
    emi: 12500,
    principal: 8781,
    interest: 3719,
    balance: 482469,
    status: 'Paid' as const,
  },
  {
    month: 3,
    date: '15 Nov 2026',
    emi: 12500,
    principal: 8813,
    interest: 3687,
    balance: 473656,
    status: 'Paid' as const,
  },
  {
    month: 4,
    date: '15 Dec 2026',
    emi: 12500,
    principal: 8844,
    interest: 3656,
    balance: 464812,
    status: 'Paid' as const,
  },
  {
    month: 5,
    date: '15 Jan 2027',
    emi: 12500,
    principal: 8876,
    interest: 3624,
    balance: 455936,
    status: 'Paid' as const,
  },
  {
    month: 6,
    date: '15 Feb 2027',
    emi: 12500,
    principal: 8908,
    interest: 3592,
    balance: 447028,
    status: 'Paid' as const,
  },
  {
    month: 7,
    date: '15 Mar 2027',
    emi: 12500,
    principal: 8940,
    interest: 3560,
    balance: 438088,
    status: 'Upcoming' as const,
  },
  {
    month: 8,
    date: '15 Apr 2027',
    emi: 12500,
    principal: 8972,
    interest: 3528,
    balance: 429116,
    status: 'Upcoming' as const,
  },
  {
    month: 9,
    date: '15 May 2027',
    emi: 12500,
    principal: 9004,
    interest: 3496,
    balance: 420112,
    status: 'Upcoming' as const,
  },
  {
    month: 10,
    date: '15 Jun 2027',
    emi: 12500,
    principal: 9036,
    interest: 3464,
    balance: 411076,
    status: 'Upcoming' as const,
  },
  {
    month: 11,
    date: '15 Jul 2027',
    emi: 12500,
    principal: 9069,
    interest: 3431,
    balance: 402007,
    status: 'Upcoming' as const,
  },
  {
    month: 12,
    date: '15 Aug 2027',
    emi: 12500,
    principal: 9101,
    interest: 3399,
    balance: 392906,
    status: 'Upcoming' as const,
  },
];

const STATUS_COLORS = {
  Paid: '#22C55E',
  Upcoming: '#F59E0B',
  Overdue: '#EF4444',
};

const PAYMENT_MODES = [
  { id: 'upi', label: 'UPI', icon: '📱' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
  { id: 'card', label: 'Card', icon: '💳' },
];

const PREPAY_TYPES = [
  { id: 'prepay', label: 'Part Payment', icon: '💰' },
  { id: 'foreclose', label: 'Foreclose Loan', icon: '✅' },
];

export default function RepaymentScheduleScreen({ navigation }: Props) {
  const { theme, isDark } = useTheme();
  const { colors, spacing, radius } = theme;

  const headerBg = isDark ? '#1E293B' : colors.primary;
  const decorBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)';
  const headerBgLight = isDark ? 'rgba(255,255,255,0.08)' : headerBg + '12';

  const paidCount = SCHEDULE.filter(s => s.status === 'Paid').length;
  const totalPaid = SCHEDULE.filter(s => s.status === 'Paid').reduce(
    (sum, s) => sum + s.emi,
    0,
  );
  const outstandingBalance = SCHEDULE[SCHEDULE.length - 1].balance;
  const upcomingEmis = SCHEDULE.filter(s => s.status === 'Upcoming');

  const [activeTab, setActiveTab] = useState<'pay' | 'prepay'>('pay');

  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMode, setPayMode] = useState('');

  const [prepayType, setPrepayType] = useState('prepay');
  const [prepayAmount, setPrepayAmount] = useState('');
  const [prepayMode, setPrepayMode] = useState('');

  const handlePaySubmit = () => {
    if (!selectedMonth)
      return Alert.alert('Select EMI', 'Please select an EMI month to pay.');
    if (!payAmount.trim())
      return Alert.alert('Amount', 'Please enter the payment amount.');
    if (!payMode)
      return Alert.alert('Payment Mode', 'Please select a payment mode.');
    Alert.alert(
      'Confirm Payment',
      `Pay ₹${Number(payAmount).toLocaleString(
        'en-IN',
      )} for EMI #${selectedMonth} via ${
        PAYMENT_MODES.find(m => m.id === payMode)?.label
      }?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay',
          onPress: () => {
            Alert.alert('Success', 'Payment initiated successfully.', [
              { text: 'OK' },
            ]);
            setSelectedMonth(null);
            setPayAmount('');
            setPayMode('');
          },
        },
      ],
    );
  };

  const handlePrepaySubmit = () => {
    if (!prepayAmount.trim())
      return Alert.alert('Amount', 'Please enter the amount.');
    if (!prepayMode)
      return Alert.alert('Payment Mode', 'Please select a payment mode.');
    const label = prepayType === 'foreclose' ? 'foreclose' : 'prepay';
    Alert.alert(
      'Confirm',
      `₹${Number(prepayAmount).toLocaleString(
        'en-IN',
      )} will be used to ${label} your loan. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            Alert.alert('Success', 'Request submitted successfully.', [
              { text: 'OK' },
            ]);
            setPrepayAmount('');
            setPrepayMode('');
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: headerBg }]}>
        <View style={[styles.decor1, { backgroundColor: decorBg }]} />
        <View style={[styles.decor2, { backgroundColor: decorBg }]} />
        <View style={styles.topBar}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.backBtn,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
          <Text style={styles.topTitle}>Repayment Schedule</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.headerBody}>
          <Text style={styles.headerIcon}>📅</Text>
          <Text style={styles.headerLabel}>HMT-PL-001</Text>
          <Text style={styles.headerSub}>Personal Loan • ₹12,500/mo</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.content, { padding: spacing.lg }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Summary Cards ── */}
          <View style={styles.summaryRow}>
            <View
              style={[
                styles.summaryCard,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.border,
                  borderRadius: radius.lg,
                },
              ]}
            >
              <Text style={[styles.summaryValue, { color: colors.primary }]}>
                {paidCount}/{SCHEDULE.length}
              </Text>
              <Text
                style={[styles.summaryLabel, { color: colors.textSecondary }]}
              >
                EMIs Paid
              </Text>
            </View>
            <View
              style={[
                styles.summaryCard,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.border,
                  borderRadius: radius.lg,
                },
              ]}
            >
              <Text style={[styles.summaryValue, { color: '#22C55E' }]}>
                ₹{totalPaid.toLocaleString('en-IN')}
              </Text>
              <Text
                style={[styles.summaryLabel, { color: colors.textSecondary }]}
              >
                Total Paid
              </Text>
            </View>
          </View>

          {/* ── Progress ── */}
          <View
            style={[
              styles.progressSection,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.border,
                borderRadius: radius.lg,
                padding: spacing.lg,
              },
            ]}
          >
            <View style={styles.progressHeader}>
              <Text style={[styles.progressTitle, { color: colors.text }]}>
                Repayment Progress
              </Text>
              <Text style={[styles.progressPercent, { color: colors.primary }]}>
                {Math.round((paidCount / SCHEDULE.length) * 100)}%
              </Text>
            </View>
            <View
              style={[styles.progressTrack, { backgroundColor: colors.border }]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: colors.primary,
                    width: `${(paidCount / SCHEDULE.length) * 100}%`,
                  },
                ]}
              />
            </View>
            <View style={styles.progressFooter}>
              <Text
                style={[
                  styles.progressFooterText,
                  { color: colors.textSecondary },
                ]}
              >
                ₹{totalPaid.toLocaleString('en-IN')} paid
              </Text>
              <Text
                style={[
                  styles.progressFooterText,
                  { color: colors.textSecondary },
                ]}
              >
                ₹{(500000 - totalPaid).toLocaleString('en-IN')} remaining
              </Text>
            </View>
          </View>

          {/* ── Monthly Schedule ── */}
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.textSecondary, marginTop: spacing.xl },
            ]}
          >
            Monthly Schedule
          </Text>

          {SCHEDULE.map((item, index) => {
            const isPaid = item.status === 'Paid';
            const isUpcoming = item.status === 'Upcoming';
            const isLast = index === SCHEDULE.length - 1;
            const accentColor = STATUS_COLORS[item.status];

            return (
              <View
                key={index}
                style={[
                  styles.scheduleCardOuter,
                  {
                    borderLeftColor: accentColor,
                    shadowColor: accentColor,
                    borderRadius: radius.lg,
                    marginBottom: isLast ? 0 : 10,
                  },
                ]}
              >
                <View
                  style={[
                    styles.scheduleCard,
                    {
                      backgroundColor: colors.surfaceElevated,
                      borderColor: accentColor + '15',
                      borderRadius: radius.lg,
                    },
                  ]}
                >
                  <View style={styles.scheduleTopRow}>
                    <View style={styles.scheduleMonthBlock}>
                      <View
                        style={[
                          styles.scheduleMonthBadge,
                          { backgroundColor: accentColor + '18' },
                        ]}
                      >
                        <Text
                          style={[
                            styles.scheduleMonthNum,
                            { color: accentColor },
                          ]}
                        >
                          {String(item.month).padStart(2, '0')}
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={[styles.scheduleDate, { color: colors.text }]}
                        >
                          {item.date}
                        </Text>
                        <Text
                          style={[
                            styles.scheduleEmiLabel,
                            { color: colors.textSecondary },
                          ]}
                        >
                          EMI #{item.month}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.scheduleStatusBadge,
                        { backgroundColor: accentColor + '18' },
                      ]}
                    >
                      <View
                        style={[
                          styles.scheduleStatusDot,
                          { backgroundColor: accentColor },
                        ]}
                      />
                      <Text
                        style={[
                          styles.scheduleStatusText,
                          { color: accentColor },
                        ]}
                      >
                        {item.status}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.scheduleDivider,
                      { backgroundColor: colors.border },
                    ]}
                  />

                  <View style={styles.scheduleBottomRow}>
                    <View style={styles.scheduleAmountBlock}>
                      <Text
                        style={[
                          styles.scheduleAmountLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        Principal
                      </Text>
                      <Text
                        style={[
                          styles.scheduleAmountValue,
                          { color: colors.text },
                        ]}
                      >
                        ₹{item.principal.toLocaleString('en-IN')}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.scheduleAmountVerticalDivider,
                        { backgroundColor: colors.border },
                      ]}
                    />
                    <View style={styles.scheduleAmountBlock}>
                      <Text
                        style={[
                          styles.scheduleAmountLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        Interest
                      </Text>
                      <Text
                        style={[
                          styles.scheduleAmountValue,
                          { color: colors.text },
                        ]}
                      >
                        ₹{item.interest.toLocaleString('en-IN')}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.scheduleAmountVerticalDivider,
                        { backgroundColor: colors.border },
                      ]}
                    />
                    <View style={styles.scheduleAmountBlock}>
                      <Text
                        style={[
                          styles.scheduleAmountLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        EMI
                      </Text>
                      <Text
                        style={[
                          styles.scheduleAmountValueBold,
                          { color: accentColor },
                        ]}
                      >
                        ₹{item.emi.toLocaleString('en-IN')}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.scheduleBalanceRow,
                      { backgroundColor: colors.surface },
                    ]}
                  >
                    <Text
                      style={[
                        styles.scheduleBalanceLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Outstanding Balance
                    </Text>
                    <Text
                      style={[
                        styles.scheduleBalanceValue,
                        { color: colors.text },
                      ]}
                    >
                      ₹{item.balance.toLocaleString('en-IN')}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}

          {/* ── Action Tabs ── */}
          <View style={[styles.actionTabs, { marginTop: spacing.xl }]}>
            <Pressable
              onPress={() => setActiveTab('pay')}
              style={[
                styles.actionTab,
                {
                  backgroundColor: activeTab === 'pay' ? headerBg : colors.surfaceElevated,
                  borderColor: activeTab === 'pay' ? headerBg : colors.border,
                  borderRadius: radius.lg,
                },
              ]}
            >
              <Text style={styles.actionTabIcon}>💳</Text>
              <Text style={[styles.actionTabLabel, { color: activeTab === 'pay' ? '#FFFFFF' : colors.text }]}>Pay EMI</Text>
              {activeTab === 'pay' && <Text style={[styles.actionTabCount, { color: 'rgba(255,255,255,0.7)' }]}>{upcomingEmis.length} due</Text>}
            </Pressable>
            <Pressable
              onPress={() => setActiveTab('prepay')}
              style={[
                styles.actionTab,
                {
                  backgroundColor: activeTab === 'prepay' ? '#8B5CF6' : colors.surfaceElevated,
                  borderColor: activeTab === 'prepay' ? '#8B5CF6' : colors.border,
                  borderRadius: radius.lg,
                },
              ]}
            >
              <Text style={styles.actionTabIcon}>⚡</Text>
              <Text style={[styles.actionTabLabel, { color: activeTab === 'prepay' ? '#FFFFFF' : colors.text }]}>Prepay</Text>
              {activeTab === 'prepay' && <Text style={[styles.actionTabCount, { color: 'rgba(255,255,255,0.7)' }]}>₹{outstandingBalance.toLocaleString('en-IN')}</Text>}
            </Pressable>
          </View>

          {/* ── Make Payment Form ── */}
          {activeTab === 'pay' && (
            <View style={[styles.formCard, { backgroundColor: colors.surfaceElevated, borderRadius: radius.lg, marginTop: spacing.md }]}>
              {/* ── Header ── */}
              <View style={[styles.formHeader, { borderBottomColor: colors.border }]}>
                <View style={[styles.formHeaderIcon, { backgroundColor: headerBg + '15' }]}>
                  <Text style={styles.formHeaderIconText}>💳</Text>
                </View>
                <View>
                  <Text style={[styles.formHeaderTitle, { color: colors.text }]}>Make a Payment</Text>
                  <Text style={[styles.formHeaderSub, { color: colors.textSecondary }]}>Pay your upcoming EMI dues</Text>
                </View>
              </View>

              {/* ── Select EMI ── */}
              <View style={styles.formSection}>
                <View style={styles.formSectionHeader}>
                  <Text style={[styles.formSectionTitle, { color: colors.text }]}>Select EMI</Text>
                  <Text style={[styles.formSectionBadge, { backgroundColor: headerBg + '15', color: headerBg }]}>{upcomingEmis.length} upcoming</Text>
                </View>
                <View style={styles.emiGrid}>
                  {upcomingEmis.map(item => {
                    const selected = selectedMonth === item.month;
                    return (
                      <Pressable
                        key={item.month}
                        onPress={() => { setSelectedMonth(item.month); setPayAmount(String(item.emi)); }}
                        style={({ pressed }) => [
                          styles.emiCard,
                          {
                            backgroundColor: selected ? headerBg : colors.surface,
                            borderColor: selected ? headerBg : colors.border,
                            borderRadius: radius.md,
                            opacity: pressed ? 0.85 : 1,
                          },
                        ]}
                      >
                        {selected && (
                          <View style={styles.emiCardTick}>
                            <Text style={styles.emiCardTickText}>✓</Text>
                          </View>
                        )}
                        <Text style={[styles.emiCardMonth, { color: selected ? 'rgba(255,255,255,0.7)' : colors.textSecondary }]}>
                          {item.date.split(' ')[0]} {item.date.split(' ')[1]}
                        </Text>
                        <Text style={[styles.emiCardAmount, { color: selected ? '#FFFFFF' : colors.text }]}>
                          ₹{item.emi.toLocaleString('en-IN')}
                        </Text>
                        <Text style={[styles.emiCardDate, { color: selected ? 'rgba(255,255,255,0.6)' : colors.textSecondary }]}>
                          {item.date.split(' ')[2]}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* ── Amount ── */}
              <View style={styles.formSection}>
                <Text style={[styles.formSectionTitle, { color: colors.text }]}>Amount</Text>
                <View style={[styles.amountInputWrapper, { backgroundColor: colors.surface, borderColor: selectedMonth ? headerBg + '40' : colors.border, borderRadius: radius.md }]}>
                  <Text style={[styles.amountPrefix, { color: colors.textSecondary }]}>₹</Text>
                  <TextInput
                    style={[styles.amountInput, { color: colors.text }]}
                    placeholder="0"
                    placeholderTextColor={colors.textSecondary}
                    value={payAmount}
                    onChangeText={setPayAmount}
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              {/* ── Payment Mode ── */}
              <View style={styles.formSection}>
                <Text style={[styles.formSectionTitle, { color: colors.text }]}>Payment Method</Text>
                <View style={styles.modeGrid}>
                  {PAYMENT_MODES.map(mode => {
                    const selected = payMode === mode.id;
                    return (
                      <Pressable
                        key={mode.id}
                        onPress={() => setPayMode(mode.id)}
                        style={({ pressed }) => [
                          styles.modeCard,
                          {
                            backgroundColor: selected ? headerBg : colors.surface,
                            borderColor: selected ? headerBg : colors.border,
                            borderRadius: radius.md,
                            opacity: pressed ? 0.85 : 1,
                          },
                        ]}
                       >
                        {selected && (
                          <View style={styles.modeCardTick}>
                            <Text style={styles.modeCardTickText}>✓</Text>
                          </View>
                        )}
                        <Text style={styles.modeCardIcon}>{mode.icon}</Text>
                        <Text style={[styles.modeCardLabel, { color: selected ? '#FFFFFF' : colors.text }]}>{mode.label}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* ── Submit ── */}
              <Pressable
                onPress={handlePaySubmit}
                style={({ pressed }) => [
                  styles.payBtn,
                  { backgroundColor: headerBg, borderRadius: radius.md, opacity: pressed ? 0.85 : 1 },
                ]}
              >
                <Text style={styles.payBtnText}>Pay ₹{payAmount ? Number(payAmount).toLocaleString('en-IN') : '0'}</Text>
                <Text style={styles.payBtnArrow}>→</Text>
              </Pressable>
            </View>
          )}

          {/* ── Prepay / Foreclose Form ── */}
          {activeTab === 'prepay' && (
            <View style={[styles.formCard, { backgroundColor: colors.surfaceElevated, borderRadius: radius.lg, marginTop: spacing.md }]}>
              {/* ── Header ── */}
              <View style={[styles.formHeader, { borderBottomColor: colors.border }]}>
                <View style={[styles.formHeaderIcon, { backgroundColor: '#8B5CF615' }]}>
                  <Text style={styles.formHeaderIconText}>⚡</Text>
                </View>
                <View>
                  <Text style={[styles.formHeaderTitle, { color: colors.text }]}>Prepay or Foreclose</Text>
                  <Text style={[styles.formHeaderSub, { color: colors.textSecondary }]}>Reduce your loan burden</Text>
                </View>
              </View>

              {/* ── Outstanding Banner ── */}
              <View style={[styles.outstandingBanner, { backgroundColor: '#8B5CF610', borderRadius: radius.md }]}>
                <Text style={[styles.outstandingLabel, { color: colors.textSecondary }]}>Outstanding Balance</Text>
                <Text style={[styles.outstandingValue, { color: '#8B5CF6' }]}>₹{outstandingBalance.toLocaleString('en-IN')}</Text>
                <View style={[styles.outstandingDivider, { backgroundColor: '#8B5CF620' }]} />
                <View style={styles.outstandingRow}>
                  <View style={styles.outstandingStat}>
                    <Text style={[styles.outstandingStatLabel, { color: colors.textSecondary }]}>Paid EMIs</Text>
                    <Text style={[styles.outstandingStatValue, { color: '#22C55E' }]}>{paidCount}</Text>
                  </View>
                  <View style={[styles.outstandingStatDivider, { backgroundColor: '#8B5CF620' }]} />
                  <View style={styles.outstandingStat}>
                    <Text style={[styles.outstandingStatLabel, { color: colors.textSecondary }]}>Remaining</Text>
                    <Text style={[styles.outstandingStatValue, { color: '#F59E0B' }]}>{SCHEDULE.length - paidCount}</Text>
                  </View>
                </View>
              </View>

              {/* ── Type Selection ── */}
              <View style={styles.formSection}>
                <Text style={[styles.formSectionTitle, { color: colors.text }]}>Choose Action</Text>
                <View style={styles.typeGrid}>
                  {PREPAY_TYPES.map(t => {
                    const selected = prepayType === t.id;
                    const accent = t.id === 'prepay' ? '#F59E0B' : '#22C55E';
                    return (
                      <Pressable
                        key={t.id}
                        onPress={() => setPrepayType(t.id)}
                        style={({ pressed }) => [
                          styles.typeCard,
                          {
                            backgroundColor: selected ? accent + '15' : colors.surface,
                            borderColor: selected ? accent : colors.border,
                            borderRadius: radius.md,
                            opacity: pressed ? 0.85 : 1,
                          },
                        ]}
                      >
                        <Text style={styles.typeCardIcon}>{t.icon}</Text>
                        <Text style={[styles.typeCardLabel, { color: selected ? accent : colors.text }]}>{t.label}</Text>
                        <Text style={[styles.typeCardDesc, { color: colors.textSecondary }]}>
                          {t.id === 'prepay' ? 'Pay extra toward principal' : 'Close loan in full'}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* ── Amount ── */}
              <View style={styles.formSection}>
                <View style={styles.formSectionHeader}>
                  <Text style={[styles.formSectionTitle, { color: colors.text }]}>Amount</Text>
                  {prepayType === 'foreclose' && (
                    <Pressable onPress={() => setPrepayAmount(String(outstandingBalance))}>
                      <Text style={[styles.fillMaxLink, { color: '#8B5CF6' }]}>Pay full amount</Text>
                    </Pressable>
                  )}
                </View>
                <View style={[styles.amountInputWrapper, { backgroundColor: colors.surface, borderColor: prepayAmount ? '#8B5CF640' : colors.border, borderRadius: radius.md }]}>
                  <Text style={[styles.amountPrefix, { color: colors.textSecondary }]}>₹</Text>
                  <TextInput
                    style={[styles.amountInput, { color: colors.text }]}
                    placeholder="0"
                    placeholderTextColor={colors.textSecondary}
                    value={prepayAmount}
                    onChangeText={setPrepayAmount}
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              {/* ── Payment Mode ── */}
              <View style={styles.formSection}>
                <Text style={[styles.formSectionTitle, { color: colors.text }]}>Payment Method</Text>
                <View style={styles.modeGrid}>
                  {PAYMENT_MODES.map(mode => {
                    const selected = prepayMode === mode.id;
                    return (
                      <Pressable
                        key={mode.id}
                        onPress={() => setPrepayMode(mode.id)}
                        style={({ pressed }) => [
                          styles.modeCard,
                          {
                            backgroundColor: selected ? '#8B5CF6' : colors.surface,
                            borderColor: selected ? '#8B5CF6' : colors.border,
                            borderRadius: radius.md,
                            opacity: pressed ? 0.85 : 1,
                          },
                        ]}
                       >
                        {selected && (
                          <View style={styles.modeCardTick}>
                            <Text style={styles.modeCardTickText}>✓</Text>
                          </View>
                        )}
                        <Text style={styles.modeCardIcon}>{mode.icon}</Text>
                        <Text style={[styles.modeCardLabel, { color: selected ? '#FFFFFF' : colors.text }]}>{mode.label}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* ── Submit ── */}
              <Pressable
                onPress={handlePrepaySubmit}
                style={({ pressed }) => [
                  styles.payBtn,
                  { backgroundColor: '#8B5CF6', borderRadius: radius.md, opacity: pressed ? 0.85 : 1 },
                ]}
              >
                <Text style={styles.payBtnText}>
                  {prepayType === 'foreclose' ? 'Foreclose Loan' : 'Submit Prepayment'}
                </Text>
                <Text style={styles.payBtnArrow}>→</Text>
              </Pressable>
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingTop: 56,
    paddingBottom: 28,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  decor1: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  decor2: {
    position: 'absolute',
    bottom: 10,
    left: -40,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnText: { color: '#FFFFFF', fontSize: 20, fontWeight: '600' },
  topTitle: { color: 'rgba(255,255,255,0.8)', fontSize: 16, fontWeight: '600' },
  headerBody: { alignItems: 'center', marginTop: 20 },
  headerIcon: { fontSize: 36 },
  headerLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
  },
  headerSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },
  flex: { flex: 1 },
  content: { paddingBottom: 20 },
  summaryRow: { flexDirection: 'row', gap: 12 },
  summaryCard: { flex: 1, borderWidth: 1, padding: 16, alignItems: 'center' },
  summaryValue: { fontSize: 20, fontWeight: '800' },
  summaryLabel: { fontSize: 11, fontWeight: '500', marginTop: 4 },
  progressSection: { borderWidth: 1, marginTop: 12 },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitle: { fontSize: 14, fontWeight: '700' },
  progressPercent: { fontSize: 16, fontWeight: '800' },
  progressTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressFooterText: { fontSize: 11, fontWeight: '500' },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  scheduleCardOuter: {
    borderLeftWidth: 4,
  },
  scheduleCard: { borderWidth: 1 },
  scheduleTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  scheduleMonthBlock: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  scheduleMonthBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleMonthNum: { fontSize: 14, fontWeight: '800' },
  scheduleDate: { fontSize: 14, fontWeight: '700' },
  scheduleEmiLabel: { fontSize: 11, fontWeight: '500', marginTop: 2 },
  scheduleStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  scheduleStatusDot: { width: 6, height: 6, borderRadius: 3 },
  scheduleStatusText: { fontSize: 11, fontWeight: '700' },
  scheduleDivider: { height: 1, marginHorizontal: 14 },
  scheduleBottomRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  scheduleAmountBlock: { flex: 1, alignItems: 'center' },
  scheduleAmountVerticalDivider: { width: 1, marginVertical: 2 },
  scheduleAmountLabel: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  scheduleAmountValue: { fontSize: 13, fontWeight: '700', marginTop: 3 },
  scheduleAmountValueBold: { fontSize: 14, fontWeight: '800', marginTop: 3 },
  scheduleBalanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  scheduleBalanceLabel: { fontSize: 11, fontWeight: '500' },
  scheduleBalanceValue: { fontSize: 13, fontWeight: '700' },
  tabBar: { flexDirection: 'row', borderWidth: 1, padding: 4 },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: { fontSize: 13, fontWeight: '700' },
  actionTabs: { flexDirection: 'row', gap: 12 },
  actionTab: { flex: 1, borderWidth: 1, padding: 16, alignItems: 'center' },
  actionTabIcon: { fontSize: 24, marginBottom: 6 },
  actionTabLabel: { fontSize: 15, fontWeight: '700' },
  actionTabCount: { fontSize: 11, fontWeight: '500', marginTop: 3 },
  formCard: { borderWidth: 1, overflow: 'hidden' },
  formHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, borderBottomWidth: 1 },
  formHeaderIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  formHeaderIconText: { fontSize: 20 },
  formHeaderTitle: { fontSize: 16, fontWeight: '700' },
  formHeaderSub: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  formSection: { padding: 18, paddingBottom: 0 },
  formSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  formSectionTitle: { fontSize: 14, fontWeight: '700' },
  formSectionBadge: { fontSize: 11, fontWeight: '600', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  emiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  emiCard: { borderWidth: 1, paddingVertical: 12, paddingHorizontal: 0, flex: 1, minWidth: '30%', alignItems: 'center' },
  emiCardTick: { position: 'absolute', top: 5, right: 5, width: 16, height: 16, borderRadius: 8, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  emiCardTickText: { fontSize: 9, fontWeight: '800', color: '#1E293B' },
  emiCardMonth: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase' },
  emiCardAmount: { fontSize: 15, fontWeight: '800', marginTop: 4 },
  emiCardDate: { fontSize: 10, fontWeight: '500', marginTop: 2 },
  amountInputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, height: 52, paddingHorizontal: 14 },
  amountPrefix: { fontSize: 18, fontWeight: '700', marginRight: 8 },
  amountInput: { flex: 1, fontSize: 18, fontWeight: '700', padding: 0 },
  modeGrid: { flexDirection: 'row', gap: 10 },
  modeCard: { flex: 1, borderWidth: 1, paddingVertical: 14, alignItems: 'center', gap: 6 },
  modeCardTick: { position: 'absolute', top: 5, right: 5, width: 16, height: 16, borderRadius: 8, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  modeCardTickText: { fontSize: 9, fontWeight: '800', color: '#1E293B' },
  modeCardIcon: { fontSize: 22 },
  modeCardLabel: { fontSize: 12, fontWeight: '700' },
  payBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 18, paddingVertical: 16, gap: 8 },
  payBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  payBtnArrow: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  typeGrid: { flexDirection: 'row', gap: 10 },
  typeCard: { flex: 1, borderWidth: 1.5, paddingVertical: 16, alignItems: 'center' },
  typeCardIcon: { fontSize: 24, marginBottom: 6 },
  typeCardLabel: { fontSize: 14, fontWeight: '700' },
  typeCardDesc: { fontSize: 10, fontWeight: '500', marginTop: 3, textAlign: 'center' },
  outstandingBanner: { margin: 18, padding: 18, alignItems: 'center' },
  outstandingLabel: { fontSize: 12, fontWeight: '500' },
  outstandingValue: { fontSize: 28, fontWeight: '800', marginTop: 4 },
  outstandingDivider: { height: 1, width: '60%', marginVertical: 14 },
  outstandingRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  outstandingStat: { alignItems: 'center' },
  outstandingStatLabel: { fontSize: 11, fontWeight: '500' },
  outstandingStatValue: { fontSize: 18, fontWeight: '800', marginTop: 2 },
  outstandingStatDivider: { width: 1, height: 28 },
  fillMaxLink: { fontSize: 12, fontWeight: '700' },
  submitBtn: { marginTop: 20, paddingVertical: 16, alignItems: 'center' },
  submitBtnText: { fontSize: 16, fontWeight: '700' },
});
