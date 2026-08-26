import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTheme } from '../../context/ThemeContext';
import type { RootStackParamList } from '../../../App';

import DownloadButton from '../../components/buttons/DownloadButton';
import { createStyles } from './styles';
import LoanCard from './_components/LoanCard';
import { generateCloserPdf } from '../../utils/generatePdf';

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

const AFTER_PAYMENT_STEPS = [
  {
    title: 'Pay Closure Amount',
    desc: 'Complete the full payment before the quote validity ends.',
  },
  {
    title: 'NOC & Documents',
    desc: 'NOC and original documents are dispatched within 15 working days.',
  },
  {
    title: 'Loan Closed',
    desc: 'No further interest or charges apply after full payment.',
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
  const { colors } = theme;

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
  const totalClosure = loan.outstanding + loan.accruedInterest + foreclosureFee;

  const handleDownload = async () => {
    Alert.alert(
      'Download Statement',
      `Closure statement for ${loan.type} (${loan.id}) will be downloaded as PDF.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Download',
          onPress: async () => {
            await generateCloserPdf({
              loanType: loan.type,
              loanId: loan.id,
              outstanding: loan.outstanding,
              interestRate: loan.interestRate,
              accruedInterest: loan.accruedInterest,
              foreclosureRate: FORECLOSURE_RATE * 100,
              foreclosureFee,
              totalClosure,
              validTill: getValidTillDate(),
              asOfDate: getAsOfDate(),
            });
          },
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
        <View style={themed.heroRow}>
          <View style={themed.heroLeft}>
            <Text style={themed.heroLabel}>Total Closure Amount</Text>
            <Text style={themed.heroAmount}>{formatINR(totalClosure)}</Text>
            <View style={themed.heroBadge}>
              <Text style={themed.heroBadgeText}>
                ⏳ Valid till {getValidTillDate()}
              </Text>
            </View>
          </View>
          <View style={themed.heroIconWrap}>
            <Text style={themed.heroIcon}>📑</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={themed.flex}
        contentContainerStyle={themed.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={themed.sectionRow}>
          {/* <View style={themed.sectionBar} /> */}
          <Text style={themed.sectionTitle}>Select Loan Account</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={themed.loanScroller}
        >
          {LOANS.map(item => (
            <LoanCard
              key={item.id}
              type={item.type}
              id={item.id}
              outstanding={item.outstanding}
              selected={item.id === loanId}
              onPress={() => setLoanId(item.id)}
            />
          ))}
        </ScrollView>

        <View style={themed.sectionRow}>
          {/* <View style={themed.sectionBar} /> */}
          <Text style={themed.sectionTitle}>Closure Breakup</Text>
        </View>
        <View style={themed.breakupCard}>
          <View style={themed.breakupRow}>
            <Text style={themed.breakupLabel}>Principal Outstanding</Text>
            <Text style={themed.breakupValue}>
              {formatINR(loan.outstanding)}
            </Text>
          </View>
          <View style={themed.breakupDivider} />
          <View style={themed.breakupRow}>
            <View style={themed.breakupLabelWrap}>
              <Text style={themed.breakupLabel}>Interest Accrued</Text>
              <View style={themed.breakupChip}>
                <Text style={themed.breakupChipText}>
                  {loan.interestRate}% p.a.
                </Text>
              </View>
            </View>
            <Text style={themed.breakupValue}>
              {formatINR(loan.accruedInterest)}
            </Text>
          </View>
          <View style={themed.breakupDivider} />
          <View style={themed.breakupRow}>
            <View style={themed.breakupLabelWrap}>
              <Text style={themed.breakupLabel}>Foreclosure Charges</Text>
              <View style={themed.breakupChip}>
                <Text style={themed.breakupChipText}>
                  {FORECLOSURE_RATE * 100}%
                </Text>
              </View>
            </View>
            <Text style={themed.breakupValue}>{formatINR(foreclosureFee)}</Text>
          </View>
          <View style={themed.breakupDashDivider} />
          <View style={themed.breakupTotalRow}>
            <Text style={themed.totalLabel}>Total Closure Amount</Text>
            <Text style={themed.totalValue}>{formatINR(totalClosure)}</Text>
          </View>
        </View>

        <View style={themed.validityBanner}>
          <Text style={themed.validityIcon}>⏳</Text>
          <Text style={themed.validityText}>
            Quote as of {getAsOfDate()} is valid till {getValidTillDate()}.
            Amounts may change after this date due to daily interest accrual.
          </Text>
        </View>

        <View style={themed.sectionRow}>
          {/* <View style={themed.sectionBar} /> */}
          <Text style={themed.sectionTitle}>After Full Payment</Text>
        </View>
        <View style={themed.stepsCard}>
          {AFTER_PAYMENT_STEPS.map((step, index) => (
            <View key={step.title} style={themed.stepItem}>
              <View style={themed.stepNumCircle}>
                <Text style={themed.stepNumText}>{index + 1}</Text>
              </View>
              <View style={themed.stepContent}>
                <Text style={themed.stepTitle}>{step.title}</Text>
                <Text style={themed.stepDesc}>{step.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={themed.footer}>
        <View style={themed.footerLeft}>
          <Text style={themed.footerLabel}>Total Closure Amount</Text>
          <Text style={themed.footerAmount}>{formatINR(totalClosure)}</Text>
        </View>
        <DownloadButton onPress={handleDownload} />
      </View>
    </View>
  );
}
