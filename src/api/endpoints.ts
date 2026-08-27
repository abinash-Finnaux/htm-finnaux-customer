export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    REFRESH_TOKEN: '/auth/refresh-token',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
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
