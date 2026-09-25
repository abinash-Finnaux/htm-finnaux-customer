import React from 'react';
import { Controller, type Control } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import {
  Wallet,
  Briefcase,
  UserRound,
  Store,
  Laptop,
  Check,
} from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import FormTextInput from '../../../components/forms/FormTextInput';
import SectionHeaderText from '../../../components/typography/SectionHeaderText';
import type { createStyles } from '../styles';
import type { ApplyLoanForm } from '../types';

const EMPLOYMENT_TYPES: { value: string; icon: React.ElementType }[] = [
  { value: 'Salaried', icon: Briefcase },
  { value: 'Self-Employed', icon: UserRound },
  { value: 'Business Owner', icon: Store },
  { value: 'Freelancer', icon: Laptop },
];

type Props = {
  control: Control<ApplyLoanForm>;
  themed: ReturnType<typeof createStyles>;
};

export default function EmploymentStep({ control, themed }: Props) {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <>
      <SectionHeaderText
        title="Employment & Income"
        subtitle="Help us assess your repayment capability."
      />

      <View style={themed.incomeHeroCard}>
        <View style={themed.incomeHeroIcon}>
          <Wallet size={24} color="#10B981" />
        </View>
        <View style={themed.incomeHeroBody}>
          <Text style={themed.incomeHeroTitle}>Monthly Income</Text>
          <Text style={themed.incomeHeroText}>
            Your monthly income helps us decide your loan eligibility and
            amount.
          </Text>
        </View>
      </View>

      <FormTextInput
        control={control}
        name="monthlyIncome"
        label="Monthly Income (₹) *"
        placeholder="Enter your monthly income"
        rules={{ required: 'Monthly income is required' }}
        keyboardType="numeric"
      />

      <Controller
        control={control}
        name="employment"
        rules={{ required: 'Employment type is required' }}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <View style={themed.employmentSec}>
            <Text style={themed.employmentLabel}>Employment Type</Text>
            <View style={themed.employmentGrid}>
              {EMPLOYMENT_TYPES.map(({ value: v, icon: Icon }) => {
                const selected = value === v;
                return (
                  <Pressable
                    key={v}
                    onPress={() => onChange(v)}
                    style={({ pressed }) => [
                      themed.employmentOptCard,
                      selected
                        ? themed.employmentOptCardSelected
                        : pressed
                        ? themed.employmentOptCardPressed
                        : themed.employmentOptCardUnselected,
                    ]}
                  >
                    <View
                      style={[
                        themed.employmentOptIcon,
                        selected && themed.employmentOptIconSelected,
                      ]}
                    >
                      <Icon
                        size={18}
                        color={selected ? '#FFFFFF' : colors.primary}
                      />
                    </View>
                    <Text
                      style={[
                        themed.employmentOptLabel,
                        selected
                          ? themed.employmentOptLabelSelected
                          : themed.employmentOptLabelUnselected,
                      ]}
                    >
                      {v}
                    </Text>
                    {selected ? (
                      <Check
                        size={16}
                        color="#FFFFFF"
                        style={themed.employmentOptTick}
                      />
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
            {error ? (
              <Text style={themed.employmentError}>{error.message}</Text>
            ) : null}
          </View>
        )}
      />
    </>
  );
}