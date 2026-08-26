import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTheme } from '../../context/ThemeContext';
import type { RootStackParamList } from '../../../App';

import DownloadButton from '../../components/buttons/DownloadButton';
import { createStyles } from './styles';
import TransactionRow, { type SoaEntry } from './_component/TransactionRow';
import PeriodChip from './_component/PeriodChip';
import { generateSoaPdf } from '../../utils/generatePdf';

type Props = NativeStackScreenProps<RootStackParamList, 'SOA'>;

type PeriodKey = '3M' | '6M' | '1Y' | 'ALL';

type LoanAccount = {
  id: string;
  type: string;
  icon: string;
  outstanding: number;
};

type SoaRecord = SoaEntry & { daysAgo: number };

const LOANS: LoanAccount[] = [
  {
    id: 'LA-2024-88321',
    type: 'Personal Loan',
    icon: '💼',
    outstanding: 286940,
  },
  {
    id: 'LA-2024-77410',
    type: 'Home Loan',
    icon: '🏠',
    outstanding: 2627840,
  },
];

const PERIODS: { key: PeriodKey; label: string; months?: number }[] = [
  { key: '3M', label: '3 Months', months: 3 },
  { key: '6M', label: '6 Months', months: 6 },
  { key: '1Y', label: '1 Year', months: 12 },
  { key: 'ALL', label: 'All' },
];

const PERSONAL_LOAN_ENTRIES: SoaRecord[] = [
  {
    daysAgo: 420,
    date: '',
    particulars: 'Loan Disbursement',
    type: 'debit',
    amount: 450000,
    balance: 450000,
  },
  {
    daysAgo: 400,
    date: '',
    particulars: 'Processing Fee',
    type: 'debit',
    amount: 6750,
    balance: 456750,
  },
  {
    daysAgo: 380,
    date: '',
    particulars: 'EMI Received',
    type: 'credit',
    amount: 14200,
    balance: 442550,
  },
  {
    daysAgo: 350,
    date: '',
    particulars: 'EMI Received',
    type: 'credit',
    amount: 14200,
    balance: 428350,
  },
  {
    daysAgo: 320,
    date: '',
    particulars: 'EMI Received',
    type: 'credit',
    amount: 14200,
    balance: 414150,
  },
  {
    daysAgo: 290,
    date: '',
    particulars: 'Late Payment Charges',
    type: 'debit',
    amount: 590,
    balance: 414740,
  },
  {
    daysAgo: 260,
    date: '',
    particulars: 'EMI Received',
    type: 'credit',
    amount: 14200,
    balance: 400540,
  },
  {
    daysAgo: 230,
    date: '',
    particulars: 'EMI Received',
    type: 'credit',
    amount: 14200,
    balance: 386340,
  },
  {
    daysAgo: 200,
    date: '',
    particulars: 'EMI Received',
    type: 'credit',
    amount: 14200,
    balance: 372140,
  },
  {
    daysAgo: 170,
    date: '',
    particulars: 'EMI Received',
    type: 'credit',
    amount: 14200,
    balance: 357940,
  },
  {
    daysAgo: 140,
    date: '',
    particulars: 'EMI Received',
    type: 'credit',
    amount: 14200,
    balance: 343740,
  },
  {
    daysAgo: 110,
    date: '',
    particulars: 'EMI Received',
    type: 'credit',
    amount: 14200,
    balance: 329540,
  },
  {
    daysAgo: 80,
    date: '',
    particulars: 'EMI Received',
    type: 'credit',
    amount: 14200,
    balance: 315340,
  },
  {
    daysAgo: 50,
    date: '',
    particulars: 'EMI Received',
    type: 'credit',
    amount: 14200,
    balance: 301140,
  },
  {
    daysAgo: 20,
    date: '',
    particulars: 'EMI Received',
    type: 'credit',
    amount: 14200,
    balance: 286940,
  },
];

