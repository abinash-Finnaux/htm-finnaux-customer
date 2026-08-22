import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTheme } from '../../context/ThemeContext';
import type { RootStackParamList } from '../../../App';

import GlobalInputText from '../../components/inputTexts/GlobalInputText';
import PaymentMethodPicker from './_components/PaymentMethodPicker';
import { createStyles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'EmiDeposit'>;

type DueEmi = {
  month: number;
  date: string;
  amount: number;
};

type LoanAccount = {
  id: string;
  type: string;
  outstanding: number;
  emi: number;
  dueDate: string;
};

const LOANS: LoanAccount[] = [
  {
    id: 'LA-2024-88321',
    type: 'Personal Loan',
    outstanding: 447028,
    emi: 12500,
    dueDate: '15 Mar 2027',
  },
  {
    id: 'LA-2024-77410',
    type: 'Home Loan',
    outstanding: 2850000,
    emi: 28000,
    dueDate: '01 Apr 2027',
  },
];

const UPCOMING_EMIS: DueEmi[] = [
  { month: 7, date: '15 Mar', amount: 12500 },
  { month: 8, date: '15 Apr', amount: 12500 },
  { month: 9, date: '15 May', amount: 12500 },
];

const PAYMENT_MODES = [
  { id: 'upi', label: 'UPI', icon: '📱' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
  { id: 'card', label: 'Card', icon: '💳' },
];

const CONVENIENCE_FEE = 0;

const formatINR = (value: number) => `₹${value.toLocaleString('en-IN')}`;

export default function EmiDepositScreen({ navigation }: Props) {
  const { theme, isDark } = useTheme();
  const { colors, spacing } = theme;

  const headerBg = isDark ? '#1E293B' : colors.primary;
  const decorBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)';

  const themed = createStyles(
    colors,
    theme.spacing,
    theme.radius,
    headerBg,
    decorBg,
  );

  const [loanId, setLoanId] = useState(LOANS[0].id);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(
    UPCOMING_EMIS[0].month,
  );
  const [customAmount, setCustomAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [mode, setMode] = useState(PAYMENT_MODES[0].id);

  const loan = useMemo(
    () => LOANS.find(item => item.id === loanId) ?? LOANS[0],
    [loanId],
  );

  const selectedEmi = UPCOMING_EMIS.find(item => item.month === selectedMonth);

  /**
   * Custom amount overrides the selected EMI.
   */
  const amount = customAmount ? Number(customAmount) : selectedEmi?.amount ?? 0;

  const canPay = amount > 0 && mode !== '';

  const handleLoanSelect = (id: string) => {
    setLoanId(id);
    setSelectedMonth(null);
    setCustomAmount('');
    setAmountError('');
  };

  const handleAmountChange = (text: string) => {
    setCustomAmount(text.replace(/[^0-9]/g, ''));
    setAmountError('');
  };

  const validateAndPay = () => {
    if (amount <= 0) {
      setAmountError('Enter an amount or select an EMI');
      return;
    }

    if (amount > loan.outstanding) {
      setAmountError('Amount exceeds outstanding balance');
      return;
    }

    Alert.alert(
      'Confirm Payment',
      `Pay ${formatINR(amount)} for ${loan.type} (${loan.id}) via ${
        PAYMENT_MODES.find(m => m.id === mode)?.label
      }?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay Now',
          onPress: () =>
            Alert.alert(
              'Payment Successful',
              `${formatINR(amount)} paid towards ${loan.type}.`,
              [
                {
                  text: 'View History',
                  onPress: () => navigation.navigate('PaymentHistory'),
                },
                { text: 'Done', style: 'default' },
              ],
            ),
        },
      ],
    );
  };

  const selectedModeLabel =
    PAYMENT_MODES.find(m => m.id === mode)?.label ?? '—';

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
          <Text style={themed.topTitle}>EMI Deposit</Text>
          <View style={themed.topSpacer} />
        </View>
        <View style={themed.headerBody}>
          <Text style={themed.headerIcon}>💳</Text>
          <Text style={themed.headerLabel}>Make a Payment</Text>
          <Text style={themed.headerSub}>
            Pay your EMI dues quickly and securely
          </Text>
        </View>
      </View>

      <ScrollView
        style={themed.flex}
        contentContainerStyle={themed.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Loan account */}
        <Text style={themed.sectionLabel}>Select Loan Account</Text>
        <View style={{ gap: spacing.sm }}>
          {LOANS.map(item => {
            const selected = item.id === loanId;
            return (
              <Pressable
                key={item.id}
                onPress={() => handleLoanSelect(item.id)}
                style={({ pressed }) => [
                  themed.loanRow,
                  {
                    borderColor: selected ? colors.primary : colors.border,
                    backgroundColor: selected
                      ? colors.primary + '08'
                      : 'transparent',
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <View style={themed.loanIconCircle}>
                  <Text style={themed.loanIconText}>🏦</Text>
                </View>
                <View style={themed.loanMiddle}>
                  <Text style={themed.loanType}>{item.type}</Text>
                  <Text style={themed.loanId}>{item.id}</Text>
                </View>
                <View style={themed.loanOutWrap}>
                  <Text style={themed.loanOutLabel}>Outstanding</Text>
                  <Text style={themed.loanOutValue}>
                    {formatINR(item.outstanding)}
                  </Text>
                </View>
                <View
                  style={[
                    themed.radio,
                    selected && { borderColor: colors.primary },
                  ]}
                >
                  {selected && <View style={themed.radioDot} />}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Upcoming EMIs */}
        <Text style={themed.sectionLabel}>Select EMI</Text>
        <View style={themed.dueGrid}>
          {UPCOMING_EMIS.map(emi => {
            const selected = selectedMonth === emi.month;
            return (
              <Pressable
                key={emi.month}
                onPress={() => {
                  setSelectedMonth(selected ? null : emi.month);
                  setCustomAmount('');
                  setAmountError('');
                }}
                style={({ pressed }) => [
                  themed.dueChip,
                  {
                    backgroundColor: selected
                      ? colors.primary
                      : colors.surfaceElevated,
                    borderColor: selected ? colors.primary : colors.border,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                {selected && (
                  <View
                    style={[themed.dueChipTick, { backgroundColor: '#FFFFFF' }]}
                  >
                    <Text
                      style={[themed.dueChipTickText, { color: '#1E293B' }]}
                    >
                      ✓
                    </Text>
                  </View>
                )}
                <Text
                  style={[
                    themed.dueChipMonth,
                    {
                      color: selected
                        ? 'rgba(255,255,255,0.7)'
                        : colors.textSecondary,
                    },
                  ]}
                >
                  {emi.date}
                </Text>
                <Text
                  style={[
                    themed.dueChipAmount,
                    { color: selected ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {formatINR(emi.amount)}
                </Text>
                <Text
                  style={[
                    themed.dueChipYear,
                    {
                      color: selected
                        ? 'rgba(255,255,255,0.6)'
                        : colors.textSecondary,
                    },
                  ]}
                >
                  {loan.dueDate.split(' ')[2]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Custom amount */}
        <GlobalInputText
          label="Or Enter Custom Amount"
          placeholder="Leave empty to pay selected EMI"
          value={customAmount}
          onChangeText={handleAmountChange}
          keyboardType="number-pad"
          error={amountError}
        />

        {/* Payment method */}
        <Text style={themed.sectionLabel}>Payment Method</Text>
        <PaymentMethodPicker
          modes={PAYMENT_MODES}
          value={mode}
          onChange={setMode}
        />

        {/* Summary */}
        <View style={themed.summaryCard}>
          <View style={themed.summaryRow}>
            <Text style={themed.summaryLabel}>{loan.type}</Text>
            <Text style={themed.summaryValue}>{loan.id}</Text>
          </View>
          <View style={themed.summaryRow}>
            <Text style={themed.summaryLabel}>EMI Amount</Text>
            <Text style={themed.summaryValue}>{formatINR(amount)}</Text>
          </View>
          <View style={themed.summaryRow}>
            <Text style={themed.summaryLabel}>Convenience Fee</Text>
            <Text style={themed.summaryValue}>
              {formatINR(CONVENIENCE_FEE)}
            </Text>
          </View>
          <View style={themed.summaryRow}>
            <Text style={themed.summaryLabel}>Payment Method</Text>
            <Text style={themed.summaryValue}>{selectedModeLabel}</Text>
          </View>
          <View style={themed.summaryDivider} />
          <View style={themed.summaryRow}>
            <Text style={themed.footerTotalLabel}>Total Payable</Text>
            <Text style={themed.summaryValue}>
              {formatINR(amount + CONVENIENCE_FEE)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Pinned pay bar */}
      <View style={themed.footer}>
        <View style={themed.footerTotalWrap}>
          <Text style={themed.footerTotalLabel}>Total Payable</Text>
          <Text style={themed.footerTotalValue}>
            {formatINR(amount + CONVENIENCE_FEE)}
          </Text>
        </View>
        <Pressable
          onPress={validateAndPay}
          disabled={!canPay}
          style={({ pressed }) => [
            themed.payBtn,
            !canPay && themed.payBtnDisabled,
            canPay && pressed && themed.payBtnPressed,
          ]}
        >
          <Text style={themed.payBtnText}>Pay Now →</Text>
        </Pressable>
      </View>
    </View>
  );
}
