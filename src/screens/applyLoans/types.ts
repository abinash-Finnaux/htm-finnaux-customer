export type UploadedDocument = {
  key: string;
  uri: string;
  fileName: string;
  size: number;
  mime?: string;
};

export type DocumentConfig = {
  key: string;
  label: string;
  hint: string;
  required: boolean;
};

export type CustomerReference = {
  id: string;
  type: string;
  name: string;
  phone: string;
};

export type CustomerInfo = {
  fullName: string;
  mobile: string;
  email: string;
  dob: Date | null;
  gender: string;
  pan: string;
  aadhaar: string;
};

export type AccountInfo = {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifsc: string;
  accountType: string;
};

export type AssetInfo = {
  propertyOwnerName: string;
  propertyAddress: string;
  regState: string;
  regDistrict: string;
  regTehsil: string;
  regStateID: string;
  regDistrictID: string;
  regTehsilID: string;
  pincode: string;
  propertyType: string;
  natureOfProperty: string;
  ownershipDocument: string;
  ownershipType: string;
  unitOfMeasurement: string;
  totalArea: string;
  frontArea: string;
  backArea: string;
  leftArea: string;
  rightArea: string;
  constructedArea: string;
  mortgageType: string;
  mortgageSignedBy: string;
  cersaiNo: string;
  estimatedValue: string;
  latitude: string;
  longitude: string;
  propertyImage: UploadedDocument | null;
};

export type VehicleInfo = {
  condition: string;
  usage: string;
  dealer: string;
  manufacturer: string;
  vehicleCategory: string;
  modelName: string;
  variant: string;
  manufactureDate: Date | null;
  regNumber: string;
  registrationDate: Date | null;
  registrationExpiryDate: Date | null;
  roadTaxUpto: Date | null;
  fitnessUpto: Date | null;
  permitUpto: Date | null;
  fuelType: string;
  colour: string;
  vehicleCost: string;
  route: string;
  engineNumber: string;
  chassisNumber: string;
  keyNo: string;
  rcHpn: boolean;
  invoiceHpn: boolean;
  vehicleImage: UploadedDocument | null;

  exShowroom: string;
  gst: string;
  insurancePremium: string;
  tdsTcs: string;
  accessories: string;
  essentialKit: string;
  transportation: string;
  rto: string;
  earthing: string;
  others: string;
  onRoad: string;

  dealerContactPerson: string;
  dealerContactNo: string;
  quotationNo: string;
  quotationDate: Date | null;
  estimationAmount: string;
  invoiceNo: string;
  invoiceDate: Date | null;
  invoiceValue: string;
  quotationInFavorOf: string;
  remark: string;
};

export type ApplyLoanForm = {
  branchId: string;
  branchName: string;
  loanType: string;
  amount: string;
  tenure: string;
  purpose: string;
  documents: UploadedDocument[];
  monthlyIncome: string;
  employment: string;
  references: CustomerReference[];
  customerInfo: CustomerInfo;
  accountInfo: AccountInfo;
  assets: AssetInfo;
  vehicle: VehicleInfo;
};