const HOME_LOAN_ENTRIES: SoaRecord[] = [
  {
    daysAgo: 500,
    date: '',
    particulars: 'Loan Disbursement',
    type: 'debit',
    amount: 3000000,
    balance: 3000000,
  },
  {
    daysAgo: 460,
    date: '',
    particulars: 'EMI Received',
    type: 'credit',
    amount: 26500,
    balance: 2973500,
  },
  {
    daysAgo: 430,
    date: '',
    particulars: 'EMI Received',
    type: 'credit',
    amount: 26500,
    balance: 2947000,
  },
  {
    daysAgo: 400,
    date: '',
    particulars: 'EMI Received',
    type: 'credit',
    amount: 26500,
    balance: 2920500,
  },
  {
    daysAgo: 370,
    date: '',
    particulars: 'Interest Reversal',
    type: 'credit',
    amount: 1250,
    balance: 2919250,
  },
  {
    daysAgo: 340,
    date: '',
    particulars: 'EMI Received',
    type: 'credit',
    amount: 26500,
    balance: 2892750,
  },
  {
    daysAgo: 310,
    date: '',
    particulars: 'EMI Received',
    type: 'credit',
    amount: 26500,
    balance: 2866000,
  },
  {
    daysAgo: 280,
    date: '',
    particulars: 'EMI Received',
    type: 'credit',
    amount: 26500,
    balance: 2839250,
  },
  {
    daysAgo: 250,
    date: '',
    particulars: 'Cheque Bounce Charges',
    type: 'debit',
    amount: 590,
    balance: 2839840,
  },
  {
    daysAgo: 220,
    date: '',
    particulars: 'EMI Received',
    type: 'credit',
    amount: 26500,
    balance: 2813340,
  },
  {
    daysAgo: 190,
    date: '',
    particulars: 'EMI Received',
    type: 'credit',
    amount: 26500,
    balance: 2786840,
  },
  {
    daysAgo: 160,
    date: '',
    particulars: 'EMI Received',
    type: 'credit',
    amount: 26500,
    balance: 2760340,
  },
  {
    daysAgo: 130,
    date: '',
    particulars: 'EMI Received',
    type: 'credit',
    amount: 26500,
    balance: 2733840,
  },
  {
    daysAgo: 100,
    date: '',
    particulars: 'EMI Received',
    type: 'credit',
    amount: 26500,
    balance: 2707340,
  },
  {
    daysAgo: 70,
    date: '',
    particulars: 'EMI Received',
    type: 'credit',
    amount: 26500,
    balance: 2680840,
  },
  {
    daysAgo: 40,
    date: '',
    particulars: 'EMI Received',
    type: 'credit',
    amount: 26500,
    balance: 2654340,
  },
  {
    daysAgo: 10,
    date: '',
    particulars: 'EMI Received',
    type: 'credit',
    amount: 26500,
    balance: 2627840,
  },
];

const ENTRIES_BY_LOAN: Record<string, SoaRecord[]> = {
  'LA-2024-88321': PERSONAL_LOAN_ENTRIES,
  'LA-2024-77410': HOME_LOAN_ENTRIES,
};

const formatINR = (value: number) => `₹${value.toLocaleString('en-IN')}`;

