import { StyleSheet } from 'react-native';
import type { AppTheme } from '../../../constants/themes';

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
      overflow: 'hidden',
      backgroundColor: headerBg,
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
    editIcon: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '600',
      transform: [{ rotate: '0deg' }],
    },
    editIconActive: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '600',
      transform: [{ rotate: '45deg' }],
    },
    headerBody: {
      alignItems: 'center',
      marginTop: 20,
    },
    avatarRing: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 3,
      borderColor: 'rgba(255,255,255,0.4)',
      padding: 3,
    },
    avatar: {
      flex: 1,
      borderRadius: 38,
      backgroundColor: 'rgba(255,255,255,0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      color: '#FFFFFF',
      fontSize: 28,
      fontWeight: '800',
    },
    headerName: {
      color: '#FFFFFF',
      fontSize: 22,
      fontWeight: '700',
      marginTop: 12,
    },
    headerEmail: {
      color: 'rgba(255,255,255,0.7)',
      fontSize: 13,
      marginTop: 3,
    },
    headerSub: {
      color: 'rgba(255,255,255,0.5)',
      fontSize: 12,
      marginTop: 4,
    },
    flex: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 40,
    },
    contentPad: {
      paddingHorizontal: spacing.lg,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: colors.textSecondary,
      marginTop: spacing.xl,
      marginBottom: spacing.sm,
    },
    card: {
      borderWidth: 1,
      overflow: 'hidden',
      backgroundColor: colors.surfaceElevated,
      borderColor: colors.border,
      borderRadius: radius.lg,
    },
    cardAddress: {
      padding: spacing.lg,
    },
    cardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 16,
    },
    cardIcon: {
      fontSize: 20,
      width: 36,
    },
    cardInfo: {
      flex: 1,
    },
    cardLabel: {
      fontSize: 11,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    cardValue: {
      fontSize: 15,
      fontWeight: '600',
      marginTop: 2,
      color: colors.text,
    },
    cardDivider: {
      height: 1,
      marginHorizontal: 16,
      backgroundColor: colors.border,
    },
    bottomSpacer: {
      height: 40,
    },
  });
}
