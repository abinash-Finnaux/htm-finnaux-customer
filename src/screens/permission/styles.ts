import { StyleSheet } from 'react-native';
import type { AppTheme } from '../../constants/themes';

export function createStyles(
  colors: AppTheme['colors'],
  spacing: AppTheme['spacing'],
  radius: AppTheme['radius'],
  typography: AppTheme['typography'],
) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },

    introWrapper: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      paddingHorizontal: 28,
    },

    introContent: {
      alignItems: 'center',
    },

    introIconCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.primary + '15',
      marginBottom: spacing.xl,
    },

    logo: {
      width: 70,
      height: 70,
    },

    introTitle: {
      fontSize: 26,
      fontWeight: '700',
      textAlign: 'center',
      color: colors.text,
      marginBottom: spacing.sm,
    },

    introDescription: {
      fontSize: 15,
      textAlign: 'center',
      lineHeight: 22,
      paddingHorizontal: 8,
      color: colors.textSecondary,
      marginBottom: spacing.xxl,
    },

    featureGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 10,
    },

    featureChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderWidth: 1,
      gap: 8,
      borderRadius: radius.md,
    },

    chipGranted: {
      backgroundColor: colors.success + '12',
      borderColor: colors.success,
    },

    chipPending: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },

    featureChipIcon: {
      fontSize: 18,
    },

    featureChipLabel: {
      fontWeight: '500',
      fontSize: typography.small,
    },

    chipLabelGranted: {
      color: colors.success,
    },

    chipLabelPending: {
      color: colors.text,
    },

    agreeButton: {
      alignItems: 'center',
      paddingVertical: 16,
      width: '100%',
      backgroundColor: colors.primary,
      borderRadius: radius.pill,
      marginTop: spacing.xxl,
    },

    agreeButtonText: {
      fontWeight: '700',
      color: colors.onPrimary,
      fontSize: typography.body,
    },

    disagreeButton: {
      alignItems: 'center',
      paddingVertical: 10,
      borderRadius: radius.pill,
      marginTop: spacing.md,
    },

    disagreeText: {
      color: colors.textSecondary,
      fontSize: typography.caption,
    },

    doneIconCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.success + '15',
    },

    doneTitle: {
      fontSize: 26,
      fontWeight: '700',
      textAlign: 'center',
      color: colors.text,
      marginTop: spacing.lg,
    },

    doneDescription: {
      fontSize: 15,
      textAlign: 'center',
      lineHeight: 22,
      paddingHorizontal: 8,
      color: colors.textSecondary,
      marginTop: spacing.sm,
    },

    doneCheck: {
      fontSize: 44,
      color: '#22C55E',
      fontWeight: '700',
    },

    permWrapper: {
      flex: 1,
      width: '100%',
      paddingHorizontal: 28,
      justifyContent: 'center',
    },

    permContent: {
      alignItems: 'center',
    },

    permHeader: {
      alignSelf: 'flex-end',
    },

    permCounter: {
      fontWeight: '600',
      color: colors.textSecondary,
      fontSize: typography.small,
    },

    progressBarTrack: {
      height: 4,
      width: '100%',
      backgroundColor: colors.border,
      borderRadius: radius.pill,
      marginTop: spacing.sm,
    },

    progressBarFill: {
      height: 4,
      backgroundColor: colors.primary,
      borderRadius: radius.pill,
    },

    dotsRow: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 12,
    },

    dot: {
      width: 8,
      height: 8,
      borderRadius: radius.pill,
    },

    dotActive: {
      backgroundColor: colors.primary,
    },

    dotInactive: {
      backgroundColor: colors.border,
    },

    permIconCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.primary + '12',
      marginTop: spacing.xxl,
      marginBottom: spacing.xl,
    },

    permIcon: {
      fontSize: 44,
    },

    permTitle: {
      fontSize: 24,
      fontWeight: '700',
      textAlign: 'center',
      color: colors.text,
      marginBottom: spacing.sm,
    },

    permDescription: {
      fontSize: 15,
      textAlign: 'center',
      lineHeight: 22,
      paddingHorizontal: 8,
      color: colors.textSecondary,
      marginBottom: spacing.xxl,
    },

    approveButton: {
      alignItems: 'center',
      paddingVertical: 16,
      width: '100%',
      backgroundColor: colors.primary,
      borderRadius: radius.pill,
    },

    approveButtonText: {
      fontWeight: '700',
      color: colors.onPrimary,
      fontSize: typography.body,
    },

    skipButton: {
      alignItems: 'center',
      paddingVertical: 10,
      borderRadius: radius.pill,
      marginTop: spacing.md,
    },

    skipText: {
      color: colors.textSecondary,
      fontSize: typography.caption,
    },
  });
}
