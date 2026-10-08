import React from 'react';
import { Controller, type Control } from 'react-hook-form';
import { Text, View } from 'react-native';
import { Briefcase, IndianRupee, BadgeCheck, Landmark } from 'lucide-react-native';

import type { createStyles } from '../styles';
import type { ApplyLoanForm } from '../types';
import type { LoanType } from '../loanTypes';

import LoanTypeSelector from './LoanTypeSelector';

type Props = {
  control: Control<ApplyLoanForm>;
  themed: ReturnType<typeof createStyles>;
  loanTypes: LoanType[];
};

export default function LoanTypeStep({
  control,
  themed,
  loanTypes,
}: Props) {
  return (
    <>
      <View style={themed.accHero}>
        <View style={themed.accHeroIcon}>
          <Briefcase size={24} color="#FFFFFF" />
        </View>
        <View style={themed.accHeroBody}>
          <Text style={themed.accHeroTitle}>Select Loan Type</Text>
          <Text style={themed.accHeroText}>
            Pick the product that fits your needs. You can compare limits and
            terms before you continue.
          </Text>
          <View style={themed.accHeroChips}>
            <View style={themed.accHeroChip}>
              <IndianRupee size={12} color="#FFFFFF" />
              <Text style={themed.accHeroChipText}>Flexible limits</Text>
            </View>
            <View style={themed.accHeroChip}>
              <BadgeCheck size={12} color="#FFFFFF" />
              <Text style={themed.accHeroChipText}>Verified rates</Text>
            </View>
            {loanTypes.length > 0 ? (
              <View style={themed.accHeroChip}>
                <Landmark size={12} color="#FFFFFF" />
                <Text style={themed.accHeroChipText}>
                  {loanTypes.length} products
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

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