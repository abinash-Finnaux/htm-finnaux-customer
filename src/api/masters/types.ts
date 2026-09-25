export interface ProductMaster {
  Category: string;
  Product: string;
  ShortName: string;
  CRC: string | null;
  FI: string | null;
  TVR: string | null;
  PD: string | null;
  MultipleTranche: string;
  CustomerReference: string;
  NACHPDC: string;
  Insurance: string;
  ActiveStatus: string;
  Product_IsActive: boolean;
  CreateOn: string;
  ProductId: number;
  ProductCatId: number;
  Rescheduled_Allowed: boolean;
  Rescheduled_Min_EMI_Due: number;
  Cash: boolean;
  Bank: boolean;
  IsODDetail: boolean;
  IsEqualSplit: boolean;
  Generate_Amortization_AfterPayment: boolean;
  ROI_Input_mathod: string | null;
  IsWebsiteFrequencyOpen: boolean;
  Stop_receipt_in_repossess: boolean;
  Stop_receipt_in_Legal: boolean;
  ReLoanProductId: number;
  PaydayLoanProductId: number;
  IsEqualSplitPartner: boolean;
}

export interface BranchMaster {
  BranchId: number;
  Branch_Name: string;
  Branch_Code: string;
  Branch_Type: string;
  StateId: number;
  DistrictId: number;
  District_Name: string;
  TehsilId: number;
  Tehsil_Name: string;
  Branch_PhoneNo: string;
  Branch_Head: string;
  Branch_ZoneId: number;
  Branch_OpeningDate: string;
  Branch_LatLong: string;
}

export type GetBranchesRequest = {
  ZoneId?: number;
  DistrictId?: number;
};