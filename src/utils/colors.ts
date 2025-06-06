// Centralized color palette for minimalist black & white theme with subtle accents
export const colors = {
  // Brand colors - Minimal black & white
  brand: {
    primary: '#000000', // Pure black
    primaryDark: '#000000',
    primaryLight: '#1a1a1a',
    secondary: '#ffffff', // Pure white
    secondaryDark: '#f5f5f5',
    secondaryLight: '#ffffff',
  },
  
  // Status colors - Subtle accents
  status: {
    success: '#10b981', // Green for success states
    successDark: '#059669',
    successLight: '#34d399',
    warning: '#f59e0b', // Amber for warnings (if needed)
    warningDark: '#d97706',
    warningLight: '#fbbf24',
    error: '#ef4444', // Red for errors (if needed)
    errorDark: '#dc2626',
    errorLight: '#f87171',
    info: '#000000', // Keep black for info
    infoDark: '#0a0a0a',
    infoLight: '#1a1a1a',
  },
  
  // Accent colors for UI elements
  accent: {
    green: '#10b981', // Main green accent
    greenLight: '#d1fae5',
    greenDark: '#059669',
  },
  
  // Pixel grid specific colors
  pixel: {
    sold: '#000000', // Black for sold pixels
    selected: '#000000', // Black for selected with opacity
    hover: '#666666', // Gray for hover
    available: '#f5f5f5', // Light gray for available
    gridLine: '#e5e5e5', // Very light gray grid lines
    gridLineDark: '#333333', // Dark mode grid lines
  },
  
  // Neutral colors - Grayscale
  neutral: {
    white: '#ffffff',
    black: '#000000',
    gray: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0a0a0a',
    },
  },
  
  // Theme-specific color functions
  theme: {
    light: {
      background: '#ffffff',
      foreground: '#000000',
      card: '#ffffff',
      cardForeground: '#000000',
      border: '#e5e5e5',
      muted: '#fafafa',
      mutedForeground: '#737373',
    },
    dark: {
      background: '#000000',
      foreground: '#ffffff',
      card: '#0a0a0a',
      cardForeground: '#ffffff',
      border: '#262626',
      muted: '#171717',
      mutedForeground: '#a3a3a3',
    },
  },
};

// Helper function to get color with opacity
export const withOpacity = (color: string, opacity: number): string => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// CSS variable definitions for Tailwind integration
export const cssVariables = {
  light: {
    '--primary': '0 0% 0%', // Pure black
    '--primary-foreground': '0 0% 100%', // Pure white
    '--secondary': '0 0% 96%', // Very light gray
    '--secondary-foreground': '0 0% 0%', // Black
    '--accent': '0 0% 96%', // Light gray
    '--accent-foreground': '0 0% 0%', // Black
    '--success': '142 71% 45%', // Keep green for status
    '--warning': '38 92% 50%',
    '--error': '0 84% 60%',
  },
  dark: {
    '--primary': '0 0% 100%', // Pure white in dark mode
    '--primary-foreground': '0 0% 0%', // Pure black
    '--secondary': '0 0% 15%', // Very dark gray
    '--secondary-foreground': '0 0% 100%', // White
    '--accent': '0 0% 15%', // Dark gray
    '--accent-foreground': '0 0% 100%', // White
    '--success': '142 71% 45%',
    '--warning': '38 92% 50%',
    '--error': '0 84% 60%',
  },
}; 