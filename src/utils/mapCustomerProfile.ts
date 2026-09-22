import type {
  CustomerAddress,
  CustomerApplication,
  CustomerDocument,
  CustomerProfile,
} from '../context/UserContext';

type RawValidateCustomer = {
  CODE?: number | string;
  Token?: string;
  Msg?: string;
  customData?: Record<string, unknown>;
  Item1?: Record<string, unknown>[];
  Item2?: Record<string, unknown>[];
  Item3?: Record<string, unknown>[];
  Item4?: Record<string, unknown>[];
  Item5?: Record<string, unknown>[];
  Item6?: Record<string, unknown>[];
  Item7?: Record<string, unknown>[];
  Item8?: Record<string, unknown>[];
  Item9?: Record<string, unknown>[];
  Item10?: Record<string, unknown>[];
};

function cleanText(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value).replace(/\r/g, '').replace(/\n/g, ' ').trim();
}

function pickString(
  source: Record<string, unknown> | undefined,
  keys: string[],
): string {
  if (!source) {
    return '';
  }
  for (const key of keys) {
    if (source[key] !== null && source[key] !== undefined) {
      return cleanText(source[key]);
    }
  }
  return '';
}

function composeAddress(address?: CustomerAddress): string {
  if (!address) {
    return '';
  }
  return [
    address.Address,
    address.LandMark,
    address.Tehsil_Name,
    address.District_Name,
    address.PinCode,
  ]
    .filter(Boolean)
    .join(', ');
}

function documentNumberByTitle(
  documents: CustomerDocument[],
  pattern: RegExp,
): string {
  for (const doc of documents) {
    const title = cleanText(doc?.Doc_Title);
    const number = cleanText(doc?.Doc_Number);
    if (number && pattern.test(title)) {
      return number;
    }
  }
  return '';
}

function extractDocumentNumber(
  documents: CustomerDocument[],
  pattern: RegExp,
): string {
  const byTitle = documentNumberByTitle(documents, pattern);
  if (byTitle) {
    return byTitle;
  }
  for (const doc of documents) {
    if (!doc || typeof doc !== 'object') {
      continue;
    }
    for (const [key, value] of Object.entries(doc)) {
      if (pattern.test(`${key} ${value}`)) {
        return cleanText(value);
      }
    }
  }
  return '';
}

function emptyToUndefined(value: string): string | undefined {
  return value ? value : undefined;
}

function numberText(value: unknown, fallback = ''): string {
  const clean = cleanText(value);
  if (!clean) {
    return fallback;
  }
  const num = Number(clean);
  if (Number.isNaN(num) || num === 0) {
    return fallback;
  }
  return clean;
}

