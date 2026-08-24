import { StyleSheet } from 'react-native';
import type { AppTheme } from '../../constants/themes';

export function createStyles(
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

    /* Header */
    header: {
      paddingTop: 56,
      paddingBottom: 26,
      paddingHorizontal: 24,
      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,
      backgroundColor: headerBg,
      overflow: 'hidden',
    },
    decor1: {
      position: 'absolute',
      top: -40,
      right: -30,
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: decorBg,
    },
    decor2: {
      position: 'absolute',
      bottom: 10,
      left: -40,
      width: 100,
      height: 100,
      borderRadius: 50,
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
      fontSize: 20,
      fontWeight: '600',
    },
    topTitle: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    topSpacer: {
      width: 40,
    },
    heroRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 22,
    },
    heroLeft: {
      flex: 1,
    },
    heroLabel: {
      color: 'rgba(255,255,255,0.72)',
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    heroAmount: {
      color: '#FFFFFF',
      fontSize: 30,
      fontWeight: '800',
      marginTop: 6,
      letterSpacing: 0.3,
    },
    heroDueBadge: {
      alignSelf: 'flex-start',
      marginTop: 12,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: radius.pill,
      backgroundColor: 'rgba(255,255,255,0.16)',
    },
    heroDueText: {
      color: '#FFFFFF',
      fontSize: 11,
      fontWeight: '600',
    },
    heroIconWrap: {
      width: 64,
      height: 64,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.16)',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 16,
    },
    heroIcon: {
      fontSize: 30,
    },

    flex: {
      flex: 1,
    },
    scrollContent: {
      padding: spacing.lg,
      paddingBottom: 24,
    },

    /* Step headers */
    stepRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: spacing.xl,
      marginBottom: spacing.sm + 2,
    },
    stepBadge: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: colors.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
    },
    stepBadgeText: {
      fontSize: 11,
      fontWeight: '800',
      color: colors.primary,
    },
    stepTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.text,
      letterSpacing: 0.3,
      textTransform: 'uppercase',
    },

    /* Loan account cards */
    loanStack: {
      gap: spacing.sm,
    },
    loanRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      borderRadius: radius.lg,
      backgroundColor: colors.surfaceElevated,
      gap: 12,
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 2,
    },
    loanRowSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    loanIconCircle: {
      width: 44,
      height: 44,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.primary + '15',
    },
    loanIconCircleSelected: {
      backgroundColor: 'rgba(255,255,255,0.2)',
    },
    loanIconText: {
      fontSize: 20,
    },
    loanMiddle: {
      flex: 1,
    },
    loanType: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
    },
    loanTypeSelected: {
      color: '#FFFFFF',
    },
    loanId: {
      fontSize: 11,
      fontWeight: '500',
      marginTop: 2,
      color: colors.textSecondary,
    },
    loanIdSelected: {
      color: 'rgba(255,255,255,0.75)',
    },
    loanOutWrap: {
      alignItems: 'flex-end',
    },
    loanOutLabel: {
      fontSize: 9,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
      color: colors.textSecondary,
    },
    loanOutLabelSelected: {
      color: 'rgba(255,255,255,0.7)',
    },
    loanOutValue: {
      fontSize: 13,
      fontWeight: '800',
      marginTop: 2,
      color: colors.text,
    },
    loanOutValueSelected: {
      color: '#FFFFFF',
    },
    checkCircle: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkCircleActive: {
      borderColor: '#FFFFFF',
      backgroundColor: '#FFFFFF',
    },
    checkMark: {
      color: '#1E293B',
      fontSize: 12,
      fontWeight: '800',
      lineHeight: 14,
    },

    /* Due EMI chips */
    dueGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    dueChip: {
      borderWidth: 1.5,
      alignItems: 'center',
      paddingVertical: 16,
      flex: 1,
      minWidth: '30%',
      borderRadius: radius.lg,
      backgroundColor: colors.surfaceElevated,
    },
    dueChipSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    dueChipMonth: {
      fontSize: 11,
      fontWeight: '600',
      textTransform: 'uppercase',
      color: colors.textSecondary,
    },
    dueChipMonthSelected: {
      color: 'rgba(255,255,255,0.7)',
    },
    dueChipAmount: {
      fontSize: 15,
      fontWeight: '800',
      marginTop: 4,
      color: colors.text,
    },
    dueChipAmountSelected: {
      color: '#FFFFFF',
    },
    dueChipYear: {
      fontSize: 10,
      fontWeight: '500',
      marginTop: 2,
      color: colors.textSecondary,
    },
    dueChipYearSelected: {
      color: 'rgba(255,255,255,0.6)',
    },

    /* Summary */
    summaryCard: {
      borderWidth: 1,
      padding: spacing.lg,
      marginTop: spacing.xl,
      backgroundColor: colors.surfaceElevated,
      borderColor: colors.border,
      borderRadius: radius.lg,
    },
    summaryTitleRow: {
      marginBottom: 6,
    },
    summaryTitle: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.text,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 7,
    },
    summaryLabel: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    summaryValue: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
    },
    summaryDivider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 8,
    },
    totalRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.primary + '10',
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: 12,
      marginTop: 6,
    },
    totalLabel: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.text,
    },
    totalValue: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.primary,
    },

    /* Floating footer */
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: spacing.lg,
      marginBottom: spacing.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: 14,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceElevated,
      gap: spacing.md,
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 8,
    },
    footerTotalWrap: {
      flex: 1,
    },
    footerTotalLabel: {
      fontSize: 11,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
      color: colors.textSecondary,
    },
    footerTotalValue: {
      fontSize: 20,
      fontWeight: '800',
      color: colors.text,
      marginTop: 2,
    },
    payBtn: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      paddingHorizontal: 28,
      backgroundColor: colors.primary,
      borderRadius: radius.pill,
    },
    payBtnPressed: {
      opacity: 0.85,
    },
    payBtnDisabled: {
      backgroundColor: colors.border,
    },
    payBtnText: {
      color: colors.onPrimary,
      fontSize: 15,
      fontWeight: '700',
    },
    payBtnTextDisabled: {
      color: colors.textSecondary,
    },
  });
}
