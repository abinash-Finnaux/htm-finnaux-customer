import React, { useState, useRef, useEffect } from 'react';
import {
  Text,
  View,
  Alert,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useForm, Controller } from 'react-hook-form';

import type { AppTheme } from '../../constants/themes';
import type { RootStackParamList } from '../../../App';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import FormDateOfBirthInput from '../../components/forms/FormDateOfBirthInput';
import FormTextInput from '../../components/forms/FormTextInput';
import FormSelectOption from '../../components/forms/FormSelectOption';
import SectionHeader from '../../components/SectionHeader';
import SuccessModal from '../../components/modals/SuccessModal';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

type SignUpForm = {
  fullName: string;
  relationType: string;
  relationName: string;
  gender: string;
  dob: Date | null;
  age: string;
  maritalStatus: string;
  religion: string;
  email: string;
  phone: string;
  panNumber: string;
  aadharNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  termsAccepted: boolean;
};

const STEP_META = [
  { label: 'Personal', color: '#3B82F6' },
  { label: 'KYC', color: '#8B5CF6' },
  { label: 'Address', color: '#F59E0B' },
  { label: 'Review', color: '#22C55E' },
];

function StepIndicator({
  currentStep,
  themed,
}: {
  currentStep: number;
  themed: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={themed.siWrap}>
      {STEP_META.map((meta, i) => {
        const s = i + 1;
        const isDone = s < currentStep;
        const isActive = s === currentStep;
        return (
          <React.Fragment key={s}>
            <View style={themed.siItem}>
              <View
                style={[
                  themed.siCircle,
                  {
                    backgroundColor: isDone
                      ? '#FFFFFF'
                      : isActive
                      ? meta.color
                      : 'rgba(255,255,255,0.15)',
                    borderColor: isDone
                      ? '#FFFFFF'
                      : isActive
                      ? '#FFFFFF'
                      : 'rgba(255,255,255,0.2)',
                    transform: [{ scale: isActive ? 1.1 : 1 }],
                  },
                ]}
              >
                <Text
                  style={[
                    themed.siCircleText,
                    { color: isDone ? meta.color : '#FFFFFF' },
                  ]}
                >
                  {isDone ? '✓' : s}
                </Text>
              </View>
              <Text
                style={[
                  themed.siLabel,
                  { color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.45)' },
                ]}
              >
                {meta.label}
              </Text>
            </View>
            {i < 3 && (
              <View
                style={[
                  themed.siLine,
                  {
                    backgroundColor: isDone
                      ? '#FFFFFF'
                      : 'rgba(255,255,255,0.15)',
                  },
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

function ReviewRow({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: AppTheme['colors'];
}) {
  return (
    <View style={rrStyles.row}>
      <Text style={[rrStyles.label, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <Text style={[rrStyles.value, { color: colors.text }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function formatPan(text: string): string {
  const upper = text.toUpperCase();
  let result = '';
  for (let i = 0; i < upper.length && i < 10; i++) {
    const ch = upper[i];
    if (i < 5 || i === 9) {
      if (/[A-Z]/.test(ch)) result += ch;
    } else {
      if (/[0-9]/.test(ch)) result += ch;
    }
  }
  return result;
}

export default function SignUpScreen({ navigation }: Props) {
  const { theme, isDark } = useTheme();
  const { colors, spacing, radius } = theme;

  const headerBg = isDark ? '#1E293B' : colors.primary;
  const decorBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)';

  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<SignUpForm>({
    defaultValues: {
      fullName: '',
      relationType: '',
      relationName: '',
      gender: '',
      dob: null,
      age: '',
      maritalStatus: '',
      religion: '',
      email: '',
      phone: '',
      panNumber: '',
      aadharNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      termsAccepted: false,
    },
  });

  const dob = watch('dob');
  const termsAccepted = watch('termsAccepted');

  const watchedFullName = watch('fullName');
  const watchedGender = watch('gender');
  const watchedMaritalStatus = watch('maritalStatus');
  const watchedEmail = watch('email');
  const watchedPhone = watch('phone');
  const watchedPanNumber = watch('panNumber');
  const watchedAadharNumber = watch('aadharNumber');
  const watchedAddressLine1 = watch('addressLine1');
  const watchedCity = watch('city');
  const watchedState = watch('state');
  const watchedPincode = watch('pincode');

  useEffect(() => {
    if (dob) {
      const today = new Date();
      let calculatedAge = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        calculatedAge--;
      }
      setValue('age', String(calculatedAge));
    }
  }, [dob, setValue]);

  const canProceed = (): boolean => {
    if (step === 1)
      return (
        watchedFullName.trim().length >= 2 &&
        watchedGender !== '' &&
        dob !== null &&
        watchedMaritalStatus !== '' &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(watchedEmail) &&
        /^\d{10}$/.test(watchedPhone.trim())
      );
    if (step === 2)
      return (
        /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(watchedPanNumber.trim()) &&
        /^\d{12}$/.test(watchedAadharNumber.trim())
      );
    if (step === 3)
      return (
        watchedAddressLine1.trim() !== '' &&
        watchedCity.trim() !== '' &&
        watchedState.trim() !== '' &&
        watchedPincode.trim().length === 6
      );
    return termsAccepted;
  };

  const goToStep = (newStep: number) => {
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: -30,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 30,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    setStep(newStep);
  };

  const doShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 8,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -8,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getStepErrors = (): string[] => {
    const v = getValues();
    const e: string[] = [];
    if (step === 1) {
      if (v.fullName.trim().length < 2) e.push('Full name is required');
      if (!v.gender) e.push('Gender is required');
      if (!v.dob) e.push('Date of birth is required');
      if (!v.maritalStatus) e.push('Marital status is required');
      if (!v.email.includes('@')) e.push('Valid email is required');
      if (v.phone.trim().length !== 10)
        e.push('10-digit phone number required');
    }
    if (step === 2) {
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v.panNumber.trim()))
        e.push('Invalid PAN (e.g. ABCDE1234F)');
      if (v.aadharNumber.trim().length !== 12)
        e.push('12-digit Aadhaar required');
    }
    if (step === 3) {
      if (!v.addressLine1.trim()) e.push('Address is required');
      if (!v.city.trim()) e.push('City is required');
      if (!v.state.trim()) e.push('State is required');
      if (v.pincode.trim().length !== 6) e.push('6-digit pincode required');
    }
    return e;
  };

  const handleNext = () => {
    const stepErrors = getStepErrors();
    if (stepErrors.length > 0) {
      doShake();
      Alert.alert('Missing Information', stepErrors.join('\n'));
      return;
    }
    if (step < 4) goToStep(step + 1);
  };

  const onSubmit = (data: SignUpForm) => {
    console.log('Sign Up:', data);
    setShowSuccess(true);
  };

  const handleSignUp = () => {
    if (!getValues('termsAccepted')) {
      doShake();
      Alert.alert('Required', 'Please accept Terms & Conditions');
      return;
    }
    handleSubmit(onSubmit)();
  };

  const themed = createStyles(colors, spacing, radius, headerBg, decorBg);

  return (
    <View style={themed.root}>
      <View style={themed.header}>
        <View style={themed.decor1} />
        <View style={themed.decor2} />
        <View style={themed.decor3} />

        <View style={themed.topBar}>
          <Pressable
            onPress={() =>
              step > 1 ? goToStep(step - 1) : navigation.goBack()
            }
            style={({ pressed }) => [
              themed.backBtn,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Text style={themed.backBtnText}>←</Text>
          </Pressable>
          <Text style={themed.topTitle}>Sign Up</Text>
          <View style={themed.topSpacer} />
        </View>

        <StepIndicator currentStep={step} themed={themed} />

        <View style={themed.progressTrack}>
          <View style={themed.progressBg}>
            <View
              style={[themed.progressFill, { width: `${(step / 4) * 100}%` }]}
            />
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={themed.flex}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <Animated.View
          style={[themed.flex, { transform: [{ translateX: shakeAnim }] }]}
        >
          <ScrollView
            style={themed.flex}
            contentContainerStyle={themed.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              style={[
                themed.slideContainer,
                { transform: [{ translateX: slideAnim }] },
              ]}
            >
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <>
                  <SectionHeader title="Personal Information" />
                  <FormTextInput
                    control={control}
                    name="fullName"
                    label="Full Name *"
                    placeholder="Enter your full name"
                    rules={{ required: 'Full name is required' }}
                  />
                  <FormSelectOption
                    control={control}
                    name="relationType"
                    label="Relation Type"
                    options={[
                      'Father',
                      'Mother',
                      'Daughter',
                      'Son',
                      'Husband',
                      'Wife',
                      'C/O',
                    ]}
                  />
                  <FormTextInput
                    control={control}
                    name="relationName"
                    label="Relation Name"
                    placeholder="Father / Guardian name"
                  />
                  <FormSelectOption
                    control={control}
                    name="gender"
                    label="Gender *"
                    options={['Male', 'Female', 'Other']}
                    rules={{ required: 'Gender is required' }}
                  />
                  <FormDateOfBirthInput
                    control={control}
                    name="dob"
                    label="Date of Birth *"
                    rules={{ required: 'Date of birth is required' }}
                  />
                  <FormTextInput
                    control={control}
                    name="age"
                    label="Age"
                    placeholder="Auto-calculated or enter manually"
                  />
                  <FormSelectOption
                    control={control}
                    name="maritalStatus"
                    label="Marital Status *"
                    options={[
                      'Married',
                      'Unmarried',
                      'Divorced',
                      'Separated',
                      'Widow / Widower',
                    ]}
                    rules={{ required: 'Marital status is required' }}
                  />
                  <FormSelectOption
                    control={control}
                    name="religion"
                    label="Religion"
                    options={[
                      'Hindu',
                      'Muslim',
                      'Christian',
                      'Sikh',
                      'Jain',
                      'Buddhist',
                    ]}
                  />
                  <FormTextInput
                    control={control}
                    name="email"
                    label="Email Address *"
                    placeholder="Enter your email"
                    rules={{
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Valid email is required',
                      },
                    }}
                  />
                  <FormTextInput
                    control={control}
                    name="phone"
                    label="Phone Number *"
                    placeholder="Enter 10-digit phone number"
                    keyboardType="numeric"
                    maxLength={10}
                    rules={{
                      required: 'Phone number is required',
                      pattern: {
                        value: /^\d{10}$/,
                        message: '10-digit phone number required',
                      },
                    }}
                  />
                </>
              )}

              {/* Step 2: KYC Documents */}
              {step === 2 && (
                <>
                  <SectionHeader title="KYC Documents" />
                  <FormTextInput
                    control={control}
                    name="panNumber"
                    label="PAN Number"
                    placeholder="Enter PAN Number"
                    formatText={formatPan}
                    maxLength={10}
                    rules={{
                      required: 'PAN number is required',
                      pattern: {
                        value: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
                        message: 'Invalid PAN (e.g. ABCDE1234F)',
                      },
                    }}
                  />
                  <Text style={themed.fieldHint}>e.g. ABCDE1234F</Text>
                  <FormTextInput
                    control={control}
                    name="aadharNumber"
                    label="Aadhaar Number"
                    keyboardType="numeric"
                    placeholder="Enter 12-digit Aadhaar"
                    maxLength={12}
                    rules={{
                      required: 'Aadhaar number is required',
                      pattern: {
                        value: /^\d{12}$/,
                        message: '12-digit Aadhaar required',
                      },
                    }}
                  />
                  <Text style={themed.fieldHint}>
                    12-digit unique identity number
                  </Text>
                </>
              )}

              {/* Step 3: Address */}
              {step === 3 && (
                <>
                  <SectionHeader title="Address Details" />

                  {/* <View style={themed.fieldGroup}> */}
                  <FormTextInput
                    control={control}
                    name="addressLine1"
                    label="Address Line 1"
                    placeholder="House/Flat no., Building, Street"
                    rules={{ required: 'Address is required' }}
                  />
                  {/* </View> */}

                  {/* <View style={themed.fieldGroup}> */}
                  <FormTextInput
                    control={control}
                    name="addressLine2"
                    label="Address Line 2 (Optional)"
                    placeholder="Landmark, Area"
                  />
                  {/* </View> */}

                  {/* <View style={themed.fieldGroup}> */}
                  <FormTextInput
                    control={control}
                    name="city"
                    label="City"
                    placeholder="Enter city"
                    rules={{ required: 'City is required' }}
                  />
                  {/* </View> */}

                  <View style={themed.halfRow}>
                    <View style={themed.halfField}>
                      <FormTextInput
                        control={control}
                        name="state"
                        label="State"
                        placeholder="State"
                        rules={{ required: 'State is required' }}
                      />
                    </View>
                    <View style={themed.halfField}>
                      <FormTextInput
                        control={control}
                        name="pincode"
                        label="Pincode"
                        placeholder="6-digit"
                        keyboardType="numeric"
                        maxLength={6}
                        rules={{
                          required: 'Pincode is required',
                          pattern: {
                            value: /^\d{6}$/,
                            message: '6-digit pincode required',
                          },
                        }}
                      />
                    </View>
                  </View>
                </>
              )}

              {/* Step 4: Review */}
              {step === 4 && (
                <>
                  <SectionHeader title="Review Your Details" />

                  <View
                    style={[
                      themed.reviewCard,
                      {
                        borderColor: STEP_META[0].color + '30',
                        backgroundColor: colors.surfaceElevated,
                      },
                    ]}
                  >
                    <View
                      style={[
                        themed.reviewHeader,
                        { backgroundColor: STEP_META[0].color + '10' },
                      ]}
                    >
                      <Text
                        style={[
                          themed.reviewHeaderText,
                          { color: STEP_META[0].color },
                        ]}
                      >
                        👤 Personal Info
                      </Text>
                      <TouchableOpacity onPress={() => goToStep(1)}>
                        <Text
                          style={[
                            themed.editBtn,
                            { color: STEP_META[0].color },
                          ]}
                        >
                          Edit
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <ReviewRow
                      label="Name"
                      value={getValues('fullName')}
                      colors={colors}
                    />
                    {getValues('relationType') ? (
                      <ReviewRow
                        label="Relation Type"
                        value={getValues('relationType')}
                        colors={colors}
                      />
                    ) : null}
                    {getValues('relationName') ? (
                      <ReviewRow
                        label="Relation Name"
                        value={getValues('relationName')}
                        colors={colors}
                      />
                    ) : null}
                    <ReviewRow
                      label="Gender"
                      value={getValues('gender')}
                      colors={colors}
                    />
                    <ReviewRow
                      label="DOB"
                      value={
                        getValues('dob')
                          ? `${String(getValues('dob')!.getDate()).padStart(
                              2,
                              '0',
                            )}/${String(
                              getValues('dob')!.getMonth() + 1,
                            ).padStart(2, '0')}/${getValues(
                              'dob',
                            )!.getFullYear()}`
                          : ''
                      }
                      colors={colors}
                    />
                    {getValues('age') ? (
                      <ReviewRow
                        label="Age"
                        value={getValues('age')}
                        colors={colors}
                      />
                    ) : null}
                    <ReviewRow
                      label="Marital Status"
                      value={getValues('maritalStatus')}
                      colors={colors}
                    />
                    {getValues('religion') ? (
                      <ReviewRow
                        label="Religion"
                        value={getValues('religion')}
                        colors={colors}
                      />
                    ) : null}
                    <ReviewRow
                      label="Email"
                      value={getValues('email')}
                      colors={colors}
                    />
                    <ReviewRow
                      label="Phone"
                      value={getValues('phone')}
                      colors={colors}
                    />
                  </View>

                  <View
                    style={[
                      themed.reviewCard,
                      {
                        borderColor: STEP_META[1].color + '30',
                        backgroundColor: colors.surfaceElevated,
                      },
                    ]}
                  >
                    <View
                      style={[
                        themed.reviewHeader,
                        { backgroundColor: STEP_META[1].color + '10' },
                      ]}
                    >
                      <Text
                        style={[
                          themed.reviewHeaderText,
                          { color: STEP_META[1].color },
                        ]}
                      >
                        🪪 KYC Documents
                      </Text>
                      <TouchableOpacity onPress={() => goToStep(2)}>
                        <Text
                          style={[
                            themed.editBtn,
                            { color: STEP_META[1].color },
                          ]}
                        >
                          Edit
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <ReviewRow
                      label="PAN"
                      value={getValues('panNumber')}
                      colors={colors}
                    />
                    <ReviewRow
                      label="Aadhaar"
                      value={getValues('aadharNumber').replace(
                        /(\d{4})(?=\d)/g,
                        '$1 ',
                      )}
                      colors={colors}
                    />
                  </View>

                  <View
                    style={[
                      themed.reviewCard,
                      {
                        borderColor: STEP_META[2].color + '30',
                        backgroundColor: colors.surfaceElevated,
                      },
                    ]}
                  >
                    <View
                      style={[
                        themed.reviewHeader,
                        { backgroundColor: STEP_META[2].color + '10' },
                      ]}
                    >
                      <Text
                        style={[
                          themed.reviewHeaderText,
                          { color: STEP_META[2].color },
                        ]}
                      >
                        📍 Address
                      </Text>
                      <TouchableOpacity onPress={() => goToStep(3)}>
                        <Text
                          style={[
                            themed.editBtn,
                            { color: STEP_META[2].color },
                          ]}
                        >
                          Edit
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <ReviewRow
                      label="Address"
                      value={[
                        getValues('addressLine1'),
                        getValues('addressLine2'),
                      ]
                        .filter(Boolean)
                        .join(', ')}
                      colors={colors}
                    />
                    <ReviewRow
                      label="City"
                      value={getValues('city')}
                      colors={colors}
                    />
                    <ReviewRow
                      label="State"
                      value={getValues('state')}
                      colors={colors}
                    />
                    <ReviewRow
                      label="Pincode"
                      value={getValues('pincode')}
                      colors={colors}
                    />
                  </View>

                  <Controller
                    control={control}
                    name="termsAccepted"
                    render={({ field: { onChange, value } }) => (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => onChange(!value)}
                        style={[
                          themed.termsRow,
                          {
                            borderColor: value ? '#22C55E' : colors.border,
                            backgroundColor: colors.surfaceElevated,
                          },
                        ]}
                      >
                        <View
                          style={[
                            themed.checkbox,
                            {
                              backgroundColor: value
                                ? '#22C55E'
                                : 'transparent',
                              borderColor: value ? '#22C55E' : colors.border,
                            },
                          ]}
                        >
                          {value && <Text style={themed.checkIcon}>✓</Text>}
                        </View>
                        <Text style={themed.termsText}>
                          I agree to the Terms of Service and Privacy Policy
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </>
              )}
            </Animated.View>
            <View style={themed.bottomSpacer} />
          </ScrollView>
        </Animated.View>

        <View style={themed.footer}>
          {step < 4 ? (
            <Pressable
              onPress={handleNext}
              disabled={!canProceed()}
              style={({ pressed }) => [
                themed.nextBtn,
                {
                  backgroundColor: canProceed()
                    ? pressed
                      ? colors.primaryDark
                      : headerBg
                    : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  themed.nextBtnText,
                  { color: canProceed() ? '#FFFFFF' : colors.textSecondary },
                ]}
              >
                Continue →
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={handleSignUp}
              disabled={!canProceed()}
              style={({ pressed }) => [
                themed.nextBtn,
                {
                  backgroundColor: canProceed()
                    ? pressed
                      ? '#16A34A'
                      : '#22C55E'
                    : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  themed.nextBtnText,
                  { color: canProceed() ? '#FFFFFF' : colors.textSecondary },
                ]}
              >
                {canProceed() ? 'Create Account ✓' : 'Accept Terms to Continue'}
              </Text>
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
      <SuccessModal
        visible={showSuccess}
        title="Account Created"
        message="Your account has been created successfully!"
        buttonText="Go to Login"
        onPress={() => {
          setShowSuccess(false);
          navigation.replace('Login');
        }}
      />
    </View>
  );
}

function createStyles(
  colors: AppTheme['colors'],
  spacing: AppTheme['spacing'],
  radius: AppTheme['radius'],
  headerBg: string,
  decorBg: string,
) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: 56,
      paddingBottom: 20,
      paddingHorizontal: 24,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      backgroundColor: headerBg,
      overflow: 'hidden',
    },
    decor1: {
      position: 'absolute',
      top: -40,
      right: -30,
      width: 160,
      height: 160,
      borderRadius: 80,
      backgroundColor: decorBg,
    },
    decor2: {
      position: 'absolute',
      bottom: 10,
      left: -50,
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: decorBg,
    },
    decor3: {
      position: 'absolute',
      top: 30,
      right: 80,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: decorBg,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    backBtn: {
      width: 40,
      height: 40,
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backBtnText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '600',
    },
    topTitle: {
      color: '#FFFFFF',
      fontSize: 17,
      fontWeight: '700',
    },
    topSpacer: {
      width: 40,
    },
    progressTrack: {
      marginTop: 16,
    },
    progressBg: {
      height: 4,
      backgroundColor: 'rgba(255,255,255,0.15)',
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 2,
      backgroundColor: '#FFFFFF',
    },
    flex: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 20,
    },
    slideContainer: {
      paddingHorizontal: spacing.lg,
    },
    fieldGroup: {
      marginBottom: 16,
    },
    fieldHint: {
      fontSize: 11,
      fontWeight: '500',
      marginTop: 6,
      color: colors.textSecondary,
    },
    halfRow: {
      flexDirection: 'row',
      gap: 12,
    },
    halfField: {
      flex: 1,
    },
    reviewCard: {
      borderWidth: 1,
      marginBottom: 14,
      borderRadius: radius.lg,
      overflow: 'hidden',
    },
    reviewHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    reviewHeaderText: {
      fontSize: 13,
      fontWeight: '700',
    },
    editBtn: {
      fontSize: 12,
      fontWeight: '700',
    },
    termsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      padding: 16,
      marginTop: 4,
      gap: 12,
      borderRadius: radius.lg,
    },
    checkbox: {
      width: 22,
      height: 22,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkIcon: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '800',
    },
    termsText: {
      fontSize: 13,
      fontWeight: '500',
      flex: 1,
      color: colors.textSecondary,
    },
    bottomSpacer: {
      height: 40,
    },
    footer: {
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderTopWidth: 1,
      backgroundColor: colors.background,
      borderTopColor: colors.border,
    },
    nextBtn: {
      alignItems: 'center',
      paddingVertical: 16,
      borderRadius: radius.pill,
    },
    nextBtnText: {
      fontSize: 16,
      fontWeight: '700',
    },
    siWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
      gap: 0,
    },
    siItem: {
      alignItems: 'center',
      gap: 4,
    },
    siCircle: {
      width: 30,
      height: 30,
      borderRadius: 15,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    siCircleText: {
      fontSize: 12,
      fontWeight: '800',
    },
    siLabel: {
      fontSize: 9,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.3,
    },
    siLine: {
      width: 24,
      height: 2,
      borderRadius: 1,
      marginHorizontal: 4,
      marginBottom: 16,
    },
  });
}

const rrStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
    marginLeft: 16,
  },
});
