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

function extractDocumentNumber(
  documents: CustomerDocument[],
  pattern: RegExp,
): string {
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

export function mapCustomerProfile(
  response: RawValidateCustomer | null | undefined,
): CustomerProfile | null {
  if (!response || typeof response !== 'object') {
    return null;
  }

  const personal = Array.isArray(response.Item1)
    ? response.Item1[0]
    : undefined;

  const addresses: CustomerAddress[] = Array.isArray(response.Item2)
    ? response.Item2.map(item => ({
        AddressId: item?.AddressId as number | undefined,
        AddressType: cleanText(item?.AddressType),
        Address: cleanText(item?.Address),
        LandMark: cleanText(item?.LandMark),
        Tehsil_Name: cleanText(item?.Tehsil_Name),
        District_Name: cleanText(item?.District_Name),
        PinCode: cleanText(item?.PinCode),
        AddressRentBuy: cleanText(item?.AddressRentBuy),
        TotalYearsOnAddress: cleanText(item?.TotalYearsOnAddress),
        IsCommunicationAddress: cleanText(item?.IsCommunicationAddress),
      }))
    : [];

  const permanent = addresses.find(address =>
    /permanent|correspondence/i.test(address.AddressType ?? ''),
  );
  const present = addresses.find(address =>
    /present|current|communication/i.test(address.AddressType ?? ''),
  );

  const documents: CustomerDocument[] = Array.isArray(response.Item3)
    ? response.Item3
    : [];

  const applications: CustomerApplication[] = Array.isArray(response.Item4)
    ? response.Item4.map(item => ({
        ApplicationId:
          item?.ApplicationId === null || item?.ApplicationId === undefined
            ? undefined
            : cleanText(item.ApplicationId),
        ApplicationIdentity: item?.ApplicationIdentity as number | undefined,
        ApplicationNo: cleanText(item?.ApplicationNo),
        CustomerType: cleanText(item?.CustomerType),
        Branch: cleanText(item?.Branch),
        Product: cleanText(item?.Product),
        LoanAmount: cleanText(item?.LoanAmount),
        Status: cleanText(item?.Status),
        CreateOn: cleanText(item?.CreateOn),
        Total_OverDUE_EMI_Amount: cleanText(item?.Total_OverDUE_EMI_Amount),
        Balance_Principle: cleanText(item?.Balance_Principle),
        LoanAcNo: cleanText(item?.LoanAcNo),
        Application_Type: cleanText(item?.Application_Type),
        ProductId: item?.ProductId as number | undefined,
        ProcessId: item?.ProcessId as number | undefined,
      }))
    : [];

  return {
    CustomerId: pickString(personal, ['CustomerId']),
    CIF:
      pickString(personal, ['CIF_No', 'CIF']) || pickString(response, ['CIF']),
    Customer_Name: pickString(personal, [
      'CustomerName',
      'Name',
      'Customer_Name',
    ]),
    Customer_Gender: pickString(personal, ['Gender', 'Customer_Gender']),
    Customer_Age: pickString(personal, ['Age']),
    FatherName: pickString(personal, ['FatherName', 'Father_Name']),
    Customer_PhoneNo: pickString(personal, [
      'PhoneNo',
      'PrimaryContact',
      'Customer_PhoneNo',
    ]),
    Customer_Email:
      pickString(personal, ['Email', 'Customer_Email']) ||
      pickString(personal, ['Customer_Other_Email']),
    Customer_Other_Email: pickString(personal, ['Customer_Other_Email']),
    Customer_DOB: pickString(personal, ['Customer_DOB', 'DOB', 'DateOfBirth']),
    CreateOn: pickString(personal, ['CreateOn', 'CreatedOn']),
    Religion: pickString(personal, ['Religion']),
    Cast: pickString(personal, ['Cast', 'Caste']),
    MaritalStatus: pickString(personal, ['MaritalStatus', 'Marital_Status']),
    RelationName: pickString(personal, ['RelationName']),
    Occupation: pickString(personal, ['Occupation']),
    BusinessCategory: pickString(personal, ['BusinessCategory']),
    Nature_of_work: pickString(personal, ['Nature_of_work']),
    Profile: pickString(personal, ['Profile']),
    Category: pickString(personal, ['Category']),
    Sub_Category: pickString(personal, ['Sub_Category']),
    PermanentAddress: composeAddress(permanent),
    PresentAddress: composeAddress(present),
    addresses,
    documents,
    applications,
    PAN: extractDocumentNumber(documents, /pan/i),
    Aadhaar: extractDocumentNumber(documents, /aadhaar|aadhar|uidai/i),
    raw: response as Record<string, unknown>,
  };
}
