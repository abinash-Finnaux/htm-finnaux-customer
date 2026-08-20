import React from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Controller, type Control } from 'react-hook-form';
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
  payAmount: string;
  onSubmit: () => void;
};

export default function PayEmiForm({
  control,
  upcomingEmis,
  selectedMonth,
  onSelectMonth,
  payAmount,
  onSubmit,
}: Props) {
  const { theme } = useTheme();
  const { colors, radius } = theme;

  const themed = createStyles(colors, radius);

  return (
    <View style={themed.card}>
      {/* Header */}
      <View style={themed.header}>
        <View style={themed.headerIconBg}>
          <Text style={themed.headerIconText}>💳</Text>
        </View>
        <View>
          <Text style={themed.headerTitle}>Make a Payment</Text>
          <Text style={themed.headerSub}>Pay your upcoming EMI dues</Text>
        </View>
      </View>

      {/* Select EMI */}
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
                  {
                    backgroundColor: selected
                      ? colors.primary
                      : colors.surface,
                    borderColor: selected ? colors.primary : colors.border,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                {selected && (
                  <View style={themed.emiCardTick}>
                    <Text style={themed.emiCardTickText}>✓</Text>
                  </View>
                )}
                <Text
                  style={[
                    themed.emiCardMonth,
                    {
                      color: selected
                        ? 'rgba(255,255,255,0.7)'
                        : colors.textSecondary,
                    },
                  ]}
                >
                  {item.date.split(' ')[0]} {item.date.split(' ')[1]}
                </Text>
                <Text
                  style={[
                    themed.emiCardAmount,
                    { color: selected ? '#FFFFFF' : colors.text },
                  ]}
                >
                  ₹{item.emi.toLocaleString('en-IN')}
                </Text>
                <Text
                  style={[
                    themed.emiCardDate,
                    {
                      color: selected
                        ? 'rgba(255,255,255,0.6)'
                        : colors.textSecondary,
                    },
                  ]}
                >
                  {item.date.split(' ')[2]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Amount */}
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

      {/* Payment Mode */}
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
                      {
                        backgroundColor: selected
                          ? colors.primary
                          : colors.surface,
                        borderColor: selected
                          ? colors.primary
                          : colors.border,
                        opacity: pressed ? 0.85 : 1,
                      },
                    ]}
                  >
                    {selected && (
                      <View style={themed.modeCardTick}>
                        <Text style={themed.modeCardTickText}>✓</Text>
                      </View>
                    )}
                    <Text style={themed.modeCardIcon}>{mode.icon}</Text>
                    <Text
                      style={[
                        themed.modeCardLabel,
                        { color: selected ? '#FFFFFF' : colors.text },
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

      {/* Submit */}
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
      borderWidth: 1,
      paddingVertical: 12,
      paddingHorizontal: 0,
      flex: 1,
      minWidth: '30%',
      alignItems: 'center',
      borderRadius: radius.md,
    },
    emiCardTick: {
      position: 'absolute',
      top: 5,
      right: 5,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    emiCardTickText: {
      fontSize: 9,
      fontWeight: '800',
      color: '#1E293B',
    },
    emiCardMonth: {
      fontSize: 11,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    emiCardAmount: {
      fontSize: 15,
      fontWeight: '800',
      marginTop: 4,
    },
    emiCardDate: {
      fontSize: 10,
      fontWeight: '500',
      marginTop: 2,
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
    },
    modeCardTick: {
      position: 'absolute',
      top: 5,
      right: 5,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    modeCardTickText: {
      fontSize: 9,
      fontWeight: '800',
      color: '#1E293B',
    },
    modeCardIcon: {
      fontSize: 22,
    },
    modeCardLabel: {
      fontSize: 12,
      fontWeight: '700',
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
