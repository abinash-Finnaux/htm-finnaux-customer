import React from 'react';
import { View } from 'react-native';
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
  const percent = Math.round((paidCount / totalCount) * 100);

  return (
    <>
      <SummaryCard
        items={[
          { value: `${paidCount}/${totalCount}`, label: 'EMIs Paid' },
          {
            value: `₹${totalPaid.toLocaleString('en-IN')}`,
            label: 'Total Paid',
            color: '#22C55E',
          },
        ]}
      />

      <View style={{ marginTop: 12 }}>
        <ProgressCard
          title="Repayment Progress"
          percent={percent}
          paidLabel={`₹${totalPaid.toLocaleString('en-IN')} paid`}
          remainingLabel={`₹${(totalLoanAmount - totalPaid).toLocaleString(
            'en-IN',
          )} remaining`}
        />
      </View>
    </>
  );
}
