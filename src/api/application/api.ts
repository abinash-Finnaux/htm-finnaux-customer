import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type {
  AccountInfo,
  ApplyLoanForm,
  AssetInfo,
  CustomerInfo,
  CustomerReference,
  UploadedDocument,
  VehicleInfo,
} from '../../screens/applyLoans/types';

const num = (value: string): number | null => {
  const text = value.trim();
  if (!text) return null;
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : null;
};

const iso = (date: Date | null): string | null => {
  if (!date) return null;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

export type SubmitCustomer = {
  Cust_Name: string;
  Mobile_No: string;
  Email_Id: string;
  Date_Of_Birth: string | null;
  Gender: string;
  PAN_No: string;
  Aadhaar_No: string;
};

export type SubmitAccount = {
  Holder_Name: string;
  Bank_Name: string;
  Account_No: number | null;
  IFSC_Code: string;
  Account_Type: string;
};

export type SubmitIncome = {
  Monthly_Income: number | null;
  Employment_Type: string;
};

export type SubmitReference = {
  Ref_Type: string;
  Ref_Name: string;
  Ref_Mobile: string;
};

export type SubmitAsset = {
  Property_Owner_Name: string;
  Property_Address: string;
  Reg_State_Id: number | null;
  Reg_State_Name: string;
  Reg_District_Id: number | null;
  Reg_District_Name: string;
  Reg_Tehsil_Id: number | null;
  Reg_Tehsil_Name: string;
  Pincode: string;
  Property_Type: string;
  Nature_Of_Property: string;
  Ownership_Document: string;
  Ownership_Type: string;
  Unit_Of_Measurement: string;
  Total_Area: number | null;
  Front_Area: number | null;
  Back_Area: number | null;
  Left_Area: number | null;
  Right_Area: number | null;
  Constructed_Area: number | null;
  Mortgage_Type: string;
  Mortgage_Signed_By: string;
  CERSAI_No: string;
  Estimated_Value: number | null;
  Latitude: number | null;
  Longitude: number | null;
  Property_Image: string | null;
};

export type SubmitVehicle = {
  Condition: string;
  Usage: string;
  Dealer_Id: number | null;
  Dealer_Name: string;
  Manufacture_Id: number | null;
  Manufacture_Name: string;
  Category_Id: number | null;
  Category_Name: string;
  Model_Id: number | null;
  Model_Name: string;
  Variant_Id: number | null;
  Variant_Name: string;
  Manufacture_Date: string | null;
  Registration_No: string;
  Registration_Date: string | null;
  Registration_Expiry_Date: string | null;
  Road_Tax_Upto: string | null;
  Fitness_Upto: string | null;
  Permit_Upto: string | null;
  Fuel_Type: string;
  Colour: string;
  Vehicle_Cost: number | null;
  Route: string;
  Engine_No: string;
  Chassis_No: string;
  Key_No: string;
  RC_HPN: boolean;
  Invoice_HPN: boolean;
  Ex_Showroom: number | null;
  GST: number | null;
  Insurance_Premium: number | null;
  TDS_TCS: number | null;
  Accessories: number | null;
  Essential_Kit: number | null;
  Transportation: number | null;
  RTO: number | null;
  Earthing: number | null;
  Others: number | null;
  On_Road_Price: number | null;
  Dealer_Contact_Person: string;
  Dealer_Contact_No: string;
  Quotation_No: string;
  Quotation_Date: string | null;
  Estimation_Amount: number | null;
  Invoice_No: string;
  Invoice_Date: string | null;
  Invoice_Value: number | null;
  Quotation_In_Favor_Of: string;
  Remark: string;
  Vehicle_Image: string | null;
};

export type SubmitDocument = {
  Doc_Key: string;
  File_Name: string;
  File_Size: number;
  ContentBase64: string;
};

export type SubmitApplicationRequest = {
  ApplicationId: number | null;
  CIF_No: string;
  Branch_Id: number | null;
  Branch_Name: string;
  Product_Id: number | null;
  Loan_Amount: number | null;
  Tenure_Months: number | null;
  Purpose: string;
  Customer: SubmitCustomer;
  Account: SubmitAccount;
  Income: SubmitIncome;
  References: SubmitReference[];
  Asset: SubmitAsset | null;
  Vehicle: SubmitVehicle | null;
  Documents: SubmitDocument[];
};

export type SaveApplicationResponse = {
  Success: boolean;
  Message: string;
  ApplicationId?: number;
};

const mapCustomer = (customer: CustomerInfo): SubmitCustomer => ({
  Cust_Name: customer.fullName,
  Mobile_No: customer.mobile,
  Email_Id: customer.email,
  Date_Of_Birth: iso(customer.dob),
  Gender: customer.gender,
  PAN_No: customer.pan,
  Aadhaar_No: customer.aadhaar,
});

const mapAccount = (account: AccountInfo): SubmitAccount => ({
  Holder_Name: account.accountHolderName,
  Bank_Name: account.bankName,
  Account_No: num(account.accountNumber),
  IFSC_Code: account.ifsc,
  Account_Type: account.accountType,
});

const mapAsset = (
  asset: AssetInfo,
  image: string | null,
): SubmitAsset | null => {
  const used = [
    asset.propertyOwnerName,
    asset.propertyAddress,
    asset.regState,
    asset.pincode,
    asset.propertyType,
  ].some(value => value.trim() !== '');
  if (!used && !image) {
    return null;
  }
  return {
    Property_Owner_Name: asset.propertyOwnerName,
    Property_Address: asset.propertyAddress,
    Reg_State_Id: num(asset.regStateID),
    Reg_State_Name: asset.regState,
    Reg_District_Id: num(asset.regDistrictID),
    Reg_District_Name: asset.regDistrict,
    Reg_Tehsil_Id: num(asset.regTehsilID),
    Reg_Tehsil_Name: asset.regTehsil,
    Pincode: asset.pincode,
    Property_Type: asset.propertyType,
    Nature_Of_Property: asset.natureOfProperty,
    Ownership_Document: asset.ownershipDocument,
    Ownership_Type: asset.ownershipType,
    Unit_Of_Measurement: asset.unitOfMeasurement,
    Total_Area: num(asset.totalArea),
    Front_Area: num(asset.frontArea),
    Back_Area: num(asset.backArea),
    Left_Area: num(asset.leftArea),
    Right_Area: num(asset.rightArea),
    Constructed_Area: num(asset.constructedArea),
    Mortgage_Type: asset.mortgageType,
    Mortgage_Signed_By: asset.mortgageSignedBy,
    CERSAI_No: asset.cersaiNo,
    Estimated_Value: num(asset.estimatedValue),
    Latitude: num(asset.latitude),
    Longitude: num(asset.longitude),
    Property_Image: image,
  };
};

const mapVehicle = (
  vehicle: VehicleInfo,
  image: string | null,
): SubmitVehicle | null => {
  const used = [vehicle.condition, vehicle.usage, vehicle.regNumber].some(
    value => value.trim() !== '',
  );
  if (!used && !image) {
    return null;
  }
  return {
    Condition: vehicle.condition,
    Usage: vehicle.usage,
    Dealer_Id: null,
    Dealer_Name: vehicle.dealer,
    Manufacture_Id: null,
    Manufacture_Name: vehicle.manufacturer,
    Category_Id: null,
    Category_Name: vehicle.vehicleCategory,
    Model_Id: null,
    Model_Name: vehicle.modelName,
    Variant_Id: null,
    Variant_Name: vehicle.variant,
    Manufacture_Date: iso(vehicle.manufactureDate),
    Registration_No: vehicle.regNumber,
    Registration_Date: iso(vehicle.registrationDate),
    Registration_Expiry_Date: iso(vehicle.registrationExpiryDate),
    Road_Tax_Upto: iso(vehicle.roadTaxUpto),
    Fitness_Upto: iso(vehicle.fitnessUpto),
    Permit_Upto: iso(vehicle.permitUpto),
    Fuel_Type: vehicle.fuelType,
    Colour: vehicle.colour,
    Vehicle_Cost: num(vehicle.vehicleCost),
    Route: vehicle.route,
    Engine_No: vehicle.engineNumber,
    Chassis_No: vehicle.chassisNumber,
    Key_No: vehicle.keyNo,
    RC_HPN: vehicle.rcHpn,
    Invoice_HPN: vehicle.invoiceHpn,
    Ex_Showroom: num(vehicle.exShowroom),
    GST: num(vehicle.gst),
    Insurance_Premium: num(vehicle.insurancePremium),
    TDS_TCS: num(vehicle.tdsTcs),
    Accessories: num(vehicle.accessories),
    Essential_Kit: num(vehicle.essentialKit),
    Transportation: num(vehicle.transportation),
    RTO: num(vehicle.rto),
    Earthing: num(vehicle.earthing),
    Others: num(vehicle.others),
    On_Road_Price: num(vehicle.onRoad),
    Dealer_Contact_Person: vehicle.dealerContactPerson,
    Dealer_Contact_No: vehicle.dealerContactNo,
    Quotation_No: vehicle.quotationNo,
    Quotation_Date: iso(vehicle.quotationDate),
    Estimation_Amount: num(vehicle.estimationAmount),
    Invoice_No: vehicle.invoiceNo,
    Invoice_Date: iso(vehicle.invoiceDate),
    Invoice_Value: num(vehicle.invoiceValue),
    Quotation_In_Favor_Of: vehicle.quotationInFavorOf,
    Remark: vehicle.remark,
    Vehicle_Image: image,
  };
};

const mapReference = (reference: CustomerReference): SubmitReference => ({
  Ref_Type: reference.type,
  Ref_Name: reference.name,
  Ref_Mobile: reference.phone,
});

const mapDocument = (
  document: UploadedDocument,
  contentBase64: string,
): SubmitDocument => ({
  Doc_Key: document.key,
  File_Name: document.fileName,
  File_Size: document.size,
  ContentBase64: contentBase64,
});

export function buildSubmitApplicationPayload(
  form: ApplyLoanForm,
  meta: {
    ApplicationId?: number;
    CIF?: string;
    contentBase64?: Record<string, string>;
  },
): SubmitApplicationRequest {
  const references = (form.references ?? []).map(mapReference);
  const documents = (form.documents ?? []).map(doc =>
    mapDocument(doc, meta.contentBase64?.[doc.key] ?? ''),
  );

  return {
    ApplicationId: meta.ApplicationId ?? null,
    CIF_No: meta.CIF ?? '',
    Branch_Id: form.branchId ? Number(form.branchId) : null,
    Branch_Name: form.branchName,
    Product_Id: form.loanType ? Number(form.loanType) : null,
    Loan_Amount: num(form.amount),
    Tenure_Months: num(form.tenure),
    Purpose: form.purpose,
    Customer: mapCustomer(form.customerInfo),
    Account: mapAccount(form.accountInfo),
    Income: {
      Monthly_Income: num(form.monthlyIncome),
      Employment_Type: form.employment,
    },
    References: references,
    Asset: mapAsset(
      form.assets,
      form.assets?.propertyImage?.uri ?? null,
    ),
    Vehicle: mapVehicle(
      form.vehicle,
      form.vehicle?.vehicleImage?.uri ?? null,
    ),
    Documents: documents,
  };
}

export async function saveApplication(
  request: SubmitApplicationRequest,
): Promise<SaveApplicationResponse> {
  const response = await apiClient.post<SaveApplicationResponse | string>(
    API_ENDPOINTS.LMS.SAVE_APPLICATION,
    request,
  );

  let data: unknown = response.data;
  if (typeof data === 'string') {
    data = JSON.parse(data);
  }

  if (data && typeof data === 'object') {
    return data as SaveApplicationResponse;
  }

  return { Success: false, Message: 'Unexpected response from server' };
}