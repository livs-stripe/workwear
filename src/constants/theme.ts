export const colors = {
  primary: '#FF6B00', // Workwear orange
  primaryDark: '#E25F00',
  text: '#1A1A1A',
  textMuted: '#6B6B6B',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  border: '#E4E4E4',
  success: '#1E9E55',
  error: '#D93025',
  chipConnected: '#1E9E55',
  chipSearching: '#9E9E9E',
  white: '#FFFFFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
};

export const font = {
  family: undefined as string | undefined, // system sans-serif
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 28,
    xxl: 40,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};
