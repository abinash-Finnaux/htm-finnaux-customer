import React, { useState, useRef, useEffect } from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import type { RootStackParamList } from '../../App';
import DateOfBirthInput from '../components/DateOfBirthInput';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

const STEP_META = [
  { label: 'Personal', color: '#3B82F6' },
  { label: 'KYC', color: '#8B5CF6' },
  { label: 'Address', color: '#F59E0B' },
  { label: 'Review', color: '#22C55E' },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  const { theme, isDark } = useTheme();
  const { colors } = theme;
  const headerBg = isDark ? '#1E293B' : colors.primary;

  return (
    <View style={siStyles.wrap}>
      {STEP_META.map((meta, i) => {
        const s = i + 1;
        const isDone = s < currentStep;
        const isActive = s === currentStep;
        return (
          <React.Fragment key={s}>
            <View style={siStyles.item}>
              <View
                style={[
                  siStyles.circle,
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
                    siStyles.circleText,
                    { color: isDone ? meta.color : '#FFFFFF' },
                  ]}
                >
                  {isDone ? '✓' : s}
                </Text>
              </View>
              <Text
                style={[
                  siStyles.label,
                  { color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.45)' },
                ]}
              >
                {meta.label}
              </Text>
            </View>
            {i < 3 && (
              <View
                style={[
                  siStyles.line,
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

export default function SignUpScreen({ navigation }: Props) {
  const { theme, isDark } = useTheme();
  const { colors, spacing, radius, typography } = theme;

  const headerBg = isDark ? '#1E293B' : colors.primary;
  const decorBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)';

  const [step, setStep] = useState(1);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const [fullName, setFullName] = useState('');
  const [relationType, setRelationType] = useState('');
  const [relationName, setRelationName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState<Date | null>(null);
  const [age, setAge] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [religion, setReligion] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const canProceed = () => {
    if (step === 1)
      return (
        fullName.trim().length >= 2 &&
        gender !== '' &&
        dob !== null &&
        maritalStatus !== '' &&
        email.includes('@') &&
        phone.trim().length === 10
      );
    if (step === 2)
      return (
        panNumber.trim().length === 10 && aadharNumber.trim().length === 12
      );
    if (step === 3)
      return (
        addressLine1.trim() !== '' &&
        city.trim() !== '' &&
        state.trim() !== '' &&
        pincode.trim().length === 6
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
    const e: string[] = [];
    if (step === 1) {
      if (fullName.trim().length < 2) e.push('Full name is required');
      if (!gender) e.push('Gender is required');
      if (!dob) e.push('Date of birth is required');
      if (!maritalStatus) e.push('Marital status is required');
      if (!email.includes('@')) e.push('Valid email is required');
      if (phone.trim().length !== 10) e.push('10-digit phone number required');
    }
    if (step === 2) {
      if (panNumber.trim().length !== 10)
        e.push('Valid 10-character PAN required');
      if (aadharNumber.trim().length !== 12)
        e.push('12-digit Aadhaar required');
    }
    if (step === 3) {
      if (!addressLine1.trim()) e.push('Address is required');
      if (!city.trim()) e.push('City is required');
      if (!state.trim()) e.push('State is required');
      if (pincode.trim().length !== 6) e.push('6-digit pincode required');
    }
    return e;
  };

  const handleNext = () => {
    const errors = getStepErrors();
    if (errors.length > 0) {
      doShake();
      Alert.alert('Missing Information', errors.join('\n'));
      return;
    }
    if (step < 4) goToStep(step + 1);
  };

  const handleSignUp = () => {
    if (!termsAccepted) {
      doShake();
      Alert.alert('Required', 'Please accept Terms & Conditions');
      return;
    }
    Alert.alert(
      'Account Created',
      'Your account has been created successfully!',
      [{ text: 'OK', onPress: () => navigation.replace('Login') }],
    );
  };

  const inputStyle = [
    styles.input,
    {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      color: colors.text,
      borderRadius: radius.md,
    },
  ];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: headerBg }]}>
        <View style={[styles.decor1, { backgroundColor: decorBg }]} />
        <View style={[styles.decor2, { backgroundColor: decorBg }]} />
        <View style={[styles.decor3, { backgroundColor: decorBg }]} />

        <View style={styles.topBar}>
          <Pressable
            onPress={() =>
              step > 1 ? goToStep(step - 1) : navigation.goBack()
            }
            style={({ pressed }) => [
              styles.backBtn,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
          <Text style={styles.topTitle}>Sign Up</Text>
          <View style={{ width: 40 }} />
        </View>

        <StepIndicator currentStep={step} />

        <View style={styles.progressTrack}>
          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                { width: `${(step / 4) * 100}%`, backgroundColor: '#FFFFFF' },
              ]}
            />
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <Animated.View
          style={[styles.flex, { transform: [{ translateX: shakeAnim }] }]}
        >
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              style={[
                { paddingHorizontal: spacing.lg },
                { transform: [{ translateX: slideAnim }] },
              ]}
            >
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <>
                  <Text
                    style={[
                      styles.sectionTitle,
                      { color: colors.textSecondary, marginTop: spacing.xl },
                    ]}
                  >
                    Personal Information
                  </Text>

                  <View style={styles.fieldGroup}>
                    <Text
                      style={[
                        styles.inputLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Full Name *
                    </Text>
                    <TextInput
                      style={inputStyle}
                      placeholder="Enter your full name"
                      placeholderTextColor={colors.textSecondary}
                      value={fullName}
                      onChangeText={setFullName}
                      autoCapitalize="words"
                    />
                  </View>

                  <Text
                    style={[
                      styles.inputLabel,
                      { color: colors.textSecondary, marginBottom: 8 },
                    ]}
                  >
                    Relation Type
                  </Text>
                  <View style={styles.chipRow}>
                    {[
                      'Father',
                      'Mother',
                      'Daughter',
                      'Son',
                      'Husband',
                      'Wife',
                      'C/O',
                      'Guardian',
                    ].map(r => {
                      const selected = relationType === r;
                      return (
                        <Pressable
                          key={r}
                          onPress={() => setRelationType(r)}
                          style={({ pressed }) => [
                            styles.chip,
                            {
                              backgroundColor: selected
                                ? headerBg
                                : colors.surface,
                              borderColor: selected ? headerBg : colors.border,
                              borderRadius: radius.md,
                              opacity: pressed ? 0.8 : 1,
                            },
                          ]}
                        >
                          {selected && (
                            <View
                              style={[
                                styles.chipTick,
                                { backgroundColor: '#FFFFFF' },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.chipTickText,
                                  { color: headerBg },
                                ]}
                              >
                                ✓
                              </Text>
                            </View>
                          )}
                          <Text
                            style={[
                              styles.chipText,
                              { color: selected ? '#FFFFFF' : colors.text },
                            ]}
                          >
                            {r}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text
                      style={[
                        styles.inputLabel,
                        { color: colors.textSecondary, marginTop: 16 },
                      ]}
                    >
                      Relation Name
                    </Text>
                    <TextInput
                      style={inputStyle}
                      placeholder="Father / Guardian name"
                      placeholderTextColor={colors.textSecondary}
                      value={relationName}
                      onChangeText={setRelationName}
                      autoCapitalize="words"
                    />
                  </View>

                  <Text
                    style={[
                      styles.inputLabel,
                      { color: colors.textSecondary, marginBottom: 8 },
                    ]}
                  >
                    Gender *
                  </Text>
                  <View style={styles.chipRow}>
                    {['Male', 'Female', 'Other'].map(g => {
                      const selected = gender === g;
                      return (
                        <Pressable
                          key={g}
                          onPress={() => setGender(g)}
                          style={({ pressed }) => [
                            styles.chip,
                            {
                              backgroundColor: selected
                                ? headerBg
                                : colors.surface,
                              borderColor: selected ? headerBg : colors.border,
                              borderRadius: radius.md,
                              opacity: pressed ? 0.8 : 1,
                            },
                          ]}
                        >
                          {selected && (
                            <View
                              style={[
                                styles.chipTick,
                                { backgroundColor: '#FFFFFF' },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.chipTickText,
                                  { color: headerBg },
                                ]}
                              >
                                ✓
                              </Text>
                            </View>
                          )}
                          <Text
                            style={[
                              styles.chipText,
                              { color: selected ? '#FFFFFF' : colors.text },
                            ]}
                          >
                            {g}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <View style={{ marginTop: 16 }}>
                    <DateOfBirthInput
                      label="Date of Birth *"
                      value={dob}
                      onChange={date => {
                        setDob(date);
                        const today = new Date();
                        let calculatedAge =
                          today.getFullYear() - date.getFullYear();
                        const m = today.getMonth() - date.getMonth();
                        if (
                          m < 0 ||
                          (m === 0 && today.getDate() < date.getDate())
                        ) {
                          calculatedAge--;
                        }
                        setAge(String(calculatedAge));
                      }}
                    />
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text
                      style={[
                        styles.inputLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Age
                    </Text>
                    <TextInput
                      style={inputStyle}
                      placeholder="Auto-calculated or enter manually"
                      placeholderTextColor={colors.textSecondary}
                      value={age}
                      onChangeText={setAge}
                      keyboardType="number-pad"
                      maxLength={3}
                    />
                  </View>

                  <Text
                    style={[
                      styles.inputLabel,
                      { color: colors.textSecondary, marginBottom: 8 },
                    ]}
                  >
                    Marital Status *
                  </Text>
                  <View style={styles.chipRow}>
                    {[
                      'Married',
                      'Unmarried',
                      'Divorced',
                      'Separated',
                      'Widow / Widower',
                    ].map(s => {
                      const selected = maritalStatus === s;
                      return (
                        <Pressable
                          key={s}
                          onPress={() => setMaritalStatus(s)}
                          style={({ pressed }) => [
                            styles.chip,
                            {
                              backgroundColor: selected
                                ? headerBg
                                : colors.surface,
                              borderColor: selected ? headerBg : colors.border,
                              borderRadius: radius.md,
                              opacity: pressed ? 0.8 : 1,
                            },
                          ]}
                        >
                          {selected && (
                            <View
                              style={[
                                styles.chipTick,
                                { backgroundColor: '#FFFFFF' },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.chipTickText,
                                  { color: headerBg },
                                ]}
                              >
                                ✓
                              </Text>
                            </View>
                          )}
                          <Text
                            style={[
                              styles.chipText,
                              { color: selected ? '#FFFFFF' : colors.text },
                            ]}
                          >
                            {s}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <Text
                    style={[
                      styles.inputLabel,
                      {
                        color: colors.textSecondary,
                        marginTop: 16,
                        marginBottom: 8,
                      },
                    ]}
                  >
                    Religion
                  </Text>
                  <View style={styles.chipRow}>
                    {[
                      'Hindu',
                      'Muslim',
                      'Christian',
                      'Sikh',
                      'Jain',
                      'Buddhist',
                    ].map(r => {
                      const selected = religion === r;
                      return (
                        <Pressable
                          key={r}
                          onPress={() => setReligion(r)}
                          style={({ pressed }) => [
                            styles.chip,
                            {
                              backgroundColor: selected
                                ? headerBg
                                : colors.surface,
                              borderColor: selected ? headerBg : colors.border,
                              borderRadius: radius.md,
                              opacity: pressed ? 0.8 : 1,
                            },
                          ]}
                        >
                          {selected && (
                            <View
                              style={[
                                styles.chipTick,
                                { backgroundColor: '#FFFFFF' },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.chipTickText,
                                  { color: headerBg },
                                ]}
                              >
                                ✓
                              </Text>
                            </View>
                          )}
                          <Text
                            style={[
                              styles.chipText,
                              { color: selected ? '#FFFFFF' : colors.text },
                            ]}
                          >
                            {r}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text
                      style={[
                        styles.inputLabel,
                        {
                          marginTop: 16,
                          color: colors.textSecondary,
                        },
                      ]}
                    >
                      Email Address *
                    </Text>
                    <TextInput
                      style={inputStyle}
                      placeholder="Enter your email"
                      placeholderTextColor={colors.textSecondary}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text
                      style={[
                        styles.inputLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Phone Number *
                    </Text>
                    <TextInput
                      style={inputStyle}
                      placeholder="Enter 10-digit phone number"
                      placeholderTextColor={colors.textSecondary}
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                      maxLength={10}
                    />
                  </View>
                </>
              )}

              {/* Step 2: KYC Documents */}
              {step === 2 && (
                <>
                  <Text
                    style={[
                      styles.sectionTitle,
                      { color: colors.textSecondary, marginTop: spacing.xl },
                    ]}
                  >
                    KYC Documents
                  </Text>

                  <View style={styles.fieldGroup}>
                    <Text
                      style={[
                        styles.inputLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      PAN Number
                    </Text>
                    <TextInput
                      style={inputStyle}
                      placeholder="Enter 10-character PAN"
                      placeholderTextColor={colors.textSecondary}
                      value={panNumber}
                      onChangeText={t => setPanNumber(t.toUpperCase())}
                      autoCapitalize="characters"
                      maxLength={10}
                    />
                    <Text
                      style={[
                        styles.fieldHint,
                        { color: colors.textSecondary },
                      ]}
                    >
                      e.g. ABCDE1234F
                    </Text>
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text
                      style={[
                        styles.inputLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Aadhaar Number
                    </Text>
                    <TextInput
                      style={inputStyle}
                      placeholder="Enter 12-digit Aadhaar"
                      placeholderTextColor={colors.textSecondary}
                      value={aadharNumber}
                      onChangeText={setAadharNumber}
                      keyboardType="number-pad"
                      maxLength={12}
                    />
                    <Text
                      style={[
                        styles.fieldHint,
                        { color: colors.textSecondary },
                      ]}
                    >
                      12-digit unique identity number
                    </Text>
                  </View>
                </>
              )}

              {/* Step 3: Address */}
              {step === 3 && (
                <>
                  <Text
                    style={[
                      styles.sectionTitle,
                      { color: colors.textSecondary, marginTop: spacing.xl },
                    ]}
                  >
                    Address Details
                  </Text>

                  <View style={styles.fieldGroup}>
                    <Text
                      style={[
                        styles.inputLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Address Line 1
                    </Text>
                    <TextInput
                      style={inputStyle}
                      placeholder="House/Flat no., Building, Street"
                      placeholderTextColor={colors.textSecondary}
                      value={addressLine1}
                      onChangeText={setAddressLine1}
                    />
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text
                      style={[
                        styles.inputLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Address Line 2 (Optional)
                    </Text>
                    <TextInput
                      style={inputStyle}
                      placeholder="Landmark, Area"
                      placeholderTextColor={colors.textSecondary}
                      value={addressLine2}
                      onChangeText={setAddressLine2}
                    />
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text
                      style={[
                        styles.inputLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      City
                    </Text>
                    <TextInput
                      style={inputStyle}
                      placeholder="Enter city"
                      placeholderTextColor={colors.textSecondary}
                      value={city}
                      onChangeText={setCity}
                    />
                  </View>

                  <View style={styles.halfRow}>
                    <View style={styles.halfField}>
                      <Text
                        style={[
                          styles.inputLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        State
                      </Text>
                      <TextInput
                        style={inputStyle}
                        placeholder="State"
                        placeholderTextColor={colors.textSecondary}
                        value={state}
                        onChangeText={setState}
                      />
                    </View>
                    <View style={styles.halfField}>
                      <Text
                        style={[
                          styles.inputLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        Pincode
                      </Text>
                      <TextInput
                        style={inputStyle}
                        placeholder="6-digit"
                        placeholderTextColor={colors.textSecondary}
                        value={pincode}
                        onChangeText={setPincode}
                        keyboardType="number-pad"
                        maxLength={6}
                      />
                    </View>
                  </View>
                </>
              )}

              {/* Step 4: Review */}
              {step === 4 && (
                <>
                  <Text
                    style={[
                      styles.sectionTitle,
                      { color: colors.textSecondary, marginTop: spacing.xl },
                    ]}
                  >
                    Review Your Details
                  </Text>

                  <View
                    style={[
                      styles.reviewCard,
                      {
                        backgroundColor: colors.surfaceElevated,
                        borderColor: STEP_META[0].color + '30',
                        borderRadius: radius.lg,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.reviewHeader,
                        { backgroundColor: STEP_META[0].color + '10' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.reviewHeaderText,
                          { color: STEP_META[0].color },
                        ]}
                      >
                        👤 Personal Info
                      </Text>
                      <TouchableOpacity onPress={() => goToStep(1)}>
                        <Text
                          style={[
                            styles.editBtn,
                            { color: STEP_META[0].color },
                          ]}
                        >
                          Edit
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <ReviewRow label="Name" value={fullName} colors={colors} />
                    {relationType ? (
                      <ReviewRow
                        label="Relation Type"
                        value={relationType}
                        colors={colors}
                      />
                    ) : null}
                    {relationName ? (
                      <ReviewRow
                        label="Relation Name"
                        value={relationName}
                        colors={colors}
                      />
                    ) : null}
                    <ReviewRow label="Gender" value={gender} colors={colors} />
                    <ReviewRow
                      label="DOB"
                      value={
                        dob
                          ? `${String(dob.getDate()).padStart(2, '0')}/${String(dob.getMonth() + 1).padStart(2, '0')}/${dob.getFullYear()}`
                          : ''
                      }
                      colors={colors}
                    />
                    {age ? (
                      <ReviewRow label="Age" value={age} colors={colors} />
                    ) : null}
                    <ReviewRow
                      label="Marital Status"
                      value={maritalStatus}
                      colors={colors}
                    />
                    {religion ? (
                      <ReviewRow
                        label="Religion"
                        value={religion}
                        colors={colors}
                      />
                    ) : null}
                    <ReviewRow label="Email" value={email} colors={colors} />
                    <ReviewRow label="Phone" value={phone} colors={colors} />
                  </View>

                  <View
                    style={[
                      styles.reviewCard,
                      {
                        backgroundColor: colors.surfaceElevated,
                        borderColor: STEP_META[1].color + '30',
                        borderRadius: radius.lg,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.reviewHeader,
                        { backgroundColor: STEP_META[1].color + '10' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.reviewHeaderText,
                          { color: STEP_META[1].color },
                        ]}
                      >
                        🪪 KYC Documents
                      </Text>
                      <TouchableOpacity onPress={() => goToStep(2)}>
                        <Text
                          style={[
                            styles.editBtn,
                            { color: STEP_META[1].color },
                          ]}
                        >
                          Edit
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <ReviewRow label="PAN" value={panNumber} colors={colors} />
                    <ReviewRow
                      label="Aadhaar"
                      value={aadharNumber.replace(/(\d{4})(?=\d)/g, '$1 ')}
                      colors={colors}
                    />
                  </View>

                  <View
                    style={[
                      styles.reviewCard,
                      {
                        backgroundColor: colors.surfaceElevated,
                        borderColor: STEP_META[2].color + '30',
                        borderRadius: radius.lg,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.reviewHeader,
                        { backgroundColor: STEP_META[2].color + '10' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.reviewHeaderText,
                          { color: STEP_META[2].color },
                        ]}
                      >
                        📍 Address
                      </Text>
                      <TouchableOpacity onPress={() => goToStep(3)}>
                        <Text
                          style={[
                            styles.editBtn,
                            { color: STEP_META[2].color },
                          ]}
                        >
                          Edit
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <ReviewRow
                      label="Address"
                      value={[addressLine1, addressLine2]
                        .filter(Boolean)
                        .join(', ')}
                      colors={colors}
                    />
                    <ReviewRow label="City" value={city} colors={colors} />
                    <ReviewRow label="State" value={state} colors={colors} />
                    <ReviewRow
                      label="Pincode"
                      value={pincode}
                      colors={colors}
                    />
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setTermsAccepted(!termsAccepted)}
                    style={[
                      styles.termsRow,
                      {
                        borderColor: termsAccepted ? '#22C55E' : colors.border,
                        borderRadius: radius.lg,
                        backgroundColor: colors.surfaceElevated,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        {
                          backgroundColor: termsAccepted
                            ? '#22C55E'
                            : 'transparent',
                          borderColor: termsAccepted
                            ? '#22C55E'
                            : colors.border,
                        },
                      ]}
                    >
                      {termsAccepted && <Text style={styles.checkIcon}>✓</Text>}
                    </View>
                    <Text
                      style={[
                        styles.termsText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      I agree to the Terms of Service and Privacy Policy
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </Animated.View>
            <View style={{ height: 40 }} />
          </ScrollView>
        </Animated.View>

        <View
          style={[
            styles.footer,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
            },
          ]}
        >
          {step < 4 ? (
            <Pressable
              onPress={handleNext}
              disabled={!canProceed()}
              style={({ pressed }) => [
                styles.nextBtn,
                {
                  backgroundColor: canProceed()
                    ? pressed
                      ? colors.primaryDark
                      : headerBg
                    : colors.border,
                  borderRadius: radius.pill,
                },
              ]}
            >
              <Text
                style={[
                  styles.nextBtnText,
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
                styles.nextBtn,
                {
                  backgroundColor: canProceed()
                    ? pressed
                      ? '#16A34A'
                      : '#22C55E'
                    : colors.border,
                  borderRadius: radius.pill,
                },
              ]}
            >
              <Text
                style={[
                  styles.nextBtnText,
                  { color: canProceed() ? '#FFFFFF' : colors.textSecondary },
                ]}
              >
                {canProceed() ? 'Create Account ✓' : 'Accept Terms to Continue'}
              </Text>
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
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
  colors: any;
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

const siStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 0,
  },
  item: { alignItems: 'center', gap: 4 },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: { fontSize: 12, fontWeight: '800' },
  label: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  line: {
    width: 24,
    height: 2,
    borderRadius: 1,
    marginHorizontal: 4,
    marginBottom: 16,
  },
});

const rrStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  label: { fontSize: 13, fontWeight: '500' },
  value: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
    marginLeft: 16,
  },
});

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  decor1: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  decor2: {
    position: 'absolute',
    bottom: 10,
    left: -50,
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  decor3: {
    position: 'absolute',
    top: 30,
    right: 80,
    width: 60,
    height: 60,
    borderRadius: 30,
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
  backBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  topTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  progressTrack: { marginTop: 16 },
  progressBg: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 2 },
  flex: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  fieldGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '600' },
  input: {
    height: 48,
    borderWidth: 1,
    fontSize: 15,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  fieldHint: { fontSize: 11, fontWeight: '500', marginTop: 6 },
  halfRow: { flexDirection: 'row', gap: 12 },
  halfField: { flex: 1 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  chipText: { fontSize: 13, fontWeight: '600' },
  chipTick: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 12,
    height: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  chipTickText: { fontSize: 9, fontWeight: '800' },
  reviewCard: { borderWidth: 1, marginBottom: 14, overflow: 'hidden' },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  reviewHeaderText: { fontSize: 13, fontWeight: '700' },
  editBtn: { fontSize: 12, fontWeight: '700' },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    padding: 16,
    marginTop: 4,
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  termsText: { fontSize: 13, fontWeight: '500', flex: 1 },
  footer: { paddingHorizontal: 24, paddingVertical: 16, borderTopWidth: 1 },
  nextBtn: { alignItems: 'center', paddingVertical: 16 },
  nextBtnText: { fontSize: 16, fontWeight: '700' },
});
