import React from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTheme } from '../../context/ThemeContext';
import type { RootStackParamList } from '../../../App';

import { createStyles } from './styles';
import SectionCard from './_components/SectionCard';
import DetailItem from './_components/DetailItem';
import BreakupRow from './_components/BreakupRow';
import DuoStatPanel from './_components/DuoStatPanel';
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
  { icon: '💰', label: 'Loan Amount', value: formatINR(LOAN.principal) },
  { icon: '📈', label: 'Interest Rate', value: `${LOAN.interestRate}% p.a.` },
  { icon: '⏳', label: 'Tenure', value: `${LOAN.tenureMonths} Months` },
  { icon: '📅', label: 'Start Date', value: LOAN.startDate },
  { icon: '🔁', label: 'Frequency', value: LOAN.frequency },
  { icon: '🏦', label: 'Loan Type', value: LOAN.type },
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
        <View style={themed.heroRow}>
          <View style={themed.heroLeft}>
            <Text style={themed.heroLabel}>Outstanding Balance</Text>
            <Text style={themed.heroAmount}>
              {formatINR(PROGRESS.outstanding)}
            </Text>
            <View style={themed.heroBadge}>
              <Text style={themed.heroBadgeText}>
                📊 {PROGRESS.paidCount} of {LOAN.tenureMonths} EMIs paid
              </Text>
            </View>
          </View>
          <View style={themed.heroIconWrap}>
            <Text style={themed.heroIcon}>📊</Text>
          </View>
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
          {LOAN_OVERVIEW.map((item, index) => (
            <DetailItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              value={item.value}
              isLast={index === LOAN_OVERVIEW.length - 1}
            />
          ))}
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
          <View style={themed.breakupDividerSpaced} />
          <View style={themed.totalRow}>
            <Text style={themed.totalLabel}>Total EMI</Text>
            <Text style={themed.totalValue}>{formatINR(NEXT_EMI.amount)}</Text>
          </View>

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
          <View style={themed.progressTopRow}>
            <Text style={themed.progressLabel}>EMIs Paid</Text>
            <Text style={themed.progressValue}>
              {PROGRESS.paidCount} / {LOAN.tenureMonths}
            </Text>
          </View>
          <View style={themed.segments}>
            {Array.from({ length: LOAN.tenureMonths }).map((_, index) => (
              <View
                key={index}
                style={[
                  themed.segment,
                  index < PROGRESS.paidCount && themed.segmentPaid,
                  index === PROGRESS.paidCount && themed.segmentCurrent,
                ]}
              />
            ))}
          </View>
          <View style={themed.progressRow}>
            <View style={themed.captionItem}>
              <View style={themed.captionDot} />
              <Text style={themed.progressText}>
                {paidShare.toFixed(1)}% completed
              </Text>
            </View>
            <View style={themed.captionItem}>
              <View style={themed.captionDotCurrent} />
              <Text style={themed.progressText}>
                Next EMI #{NEXT_EMI.number} • {NEXT_EMI.dueDate}
              </Text>
            </View>
          </View>

          <DuoStatPanel
            paidLabel="Total Paid"
            paidValue={formatINR(PROGRESS.totalPaid)}
            paidSub={`${PROGRESS.paidCount} EMIs cleared`}
            dueLabel="Outstanding"
            dueValue={formatINR(PROGRESS.outstanding)}
            dueSub={`${LOAN.tenureMonths - PROGRESS.paidCount} EMIs remaining`}
          />
        </SectionCard>
      </ScrollView>
    </View>
  );
}
