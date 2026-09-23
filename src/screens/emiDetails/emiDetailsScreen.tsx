import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  Banknote,
  BarChart3,
  CalendarDays,
  Hourglass,
  Landmark,
  Repeat,
  TrendingUp,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

import { useTheme } from '../../context/ThemeContext';
import { toast } from '../../components/toast/ToastProvider';
import type { RootStackParamList } from '../../../App';

import { createStyles } from './styles';
import SectionCard from './_components/SectionCard';
import DetailItem from './_components/DetailItem';
import BreakupRow from './_components/BreakupRow';
import DuoStatPanel from './_components/DuoStatPanel';
import NextEmiCard from './_components/NextEmiCard';

import {
  buildAmortizationData,
  buildAmortizationDataFromChart,
  type AmortizationData,
  type AmortizationOptions,
  type Installment,
} from '../amortization/data';
import {
  getAmortizationChart,
  getLoanDetails,
  type LoanDetailsRecord,
} from '../amortization/api';

type Props = NativeStackScreenProps<RootStackParamList, 'EmiDetails'>;

const formatINR = (value: number) => `₹${value.toLocaleString('en-IN')}`;

function toNumber(value: unknown): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function toText(value: unknown): string {
  return value === null || value === undefined ? '' : String(value);
}

function pick(record: LoanDetailsRecord | null, keys: string[]): unknown {
  if (!record) {
    return undefined;
  }
  for (const key of keys) {
    const value = record[key];
    if (
      value !== null &&
      value !== undefined &&
      String(value).trim() !== '' &&
      Number(value) !== 0
    ) {
      return value;
    }
  }
  return undefined;
}

function optionsFromDetails(
  record: LoanDetailsRecord | null,
): AmortizationOptions {
  return {
    principal: toNumber(
      pick(record, [
        'DisbursementAmt',
        'AssetCost',
        'NetFinance',
        'AgreementValue',
        'SanctionedAmt',
        'loanAmount',
        'LoanAmount',
        'loan_amount',
        'Loan_Amount',
      ]),
    ),
    tenureMonths: toNumber(
      pick(record, [
        'No_Of_Instl',
        'Tenure',
        'Application_LoanDuration_Month',
        'LoanDuration',
        'Loan_Tenure',
      ]),
    ),
    interestRate: toNumber(
      pick(record, [
        'Flat_Rate',
        'Case_IRR',
        'Disbursement_IRR',
        'InterestRate',
        'ROI',
      ]),
    ),
    emi:
      toNumber(
        pick(record, [
          'EMIAmount',
          'Application_LoanEMIAmount',
          'EMI_Amount',
          'LoanEMIAmount',
        ]),
      ) || undefined,
    paidCount: toNumber(
      pick(record, ['PaidInstl', 'Paid_Instl', 'No_Of_Paid_Instl']),
    ),
    accountNo:
      toText(pick(record, ['LoanAcNo', 'Loan_Ac_No', 'AccountNo'])) ||
      undefined,
    loanType:
      toText(
        pick(record, ['Product', 'LoanType', 'Loan_Type', 'SchemeName']),
      ) || undefined,
    startDate:
      toText(pick(record, ['FirstEMIDate', 'First_EMI_Date', 'StartDate'])) ||
      undefined,
    disbursementDate:
      toText(pick(record, ['Loan_Date', 'Disb_Date', 'DisbursementDate'])) ||
      undefined,
  };
}

