import React, { useMemo, useState } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { buildAmortizationData } from './data';
import YearCard from './_components/YearCard';
import { createStyles } from './styles';
import { generateAmortizationPdf } from '../../utils/generatePdf';
import { toast } from '../../components/toast/ToastProvider';
import DownloadButton from '../../components/buttons/DownloadButton';

const currency = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export default function AmortizationScreen() {
  const { theme } = useTheme();
  const { colors } = theme;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const data = useMemo(() => buildAmortizationData(), []);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await generateAmortizationPdf(data);
      toast.show('Amortization schedule saved to Downloads.', 'success');
    } catch {
      toast.show('Unable to generate PDF. Please try again.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const overview = [
    { label: 'Loan Amount', value: currency(data.loan.principal) },
    { label: 'Monthly EMI', value: currency(data.emi) },
    { label: 'Tenure', value: `${data.loan.tenureMonths} months` },
    { label: 'Interest Rate', value: `${data.loan.interestRate}% p.a.` },
    {
      label: 'First EMI',
      value: data.loan.startDate,
    },
    {
      label: 'Disbursement',
      value: data.loan.disbursementDate,
    },
    { label: 'Loan Ac No', value: data.loan.accountNo },
    { label: 'Frequency', value: data.loan.frequency },
  ];

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.headerBar}>
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
        contentContainerStyle={styles.footer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <Text style={styles.heroTitle}>MONTHLY EMI</Text>
            <View style={styles.paidBadge}>
              <Text style={styles.paidText}>
                {data.paidCount}/{data.loan.tenureMonths} PAID
              </Text>
            </View>
          </View>
          <Text style={styles.emiLabel}>Equated Monthly Instalment</Text>
          <Text style={styles.emiAmount}>{currency(data.emi)}</Text>
          <View style={styles.heroSub}>
            <Text style={styles.heroSubText}>{data.loan.accountNo}</Text>
            <View style={styles.heroDivider} />
            <Text style={styles.heroSubText}>{data.loan.type}</Text>
            <View style={styles.heroDivider} />
            <Text style={styles.heroSubText}>
              {data.loan.tenureMonths} months
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total EMIs</Text>
            <Text style={styles.statValue}>{data.loan.tenureMonths}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Paid</Text>
            <Text style={styles.statValue}>{data.paidCount}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Balance</Text>
            <Text style={styles.statValue}>
              {data.loan.tenureMonths - data.paidCount}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Rate</Text>
            <Text style={styles.statValueGood}>{data.loan.interestRate}%</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cost of Borrowing</Text>
          <Text style={styles.sectionSub}>
            How your loan repayment gets divided
          </Text>
        </View>

        <View style={[styles.borrowingCard, styles.section]}>
          <View style={styles.borrowingRow}>
            <View style={styles.legendBlock}>
              <View
                style={[styles.legendDot, { backgroundColor: colors.primary }]}
              />
              <Text style={styles.legendLabel}>Principal Amount</Text>
              <Text style={styles.legendValue}>
                {currency(data.loan.principal)}
              </Text>
            </View>
            <View style={styles.dividerVertical} />
            <View style={styles.legendBlock}>
              <View
                style={[styles.legendDot, { backgroundColor: colors.warning }]}
              />
              <Text style={styles.legendLabel}>Total Interest</Text>
              <Text style={styles.legendValue}>{currency(data.totalInterest)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loan Overview</Text>
        </View>

        <View style={styles.detailCard}>
          {overview.map((item, index) => {
            const isLast = index === overview.length - 1;
            return (
              <View
                key={item.label}
                style={[
                  styles.detailRow,
                  !isLast && styles.dividerRowBorder,
                ]}
              >
                <View style={styles.detailCell}>
                  <Text style={styles.detailLabel}>{item.label}</Text>
                  <Text style={styles.detailValue}>{item.value}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amortization Schedule</Text>
          <Text style={styles.sectionSub}>
            Year-wise split of principal and interest
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.scheduleList}>
            {data.years.map((year) => (
              <YearCard key={year.label} year={year} schedule={data.schedule} />
            ))}
          </View>
        </View>

        <View style={styles.downloadWrap}>
          <DownloadButton onPress={handleDownload} label="Download PDF" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}