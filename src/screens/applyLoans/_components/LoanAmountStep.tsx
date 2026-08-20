import React from 'react';
import { type Control } from 'react-hook-form';
import FormTextInput from '../../../components/forms/FormTextInput';
import FormChipSelect from '../../../components/forms/FormChipSelect';
import SectionHeaderText from '../../../components/typography/SectionHeaderText';
import type { createStyles } from '../styles';
import type { ApplyLoanForm } from '../types';

const TENURE_OPTIONS = ['12', '24', '36', '48', '60'];

type Props = {
  control: Control<ApplyLoanForm>;
  themed: ReturnType<typeof createStyles>;
};

export default function LoanAmountStep({ control, themed }: Props) {
  return (
    <>
      <FormTextInput
        control={control}
        name="amount"
        label="Loan Amount (₹)"
        placeholder="Enter loan amount"
        keyboardType="numeric"
        rules={{ required: 'Loan amount is required' }}
      />

      <FormChipSelect
        control={control}
        name="tenure"
        label="Repayment Tenure"
        options={TENURE_OPTIONS}
        suffix="months"
      />
      <FormTextInput
        control={control}
        name="purpose"
        label="Loan Purpose (Optional)"
        placeholder="Describe purpose of loan..."
        multiline
      />
    </>
  );
}
