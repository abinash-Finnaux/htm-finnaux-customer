import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CustomerAddress = {
  AddressId?: number;
  AddressType?: string;
  Address?: string;
  LandMark?: string;
  Tehsil_Name?: string;
  District_Name?: string;
  PinCode?: string;
  AddressRentBuy?: string;
  TotalYearsOnAddress?: string;
  IsCommunicationAddress?: string;
  Present_Address?: string;
  Permanent_Address?: string;
  Work_Address?: string;
  Rent_Own?: string;
  Customer_IsFirm?: boolean;
  Present_LatLong?: string;
  Permanent_LatLong?: string;
  Work_LatLong?: string;
};

export type CustomerDocument = Record<string, unknown>;

export type CustomerApplication = {
  ApplicationId?: string;
  ApplicationIdentity?: number;
  ApplicationNo?: string;
  CustomerType?: string;
  Branch?: string;
  Product?: string;
  LoanAmount?: string;
  Status?: string;
  CreateOn?: string | null;
  Total_OverDUE_EMI_Amount?: string;
  Balance_Principle?: string;
  LoanAcNo?: string | null;
  Application_Type?: string;
  ProductId?: number;
  ProcessId?: number;
  Next_Due_Date?: string;
  Next_Due_Amount?: string;
  Last_Due_Date?: string;
  Last_Due_Amount?: string;
  Last_Recv_Amount?: string;
  Loan_Id?: string;
  InquiryNo?: string;
  Process_Status?: string | null;
  ApplicationCreateOn?: string;
  Application_CreateDate?: string;
  TAT_Hr?: number;
  Application_LoanEMIAmount?: string;
  Application_LoanDuration_Month?: string;
  LoanPurpose?: string;
  Lead_Reference?: string | null;
  AssetCost?: string;
  NetFinance?: string;
  Flat_Rate?: string;
  Tenure?: string;
  No_Of_Instl?: string;
  Adv_Instl?: string;
  ManagementFee?: string;
  DisbursementAmt?: string;
  AgreementValue?: string;
  InterestAmt?: string;
  EMIAmount?: string;
  Case_IRR?: string;
  Disbursement_IRR?: string;
  LTV?: string;
  Margin?: string;
  FirstEMIDate?: string | null;
  Loan_Date?: string | null;
  ExpiryDate?: string | null;
  CollectionOn?: string | null;
  CollectionMode?: string | null;
  CloseDate?: string | null;
  Watermark_Status?: string | null;
  LoanSegment?: string | null;
  DPD_DAYS?: string | number;
  Customer?: string;
  CustomerName?: string;
  CustomerId?: string | null;
};

export type CustomerProfile = {
  CustomerId?: number | string;
  CIF?: string;
  Customer_Name?: string;
  Customer_Gender?: string;
  Customer_Age?: string;
  FatherName?: string;
  Customer_PhoneNo?: string;
  Customer_Email?: string;
  Customer_Other_Email?: string;
  Customer_DOB?: string;
  CreateOn?: string;
  Religion?: string;
  Cast?: string;
  MaritalStatus?: string;
  RelationName?: string;
  Occupation?: string;
  BusinessCategory?: string;
  Nature_of_work?: string;
  Profile?: string;
  Category?: string;
  Sub_Category?: string;
  Customer_Cur_Address?: string;
  Customer_Per_Address?: string;
  PermanentAddress?: string;
  PresentAddress?: string;
  addresses?: CustomerAddress[];
  documents?: CustomerDocument[];
  applications?: CustomerApplication[];
  PAN?: string;
  Aadhaar?: string;
  raw?: Record<string, unknown>;
};

interface UserContextValue {
  user: CustomerProfile | null;
  setUser: (user: CustomerProfile | null) => Promise<void>;
  isLoading: boolean;
}

const USER_STORAGE_KEY = '@finnaux_user';

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(USER_STORAGE_KEY);
        console.log('rawLOGLOGLOGLGOLOG', raw);

        if (raw) {
          setUserState(JSON.parse(raw));
        }
      } catch {
        // Corrupt/absent cache - ignore
      }
      setIsLoading(false);
    })();
  }, []);

  const setUser = async (nextUser: CustomerProfile | null) => {
    setUserState(nextUser);
    if (nextUser) {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  const value = useMemo<UserContextValue>(
    () => ({ user, setUser, isLoading }),
    [user, isLoading],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export function getInitials(name?: string): string {
  const trimmed = (name || '').trim();
  if (!trimmed) {
    return 'CU';
  }
  const parts = trimmed.split(/\s+/).filter(Boolean);
  return (
    parts
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('') || 'CU'
  );
}
