import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import ProgressCard from '../../../components/cards/ProgressCard';
import SummaryCard from '../../../components/cards/SummaryCard';

type Props = {
  paidCount: number;
  totalCount: number;
  totalPaid: number;
  totalLoanAmount: number;
};

export default function SummaryCards({
  paidCount,
  totalCount,
  totalPaid,
  totalLoanAmount,
}: Props) {
  const styles = useMemo(() => createStyles(), []);

  const summaryItems = useMemo(
    () => [
      { value: `${paidCount}/${totalCount}`, label: 'EMIs Paid' },
      {
        value: `₹${totalPaid.toLocaleString('en-IN')}`,
        label: 'Total Paid',
        color: '#22C55E',
      },
    ],
    [paidCount, totalCount, totalPaid],
  );

  const percent = useMemo(
    () => Math.round((paidCount / totalCount) * 100),
    [paidCount, totalCount],
  );

  const paidLabel = useMemo(
    () => `₹${totalPaid.toLocaleString('en-IN')} paid`,
    [totalPaid],
  );

  const remainingLabel = useMemo(
    () => `₹${(totalLoanAmount - totalPaid).toLocaleString('en-IN')} remaining`,
    [totalLoanAmount, totalPaid],
  );

  return (
    <>
      <SummaryCard items={summaryItems} />
      <View style={styles.progressWrap}>
        <ProgressCard
          title="Repayment Progress"
          percent={percent}
          paidLabel={paidLabel}
          remainingLabel={remainingLabel}
        />
      </View>
    </>
  );
}

function createStyles() {
  return StyleSheet.create({
    progressWrap: {
      marginTop: 12,
    },
  });
}
