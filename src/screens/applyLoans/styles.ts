import { StyleSheet } from 'react-native';
import type { AppTheme } from '../../constants/themes';

export function createStyles(
  colors: AppTheme['colors'],
  spacing: AppTheme['spacing'],
  radius: AppTheme['radius'],
  headerBg: string,
  headerBgLight: string,
  decorBg: string,
) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: 56,
      paddingBottom: 28,
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
    headerBody: {
      alignItems: 'center',
      marginTop: 20,
    },
    stepLabel: {
      color: 'rgba(255,255,255,0.7)',
      fontSize: 13,
      fontWeight: '500',
    },
    progressBar: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
      gap: 6,
    },
    progressDot: {
      height: 6,
      borderRadius: 3,
    },
    progressDotActive: {
      backgroundColor: '#FFFFFF',
      width: 40,
    },
    progressDotInactive: {
      backgroundColor: 'rgba(255,255,255,0.25)',
      width: 12,
    },
    flex: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 20,
    },
    contentPadding: {
      paddingHorizontal: spacing.lg,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 10,
      marginTop: spacing.xl,
      color: colors.textSecondary,
    },
    loanGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    loanCard: {
      width: '47%',
      borderWidth: 1.5,
      padding: 16,
      alignItems: 'center',
      overflow: 'hidden',
      borderRadius: radius.lg,
    },
    loanCardSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    loanCardUnselected: {
      backgroundColor: colors.surfaceElevated,
      borderColor: colors.border,
    },
    loanCardPressed: {
      backgroundColor: headerBgLight,
    },
    loanIconWrap: {
      width: 52,
      height: 52,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    loanIcon: {
      fontSize: 26,
    },
    loanLabel: {
      fontSize: 14,
      fontWeight: '700',
      textAlign: 'center',
    },
    loanRange: {
      fontSize: 11,
      fontWeight: '500',
      marginTop: 3,
    },
    cardTick: {
      position: 'absolute',
      top: 6,
      right: 6,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    cardTickText: {
      fontSize: 9,
      fontWeight: '800',
      color: colors.primary,
    },
    inputCard: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      paddingHorizontal: 16,
      paddingVertical: 4,
      backgroundColor: colors.surfaceElevated,
      borderColor: colors.border,
      borderRadius: radius.lg,
    },
    inputPrefix: {
      fontSize: 18,
      fontWeight: '700',
      marginRight: 8,
      color: colors.textSecondary,
    },
    input: {
      flex: 1,
      fontSize: 17,
      fontWeight: '600',
      paddingVertical: 14,
      color: colors.text,
    },
    chipTickSmall: {
      position: 'absolute',
      top: 3,
      right: 3,
      width: 14,
      height: 14,
      borderRadius: 8,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    chipTickTextSmall: {
      fontSize: 9,
      fontWeight: '800',
      color: colors.primary,
    },
    employmentRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    employmentChip: {
      borderWidth: 1.5,
      paddingVertical: 12,
      paddingHorizontal: 20,
      overflow: 'hidden',
      borderRadius: radius.md,
    },
    employmentChipSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    employmentChipUnselected: {
      backgroundColor: colors.surfaceElevated,
      borderColor: colors.border,
    },
    employmentChipPressed: {
      backgroundColor: headerBgLight,
    },
    employmentText: {
      fontSize: 14,
      fontWeight: '600',
    },
    summaryCard: {
      borderWidth: 1,
      padding: 20,
      backgroundColor: colors.surfaceElevated,
      borderColor: colors.border,
      borderRadius: radius.lg,
      marginTop: spacing.xl,
    },
    summaryTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
    },
    summaryDivider: {
      height: 1,
      marginVertical: 14,
      backgroundColor: colors.border,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    summaryLabel: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    summaryValue: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.text,
    },
    bottomSpacer: {
      height: 40,
    },
    footer: {
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
    },
    nextBtn: {
      alignItems: 'center',
      paddingVertical: 16,
      borderRadius: radius.pill,
    },
    nextBtnEnabled: {
      backgroundColor: colors.primary,
    },
    nextBtnDisabled: {
      backgroundColor: colors.border,
    },
    nextBtnText: {
      fontSize: 16,
      fontWeight: '700',
    },
  });
}
