import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export type ScheduleItem = {
  month: number;
  date: string;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
  status: 'Paid' | 'Upcoming' | 'Overdue';
};

type Props = {
  item: ScheduleItem;
  isLast: boolean;
  accentColor: string;
};

export default function ScheduleCard({ item, isLast, accentColor }: Props) {
  const { theme } = useTheme();
  const { colors, radius } = theme;

  const themed = createStyles(colors, radius);

  return (
    <View
      style={[
        themed.outer,
        {
          borderLeftColor: accentColor,
          shadowColor: accentColor,
          marginBottom: isLast ? 0 : 10,
          borderRadius: radius.lg,
        },
      ]}
    >
      <View style={[themed.card, { borderColor: accentColor + '15' }]}>
        <View style={themed.topRow}>
          <View style={themed.monthBlock}>
            <View
              style={[
                themed.monthBadge,
                { backgroundColor: accentColor + '18' },
              ]}
            >
              <Text style={[themed.monthNum, { color: accentColor }]}>
                {String(item.month).padStart(2, '0')}
              </Text>
            </View>
            <View>
              <Text style={themed.date}>{item.date}</Text>
              <Text style={themed.emiLabel}>EMI #{item.month}</Text>
            </View>
          </View>
          <View
            style={[
              themed.statusBadge,
              { backgroundColor: accentColor + '18' },
            ]}
          >
            <View
              style={[themed.statusDot, { backgroundColor: accentColor }]}
            />
            <Text style={[themed.statusText, { color: accentColor }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <View style={themed.divider} />

        <View style={themed.bottomRow}>
          <View style={themed.amountBlock}>
            <Text style={themed.amountLabel}>Principal</Text>
            <Text style={themed.amountValue}>
              ₹{item.principal.toLocaleString('en-IN')}
            </Text>
          </View>
          <View style={themed.amountDivider} />
          <View style={themed.amountBlock}>
            <Text style={themed.amountLabel}>Interest</Text>
            <Text style={themed.amountValue}>
              ₹{item.interest.toLocaleString('en-IN')}
            </Text>
          </View>
          <View style={themed.amountDivider} />
          <View style={themed.amountBlock}>
            <Text style={themed.amountLabel}>EMI</Text>
            <Text style={[themed.amountValueBold, { color: accentColor }]}>
              ₹{item.emi.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>

        <View style={themed.balanceRow}>
          <Text style={themed.balanceLabel}>Outstanding Balance</Text>
          <Text style={themed.balanceValue}>
            ₹{item.balance.toLocaleString('en-IN')}
          </Text>
        </View>
      </View>
    </View>
  );
}

function createStyles(
  colors: ReturnType<typeof useTheme>['theme']['colors'],
  radius: ReturnType<typeof useTheme>['theme']['radius'],
) {
  return StyleSheet.create({
    outer: {
      borderLeftWidth: 4,
    },
    card: {
      borderWidth: 1,
      backgroundColor: colors.surfaceElevated,
      borderRadius: radius.lg,
    },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 14,
    },
    monthBlock: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    monthBadge: {
      width: 40,
      height: 40,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    monthNum: {
      fontSize: 14,
      fontWeight: '800',
    },
    date: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
    },
    emiLabel: {
      fontSize: 11,
      fontWeight: '500',
      marginTop: 2,
      color: colors.textSecondary,
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
      gap: 5,
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    statusText: {
      fontSize: 11,
      fontWeight: '700',
    },
    divider: {
      height: 1,
      marginHorizontal: 14,
      backgroundColor: colors.border,
    },
    bottomRow: {
      flexDirection: 'row',
      paddingVertical: 12,
      paddingHorizontal: 14,
    },
    amountBlock: {
      flex: 1,
      alignItems: 'center',
    },
    amountDivider: {
      width: 1,
      marginVertical: 2,
      backgroundColor: colors.border,
    },
    amountLabel: {
      fontSize: 10,
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: 0.3,
      color: colors.textSecondary,
    },
    amountValue: {
      fontSize: 13,
      fontWeight: '700',
      marginTop: 3,
      color: colors.text,
    },
    amountValueBold: {
      fontSize: 14,
      fontWeight: '800',
      marginTop: 3,
    },
    balanceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
      backgroundColor: colors.surface,
    },
    balanceLabel: {
      fontSize: 11,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    balanceValue: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.text,
    },
  });
}
