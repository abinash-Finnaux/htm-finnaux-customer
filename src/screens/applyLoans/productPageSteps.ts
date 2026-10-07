import type { LucideIcon } from 'lucide-react-native';
import {
  CircleUser,
  FileCheck2,
  FileText,
  HeartHandshake,
  IndianRupee,
  Landmark,
  PiggyBank,
  Wallet,
} from 'lucide-react-native';
import type { ProductPageInfo } from '../../api/masters';

export type ProductPageStepMeta = {
  key: string;
  icon: LucideIcon;
};

export const PRODUCT_PAGE_STEP_META: Record<number, ProductPageStepMeta> = {
  1: { key: 'loanInfo', icon: IndianRupee },
  2: { key: 'customerInfo', icon: CircleUser },
  5: { key: 'accountInfo', icon: Landmark },
  9: { key: 'assets', icon: PiggyBank },
  4: { key: 'incomeExpense', icon: Wallet },
  3: { key: 'reference', icon: HeartHandshake },
  8: { key: 'documents', icon: FileCheck2 },
};

export function isVehicleCategory(category: string): boolean {
  return category.trim().toLowerCase().includes('vehicle');
}

export const FALLBACK_PRODUCT_PAGES: ProductPageInfo[] = [
  {
    MM_Id: 1,
    MM_Name: 'Loan Info',
    MM_Short_Name: 'Basic',
    PageOrder: 1,
    ProductCategory: 3,
    ProductCategoryName: 'Property Loan',
  },
  {
    MM_Id: 2,
    MM_Name: 'Customer Info',
    MM_Short_Name: 'Customer',
    PageOrder: 2,
    ProductCategory: 3,
    ProductCategoryName: 'Property Loan',
  },
  {
    MM_Id: 5,
    MM_Name: 'Account Info',
    MM_Short_Name: 'Loan Financials',
    PageOrder: 3,
    ProductCategory: 3,
    ProductCategoryName: 'Property Loan',
  },
  {
    MM_Id: 9,
    MM_Name: 'Assets Detail',
    MM_Short_Name: 'Assets',
    PageOrder: 5,
    ProductCategory: 3,
    ProductCategoryName: 'Property Loan',
  },
  {
    MM_Id: 4,
    MM_Name: 'Customer Income and expenditure',
    MM_Short_Name: 'Income & Exp.',
    PageOrder: 6,
    ProductCategory: 3,
    ProductCategoryName: 'Property Loan',
  },
  {
    MM_Id: 3,
    MM_Name: 'Customer Reference',
    MM_Short_Name: 'References',
    PageOrder: 9,
    ProductCategory: 3,
    ProductCategoryName: 'Property Loan',
  },
  {
    MM_Id: 8,
    MM_Name: 'Pending Document',
    MM_Short_Name: 'Documents',
    PageOrder: 12,
    ProductCategory: 3,
    ProductCategoryName: 'Property Loan',
  },
];

export function getProductPageMeta(mmId: number): ProductPageStepMeta {
  return PRODUCT_PAGE_STEP_META[mmId] ?? { key: `page_${mmId}`, icon: FileText };
}
