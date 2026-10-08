import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ApplyLoanForm, CustomerInfo, VehicleInfo } from '../types';

const LOAN_DRAFT_STORAGE_KEY = '@finnaux_loan_draft';
const DRAFT_VERSION = 1;

export type LoanDraft = {
  version: number;
  savedAt: string;
  step: number;
  totalSteps: number;
  productId: number | null;
  form: ApplyLoanForm;
};

const toDate = (value: unknown): Date | null => {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (
    typeof value === 'string' &&
    value !== '' &&
    !Number.isNaN(Date.parse(value))
  ) {
    return new Date(value);
  }
  return null;
};

export function reviveLoanDraftForm(raw: ApplyLoanForm): ApplyLoanForm {
  const customerInfo: CustomerInfo = {
    ...raw.customerInfo,
    dob: toDate(raw.customerInfo?.dob),
  };

  const vehicle: VehicleInfo = {
    ...raw.vehicle,
    manufactureDate: toDate(raw.vehicle?.manufactureDate),
    registrationDate: toDate(raw.vehicle?.registrationDate),
    registrationExpiryDate: toDate(raw.vehicle?.registrationExpiryDate),
    roadTaxUpto: toDate(raw.vehicle?.roadTaxUpto),
    fitnessUpto: toDate(raw.vehicle?.fitnessUpto),
    permitUpto: toDate(raw.vehicle?.permitUpto),
    quotationDate: toDate(raw.vehicle?.quotationDate),
    invoiceDate: toDate(raw.vehicle?.invoiceDate),
  };

  return {
    ...raw,
    customerInfo,
    vehicle,
  };
}

export async function saveLoanDraft(draft: LoanDraft): Promise<void> {
  try {
    await AsyncStorage.setItem(LOAN_DRAFT_STORAGE_KEY, JSON.stringify(draft));
  } catch (error) {
    console.warn('[LoanDraft] unable to save draft', error);
  }
}

export async function loadLoanDraft(): Promise<LoanDraft | null> {
  try {
    const raw = await AsyncStorage.getItem(LOAN_DRAFT_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as LoanDraft | null;
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      parsed.version !== DRAFT_VERSION ||
      !parsed.form ||
      typeof parsed.step !== 'number'
    ) {
      return null;
    }
    return parsed;
  } catch (error) {
    console.warn('[LoanDraft] unable to load draft', error);
    return null;
  }
}

export async function clearLoanDraft(): Promise<void> {
  try {
    await AsyncStorage.removeItem(LOAN_DRAFT_STORAGE_KEY);
  } catch (error) {
    console.warn('[LoanDraft] unable to clear draft', error);
  }
}

export { LOAN_DRAFT_STORAGE_KEY, DRAFT_VERSION };
