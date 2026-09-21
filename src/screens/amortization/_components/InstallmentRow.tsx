import React, { useMemo } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import type { Installment } from '../data';

type Props = {
  item: Installment;
  isLast: boolean;
};

function InstallmentRow({ item, isLast }: Props) {
  const { theme } = useTheme();
  const { colors } = theme;

  const themed = useMemo(() => createStyles(colors), [colors]);

  const accent = item.status === 'Paid' ? colors.success : colors.warning;
  const shortDate = item.date
    .split(' ')
    .map((part, index) => (index === 2 ? part.slice(2) : part))
    .join(' ');

  return (
    <View style={[themed.row, !isLast && themed.divider]}>
      <View style={themed.monthCell}>
        <View style={[themed.badge, { backgroundColor: accent + '18' }]}>
          <Text style={[themed.badgeText, { color: accent }]}>
            {String(item.no).padStart(2, '0')}
          </Text>
        </View>
        <View style={themed.dateWrap}>
          <Text style={themed.date}>{shortDate}</Text>
          <Text style={[themed.status, { color: accent }]}>{item.status}</Text>
        </View>
      </View>

      <View style={themed.amountCol}>
        <Text style={themed.amountLabel}>EMI</Text>
        <Text style={themed.amountValue}>
          {item.emi.toLocaleString('en-IN')}
        </Text>
      </View>
      <View style={themed.amountCol}>
        <Text style={themed.amountLabel}>Principal</Text>
        <Text style={themed.amountValue}>
          {item.principal.toLocaleString('en-IN')}
        </Text>
      </View>
      <View style={themed.amountCol}>
        <Text style={themed.amountLabel}>Interest</Text>
        <Text style={themed.amountValue}>
          {item.interest.toLocaleString('en-IN')}
        </Text>
      </View>
      <View style={themed.amountCol}>
        <Text style={themed.amountLabel}>Balance</Text>
        <Text style={themed.amountValue}>
          {item.balance.toLocaleString('en-IN')}
        </Text>
      </View>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>['theme']['colors']) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 12,
    },
    divider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    monthCell: {
      width: 78,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    badge: {
      width: 30,
      height: 30,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    badgeText: {
      fontSize: 11,
      fontWeight: '800',
    },
    dateWrap: {
      flex: 1,
    },
    date: {
      fontSize: 10,
      fontWeight: '700',
      color: colors.text,
    },
    status: {
      fontSize: 8,
      fontWeight: '700',
      textTransform: 'uppercase',
      marginTop: 1,
      letterSpacing: 0.3,
    },
    amountCol: {
      flex: 1,
      alignItems: 'flex-end',
      marginLeft: 6,
    },
    amountLabel: {
      fontSize: 8,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.3,
      color: colors.textSecondary,
    },
    amountValue: {
      fontSize: 10,
      fontWeight: '700',
      marginTop: 2,
      color: colors.text,
    },
  });
}

export default React.memo(InstallmentRow);