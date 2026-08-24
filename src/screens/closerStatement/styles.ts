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
      paddingBottom: 24,
    },

    /* Section titles */
    sectionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: spacing.xl,
      marginBottom: spacing.sm + 2,
      paddingHorizontal: spacing.lg,
    },
    sectionBar: {
      width: 4,
      height: 16,
      borderRadius: 2,
      backgroundColor: colors.primary,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.text,
    },

    /* Horizontal loan cards */
    loanScroller: {
      paddingHorizontal: spacing.lg,
      gap: spacing.sm,
      paddingRight: spacing.lg,
    },

    /* Breakup receipt card */
    breakupCard: {
      marginHorizontal: spacing.lg,
      borderWidth: 1,
      borderLeftWidth: 4,
      borderColor: colors.border,
      borderLeftColor: colors.primary,
      borderRadius: radius.md,
      backgroundColor: colors.surfaceElevated,
      paddingHorizontal: spacing.lg,
      paddingVertical: 6,
    },
    breakupRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 13,
    },
    breakupLabelWrap: {
      flex: 1,
      paddingRight: 12,
    },
    breakupLabel: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    breakupChip: {
      alignSelf: 'flex-start',
      marginTop: 3,
      paddingHorizontal: 7,
      paddingVertical: 2,
      borderRadius: radius.sm,
      backgroundColor: colors.warning + '18',
    },
    breakupChipText: {
      fontSize: 9,
      fontWeight: '700',
      color: colors.warning,
    },
    breakupValue: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
    },
    breakupDivider: {
      height: 1,
      backgroundColor: colors.border,
    },
    breakupDashDivider: {
      borderTopWidth: 1,
      borderStyle: 'dashed',
      borderColor: colors.border,
    },
    breakupTotalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 14,
    },
    totalLabel: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
    },
    totalValue: {
      fontSize: 19,
      fontWeight: '800',
      color: colors.primary,
    },

    /* Validity banner */
    validityBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginHorizontal: spacing.lg,
      marginTop: spacing.lg,
      padding: spacing.md,
      borderWidth: 1,
      backgroundColor: colors.warning + '12',
      borderColor: colors.warning + '38',
      borderRadius: radius.md,
    },
    validityIcon: {
      fontSize: 16,
    },
    validityText: {
      flex: 1,
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 18,
      color: colors.text,
    },

    /* After payment steps */
    stepsCard: {
      marginHorizontal: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.lg,
      backgroundColor: colors.surfaceElevated,
      padding: spacing.lg,
      gap: 16,
    },
    stepItem: {
      flexDirection: 'row',
      gap: 12,
    },
    stepNumCircle: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: colors.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
    },
    stepNumText: {
      fontSize: 12,
      fontWeight: '800',
      color: colors.primary,
    },
    stepContent: {
      flex: 1,
    },
    stepTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.text,
    },
    stepDesc: {
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 17,
      color: colors.textSecondary,
      marginTop: 2,
    },

    /* Flat footer */
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: 14,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surfaceElevated,
      gap: spacing.md,
    },
    footerLeft: {
      flex: 1,
    },
    footerLabel: {
      fontSize: 11,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
      color: colors.textSecondary,
    },
    footerAmount: {
      fontSize: 20,
      fontWeight: '800',
      color: colors.text,
      marginTop: 2,
    },
  });
}
