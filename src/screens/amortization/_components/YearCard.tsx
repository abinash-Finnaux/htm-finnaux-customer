import React, { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import type { AmortizationYear, Installment } from '../data';
import InstallmentRow from './InstallmentRow';

type Props = {
  year: AmortizationYear;
  schedule: Installment[];
  initialExpanded?: boolean;
};

function YearCard({ year, schedule, initialExpanded = false }: Props) {
  const { theme } = useTheme();
  const { colors } = theme;
  const [expanded, setExpanded] = useState(initialExpanded);

  const themed = useMemo(() => createStyles(colors), [colors]);

  const rows = schedule.slice(year.months[0] - 1, year.months[1]);
  const chevron = expanded ? '−' : '+';

  return (
    <View style={[themed.card, { borderColor: colors.border }]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setExpanded((p) => !p)}
        style={themed.header}
      >
        <View>
          <Text style={themed.yearLabel}>{year.label}</Text>
          <Text style={themed.range}>{year.range}</Text>
        </View>
        <View style={themed.right}>
          <View style={themed.balanceWrap}>
            <Text style={themed.balanceLabel}>Balance</Text>
            <Text style={themed.balanceValue}>
              ₹{year.balance.toLocaleString('en-IN')}
            </Text>
          </View>
          <View style={[themed.chevron, { borderColor: colors.border }]}>
            <Text style={themed.chevronText}>{chevron}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={themed.summaryRow}>
        <View style={themed.summaryCell}>
          <Text style={themed.summaryValue}>
            ₹{year.principal.toLocaleString('en-IN')}
          </Text>
          <Text style={themed.summaryLabel}>Principal Paid</Text>
        </View>
        <View style={[themed.summaryCell, { borderColor: colors.border }]}>
          <Text style={themed.summaryValue}>
            ₹{year.interest.toLocaleString('en-IN')}
          </Text>
          <Text style={themed.summaryLabel}>Interest Paid</Text>
        </View>
        <View style={themed.summaryCell}>
          <Text style={themed.summaryValue}>
            ₹{year.emiTotal.toLocaleString('en-IN')}
          </Text>
          <Text style={themed.summaryLabel}>Total EMIs</Text>
        </View>
      </View>

      {expanded && (
        <View style={themed.rows}>
          {rows.map((row, index) => (
            <InstallmentRow
              key={row.no}
              item={row}
              isLast={index === rows.length - 1}
            />
          ))}
        </View>
      )}
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>['theme']['colors']) {
  return StyleSheet.create({
    card: {
      borderRadius: 14,
      borderWidth: 1,
      backgroundColor: colors.surfaceElevated,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    yearLabel: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.text,
    },
    range: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 2,
      fontWeight: '500',
    },
    right: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    balanceWrap: {
      alignItems: 'flex-end',
    },
    balanceLabel: {
      fontSize: 9,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.3,
      color: colors.textSecondary,
    },
    balanceValue: {
      fontSize: 13,
      fontWeight: '800',
      color: colors.text,
      marginTop: 2,
    },
    chevron: {
      width: 26,
      height: 26,
      borderRadius: 13,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    chevronText: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      lineHeight: 18,
    },
    summaryRow: {
      flexDirection: 'row',
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    summaryCell: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 4,
    },
    summaryValue: {
      fontSize: 12,
      fontWeight: '800',
      color: colors.text,
    },
    summaryLabel: {
      fontSize: 9,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.3,
      color: colors.textSecondary,
      marginTop: 3,
      textAlign: 'center',
    },
    rows: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
  });
}

export default React.memo(YearCard);