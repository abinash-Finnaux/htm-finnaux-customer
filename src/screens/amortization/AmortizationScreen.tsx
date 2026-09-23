import React, { useEffect, useMemo, useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  buildAmortizationData,
  buildAmortizationDataFromChart,
  type AmortizationData,
  type AmortizationOptions,
} from './data';
import {
  getAmortizationChart,
  getLoanDetails,
  type LoanDetailsRecord,
} from './api';
import YearCard from './_components/YearCard';
import { createStyles } from './styles';
import { generateAmortizationPdf } from '../../utils/generatePdf';

const currency = (n: number) => `₹${n.toLocaleString('en-IN')}`;

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

function paramsFromDetails(
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

export default function AmortizationScreen() {
  const { theme } = useTheme();
  const { colors } = theme;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute();

  const { ApplicationIdentity } =
    (route.params as { ApplicationIdentity?: number } | undefined) ?? {};
  const appIdentity = ApplicationIdentity || 0;

  console.log('applicationIdentityLOG', appIdentity);

  const [loanDetails, setLoanDetails] = useState<LoanDetailsRecord | null>(
    null,
  );
  const [chartData, setChartData] = useState<AmortizationData | null>(null);
  const [chartEmpty, setChartEmpty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setChartEmpty(false);
    if (!appIdentity) {
      if (active) {
        setError('No data found');
        setLoading(false);
      }
      return () => {
        active = false;
      };
    }
    (async () => {
      try {
        const [details, entries] = await Promise.all([
          getLoanDetails(appIdentity),
          getAmortizationChart(appIdentity),
        ]);
        if (!active) {
          return;
        }
        console.log('loanDetailsLOG', details);
        console.log('amortizationChartEntries', entries.length, entries);
        if (!details) {
          if (active) {
            setError('No data found');
            setChartData(null);
          }
          return;
        }
        setLoanDetails(details);

        if (entries.length > 0) {
          setChartData(
            buildAmortizationDataFromChart(entries, paramsFromDetails(details)),
          );
        } else {
          setChartEmpty(true);
        }
      } catch (err) {
        if (active) {
          console.log('Amortization load error:', err);
          setError('Unable to load details. Tap Retry.');
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

  const effectiveParams = useMemo(
    () => paramsFromDetails(loanDetails),
    [loanDetails],
  );

  const computedData = useMemo(
    () => buildAmortizationData(effectiveParams),
    [effectiveParams],
  );

  const data = chartData ?? computedData;
  const { emi, loan, totalInterest, paidCount, schedule, years } = data;

  const styles = useMemo(() => createStyles(colors), [colors]);

  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (downloading) {
      return;
    }
    setDownloading(true);
    try {
      await generateAmortizationPdf(data);
    } finally {
      setDownloading(false);
    }
  };

  const overview: { label: string; value: string }[][] = [
    [
      { label: 'Loan Amount', value: currency(loan.principal) },
      { label: 'Monthly EMI', value: currency(emi) },
    ],
    [
      { label: 'Tenure', value: `${loan.tenureMonths} months` },
      { label: 'Interest Rate', value: `${loan.interestRate}% p.a.` },
    ],
    [
      { label: 'Loan Ac No', value: loan.accountNo },
      { label: 'Loan Type', value: loan.type },
    ],
    [
      { label: 'Disbursement', value: loan.disbursementDate },
      { label: 'First EMI', value: loan.startDate },
    ],
  ];

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.backBtn,
            { opacity: pressed ? 0.6 : 1 },
          ]}
        >
          <ArrowLeft size={20} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Amortization</Text>
        <View style={styles.headerSpacer} />
      </View>
      <View style={styles.separator} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.footer}
        showsVerticalScrollIndicator={false}
      >
        {error && !chartData ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>📄</Text>
            <Text style={styles.emptyTitle}>No data found</Text>
            <Text style={styles.emptySub}>
              No loan details or amortization schedule available for this
              application.
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setRetryKey(key => key + 1)}
              style={styles.retryBtn}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : loading ? (
          <View style={styles.fullLoader}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.fullLoaderText}>Loading schedule...</Text>
          </View>
        ) : (
          <>
            <View style={styles.hero}>
              <View style={styles.heroDecor1} />
              <View style={styles.heroDecor2} />
              <View style={styles.heroTop}>
                <Text style={styles.heroTitle}>Monthly EMI</Text>
                <View style={styles.paidBadge}>
                  <Text style={styles.paidText}>
                    {paidCount}/{loan.tenureMonths} Paid
                  </Text>
                </View>
              </View>
              <Text style={styles.emiLabel}>
                Your Equated Monthly Instalment
              </Text>
              <Text style={styles.emiAmount}>{currency(emi)}</Text>
              <View style={styles.heroDivider} />
              <View style={styles.heroRow}>
                <View style={styles.heroCol}>
                  <Text style={styles.heroColLabel}>Loan Amount</Text>
                  <Text style={styles.heroColValue}>
                    {currency(loan.principal)}
                  </Text>
                </View>
                <View style={styles.heroCol}>
                  <Text style={styles.heroColLabel}>Tenure</Text>
                  <Text style={styles.heroColValue}>
                    {loan.tenureMonths} months
                  </Text>
                </View>
                <View style={styles.heroCol}>
                  <Text style={styles.heroColLabel}>Rate</Text>
                  <Text style={styles.heroColValue}>
                    {loan.interestRate}% p.a.
                  </Text>
                </View>
              </View>
            </View>

            {/* <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total EMIs</Text>
            <Text style={styles.statValue}>{loan.tenureMonths}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Paid</Text>
            <Text style={styles.statValue}>{paidCount}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Balance</Text>
            <Text style={styles.statValue}>
              {loan.tenureMonths - paidCount}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Rate</Text>
            <Text style={styles.statValueSuccess}>{loan.interestRate}%</Text>
          </View>
        </View> */}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cost of Borrowing</Text>
              <Text style={styles.sectionSub}>
                How your loan repayment gets divided
              </Text>
              <View style={styles.borrowingCard}>
                <View style={styles.borrowingItem}>
                  <View
                    style={[styles.dot, { backgroundColor: colors.primary }]}
                  />
                  <Text style={styles.borrowingLabel}>Principal Amount</Text>
                  <Text style={styles.borrowingValue}>
                    {currency(loan.principal)}
                  </Text>
                </View>
                <View style={styles.borrowingDivider} />
                <View style={styles.borrowingItem}>
                  <View
                    style={[styles.dot, { backgroundColor: colors.warning }]}
                  />
                  <Text style={styles.borrowingLabel}>Total Interest</Text>
                  <Text style={styles.borrowingValue}>
                    {currency(totalInterest)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Loan Overview</Text>
            </View>

            <View style={styles.overviewCard}>
              {overview.map((row, rowIndex) => (
                <View
                  key={rowIndex}
                  style={[
                    styles.overviewRow,
                    rowIndex < overview.length - 1 && styles.rowDivider,
                  ]}
                >
                  {row.map((cell, cellIndex) => (
                    <View
                      key={cell.label}
                      style={[
                        styles.overviewCell,
                        cellIndex === 0 && styles.cellDividerRight,
                      ]}
                    >
                      <Text style={styles.cellLabel}>{cell.label}</Text>
                      <Text style={styles.cellValue}>{cell.value}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amortization Schedule</Text>
              <Text style={styles.sectionSub}>
                Year-wise split of principal and interest
              </Text>
            </View>

            {chartEmpty ? (
              <View style={styles.chartLoader}>
                <Text style={styles.chartErrorText}>No data found</Text>
              </View>
            ) : (
              <>
                {!chartData && !error ? (
                  <View style={styles.estimatedNote}>
                    <Text style={styles.estimatedNoteText}>
                      Showing estimated schedule. Live schedule will appear
                      here.
                    </Text>
                  </View>
                ) : null}
                <View style={styles.scheduleList}>
                  {years.map((year, index) => (
                    <YearCard
                      key={year.label}
                      year={year}
                      schedule={schedule}
                      initialExpanded={index === 0}
                    />
                  ))}
                </View>
              </>
            )}

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleDownload}
              style={styles.downloadBtn}
            >
              {downloading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.downloadText}>Download PDF</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
