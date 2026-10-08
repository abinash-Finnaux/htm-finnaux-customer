import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Text,
  View,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  AppState,
} from 'react-native';
import {
  ArrowLeft,
  Briefcase,
  CarFront,
  Check,
  ClipboardList,
  House,
  IndianRupee,
  MapPin,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { createStyles } from './styles';
import { useForm } from 'react-hook-form';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { toast } from '../../components/toast/ToastProvider';
import { useProductList } from '../../hooks/useProductList';
import { useBranches } from '../../hooks/useBranches';
import { useProductPages } from '../../hooks/useProductPages';
import { useProductRequiredDocs } from '../../hooks/useProductRequiredDocs';
import { mapProductsToLoanTypes } from './loanTypes';
import {
  loadLoanDraft,
  saveLoanDraft,
  clearLoanDraft,
  reviveLoanDraftForm,
  DRAFT_VERSION,
  type LoanDraft,
} from './services/draft';
import {
  FALLBACK_PRODUCT_PAGES,
  getProductPageMeta,
  isVehicleCategory,
} from './productPageSteps';
import type { ProductPageInfo } from '../../api/masters';
import type { ApplyLoanForm } from './types';
import type { RootStackParamList } from '../../../App';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import SelectBranchStep from './_components/SelectBranchStep';
import LoanTypeStep from './_components/LoanTypeStep';
import LoanAmountStep from './_components/LoanAmountStep';
import EmploymentStep from './_components/EmploymentStep';
import DocumentsStep from './_components/DocumentsStep';
import CustomerReferenceStep from './_components/CustomerReferenceStep';
import CustomerInfoStep from './_components/CustomerInfoStep';
import AccountInfoStep from './_components/AccountInfoStep';
import AssetsStep from './_components/AssetsStep';
import VehicleDetailStep from './_components/VehicleDetailStep';
import SummaryStep from './_components/SummaryStep';
import PlaceholderStep from './_components/PlaceholderStep';

type Props = NativeStackScreenProps<RootStackParamList, 'ApplyLoan'>;

type StepDef = {
  key: string;
  label: string;
  icon: LucideIcon;
};

const STEP_DOT = 27;
const STEP_CONNECTOR = 8;
const STEP_H_PAD = 16;

function buildSteps(
  pages: ProductPageInfo[],
  category: string,
): StepDef[] {
  const isVehicle = isVehicleCategory(category);
  const dynamic = pages.filter(
    page => getProductPageMeta(page.MM_Id).key !== 'loanInfo',
  );
  return [
    { key: 'product', label: 'Loan Type', icon: Briefcase },
    { key: 'branch', label: 'Select Branch', icon: MapPin },
    { key: 'loanInfo', label: 'Loan Details', icon: IndianRupee },
    ...dynamic.map(page => {
      const meta = getProductPageMeta(page.MM_Id);
      if (isVehicle && meta.key === 'assets') {
        return { key: 'vehicle', label: page.MM_Name, icon: CarFront };
      }
      return { key: meta.key, label: page.MM_Name, icon: meta.icon };
    }),
    { key: 'review', label: 'Review & Submit', icon: ClipboardList },
  ];
}

export default function ApplyLoanScreen({ navigation }: Props) {
  const { theme, isDark } = useTheme();
  const { colors, spacing, radius } = theme;

  const headerBg = isDark ? '#1E293B' : colors.primary;
  const headerBgLight = isDark ? 'rgba(255,255,255,0.08)' : headerBg + '12';
  const decorBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)';

  const [step, setStep] = useState(1);
  const stepperRef = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const [stepperWidth, setStepperWidth] = useState(0);
  const [fetchedProductId, setFetchedProductId] = useState<number | null>(null);
  const advanceAfterLoadRef = useRef(false);

  const { products, loading } = useProductList();
  const loanTypes = mapProductsToLoanTypes(products);

  const { user } = useUser();

  const loanId = useMemo(
    () =>
      user?.applications?.[0]?.Loan_Id ??
      (user?.applications?.[0]?.ApplicationIdentity
        ? String(user.applications[0].ApplicationIdentity)
        : ''),
    [user],
  );

  const { branches, coords, loading: branchesLoading, fallbackCoords, gpsStatus, refetch: refetchBranches } =
    useBranches();

  const { control, watch, setValue, reset, getValues } = useForm<ApplyLoanForm>({
    mode: 'onChange',
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
      customerInfo: {
        fullName: '',
        mobile: '',
        email: '',
        dob: null,
        gender: '',
        pan: '',
        aadhaar: '',
      },
      accountInfo: {
        accountHolderName: '',
        bankName: '',
        accountNumber: '',
        confirmAccountNumber: '',
        ifsc: '',
        accountType: '',
      },
      assets: {
        propertyOwnerName: '',
        propertyAddress: '',
        regState: '',
        regDistrict: '',
        regTehsil: '',
        regStateID: '',
        regDistrictID: '',
        regTehsilID: '',
        pincode: '',
        propertyType: '',
        natureOfProperty: '',
        ownershipDocument: '',
        ownershipType: '',
        unitOfMeasurement: '',
        totalArea: '',
        frontArea: '',
        backArea: '',
        leftArea: '',
        rightArea: '',
        constructedArea: '',
        mortgageType: '',
        mortgageSignedBy: '',
        cersaiNo: '',
        estimatedValue: '',
        latitude: '',
        longitude: '',
        propertyImage: null,
      },
      vehicle: {
        condition: '',
        usage: '',
        dealer: '',
        manufacturer: '',
        vehicleCategory: '',
        modelName: '',
        variant: '',
        manufactureDate: null,
        regNumber: '',
        registrationDate: null,
        registrationExpiryDate: null,
        roadTaxUpto: null,
        fitnessUpto: null,
        permitUpto: null,
        fuelType: '',
        colour: '',
        vehicleCost: '',
        route: '',
        engineNumber: '',
        chassisNumber: '',
        keyNo: '',
        rcHpn: false,
        invoiceHpn: false,
        vehicleImage: null,
        exShowroom: '',
        gst: '',
        insurancePremium: '',
        tdsTcs: '',
        accessories: '',
        essentialKit: '',
        transportation: '',
        rto: '',
        earthing: '',
        others: '',
        onRoad: '',
        dealerContactPerson: '',
        dealerContactNo: '',
        quotationNo: '',
        quotationDate: null,
        estimationAmount: '',
        invoiceNo: '',
        invoiceDate: null,
        invoiceValue: '',
        quotationInFavorOf: '',
        remark: '',
      },
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
  const customerInfo = watch('customerInfo');
  const accountInfo = watch('accountInfo');
  const assets = watch('assets');
  const vehicle = watch('vehicle');

  const productId =
    loanType !== '' && Number.isFinite(Number(loanType))
      ? Number(loanType)
      : null;

  const selectedLoanType = loanTypes.find(lt => lt.id === loanType);
  const category = selectedLoanType?.category ?? '';

  const {
    documents: productDocuments,
    loading: productDocsLoading,
  } = useProductRequiredDocs(productId);

  const {
    pages: apiPages,
    loading: pagesLoading,
    error: pagesError,
    load: loadPages,
    reset: resetPages,
  } = useProductPages();

  const productPages = pagesError ? FALLBACK_PRODUCT_PAGES : apiPages;
  const steps = useMemo(
    () => buildSteps(productPages, category),
    [productPages, category],
  );
  const totalSteps = steps.length;
  const safeStep = Math.min(Math.max(step, 1), totalSteps);
  const currentStep = steps[safeStep - 1];

  const stepRef = useRef(safeStep);
  stepRef.current = safeStep;
  const totalStepsRef = useRef(totalSteps);
  totalStepsRef.current = totalSteps;

  const restoreStateRef = useRef<'pending' | 'restoring' | 'done'>('pending');
  const draftStepRef = useRef<number | null>(null);
  const draftPagesRequestedRef = useRef<number | null>(null);
  const draftDisabledRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);
  const [draftPagesReady, setDraftPagesReady] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setStep(prev => Math.min(Math.max(prev, 1), totalSteps));
  }, [totalSteps]);

  useEffect(() => {
    setFetchedProductId(null);
    advanceAfterLoadRef.current = false;
    resetPages();
  }, [productId, resetPages]);

  const persistDraft = useCallback(() => {
    if (draftDisabledRef.current) return;
    if (restoreStateRef.current !== 'done') return;
    const values = getValues();
    if (values.loanType === '') return;
    const draft: LoanDraft = {
      version: DRAFT_VERSION,
      savedAt: new Date().toISOString(),
      step: stepRef.current,
      totalSteps: totalStepsRef.current,
      productId: Number.isFinite(Number(values.loanType))
        ? Number(values.loanType)
        : null,
      form: values,
    };
    saveLoanDraft(draft);
    if (mountedRef.current) {
      setLastSavedAt(Date.now());
    }
  }, [getValues]);

  const flushDraftSave = useCallback(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    persistDraft();
  }, [persistDraft]);

  const scheduleDraftSave = useCallback(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => {
      saveTimerRef.current = null;
      persistDraft();
    }, 600);
  }, [persistDraft]);

  useEffect(() => {
    const subscription = watch(() => {
      scheduleDraftSave();
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [watch, scheduleDraftSave]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState !== 'active') {
        flushDraftSave();
      }
    });
    return () => {
      subscription.remove();
    };
  }, [flushDraftSave]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
      persistDraft();
    };
  }, [persistDraft]);

  useEffect(() => {
    if (restoreStateRef.current !== 'done') return;
    flushDraftSave();
  }, [safeStep, flushDraftSave]);

  useEffect(() => {
    if (restoreStateRef.current !== 'pending') return;
    let active = true;
    (async () => {
      const draft = await loadLoanDraft();
      if (!active) return;
      restoreStateRef.current = 'done';
      if (!draft || !draft.form) return;
      const values = reviveLoanDraftForm(draft.form);
      if (values.loanType === '') {
        clearLoanDraft();
        return;
      }
      restoreStateRef.current = 'restoring';
      draftStepRef.current = draft.step;
      reset(values);
    })();
    return () => {
      active = false;
    };
  }, [reset]);

  useEffect(() => {
    if (restoreStateRef.current !== 'restoring') return;
    if (draftPagesReady) return;
    if (productId === null) {
      setDraftPagesReady(true);
      return;
    }
    if (draftPagesRequestedRef.current === productId) return;
    draftPagesRequestedRef.current = productId;
    loadPages(productId).then(() => {
      setFetchedProductId(productId);
      setDraftPagesReady(true);
    });
  }, [draftPagesReady, productId, loadPages]);

  useEffect(() => {
    if (restoreStateRef.current !== 'restoring') return;
    if (!draftPagesReady) return;
    if (loading) return;
    const target = draftStepRef.current ?? 1;
    draftStepRef.current = null;
    restoreStateRef.current = 'done';
    const pagesForSteps =
      productPages.length > 0 ? productPages : FALLBACK_PRODUCT_PAGES;
    const maxStep = buildSteps(pagesForSteps, category).length;
    setStep(Math.min(Math.max(target, 1), maxStep));
    toast.show(
      'Welcome back! Your saved loan application has been restored.',
      'info',
    );
  }, [draftPagesReady, loading, productPages, category]);

  useEffect(() => {
    const scroller = stepperRef.current;
    if (!scroller || stepperWidth === 0) return;
    const itemWidth = STEP_DOT + STEP_CONNECTOR;
    const contentWidth =
      STEP_H_PAD * 2 + totalSteps * itemWidth - STEP_CONNECTOR;
    const target =
      (safeStep - 1) * itemWidth +
      STEP_H_PAD -
      (stepperWidth - STEP_DOT) / 2;
    const maxOffset = Math.max(contentWidth - stepperWidth, 0);
    scroller.scrollTo({ x: Math.min(Math.max(target, 0), maxOffset), animated: true });
  }, [safeStep, stepperWidth, totalSteps]);

  const stepperContentWidth =
    STEP_H_PAD * 2 + totalSteps * (STEP_DOT + STEP_CONNECTOR) - STEP_CONNECTOR;
  const stepperCenteringPad = Math.max(
    0,
    (stepperWidth - stepperContentWidth) / 2,
  );

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
    const stepKey = currentStep?.key;
    if (stepKey === 'product') return loanType !== '';
    if (stepKey === 'branch') return branchId !== '';
    if (stepKey === 'loanInfo') return amount !== '' && tenure !== '';
    if (stepKey === 'customerInfo') {
      const ci = customerInfo;
      if (!ci) return false;
      return (
        ci.fullName.trim() !== '' &&
        /^[0-9]{10}$/.test(ci.mobile) &&
        ci.gender !== '' &&
        ci.dob !== null &&
        (ci.email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ci.email)) &&
        (ci.pan === '' || /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(ci.pan)) &&
        (ci.aadhaar === '' || /^[0-9]{12}$/.test(ci.aadhaar))
      );
    }
    if (stepKey === 'accountInfo') {
      const ai = accountInfo;
      if (!ai) return false;
      return (
        ai.accountHolderName.trim() !== '' &&
        ai.bankName.trim() !== '' &&
        /^[0-9]{9,18}$/.test(ai.accountNumber) &&
        ai.accountNumber === ai.confirmAccountNumber &&
        /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ai.ifsc) &&
        ai.accountType !== ''
      );
    }
    if (stepKey === 'documents') {
      if (productDocsLoading || productDocuments.length === 0) {
        return false;
      }
      const requiredKeys = productDocuments
        .filter(d => d.required)
        .map(d => d.key);
      return requiredKeys.every(pk => documents.some(d => d.key === pk));
    }
    if (stepKey === 'incomeExpense') return monthlyIncome !== '' && employment !== '';
    if (stepKey === 'reference') {
      const list = references ?? [];
      return (
        list.length > 0 &&
        list.every(
          ref =>
            ref.type !== '' &&
            ref.name.trim() !== '' &&
            /^[0-9]{10}$/.test(ref.phone),
        )
      );
    }
    if (stepKey === 'assets') {
      const as = assets;
      if (!as) return false;
      const isNum = (s: string) => /^[0-9]+(\.[0-9]{1,2})?$/.test(s);
      const areaOk = (s: string) =>
        s === '' || (isNum(s) && Number(s) > 0);
      return (
        as.propertyOwnerName.trim() !== '' &&
        as.propertyAddress.trim() !== '' &&
        as.regState.trim() !== '' &&
        as.regDistrict.trim() !== '' &&
        as.regTehsil.trim() !== '' &&
        /^[0-9]{6}$/.test(as.pincode) &&
        as.propertyType !== '' &&
        as.natureOfProperty !== '' &&
        as.ownershipDocument !== '' &&
        as.ownershipType !== '' &&
        as.unitOfMeasurement !== '' &&
        isNum(as.totalArea) &&
        Number(as.totalArea) > 0 &&
        areaOk(as.frontArea) &&
        areaOk(as.backArea) &&
        areaOk(as.leftArea) &&
        areaOk(as.rightArea) &&
        areaOk(as.constructedArea) &&
        as.mortgageType !== '' &&
        as.mortgageSignedBy.trim() !== '' &&
        (as.cersaiNo === '' || /^[A-Z0-9]{1,20}$/.test(as.cersaiNo)) &&
        /^[0-9]+$/.test(as.estimatedValue) &&
        Number(as.estimatedValue) > 0 &&
        as.propertyImage != null
      );
    }
    if (stepKey === 'vehicle') {
      const veh = vehicle;
      if (!veh) return false;
      const isNew = veh.condition === 'NEW';
      const isUsed = veh.condition === 'USED';
      const regOk = /^[A-Z0-9 -]{4,14}$/.test(veh.regNumber);
      const regOkOrEmpty = veh.regNumber === '' || regOk;
      return (
        veh.condition !== '' &&
        veh.usage !== '' &&
        veh.manufacturer !== '' &&
        veh.vehicleCategory !== '' &&
        veh.modelName !== '' &&
        veh.variant !== '' &&
        veh.manufactureDate != null &&
        (isUsed ? regOk : regOkOrEmpty) &&
        veh.fuelType !== '' &&
        /^[0-9]+$/.test(veh.vehicleCost) &&
        Number(veh.vehicleCost) > 0 &&
        /^[A-Z0-9]{6,20}$/.test(veh.engineNumber) &&
        /^[A-Z0-9]{6,20}$/.test(veh.chassisNumber) &&
        /^[0-9]+$/.test(veh.onRoad) &&
        Number(veh.onRoad) > 0 &&
        veh.vehicleImage != null &&
        (!isNew ||
          (veh.dealer !== '' &&
            veh.dealerContactPerson.trim() !== '' &&
            /^[0-9]{10}$/.test(veh.dealerContactNo) &&
            veh.quotationNo.trim() !== '' &&
            veh.quotationDate != null &&
            /^[0-9]+$/.test(veh.estimationAmount) &&
            Number(veh.estimationAmount) > 0 &&
            veh.invoiceNo.trim() !== '' &&
            veh.invoiceDate != null &&
            /^[0-9]+$/.test(veh.invoiceValue) &&
            Number(veh.invoiceValue) > 0))
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
      customerInfo,
      accountInfo,
      assets,
      vehicle,
      pages: productPages.map(page => page.MM_Id),
    };
    console.log('[ApplyLoanScreen] submitted:', submitted);
    draftDisabledRef.current = true;
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    clearLoanDraft();
    toast.show(
      'Your loan application has been submitted successfully. Our team will contact you shortly.',
      'success',
    );
    navigation.goBack();
  };

  const handleBack = () => {
    advanceAfterLoadRef.current = false;
    if (safeStep > 1) {
      setStep(safeStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleGoHome = () => {
    flushDraftSave();
    navigation.navigate('Home');
  };

  const handleContinue = () => {
    if (currentStep?.key === 'branch') {
      if (pagesLoading) return;
      if (fetchedProductId === productId) {
        setStep(safeStep + 1);
        return;
      }
      if (productId === null) return;
      advanceAfterLoadRef.current = true;
      loadPages(productId).then(() => {
        setFetchedProductId(productId);
        if (advanceAfterLoadRef.current) {
          advanceAfterLoadRef.current = false;
          setStep(safeStep + 1);
        }
      });
      return;
    }

    if (safeStep < totalSteps) {
      setStep(safeStep + 1);
      return;
    }

    handleSubmit();
  };

  const themed = createStyles(
    colors,
    spacing,
    radius,
    headerBg,
    headerBgLight,
    decorBg,
  );

  const renderStepBody = () => {
    const key = currentStep?.key;

    if (pagesLoading) {
      return (
        <View style={themed.loadingWrap}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      );
    }

    if (key === 'product') {
      return loading ? (
        <View style={themed.loadingWrap}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <LoanTypeStep control={control} themed={themed} loanTypes={loanTypes} />
      );
    }

    if (key === 'branch') {
      return (
        <SelectBranchStep
          themed={themed}
          branches={branches}
          loading={branchesLoading}
          coords={coords}
          fallbackCoords={fallbackCoords}
          gpsStatus={gpsStatus}
          onRetry={refetchBranches}
        />
      );
    }

    if (key === 'review') {
      return (
        <SummaryStep
          branchId={branchId}
          branches={branches}
          loanTypes={loanTypes}
          stepKeys={steps.map(step => step.key)}
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
            customerInfo,
            accountInfo,
            assets,
            vehicle,
          }}
        />
      );
    }

    switch (key) {
      case 'customerInfo':
        return <CustomerInfoStep control={control} themed={themed} />;
      case 'accountInfo':
        return <AccountInfoStep control={control} themed={themed} />;
      case 'assets':
        return (
          <AssetsStep
            control={control}
            setValue={setValue}
            themed={themed}
            assets={assets}
            branchId={branchId}
            productId={productId}
          />
        );
      case 'vehicle':
        return (
          <VehicleDetailStep
              control={control}
              setValue={setValue}
              themed={themed}
              loanId={loanId}
            />
        );
      case 'loanInfo':
        return <LoanAmountStep control={control} themed={themed} />;
      case 'documents':
        return (
          <DocumentsStep
            control={control}
            productId={productId}
            themed={themed}
          />
        );
      case 'incomeExpense':
        return <EmploymentStep control={control} themed={themed} />;
      case 'reference':
        return <CustomerReferenceStep control={control} themed={themed} />;
      default:
        return (
          <PlaceholderStep
            title={currentStep?.label ?? 'Section'}
            icon={currentStep?.icon}
          />
        );
    }
  };

  return (
    <View style={themed.root}>
      <View style={themed.header}>
        <View style={themed.decor1} />
        <View style={themed.decor2} />
        <View style={themed.decor3} />

        <View style={themed.topBar}>
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [
              themed.backBtn,
              pressed && themed.backBtnPressed,
            ]}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={themed.topTitle}>Apply Loan</Text>
          <View style={themed.topRight}>
            {lastSavedAt !== null ? (
              <View style={themed.savedChip}>
                <Check size={11} color="#FFFFFF" strokeWidth={3} />
                <Text style={themed.savedChipText}>Progress saved</Text>
              </View>
            ) : null}
            <Pressable
              onPress={handleGoHome}
              accessibilityLabel="Go to home"
              style={({ pressed }) => [
                themed.backBtn,
                pressed && themed.backBtnPressed,
              ]}
            >
              <House size={19} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        <View style={themed.headerBody}>
          <View style={themed.stepStepper}>
            <ScrollView
              ref={stepperRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              onLayout={e => setStepperWidth(e.nativeEvent.layout.width)}
              contentContainerStyle={{
                alignItems: 'center',
                paddingHorizontal: STEP_H_PAD + stepperCenteringPad,
              }}
            >
              {steps.map((item, index) => {
                const idx = index + 1;
                const done = idx < safeStep;
                const current = idx === safeStep;
                return (
                  <React.Fragment key={item.key}>
                    {index > 0 ? (
                      <View
                        style={[
                          themed.stepConnector,
                          idx <= safeStep && themed.stepConnectorActive,
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
                        <Text
                          style={[
                            themed.stepDotNumber,
                            {
                              color: current
                                ? colors.primary
                                : 'rgba(255,255,255,0.55)',
                            },
                          ]}
                        >
                          {idx}
                        </Text>
                      )}
                    </View>
                  </React.Fragment>
                );
              })}
            </ScrollView>
          </View>
          <Text style={themed.currentStepName}>
            <Text style={themed.currentStepCount}>
              Step {safeStep} of {totalSteps} ·{' '}
            </Text>
            {currentStep?.label ?? ''}
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
          <View style={themed.contentPadding}>{renderStepBody()}</View>
          <View style={themed.bottomSpacer} />
        </ScrollView>

        <View style={themed.footer}>
          <Pressable
            onPress={handleContinue}
            disabled={!canProceed() || pagesLoading}
            style={({ pressed }) => [
              themed.nextBtn,
              canProceed() && !pagesLoading
                ? themed.nextBtnEnabled
                : themed.nextBtnDisabled,
              { opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <Text
              style={[
                themed.nextBtnText,
                {
                  color:
                    canProceed() && !pagesLoading
                      ? '#FFFFFF'
                      : colors.textSecondary,
                },
              ]}
            >
              {safeStep < totalSteps ? 'Continue' : 'Submit Application'}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
