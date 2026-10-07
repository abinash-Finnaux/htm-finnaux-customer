import React from 'react';
import { Text, View } from 'react-native';
import type { Control } from 'react-hook-form';
import { Info, Landmark } from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import SectionHeaderText from '../../../components/typography/SectionHeaderText';
import FormTextInput from '../../../components/forms/FormTextInput';
import FormSelectOption from '../../../components/forms/FormSelectOption';
import type { createStyles } from '../styles';
import type { ApplyLoanForm } from '../types';

const ACCOUNT_RE = /^[0-9]{9,18}$/;
const IFSC_RE = /^[A-Z]{4}0[A-Z0-9]{6}$/;

const formatAccount = (text: string) =>
  text.replace(/[^0-9]/g, '').slice(0, 18);
const formatIfsc = (text: string) =>
  text
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 11);

type Props = {
  control: Control<ApplyLoanForm>;
  themed: ReturnType<typeof createStyles>;
};

export default function AccountInfoStep({ control, themed }: Props) {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <>
      <SectionHeaderText
        title="Account Info"
        subtitle="Share the bank account where your loan will be disbursed."
      />
      <View style={themed.incomeHeroCard}>
        <View style={themed.incomeHeroIcon}>
          <Landmark size={24} color="#F59E0B" />
        </View>
        <View style={themed.incomeHeroBody}>
          <Text style={themed.incomeHeroTitle}>Disbursal Account</Text>
          <Text style={themed.incomeHeroText}>
            Loan disbursal and repayments will be linked to this account.
          </Text>
        </View>
      </View>
      <FormTextInput
        control={control}
        name="accountInfo.accountHolderName"
        label="Account Holder Name *"
        placeholder="Enter name as per bank records"
        rules={{ required: 'Account holder name is required' }}
        autoCapitalize="words"
        autoCorrect={false}
      />
      <FormTextInput
        control={control}
        name="accountInfo.bankName"
        label="Bank Name *"
        placeholder="Enter your bank name"
        rules={{ required: 'Bank name is required' }}
        autoCapitalize="words"
        autoCorrect={false}
      />
      <FormTextInput
        control={control}
        name="accountInfo.accountNumber"
        label="Account Number *"
        placeholder="Enter bank account number"
        keyboardType="numeric"
        maxLength={18}
        formatText={formatAccount}
        rules={{
          required: 'Account number is required',
          pattern: {
            value: ACCOUNT_RE,
            message: 'Enter a valid account number (9–18 digits)',
          },
        }}
      />
      <FormTextInput
        control={control}
        name="accountInfo.confirmAccountNumber"
        label="Re-enter Account Number *"
        placeholder="Re-enter the account number"
        keyboardType="numeric"
        maxLength={18}
        formatText={formatAccount}
        rules={{
          required: 'Please re-enter the account number',
          pattern: {
            value: ACCOUNT_RE,
            message: 'Enter a valid account number (9–18 digits)',
          },
          validate: (value, formValues) =>
            value === formValues?.accountInfo?.accountNumber ||
            'Account numbers do not match',
        }}
      />
      <FormTextInput
        control={control}
        name="accountInfo.ifsc"
        label="IFSC Code *"
        placeholder="e.g. SBIN0001234"
        autoCapitalize="characters"
        autoCorrect={false}
        formatText={formatIfsc}
        rules={{
          required: 'IFSC code is required',
          pattern: {
            value: IFSC_RE,
            message: 'Enter a valid IFSC code (e.g. SBIN0001234)',
          },
        }}
      />
      <FormSelectOption
        control={control}
        name="accountInfo.accountType"
        label="Account Type *"
        options={['Savings', 'Current', 'Salary']}
        rules={{ required: 'Select your account type' }}
      />
      <View style={themed.refEntryNote}>
        <Info size={12} color={colors.textSecondary} />
        <Text style={themed.refEntryNoteText}>
          Make sure the account details match your bank records to avoid
          disbursal issues.
        </Text>
      </View>
    </>
  );
}