const getDisplayDate = (daysBack: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysBack);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export default function SOAScreen({ navigation }: Props) {
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
  const [period, setPeriod] = useState<PeriodKey>('6M');

  const loan = useMemo(
    () => LOANS.find(item => item.id === loanId) ?? LOANS[0],
    [loanId],
  );

  const filteredEntries = useMemo(() => {
    const selected = PERIODS.find(item => item.key === period);
    const months = selected?.months;
    const cutoffDays = months ? months * 30 : Infinity;

    return (ENTRIES_BY_LOAN[loan.id] ?? [])
      .filter(entry => entry.daysAgo <= cutoffDays)
      .map(entry => ({ ...entry, date: getDisplayDate(entry.daysAgo) }))
      .sort((a, b) => b.daysAgo - a.daysAgo);
  }, [loan.id, period]);

  const summary = useMemo(() => {
    if (filteredEntries.length === 0) {
      return { opening: 0, totalDebit: 0, totalCredit: 0, closing: 0 };
    }

    const oldest = filteredEntries[filteredEntries.length - 1];
    const opening =
      oldest.type === 'debit'
        ? oldest.balance - oldest.amount
        : oldest.balance + oldest.amount;

    let totalDebit = 0;
    let totalCredit = 0;
    filteredEntries.forEach(entry => {
      if (entry.type === 'debit') {
        totalDebit += entry.amount;
      } else {
        totalCredit += entry.amount;
      }
    });

    return {
      opening,
      totalDebit,
      totalCredit,
      closing: filteredEntries[0].balance,
    };
  }, [filteredEntries]);

  const activePeriodLabel =
    PERIODS.find(item => item.key === period)?.label ?? 'All';

  const handleDownload = async () => {
    Alert.alert(
      'Download Statement',
      `Statement of account for ${loan.type} (${loan.id}) — ${activePeriodLabel} will be downloaded as PDF.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Download',
          onPress: async () => {
            await generateSoaPdf({
              loanType: loan.type,
              loanId: loan.id,
              period: activePeriodLabel,
              entries: filteredEntries.map(e => ({
                date: e.date,
                particulars: e.particulars,
                type: e.type,
                amount: e.amount,
                balance: e.balance,
              })),
              summary,
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
          <Text style={themed.topTitle}>Statement of Account</Text>
          <View style={themed.topSpacer} />
        </View>
        <View style={themed.heroRow}>
          <View style={themed.heroLeft}>
            <Text style={themed.heroLabel}>Closing Outstanding</Text>
            <Text style={themed.heroAmount}>{formatINR(summary.closing)}</Text>
            <View style={themed.heroBadge}>
              <Text style={themed.heroBadgeText}>
                🧾 {filteredEntries.length} entries • Last {activePeriodLabel}
              </Text>
            </View>
          </View>
          <View style={themed.heroIconWrap}>
            <Text style={themed.heroIcon}>🧾</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={themed.flex}
        contentContainerStyle={themed.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[themed.titleRow, themed.titleRowFirst]}>
          <Text style={themed.title}>Loan Account</Text>
        </View>
        <View style={themed.loanPillsRow}>
          {LOANS.map(item => {
            const selected = item.id === loanId;
            return (
              <Pressable
                key={item.id}
                onPress={() => setLoanId(item.id)}
                style={({ pressed }) => [
                  themed.loanPill,
                  selected && themed.loanPillActive,
                  { opacity: pressed ? 0.85 : 1 },
                ]}
              >
                <Text style={themed.loanPillIcon}>{item.icon}</Text>
                <View>
                  <Text
                    style={[
                      themed.loanPillType,
                      selected && themed.loanPillTypeActive,
                    ]}
                  >
                    {item.type}
                  </Text>
                  <Text
                    style={[
                      themed.loanPillId,
                      selected && themed.loanPillIdActive,
                    ]}
                  >
                    {item.id}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
        <View style={themed.accountStrip}>
          <View style={themed.stripIconCircle}>
            <Text style={themed.stripIconText}>🏦</Text>
          </View>
          <View style={themed.stripMiddle}>
            <Text style={themed.stripType}>{loan.type}</Text>
            <Text style={themed.stripId}>{loan.id}</Text>
          </View>
          <View>
            <Text style={themed.stripOutLabel}>Outstanding</Text>
            <Text style={themed.stripOutValue}>
              {formatINR(loan.outstanding)}
            </Text>
          </View>
        </View>

        <View style={themed.titleRow}>
          <Text style={themed.title}>Statement Period</Text>
        </View>
        <View style={themed.periodRow}>
          {PERIODS.map(item => (
            <PeriodChip
              key={item.key}
              label={item.label}
              selected={item.key === period}
              onPress={() => setPeriod(item.key)}
            />
          ))}
        </View>

        <View style={themed.titleRow}>
          <Text style={themed.title}>Summary</Text>
        </View>
        <View style={themed.statGrid}>
          <View style={themed.statBox}>
            <Text style={themed.statLabel}>Opening Balance</Text>
            <Text style={themed.statValue}>{formatINR(summary.opening)}</Text>
          </View>
          <View style={themed.statBox}>
            <Text style={themed.statLabel}>Total Debits (+)</Text>
            <Text style={themed.statValue}>
              {formatINR(summary.totalDebit)}
            </Text>
          </View>
          <View style={themed.statBox}>
            <Text style={themed.statLabel}>Total Credits (-)</Text>
            <Text style={themed.statValue}>
              {formatINR(summary.totalCredit)}
            </Text>
          </View>
          <View style={[themed.statBox, themed.statBoxHighlight]}>
            <Text style={themed.statLabel}>Closing Outstanding</Text>
            <Text style={[themed.statValue, themed.statValueHighlight]}>
              {formatINR(summary.closing)}
            </Text>
          </View>
        </View>

        <View style={themed.titleRow}>
          <Text style={themed.title}>Transaction Ledger</Text>
          <View style={themed.countChip}>
            <Text style={themed.countChipText}>
              {filteredEntries.length} entries
            </Text>
          </View>
        </View>
        <View style={themed.ledgerWrap}>
          {filteredEntries.length === 0 ? (
            <View style={themed.emptyState}>
              <Text style={themed.emptyIcon}>📄</Text>
              <Text style={themed.emptyText}>
                No transactions in this period
              </Text>
            </View>
          ) : (
            filteredEntries.map((entry, index) => (
              <TransactionRow
                key={`${entry.daysAgo}-${entry.particulars}`}
                entry={entry}
                isLast={index === filteredEntries.length - 1}
              />
            ))
          )}
        </View>
      </ScrollView>

      <View style={themed.footer}>
        <View style={themed.footerTotalWrap}>
          <Text style={themed.footerTotalLabel}>Closing Outstanding</Text>
          <Text style={themed.footerTotalValue}>
            {formatINR(summary.closing)}
          </Text>
          <Text style={themed.footerSub}>
            {loan.id} • Last {activePeriodLabel}
          </Text>
        </View>
        <DownloadButton onPress={handleDownload} />
      </View>
    </View>
  );
}
