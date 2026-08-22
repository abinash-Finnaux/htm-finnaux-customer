import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';

export type MyLoan = {
  id: string;
  type: string;
  amount: string;
  outstanding: string;
  emi: string;
  tenure: string;
  status: string;
  statusColor: string;
};

type Props = {
  loan: MyLoan;
  onSchedulePress: () => void;
};

export default function MyLoanCard({ loan, onSchedulePress }: Props) {
  const { theme } = useTheme();
  const themed = createStyles(theme);

  return (
    <View style={themed.card}>
      <View style={themed.header}>
        <View>
          <Text style={themed.type}>{loan.type}</Text>
          <Text style={themed.id}>{loan.id}</Text>
        </View>
        <View
          style={[
            themed.statusBadge,
            { backgroundColor: loan.statusColor + '18' },
          ]}
        >
          <Text style={[themed.statusText, { color: loan.statusColor }]}>
            {loan.status}
          </Text>
        </View>
      </View>

      <View style={themed.divider} />

      <View style={themed.grid}>
        <View style={themed.field}>
          <Text style={themed.fieldLabel}>Loan Amount</Text>
          <Text style={themed.fieldValue}>{loan.amount}</Text>
        </View>
        <View style={themed.field}>
          <Text style={themed.fieldLabel}>Outstanding</Text>
          <Text style={themed.fieldValue}>{loan.outstanding}</Text>
        </View>
        <View style={themed.field}>
          <Text style={themed.fieldLabel}>Monthly EMI</Text>
          <Text style={[themed.fieldValue, themed.valuePrimary]}>
            {loan.emi}
          </Text>
        </View>
        <View style={themed.field}>
          <Text style={themed.fieldLabel}>Tenure</Text>
          <Text style={themed.fieldValue}>{loan.tenure}</Text>
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [
          themed.scheduleBtn,
          { opacity: pressed ? 0.7 : 1 },
        ]}
        onPress={onSchedulePress}
      >
        <Text style={themed.scheduleBtnText}>View Schedule →</Text>
      </Pressable>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  const { colors, spacing, radius } = theme;

  return StyleSheet.create({
    card: {
      borderWidth: 1,
      marginBottom: 14,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
      backgroundColor: colors.surfaceElevated,
      borderColor: colors.border,
      borderRadius: radius.lg,
      padding: spacing.lg,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    type: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
    },
    id: {
      fontSize: 12,
      marginTop: 2,
      color: colors.textSecondary,
    },
    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
    },
    statusText: {
      fontSize: 11,
      fontWeight: '700',
    },
    divider: {
      height: 1,
      marginVertical: 14,
      backgroundColor: colors.border,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    field: {
      width: '46%',
    },
    fieldLabel: {
      fontSize: 11,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    fieldValue: {
      fontSize: 14,
      fontWeight: '700',
      marginTop: 3,
      color: colors.text,
    },
    valuePrimary: {
      color: colors.primary,
    },
    scheduleBtn: {
      marginTop: 12,
      alignSelf: 'flex-end',
    },
    scheduleBtnText: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.primary,
    },
  });
}
