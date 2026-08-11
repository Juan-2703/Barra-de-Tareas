import { useContext } from 'react';
import { FontSizeContext } from '../contexts/fontsize.context';

export const useFontSize = () => {
  const context = useContext(FontSizeContext);

  if (!context) {
    throw new Error('useFontSize debe usarse dentro de FontSizeProvider');
  }

  return context;
};