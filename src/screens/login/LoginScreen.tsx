import React from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { useTheme } from '../../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RootStackParamList } from '../../../App';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import logo from './../../assets/images/logo.png';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import LogoHeader from './_components/LogoHeader';
import AuthFooter from './_components/AuthFooter';
import FormTextInput from '../../components/forms/FormTextInput';
import FormPasswordInput from '../../components/forms/FormPasswordInput';
import { apiService } from '../../api';
import { API_ENDPOINTS } from '../../api';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

type LoginForm = {
  customerId: string;
  password: string;
};

type LoginResponse = {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export default function LoginScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginForm>({
    defaultValues: {
      customerId: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await apiService.post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        {
          customerId: data.customerId,
          password: data.password,
        },
      );

      await AsyncStorage.setItem('@finnaux_token', response.data.token);
      await AsyncStorage.setItem('@finnaux_refresh_token', response.data.refreshToken);

      navigation.replace('Home');
    } catch (error: any) {
      const message =
        error?.response?.data?.message || 'Login failed. Please try again.';
      Alert.alert('Login Failed', message);
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
            <Text style={themed.formSubtitle}>Sign in to continue</Text>

            <View style={themed.fieldGroup}>
              <FormTextInput
                control={control}
                name="customerId"
                label="Customer ID"
                placeholder="Enter your customer ID"
                rules={{ required: 'Customer ID is required' }}
                backgroundColor={colors.surface}
              />

              <FormPasswordInput
                control={control}
                name="password"
                label="Password"
                placeholder="Enter your password"
                rules={{ required: 'Password is required' }}
              />

              <Pressable style={themed.forgotRow}>
                <Text style={themed.forgotText}>Forgot Password?</Text>
              </Pressable>

              <PrimaryButton
                title="Sign In"
                onPress={handleSubmit(onSubmit)}
                loading={isSubmitting}
                disabled={isSubmitting}
                style={themed.submitButton}
              />
            </View>
          </View>

          <AuthFooter
            message="Don't have an account?"
            linkLabel="Sign Up"
            onLinkPress={() => navigation.navigate('SignUp')}
            skipLabel="Skip for now →"
            onSkipPress={() => navigation.replace('Home')}
          />
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
  });
}
