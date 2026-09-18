export const API_ENDPOINTS = {
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
