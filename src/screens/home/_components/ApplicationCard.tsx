import React, { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import type { CustomerApplication } from '../../../context/UserContext';

type Props = {
  application: CustomerApplication;
  onPress?: (application: CustomerApplication) => void;
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

function ApplicationCard({ application, onPress }: Props) {
  const { theme } = useTheme();
  const themed = useMemo(() => createStyles(theme), [theme]);
  const handlePress = useCallback(
    () => onPress?.(application),
    [onPress, application],
  );
  const status = application.Status || '';
  const statusColor = STATUS_COLORS[status] || '#6B7280';

  return (
    <Pressable
      onPress={handlePress}
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

      <View style={themed.divider} />
      <View style={themed.dueHeader}>
        <Text style={themed.dueTitle}>Due Details</Text>
      </View>
      <View style={themed.grid}>
        <View style={themed.field}>
          <Text style={themed.fieldLabel}>Next Due Date</Text>
          <Text style={themed.fieldValue}>
            {application.Next_Due_Date || '—'}
          </Text>
        </View>
        <View style={themed.field}>
          <Text style={[themed.fieldLabel, themed.dueLabel]}>
            Next Due Amount
          </Text>
          <Text style={[themed.fieldValue, themed.valuePrimary]}>
            {formatAmount(application.Next_Due_Amount)}
          </Text>
        </View>
        <View style={themed.field}>
          <Text style={themed.fieldLabel}>Last Due Date</Text>
          <Text style={themed.fieldValue}>
            {application.Last_Due_Date || '—'}
          </Text>
        </View>
        <View style={themed.field}>
          <Text style={themed.fieldLabel}>Last Due Amount</Text>
          <Text style={themed.fieldValue}>
            {formatAmount(application.Last_Due_Amount)}
          </Text>
        </View>
        <View style={themed.field}>
          <Text style={themed.fieldLabel}>Last Received</Text>
          <Text style={themed.fieldValue}>
            {formatAmount(application.Last_Recv_Amount)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default React.memo(ApplicationCard);

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
    dueHeader: {
      marginBottom: 12,
    },
    dueTitle: {
      fontSize: 13,
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: colors.text,
    },
    dueLabel: {
      color: colors.warning,
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
