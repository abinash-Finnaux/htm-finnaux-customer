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
    headerBody: {
      alignItems: 'center',
      marginTop: 20,
    },
    headerIcon: {
      fontSize: 36,
    },
    headerLabel: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '700',
      marginTop: 10,
    },
    headerSub: {
      color: 'rgba(255,255,255,0.75)',
      fontSize: 12,
      fontWeight: '500',
      marginTop: 4,
    },
    flex: {
      flex: 1,
    },
    scrollContent: {
      padding: spacing.lg,
      paddingBottom: 20,
    },
    sectionLabel: {
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: colors.textSecondary,
      marginTop: spacing.lg,
      marginBottom: spacing.sm,
    },

    /* Loan account rows */
    loanRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      padding: spacing.md,
      borderRadius: radius.md,
      gap: 12,
    },
    loanIconCircle: {
      width: 42,
      height: 42,
      borderRadius: 21,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.primary + '15',
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
    loanId: {
      fontSize: 11,
      fontWeight: '500',
      marginTop: 2,
      color: colors.textSecondary,
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
    loanOutValue: {
      fontSize: 13,
      fontWeight: '800',
      marginTop: 2,
      color: colors.text,
    },
    radio: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    radioDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
    },

    /* Due EMI chips */
    dueGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    dueChip: {
      borderWidth: 1,
      alignItems: 'center',
      paddingVertical: 12,
      flex: 1,
      minWidth: '30%',
      borderRadius: radius.md,
    },
    dueChipTick: {
      position: 'absolute',
      top: 5,
      right: 5,
      width: 16,
      height: 16,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dueChipTickText: {
      fontSize: 9,
      fontWeight: '800',
    },
    dueChipMonth: {
      fontSize: 11,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    dueChipAmount: {
      fontSize: 15,
      fontWeight: '800',
      marginTop: 4,
    },
    dueChipYear: {
      fontSize: 10,
      fontWeight: '500',
      marginTop: 2,
    },

    /* Summary */
    summaryCard: {
      borderWidth: 1,
      padding: spacing.lg,
      marginTop: spacing.xl,
      backgroundColor: colors.primary + '08',
      borderColor: colors.primary + '20',
      borderRadius: radius.lg,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 6,
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
      marginVertical: 6,
    },

    /* Pinned footer */
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
      gap: spacing.md,
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
  });
}
