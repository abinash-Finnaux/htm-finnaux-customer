import React, { useMemo } from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Controller, useWatch, type Control } from 'react-hook-form';
import { useTheme } from '../../../context/ThemeContext';
import GlobalInputText from '../../../components/inputTexts/GlobalInputText';

type ScheduleItem = {
  month: number;
  date: string;
  emi: number;
};

type PayForm = {
  payAmount: string;
  payMode: string;
  prepayType: string;
  prepayAmount: string;
  prepayMode: string;
};

const PAYMENT_MODES = [
  { id: 'upi', label: 'UPI', icon: '📱' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
  { id: 'card', label: 'Card', icon: '💳' },
];

type Props = {
  control: Control<PayForm>;
  upcomingEmis: ScheduleItem[];
  selectedMonth: number | null;
  onSelectMonth: (month: number, emi: number) => void;
  onSubmit: () => void;
};

export default function PayEmiForm({
  control,
  upcomingEmis,
  selectedMonth,
  onSelectMonth,
  onSubmit,
}: Props) {
  const { theme } = useTheme();
  const { colors, radius } = theme;

  const themed = useMemo(
    () => createStyles(colors, radius),
    [colors, radius],
  );

  const payAmount = useWatch({ control, name: 'payAmount' });

  return (
    <View style={themed.card}>
      <View style={themed.header}>
        <View style={themed.headerIconBg}>
          <Text style={themed.headerIconText}>💳</Text>
        </View>
        <View>
          <Text style={themed.headerTitle}>Make a Payment</Text>
          <Text style={themed.headerSub}>Pay your upcoming EMI dues</Text>
        </View>
      </View>

      <View style={themed.section}>
        <View style={themed.sectionHeader}>
          <Text style={themed.sectionTitle}>Select EMI</Text>
          <Text style={themed.sectionBadge}>
            {upcomingEmis.length} upcoming
          </Text>
        </View>
        <View style={themed.emiGrid}>
          {upcomingEmis.map(item => {
            const selected = selectedMonth === item.month;
            return (
              <Pressable
                key={item.month}
                onPress={() => onSelectMonth(item.month, item.emi)}
                style={({ pressed }) => [
                  themed.emiCard,
                  selected && themed.emiCardSelected,
                  { opacity: pressed ? 0.85 : 1 },
                ]}
              >
                <Text
                  style={[
                    themed.emiCardMonth,
                    selected && themed.emiCardMonthSelected,
                  ]}
                >
                  {item.date.split(' ')[0]} {item.date.split(' ')[1]}
                </Text>
                <Text
                  style={[
                    themed.emiCardAmount,
                    selected && themed.emiCardAmountSelected,
                  ]}
                >
                  ₹{item.emi.toLocaleString('en-IN')}
                </Text>
                <Text
                  style={[
                    themed.emiCardDate,
                    selected && themed.emiCardDateSelected,
                  ]}
                >
                  {item.date.split(' ')[2]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={themed.section}>
        <Controller
          control={control}
          name="payAmount"
          render={({ field: { onChange, onBlur, value } }) => (
            <GlobalInputText
              label="Amount"
              placeholder="0"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="number-pad"
            />
          )}
        />
      </View>

      <View style={themed.section}>
        <Text style={themed.sectionTitle}>Payment Method</Text>
        <Controller
          control={control}
          name="payMode"
          render={({ field: { onChange, value } }) => (
            <View style={themed.modeGrid}>
              {PAYMENT_MODES.map(mode => {
                const selected = value === mode.id;
                return (
                  <Pressable
                    key={mode.id}
                    onPress={() => onChange(mode.id)}
                    style={({ pressed }) => [
                      themed.modeCard,
                      selected && themed.modeCardSelected,
                      { opacity: pressed ? 0.85 : 1 },
                    ]}
                  >
                    <Text style={themed.modeCardIcon}>{mode.icon}</Text>
                    <Text
                      style={[
                        themed.modeCardLabel,
                        selected && themed.modeCardLabelSelected,
                      ]}
                    >
                      {mode.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        />
      </View>

      <Pressable
        onPress={onSubmit}
        style={({ pressed }) => [
          themed.payBtn,
          { opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <Text style={themed.payBtnText}>
          Pay ₹
          {payAmount ? Number(payAmount).toLocaleString('en-IN') : '0'}
        </Text>
        <Text style={themed.payBtnArrow}>→</Text>
      </Pressable>
    </View>
  );
}

function createStyles(
  colors: ReturnType<typeof useTheme>['theme']['colors'],
  radius: ReturnType<typeof useTheme>['theme']['radius'],
) {
  return StyleSheet.create({
    card: {
      borderWidth: 1,
      overflow: 'hidden',
      backgroundColor: colors.surfaceElevated,
      borderColor: colors.border,
      borderRadius: radius.lg,
      marginTop: 16,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      padding: 18,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerIconBg: {
      width: 44,
      height: 44,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.primary + '15',
    },
    headerIconText: {
      fontSize: 20,
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
    },
    headerSub: {
      fontSize: 12,
      fontWeight: '500',
      marginTop: 2,
      color: colors.textSecondary,
    },
    section: {
      padding: 18,
      paddingBottom: 0,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
    },
    sectionBadge: {
      fontSize: 11,
      fontWeight: '600',
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 20,
      backgroundColor: colors.primary + '15',
      color: colors.primary,
    },
    emiGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    emiCard: {
      borderWidth: 1.5,
      paddingVertical: 12,
      paddingHorizontal: 0,
      flex: 1,
      minWidth: '30%',
      alignItems: 'center',
      borderRadius: radius.md,
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    emiCardSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    emiCardMonth: {
      fontSize: 11,
      fontWeight: '600',
      textTransform: 'uppercase',
      color: colors.textSecondary,
    },
    emiCardMonthSelected: {
      color: 'rgba(255,255,255,0.7)',
    },
    emiCardAmount: {
      fontSize: 15,
      fontWeight: '800',
      marginTop: 4,
      color: colors.text,
    },
    emiCardAmountSelected: {
      color: '#FFFFFF',
    },
    emiCardDate: {
      fontSize: 10,
      fontWeight: '500',
      marginTop: 2,
      color: colors.textSecondary,
    },
    emiCardDateSelected: {
      color: 'rgba(255,255,255,0.6)',
    },
    modeGrid: {
      flexDirection: 'row',
      gap: 10,
    },
    modeCard: {
      flex: 1,
      borderWidth: 1,
      paddingVertical: 14,
      alignItems: 'center',
      gap: 6,
      borderRadius: radius.md,
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    modeCardSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    modeCardIcon: {
      fontSize: 22,
    },
    modeCardLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.text,
    },
    modeCardLabelSelected: {
      color: '#FFFFFF',
    },
    payBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 18,
      paddingVertical: 16,
      gap: 8,
      backgroundColor: colors.primary,
      borderRadius: radius.md,
    },
    payBtnText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
    },
    payBtnArrow: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '600',
    },
  });
}
