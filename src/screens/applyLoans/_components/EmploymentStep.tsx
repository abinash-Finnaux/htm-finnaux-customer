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
  IndianRupee,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import FormTextInput from '../../../components/forms/FormTextInput';
import type { createStyles } from '../styles';
import type { ApplyLoanForm } from '../types';
import { CardHead } from './FormSectionCard';

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
      <View style={themed.accHero}>
        <View style={themed.accHeroIcon}>
          <Wallet size={24} color="#FFFFFF" />
        </View>
        <View style={themed.accHeroBody}>
          <Text style={themed.accHeroTitle}>Income & Expenditure</Text>
          <Text style={themed.accHeroText}>
            Your income and employment help us assess your repayment
            capability.
          </Text>
          <View style={themed.accHeroChips}>
            <View style={themed.accHeroChip}>
              <IndianRupee size={12} color="#FFFFFF" />
              <Text style={themed.accHeroChipText}>Loan eligibility</Text>
            </View>
            <View style={themed.accHeroChip}>
              <TrendingUp size={12} color="#FFFFFF" />
              <Text style={themed.accHeroChipText}>Repayment capacity</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={themed.accCard}>
        <CardHead
          step="01"
          title="Monthly Income"
          subtitle="Gross monthly earnings"
          themed={themed}
          icon={IndianRupee}
          accent="emerald"
        />

        <FormTextInput
          control={control}
          name="monthlyIncome"
          label="Monthly Income (₹) *"
          placeholder="Enter your monthly income"
          rules={{ required: 'Monthly income is required' }}
          keyboardType="numeric"
        />
      </View>

      <View style={themed.accCard}>
        <CardHead
          step="02"
          title="Employment Type"
          subtitle="Pick the option that fits you best"
          themed={themed}
          icon={Briefcase}
          accent="blue"
        />

        <Controller
          control={control}
          name="employment"
          rules={{ required: 'Employment type is required' }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <View style={themed.employmentSec}>
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
      </View>

      <View style={themed.accNote}>
        <ShieldCheck size={16} color="#2563EB" />
        <Text style={themed.accNoteText}>
          Your income details are used only to assess eligibility and
          repayment capacity. They stay confidential.
        </Text>
      </View>
    </>
  );
}