import React from 'react';
import { Text, View } from 'react-native';
import type { Control } from 'react-hook-form';
import { Info, UserRound } from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import SectionHeaderText from '../../../components/typography/SectionHeaderText';
import FormTextInput from '../../../components/forms/FormTextInput';
import FormDateOfBirthInput from '../../../components/forms/FormDateOfBirthInput';
import FormSelectOption from '../../../components/forms/FormSelectOption';
import type { createStyles } from '../styles';
import type { ApplyLoanForm } from '../types';

const PHONE_RE = /^[0-9]{10}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const AADHAAR_RE = /^[0-9]{12}$/;

const formatPhone = (text: string) =>
  text.replace(/[^0-9]/g, '').slice(0, 10);
const formatAadhaar = (text: string) =>
  text.replace(/[^0-9]/g, '').slice(0, 12);
const formatPan = (text: string) =>
  text.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);

type Props = {
  control: Control<ApplyLoanForm>;
  themed: ReturnType<typeof createStyles>;
};

export default function CustomerInfoStep({ control, themed }: Props) {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <>
      <SectionHeaderText
        title="Customer Info"
        subtitle="Tell us a bit about yourself so we can verify your eligibility."
      />

      <View style={themed.incomeHeroCard}>
        <View style={themed.incomeHeroIcon}>
          <UserRound size={24} color="#3B82F6" />
        </View>
        <View style={themed.incomeHeroBody}>
          <Text style={themed.incomeHeroTitle}>Applicant Details</Text>
          <Text style={themed.incomeHeroText}>
            Your personal details help us verify your identity and tailor
            your loan offer.
          </Text>
        </View>
      </View>

      <FormTextInput
        control={control}
        name="customerInfo.fullName"
        label="Full Name *"
        placeholder="Enter your full name as per ID"
        rules={{ required: 'Full name is required' }}
        autoCapitalize="words"
        autoCorrect={false}
      />

      <FormTextInput
        control={control}
        name="customerInfo.mobile"
        label="Mobile Number *"
        placeholder="Enter 10-digit mobile number"
        keyboardType="phone-pad"
        maxLength={10}
        formatText={formatPhone}
        rules={{
          required: 'Mobile number is required',
          pattern: {
            value: PHONE_RE,
            message: 'Enter a valid 10-digit mobile number',
          },
        }}
      />

      <FormTextInput
        control={control}
        name="customerInfo.email"
        label="Email (Optional)"
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCorrect={false}
        autoCapitalize="none"
        rules={{
          pattern: {
            value: EMAIL_RE,
            message: 'Enter a valid email address',
          },
        }}
      />

      <FormDateOfBirthInput
        control={control}
        name="customerInfo.dob"
        label="Date of Birth *"
        rules={{ required: 'Date of birth is required' }}
      />

      <FormSelectOption
        control={control}
        name="customerInfo.gender"
        label="Gender *"
        options={['Male', 'Female', 'Other']}
        rules={{ required: 'Select your gender' }}
      />

      <FormTextInput
        control={control}
        name="customerInfo.pan"
        label="PAN (Optional)"
        placeholder="ABCDE1234F"
        autoCapitalize="characters"
        autoCorrect={false}
        formatText={formatPan}
        rules={{
          pattern: {
            value: PAN_RE,
            message: 'Enter a valid PAN (e.g. ABCDE1234F)',
          },
        }}
      />

      <FormTextInput
        control={control}
        name="customerInfo.aadhaar"
        label="Aadhaar (Optional)"
        placeholder="Enter 12-digit Aadhaar number"
        keyboardType="numeric"
        maxLength={12}
        formatText={formatAadhaar}
        rules={{
          pattern: {
            value: AADHAAR_RE,
            message: 'Enter a valid 12-digit Aadhaar number',
          },
        }}
      />

      <View style={themed.refEntryNote}>
        <Info size={12} color={colors.textSecondary} />
        <Text style={themed.refEntryNoteText}>
          Your details stay confidential and are used only for loan
          verification.
        </Text>
      </View>
    </>
  );
}