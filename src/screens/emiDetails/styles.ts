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
      paddingBottom: 40,
    },
    breakupDivider: {
      height: 1,
      backgroundColor: colors.border,
    },
    breakupDividerSpaced: {
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
      marginTop: 4,
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
    shareTrack: {
      flexDirection: 'row',
      height: 10,
      marginTop: spacing.md,
      overflow: 'hidden',
      borderRadius: radius.pill,
      backgroundColor: colors.border,
    },
    sharePrincipal: {
      backgroundColor: colors.success,
    },
    shareInterest: {
      backgroundColor: colors.primary + '55',
    },
    shareLegend: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.xs,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.success,
    },
    legendDotInterest: {
      backgroundColor: colors.primary + '55',
    },
    legendText: {
      fontSize: 11,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    segments: {
      flexDirection: 'row',
      gap: 2,
      marginTop: spacing.sm,
    },
    segment: {
      flex: 1,
      height: 9,
      borderRadius: 2,
      backgroundColor: colors.border,
    },
    segmentPaid: {
      backgroundColor: colors.primary,
    },
    segmentCurrent: {
      backgroundColor: colors.warning,
    },
    progressTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    progressLabel: {
      fontSize: 11,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: colors.textSecondary,
    },
    progressValue: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.text,
    },
    progressRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.sm,
    },
    captionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    captionDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.success,
    },
    captionDotCurrent: {
      backgroundColor: colors.warning,
    },
    progressText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
    },
  });
}
