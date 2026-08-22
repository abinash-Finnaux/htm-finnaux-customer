import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTheme } from '../../context/ThemeContext';
import type { RootStackParamList } from '../../../App';

import { createStyles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'CloserStatement'>;

type LoanAccount = {
  id: string;
  type: string;
  outstanding: number;
  interestRate: number;
  accruedInterest: number;
};

const FORECLOSURE_RATE = 0.02;

const LOANS: LoanAccount[] = [
  {
    id: 'LA-2024-88321',
    type: 'Personal Loan',
    outstanding: 447028,
    interestRate: 9.0,
    accruedInterest: 1237,
  },
  {
    id: 'LA-2024-77410',
    type: 'Home Loan',
    outstanding: 2850000,
    interestRate: 8.5,
    accruedInterest: 6694,
  },
];

const formatINR = (value: number) => `₹${value.toLocaleString('en-IN')}`;

const getAsOfDate = () =>
  new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const getValidTillDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export default function CloserStatementScreen({ navigation }: Props) {
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

  const loan = useMemo(
    () => LOANS.find(item => item.id === loanId) ?? LOANS[0],
    [loanId],
  );

  const foreclosureFee = Math.round(loan.outstanding * FORECLOSURE_RATE);
  const totalClosure =
    loan.outstanding + loan.accruedInterest + foreclosureFee;

  const handleDownload = () => {
    Alert.alert(
      'Download Statement',
      `Closure statement for ${loan.type} (${loan.id}) will be downloaded as PDF.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Download',
          onPress: () =>
            Alert.alert(
              'Statement Ready',
              `Closer statement generated successfully. Valid till ${getValidTillDate()}.`,
            ),
        },
      ],
    );
  };

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
          <Text style={themed.topTitle}>Closer Statement</Text>
          <View style={themed.topSpacer} />
        </View>
        <View style={themed.headerBody}>
          <Text style={themed.headerIcon}>📑</Text>
          <Text style={themed.headerLabel}>Loan Closure Quote</Text>
          <Text style={themed.headerSub}>
            Check the exact amount to close your loan early
          </Text>
        </View>
      </View>

      <ScrollView
        style={themed.flex}
        contentContainerStyle={themed.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Loan account */}
        <Text style={themed.sectionLabel}>Select Loan Account</Text>
        <View style={{ gap: spacing.sm }}>
          {LOANS.map(item => {
            const selected = item.id === loanId;
            return (
              <Pressable
                key={item.id}
                onPress={() => setLoanId(item.id)}
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

        {/* Closure quote */}
        <Text style={themed.sectionLabel}>Closure Breakup</Text>
        <View style={themed.quoteCard}>
          <View style={themed.quoteHeader}>
            <Text style={themed.quoteTitle}>{loan.type} Closure</Text>
            <View style={themed.asOfBadge}>
              <Text style={themed.asOfText}>As of {getAsOfDate()}</Text>
            </View>
          </View>

          <View style={themed.breakupRow}>
            <Text style={themed.breakupLabel}>Principal Outstanding</Text>
            <Text style={themed.breakupValue}>
              {formatINR(loan.outstanding)}
            </Text>
          </View>
          <View style={themed.breakupRow}>
            <Text style={themed.breakupLabel}>
              Interest Accrued ({loan.interestRate}% p.a.)
            </Text>
            <Text style={themed.breakupValue}>
              {formatINR(loan.accruedInterest)}
            </Text>
          </View>
          <View style={themed.breakupRow}>
            <Text style={themed.breakupLabel}>
              Foreclosure Charges ({FORECLOSURE_RATE * 100}%)
            </Text>
            <Text style={themed.breakupValue}>
              {formatINR(foreclosureFee)}
            </Text>
          </View>
          <View style={themed.divider} />
          <View style={themed.breakupRow}>
            <Text style={themed.totalLabel}>Total Closure Amount</Text>
            <Text style={themed.totalValue}>{formatINR(totalClosure)}</Text>
          </View>
        </View>

        {/* Validity */}
        <View style={themed.validityBanner}>
          <Text style={themed.validityIcon}>⏳</Text>
          <Text style={themed.validityText}>
            This quote is valid till {getValidTillDate()}. Amounts may change
            after this date due to daily interest accrual.
          </Text>
        </View>

        {/* NOC info */}
        <View style={themed.infoBanner}>
          <Text style={themed.infoIcon}>📄</Text>
          <Text style={themed.infoText}>
            After full payment, your NOC and original documents will be
            dispatched within 15 working days.
          </Text>
        </View>
      </ScrollView>

      {/* Pinned footer */}
      <View style={themed.footer}>
        <View style={themed.footerTotalWrap}>
          <Text style={themed.footerTotalLabel}>Total Closure Amount</Text>
          <Text style={themed.footerTotalValue}>
            {formatINR(totalClosure)}
          </Text>
          <Text style={themed.footerSub}>Valid till {getValidTillDate()}</Text>
        </View>
        <Pressable
          onPress={handleDownload}
          style={({ pressed }) => [
            themed.downloadBtn,
            pressed && themed.downloadBtnPressed,
          ]}
        >
          <Text style={themed.downloadBtnIcon}>⬇️</Text>
          <Text style={themed.downloadBtnText}>Download</Text>
        </Pressable>
      </View>
    </View>
  );
}
