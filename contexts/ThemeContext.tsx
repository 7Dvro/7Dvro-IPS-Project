import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

export interface Theme {
  id: string;
  name: string;
  type: 'dark' | 'light';
  colors: {
    bgApp: string;
    bgSidebar: string;
    bgCard: string;
    bgInput: string;
    textMain: string;
    textMuted: string;
    accent: string;
    accentGlow: string; // For shadows
    border: string;
    chartColors: string[];
  };
}

const themes: Theme[] = [
  {
    id: 'cyber-blue',
    name: 'Cyber Blue',
    type: 'dark',
    colors: {
      bgApp: '#0f172a', // Slate 950
      bgSidebar: '#020617', // Slate 950 darker
      bgCard: '#1e293b', // Slate 800
      bgInput: '#0f172a',
      textMain: '#f1f5f9', // Slate 100
      textMuted: '#94a3b8', // Slate 400
      accent: '#3b82f6', // Blue 500
      accentGlow: 'rgba(59, 130, 246, 0.5)',
      border: '#334155', // Slate 700
      chartColors: ['#3b82f6', '#06b6d4', '#8b5cf6', '#f43f5e', '#10b981'],
    },
  },
  {
    id: 'matrix-green',
    name: 'Matrix Ops',
    type: 'dark',
    colors: {
      bgApp: '#000000',
      bgSidebar: '#051a05',
      bgCard: '#0a1f0a',
      bgInput: '#000000',
      textMain: '#e0e0e0',
      textMuted: '#4ade80',
      accent: '#22c55e', // Green 500
      accentGlow: 'rgba(34, 197, 94, 0.5)',
      border: '#14532d',
      chartColors: ['#22c55e', '#16a34a', '#86efac', '#15803d', '#4ade80'],
    },
  },
  {
    id: 'red-alert',
    name: 'Red Alert',
    type: 'dark',
    colors: {
      bgApp: '#1a0505',
      bgSidebar: '#2b0a0a',
      bgCard: '#2a0a0a',
      bgInput: '#1a0505',
      textMain: '#ffe4e6',
      textMuted: '#fca5a5',
      accent: '#ef4444', // Red 500
      accentGlow: 'rgba(239, 68, 68, 0.5)',
      border: '#7f1d1d',
      chartColors: ['#ef4444', '#b91c1c', '#f87171', '#fca5a5', '#991b1b'],
    },
  },
  {
    id: 'royal-purple',
    name: 'Royal Amethyst',
    type: 'dark',
    colors: {
      bgApp: '#1e1b4b', // Indigo 950
      bgSidebar: '#0f0c29',
      bgCard: '#2e1065', // Purple 900
      bgInput: '#0f0c29',
      textMain: '#e9d5ff',
      textMuted: '#a855f7',
      accent: '#d8b4fe', // Purple 300
      accentGlow: 'rgba(216, 180, 254, 0.5)',
      border: '#581c87',
      chartColors: ['#a855f7', '#d8b4fe', '#c084fc', '#7e22ce', '#6b21a8'],
    },
  },
  {
    id: 'solar-flare',
    name: 'Solar Flare',
    type: 'dark',
    colors: {
      bgApp: '#1c1917', // Stone 900
      bgSidebar: '#0c0a09',
      bgCard: '#292524', // Stone 800
      bgInput: '#0c0a09',
      textMain: '#fafaf9',
      textMuted: '#a8a29e',
      accent: '#f97316', // Orange 500
      accentGlow: 'rgba(249, 115, 22, 0.5)',
      border: '#44403c',
      chartColors: ['#f97316', '#fb923c', '#fdba74', '#c2410c', '#9a3412'],
    },
  },
  {
    id: 'ocean-depths',
    name: 'Ocean Depths',
    type: 'dark',
    colors: {
      bgApp: '#042f2e', // Teal 950
      bgSidebar: '#020617',
      bgCard: '#115e59', // Teal 800
      bgInput: '#042f2e',
      textMain: '#ccfbf1',
      textMuted: '#5eead4',
      accent: '#2dd4bf', // Teal 400
      accentGlow: 'rgba(45, 212, 191, 0.5)',
      border: '#134e4a',
      chartColors: ['#2dd4bf', '#14b8a6', '#0d9488', '#99f6e4', '#0f766e'],
    },
  },
  {
    id: 'midnight-neon',
    name: 'Midnight Neon',
    type: 'dark',
    colors: {
      bgApp: '#09090b', // Zinc 950
      bgSidebar: '#000000',
      bgCard: '#18181b', // Zinc 900
      bgInput: '#000000',
      textMain: '#ffffff',
      textMuted: '#71717a',
      accent: '#f472b6', // Pink 400
      accentGlow: 'rgba(244, 114, 182, 0.6)',
      border: '#27272a',
      chartColors: ['#f472b6', '#e879f9', '#22d3ee', '#facc15', '#a78bfa'],
    },
  },
  {
    id: 'corporate-light',
    name: 'Corporate Light',
    type: 'light',
    colors: {
      bgApp: '#f1f5f9', // Slate 100
      bgSidebar: '#ffffff',
      bgCard: '#ffffff',
      bgInput: '#f8fafc',
      textMain: '#0f172a', // Slate 900
      textMuted: '#64748b', // Slate 500
      accent: '#2563eb', // Blue 600
      accentGlow: 'rgba(37, 99, 235, 0.3)',
      border: '#e2e8f0', // Slate 200
      chartColors: ['#2563eb', '#0891b2', '#7c3aed', '#db2777', '#059669'],
    },
  },
  {
    id: 'slate-pro',
    name: 'Slate Pro',
    type: 'light',
    colors: {
      bgApp: '#e2e8f0', // Slate 200
      bgSidebar: '#f8fafc',
      bgCard: '#f1f5f9',
      bgInput: '#ffffff',
      textMain: '#1e293b',
      textMuted: '#475569',
      accent: '#475569', // Slate 600
      accentGlow: 'rgba(71, 85, 105, 0.3)',
      border: '#cbd5e1',
      chartColors: ['#475569', '#334155', '#64748b', '#94a3b8', '#1e293b'],
    },
  },
];

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      localStorage.setItem('scicds_theme', themeId);
    }
  };

  useEffect(() => {
    const savedThemeId = localStorage.getItem('scicds_theme');
    if (savedThemeId) {
      setTheme(savedThemeId);
    }
  }, []);

  // Inject CSS Variables
  useEffect(() => {
    const root = document.documentElement;
    const { colors } = currentTheme;
    
    root.style.setProperty('--bg-app', colors.bgApp);
    root.style.setProperty('--bg-sidebar', colors.bgSidebar);
    root.style.setProperty('--bg-card', colors.bgCard);
    root.style.setProperty('--bg-input', colors.bgInput);
    root.style.setProperty('--text-main', colors.textMain);
    root.style.setProperty('--text-muted', colors.textMuted);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--accent-glow', colors.accentGlow);
    root.style.setProperty('--border', colors.border);
    
    // Set text color for body based on theme type for scrollbars etc
    if (currentTheme.type === 'light') {
        root.style.setProperty('color-scheme', 'light');
    } else {
        root.style.setProperty('color-scheme', 'dark');
    }

  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};