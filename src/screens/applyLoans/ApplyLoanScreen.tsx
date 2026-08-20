import React, { useState } from 'react';
import {
  Text,
  View,
  Alert,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { useForm } from 'react-hook-form';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../context/ThemeContext';
import type { RootStackParamList } from '../../../App';
import { createStyles } from './styles';
import LoanTypeStep from './_components/LoanTypeStep';
import LoanAmountStep from './_components/LoanAmountStep';
import EmploymentStep from './_components/EmploymentStep';
import type { ApplyLoanForm } from './types';

type Props = NativeStackScreenProps<RootStackParamList, 'ApplyLoan'>;

export default function ApplyLoanScreen({ navigation }: Props) {
  const { theme, isDark } = useTheme();
  const { colors, spacing, radius } = theme;

  const headerBg = isDark ? '#1E293B' : colors.primary;
  const headerBgLight = isDark ? 'rgba(255,255,255,0.08)' : headerBg + '12';
  const decorBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)';

  const [step, setStep] = useState(1);

  const { control, watch } = useForm<ApplyLoanForm>({
    defaultValues: {
      loanType: '',
      amount: '',
      tenure: '',
      purpose: '',
      monthlyIncome: '',
      employment: '',
    },
  });

  const loanType = watch('loanType');
  const amount = watch('amount');
  const tenure = watch('tenure');
  const monthlyIncome = watch('monthlyIncome');
  const employment = watch('employment');

  const canProceed = () => {
    if (step === 1) return loanType !== '';
    if (step === 2) return amount !== '' && tenure !== '';
    return monthlyIncome !== '' && employment !== '';
  };

  const handleSubmit = () => {
    Alert.alert(
      'Application Submitted',
      'Your loan application has been submitted successfully. Our team will contact you shortly.',
      [{ text: 'OK', onPress: () => navigation.goBack() }],
    );
  };

  const themed = createStyles(
    colors,
    spacing,
    radius,
    headerBg,
    headerBgLight,
    decorBg,
  );

  return (
    <View style={themed.root}>
      <View style={themed.header}>
        <View style={themed.decor1} />
        <View style={themed.decor2} />
        <View style={themed.decor3} />

        <View style={themed.topBar}>
          <Pressable
            onPress={() => (step > 1 ? setStep(step - 1) : navigation.goBack())}
            style={({ pressed }) => [
              themed.backBtn,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Text style={themed.backBtnText}>←</Text>
          </Pressable>
          <Text style={themed.topTitle}>Apply Loan</Text>
          <View style={themed.topSpacer} />
        </View>

        <View style={themed.headerBody}>
          <Text style={themed.stepLabel}>Step {step} of 3</Text>
          <View style={themed.progressBar}>
            {[1, 2, 3].map(s => (
              <View
                key={s}
                style={[
                  themed.progressDot,
                  s <= step
                    ? themed.progressDotActive
                    : themed.progressDotInactive,
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={themed.flex}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={themed.flex}
          contentContainerStyle={themed.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={themed.contentPadding}>
            {step === 1 && <LoanTypeStep control={control} themed={themed} />}
            {step === 2 && <LoanAmountStep control={control} themed={themed} />}
            {step === 3 && (
              <EmploymentStep
                control={control}
                loanType={loanType}
                amount={amount}
                tenure={tenure}
                themed={themed}
              />
            )}
          </View>
          <View style={themed.bottomSpacer} />
        </ScrollView>

        <View style={themed.footer}>
          <Pressable
            onPress={() => (step < 3 ? setStep(step + 1) : handleSubmit())}
            disabled={!canProceed()}
            style={({ pressed }) => [
              themed.nextBtn,
              canProceed() ? themed.nextBtnEnabled : themed.nextBtnDisabled,
              { opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <Text
              style={[
                themed.nextBtnText,
                { color: canProceed() ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              {step < 3 ? 'Continue' : 'Submit Application'}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
