import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Text,
  View,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { useTheme } from '../../context/ThemeContext';

import { scheduleIdleTask } from '../../utils/scheduleIdleTask';

import type { RootStackParamList } from '../../../App';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import ActionTabs from './_components/ActionTabs';
import PayEmiForm from './_components/PayEmiForm';
import PrepayForm from './_components/PrepayForm';
import SummaryCards from './_components/SummaryCards';
import ScheduleCard from '../../components/cards/ScheduleCard';
import SectionHeaderText from '../../components/typography/SectionHeaderText';

type Props = NativeStackScreenProps<RootStackParamList, 'RepaymentSchedule'>;

type PayForm = {
  payAmount: string;
  payMode: string;
  prepayType: string;
  prepayAmount: string;
  prepayMode: string;
};

const SCHEDULE = [
  {
    month: 1,
    date: '15 Sep 2026',
    emi: 12500,
    principal: 8750,
    interest: 3750,
    balance: 491250,
    status: 'Paid' as const,
  },
  {
    month: 2,
    date: '15 Oct 2026',
    emi: 12500,
    principal: 8781,
    interest: 3719,
    balance: 482469,
    status: 'Paid' as const,
  },
  {
    month: 3,
    date: '15 Nov 2026',
    emi: 12500,
    principal: 8813,
    interest: 3687,
    balance: 473656,
    status: 'Paid' as const,
  },
  {
    month: 4,
    date: '15 Dec 2026',
    emi: 12500,
    principal: 8844,
    interest: 3656,
    balance: 464812,
    status: 'Paid' as const,
  },
  {
    month: 5,
    date: '15 Jan 2027',
    emi: 12500,
    principal: 8876,
    interest: 3624,
    balance: 455936,
    status: 'Paid' as const,
  },
  {
    month: 6,
    date: '15 Feb 2027',
    emi: 12500,
    principal: 8908,
    interest: 3592,
    balance: 447028,
    status: 'Paid' as const,
  },
  {
    month: 7,
    date: '15 Mar 2027',
    emi: 12500,
    principal: 8940,
    interest: 3560,
    balance: 438088,
    status: 'Upcoming' as const,
  },
  {
    month: 8,
    date: '15 Apr 2027',
    emi: 12500,
    principal: 8972,
    interest: 3528,
    balance: 429116,
    status: 'Upcoming' as const,
  },
  {
    month: 9,
    date: '15 May 2027',
    emi: 12500,
    principal: 9004,
    interest: 3496,
    balance: 420112,
    status: 'Upcoming' as const,
  },
  {
    month: 10,
    date: '15 Jun 2027',
    emi: 12500,
    principal: 9036,
    interest: 3464,
    balance: 411076,
    status: 'Upcoming' as const,
  },
  {
    month: 11,
    date: '15 Jul 2027',
    emi: 12500,
    principal: 9069,
    interest: 3431,
    balance: 402007,
    status: 'Upcoming' as const,
  },
  {
    month: 12,
    date: '15 Aug 2027',
    emi: 12500,
    principal: 9101,
    interest: 3399,
    balance: 392906,
    status: 'Upcoming' as const,
  },
];

const STATUS_COLORS = {
  Paid: '#22C55E',
  Upcoming: '#F59E0B',
  Overdue: '#EF4444',
};

const SCHEDULE_BATCH_SIZE = 4;

const PAYMENT_MODES = [
  { id: 'upi', label: 'UPI' },
  { id: 'netbanking', label: 'Net Banking' },
  { id: 'card', label: 'Card' },
];

