import React, { createContext, ReactNode, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { lightColors, darkColors } from '../../config/theme/colors';

const THEME_STORAGE_KEY = '@taskbar_theme';

interface ThemeContextType {
  theme: typeof lightColors;
  isDark: boolean;
  toggleTheme: () => Promise<void>;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);

        if (saved) {
          setIsDark(saved === 'dark');
        }
      } catch (error) {
        console.error('Error cargando tema:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newValue = !isDark;
    setIsDark(newValue);

    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newValue ? 'dark' : 'light');
    } catch (error) {
      console.error('Error guardando tema:', error);
    }
  };

  if (isLoading) return null;

  return (
    <ThemeContext.Provider
      value={{
        theme: isDark ? darkColors : lightColors,
        isDark,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};