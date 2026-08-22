import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

export type SoaEntry = {
  date: string;
  particulars: string;
  type: 'debit' | 'credit';
  amount: number;
  balance: number;
};

type Props = {
  entry: SoaEntry;
  isLast: boolean;
};

export default function TransactionRow({ entry, isLast }: Props) {
  const { theme } = useTheme();
  const themed = createStyles(theme);

  const isCredit = entry.type === 'credit';

  return (
    <View style={[themed.row, !isLast && themed.divider]}>
      <View style={themed.markerWrap}>
        <View
          style={[
            themed.marker,
            { backgroundColor: isCredit ? themed.creditColor.color : themed.debitColor.color },
          ]}
        />
        {isLast ? null : <View style={themed.markerLine} />}
      </View>

      <View style={themed.middle}>
        <Text style={themed.particulars}>{entry.particulars}</Text>
        <Text style={themed.date}>{entry.date}</Text>
      </View>

      <View style={themed.right}>
        <Text
          style={[
            themed.amount,
            isCredit ? themed.creditColor : themed.debitColor,
          ]}
        >
          {isCredit ? '+' : '-'} ₹{entry.amount.toLocaleString('en-IN')}
        </Text>
        <Text style={themed.balance}>
          Bal ₹{entry.balance.toLocaleString('en-IN')}
        </Text>
      </View>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  const { colors } = theme;

  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      paddingHorizontal: 14,
    },
    divider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    markerWrap: {
      width: 16,
      alignItems: 'center',
      alignSelf: 'stretch',
    },
    marker: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginTop: 18,
    },
    markerLine: {
      flex: 1,
      width: 1,
      backgroundColor: colors.border,
      marginVertical: 2,
    },
    middle: {
      flex: 1,
      paddingVertical: 14,
      paddingLeft: 10,
    },
    particulars: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.text,
    },
    date: {
      fontSize: 11,
      fontWeight: '500',
      marginTop: 2,
      color: colors.textSecondary,
    },
    right: {
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingLeft: 8,
    },
    amount: {
      fontSize: 13,
      fontWeight: '800',
    },
    creditColor: {
      color: colors.success,
    },
    debitColor: {
      color: colors.text,
    },
    balance: {
      fontSize: 11,
      fontWeight: '500',
      marginTop: 2,
      color: colors.textSecondary,
    },
  });
}