function mapApplication(item: Record<string, unknown>): CustomerApplication {
  const loanAmount =
    numberText(item?.AssetCost) ||
    numberText(item?.NetFinance) ||
    numberText(item?.DisbursementAmt) ||
    numberText(item?.AgreementValue);

  const status =
    cleanText(item?.Status) ||
    cleanText(item?.Process_Status) ||
    cleanText(item?.Watermark_Status);

  return {
    ApplicationId: emptyToUndefined(cleanText(item?.ApplicationId)),
    ApplicationIdentity: item?.ApplicationIdentity as number | undefined,
    ApplicationNo: cleanText(item?.ApplicationNo),
    CustomerType: cleanText(item?.CustomerType),
    Branch: cleanText(item?.Branch),
    Product: cleanText(item?.Product),
    LoanAmount: loanAmount,
    Status: status,
    CreateOn:
      cleanText(item?.CreateOn) || cleanText(item?.ApplicationCreateOn),
    Total_OverDUE_EMI_Amount: cleanText(item?.Total_OverDUE_EMI_Amount),
    Balance_Principle: cleanText(item?.Balance_Principle),
    LoanAcNo: emptyToUndefined(cleanText(item?.LoanAcNo)),
    Application_Type: cleanText(item?.Application_Type),
    ProductId: item?.ProductId as number | undefined,
    ProcessId: item?.ProcessId as number | undefined,
    Next_Due_Date: cleanText(item?.Next_Due_Date),
    Next_Due_Amount: cleanText(item?.Next_Due_Amount),
    Last_Due_Date: cleanText(item?.Last_Due_Date),
    Last_Due_Amount: cleanText(item?.Last_Due_Amount),
    Last_Recv_Amount: cleanText(item?.Last_Recv_Amount),
    Loan_Id: cleanText(item?.Loan_Id),
    InquiryNo: cleanText(item?.InquiryNo),
    Process_Status: cleanText(item?.Process_Status),
    ApplicationCreateOn: cleanText(item?.ApplicationCreateOn),
    Application_CreateDate: cleanText(item?.Application_CreateDate),
    TAT_Hr: item?.TAT_Hr as number | undefined,
    Application_LoanEMIAmount: cleanText(item?.Application_LoanEMIAmount),
    Application_LoanDuration_Month: cleanText(
      item?.Application_LoanDuration_Month,
    ),
    LoanPurpose: cleanText(item?.LoanPurpose),
    Lead_Reference: emptyToUndefined(cleanText(item?.Lead_Reference)),
    AssetCost: cleanText(item?.AssetCost),
    NetFinance: cleanText(item?.NetFinance),
    Flat_Rate: cleanText(item?.Flat_Rate),
    Tenure: cleanText(item?.Tenure),
    No_Of_Instl: cleanText(item?.No_Of_Instl),
    Adv_Instl: cleanText(item?.Adv_Instl),
    ManagementFee: cleanText(item?.ManagementFee),
    DisbursementAmt: cleanText(item?.DisbursementAmt),
    AgreementValue: cleanText(item?.AgreementValue),
    InterestAmt: cleanText(item?.InterestAmt),
    EMIAmount: cleanText(item?.EMIAmount),
    Case_IRR: cleanText(item?.Case_IRR),
    Disbursement_IRR: cleanText(item?.Disbursement_IRR),
    LTV: cleanText(item?.LTV),
    Margin: cleanText(item?.Margin),
    FirstEMIDate: emptyToUndefined(cleanText(item?.FirstEMIDate)),
    Loan_Date: emptyToUndefined(cleanText(item?.Loan_Date)),
    ExpiryDate: emptyToUndefined(cleanText(item?.ExpiryDate)),
    CollectionOn: emptyToUndefined(cleanText(item?.CollectionOn)),
    CollectionMode: emptyToUndefined(cleanText(item?.CollectionMode)),
    CloseDate: emptyToUndefined(cleanText(item?.CloseDate)),
    Watermark_Status: cleanText(item?.Watermark_Status),
    LoanSegment: emptyToUndefined(cleanText(item?.LoanSegment)),
    DPD_DAYS: item?.DPD_DAYS as string | number | undefined,
    Customer: cleanText(item?.Customer),
    CustomerName: cleanText(item?.Customer),
    CustomerId: cleanText(item?.CustomerId),
  };
}

function mapAddress(item: Record<string, unknown>): CustomerAddress {
  const present = cleanText(item?.Present_Address);
  return {
    AddressId: item?.AddressId as number | undefined,
    AddressType: cleanText(item?.AddressType),
    Address: present || cleanText(item?.Address),
    LandMark: cleanText(item?.LandMark),
    Tehsil_Name: cleanText(item?.Tehsil_Name),
    District_Name: cleanText(item?.District_Name),
    PinCode: cleanText(item?.PinCode),
    AddressRentBuy: cleanText(item?.AddressRentBuy || item?.Rent_Own),
    TotalYearsOnAddress: cleanText(item?.TotalYearsOnAddress),
    IsCommunicationAddress: cleanText(item?.IsCommunicationAddress),
    Present_Address: present,
    Permanent_Address: cleanText(item?.Permanent_Address),
    Work_Address: cleanText(item?.Work_Address),
    Rent_Own: cleanText(item?.Rent_Own),
    Customer_IsFirm:
      typeof item?.Customer_IsFirm === 'boolean'
        ? item.Customer_IsFirm
        : undefined,
    Present_LatLong: cleanText(item?.Present_LatLong),
    Permanent_LatLong: cleanText(item?.Permanent_LatLong),
    Work_LatLong: cleanText(item?.Work_LatLong),
  };
}

