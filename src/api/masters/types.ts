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

export type GetProductPageInfoRequest = {
  ProductId: number;
};

export type ProductPageInfo = {
  MM_Id: number;
  MM_Name: string;
  MM_Short_Name: string;
  PageOrder: number;
  ProductCategory?: number;
  ProductCategoryName?: string;
};

export interface TehsilMaster {
  Tehsil_Id: number;
  Tehsil_Name: string;
}

export interface DistrictMaster {
  District_Id: number;
  District_Name: string;
  Tehsils?: TehsilMaster[];
}

export interface StateMaster {
  State_Id: number;
  State_Name: string;
  Districts?: DistrictMaster[];
}

export type GetDistrictsRequest = {
  StateID: number;
};

export type GetTehsilsRequest = {
  DistrictId: number;
};

export type GetCommonMasterRequest = {
  Commands: string;
  Type: string;
};

export type GetCollectionExecutivesRequest = {
  Branch_Id: number;
  ProductId: number;
};

export type GetPartnerListRequest = {
  Type: string;
};

export type GetProductRequiredDocRequest = {
  ProductId: number;
};

export type ProductRequiredDoc = {
  DocId: number;
  Doc_Category: string;
  Doc_Name: string;
  Doc_Ind_NI: string | null;
  IsAlreadySelected: boolean;
  IsHMandatory: boolean;
  IsCMandatory: boolean;
  IsGMandatory: boolean;
};

export type GetDealerManufactureMapRequest = {
  Dealer_Id: number;
};

export type GetVehicleCategoriesRequest = {
  ManufactureId: number;
};

export type GetVehicleModelsRequest = {
  ManufactureId: number;
  CategoryId: number;
};

export type GetVehicleVariantsRequest = {
  ModelId: number;
};

export type GetCustomerByLoanNoRequest = {
  Loan_Id: number | string;
};