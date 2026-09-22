import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { toast } from '../../components/toast/ToastProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RootStackParamList } from '../../../App';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import logo from './../../assets/images/logo.png';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import LogoHeader from './_components/LogoHeader';
// import AuthFooter from './_components/AuthFooter';
import FormTextInput from '../../components/forms/FormTextInput';
import FormPasswordInput from '../../components/forms/FormPasswordInput';
import FormDateOfBirthInput from '../../components/forms/FormDateOfBirthInput';
import { apiClient } from '../../api';
import { API_ENDPOINTS } from '../../api';
import { mapCustomerProfile } from '../../utils/mapCustomerProfile';
import { formatDateToYYYYMMDD } from '../../utils/formatters';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

type VerifyForm = {
  cifNumber: string;
  customerDob: Date | null;
};

type LoginForm = {
  password: string;
};

export default function LoginScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const { setUser } = useUser();

  const [step, setStep] = useState<1 | 2>(1);
  const [cifNumber, setCifNumber] = useState('');
  const [stepToken, setStepToken] = useState('');

  const verifyForm = useForm<VerifyForm>({
    defaultValues: {
      cifNumber: 'CIF0000001861',
      customerDob: new Date('2003-07-05'),
    },
  });

  const loginForm = useForm<LoginForm>({
    defaultValues: {
      password: 'Ishi@05072003',
    },
  });

  useEffect(() => {
    if (cifNumber) {
      verifyForm.setValue('cifNumber', cifNumber);
    }
  }, [cifNumber]);

  const onVerify = async (data: VerifyForm) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_USER, {
        CIF: data.cifNumber,
        Customer_DOB: data.customerDob
          ? formatDateToYYYYMMDD(data.customerDob)
          : '',
      });

      const result =
        typeof response.data === 'string'
          ? JSON.parse(response.data)
          : response.data;

      if (Number(result.CODE) === 1) {
        const profile = mapCustomerProfile(result);
        setCifNumber(profile?.CIF || result.CIF || data.cifNumber);
        setStepToken(result.Token);
        setStep(2);
      } else {
        toast.show(result.Msg || JSON.stringify(result), 'error');
      }
    } catch (error: any) {
      toast.show(
        error?.response?.data?.Msg ||
          error?.response?.data?.message ||
          error?.message ||
          'Verification failed. Please try again.',
        'error',
      );
    }
  };

  const onLogin = async (data: LoginForm) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        StepToken: stepToken,
        Password: data.password,
        IPAddress: '122.180.246.21',
      });

      const result =
        typeof response.data === 'string'
          ? JSON.parse(response.data)
          : response.data;

      console.log('loginResultLOG', result);

      if (Number(result.CODE) === 1) {
        console.log('resultResponse', result);
        if (result.Token) {
          console.log('logintokennn', result.Token);
          await AsyncStorage.setItem('@finnaux_token', result.Token);
        } else {
          console.warn('GetCustomerLogin returned no Token field', result);
        }
        if (result.CustomerId) {
          await AsyncStorage.setItem('@customer_id', String(result.CustomerId));
        }
        navigation.replace('Home');
      } else {
        toast.show(result.Msg || JSON.stringify(result), 'error');
      }
    } catch (error: any) {
      const status = error?.response?.status;
      const responseData = error?.response?.data;
      console.log('loginErrorLOG', {
        status,
        data: responseData,
        config: error?.config?.url,
      });

      const message =
        responseData?.Msg ||
        responseData?.message ||
        (typeof responseData === 'string' && responseData) ||
        (responseData &&
          typeof responseData === 'object' &&
          JSON.stringify(responseData)) ||
        error?.message ||
        'Login failed. Please try again.';

      toast.show(status ? `${message} (${status})` : message, 'error');
    }
  };

  const themed = createStyles(colors, spacing, radius);

  return (
    <View style={themed.root}>
      <KeyboardAvoidingView style={themed.flex} behavior="padding">
        <ScrollView
          style={themed.flex}
          contentContainerStyle={themed.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <LogoHeader
            image={logo}
            appName="FINNAUX"
            tagline="Smart Finance Management"
          />

          <View style={themed.formCard}>
            <Text style={themed.formTitle}>Welcome</Text>
            <Text style={themed.formSubtitle}>
              {step === 1
                ? 'Verify your identity to continue'
                : 'Enter your password to sign in'}
            </Text>

            {step === 1 ? (
              <View style={themed.fieldGroup}>
                <FormTextInput
                  control={verifyForm.control}
                  name="cifNumber"
                  label="CIF Number"
                  placeholder="Enter your CIF number"
                  rules={{ required: 'CIF number is required' }}
                  backgroundColor={colors.surface}
                  formatText={(text: string) => text.toUpperCase()}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  autoComplete="off"
                />

                <FormDateOfBirthInput
                  control={verifyForm.control}
                  name="customerDob"
                  label="Date of Birth"
                  rules={{ required: 'Date of birth is required' }}
                  backgroundColor={colors.surface}
                />

                <PrimaryButton
                  title="Verify User"
                  onPress={verifyForm.handleSubmit(onVerify)}
                  loading={verifyForm.formState.isSubmitting}
                  disabled={verifyForm.formState.isSubmitting}
                  style={themed.submitButton}
                />
              </View>
            ) : (
              <View style={themed.fieldGroup}>
                <FormTextInput
                  control={verifyForm.control}
                  name="cifNumber"
                  label="CIF Number"
                  placeholder="Enter your CIF number"
                  rules={{ required: 'CIF number is required' }}
                  backgroundColor={colors.surface}
                  editable={false}
                />
                <FormPasswordInput
                  control={loginForm.control}
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  rules={{ required: 'Password is required' }}
                  autoFocus
                />

                <Pressable style={themed.forgotRow}>
                  <Text style={themed.forgotText}>Forgot Password?</Text>
                </Pressable>

                <PrimaryButton
                  title="Sign In"
                  onPress={loginForm.handleSubmit(onLogin)}
                  loading={loginForm.formState.isSubmitting}
                  disabled={loginForm.formState.isSubmitting}
                  style={themed.submitButton}
                />

                {/* <Pressable
                  style={themed.backRow}
                  onPress={() => {
                    setStep(1);
                    loginForm.reset();
                  }}
                >
                  <Text style={themed.backText}>← Back</Text>
                </Pressable> */}
              </View>
            )}
          </View>

          {/* <AuthFooter
            message="Don't have an account?"
            linkLabel="Sign Up"
            onLinkPress={() => navigation.navigate('SignUp')}
            skipLabel="Skip for now →"
            onSkipPress={() => navigation.replace('Home')}
          /> */}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function createStyles(
  colors: ReturnType<typeof useTheme>['theme']['colors'],
  spacing: ReturnType<typeof useTheme>['theme']['spacing'],
  radius: ReturnType<typeof useTheme>['theme']['radius'],
) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    flex: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingVertical: 40,
      paddingHorizontal: spacing.lg,
    },
    formCard: {
      borderWidth: 1,
      backgroundColor: colors.surfaceElevated,
      borderColor: colors.border,
      borderRadius: radius.lg,
      padding: spacing.xl,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    formTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
    },
    formSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },
    fieldGroup: {
      marginTop: spacing.md,
    },
    cifLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      // marginBottom: spacing.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
    },
    forgotRow: {
      alignSelf: 'flex-end',
      marginTop: spacing.sm,
    },
    forgotText: {
      color: colors.primary,
      fontSize: 12,
    },
    submitButton: {
      marginTop: spacing.xl,
    },
    backRow: {
      alignSelf: 'center',
      marginTop: spacing.md,
    },
    backText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '500',
    },
  });
}
