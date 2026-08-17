import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'ApplyLoan'>;

const LOAN_TYPES = [
  { id: 'personal', label: 'Personal Loan', icon: '👤', range: '₹50K - ₹5L' },
  { id: 'business', label: 'Business Loan', icon: '💼', range: '₹1L - ₹25L' },
  { id: 'home', label: 'Home Loan', icon: '🏠', range: '₹10L - ₹1Cr' },
  { id: 'vehicle', label: 'Vehicle Loan', icon: '🚗', range: '₹2L - ₹15L' },
];

const TENURE_OPTIONS = ['12', '24', '36', '48', '60'];

export default function ApplyLoanScreen({ navigation }: Props) {
  const { theme, isDark } = useTheme();
  const { colors, spacing, radius } = theme;

  const headerBg = isDark ? '#1E293B' : colors.primary;
  const decorBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)';

  const [step, setStep] = useState(1);
  const [loanType, setLoanType] = useState('');
  const [amount, setAmount] = useState('');
  const [tenure, setTenure] = useState('');
  const [purpose, setPurpose] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [employment, setEmployment] = useState('');

  const canProceed = () => {
    if (step === 1) return loanType !== '';
    if (step === 2) return amount !== '' && tenure !== '';
    return monthlyIncome !== '' && employment !== '';
  };

  const handleSubmit = () => {
    Alert.alert('Application Submitted', 'Your loan application has been submitted successfully. Our team will contact you shortly.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: headerBg }]}>
        <View style={[styles.decor1, { backgroundColor: decorBg }]} />
        <View style={[styles.decor2, { backgroundColor: decorBg }]} />
        <View style={[styles.decor3, { backgroundColor: decorBg }]} />

        <View style={styles.topBar}>
          <Pressable
            onPress={() => (step > 1 ? setStep(step - 1) : navigation.goBack())}
            style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
          >
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
          <Text style={styles.topTitle}>Apply Loan</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.headerBody}>
          <Text style={styles.stepLabel}>Step {step} of 3</Text>
          <View style={styles.progressBar}>
            {[1, 2, 3].map(s => (
              <View
                key={s}
                style={[
                  styles.progressDot,
                  {
                    backgroundColor: s <= step ? '#FFFFFF' : 'rgba(255,255,255,0.25)',
                    width: s <= step ? 40 : 12,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ paddingHorizontal: spacing.lg }}>

            {/* Step 1: Loan Type */}
            {step === 1 && (
              <>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: spacing.xl }]}>Select Loan Type</Text>
                <View style={styles.loanGrid}>
                  {LOAN_TYPES.map(item => {
                    const selected = loanType === item.id;
                    return (
                      <Pressable
                        key={item.id}
                        onPress={() => setLoanType(item.id)}
                        style={({ pressed }) => [
                          styles.loanCard,
                          {
                            backgroundColor: selected ? headerBg + '12' : colors.surfaceElevated,
                            borderColor: selected ? headerBg : colors.border,
                            borderRadius: radius.lg,
                            opacity: pressed ? 0.85 : 1,
                          },
                        ]}
                      >
                        <View style={[styles.loanIconWrap, { backgroundColor: selected ? headerBg + '20' : colors.border }]}>
                          <Text style={styles.loanIcon}>{item.icon}</Text>
                        </View>
                        <Text style={[styles.loanLabel, { color: colors.text }]}>{item.label}</Text>
                        <Text style={[styles.loanRange, { color: colors.textSecondary }]}>{item.range}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </>
            )}

            {/* Step 2: Amount & Tenure */}
            {step === 2 && (
              <>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: spacing.xl }]}>Loan Amount</Text>
                <View style={[styles.inputCard, { backgroundColor: colors.surfaceElevated, borderColor: colors.border, borderRadius: radius.lg }]}>
                  <Text style={[styles.inputPrefix, { color: colors.textSecondary }]}>₹</Text>
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter amount"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                  />
                </View>

                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: spacing.xl }]}>Repayment Tenure</Text>
                <View style={styles.tenureRow}>
                  {TENURE_OPTIONS.map(t => {
                    const selected = tenure === t;
                    return (
                      <Pressable
                        key={t}
                        onPress={() => setTenure(t)}
                        style={({ pressed }) => [
                          styles.tenureChip,
                          {
                            backgroundColor: selected ? headerBg : colors.surfaceElevated,
                            borderColor: selected ? headerBg : colors.border,
                            borderRadius: radius.md,
                            opacity: pressed ? 0.85 : 1,
                          },
                        ]}
                      >
                        <Text style={[styles.tenureVal, { color: selected ? '#FFFFFF' : colors.text }]}>{t}</Text>
                        <Text style={[styles.tenureUnit, { color: selected ? 'rgba(255,255,255,0.7)' : colors.textSecondary }]}>months</Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: spacing.xl }]}>Loan Purpose (Optional)</Text>
                <View style={[styles.textAreaCard, { backgroundColor: colors.surfaceElevated, borderColor: colors.border, borderRadius: radius.lg }]}>
                  <TextInput
                    style={[styles.textArea, { color: colors.text }]}
                    placeholder="Describe purpose of loan..."
                    placeholderTextColor={colors.textSecondary}
                    value={purpose}
                    onChangeText={setPurpose}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              </>
            )}

            {/* Step 3: Employment Details */}
            {step === 3 && (
              <>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: spacing.xl }]}>Monthly Income</Text>
                <View style={[styles.inputCard, { backgroundColor: colors.surfaceElevated, borderColor: colors.border, borderRadius: radius.lg }]}>
                  <Text style={[styles.inputPrefix, { color: colors.textSecondary }]}>₹</Text>
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter monthly income"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                    value={monthlyIncome}
                    onChangeText={setMonthlyIncome}
                  />
                </View>

                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: spacing.xl }]}>Employment Type</Text>
                <View style={styles.employmentRow}>
                  {['Salaried', 'Self-Employed', 'Business Owner', 'Freelancer'].map(type => {
                    const selected = employment === type;
                    return (
                      <Pressable
                        key={type}
                        onPress={() => setEmployment(type)}
                        style={({ pressed }) => [
                          styles.employmentChip,
                          {
                            backgroundColor: selected ? headerBg : colors.surfaceElevated,
                            borderColor: selected ? headerBg : colors.border,
                            borderRadius: radius.md,
                            opacity: pressed ? 0.85 : 1,
                          },
                        ]}
                      >
                        <Text style={[styles.employmentText, { color: selected ? '#FFFFFF' : colors.text }]}>{type}</Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View style={[styles.summaryCard, { backgroundColor: colors.surfaceElevated, borderColor: colors.border, borderRadius: radius.lg, marginTop: spacing.xl }]}>
                  <Text style={[styles.summaryTitle, { color: colors.text }]}>Application Summary</Text>
                  <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
                  {[
                    { label: 'Loan Type', value: LOAN_TYPES.find(l => l.id === loanType)?.label || '' },
                    { label: 'Amount', value: amount ? `₹${Number(amount).toLocaleString('en-IN')}` : '' },
                    { label: 'Tenure', value: tenure ? `${tenure} months` : '' },
                    { label: 'Employment', value: employment },
                  ].map((item, i) => (
                    <View key={i} style={styles.summaryRow}>
                      <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{item.label}</Text>
                      <Text style={[styles.summaryValue, { color: colors.text }]}>{item.value}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
          <Pressable
            onPress={() => (step < 3 ? setStep(step + 1) : handleSubmit())}
            disabled={!canProceed()}
            style={({ pressed }) => [
              styles.nextBtn,
              {
                backgroundColor: canProceed() ? headerBg : colors.border,
                borderRadius: radius.pill,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text style={[styles.nextBtnText, { color: canProceed() ? '#FFFFFF' : colors.textSecondary }]}>
              {step < 3 ? 'Continue' : 'Submit Application'}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingTop: 56, paddingBottom: 28, paddingHorizontal: 24,
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: 'hidden',
  },
  decor1: { position: 'absolute', top: -40, right: -30, width: 160, height: 160, borderRadius: 80 },
  decor2: { position: 'absolute', bottom: 10, left: -50, width: 120, height: 120, borderRadius: 60 },
  decor3: { position: 'absolute', top: 30, right: 80, width: 60, height: 60, borderRadius: 30 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  backBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  topTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  headerBody: { alignItems: 'center', marginTop: 20 },
  stepLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '500' },
  progressBar: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 6 },
  progressDot: { height: 6, borderRadius: 3 },
  flex: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },

  loanGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  loanCard: { width: '47%', borderWidth: 1.5, padding: 16, alignItems: 'center' },
  loanIconWrap: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  loanIcon: { fontSize: 26 },
  loanLabel: { fontSize: 14, fontWeight: '700', textAlign: 'center' },
  loanRange: { fontSize: 11, fontWeight: '500', marginTop: 3 },

  inputCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, paddingHorizontal: 16, paddingVertical: 4 },
  inputPrefix: { fontSize: 18, fontWeight: '700', marginRight: 8 },
  input: { flex: 1, fontSize: 17, fontWeight: '600', paddingVertical: 14 },

  tenureRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tenureChip: { flex: 1, minWidth: 60, borderWidth: 1.5, paddingVertical: 14, alignItems: 'center' },
  tenureVal: { fontSize: 16, fontWeight: '800' },
  tenureUnit: { fontSize: 10, fontWeight: '500', marginTop: 2 },

  textAreaCard: { borderWidth: 1 },
  textArea: { fontSize: 14, padding: 16, minHeight: 100 },

  employmentRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  employmentChip: { borderWidth: 1.5, paddingVertical: 12, paddingHorizontal: 20 },
  employmentText: { fontSize: 14, fontWeight: '600' },

  summaryCard: { borderWidth: 1, padding: 20 },
  summaryTitle: { fontSize: 16, fontWeight: '700' },
  summaryDivider: { height: 1, marginVertical: 14 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 13, fontWeight: '500' },
  summaryValue: { fontSize: 13, fontWeight: '700' },

  footer: { paddingHorizontal: 24, paddingVertical: 16, borderTopWidth: 1 },
  nextBtn: { alignItems: 'center', paddingVertical: 16 },
  nextBtnText: { fontSize: 16, fontWeight: '700' },
});