export default function RepaymentScheduleScreen({ navigation }: Props) {
  const { theme, isDark } = useTheme();
  const { colors, spacing } = theme;

  const headerBg = isDark ? '#1E293B' : colors.primary;
  const decorBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)';

  const themed = useMemo(
    () => createStyles(colors, spacing, headerBg, decorBg),
    [colors, spacing, headerBg, decorBg],
  );

  const paidCount = useMemo(
    () => SCHEDULE.filter(s => s.status === 'Paid').length,
    [],
  );
  const totalPaid = useMemo(
    () =>
      SCHEDULE.filter(s => s.status === 'Paid').reduce(
        (sum, s) => sum + s.emi,
        0,
      ),
    [],
  );
  const outstandingBalance = SCHEDULE[SCHEDULE.length - 1].balance;
  const upcomingEmis = useMemo(
    () => SCHEDULE.filter(s => s.status === 'Upcoming'),
    [],
  );

  const [activeTab, setActiveTab] = useState<'pay' | 'prepay'>('pay');

  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const [visibleCount, setVisibleCount] = useState(SCHEDULE_BATCH_SIZE);

  useEffect(() => {
    if (visibleCount >= SCHEDULE.length) {
      return;
    }
    const cancel = scheduleIdleTask(() => {
      setVisibleCount(c => Math.min(c + SCHEDULE_BATCH_SIZE, SCHEDULE.length));
    });
    return cancel;
  }, [visibleCount]);

  const { control, getValues, setValue } = useForm<PayForm>({
    defaultValues: {
      payAmount: '',
      payMode: '',
      prepayType: 'prepay',
      prepayAmount: '',
      prepayMode: '',
    },
  });

  const onSelectMonth = useCallback(
    (month: number, emi: number) => {
      setSelectedMonth(month);
      setValue('payAmount', String(emi));
    },
    [setValue],
  );

  const onFillMax = useCallback(() => {
    setValue('prepayAmount', String(outstandingBalance));
  }, [setValue, outstandingBalance]);

  const handlePaySubmit = () => {
    const { payAmount: pAmount, payMode: pMode } = getValues();
    if (!selectedMonth)
      return Alert.alert('Select EMI', 'Please select an EMI month to pay.');
    if (!pAmount.trim())
      return Alert.alert('Amount', 'Please enter the payment amount.');
    if (!pMode)
      return Alert.alert('Payment Mode', 'Please select a payment mode.');
    Alert.alert(
      'Confirm Payment',
      `Pay ₹${Number(pAmount).toLocaleString('en-IN')} for EMI #${selectedMonth} via ${
        PAYMENT_MODES.find(m => m.id === pMode)?.label
      }?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay',
          onPress: () => {
            Alert.alert('Success', 'Payment initiated successfully.', [
              { text: 'OK' },
            ]);
            setSelectedMonth(null);
            setValue('payAmount', '');
            setValue('payMode', '');
          },
        },
      ],
    );
  };

  const handlePrepaySubmit = () => {
    const {
      prepayAmount: pAmount,
      prepayMode: pMode,
      prepayType: pType,
    } = getValues();
    if (!pAmount.trim())
      return Alert.alert('Amount', 'Please enter the amount.');
    if (!pMode)
      return Alert.alert('Payment Mode', 'Please select a payment mode.');
    const label = pType === 'foreclose' ? 'foreclose' : 'prepay';
    Alert.alert(
      'Confirm',
      `₹${Number(pAmount).toLocaleString(
        'en-IN',
      )} will be used to ${label} your loan. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            Alert.alert('Success', 'Request submitted successfully.', [
              { text: 'OK' },
            ]);
            setValue('prepayAmount', '');
            setValue('prepayMode', '');
          },
        },
      ],
    );
  };

  const scheduleList = useMemo(
    () =>
      SCHEDULE.map((item, index) => (
        <ScheduleCard
          key={item.month}
          item={item}
          isLast={index === SCHEDULE.length - 1}
          accentColor={STATUS_COLORS[item.status]}
        />
      )),
    [],
  );

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
          <Text style={themed.topTitle}>Repayment Schedule</Text>
          <View style={themed.topSpacer} />
        </View>
        <View style={themed.heroRow}>
          <View style={themed.heroLeft}>
            <Text style={themed.heroLabel}>Outstanding Balance</Text>
            <Text style={themed.heroAmount}>
              ₹{outstandingBalance.toLocaleString('en-IN')}
            </Text>
            <View style={themed.heroBadge}>
              <Text style={themed.heroBadgeText}>
                📅 {paidCount} of {SCHEDULE.length} EMIs paid
              </Text>
            </View>
          </View>
          <View style={themed.heroIconWrap}>
            <Text style={themed.heroIcon}>📅</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={themed.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          style={themed.flex}
          contentContainerStyle={themed.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <SummaryCards
            paidCount={paidCount}
            totalCount={SCHEDULE.length}
            totalPaid={totalPaid}
            totalLoanAmount={500000}
          />

          <SectionHeaderText title="Monthly Schedule" />
          {scheduleList.slice(0, visibleCount)}
          {visibleCount < SCHEDULE.length && (
            <View style={themed.listPlaceholder} />
          )}

          <ActionTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            upcomingCount={upcomingEmis.length}
            outstandingBalance={outstandingBalance}
          />

          {activeTab === 'pay' && (
            <PayEmiForm
              control={control}
              upcomingEmis={upcomingEmis}
              selectedMonth={selectedMonth}
              onSelectMonth={onSelectMonth}
              onSubmit={handlePaySubmit}
            />
          )}

          {activeTab === 'prepay' && (
            <PrepayForm
              control={control}
              outstandingBalance={outstandingBalance}
              paidCount={paidCount}
              totalCount={SCHEDULE.length}
              onSubmit={handlePrepaySubmit}
              onFillMax={onFillMax}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function createStyles(
  colors: ReturnType<typeof useTheme>['theme']['colors'],
  spacing: ReturnType<typeof useTheme>['theme']['spacing'],
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
      paddingBottom: 26,
      paddingHorizontal: 24,
      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,
      backgroundColor: headerBg,
      overflow: 'hidden',
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
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    topSpacer: {
      width: 40,
    },
    heroRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 22,
    },
    heroLeft: {
      flex: 1,
    },
    heroLabel: {
      color: 'rgba(255,255,255,0.72)',
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    heroAmount: {
      color: '#FFFFFF',
      fontSize: 30,
      fontWeight: '800',
      marginTop: 6,
      letterSpacing: 0.3,
    },
    heroBadge: {
      alignSelf: 'flex-start',
      marginTop: 12,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 999,
      backgroundColor: 'rgba(255,255,255,0.16)',
    },
    heroBadgeText: {
      color: '#FFFFFF',
      fontSize: 11,
      fontWeight: '600',
    },
    heroIconWrap: {
      width: 64,
      height: 64,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.16)',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 16,
    },
    heroIcon: {
      fontSize: 30,
    },
    flex: {
      flex: 1,
    },
    content: {
      padding: spacing.lg,
      paddingBottom: 20,
    },
    listPlaceholder: {
      height: 120,
    },
    bottomSpacer: {
      height: 100,
    },
  });
}
