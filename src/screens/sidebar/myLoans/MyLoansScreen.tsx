import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../../context/ThemeContext';
import type { RootStackParamList } from '../../../../App';

import MyLoanCard, { type MyLoan } from './_components/MyLoanCard';

type Props = NativeStackScreenProps<RootStackParamList, 'MyLoans'>;

const LOANS: MyLoan[] = [
  {
    id: 'HMT-PL-001',
    type: 'Personal Loan',
    amount: '₹5,00,000',
    outstanding: '₹3,20,000',
    emi: '₹12,500',
    tenure: '36 months',
    status: 'Active',
    statusColor: '#22C55E',
  },
  {
    id: 'HMT-HL-002',
    type: 'Home Loan',
    amount: '₹25,00,000',
    outstanding: '₹18,50,000',
    emi: '₹28,000',
    tenure: '240 months',
    status: 'Active',
    statusColor: '#22C55E',
  },
];

export default function MyLoansScreen({ navigation }: Props) {
  const { theme, isDark } = useTheme();
  const { colors, spacing, radius } = theme;

  const headerBg = isDark ? '#1E293B' : colors.primary;
  const decorBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)';

  const themed = createStyles(colors, spacing, radius, headerBg, decorBg);

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
          <Text style={themed.topTitle}>My Loans</Text>
          <View style={themed.topSpacer} />
        </View>
        <View style={themed.headerBody}>
          <Text style={themed.headerIcon}>🏦</Text>
          <Text style={themed.headerLabel}>{LOANS.length} Active Loans</Text>
        </View>
      </View>

      <ScrollView
        style={themed.flex}
        contentContainerStyle={themed.content}
        showsVerticalScrollIndicator={false}
      >
        {LOANS.map((loan, index) => (
          <MyLoanCard
            key={index}
            loan={loan}
            onSchedulePress={() => navigation.navigate('RepaymentSchedule')}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function createStyles(
  colors: ReturnType<typeof useTheme>['theme']['colors'],
  spacing: ReturnType<typeof useTheme>['theme']['spacing'],
  radius: ReturnType<typeof useTheme>['theme']['radius'],
  headerBg: string,
  decorBg: string,
) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: 56,
      paddingBottom: 28,
      paddingHorizontal: 24,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      overflow: 'hidden',
      backgroundColor: headerBg,
    },
    decor1: {
      position: 'absolute',
      top: -40,
      right: -30,
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: decorBg,
    },
    decor2: {
      position: 'absolute',
      bottom: 10,
      left: -40,
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: decorBg,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    backBtn: {
      width: 40,
      height: 40,
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backBtnText: {
      color: '#FFFFFF',
      fontSize: 20,
      fontWeight: '600',
    },
    topTitle: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 16,
      fontWeight: '600',
    },
    topSpacer: {
      width: 40,
    },
    headerBody: {
      alignItems: 'center',
      marginTop: 20,
    },
    headerIcon: {
      fontSize: 36,
    },
    headerLabel: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '700',
      marginTop: 10,
    },
    flex: {
      flex: 1,
    },
    content: {
      paddingBottom: 40,
      padding: spacing.lg,
    },
  });
}
