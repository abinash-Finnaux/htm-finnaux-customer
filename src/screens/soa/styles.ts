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
    heroBadge: {
      alignSelf: 'flex-start',
      marginTop: 12,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: radius.pill,
      backgroundColor: 'rgba(255,255,255,0.16)',
    },
    heroBadgeText: {
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

    /* Section titles */
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: spacing.xl,
      marginBottom: spacing.sm + 2,
    },
    titleRowFirst: {
      marginTop: 0,
    },
    title: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.text,
    },
    countChip: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: radius.pill,
      backgroundColor: colors.primary + '15',
    },
    countChipText: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.primary,
    },

    /* Loan pill chips */
    loanPillsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    loanPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flexGrow: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: radius.lg,
      backgroundColor: colors.surfaceElevated,
    },
    loanPillActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    loanPillIcon: {
      fontSize: 20,
    },
    loanPillType: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.text,
    },
    loanPillTypeActive: {
      color: '#FFFFFF',
    },
    loanPillId: {
      fontSize: 10,
      fontWeight: '500',
      marginTop: 1,
      color: colors.textSecondary,
    },
    loanPillIdActive: {
      color: 'rgba(255,255,255,0.75)',
    },

    /* Selected account strip */
    accountStrip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginTop: spacing.sm,
      paddingVertical: 12,
      paddingHorizontal: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      backgroundColor: colors.surfaceElevated,
    },
    stripIconCircle: {
      width: 38,
      height: 38,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.primary + '15',
    },
    stripIconText: {
      fontSize: 18,
    },
    stripMiddle: {
      flex: 1,
    },
    stripType: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.text,
    },
    stripId: {
      fontSize: 11,
      fontWeight: '500',
      marginTop: 2,
      color: colors.textSecondary,
    },
    stripOutLabel: {
      fontSize: 9,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
      color: colors.textSecondary,
      textAlign: 'right',
    },
    stripOutValue: {
      fontSize: 14,
      fontWeight: '800',
      marginTop: 2,
      color: colors.text,
    },

    /* Period chips */
    periodRow: {
      flexDirection: 'row',
      gap: spacing.sm,
    },

    /* Summary stat grid */
    statGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    statBox: {
      flexGrow: 1,
      flexBasis: '46%',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      backgroundColor: colors.surfaceElevated,
      padding: spacing.md,
    },
    statBoxHighlight: {
      backgroundColor: colors.primary + '10',
      borderColor: colors.primary + '30',
    },
    statLabel: {
      fontSize: 10,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: colors.textSecondary,
    },
    statValue: {
      fontSize: 16,
      fontWeight: '800',
      marginTop: 5,
      color: colors.text,
    },
    statValueHighlight: {
      fontSize: 17,
      color: colors.primary,
    },

    /* Timeline ledger */
    ledgerWrap: {
      paddingTop: 4,
    },

    /* Empty state */
    emptyState: {
      alignItems: 'center',
      paddingVertical: 32,
      gap: 8,
    },
    emptyIcon: {
      fontSize: 32,
    },
    emptyText: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.textSecondary,
    },

    /* Footer band */
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
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
    footerSub: {
      fontSize: 10,
      fontWeight: '500',
      marginTop: 2,
      color: colors.textSecondary,
    },
  });
}
