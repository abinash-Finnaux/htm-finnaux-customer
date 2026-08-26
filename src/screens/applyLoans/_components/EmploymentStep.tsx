import React from 'react';
import { Text, View } from 'react-native';
import { type Control } from 'react-hook-form';

import type { createStyles } from '../styles';
import type { ApplyLoanForm } from '../types';
import FormTextInput from '../../../components/forms/FormTextInput';
import FormSelectOption from '../../../components/forms/FormSelectOption';

const LOAN_TYPES = [
  { id: 'personal', label: 'Personal Loan' },
  { id: 'business', label: 'Business Loan' },
  { id: 'home', label: 'Home Loan' },
  { id: 'vehicle', label: 'Vehicle Loan' },
];

const EMPLOYMENT_TYPES = [
  'Salaried',
  'Self-Employed',
  'Business Owner',
  'Freelancer',
];

type Props = {
  control: Control<ApplyLoanForm>;
  loanType: string;
  amount: string;
  tenure: string;
  themed: ReturnType<typeof createStyles>;
};

export default function EmploymentStep({
  control,
  loanType,
  amount,
  tenure,
  themed,
}: Props) {
  return (
    <>
      <FormTextInput
        control={control}
        name="monthlyIncome"
        label="Monthly Income *"
        placeholder="Enter your monthly income"
        rules={{ required: 'Monthly income is required' }}
        keyboardType="numeric"
      />

      <FormSelectOption
        control={control}
        name="employment"
        label="Employment Type"
        options={EMPLOYMENT_TYPES}
        rules={{ required: 'Employment type is required' }}
      />

      <View style={themed.summaryCard}>
        <Text style={themed.summaryTitle}>Application Summary</Text>
        <View style={themed.summaryDivider} />
        {[
          {
            label: 'Loan Type',
            value: LOAN_TYPES.find(l => l.id === loanType)?.label || '',
          },
          {
            label: 'Amount',
            value: amount ? `₹${Number(amount).toLocaleString('en-IN')}` : '',
          },
          {
            label: 'Tenure',
            value: tenure ? `${tenure} months` : '',
          },
          { label: 'Employment', value: '' },
        ].map((item, i) => (
          <View key={i} style={themed.summaryRow}>
            <Text style={themed.summaryLabel}>{item.label}</Text>
            <Text style={themed.summaryValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    </>
  );
}
