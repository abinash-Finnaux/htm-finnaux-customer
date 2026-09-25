import React from 'react';
import { Controller, type Control } from 'react-hook-form';

import type { createStyles } from '../styles';
import type { ApplyLoanForm } from '../types';
import type { LoanType } from '../loanTypes';
import type { NearestBranch } from '../../../hooks/useBranches';
import type { LatLong } from '../../../utils/geo';

import LoanTypeSelector from './LoanTypeSelector';
import SectionHeaderText from '../../../components/typography/SectionHeaderText';

type Props = {
  control: Control<ApplyLoanForm>;
  themed: ReturnType<typeof createStyles>;
  loanTypes: LoanType[];
  nearestBranch: NearestBranch | null;
  nearestCoords: LatLong | null;
  nearestFallback: boolean;
  nearestLoading: boolean;
};

export default function LoanTypeStep({
  control,
  themed,
  loanTypes,
  nearestBranch,
  nearestCoords,
  nearestFallback,
  nearestLoading,
}: Props) {
  return (
    <>
      <SectionHeaderText title="Select Loan Type" />
      <Controller
        control={control}
        name="loanType"
        render={({ field: { onChange, value } }) => (
          <LoanTypeSelector
            value={value}
            onChange={onChange}
            themed={themed}
            loanTypes={loanTypes}
          />
        )}
      />
    </>
  );
}
