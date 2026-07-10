import React, { createContext, useState, useContext, ReactNode } from 'react';

type FontSize = 'small' | 'medium' | 'large';

interface FontSizeContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

export const FontSizeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fontSize, setFontSize] = useState<FontSize>('medium');

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error('useFontSize debe usarse dentro de FontSizeProvider');
  }
  return context;
};