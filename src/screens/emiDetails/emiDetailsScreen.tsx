import React from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTheme } from '../../context/ThemeContext';
import type { RootStackParamList } from '../../../App';

import { createStyles } from './styles';
import SectionCard from './_components/SectionCard';
import DetailItem from './_components/DetailItem';
import BreakupRow from './_components/BreakupRow';
import StatBox from './_components/StatBox';
import NextEmiCard from './_components/NextEmiCard';

type Props = NativeStackScreenProps<RootStackParamList, 'EmiDetails'>;

/**
 * Mock data — consistent with the Repayment Schedule screen.
 */
const LOAN = {
  accountNo: 'LA-2024-88321',
  type: 'Personal Loan',
  principal: 500000,
  interestRate: 9.0,
  tenureMonths: 48,
  startDate: '15 Sep 2026',
  frequency: 'Monthly',
};

const NEXT_EMI = {
  number: 7,
  amount: 12500,
  principal: 8940,
  interest: 3560,
  dueDate: '15 Mar 2027',
  status: 'Upcoming',
};

const PROGRESS = {
  paidCount: 6,
  totalPaid: 75000,
  outstanding: 447028,
};

const formatINR = (value: number) => `₹${value.toLocaleString('en-IN')}`;

const LOAN_OVERVIEW = [
  { label: 'Loan Amount', value: formatINR(LOAN.principal) },
  { label: 'Interest Rate', value: `${LOAN.interestRate}% p.a.` },
  { label: 'Tenure', value: `${LOAN.tenureMonths} Months` },
  { label: 'Start Date', value: LOAN.startDate },
  { label: 'Frequency', value: LOAN.frequency },
  { label: 'Loan Type', value: LOAN.type },
];

export default function EmiDetailsScreen({ navigation }: Props) {
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

  const paidShare = (PROGRESS.paidCount / LOAN.tenureMonths) * 100;
  const principalShare = (NEXT_EMI.principal / NEXT_EMI.amount) * 100;
  const interestShare = 100 - principalShare;

  const handlePayNow = () => {
    Alert.alert(
      'Pay EMI',
      `Pay ${formatINR(NEXT_EMI.amount)} for EMI #${NEXT_EMI.number} due ${NEXT_EMI.dueDate}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Proceed',
          onPress: () => navigation.navigate('RepaymentSchedule'),
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
          <Text style={themed.topTitle}>EMI Details</Text>
          <View style={themed.topSpacer} />
        </View>
        <View style={themed.headerBody}>
          <Text style={themed.headerIcon}>📊</Text>
          <Text style={themed.headerLabel}>Complete EMI Breakup</Text>
          <Text
            style={themed.headerSub}
          >{`${LOAN.type} • ${LOAN.accountNo}`}</Text>
        </View>
      </View>

      <ScrollView
        style={themed.flex}
        contentContainerStyle={themed.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Next EMI */}
        <NextEmiCard
          number={NEXT_EMI.number}
          amount={formatINR(NEXT_EMI.amount)}
          dueDate={NEXT_EMI.dueDate}
          status={NEXT_EMI.status}
          onPay={handlePayNow}
        />

        {/* Loan overview */}
        <SectionCard title="Loan Overview">
          <View style={themed.detailGrid}>
            {LOAN_OVERVIEW.map(item => (
              <DetailItem
                key={item.label}
                label={item.label}
                value={item.value}
              />
            ))}
          </View>
        </SectionCard>

        {/* EMI breakup */}
        <SectionCard title="EMI Breakup">
          <BreakupRow
            label="Principal Component"
            value={formatINR(NEXT_EMI.principal)}
          />
          <BreakupRow
            label="Interest Component"
            value={formatINR(NEXT_EMI.interest)}
          />
          <View style={[themed.breakupDivider, { marginVertical: 8 }]} />
          <BreakupRow
            label="Total EMI"
            value={formatINR(NEXT_EMI.amount)}
            highlight
          />

          <View style={themed.shareTrack}>
            <View
              style={[themed.sharePrincipal, { width: `${principalShare}%` }]}
            />
            <View
              style={[themed.shareInterest, { width: `${interestShare}%` }]}
            />
          </View>
          <View style={themed.shareLegend}>
            <View style={themed.legendItem}>
              <View style={themed.legendDot} />
              <Text style={themed.legendText}>
                Principal {principalShare.toFixed(1)}%
              </Text>
            </View>
            <View style={themed.legendItem}>
              <View style={themed.legendDotInterest} />
              <Text style={themed.legendText}>
                Interest {interestShare.toFixed(1)}%
              </Text>
            </View>
          </View>
        </SectionCard>

        {/* Payment progress */}
        <SectionCard title="Payment Progress">
          <BreakupRow
            label="EMIs Paid"
            value={`${PROGRESS.paidCount} of ${LOAN.tenureMonths}`}
          />
          <View style={themed.progressBarTrack}>
            <View
              style={[themed.progressBarFill, { width: `${paidShare}%` }]}
            />
          </View>
          <View style={themed.progressRow}>
            <Text style={themed.progressText}>
              {paidShare.toFixed(1)}% completed
            </Text>
            <Text style={themed.progressText}>
              {LOAN.tenureMonths - PROGRESS.paidCount} EMIs left
            </Text>
          </View>

          <View style={themed.statRow}>
            <StatBox label="Total Paid" value={formatINR(PROGRESS.totalPaid)} />
            <StatBox
              label="Outstanding"
              value={formatINR(PROGRESS.outstanding)}
            />
          </View>
        </SectionCard>
      </ScrollView>
    </View>
  );
}
