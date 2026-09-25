import type { LucideIcon } from 'lucide-react-native';
import {
  Bike,
  Briefcase,
  CarFront,
  Coins,
  Gem,
  Home,
  Smartphone,
  User,
} from 'lucide-react-native';
import type { ProductMaster } from '../../api/masters';

export type LoanType = {
  id: string;
  label: string;
  icon: LucideIcon;
  range: string;
  category: string;
  productId: number;
};

const RANGE_BY_CATEGORY: Record<string, string> = {
  'Property Loan': '₹10L - ₹1Cr',
  'Vehicle Loan': '₹2L - ₹15L',
  'Gold Loan': '₹50K - ₹10L',
  'Un-Secured Loan': '₹50K - ₹25L',
  'Consumer Durable Loan': '₹10K - ₹5L',
  'Single Installment': '₹1K - ₹1L',
};

const RANGE_FALLBACK = '₹10K - ₹25L';

function pickRange(category: string): string {
  return RANGE_BY_CATEGORY[category] ?? RANGE_FALLBACK;
}

function pickIcon(label: string): LucideIcon {
  const t = label.trim().toLowerCase();
  if (/msme|business/.test(t)) return Briefcase;
  if (/bike/.test(t)) return Bike;
  if (/car|vehicle/.test(t)) return CarFront;
  if (/home|property/.test(t)) return Home;
  if (/gold/.test(t)) return Gem;
  if (/mobile|phone|tv|battery|laptop/.test(t)) return Smartphone;
  if (/single\s*emi|installment/.test(t)) return Coins;
  return User;
}

export function mapProductsToLoanTypes(products: ProductMaster[]): LoanType[] {
  return products
    .filter(product => product.Product_IsActive)
    .map(product => ({
      id: String(product.ProductId),
      label: product.Product.trim(),
      icon: pickIcon(product.Product),
      range: pickRange(product.Category),
      category: product.Category,
      productId: product.ProductId,
    }));
}
