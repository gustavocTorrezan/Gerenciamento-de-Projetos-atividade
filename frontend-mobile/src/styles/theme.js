import { Platform } from 'react-native';

export const FONTS = {
  regular: Platform.select({
    web: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    default: 'System',
  }),
  medium: Platform.select({
    web: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    default: 'System',
  }),
  bold: Platform.select({
    web: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    default: 'System',
  }),
};

export const COLORS = {
  background: '#FAFAFA',
  surface: '#FFFFFF',
  border: '#DBDBDB',
  borderLight: '#EFEFEF',
  textPrimary: '#262626',
  textSecondary: '#737373',
  textMuted: '#8E8E8E',
  primary: '#0095F6',
  primaryHover: '#1877F2',
  danger: '#ED4956',
  inputBg: '#FAFAFA',
  pillBg: '#EFEFEF',
};