export function mapCustomerProfile(
  response: RawValidateCustomer | null | undefined,
): CustomerProfile | null {
  if (!response || typeof response !== 'object') {
    return null;
  }

  const item1 = Array.isArray(response.Item1) ? response.Item1 : [];
  const item1First = item1[0];

  const isLoanFirst =
    item1First &&
    (Object.prototype.hasOwnProperty.call(item1First, 'Loan_Id') ||
      Object.prototype.hasOwnProperty.call(item1First, 'ApplicationNo') ||
      Object.prototype.hasOwnProperty.call(item1First, 'LoanPurpose') ||
      Object.prototype.hasOwnProperty.call(item1First, 'Process_Status'));

  let personal: Record<string, unknown> | undefined;
  let addresses: CustomerAddress[] = [];
  let documents: CustomerDocument[] = [];
  let applications: CustomerApplication[] = [];

  if (isLoanFirst) {
    // New LMS response:
    // Item1 = loans, Item2 = customer, Item3 = address, Item4 = KYC documents.
    personal = Array.isArray(response.Item2) ? response.Item2[0] : undefined;
    applications = item1.map(mapApplication);
    addresses = Array.isArray(response.Item3)
      ? response.Item3.map(mapAddress)
      : [];
    documents = Array.isArray(response.Item4) ? response.Item4 : [];
  } else {
    // Legacy response:
    // Item1 = personal, Item2 = addresses, Item3 = documents, Item4 = applications.
    personal = item1First;
    addresses = Array.isArray(response.Item2)
      ? response.Item2.map(mapAddress)
      : [];
    documents = Array.isArray(response.Item3) ? response.Item3 : [];
    applications = Array.isArray(response.Item4)
      ? response.Item4.map(mapApplication)
      : [];
  }

  const addressFirst = addresses[0];
  const genderAge = pickString(personal, ['GenderAge', 'Gender_Age']);
  const gender = genderAge.split(',')[0].trim();
  const ageMatch = genderAge.match(/\d+/);
  const relationName = pickString(personal, ['Relation_Name', 'RelationName']);
  const presentAddress =
    addressFirst?.Present_Address ||
    pickString(personal, ['Present_Address', 'PresentAddress']);
  const permanentAddress =
    addressFirst?.Permanent_Address ||
    pickString(personal, ['Permanent_Address', 'PermanentAddress']);

  return {
    CustomerId:
      pickString(personal, ['CustomerId', 'CustomerID', 'Customer_Id']) ||
      (applications[0]?.CustomerId ?? ''),
    CIF:
      pickString(personal, ['CIF_No', 'CIF']) || pickString(response, ['CIF']),
    Customer_Name:
      pickString(personal, [
        'CustomerName',
        'Customer',
        'Name',
        'Customer_Name',
      ]) || (applications[0]?.CustomerName ?? ''),
    Customer_Gender:
      gender || pickString(personal, ['Gender', 'Customer_Gender']),
    Customer_Age:
      (ageMatch ? ageMatch[0] : '') ||
      pickString(personal, ['Age', 'Customer_Age']),
    FatherName:
      pickString(personal, ['FatherName', 'Father_Name']) || relationName,
    Customer_PhoneNo: pickString(personal, [
      'PhoneNo',
      'PrimaryContact',
      'Customer_PhoneNo',
    ]),
    Customer_Email:
      pickString(personal, ['Email', 'Customer_Email', 'EmailId']) ||
      pickString(personal, ['Customer_Other_Email']),
    Customer_Other_Email: pickString(personal, ['Customer_Other_Email']),
    Customer_DOB: pickString(personal, ['Customer_DOB', 'DOB', 'DateOfBirth']),
    CreateOn: pickString(personal, ['CreateOn', 'CreatedOn']),
    Religion: pickString(personal, ['Religion']),
    Cast: pickString(personal, ['Cast', 'Caste']),
    MaritalStatus: pickString(personal, ['MaritalStatus', 'Marital_Status']),
    RelationName: relationName || pickString(personal, ['Relation_With_Hirer']),
    Occupation: pickString(personal, ['Occupation']),
    BusinessCategory: pickString(personal, ['BusinessCategory']),
    Nature_of_work: pickString(personal, ['Nature_of_work']),
    Profile: pickString(personal, ['Profile']),
    Category: pickString(personal, ['Category']),
    Sub_Category: pickString(personal, ['Sub_Category']),
    PermanentAddress:
      permanentAddress ||
      composeAddress(
        addresses.find(a =>
          /permanent|correspondence/i.test(a.AddressType ?? ''),
        ),
      ),
    PresentAddress:
      presentAddress ||
      composeAddress(
        addresses.find(a =>
          /present|current|communication/i.test(a.AddressType ?? ''),
        ),
      ),
    addresses,
    documents,
    applications,
    PAN: extractDocumentNumber(documents, /pan/i),
    Aadhaar: extractDocumentNumber(
      documents,
      /aadhaar|aadhar|uidai|aadhaar card/i,
    ),
    raw: response as Record<string, unknown>,
  };
}