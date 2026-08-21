import { Dimensions, StyleSheet } from 'react-native';
import type { AppTheme } from './../../constants/themes';

export const SLIDE_WIDTH = Dimensions.get('window').width * 0.72;

export function createStyles(
  colors: AppTheme['colors'],
  spacing: AppTheme['spacing'],
  heroBg: string,
  heroDecor: string,
) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    flex: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 40,
    },
    hero: {
      paddingTop: 56,
      paddingBottom: 32,
      paddingHorizontal: 24,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      backgroundColor: heroBg,
      overflow: 'hidden',
    },
    heroDecor1: {
      position: 'absolute',
      top: -60,
      right: -40,
      width: 180,
      height: 180,
      borderRadius: 90,
      backgroundColor: heroDecor,
    },
    heroDecor2: {
      position: 'absolute',
      bottom: 20,
      left: -50,
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: heroDecor,
    },
    heroDecor3: {
      position: 'absolute',
      top: 40,
      right: 60,
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: heroDecor,
    },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    profileWrap: {
      position: 'relative',
    },
    profilePressed: {
      opacity: 0.7,
    },
    profileAvatar: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: 'rgba(255,255,255,0.25)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'rgba(255,255,255,0.5)',
    },
    profileInitials: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '800',
    },
    profileBadge: {
      position: 'absolute',
      bottom: 0,
      right: -1,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: '#22C55E',
      borderWidth: 2,
      borderColor: heroBg,
    },
    topBarLogo: {
      width: 120,
      height: 32,
      tintColor: '#FFFFFF',
    },
    topBarBtn: {
      width: 40,
      height: 40,
      backgroundColor: 'rgba(255,255,255,0.18)',
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconBtnPressed: {
      opacity: 0.6,
    },
    topBarBtnIcon: {
      fontSize: 18,
    },
    heroBody: {
      marginTop: 28,
    },
    heroGreeting: {
      color: 'rgba(255,255,255,0.7)',
      fontSize: 14,
      fontWeight: '500',
    },
    heroName: {
      color: '#FFFFFF',
      fontSize: 26,
      fontWeight: '800',
      marginTop: 4,
    },
    heroSub: {
      color: 'rgba(255,255,255,0.6)',
      fontSize: 13,
      marginTop: 6,
      lineHeight: 18,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 24,
    },
    servicesSection: {
      paddingHorizontal: spacing.lg,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginTop: spacing.xl,
      marginBottom: spacing.md,
    },
    servicesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
  });
}

export function createDrawerStyles(
  colors: AppTheme['colors'],
  heroBg: string,
) {
  return StyleSheet.create({
    root: {
      flex: 1,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.45)',
    },
    panel: {
      width: SLIDE_WIDTH,
      height: '100%',
      borderTopRightRadius: 24,
      borderBottomRightRadius: 24,
      overflow: 'hidden',
      backgroundColor: colors.surface,
      shadowColor: '#000',
      shadowOffset: { width: 4, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 10,
    },
    header: {
      paddingTop: 56,
      paddingBottom: 24,
      paddingHorizontal: 24,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      backgroundColor: heroBg,
    },
    avatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: 'rgba(255,255,255,0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: 'rgba(255,255,255,0.4)',
      marginBottom: 14,
    },
    avatarText: {
      color: '#FFFFFF',
      fontSize: 26,
      fontWeight: '800',
    },
    name: {
      color: '#FFFFFF',
      fontSize: 20,
      fontWeight: '700',
    },
    email: {
      color: 'rgba(255,255,255,0.7)',
      fontSize: 13,
      marginTop: 4,
    },
    phone: {
      color: 'rgba(255,255,255,0.7)',
      fontSize: 13,
      marginTop: 2,
    },
    body: {
      flex: 1,
      paddingTop: 16,
      paddingHorizontal: 8,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 12,
    },
    itemIcon: {
      fontSize: 20,
      width: 32,
    },
    itemLabel: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
    },
    itemLabelDanger: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      color: '#EF4444',
    },
    itemArrow: {
      fontSize: 20,
      fontWeight: '300',
      color: colors.textSecondary,
    },
    divider: {
      height: 1,
      marginVertical: 8,
      marginHorizontal: 16,
      backgroundColor: colors.border,
    },
    footer: {
      paddingVertical: 16,
      paddingHorizontal: 24,
      alignItems: 'center',
    },
    footerText: {
      fontSize: 12,
      color: colors.textSecondary,
    },
  });
}
