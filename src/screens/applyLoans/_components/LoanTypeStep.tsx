import React from 'react';
import { Controller, type Control } from 'react-hook-form';

import type { createStyles } from '../styles';
import type { ApplyLoanForm } from '../types';

import LoanTypeSelector from './LoanTypeSelector';
import SectionHeaderText from '../../../components/typography/SectionHeaderText';

type Props = {
  control: Control<ApplyLoanForm>;
  themed: ReturnType<typeof createStyles>;
};

export default function LoanTypeStep({ control, themed }: Props) {
  return (
    <>
      <SectionHeaderText title="Select Loan Type" />
      <Controller
        control={control}
        name="loanType"
        render={({ field: { onChange, value } }) => (
          <LoanTypeSelector value={value} onChange={onChange} themed={themed} />
        )}
      />
    </>
  );
}
