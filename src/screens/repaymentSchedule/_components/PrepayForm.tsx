import React from 'react';
import {
  Text,
  View,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Controller, type Control } from 'react-hook-form';
import { useTheme } from '../../../context/ThemeContext';

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

const PREPAY_TYPES = [
  { id: 'prepay', label: 'Part Payment', icon: '💰' },
  { id: 'foreclose', label: 'Foreclose Loan', icon: '✅' },
];

type Props = {
  control: Control<PayForm>;
  outstandingBalance: number;
  paidCount: number;
  totalCount: number;
  prepayType: string;
  prepayAmount: string;
  onSubmit: () => void;
  onFillMax: () => void;
};

export default function PrepayForm({
  control,
  outstandingBalance,
  paidCount,
  totalCount,
  prepayType,
  prepayAmount,
  onSubmit,
  onFillMax,
}: Props) {
  const { theme } = useTheme();
  const { colors, radius } = theme;

  const themed = createStyles(colors, radius);

  return (
    <View style={themed.card}>
      {/* Header */}
      <View style={themed.header}>
        <View style={themed.headerIconBg}>
          <Text style={themed.headerIconText}>⚡</Text>
        </View>
        <View>
          <Text style={themed.headerTitle}>Prepay or Foreclose</Text>
          <Text style={themed.headerSub}>Reduce your loan burden</Text>
        </View>
      </View>

      {/* Outstanding Banner */}
      <View style={themed.outstandingBanner}>
        <Text style={themed.outstandingLabel}>Outstanding Balance</Text>
        <Text style={themed.outstandingValue}>
          ₹{outstandingBalance.toLocaleString('en-IN')}
        </Text>
        <View style={themed.outstandingDivider} />
        <View style={themed.outstandingRow}>
          <View style={themed.outstandingStat}>
            <Text style={themed.outstandingStatLabel}>Paid EMIs</Text>
            <Text style={themed.outstandingStatValuePaid}>{paidCount}</Text>
          </View>
          <View style={themed.outstandingStatDivider} />
          <View style={themed.outstandingStat}>
            <Text style={themed.outstandingStatLabel}>Remaining</Text>
            <Text style={themed.outstandingStatValueRemaining}>
              {totalCount - paidCount}
            </Text>
          </View>
        </View>
      </View>

      {/* Type Selection */}
      <View style={themed.section}>
        <Text style={themed.sectionTitle}>Choose Action</Text>
        <Controller
          control={control}
          name="prepayType"
          render={({ field: { onChange, value } }) => (
            <View style={themed.typeGrid}>
              {PREPAY_TYPES.map(t => {
                const selected = value === t.id;
                const accent = t.id === 'prepay' ? '#F59E0B' : '#22C55E';
                return (
                  <Pressable
                    key={t.id}
                    onPress={() => onChange(t.id)}
                    style={({ pressed }) => [
                      themed.typeCard,
                      {
                        backgroundColor: selected
                          ? accent + '15'
                          : colors.surface,
                        borderColor: selected ? accent : colors.border,
                        opacity: pressed ? 0.85 : 1,
                      },
                    ]}
                  >
                    <Text style={themed.typeCardIcon}>{t.icon}</Text>
                    <Text
                      style={[
                        themed.typeCardLabel,
                        { color: selected ? accent : colors.text },
                      ]}
                    >
                      {t.label}
                    </Text>
                    <Text style={themed.typeCardDesc}>
                      {t.id === 'prepay'
                        ? 'Pay extra toward principal'
                        : 'Close loan in full'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        />
      </View>

      {/* Amount */}
      <View style={themed.section}>
        <View style={themed.sectionHeader}>
          <Text style={themed.sectionTitle}>Amount</Text>
          {prepayType === 'foreclose' && (
            <Pressable onPress={onFillMax}>
              <Text style={themed.fillMaxLink}>Pay full amount</Text>
            </Pressable>
          )}
        </View>
        <View
          style={[
            themed.amountInputWrapper,
            {
              borderColor: prepayAmount ? '#8B5CF640' : colors.border,
            },
          ]}
        >
          <Text style={themed.amountPrefix}>₹</Text>
          <Controller
            control={control}
            name="prepayAmount"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={themed.amountInput}
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="number-pad"
              />
            )}
          />
        </View>
      </View>

      {/* Payment Mode */}
      <View style={themed.section}>
        <Text style={themed.sectionTitle}>Payment Method</Text>
        <Controller
          control={control}
          name="prepayMode"
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
                          ? '#8B5CF6'
                          : colors.surface,
                        borderColor: selected ? '#8B5CF6' : colors.border,
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
          {prepayType === 'foreclose'
            ? 'Foreclose Loan'
            : 'Submit Prepayment'}
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
      backgroundColor: '#8B5CF615',
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
    outstandingBanner: {
      margin: 18,
      padding: 18,
      alignItems: 'center',
      backgroundColor: '#8B5CF610',
      borderRadius: radius.md,
    },
    outstandingLabel: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    outstandingValue: {
      fontSize: 28,
      fontWeight: '800',
      marginTop: 4,
      color: '#8B5CF6',
    },
    outstandingDivider: {
      height: 1,
      width: '60%',
      marginVertical: 14,
      backgroundColor: '#8B5CF620',
    },
    outstandingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
    },
    outstandingStat: {
      alignItems: 'center',
    },
    outstandingStatLabel: {
      fontSize: 11,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    outstandingStatValuePaid: {
      fontSize: 18,
      fontWeight: '800',
      marginTop: 2,
      color: '#22C55E',
    },
    outstandingStatValueRemaining: {
      fontSize: 18,
      fontWeight: '800',
      marginTop: 2,
      color: '#F59E0B',
    },
    outstandingStatDivider: {
      width: 1,
      height: 28,
      backgroundColor: '#8B5CF620',
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
    typeGrid: {
      flexDirection: 'row',
      gap: 10,
    },
    typeCard: {
      flex: 1,
      borderWidth: 1.5,
      paddingVertical: 16,
      alignItems: 'center',
      borderRadius: radius.md,
    },
    typeCardIcon: {
      fontSize: 24,
      marginBottom: 6,
    },
    typeCardLabel: {
      fontSize: 14,
      fontWeight: '700',
    },
    typeCardDesc: {
      fontSize: 10,
      fontWeight: '500',
      marginTop: 3,
      textAlign: 'center',
      color: colors.textSecondary,
    },
    fillMaxLink: {
      fontSize: 12,
      fontWeight: '700',
      color: '#8B5CF6',
    },
    amountInputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      height: 52,
      paddingHorizontal: 14,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
    },
    amountPrefix: {
      fontSize: 18,
      fontWeight: '700',
      marginRight: 8,
      color: colors.textSecondary,
    },
    amountInput: {
      flex: 1,
      fontSize: 18,
      fontWeight: '700',
      padding: 0,
      color: colors.text,
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
      backgroundColor: '#8B5CF6',
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
