import React, { createContext, ReactNode, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FONTSIZE_STORAGE_KEY = '@taskbar_fontsize';

export type FontSizeType = 'small' | 'medium' | 'large';

export const fontLabels: Record<FontSizeType, string> = {
  small: 'Pequeño',
  medium: 'Mediano',
  large: 'Grande',
};

interface FontSizeContextType {
  fontSize: FontSizeType;
  setFontSize: (size: FontSizeType) => Promise<void>;
  toggleFontSize: () => Promise<void>;
}

export const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

export const FontSizeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fontSize, setFontSizeState] = useState<FontSizeType>('medium');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFontSize = async () => {
      try {
        const saved = await AsyncStorage.getItem(FONTSIZE_STORAGE_KEY);

        if (saved === 'small' || saved === 'medium' || saved === 'large') {
          setFontSizeState(saved);
        }
      } catch (error) {
        console.error('Error cargando tamaño de fuente:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadFontSize();
  }, []);

  const setFontSize = async (size: FontSizeType) => {
    setFontSizeState(size);

    try {
      await AsyncStorage.setItem(FONTSIZE_STORAGE_KEY, size);
    } catch (error) {
      console.error('Error guardando tamaño de fuente:', error);
    }
  };

  const toggleFontSize = async () => {
    const sizes: FontSizeType[] = ['small', 'medium', 'large'];
    const nextIndex = (sizes.indexOf(fontSize) + 1) % sizes.length;
    await setFontSize(sizes[nextIndex]);
  };

  if (isLoading) return null;

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize, toggleFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};