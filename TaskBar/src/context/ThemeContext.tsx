import React, { createContext, useState, useContext, ReactNode } from 'react';

const lightTheme = {
  background: '#f8f9fa',
  card: '#ffffff',
  text: '#1a1a1a',
  textSecondary: '#6c757d',
  header: '#5d8a6e',
  border: '#e9ecef',
  fab: '#5d8a6e',
  fabText: '#ffffff',
};

const darkTheme = {
  background: '#121212',
  card: '#1e1e1e',
  text: '#f0f0f0',
  textSecondary: '#a0a0a0',
  header: '#1a2e22',
  border: '#333333',
  fab: '#4a7a5a',
  fabText: '#ffffff',
};

type Theme = typeof lightTheme;

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => setIsDark((prev) => !prev);
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
};