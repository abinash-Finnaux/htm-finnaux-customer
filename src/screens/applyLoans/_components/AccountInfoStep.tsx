import React from 'react';
import { Text, View } from 'react-native';
import { useWatch, type Control } from 'react-hook-form';
import {
  CircleAlert,
  CircleCheck,
  Landmark,
  ShieldCheck,
} from 'lucide-react-native';
import SectionHeaderText from '../../../components/typography/SectionHeaderText';
import FormTextInput from '../../../components/forms/FormTextInput';
import FormSelectOption from '../../../components/forms/FormSelectOption';
import { CardHead } from './FormSectionCard';
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
  const accountNumber = useWatch({
    control,
    name: 'accountInfo.accountNumber',
  });
  const confirmAccountNumber = useWatch({
    control,
    name: 'accountInfo.confirmAccountNumber',
  });

  const hasBoth = Boolean(accountNumber && confirmAccountNumber);
  const accountsMatch = hasBoth && accountNumber === confirmAccountNumber;
  const accountsMismatch = hasBoth && accountNumber !== confirmAccountNumber;

  const matchLabel = accountsMatch
    ? 'Numbers match'
    : accountsMismatch
    ? 'Does not match'
    : 'Verify twice';

  const matchIcon = accountsMatch ? (
    <CircleCheck size={12} color="#10B981" strokeWidth={3} />
  ) : accountsMismatch ? (
    <CircleAlert size={12} color="#F87171" strokeWidth={3} />
  ) : null;

  return (
    <>
      <SectionHeaderText
        title="Account Info"
        subtitle="Share the bank account where your loan will be disbursed."
      />

      <View style={themed.accHero}>
        <View style={themed.accHeroIcon}>
          <Landmark size={22} color="#FFFFFF" />
        </View>
        <View style={themed.accHeroBody}>
          <Text style={themed.accHeroTitle}>Disbursal Account</Text>
          <Text style={themed.accHeroText}>
            Funds are credited here and EMIs are debited automatically.
          </Text>
        </View>
      </View>

      <View style={themed.accCard}>
        <CardHead
          step="01"
          title="Account Holder"
          subtitle="Exactly as per bank records"
          themed={themed}
        />
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
      </View>

      <View style={themed.accCard}>
        <CardHead
          step="02"
          title="Account Number"
          subtitle="Enter it twice for safety"
          themed={themed}
          right={
            <View
              style={[
                themed.accChip,
                accountsMatch && themed.accChipOk,
                accountsMismatch && themed.accChipBad,
              ]}
            >
              {matchIcon}
              <Text
                style={[
                  themed.accChipText,
                  accountsMatch && themed.accChipTextOk,
                  accountsMismatch && themed.accChipTextBad,
                ]}
              >
                {matchLabel}
              </Text>
            </View>
          }
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
      </View>

      <View style={themed.accCard}>
        <CardHead
          step="03"
          title="Bank Identification"
          subtitle="IFSC locates your branch"
          themed={themed}
        />

        {/* <View style={themed.accRow}> */}
        <View style={themed.accCol}>
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
                message: 'Enter a valid IFSC (e.g. SBIN0001234)',
              },
            }}
          />
        </View>
        <View style={themed.accCol}>
          <FormSelectOption
            control={control}
            name="accountInfo.accountType"
            label="Account Type *"
            options={['Savings', 'Current', 'Salary']}
            rules={{ required: 'Select your account type' }}
          />
        </View>
        {/* </View> */}
      </View>

      <View style={themed.accNote}>
        <ShieldCheck size={16} color="#2563EB" />
        <Text style={themed.accNoteText}>
          Make sure the account details match your bank records to avoid
          disbursal issues.
        </Text>
      </View>
    </>
  );
}
