import React from 'react';
import { Controller, type Control } from 'react-hook-form';
import { Pressable, Text, TextInput, View } from 'react-native';
import { IndianRupee, X } from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import SectionHeaderText from '../../../components/typography/SectionHeaderText';
import type { createStyles } from '../styles';
import type { ApplyLoanForm } from '../types';

const QUICK_AMOUNTS = [
  '50000',
  '100000',
  '200000',
  '500000',
  '1000000',
  '2000000',
];

const TENURE_OPTIONS = ['12', '24', '36', '48', '60'];

const inr = (value: string) =>
  value && Number.isFinite(Number(value))
    ? `₹${Number(value).toLocaleString('en-IN')}`
    : '';

type Props = {
  control: Control<ApplyLoanForm>;
  themed: ReturnType<typeof createStyles>;
};

export default function LoanAmountStep({ control, themed }: Props) {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <>
      <SectionHeaderText
        title="Loan Requirement"
        subtitle="Tell us how much you need and for how long."
      />

      <Controller
        control={control}
        name="amount"
        rules={{ required: 'Loan amount is required' }}
        render={({ field: { value, onChange }, fieldState: { error } }) => {
          const amount = value ?? '';
          return (
            <View
              style={[
                themed.amountHero,
                error && themed.amountHeroError,
              ]}
            >
              <View style={themed.amountHeroHeader}>
                <View style={themed.amountHeroLabelRow}>
                  <View style={themed.amountHeroIcon}>
                    <IndianRupee size={18} color="#F59E0B" />
                  </View>
                  <Text style={themed.amountHeroLabel}>Loan Amount (₹)</Text>
                </View>
                {amount !== '' ? (
                  <Pressable
                    onPress={() => onChange('')}
                    style={({ pressed }) => [
                      themed.amountClear,
                      { opacity: pressed ? 0.6 : 1 },
                    ]}
                  >
                    <X size={15} color={colors.textSecondary} />
                  </Pressable>
                ) : null}
              </View>

              <View style={themed.amountInputRow}>
                <Text style={themed.amountPrefix}>₹</Text>
                <TextInput
                  value={amount}
                  onChangeText={text =>
                    onChange(text.replace(/[^0-9]/g, '').slice(0, 9))
                  }
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary + '80'}
                  style={themed.amountInput}
                />
              </View>

              {error ? (
                <Text style={themed.amountError}>{error.message}</Text>
              ) : null}

              <View style={themed.quickAmountWrap}>
                {QUICK_AMOUNTS.map(a => {
                  const selected = amount === a;
                  return (
                    <Pressable
                      key={a}
                      onPress={() => onChange(selected ? '' : a)}
                      style={({ pressed }) => [
                        themed.quickAmountChip,
                        selected
                          ? themed.quickAmountChipSelected
                          : pressed
                          ? themed.quickAmountChipPressed
                          : themed.quickAmountChipUnselected,
                      ]}
                    >
                      <Text
                        style={[
                          themed.quickAmountChipText,
                          selected
                            ? themed.quickAmountChipTextSelected
                            : themed.quickAmountChipTextUnselected,
                        ]}
                      >
                        {inr(a)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        }}
      />

      <Controller
        control={control}
        name="tenure"
        rules={{ required: 'Repayment tenure is required' }}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <View style={themed.tenureSec}>
            <Text style={themed.tenureLabel}>Repayment Tenure *</Text>
            <View style={themed.tenureRow}>
              {TENURE_OPTIONS.map(opt => {
                const selected = value === opt;
                return (
                  <Pressable
                    key={opt}
                    onPress={() => onChange(opt)}
                    style={({ pressed }) => [
                      themed.tenureChip,
                      selected
                        ? themed.tenureChipSelected
                        : pressed
                        ? themed.tenureChipPressed
                        : themed.tenureChipUnselected,
                    ]}
                  >
                    <Text
                      style={[
                        themed.tenureChipValue,
                        selected
                          ? themed.tenureChipValueSelected
                          : themed.tenureChipValueUnselected,
                      ]}
                    >
                      {opt}
                    </Text>
                    <Text
                      style={[
                        themed.tenureChipUnit,
                        selected
                          ? themed.tenureChipUnitSelected
                          : themed.tenureChipUnitUnselected,
                      ]}
                    >
                      months
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {error ? (
              <Text style={themed.amountError}>{error.message}</Text>
            ) : null}
          </View>
        )}
      />

      <Controller
        control={control}
        name="purpose"
        render={({ field: { value, onChange } }) => {
          const text = value ?? '';
          const words = text.trim() ? text.trim().split(/\s+/).length : 0;
          return (
            <View style={themed.purposeEditorCard}>
              <View style={themed.purposeEditorHeader}>
                <Text style={themed.purposeEditorTitle}>
                  Purpose of Loan
                </Text>
                <Text style={themed.purposeEditorCount}>
                  {text.length} chars
                </Text>
              </View>

              <TextInput
                multiline
                value={text}
                onChangeText={onChange}
                placeholder="Describe the purpose of this loan. You can write multiple lines..."
                placeholderTextColor={colors.textSecondary + '99'}
                style={themed.purposeEditorInput}
                textAlignVertical="top"
              />

              <View style={themed.purposeEditorFooter}>
                <Text style={themed.purposeEditorHint}>
                  {words} {words === 1 ? 'word' : 'words'}
                </Text>
                <Text style={themed.purposeEditorHint}>
                  Optional · Free text
                </Text>
              </View>
            </View>
          );
        }}
      />
    </>
  );
}