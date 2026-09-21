import { StyleSheet } from 'react-native';

export const createStyles = (colors: any) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    backBtn: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.text,
    },
    headerSpacer: {
      width: 34,
    },
    separator: {
      height: 0.5,
      backgroundColor: colors.border,
    },
    hero: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 22,
      borderRadius: 16,
      marginHorizontal: 16,
      marginTop: 12,
    },
    heroTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    heroTitle: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.background,
      opacity: 0.85,
      letterSpacing: 0.3,
    },
    paidBadge: {
      backgroundColor: 'rgba(255,255,255,0.18)',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
    },
    paidText: {
      fontSize: 10,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    emiLabel: {
      fontSize: 22,
      fontWeight: '800',
      color: '#FFFFFF',
      marginTop: 6,
      letterSpacing: 0.5,
    },
    emiAmount: {
      fontSize: 30,
      fontWeight: '900',
      color: '#FFFFFF',
      marginTop: 2,
    },
    heroSub: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 8,
    },
    heroSubText: {
      fontSize: 11,
      fontWeight: '500',
      color: '#E0E7FF',
    },
    heroDivider: {
      width: 3,
      height: 3,
      borderRadius: 1.5,
      backgroundColor: '#E0E7FF',
      opacity: 0.7,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 12,
      paddingHorizontal: 16,
      marginTop: -16,
      marginBottom: 12,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.surfaceElevated,
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: 'center',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOpacity: 0.04,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
    },
    statLabel: {
      fontSize: 9,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
      color: colors.textSecondary,
    },
    statValue: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.text,
      marginTop: 4,
    },
    statValueGood: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.success,
      marginTop: 4,
    },
    section: {
      paddingHorizontal: 16,
      marginTop: 18,
    },
    scheduleList: {
      gap: 12,
    },
    downloadWrap: {
      paddingHorizontal: 16,
      marginTop: 20,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.text,
    },
    sectionSub: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 2,
    },
    borrowingCard: {
      backgroundColor: colors.surfaceElevated,
      borderRadius: 16,
      padding: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    borrowingRow: {
      flexDirection: 'row',
      marginVertical: 8,
    },
    legendBlock: {
      flex: 1,
    },
    legendDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginBottom: 6,
    },
    legendLabel: {
      fontSize: 10,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    legendValue: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.text,
      marginTop: 2,
    },
    dividerVertical: {
      width: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
      marginHorizontal: 16,
    },
    detailCard: {
      backgroundColor: colors.surfaceElevated,
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      overflow: 'hidden',
      marginHorizontal: 16,
      marginBottom: 16,
    },
    detailRow: {
      flexDirection: 'row',
      width: '100%',
    },
    detailCell: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 12,
    },
    detailCellPadded: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 12,
      paddingLeft: 20,
    },
    dividerRowBorder: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    detailLabel: {
      fontSize: 9,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
      color: colors.textSecondary,
    },
    detailValue: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.text,
      marginTop: 4,
    },
    footer: {
      paddingTop: 8,
      paddingBottom: 30,
    },
  });

export type AmortizationStyles = ReturnType<typeof createStyles>;