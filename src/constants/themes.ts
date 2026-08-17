import { palette } from './colors';

export interface AppTheme {
  dark: boolean;
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    background: string;
    surface: string;
    surfaceElevated: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    onPrimary: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    pill: number;
  };
  typography: {
    title: number;
    heading: number;
    body: number;
    caption: number;
    small: number;
  };
}

export const lightTheme: AppTheme = {
  dark: false,
  colors: {
    primary: palette.primary,
    primaryLight: palette.primaryLight,
    primaryDark: palette.primaryDark,
    background: palette.background,
    surface: palette.surface,
    surfaceElevated: palette.surfaceElevated,
    text: palette.text,
    textSecondary: palette.textSecondary,
    border: palette.border,
    error: palette.error,
    success: palette.success,
    warning: palette.warning,
    info: palette.info,
    onPrimary: palette.white,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radius: {
    sm: 6,
    md: 12,
    lg: 20,
    pill: 999,
  },
  typography: {
    title: 28,
    heading: 20,
    body: 16,
    caption: 14,
    small: 12,
  },
};

export const darkTheme: AppTheme = {
  dark: true,
  colors: {
    primary: palette.primaryLight,
    primaryLight: palette.primaryLight,
    primaryDark: palette.primaryDark,
    background: palette.backgroundDark,
    surface: palette.surfaceDark,
    surfaceElevated: palette.surfaceElevatedDark,
    text: palette.textDark,
    textSecondary: palette.textSecondaryDark,
    border: palette.borderDark,
    error: palette.error,
    success: palette.success,
    warning: palette.warning,
    info: palette.info,
    onPrimary: palette.white,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radius: {
    sm: 6,
    md: 12,
    lg: 20,
    pill: 999,
  },
  typography: {
    title: 28,
    heading: 20,
    body: 16,
    caption: 14,
    small: 12,
  },
};
