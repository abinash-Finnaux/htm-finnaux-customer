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
      paddingBottom: 20,
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
    progressTrack: {
      marginTop: 16,
    },
    progressBg: {
      height: 4,
      backgroundColor: 'rgba(255,255,255,0.15)',
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 2,
      backgroundColor: '#FFFFFF',
    },
    flex: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 20,
    },
    slideContainer: {
      paddingHorizontal: spacing.lg,
    },
    fieldGroup: {
      marginBottom: 16,
    },
    fieldHint: {
      fontSize: 11,
      fontWeight: '500',
      marginTop: 6,
      color: colors.textSecondary,
    },
    halfRow: {
      flexDirection: 'row',
      gap: 12,
    },
    halfField: {
      flex: 1,
    },
    reviewCard: {
      borderWidth: 1,
      marginBottom: 14,
      borderRadius: radius.lg,
      overflow: 'hidden',
    },
    reviewHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    reviewHeaderText: {
      fontSize: 13,
      fontWeight: '700',
    },
    editBtn: {
      fontSize: 12,
      fontWeight: '700',
    },
    termsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      padding: 16,
      marginTop: 4,
      gap: 12,
      borderRadius: radius.lg,
    },
    checkbox: {
      width: 22,
      height: 22,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkIcon: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '800',
    },
    termsText: {
      fontSize: 13,
      fontWeight: '500',
      flex: 1,
      color: colors.textSecondary,
    },
    bottomSpacer: {
      height: 40,
    },
    footer: {
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderTopWidth: 1,
      backgroundColor: colors.background,
      borderTopColor: colors.border,
    },
    nextBtn: {
      alignItems: 'center',
      paddingVertical: 16,
      borderRadius: radius.pill,
    },
    nextBtnText: {
      fontSize: 16,
      fontWeight: '700',
    },
    siWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
      gap: 0,
    },
    siItem: {
      alignItems: 'center',
      gap: 4,
    },
    siCircle: {
      width: 30,
      height: 30,
      borderRadius: 15,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    siCircleText: {
      fontSize: 12,
      fontWeight: '800',
    },
    siLabel: {
      fontSize: 9,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.3,
    },
    siLine: {
      width: 24,
      height: 2,
      borderRadius: 1,
      marginHorizontal: 4,
      marginBottom: 16,
    },
  });
}

export const rrStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
    marginLeft: 16,
  },
});
