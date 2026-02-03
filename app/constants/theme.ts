// NJADI AI™ Theme Constants
// Blue Wolf Forest Theme

export const COLORS = {
  // Primary colors
  primary: '#00f2ff',
  primaryDark: '#00c4cc',
  primaryLight: '#4dfaff',
  
  // Background colors
  background: '#05070a',
  backgroundLight: '#0a0f15',
  backgroundCard: '#0d1218',
  backgroundModal: '#0f1520',
  
  // Accent colors
  gold: '#FFD700',
  goldDark: '#B8860B',
  goldLight: '#FFE55C',
  
  // Text colors
  textPrimary: '#ffffff',
  textSecondary: '#a0aec0',
  textMuted: '#718096',
  
  // Status colors
  success: '#48BB78',
  error: '#F56565',
  warning: '#ED8936',
  
  // Chat colors
  userBubble: '#1a365d',
  aiBubble: '#0d1218',
  
  // Border colors
  border: '#1a2332',
  borderLight: '#2d3748',
};

export const FONTS = {
  regular: 'System',
  bold: 'System',
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 24,
    xxxl: 32,
    hero: 48,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const SHADOWS = {
  small: {
    shadowColor: '#00f2ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#00f2ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  glow: {
    shadowColor: '#00f2ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8,
  },
  goldGlow: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8,
  },
};

export const IMAGES = {
  wolfBackground: 'https://d64gsuwffb70l.cloudfront.net/698115118386392babdaca90_1770067325248_80473a56.png',
  wolfLogo: 'https://d64gsuwffb70l.cloudfront.net/698115118386392babdaca90_1770067349875_9ec836da.png',
};

export const CREATOR = {
  name: 'Ali Ould El-Njadi',
  nameArabic: 'علي ولد النجادي',
  full: 'Ali Ould El-Njadi (علي ولد النجادي)',
};

export const GREETINGS = [
  { text: 'مرحبا بيك جيت ولا جابوك؟', translation: 'Welcome! Did you come or were you brought?' },
  { text: 'تبانلي تعرفو غير صوالحكم', translation: 'Seems like you only know your own interests' },
  { text: 'نضحك معاك وش بيك تشنفت', translation: 'I\'m joking with you, why so serious?' },
];
