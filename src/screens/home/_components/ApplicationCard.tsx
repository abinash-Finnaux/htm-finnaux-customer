import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import type { CustomerApplication } from '../../../context/UserContext';

type Props = {
  application: CustomerApplication;
  onPress?: () => void;
};

const STATUS_COLORS: Record<string, string> = {
  Completed: '#22C55E',
  InProgress: '#F59E0B',
  Created: '#3B82F6',
  Approved: '#22C55E',
  Rejected: '#EF4444',
  Applied: '#3B82F6',
  Closed: '#6B7280',
};

function formatAmount(value?: string): string {
  const amount = Number(value);
  if (!value || Number.isNaN(amount)) {
    return '—';
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export default function ApplicationCard({ application, onPress }: Props) {
  console.log('applicationLog', application);
  const { theme } = useTheme();
  const themed = createStyles(theme);

  const status = application.Status || 'Created';
  const statusColor = STATUS_COLORS[status] || '#6B7280';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [themed.card, pressed && themed.pressed]}
    >
      <View style={themed.header}>
        <View style={themed.headerLeft}>
          <Text style={themed.product}>{application.Product || 'Loan'}</Text>
          <Text style={themed.applicationNo}>
            {application.ApplicationNo || '—'}
          </Text>
          {!!application.Branch && (
            <Text style={themed.branch}>{application.Branch}</Text>
          )}
        </View>
        <View
          style={[themed.statusBadge, { backgroundColor: statusColor + '18' }]}
        >
          <Text style={[themed.statusText, { color: statusColor }]}>
            {status}
          </Text>
        </View>
      </View>

      <View style={themed.divider} />

      <View style={themed.grid}>
        <View style={themed.field}>
          <Text style={themed.fieldLabel}>Loan Amount</Text>
          <Text style={[themed.fieldValue, themed.valuePrimary]}>
            {formatAmount(application.LoanAmount)}
          </Text>
        </View>
        <View style={themed.field}>
          <Text style={themed.fieldLabel}>Balance Principal</Text>
          <Text style={themed.fieldValue}>
            {formatAmount(application.Balance_Principle)}
          </Text>
        </View>
        <View style={themed.field}>
          <Text style={themed.fieldLabel}>Customer Type</Text>
          <Text style={themed.fieldValue}>
            {application.CustomerType || '—'}
          </Text>
        </View>
        <View style={themed.field}>
          <Text style={themed.fieldLabel}>Application Type</Text>
          <Text style={themed.fieldValue}>
            {application.Application_Type || '—'}
          </Text>
        </View>
        {!!application.LoanAcNo && (
          <View style={themed.field}>
            <Text style={themed.fieldLabel}>Loan Account No</Text>
            <Text style={themed.fieldValue}>{application.LoanAcNo}</Text>
          </View>
        )}
        {!!application.CreateOn && (
          <View style={themed.field}>
            <Text style={themed.fieldLabel}>Created On</Text>
            <Text style={themed.fieldValue}>{application.CreateOn}</Text>
          </View>
        )}
      </View>
    </Pressable>
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
    pressed: {
      opacity: 0.85,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    headerLeft: {
      flex: 1,
      paddingRight: 10,
    },
    product: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
    },
    applicationNo: {
      fontSize: 12,
      marginTop: 2,
      color: colors.textSecondary,
    },
    branch: {
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
  });
}
