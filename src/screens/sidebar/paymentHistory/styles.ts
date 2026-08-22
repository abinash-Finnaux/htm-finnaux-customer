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
    flex: {
      flex: 1,
    },
    scrollContent: {
      padding: spacing.lg,
      paddingBottom: 40,
    },
  });
}
