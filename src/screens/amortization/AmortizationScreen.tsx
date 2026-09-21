import React, { useMemo, useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { buildAmortizationData } from './data';
import YearCard from './_components/YearCard';
import { createStyles } from './styles';
import { generateAmortizationPdf } from '../../utils/generatePdf';

const currency = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export default function AmortizationScreen() {
  const { theme } = useTheme();
  const { colors } = theme;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const data = useMemo(() => buildAmortizationData(), []);
  const { emi, loan, totalInterest, paidCount, schedule, years } = data;
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (downloading) return;
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
          <Text style={styles.emiLabel}>Your Equated Monthly Instalment</Text>
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
              <Text style={styles.heroColValue}>{loan.interestRate}% p.a.</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
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
            <Text style={styles.statValue}>{loan.tenureMonths - paidCount}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Rate</Text>
            <Text style={styles.statValueSuccess}>{loan.interestRate}%</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cost of Borrowing</Text>
          <Text style={styles.sectionSub}>
            How your loan repayment gets divided
          </Text>
          <View style={styles.borrowingCard}>
            <View style={styles.borrowingItem}>
              <View style={[styles.dot, { backgroundColor: colors.primary }]} />
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

        <View style={styles.scheduleList}>
          {years.map(year => (
            <YearCard key={year.label} year={year} schedule={schedule} />
          ))}
        </View>

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
      </ScrollView>
    </SafeAreaView>
  );
}