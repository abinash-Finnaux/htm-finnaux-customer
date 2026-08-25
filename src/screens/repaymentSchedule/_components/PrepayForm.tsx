import React, { useMemo } from 'react';
import {
  Text,
  View,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Controller, useWatch, type Control } from 'react-hook-form';
import { useTheme } from '../../../context/ThemeContext';
import FormPaymentModeSelect from '../../../components/forms/FormPaymentModeSelect';
import PrimaryButton from '../../../components/buttons/PrimaryButton';

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
  {
    id: 'prepay',
    label: 'Part Payment',
    icon: '💰',
    desc: 'Pay extra toward principal',
  },
  {
    id: 'foreclose',
    label: 'Foreclose Loan',
    icon: '🏁',
    desc: 'Close loan in full',
  },
];

type Props = {
  control: Control<PayForm>;
  outstandingBalance: number;
  paidCount: number;
  totalCount: number;
  onSubmit: () => void;
  onFillMax: () => void;
};

export default function PrepayForm({
  control,
  outstandingBalance,
  paidCount,
  totalCount,
  onSubmit,
  onFillMax,
}: Props) {
  const { theme } = useTheme();
  const { colors, radius } = theme;

  const themed = useMemo(
    () => createStyles(colors, radius),
    [colors, radius],
  );

  const prepayType = useWatch({ control, name: 'prepayType' });

  return (
    <View style={themed.card}>
      <View style={themed.header}>
        <View style={themed.headerIconBg}>
          <Text style={themed.headerIconText}>⚡</Text>
        </View>
        <View>
          <Text style={themed.headerTitle}>Prepay or Foreclose</Text>
          <Text style={themed.headerSub}>Reduce your loan burden</Text>
        </View>
      </View>

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

      <View style={themed.section}>
        <Text style={themed.sectionTitle}>Choose Action</Text>
        <Controller
          control={control}
          name="prepayType"
          render={({ field: { onChange, value } }) => (
            <View style={themed.typeGrid}>
              {PREPAY_TYPES.map(t => {
                const selected = value === t.id;
                return (
                  <Pressable
                    key={t.id}
                    onPress={() => onChange(t.id)}
                    style={({ pressed }) => [
                      themed.typeCard,
                      selected && themed.typeCardSelected,
                      { opacity: pressed ? 0.85 : 1 },
                    ]}
                  >
                    <Text style={themed.typeCardIcon}>{t.icon}</Text>
                    <Text
                      style={[
                        themed.typeCardLabel,
                        selected && themed.typeCardLabelSelected,
                      ]}
                    >
                      {t.label}
                    </Text>
                    <Text
                      style={[
                        themed.typeCardDesc,
                        selected && themed.typeCardDescSelected,
                      ]}
                    >
                      {t.desc}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        />
      </View>

      <View style={themed.section}>
        <View style={themed.sectionHeader}>
          <Text style={themed.sectionTitle}>Amount</Text>
          {prepayType === 'foreclose' && (
            <Pressable onPress={onFillMax}>
              <Text style={themed.fillMaxLink}>Pay full amount</Text>
            </Pressable>
          )}
        </View>
        <View style={themed.amountInputWrapper}>
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

      <View style={themed.section}>
        <FormPaymentModeSelect
          control={control}
          name="prepayMode"
          label="Payment Method"
          options={PAYMENT_MODES}
        />
      </View>

      <PrimaryButton
        title={
          prepayType === 'foreclose' ? 'Foreclose Loan' : 'Submit Prepayment'
        }
        suffix="→"
        onPress={onSubmit}
        style={{ margin: 18 }}
      />
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
    outstandingBanner: {
      margin: 18,
      padding: 18,
      alignItems: 'center',
      backgroundColor: colors.primary + '10',
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
      color: colors.primary,
    },
    outstandingDivider: {
      height: 1,
      width: '60%',
      marginVertical: 14,
      backgroundColor: colors.primary + '20',
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
      backgroundColor: colors.primary + '20',
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
      paddingHorizontal: 8,
      alignItems: 'center',
      borderRadius: radius.md,
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    typeCardSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    typeCardIcon: {
      fontSize: 24,
      marginBottom: 6,
    },
    typeCardLabel: {
      fontSize: 13,
      fontWeight: '700',
      textAlign: 'center',
      color: colors.text,
    },
    typeCardLabelSelected: {
      color: '#FFFFFF',
    },
    typeCardDesc: {
      fontSize: 10,
      fontWeight: '500',
      marginTop: 3,
      textAlign: 'center',
      color: colors.textSecondary,
    },
    typeCardDescSelected: {
      color: 'rgba(255,255,255,0.7)',
    },
    fillMaxLink: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.primary,
    },
    amountInputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      height: 52,
      paddingHorizontal: 14,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderColor: colors.border,
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
  });
}
