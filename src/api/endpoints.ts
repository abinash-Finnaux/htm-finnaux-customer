export const API_ENDPOINTS = {
  MASTERS: {
    GET_PRODUCT_LIST: '/Masters/GetProductList',
    GET_BRANCHES: '/Masters/GetBranches',
    GET_PRODUCT_PAGE_INFO: '/CustomerLogin/CA_Get_ProductPage_Info',
    GET_PRODUCT_REQUIRED_DOC: '/Masters/GetProductRequiredDoc',
    GET_STATE: '/Masters/GetState',
    GET_DISTRICTS: '/Masters/GetDistricts',
    GET_TAHSIL: '/Masters/GetTahsil',
    GET_VEHICLE_DEALER_MANUFACTURE_MAP:
      '/Masters/Get_Vehicle_Dealer_Manufacture_Map',
    GET_VEHICLE_CATEGORY_FOR_DROPDOWN:
      '/Masters/GetVehicleCategoryForDropdown',
    GET_VEHICLE_MODEL_FOR_DROPDOWN: '/Masters/GetVehicleModelForDropdown',
    GET_VEHICLE_VARIANT_FOR_DROPDOWN: '/Masters/Get_VehicleVariant_For_Dropdown',
  },
  AUTH: {
    VERIFY_USER: '/CustomerLogin/ValidateCustomerCIF',
    LOGIN: '/CustomerLogin/GetCustomerLogin',

    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    CUSTOMER_DETAILS: '/LMS/Get_LMS_CustomerDetails',
  },
  LMS: {
    AMORTIZATION_CHART: '/LMS/LMS_Get_Amortization_Chart',
    LOAN_DETAILS: '/LMS/LMS_GetLoanDetails',
    COMMON_MASTER: '/LMS/LMS_Commaon_Master',
    GET_COLLECTION_EXECUTIVE: '/LMS/GetCollectionExecutive',
    GET_PARTNER_LIST: '/LMS/GET_Partner_List',
    GET_CUSTOMER_BY_LOAN_NO: '/LMS/GetCustomerByLoanNo',
    SAVE_APPLICATION: '/LMS/Save_Application',
  },
  LOANS: {
    BASE: '/loans',
    APPLY: '/loans/apply',
    DETAILS: (id: string) => `/loans/${id}`,
    SCHEDULE: (id: string) => `/loans/${id}/schedule`,
    STATEMENT: (id: string) => `/loans/${id}/statement`,
    CLOSURE: (id: string) => `/loans/${id}/closure`,
  },
  EMI: {
    DEPOSIT: '/emi/deposit',
    HISTORY: '/emi/history',
  },
  PAYMENT: {
    HISTORY: '/payment/history',
  },
} as const;
