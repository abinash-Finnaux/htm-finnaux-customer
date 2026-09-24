import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  ArrowRight,
  Clock,
  Layers,
  ShieldCheck,
  Wallet,
} from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';

const FEATURES = [
  { icon: Layers, label: '4 Loan Types' },
  { icon: Clock, label: '<2 Min Apply' },
  { icon: ShieldCheck, label: 'Safe & Secure' },
];

type Props = {
  onPress: () => void;
  activeApplications?: number;
};

export default function ApplyLoanCard({ onPress, activeApplications }: Props) {
  const { theme } = useTheme();
  const themed = createStyles(theme);

  return (
    <View style={themed.section}>
      <View style={themed.card}>
        <View style={themed.accentBar} />

        <View style={themed.headerRow}>
          <Text style={[themed.title]}>Apply for a Loan</Text>
          {/* </View> */}
        </View>

        <Text style={themed.subtitle}>
          Personal, Business, Home & Vehicle loans with instant eligibility — no
          paperwork needed.
        </Text>

        <View style={themed.featureRow}>
          {FEATURES.map(feature => (
            <View key={feature.label} style={themed.featureItem}>
              <feature.icon size={18} color={theme.colors.primary} />
              <Text style={themed.featureText}>{feature.label}</Text>
            </View>
          ))}
        </View>

        <View style={themed.divider} />

        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            themed.cta,
            activeApplications && activeApplications > 0
              ? themed.ctaSecondary
              : null,
            pressed && themed.ctaPressed,
          ]}
        >
          <Text
            style={[
              themed.ctaText,
              activeApplications && activeApplications > 0
                ? themed.ctaTextSecondary
                : null,
            ]}
          >
            {activeApplications && activeApplications > 0
              ? 'Apply for a New Loan'
              : 'Apply for a Loan'}
          </Text>
          <ArrowRight size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  const { colors, spacing, radius } = theme;

  return StyleSheet.create({
    section: {
      paddingHorizontal: spacing.lg,
      marginTop: spacing.xl,
    },
    card: {
      borderRadius: radius.lg,
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 4,
      overflow: 'hidden',
    },
    accentBar: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      backgroundColor: colors.primary,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      flexShrink: 1,
    },
    iconWrap: {
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor: colors.primary + '14',
      justifyContent: 'center',
      alignItems: 'center',
    },
    eyebrow: {
      fontSize: 11,
      fontWeight: '800',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    title: {
      fontSize: 21,
      fontWeight: '800',
      color: colors.text,
      marginTop: 2,
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: radius.pill,
      backgroundColor: colors.primaryLight + '26',
    },
    badgeText: {
      color: colors.primary,
      fontSize: 11,
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    subtitle: {
      fontSize: 13,
      lineHeight: 20,
      color: colors.textSecondary,
      marginTop: spacing.md,
    },
    featureRow: {
      flexDirection: 'row',
      marginTop: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      backgroundColor: colors.background,
      paddingVertical: 12,
    },
    featureItem: {
      flex: 1,
      alignItems: 'center',
      gap: 5,
    },
    featureText: {
      fontSize: 10,
      fontWeight: '700',
      color: colors.textSecondary,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: spacing.md,
    },
    cta: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 15,
      borderRadius: radius.pill,
      backgroundColor: colors.primary,
    },
    ctaSecondary: {
      backgroundColor: colors.primaryDark,
    },
    ctaPressed: {
      opacity: 0.85,
    },
    ctaText: {
      fontSize: 15,
      fontWeight: '800',
      color: '#FFFFFF',
    },
    ctaTextSecondary: {
      color: '#FFFFFF',
    },
  });
}
