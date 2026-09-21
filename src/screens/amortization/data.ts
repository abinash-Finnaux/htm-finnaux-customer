export type Installment = {
  no: number;
  date: string;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
  status: 'Paid' | 'Upcoming';
};

export type AmortizationYear = {
  label: string;
  range: string;
  months: [number, number];
  principal: number;
  interest: number;
  emiTotal: number;
  balance: number;
};

export type AmortizationData = {
  loan: {
    accountNo: string;
    type: string;
    principal: number;
    interestRate: number;
    tenureMonths: number;
    startDate: string;
    frequency: string;
    disbursementDate: string;
  };
  emi: number;
  totalInterest: number;
  totalPayable: number;
  paidCount: number;
  schedule: Installment[];
  years: AmortizationYear[];
};

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function formatMonthDate(year: number, monthIndex: number, day: number) {
  return `${String(day).padStart(2, '0')} ${MONTH_NAMES[monthIndex]} ${year}`;
}

export function buildAmortizationData(): AmortizationData {
  const principal = 500000;
  const annualRate = 9.0;
  const months = 48;
  const paidCount = 6;
  const monthlyRate = annualRate / 12 / 100;

  const pow = Math.pow(1 + monthlyRate, months);
  const emi = Math.round((principal * monthlyRate * pow) / (pow - 1));

  const schedule: Installment[] = [];
  let balance = principal;

  for (let i = 0; i < months; i++) {
    const isLast = i === months - 1;
    const year = 2026 + Math.floor((8 + i) / 12);
    const monthIndex = (8 + i) % 12;
    const interest = Math.round(balance * monthlyRate);
    const principalPart = isLast ? balance : Math.round(emi - interest);
    balance -= principalPart;

    schedule.push({
      no: i + 1,
      date: formatMonthDate(year, monthIndex, 15),
      emi: isLast ? principalPart + interest : emi,
      principal: principalPart,
      interest,
      balance,
      status: i < paidCount ? 'Paid' : 'Upcoming',
    });
  }

  const years: AmortizationYear[] = [];
  for (let y = 0; y < months; y += 12) {
    const group = schedule.slice(y, y + 12);
    const first = group[0];
    const lastInYear = group[group.length - 1];
    years.push({
      label: `Year ${years.length + 1}`,
      range: `${first.date.split(' ')[2]} - ${lastInYear.date.split(' ')[2]}`,
      months: [first.no, lastInYear.no],
      principal: group.reduce((sum, i) => sum + i.principal, 0),
      interest: group.reduce((sum, i) => sum + i.interest, 0),
      emiTotal: group.reduce((sum, i) => sum + i.emi, 0),
      balance: lastInYear.balance,
    });
  }

  const totalInterest = schedule.reduce((sum, i) => sum + i.interest, 0);
  const totalPayable = principal + totalInterest;

  return {
    loan: {
      accountNo: 'LA-2024-88321',
      type: 'Personal Loan',
      principal,
      interestRate: annualRate,
      tenureMonths: months,
      startDate: '15 Sep 2026',
      frequency: 'Monthly',
      disbursementDate: '15 Sep 2026',
    },
    emi,
    totalInterest,
    totalPayable,
    paidCount,
    schedule,
    years,
  };
}