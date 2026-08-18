import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import type { RootStackParamList } from '../../App';
import logo from '../assets/images/logo.png';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const { colors, spacing, radius, typography } = theme;

  const [customerId, setCustomerId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: spacing.lg },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoSection}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
            <Text
              style={[
                styles.appName,
                { color: colors.text, marginTop: spacing.sm },
              ]}
            >
              FINNAUX
            </Text>
            <Text
              style={[
                styles.tagline,
                { color: colors.textSecondary, marginTop: spacing.xs },
              ]}
            >
              Smart Finance Management
            </Text>
          </View>

          <View
            style={[
              styles.formCard,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.border,
                borderRadius: radius.lg,
                padding: spacing.xl,
              },
            ]}
          >
            <Text style={[styles.formTitle, { color: colors.text }]}>
              Welcome
            </Text>
            <Text
              style={[
                styles.formSubtitle,
                { color: colors.textSecondary, marginTop: spacing.xs },
              ]}
            >
              Sign in to continue
            </Text>

            <View style={{ marginTop: spacing.lg }}>
              <Text
                style={[styles.inputLabel, { color: colors.textSecondary }]}
              >
                Customer ID
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text,
                    borderRadius: radius.md,
                    paddingHorizontal: spacing.md,
                    marginTop: spacing.sm,
                  },
                ]}
                placeholder="Enter your customer ID"
                placeholderTextColor={colors.textSecondary}
                value={customerId}
                onChangeText={setCustomerId}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={{ marginTop: spacing.md }}>
              <Text
                style={[styles.inputLabel, { color: colors.textSecondary }]}
              >
                Password
              </Text>
              <View
                style={[
                  styles.passwordContainer,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderRadius: radius.md,
                    paddingHorizontal: spacing.md,
                    marginTop: spacing.sm,
                  },
                ]}
              >
                <TextInput
                  style={[styles.passwordInput, { color: colors.text }]}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <Pressable onPress={() => setShowPassword(prev => !prev)}>
                  <Text
                    style={[styles.togglePassword, { color: colors.primary }]}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </Text>
                </Pressable>
              </View>
            </View>

            <Pressable style={{ alignSelf: 'flex-end', marginTop: spacing.sm }}>
              <Text
                style={{ color: colors.primary, fontSize: typography.small }}
              >
                Forgot Password?
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.loginButton,
                {
                  backgroundColor: colors.primary,
                  borderRadius: radius.pill,
                  marginTop: spacing.xl,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text
                style={[styles.loginButtonText, { color: colors.onPrimary }]}
              >
                Sign In
              </Text>
            </Pressable>
          </View>

          <View style={styles.signupRow}>
            <Text
              style={{ color: colors.textSecondary, fontSize: typography.body }}
            >
              Don't have an account?{' '}
            </Text>
            <Pressable onPress={() => navigation.navigate('SignUp')}>
              <Text
                style={{ color: colors.primary, fontSize: typography.body }}
              >
                Sign Up
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => navigation.replace('Home')}
            style={styles.skipRow}
          >
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: typography.caption,
              }}
            >
              Skip for now →
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 14,
  },
  formCard: {
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  formSubtitle: {
    fontSize: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    height: 48,
    borderWidth: 1,
    fontSize: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    height: 48,
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
  },
  togglePassword: {
    fontSize: 13,
    fontWeight: '600',
  },
  loginButton: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  skipRow: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
});
