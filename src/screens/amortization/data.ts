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

export type AmortizationOptions = {
  principal?: number;
  interestRate?: number;
  tenureMonths?: number;
  paidCount?: number;
  emi?: number;
  accountNo?: string;
  loanType?: string;
  startDate?: string;
  disbursementDate?: string;
};

export type AmortizationChartEntry = {
  Period?: number | string;
  EMI_Amount?: number | string;
  Outstanding_Principle?: number | string;
  Interest?: number | string;
  Principle?: number | string;
  DueDate?: string;
  [key: string]: unknown;
};

const toNumber = (value: unknown): number => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

export function normalizeChartDate(value?: string): string {
  if (!value) {
    return '';
  }
  const first = value.trim().split(/\s+/)[0];
  const match = first.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (match) {
    const monthIndex = Number(match[2]) - 1;
    if (monthIndex >= 0 && monthIndex <= 11) {
      return formatMonthDate(Number(match[3]), monthIndex, Number(match[1]));
    }
  }
  return first;
}

function buildYears(schedule: Installment[]): AmortizationYear[] {
  const years: AmortizationYear[] = [];
  for (let y = 0; y < schedule.length; y += 12) {
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
  return years;
}

function parseStartDate(value?: string): {
  year: number;
  monthIndex: number;
  day: number;
} | null {
  if (!value) {
    return null;
  }
  let match = value.match(/^(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})$/);
  if (match) {
    const monthIndex = MONTH_NAMES.findIndex(
      name => name.toLowerCase() === match![2].toLowerCase(),
    );
    if (monthIndex < 0) {
      return null;
    }
    return { year: Number(match[3]), monthIndex, day: Number(match[1]) };
  }
  match = value.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (match) {
    return {
      year: Number(match[3]),
      monthIndex: Number(match[2]) - 1,
      day: Number(match[1]),
    };
  }
  return null;
}

function startOffsetOf(options: AmortizationOptions): {
  year: number;
  monthIndex: number;
  day: number;
} {
  const parsed = parseStartDate(options.startDate);
  return {
    year: parsed?.year ?? 2026,
    monthIndex: parsed?.monthIndex ?? 8,
    day: parsed?.day ?? 15,
  };
}

export function buildAmortizationDataFromChart(
  entries: AmortizationChartEntry[],
  options: AmortizationOptions = {},
): AmortizationData {
  const months = entries.length;
  const principal = entries.reduce(
    (sum, e) => sum + toNumber(e.Principle),
    0,
  );
  const emi = toNumber(entries[0]?.EMI_Amount);
  const start = startOffsetOf(options);

  const schedule: Installment[] = entries.map((e) => {
    const item: Installment = {
      no: toNumber(e.Period),
      date: normalizeChartDate(e.DueDate),
      emi: toNumber(e.EMI_Amount),
      principal: toNumber(e.Principle),
      interest: toNumber(e.Interest),
      balance: toNumber(e.Outstanding_Principle),
      status: 'Upcoming',
    };
    if (!item.date) {
      const totalMonths = start.year * 12 + start.monthIndex;
      const offset = (item.no || 1) - 1;
      const dateMonths = totalMonths + offset;
      item.date = formatMonthDate(
        Math.floor(dateMonths / 12),
        dateMonths % 12,
        start.day,
      );
    }
    return item;
  });

  const years = buildYears(schedule);
  const totalInterest = schedule.reduce((sum, i) => sum + i.interest, 0);
  const totalPayable = principal + totalInterest;
  const startDate = schedule[0]?.date || options.startDate || '';

  return {
    loan: {
      accountNo: options.accountNo || '—',
      type: options.loanType || 'Loan',
      principal,
      interestRate: options.interestRate ?? 9,
      tenureMonths: months,
      startDate,
      frequency: 'Monthly',
      disbursementDate: options.disbursementDate || startDate,
    },
    emi: emi || Math.round(principal / Math.max(months, 1)),
    totalInterest,
    totalPayable,
    paidCount: 0,
    schedule,
    years,
  };
}

export function buildAmortizationData(
  options: AmortizationOptions = {},
): AmortizationData {
  const principal = options.principal ?? 0;
  const annualRate = options.interestRate ?? 0;
  const months = options.tenureMonths ?? 0;
  const paidCount = options.paidCount ?? 0;
  const monthlyRate = annualRate / 12 / 100;

  const pow = Math.pow(1 + monthlyRate, months);
  const computedEmi = Math.round((principal * monthlyRate * pow) / (pow - 1));
  const emiRaw =
    options.emi && options.emi > 0 ? Math.round(options.emi) : computedEmi;
  const emi = Number.isFinite(emiRaw) && emiRaw > 0 ? emiRaw : 0;

  const parsed = startOffsetOf(options);
  const startYear = parsed.year;
  const startMonth = parsed.monthIndex;
  const startDay = parsed.day;
  const startTotalMonths = startYear * 12 + startMonth;

  const schedule: Installment[] = [];
  let balance = principal;

  for (let i = 0; i < months; i++) {
    const isLast = i === months - 1;
    const totalMonths = startTotalMonths + i;
    const year = Math.floor(totalMonths / 12);
    const monthIndex = totalMonths % 12;
    const interest = Math.round(balance * monthlyRate);
    const principalPart = isLast ? balance : Math.round(emi - interest);
    balance -= principalPart;

    schedule.push({
      no: i + 1,
      date: formatMonthDate(year, monthIndex, startDay),
      emi: isLast ? principalPart + interest : emi,
      principal: principalPart,
      interest,
      balance,
      status: i < paidCount ? 'Paid' : 'Upcoming',
    });
  }

  const years = buildYears(schedule);
  const totalInterest = schedule.reduce((sum, i) => sum + i.interest, 0);
  const totalPayable = principal + totalInterest;
  const startDate = options.startDate || '15 Sep 2026';

  return {
    loan: {
      accountNo: options.accountNo || 'LA-2024-88321',
      type: options.loanType || 'Personal Loan',
      principal,
      interestRate: annualRate,
      tenureMonths: months,
      startDate,
      frequency: 'Monthly',
      disbursementDate: options.disbursementDate || startDate,
    },
    emi,
    totalInterest,
    totalPayable,
    paidCount,
    schedule,
    years,
  };
}