export default function EmiDetailsScreen({ navigation, route }: Props) {
  const { theme, isDark } = useTheme();
  const { colors } = theme;

  const { ApplicationIdentity } = route.params ?? {};
  const appIdentity = ApplicationIdentity || 0;

  const headerBg = isDark ? '#1E293B' : colors.primary;
  const decorBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)';

  const themed = createStyles(
    colors,
    theme.spacing,
    theme.radius,
    headerBg,
    decorBg,
  );

  const [details, setDetails] = useState<LoanDetailsRecord | null>(null);
  const [data, setData] = useState<AmortizationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    if (!appIdentity) {
      if (active) {
        setError('No loan selected');
        setLoading(false);
      }
      return () => {
        active = false;
      };
    }
    (async () => {
      try {
        const [loanDetails, entries] = await Promise.all([
          getLoanDetails(appIdentity),
          getAmortizationChart(appIdentity),
        ]);
        if (!active) {
          return;
        }
        if (!loanDetails) {
          if (active) {
            setError('No loan data found');
          }
          return;
        }
        const options = optionsFromDetails(loanDetails);
        const built =
          entries.length > 0
            ? buildAmortizationDataFromChart(entries, options)
            : buildAmortizationData(options);
        if (active) {
          setDetails(loanDetails);
          setData(built);
        }
      } catch (err) {
        if (active) {
          console.log('EmiDetails load error:', err);
          setError('Unable to load loan details. Tap Retry.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [appIdentity, retryKey]);

  const effectiveOptions = useMemo(
    () => optionsFromDetails(details),
    [details],
  );

  const paidCount = Math.max(0, effectiveOptions.paidCount || 0);

  const schedule: Installment[] = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.schedule.map((item, index) => ({
      ...item,
      status: index < paidCount ? 'Paid' : 'Upcoming',
    }));
  }, [data, paidCount]);

  const totalPaid = useMemo(
    () =>
      schedule
        .filter(item => item.status === 'Paid')
        .reduce((sum, item) => sum + item.emi, 0),
    [schedule],
  );

  const outstanding = useMemo(() => {
    if (!data) {
      return 0;
    }
    const paid = schedule.filter(item => item.status === 'Paid');
    return paid.length > 0
      ? paid[paid.length - 1].balance
      : data.loan.principal;
  }, [schedule, data]);

  const nextEmi = useMemo(
    () => schedule.find(item => item.status === 'Upcoming'),
    [schedule],
  );

  const loan = data?.loan;

  const staticClass = {
    accountNo: loan?.accountNo || '—',
    type: loan?.type || 'Loan',
    principal: loan?.principal || 0,
    interestRate: loan?.interestRate || 0,
    tenureMonths: loan?.tenureMonths || 0,
    startDate: loan?.startDate || '',
    frequency: loan?.frequency || 'Monthly',
  };

  const LOAN_OVERVIEW: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: Banknote, label: 'Loan Amount', value: formatINR(staticClass.principal) },
    { icon: TrendingUp, label: 'Interest Rate', value: `${staticClass.interestRate}% p.a.` },
    { icon: Hourglass, label: 'Tenure', value: `${staticClass.tenureMonths} Months` },
    { icon: CalendarDays, label: 'Start Date', value: staticClass.startDate },
    { icon: Repeat, label: 'Frequency', value: staticClass.frequency },
    { icon: Landmark, label: 'Loan Type', value: staticClass.type },
  ];

  const paidShare =
    staticClass.tenureMonths > 0
      ? (paidCount / staticClass.tenureMonths) * 100
      : 0;
  const principalShare =
    nextEmi && nextEmi.emi > 0 ? (nextEmi.principal / nextEmi.emi) * 100 : 0;
  const interestShare = 100 - principalShare;

  const handlePayNow = () => {
    if (!nextEmi) {
      return;
    }
    toast.show(
      `Redirecting to payment for EMI #${nextEmi.no} due ${nextEmi.date}.`,
      'info',
    );
    navigation.navigate('RepaymentSchedule');
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
            <ArrowLeft size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={themed.topTitle}>EMI Details</Text>
          <View style={themed.topSpacer} />
        </View>
        <View style={themed.heroRow}>
          <View style={themed.heroLeft}>
            <Text style={themed.heroLabel}>Outstanding Balance</Text>
            <Text style={themed.heroAmount}>{formatINR(outstanding)}</Text>
            <View
              style={[
                themed.heroBadge,
                { flexDirection: 'row', alignItems: 'center', gap: 6 },
              ]}
            >
              <BarChart3 size={11} color="#FFFFFF" />
              <Text style={themed.heroBadgeText}>
                {paidCount} of {staticClass.tenureMonths} EMIs paid
              </Text>
            </View>
          </View>
          <View style={themed.heroIconWrap}>
            <BarChart3 size={30} color="#FFFFFF" />
          </View>
        </View>
      </View>

      {loading ? (
        <View style={themed.flex}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            <ActivityIndicator color={colors.primary} />
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
              Loading EMI details...
            </Text>
          </View>
        </View>
      ) : error ? (
        <View style={themed.flex}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              paddingHorizontal: 32,
            }}
          >
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
              {error}
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setRetryKey(key => key + 1)}
              style={{
                marginTop: 8,
                paddingVertical: 10,
                paddingHorizontal: 24,
                borderRadius: 999,
                backgroundColor: colors.primary,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView
          style={themed.flex}
          contentContainerStyle={themed.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {nextEmi ? (
            <NextEmiCard
              number={nextEmi.no}
              amount={formatINR(nextEmi.emi)}
              dueDate={nextEmi.date}
              status={nextEmi.status}
              onPay={handlePayNow}
            />
          ) : null}

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
              value={formatINR(nextEmi?.principal ?? 0)}
            />
            <BreakupRow
              label="Interest Component"
              value={formatINR(nextEmi?.interest ?? 0)}
            />
            <View style={themed.breakupDividerSpaced} />
            <View style={themed.totalRow}>
              <Text style={themed.totalLabel}>Total EMI</Text>
              <Text style={themed.totalValue}>
                {formatINR(nextEmi?.emi ?? 0)}
              </Text>
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
                {paidCount} / {staticClass.tenureMonths}
              </Text>
            </View>
            <View style={themed.segments}>
              {Array.from({ length: staticClass.tenureMonths }).map(
                (_, index) => (
                  <View
                    key={index}
                    style={[
                      themed.segment,
                      index < paidCount && themed.segmentPaid,
                      index === paidCount && themed.segmentCurrent,
                    ]}
                  />
                ),
              )}
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
                  {nextEmi
                    ? `Next EMI #${nextEmi.no} • ${nextEmi.date}`
                    : 'All EMIs paid'}
                </Text>
              </View>
            </View>

            <DuoStatPanel
              paidLabel="Total Paid"
              paidValue={formatINR(totalPaid)}
              paidSub={`${paidCount} EMIs cleared`}
              dueLabel="Outstanding"
              dueValue={formatINR(outstanding)}
              dueSub={`${Math.max(
                0,
                staticClass.tenureMonths - paidCount,
              )} EMIs remaining`}
            />
          </SectionCard>
        </ScrollView>
      )}
    </View>
  );
}