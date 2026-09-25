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
};
