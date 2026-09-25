import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { ArrowLeft, Check, MapPin, Briefcase, IndianRupee, FileCheck2, Wallet, HeartHandshake, ClipboardList } from 'lucide-react-native';
import { createStyles } from './styles';
import { useForm } from 'react-hook-form';
import { useTheme } from '../../context/ThemeContext';
import { toast } from '../../components/toast/ToastProvider';
import { useProductList } from '../../hooks/useProductList';
import { useBranches } from '../../hooks/useBranches';
import { mapProductsToLoanTypes } from './loanTypes';
import type { ApplyLoanForm } from './types';
import type { RootStackParamList } from '../../../App';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import SelectBranchStep from './_components/SelectBranchStep';
import LoanTypeStep from './_components/LoanTypeStep';
import LoanAmountStep from './_components/LoanAmountStep';
import EmploymentStep from './_components/EmploymentStep';
import DocumentsStep, { DOCUMENTS } from './_components/DocumentsStep';
import CustomerReferenceStep from './_components/CustomerReferenceStep';
import SummaryStep from './_components/SummaryStep';

type Props = NativeStackScreenProps<RootStackParamList, 'ApplyLoan'>;

const STEPS = [
  { key: 'branch', label: 'Branch', icon: MapPin },
  { key: 'product', label: 'Loan Type', icon: Briefcase },
  { key: 'requirement', label: 'Loan Amount', icon: IndianRupee },
  { key: 'documents', label: 'Upload Documents', icon: FileCheck2 },
  { key: 'employment', label: 'Employment & Income', icon: Wallet },
  { key: 'reference', label: 'Customer Reference', icon: HeartHandshake },
  { key: 'review', label: 'Review Application', icon: ClipboardList },
];

export default function ApplyLoanScreen({ navigation }: Props) {
  const { theme, isDark } = useTheme();
  const { colors, spacing, radius } = theme;

  const headerBg = isDark ? '#1E293B' : colors.primary;
  const headerBgLight = isDark ? 'rgba(255,255,255,0.08)' : headerBg + '12';
  const decorBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)';

  const [step, setStep] = useState(1);

  const { products, loading } = useProductList();
  const loanTypes = mapProductsToLoanTypes(products);

  const { branches, nearest, coords, loading: branchesLoading, fallbackCoords } =
    useBranches();

  const { control, watch, setValue } = useForm<ApplyLoanForm>({
    defaultValues: {
      branchId: '',
      branchName: '',
      loanType: '',
      amount: '',
      tenure: '',
      purpose: '',
      documents: [],
      monthlyIncome: '',
      employment: '',
      references: [],
    },
  });

  const branchId = watch('branchId');
  const branchName = watch('branchName');
  const loanType = watch('loanType');
  const amount = watch('amount');
  const tenure = watch('tenure');
  const purpose = watch('purpose');
  const monthlyIncome = watch('monthlyIncome');
  const employment = watch('employment');
  const documents = watch('documents');
  const references = watch('references');

  useEffect(() => {
    const nearestBranch = branches[0];
    if (nearestBranch && branchId === '') {
      setValue('branchId', String(nearestBranch.branch.BranchId), {
        shouldValidate: true,
      });
      setValue('branchName', nearestBranch.branch.Branch_Name.trim());
    }
  }, [branches, branchId, setValue]);

  const canProceed = () => {
    if (step === 1) return branchId !== '';
    if (step === 2) return loanType !== '';
    if (step === 3) return amount !== '' && tenure !== '';
    if (step === 4) {
      const requiredKeys = DOCUMENTS.filter(d => d.required).map(d => d.key);
      return requiredKeys.every(key => documents.some(d => d.key === key));
    }
    if (step === 5) return monthlyIncome !== '' && employment !== '';
    if (step === 6) {
      const list = references ?? [];
      return (
        list.length > 0 &&
        list.every(
          ref =>
            ref.type !== '' &&
            (ref.name.trim() !== '' || ref.phone !== '') &&
            (ref.phone === '' || /^[0-9]{10}$/.test(ref.phone)),
        )
      );
    }
    return true;
  };

  const handleSubmit = () => {
    const submitted = {
      branchId,
      branchName,
      loanType,
      amount,
      tenure,
      purpose,
      documents,
      monthlyIncome,
      employment,
      references,
    };
    console.log('[ApplyLoanScreen] submitted:', submitted);
    toast.show(
      'Your loan application has been submitted successfully. Our team will contact you shortly.',
      'success',
    );
    navigation.goBack();
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
            <ArrowLeft size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={themed.topTitle}>Apply Loan</Text>
          <View style={themed.topSpacer} />
        </View>

        <View style={themed.headerBody}>
          <View style={themed.stepStepper}>
            {STEPS.map((item, index) => {
              const idx = index + 1;
              const done = idx < step;
              const current = idx === step;
              const Icon = item.icon;
              return (
                <React.Fragment key={item.key}>
                  {index > 0 ? (
                    <View
                      style={[
                        themed.stepConnector,
                        idx <= step && themed.stepConnectorActive,
                      ]}
                    />
                  ) : null}
                  <View
                    style={[
                      themed.stepDot,
                      done
                        ? themed.stepDotDone
                        : current
                        ? themed.stepDotCurrent
                        : themed.stepDotPending,
                    ]}
                  >
                    {done ? (
                      <Check size={12} color="#2563EB" strokeWidth={3.5} />
                    ) : (
                      <Icon
                        size={13}
                        color={
                          current ? colors.primary : 'rgba(255,255,255,0.55)'
                        }
                        strokeWidth={2.4}
                      />
                    )}
                  </View>
                </React.Fragment>
              );
            })}
          </View>
          <Text style={themed.currentStepName}>
            <Text style={themed.currentStepCount}>Step {step} of 7 · </Text>
            {STEPS[step - 1]?.label ?? ''}
          </Text>
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
            {step === 1 && (
              <SelectBranchStep
                control={control}
                themed={themed}
                branches={branches}
                loading={branchesLoading}
                coords={coords}
                fallbackCoords={fallbackCoords}
              />
            )}
            {step === 2 &&
              (loading ? (
                <View style={themed.loadingWrap}>
                  <ActivityIndicator color={colors.primary} size="large" />
                </View>
              ) : (
                <LoanTypeStep
                  control={control}
                  themed={themed}
                  loanTypes={loanTypes}
                  nearestBranch={nearest}
                  nearestCoords={coords}
                  nearestFallback={fallbackCoords}
                  nearestLoading={branchesLoading}
                />
              ))}
            {step === 3 && <LoanAmountStep control={control} themed={themed} />}
            {step === 4 && <DocumentsStep control={control} themed={themed} />}
            {step === 5 && <EmploymentStep control={control} themed={themed} />}
            {step === 6 && (
              <CustomerReferenceStep control={control} themed={themed} />
            )}
            {step === 7 && (
              <SummaryStep
                branchId={branchId}
                branches={branches}
                loanTypes={loanTypes}
                themed={themed}
                form={{
                  branchId,
                  branchName,
                  loanType,
                  amount,
                  tenure,
                  purpose,
                  documents,
                  monthlyIncome,
                  employment,
                  references,
                }}
              />
            )}
          </View>
          <View style={themed.bottomSpacer} />
        </ScrollView>

        <View style={themed.footer}>
          <Pressable
            onPress={() => (step < 7 ? setStep(step + 1) : handleSubmit())}
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
              {step < 7 ? 'Continue' : 'Submit Application'}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}